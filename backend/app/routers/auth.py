from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi.security import OAuth2PasswordRequestForm

from app.database.database import get_db
from app.models.user import User

from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserUpdate,
    ChangePassword
)

from app.auth.hashing import (
    hash_password,
    verify_password
)

from app.auth.security import (
    create_access_token,
    get_current_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# @router.post("/login")
# def login(
#     user: UserLogin,
#     db: Session = Depends(get_db)
# ):
#     db_user = (
#         db.query(User)
#         .filter(User.email == user.email)
#         .first()
#     )

#     if db_user is None:
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid email or password"
#         )

#     if not verify_password(
#         user.password,
#         db_user.password
#     ):
#         raise HTTPException(
#             status_code=401,
#             detail="Invalid email or password"
#         )

#     access_token = create_access_token(
#         {
#             "sub": db_user.email,
#             "role": db_user.role
#         }
#     )

#     return {
#         "access_token": access_token,
#         "token_type": "bearer",
#         "user": {
#             "id": db_user.id,
#             "name": db_user.name,
#             "email": db_user.email,
#             "role": db_user.role
#         }
#     }

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role
        }
    }


@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@router.put("/me")
def update_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.name = user_data.name
    current_user.email = user_data.email

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role
        }
    }


@router.post("/change-password")
def change_password(
    passwords: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(
        passwords.old_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect"
        )

    current_user.password = hash_password(
        passwords.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }