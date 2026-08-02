export class MentorRecommendationEngine {
  async getRecommendedMentors(careerGoal: string) {
    return [
      { id: 'm-1', name: 'Arjun Mehta', role: 'Staff Engineer at Microsoft', matchScore: 98 },
      { id: 'm-2', name: 'Sneha Reddy', role: 'Product Lead at Amazon', matchScore: 94 },
    ];
  }
}
