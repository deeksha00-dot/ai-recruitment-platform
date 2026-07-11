def generate_explanation(
    matched_skills,
    missing_skills,
    keyword_score,
    semantic_score,
    final_score
):

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "keyword_score": keyword_score,
        "semantic_score": semantic_score,
        "final_score": final_score,

        "reason": (
            f"The candidate matched "
            f"{len(matched_skills)} required skills "
            f"and missed "
            f"{len(missing_skills)} skills."
        )
    }