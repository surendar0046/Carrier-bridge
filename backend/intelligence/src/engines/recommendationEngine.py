class RecommendationEngine:
    def rank_jobs(self, user_profile: dict, job_candidates: list) -> list:
        ranked = []
        user_skills = set(user_profile.get("skills", []))
        for job in job_candidates:
            job_skills = set(job.get("skills", []))
            score = len(user_skills.intersection(job_skills)) * 10
            ranked.append({**job, "score": score})
        return sorted(ranked, key=lambda x: x["score"], reverse=True)
