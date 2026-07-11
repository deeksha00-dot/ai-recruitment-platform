from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load model only once
model = SentenceTransformer("all-MiniLM-L6-v2")

def semantic_match(job_description: str, resume_text: str):

    job_embedding = model.encode(job_description)

    resume_embedding = model.encode(resume_text)

    similarity = cosine_similarity(
        [job_embedding],
        [resume_embedding]
    )

    return round(similarity[0][0] * 100, 2)