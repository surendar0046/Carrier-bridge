export interface ScoringBlendWeights {
  interestScenarioWeight: number; // default 0.60 (60%)
  aptitudeWeight: number;         // default 0.25 (25%)
  skillsTechnicalWeight: number;  // default 0.15 (15%)
}

export interface ScoringEngineConfig {
  weights: ScoringBlendWeights;
  skillGapThresholdPercent: number; // e.g. 60% threshold - below this is classified as a skill gap
  topDomainsCount: number;          // default 3
}

export const defaultScoringConfig: ScoringEngineConfig = {
  weights: {
    interestScenarioWeight: 0.60,
    aptitudeWeight: 0.25,
    skillsTechnicalWeight: 0.15,
  },
  skillGapThresholdPercent: 60,
  topDomainsCount: 3,
};
