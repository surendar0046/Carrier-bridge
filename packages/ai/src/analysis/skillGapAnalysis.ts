export class SkillGapAnalysisEngine {
  analyze(currentSkills: string[], targetRoleSkills: string[]) {
    const missing = targetRoleSkills.filter(s => !currentSkills.includes(s));
    const matched = targetRoleSkills.filter(s => currentSkills.includes(s));
    const matchPercentage = Math.round((matched.length / Math.max(1, targetRoleSkills.length)) * 100);

    return {
      matchPercentage,
      matchedSkills: matched,
      missingSkills: missing,
      recommendations: missing.map(s => `Enroll in advanced module for ${s}`),
    };
  }
}
