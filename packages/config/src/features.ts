export const features = {
  aiCopilot:       true,
  voiceInterface:  false,
  gamification:    true,
  videoCall:       false,
  offlineMode:     true,
  lowDataMode:     true,
  multiLanguage:   true,
  jobSimulation:   true,
  resumeBuilder:   true,
  mentorMatching:  true,
} as const;

export type FeatureFlag = keyof typeof features;

export function isEnabled(flag: FeatureFlag): boolean {
  return features[flag];
}
