class DecisionEngine:
    def evaluate_fit(self, user_skills: list, required_skills: list) -> float:
        if not required_skills:
            return 100.0
        matches = len(set(user_skills).intersection(set(required_skills)))
        return round((matches / len(required_skills)) * 100, 2)
