// ============================================================================
// CAREER PILOT — PERSONALIZED PATHWAY RANKING ENGINE
// Multi-objective pathway scoring, archetype classification, & personalized prioritization
// ============================================================================

import type {
  GeneratedPathway,
  PathwayArchetype,
} from '../../types/careerGraph';
import type { UserProfileState } from '../../types/profile';

export type PathwayRankingPriorityLens =
  | 'balanced'
  | 'fastest-timeline'
  | 'lowest-financial-cost'
  | 'maximum-pedigree'
  | 'work-while-learning';

export interface ScoredPathwayItem {
  pathway: GeneratedPathway;
  compositeScore: number; // 0 to 100
  timeScore: number;
  costScore: number;
  skillAlignmentScore: number;
  feasibilityScore: number;
  archetype: PathwayArchetype;
  rankingRationale: string;
}

export class PathwayRankingEngine {
  /**
   * Scores, ranks, and assigns archetypes to generated pathways based on user profile vectors.
   */
  public rankPathways(
    pathways: GeneratedPathway[],
    userProfile?: UserProfileState,
    priorityLens: PathwayRankingPriorityLens = 'balanced'
  ): ScoredPathwayItem[] {
    const userRunway = userProfile?.intelligenceProfile?.constraints?.financialRunwayMonths ?? 12;
    const userEdu = userProfile?.intelligenceProfile?.constraints?.educationBaseline ?? 'Bachelor’s Degree';

    const scored = pathways.map((pathway) => {
      // 1. Time Score (Shorter is higher, normalized to 60 months)
      const timeScore = Math.max(10, Math.min(100, Math.round(100 - (pathway.totalDurationMonths / 60) * 80)));

      // 2. Cost Score (Lower is higher, normalized to $80k)
      const avgCost = (pathway.estimatedCostRangeUsd.min + pathway.estimatedCostRangeUsd.max) / 2;
      const costScore = Math.max(10, Math.min(100, Math.round(100 - (avgCost / 80000) * 85)));

      // 3. Skill Alignment Score
      const skillAlignmentScore = pathway.category === 'skill-based-pathway' || pathway.category === 'direct-pathway' ? 85 : 75;

      // 4. Feasibility Score
      let feasibility = pathway.feasibilityScore;
      if (userRunway < 4 && pathway.estimatedCostRangeUsd.max > 20000) {
        feasibility = Math.max(20, feasibility - 25);
      }
      if (userEdu.toLowerCase().includes('high school') && pathway.category === 'direct-pathway' && pathway.totalDurationMonths > 40) {
        feasibility = Math.max(30, feasibility - 15);
      }

      // 5. Composite Score under Priority Lens
      let compositeScore = 75;
      let rankingRationale = '';

      switch (priorityLens) {
        case 'fastest-timeline':
          compositeScore = Math.round(timeScore * 0.5 + feasibility * 0.3 + costScore * 0.2);
          rankingRationale = `Optimized for fastest route (${pathway.totalDurationMonths} months total preparation).`;
          break;

        case 'lowest-financial-cost':
          compositeScore = Math.round(costScore * 0.55 + feasibility * 0.25 + timeScore * 0.2);
          rankingRationale = `Prioritizes low out-of-pocket costs ($${pathway.estimatedCostRangeUsd.min}–$${pathway.estimatedCostRangeUsd.max} USD).`;
          break;

        case 'maximum-pedigree':
          const isAccreditedDegree = pathway.category === 'direct-pathway' || pathway.category === 'interdisciplinary';
          compositeScore = isAccreditedDegree ? 92 : 70;
          rankingRationale = 'Evaluated on academic accreditation and global institutional recognition.';
          break;

        case 'work-while-learning':
          const isEarnLearn = pathway.category === 'earn-while-learning' || pathway.category === 'bridge-career';
          compositeScore = isEarnLearn ? 94 : 65;
          rankingRationale = 'Preserves active income cashflow throughout training.';
          break;

        case 'balanced':
        default:
          compositeScore = Math.round(
            feasibility * 0.35 +
            timeScore * 0.25 +
            costScore * 0.2 +
            skillAlignmentScore * 0.2
          );
          rankingRationale = 'Balanced trade-off between speed, credential rigor, and financial feasibility.';
          break;
      }

      return {
        pathway,
        compositeScore,
        timeScore,
        costScore,
        skillAlignmentScore,
        feasibilityScore: feasibility,
        archetype: pathway.archetype,
        rankingRationale,
      };
    });

    // Sort descending by composite score
    return scored.sort((a, b) => b.compositeScore - a.compositeScore);
  }
}

export const pathwayRankingEngine = new PathwayRankingEngine();
