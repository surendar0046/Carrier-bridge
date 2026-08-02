class JobRecommendationService:
    def get_top_matches(self, user_id: str) -> list:
        return [
          {"id": "job-1", "title": "Senior Full Stack Engineer", "company": "TechCorp", "match": 98},
          {"id": "job-2", "title": "AI Platform Lead", "company": "Niral Systems", "match": 94}
        ]
