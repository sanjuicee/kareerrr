// ============================================================================
// CAREER PILOT — CAREER COMPARISON ENGINE
// Multi-vector side-by-side technical trade-off evaluation & priority simulation
// ============================================================================

import type { OccupationRecord, CareerMatchResult } from '../../types/occupation';
import type { PersonalIntelligenceProfile } from '../../types/profileIntelligence';
import { CareerMatchingEngine } from './careerMatchingEngine';

export type ComparisonPriorityLens =
  | 'balanced'
  | 'maximize-compensation'
  | 'maximize-autonomy'
  | 'maximize-remote'
  | 'low-barrier-entry'
  | 'maximize-values';

export interface DimensionalDifference {
  dimension: string;
  label: string;
  values: Record<string, number | string>; // occupationId -> value
  winnerOccupationId?: string;
  notes: string;
}

export interface TradeOffInsight {
  occupationId: string;
  occupationTitle: string;
  coreAdvantage: string;
  costOrSacrifice: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface PriorityLensScore {
  occupationId: string;
  rank: number;
  simulatedScore: number;
  lensRationale: string;
}

export interface MultiCareerComparisonReport {
  occupations: OccupationRecord[];
  matchResults?: Record<string, CareerMatchResult>;
  dimensionalDifferences: DimensionalDifference[];
  compensationComparison: {
    us: Record<string, { entry: number; median: number; top: number; currency: string }>;
    eu?: Record<string, { entry: number; median: number; top: number; currency: string }>;
    india?: Record<string, { entry: number; median: number; top: number; currency: string }>;
  };
  workCharacteristicsMatrix: {
    autonomy: Record<string, string>;
    remoteViability: Record<string, string>;
    collaborationLevel: Record<string, string>;
    preparationYears: Record<string, number>;
    minimumEducation: Record<string, string>;
  };
  tradeOffInsights: TradeOffInsight[];
  priorityLensRankings: Record<ComparisonPriorityLens, PriorityLensScore[]>;
}

export class CareerComparisonEngine {
  private matchingEngine: CareerMatchingEngine;

  constructor(matchingEngine: CareerMatchingEngine = new CareerMatchingEngine()) {
    this.matchingEngine = matchingEngine;
  }

  /**
   * Compares 2 to 3 occupations side-by-side with dimensional deltas,
   * compensation envelopes, trade-off matrices, and priority simulation.
   */
  public compareOccupations(
    occupations: OccupationRecord[],
    profile?: PersonalIntelligenceProfile
  ): MultiCareerComparisonReport {
    if (occupations.length < 2) {
      throw new Error('Comparison requires at least 2 occupations.');
    }
    if (occupations.length > 3) {
      throw new Error('Comparison is capped at 3 occupations for rigorous technical evaluation.');
    }

    // 1. Evaluate match results if profile is supplied
    const matchResults: Record<string, CareerMatchResult> = {};
    if (profile) {
      occupations.forEach((occ) => {
        matchResults[occ.id] = this.matchingEngine.evaluateSingleOccupation(profile, occ);
      });
    }

    // 2. Evaluate Dimensional Differences
    const dimensionalDifferences = this.computeDimensionalDifferences(occupations, matchResults);

    // 3. Compensation Comparison
    const compensationComparison = this.computeCompensationComparison(occupations);

    // 4. Work Characteristics Matrix
    const workCharacteristicsMatrix = this.computeWorkCharacteristics(occupations);

    // 5. Trade-off Insights
    const tradeOffInsights = this.computeTradeOffInsights(occupations);

    // 6. Priority Lens Simulation
    const priorityLensRankings = this.computePriorityLensRankings(occupations, matchResults);

    return {
      occupations,
      matchResults: Object.keys(matchResults).length > 0 ? matchResults : undefined,
      dimensionalDifferences,
      compensationComparison,
      workCharacteristicsMatrix,
      tradeOffInsights,
      priorityLensRankings,
    };
  }

  private computeDimensionalDifferences(
    occupations: OccupationRecord[],
    matchResults: Record<string, CareerMatchResult>
  ): DimensionalDifference[] {
    const diffs: DimensionalDifference[] = [];

    // If profile scores exist, compute profile dimensional deltas
    if (Object.keys(matchResults).length > 0) {
      const dimensions = [
        { key: 'interestIntelligence', label: 'Interest Alignment' },
        { key: 'abilityIntelligence', label: 'Aptitude Alignment' },
        { key: 'skillsIntelligence', label: 'Skills Transferability' },
        { key: 'workStyleIntelligence', label: 'Work Style Match' },
        { key: 'valuesIntelligence', label: 'Values & Motivation' },
        { key: 'practicalFeasibility', label: 'Practical Feasibility' },
      ];

      dimensions.forEach((dim) => {
        const values: Record<string, number> = {};
        let highestScore = -1;
        let winnerId: string | undefined = undefined;

        occupations.forEach((occ) => {
          const match = matchResults[occ.id];
          const dimScore = match?.dimensionScores.find((d) => d.dimensionKey === dim.key)?.score || 50;
          values[occ.id] = dimScore;
          if (dimScore > highestScore) {
            highestScore = dimScore;
            winnerId = occ.id;
          }
        });

        diffs.push({
          dimension: dim.key,
          label: dim.label,
          values,
          winnerOccupationId: winnerId,
          notes: `Score difference between highest and lowest is ${Math.abs(
            Math.max(...Object.values(values)) - Math.min(...Object.values(values))
          )}% points.`,
        });
      });
    }

    return diffs;
  }

  private computeCompensationComparison(occupations: OccupationRecord[]) {
    const us: Record<string, { entry: number; median: number; top: number; currency: string }> = {};
    const eu: Record<string, { entry: number; median: number; top: number; currency: string }> = {};
    const india: Record<string, { entry: number; median: number; top: number; currency: string }> = {};

    occupations.forEach((occ) => {
      // US BLS / Global base
      us[occ.id] = {
        entry: occ.salaryBand.entryUsd,
        median: occ.salaryBand.medianUsd,
        top: occ.salaryBand.topDecileUsd,
        currency: 'USD',
      };

      // EU regional profile
      const euProfile = occ.geographicApplicability.regionalProfiles?.EU;
      if (euProfile?.salaryBand) {
        eu[occ.id] = {
          entry: euProfile.salaryBand.entry,
          median: euProfile.salaryBand.median,
          top: euProfile.salaryBand.top,
          currency: euProfile.salaryBand.currency,
        };
      } else {
        // approximate standard conversion if profile missing
        eu[occ.id] = {
          entry: Math.round(occ.salaryBand.entryUsd * 0.92),
          median: Math.round(occ.salaryBand.medianUsd * 0.92),
          top: Math.round(occ.salaryBand.topDecileUsd * 0.92),
          currency: 'EUR',
        };
      }

      // India regional profile
      const inProfile = occ.geographicApplicability.regionalProfiles?.India;
      if (inProfile?.salaryBand) {
        india[occ.id] = {
          entry: inProfile.salaryBand.entry,
          median: inProfile.salaryBand.median,
          top: inProfile.salaryBand.top,
          currency: inProfile.salaryBand.currency,
        };
      } else {
        // approximate standard conversion (INR LPA)
        india[occ.id] = {
          entry: 900000,
          median: 2200000,
          top: 4800000,
          currency: 'INR',
        };
      }
    });

    return { us, eu, india };
  }

  private computeWorkCharacteristics(occupations: OccupationRecord[]) {
    const autonomy: Record<string, string> = {};
    const remoteViability: Record<string, string> = {};
    const collaborationLevel: Record<string, string> = {};
    const preparationYears: Record<string, number> = {};
    const minimumEducation: Record<string, string> = {};

    occupations.forEach((occ) => {
      autonomy[occ.id] = occ.typicalAutonomy;
      remoteViability[occ.id] = occ.workEnvironments.remoteViability;
      collaborationLevel[occ.id] = occ.collaborationLevel;

      // Preparation years
      const minPathway = occ.qualificationPathways.find((p) => p.isMinimumRequirement) || occ.qualificationPathways[0];
      preparationYears[occ.id] = minPathway ? minPathway.typicalPreparationYears : 3;
      minimumEducation[occ.id] = minPathway ? minPathway.level : 'Bachelor’s Degree';
    });

    return {
      autonomy,
      remoteViability,
      collaborationLevel,
      preparationYears,
      minimumEducation,
    };
  }

  private computeTradeOffInsights(occupations: OccupationRecord[]): TradeOffInsight[] {
    return occupations.map((occ) => {
      const topTradeOff = occ.keyTradeOffs[0];
      return {
        occupationId: occ.id,
        occupationTitle: occ.title,
        coreAdvantage: topTradeOff
          ? topTradeOff.positive
          : `High specialization in ${occ.family} with strong institutional recognition.`,
        costOrSacrifice: topTradeOff
          ? topTradeOff.negativeOrCost
          : `Requires sustained focus and mastery of complex technical domains.`,
        severity: topTradeOff ? topTradeOff.severity : 'moderate',
      };
    });
  }

  private computePriorityLensRankings(
    occupations: OccupationRecord[],
    matchResults: Record<string, CareerMatchResult>
  ): Record<ComparisonPriorityLens, PriorityLensScore[]> {
    const lenses: ComparisonPriorityLens[] = [
      'balanced',
      'maximize-compensation',
      'maximize-autonomy',
      'maximize-remote',
      'low-barrier-entry',
      'maximize-values',
    ];

    const results: Record<ComparisonPriorityLens, PriorityLensScore[]> = {
      balanced: [],
      'maximize-compensation': [],
      'maximize-autonomy': [],
      'maximize-remote': [],
      'low-barrier-entry': [],
      'maximize-values': [],
    };

    lenses.forEach((lens) => {
      const scoredList = occupations.map((occ) => {
        const match = matchResults[occ.id];
        let simulatedScore = match ? match.overallCompatibility : 75;
        let rationale = '';

        switch (lens) {
          case 'balanced':
            rationale = `Evaluated with baseline 6-dimensional weighting.`;
            break;

          case 'maximize-compensation': {
            // Reward high median compensation ($200k+ = boost, under $100k = lower)
            const compRatio = Math.min(1.2, occ.salaryBand.medianUsd / 180000);
            simulatedScore = Math.round(simulatedScore * 0.6 + compRatio * 100 * 0.4);
            rationale = `Scaled for high earning potential ($${Math.round(occ.salaryBand.medianUsd / 1000)}k USD median).`;
            break;
          }

          case 'maximize-autonomy': {
            const autonomyBonus = occ.typicalAutonomy === 'high' ? 20 : occ.typicalAutonomy === 'moderate' ? 5 : -10;
            simulatedScore = Math.min(100, Math.max(20, simulatedScore + autonomyBonus));
            rationale = `Weighted toward ${occ.typicalAutonomy} autonomy and independent pacing.`;
            break;
          }

          case 'maximize-remote': {
            const remoteBonus =
              occ.workEnvironments.remoteViability === 'high'
                ? 25
                : occ.workEnvironments.remoteViability === 'medium'
                ? 10
                : -25;
            simulatedScore = Math.min(100, Math.max(20, simulatedScore + remoteBonus));
            rationale = `Adjusted for ${occ.workEnvironments.remoteViability} remote viability.`;
            break;
          }

          case 'low-barrier-entry': {
            const minPathway = occ.qualificationPathways.find((p) => p.isMinimumRequirement) || occ.qualificationPathways[0];
            const years = minPathway ? minPathway.typicalPreparationYears : 4;
            // Less years = higher score
            const prepPenalty = years * 5;
            simulatedScore = Math.min(100, Math.max(20, 100 - prepPenalty));
            rationale = `Evaluated on time-to-entry (${years} years typical preparation).`;
            break;
          }

          case 'maximize-values': {
            const valScore = match?.dimensionScores.find((d) => d.dimensionKey === 'valuesIntelligence')?.score || 75;
            simulatedScore = Math.round(simulatedScore * 0.4 + valScore * 0.6);
            rationale = `Emphasizes alignment with personal motivations and human impact.`;
            break;
          }
        }

        return {
          occupationId: occ.id,
          simulatedScore,
          lensRationale: rationale,
        };
      });

      // Sort descending
      scoredList.sort((a, b) => b.simulatedScore - a.simulatedScore);

      results[lens] = scoredList.map((item, index) => ({
        occupationId: item.occupationId,
        rank: index + 1,
        simulatedScore: item.simulatedScore,
        lensRationale: item.lensRationale,
      }));
    });

    return results;
  }
}

export const careerComparisonEngine = new CareerComparisonEngine();
