import re

skills_list = [
    "Python",
    "Java",
    "C",
    "C++",
    "FastAPI",
    "React",
    "PostgreSQL",
    "MySQL",
    "Docker",
    "Git",
    "JavaScript",
    "HTML",
    "CSS",
    "SQL"
]

def extract_email(text):
    email = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    return email[0] if email else None

def extract_phone(text):
    phone = re.findall(r"\+?\d[\d\s-]{8,}\d", text)
    return phone[0] if phone else None

def extract_skills(text):

    found_skills = []

    for skill in skills_list:

        if skill.lower() in text.lower():
            found_skills.append(skill)

    return found_skills

def extract_name(text):
    lines = text.split("\n")

    for line in lines:
        line = line.strip()

        if len(line.split()) >= 2 and len(line) < 40:
            return line

    return None