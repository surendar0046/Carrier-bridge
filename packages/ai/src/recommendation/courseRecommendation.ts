export class CourseRecommendationEngine {
  async getRecommendedCourses(skillGaps: string[]) {
    return [
      { id: 'c-1', title: 'Full Stack Microservices with Node & Next.js', duration: '20 Hours', priority: 'High' },
      { id: 'c-2', title: 'Deep Learning & LLM Integration', duration: '15 Hours', priority: 'Medium' },
    ];
  }
}
