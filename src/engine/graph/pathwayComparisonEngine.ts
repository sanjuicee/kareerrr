// ============================================================================
// CAREER PILOT — PATHWAY COMPARISON ENGINE
// Side-by-side multi-pathway trade-off analysis & metric evaluation
// ============================================================================

import type { GeneratedPathway } from '../../types/careerGraph';

export interface PathwayComparisonMetric {
  key: string;
  label: string;
  values: Record<string, string | number>; // pathwayId -> display value
  winnerPathwayId?: string;
  notes: string;
}

export interface PathwayComparisonReport {
  pathways: GeneratedPathway[];
  metrics: PathwayComparisonMetric[];
  tradeOffSummary: Array<{
    pathwayId: string;
    pathwayTitle: string;
    coreAdvantage: string;
    costOrSacrifice: string;
  }>;
}

export class PathwayComparisonEngine {
  public comparePathways(pathways: GeneratedPathway[]): PathwayComparisonReport {
    if (pathways.length < 2) {
      throw new Error('Comparison requires at least 2 pathways.');
    }
    if (pathways.length > 3) {
      throw new Error('Comparison is capped at 3 pathways for clear technical evaluation.');
    }

    const metrics: PathwayComparisonMetric[] = [];

    // 1. Duration Metric
    const durationValues: Record<string, number> = {};
    let minDuration = Infinity;
    let fastestId = '';
    pathways.forEach((p) => {
      durationValues[p.id] = p.totalDurationMonths;
      if (p.totalDurationMonths < minDuration) {
        minDuration = p.totalDurationMonths;
        fastestId = p.id;
      }
    });
    metrics.push({
      key: 'duration',
      label: 'Total Preparation Duration',
      values: durationValues,
      winnerPathwayId: fastestId,
      notes: `Fastest route saves ${Math.max(...Object.values(durationValues)) - minDuration} months.`,
    });

    // 2. Cost Metric (USD)
    const costValues: Record<string, string> = {};
    let lowestCost = Infinity;
    let cheapestId = '';
    pathways.forEach((p) => {
      const avg = (p.estimatedCostRangeUsd.min + p.estimatedCostRangeUsd.max) / 2;
      costValues[p.id] = `$${p.estimatedCostRangeUsd.min.toLocaleString()} – $${p.estimatedCostRangeUsd.max.toLocaleString()} USD`;
      if (avg < lowestCost) {
        lowestCost = avg;
        cheapestId = p.id;
      }
    });
    metrics.push({
      key: 'cost',
      label: 'Estimated Capital Outlay (USD)',
      values: costValues,
      winnerPathwayId: cheapestId,
      notes: 'Estimates include tuition, exam vouchers, and lab fees.',
    });

    // 3. Stage Count
    const stageValues: Record<string, number> = {};
    pathways.forEach((p) => {
      stageValues[p.id] = p.steps.length;
    });
    metrics.push({
      key: 'stages',
      label: 'Total Progression Stages',
      values: stageValues,
      notes: 'Fewer transitions reduce friction between sequential roles.',
    });

    // 4. Feasibility Score
    const feasibilityValues: Record<string, number> = {};
    let highestFeasibility = -1;
    let mostFeasibleId = '';
    pathways.forEach((p) => {
      feasibilityValues[p.id] = p.feasibilityScore;
      if (p.feasibilityScore > highestFeasibility) {
        highestFeasibility = p.feasibilityScore;
        mostFeasibleId = p.id;
      }
    });
    metrics.push({
      key: 'feasibility',
      label: 'Feasibility Index',
      values: feasibilityValues,
      winnerPathwayId: mostFeasibleId,
      notes: 'Based on prerequisite availability and transition risk.',
    });

    // 5. Risk Profile
    const riskValues: Record<string, string> = {};
    pathways.forEach((p) => {
      riskValues[p.id] = p.riskLevel;
    });
    metrics.push({
      key: 'risk',
      label: 'Execution Risk Level',
      values: riskValues,
      notes: 'Evaluates probability of institutional gating or accreditation rejection.',
    });

    // Trade-off Summaries
    const tradeOffSummary = pathways.map((p) => ({
      pathwayId: p.id,
      pathwayTitle: p.title,
      coreAdvantage: p.tradeOffSummary.primaryAdvantage,
      costOrSacrifice: p.tradeOffSummary.criticalCostOrSacrifice,
    }));

    return {
      pathways,
      metrics,
      tradeOffSummary,
    };
  }
}

export const pathwayComparisonEngine = new PathwayComparisonEngine();
