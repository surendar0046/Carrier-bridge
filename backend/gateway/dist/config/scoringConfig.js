"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultScoringConfig = void 0;
exports.defaultScoringConfig = {
    weights: {
        interestScenarioWeight: 0.60,
        aptitudeWeight: 0.25,
        skillsTechnicalWeight: 0.15,
    },
    skillGapThresholdPercent: 60,
    topDomainsCount: 3,
};
