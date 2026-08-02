class ContextEngine:
    def __init__(self):
        pass

    def build_user_context(self, user_id: str, skills: list, location: str = "Remote"):
        return {
            "user_id": user_id,
            "skills": skills,
            "location": location,
            "timestamp": "2026-07-30T14:00:00Z"
        }
