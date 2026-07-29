from app.services.embedding_service import semantic_match
from app.services.explain_service import generate_explanation


def get_matched_skills(job_skills, candidate_skills):
    """
    Returns the list of matched skills.
    """
    return list(set(job_skills) & set(candidate_skills))


def get_missing_skills(job_skills, candidate_skills):
    """
    Returns the list of missing skills.
    """
    return list(set(job_skills) - set(candidate_skills))


def calculate_match_score(job_skills, candidate_skills):
    """
    Calculates keyword-based match percentage.
    """

    matched_skills = get_matched_skills(job_skills, candidate_skills)

    if len(job_skills) == 0:
        return 0

    score = (len(matched_skills) / len(job_skills)) * 100

    return round(score, 2)


def calculate_final_score(
    job_skills,
    candidate_skills,
    job_description,
    resume_text
):
    """
    Combines keyword matching and semantic matching.
    """

    matched_skills = get_matched_skills(
        job_skills,
        candidate_skills
    )

    missing_skills = get_missing_skills(
        job_skills,
        candidate_skills
    )

    keyword_score = calculate_match_score(
        job_skills,
        candidate_skills
    )

    semantic_score = semantic_match(
        job_description,
        resume_text
    )

    # Weighted average
    final_score = round(
        (keyword_score * 0.4) +
        (semantic_score * 0.6),
        2
    )

    explanation = generate_explanation(
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        keyword_score=keyword_score,
        semantic_score=semantic_score,
        final_score=final_score
    )

    return {
    "keyword_score": keyword_score,
    "semantic_score": semantic_score,
    "final_score": final_score,
    "matched_skills": matched_skills,
    "missing_skills": missing_skills,
    "explanation": explanation,
}