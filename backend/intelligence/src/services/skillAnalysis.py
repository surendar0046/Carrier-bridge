class SkillAnalysisService:
    def identify_gaps(self, user_skills: list, target_role: str) -> list:
        required = ["System Design", "Microservices", "Docker", "Kubernetes", "TypeScript"]
        return list(set(required) - set(user_skills))
