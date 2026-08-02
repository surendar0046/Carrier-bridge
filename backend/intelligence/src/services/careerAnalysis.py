class CareerAnalysisService:
    def analyze_trajectory(self, experience_years: int, current_title: str) -> dict:
        return {
            "current_title": current_title,
            "next_logical_role": f"Principal {current_title}",
            "time_to_promotion_months": 12
        }
