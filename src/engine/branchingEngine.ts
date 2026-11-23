import type {
  AssessmentQuestion,
  AssessmentAnswer,
  PreliminaryDiscoveryReport,
  DimensionSignalState,
  DimensionStatus,
} from '../types/assessment';
import type { DimensionKey } from '../types/profile';
import { CORE_QUESTIONS, CONDITIONAL_FOLLOW_UPS } from '../data/questionBank';
import { DIMENSIONS } from '../types/profile';

/**
 * Branching Engine Rule Definitions
 */
export interface FollowUpTriggerRule {
  followUpId: string;
  anchorQuestionId: string; // Question after which this follow-up should be placed
  predicate: (answers: Record<string, AssessmentAnswer>) => boolean;
}

export const FOLLOW_UP_RULES: FollowUpTriggerRule[] = [
  {
    // A. Interest clarification: When user cannot identify clear interests
    followUpId: 'Q-FOLLOW-A',
    anchorQuestionId: 'Q02',
    predicate: (answers) => {
      const q1 = answers['Q01'];
      const q2 = answers['Q02'];
      if (!q1 && !q2) return false;
      const q1Unclear = Array.isArray(q1?.value) && q1.value.includes('unclear_interests');
      const q1Uncertain = q1?.isUncertain === true;
      const q2Uncertain = q2?.isUncertain === true;
      return q1Unclear || (q1Uncertain && q2Uncertain);
    },
  },
  {
    // B. Strength clarification: When user cannot identify natural strengths
    followUpId: 'Q-FOLLOW-B',
    anchorQuestionId: 'Q07',
    predicate: (answers) => {
      const q6 = answers['Q06'];
      const q7 = answers['Q07'];
      if (!q6 && !q7) return false;
      const q6Unclear = Array.isArray(q6?.value) && q6.value.includes('unclear_strengths');
      const q6Uncertain = q6?.isUncertain === true;
      const q7Uncertain = q7?.isUncertain === true;
      return q6Unclear || (q6Uncertain && q7Uncertain);
    },
  },
  {
    // C. Learning clarification: When user says learning depends entirely on the subject
    followUpId: 'Q-FOLLOW-C',
    anchorQuestionId: 'Q08',
    predicate: (answers) => {
      const q8 = answers['Q08'];
      return q8?.value === 'depends_on_subject';
    },
  },
  {
    // D. Experience clarification: When user reports abilities without formal venues/examples
    followUpId: 'Q-FOLLOW-D',
    anchorQuestionId: 'Q12',
    predicate: (answers) => {
      const q11 = answers['Q11'];
      const q12 = answers['Q12'];
      const q11Informal = Array.isArray(q11?.value) && q11.value.includes('self_taught_informal');
      const q12Informal = Array.isArray(q12?.value) && q12.value.includes('informal_only');
      return q11Informal || q12Informal;
    },
  },
  {
    // E. Preference conflict clarification: When two preferences appear to compete
    followUpId: 'Q-FOLLOW-E',
    anchorQuestionId: 'Q16',
    predicate: (answers) => {
      const q15 = answers['Q15']; // Proportional allocation
      const q16 = answers['Q16']; // Single choice work style
      if (q15?.value && q16?.value) {
        const peoplePct = Number(q15.value['alloc-people'] || 0);
        const isSolo = q16.value === 'autonomous_solo';
        // Allocates substantial time to people (>=35%) but desires 80%+ solitary work
        if (peoplePct >= 35 && isSolo) return true;
      }
      return false;
    },
  },
  {
    // F. Career preparation clarification: Lengthy training wanted but income needed immediately
    followUpId: 'Q-FOLLOW-F',
    anchorQuestionId: 'Q30',
    predicate: (answers) => {
      const q28 = answers['Q28']; // Training willingness
      const q30 = answers['Q30']; // Income urgency
      if (!q28 || !q30) return false;
      const desiresDegree =
        q28.value === 'formal_degree_program' || q28.value === 'multi_year_doctorate';
      const needsImmediateIncome =
        q30.value === 'immediate_0_3m' || q30.value === 'short_3_6m';
      return desiresDegree && needsImmediateIncome;
    },
  },
];

/**
 * Evaluates the active queue of questions based on current user answers.
 * Guarantees:
 * 1. Contains all 34 core questions in correct sequence.
 * 2. Injects any triggered follow-up questions at their designated anchor points.
 * 3. Never produces duplicate follow-ups.
 * 4. Total queue length never exceeds 40 questions.
 */
export function evaluateActiveQuestions(
  answers: Record<string, AssessmentAnswer>
): AssessmentQuestion[] {
  const followUpMap = new Map<string, AssessmentQuestion>();
  CONDITIONAL_FOLLOW_UPS.forEach((q) => followUpMap.set(q.id, q));

  // Determine which follow-ups are triggered
  const triggeredFollowUpIds = new Set<string>();
  for (const rule of FOLLOW_UP_RULES) {
    if (rule.predicate(answers)) {
      triggeredFollowUpIds.add(rule.followUpId);
    }
  }

  // Build the unified queue
  const queue: AssessmentQuestion[] = [];
  const insertedFollowUpIds = new Set<string>();

  for (const coreQ of CORE_QUESTIONS) {
    queue.push(coreQ);

    // Check if any triggered follow-up has this core question as its anchor
    for (const rule of FOLLOW_UP_RULES) {
      if (
        rule.anchorQuestionId === coreQ.id &&
        triggeredFollowUpIds.has(rule.followUpId) &&
        !insertedFollowUpIds.has(rule.followUpId)
      ) {
        const followUpQ = followUpMap.get(rule.followUpId);
        if (followUpQ) {
          queue.push(followUpQ);
          insertedFollowUpIds.add(rule.followUpId);
        }
      }
    }
  }

  // Strict invariant: Maximum total questions <= 40
  return queue.slice(0, 40);
}

/**
 * Calculates global uncertainty quotient (0 to 100%).
 * Decreases as high-signal answers are provided; increases if uncertainty flags or conflicting answers occur.
 */
export function calculateOverallUncertainty(
  answers: Record<string, AssessmentAnswer>
): number {
  const answeredCount = Object.keys(answers).length;
  if (answeredCount === 0) return 85;

  let baseUncertainty = Math.max(10, 85 - answeredCount * 2.2);

  // Add penalty for explicitly flagged uncertain answers
  let uncertainAnswersCount = 0;
  for (const ans of Object.values(answers)) {
    if (ans.isUncertain) {
      uncertainAnswersCount += 1;
    }
  }

  const adjusted = Math.min(95, Math.round(baseUncertainty + uncertainAnswersCount * 4.5));
  return Math.max(8, adjusted);
}

/**
 * Analyzes answered questions by dimension and assigns qualitative telemetry statuses:
 * - 'unstarted'
 * - 'exploring'
 * - 'emerging'
 * - 'supported'
 * - 'needs-information'
 */
export function computeDimensionSignals(
  answers: Record<string, AssessmentAnswer>
): Record<DimensionKey, DimensionSignalState> {
  const dimensionKeys = Object.keys(DIMENSIONS) as DimensionKey[];
  const result = {} as Record<DimensionKey, DimensionSignalState>;

  for (const dim of dimensionKeys) {
    const meta = DIMENSIONS[dim];
    const coreDimQuestions = CORE_QUESTIONS.filter((q) => q.dimension === dim);
    const coreTotal = coreDimQuestions.length;

    let coreAnswered = 0;
    let followUpsAnswered = 0;
    let uncertainCount = 0;
    const highlights: string[] = [];

    for (const q of coreDimQuestions) {
      const ans = answers[q.id];
      if (ans && ans.value !== undefined) {
        coreAnswered += 1;
        if (ans.isUncertain) uncertainCount += 1;

        // Extract meaningful highlight text
        if (Array.isArray(ans.value)) {
          ans.value.forEach((v) => {
            const opt = q.options?.find((o) => o.value === v);
            if (opt) highlights.push(opt.label);
          });
        } else if (typeof ans.value === 'string' && ans.value.length > 0) {
          const opt = q.options?.find((o) => o.value === ans.value);
          if (opt) {
            highlights.push(opt.label);
          } else if (q.format === 'short-text') {
            highlights.push(`Self-reflection: "${ans.value.slice(0, 60)}..."`);
          }
        }
      }
    }

    // Check answered follow-ups for this dimension
    const followUpsForDim = CONDITIONAL_FOLLOW_UPS.filter((q) => q.dimension === dim);
    for (const f of followUpsForDim) {
      if (answers[f.id]) {
        followUpsAnswered += 1;
      }
    }

    // Determine status
    let status: DimensionStatus = 'unstarted';
    if (coreAnswered === 0) {
      status = 'unstarted';
    } else if (uncertainCount > 0 && coreAnswered >= 2) {
      status = 'needs-information';
    } else if (coreAnswered === coreTotal) {
      status = 'supported';
    } else if (coreAnswered >= Math.ceil(coreTotal / 2)) {
      status = 'emerging';
    } else {
      status = 'exploring';
    }

    const uncertaintyRating =
      coreAnswered === 0
        ? 90
        : Math.max(10, Math.round(80 - (coreAnswered / coreTotal) * 60 + uncertainCount * 15));

    result[dim] = {
      dimension: dim,
      label: meta.label,
      code: meta.code,
      status,
      coreQuestionsAnswered: coreAnswered,
      totalCoreQuestions: coreTotal,
      followUpsAnswered,
      uncertaintyRating,
      extractedHighlights: highlights.slice(0, 4),
    };
  }

  return result;
}

/**
 * Generates the Preliminary Discovery Report based on all recorded answers.
 * Distinguishes between self-reported strengths, demonstrated abilities,
 * stated interests, work preferences, and personal constraints.
 */
export function generateDiscoverySummary(
  answers: Record<string, AssessmentAnswer>
): PreliminaryDiscoveryReport {
  const dimensionSignals = computeDimensionSignals(answers);
  const totalAnswered = Object.keys(answers).length;
  const activeQuestions = evaluateActiveQuestions(answers);
  const globalUncertaintyScore = calculateOverallUncertainty(answers);

  const mainInterests: string[] = [];
  const selfReportedStrengths: string[] = [];
  const demonstratedAbilities: string[] = [];
  const workPreferences: string[] = [];
  const careerValues: string[] = [];
  const preferredEnvironments: string[] = [];
  let educationalBackground = 'Not yet specified';
  const geographicConstraints: string[] = [];
  const financialConstraints: string[] = [];
  const learningPreferences: string[] = [];
  const futureAmbitions: string[] = [];
  const uncertainAreas: string[] = [];
  const contextDependentPreferences: string[] = [];

  // Extract Interests (Q01, Q02, Q03, Q04, Q05, Q-FOLLOW-A)
  const q1 = answers['Q01'];
  if (q1?.value && Array.isArray(q1.value)) {
    q1.value.forEach((v) => {
      const opt = CORE_QUESTIONS.find((q) => q.id === 'Q01')?.options?.find((o) => o.value === v);
      if (opt && v !== 'unclear_interests') mainInterests.push(opt.label);
    });
  }
  const q2 = answers['Q02'];
  if (q2?.value && Array.isArray(q2.value)) {
    q2.value.forEach((v) => {
      const opt = CORE_QUESTIONS.find((q) => q.id === 'Q02')?.options?.find((o) => o.value === v);
      if (opt) mainInterests.push(opt.label);
    });
  }
  if (answers['Q-FOLLOW-A']?.value) {
    mainInterests.push(`Latent flow state: "${answers['Q-FOLLOW-A'].value}"`);
  }

  // Extract Strengths (Q06, Q07, Q09, Q-FOLLOW-B)
  const q6 = answers['Q06'];
  if (q6?.value && Array.isArray(q6.value)) {
    q6.value.forEach((v) => {
      const opt = CORE_QUESTIONS.find((q) => q.id === 'Q06')?.options?.find((o) => o.value === v);
      if (opt && v !== 'unclear_strengths') selfReportedStrengths.push(opt.label);
    });
  }
  const q7 = answers['Q07'];
  if (q7?.value && Array.isArray(q7.value)) {
    q7.value.forEach((v) => {
      const opt = CORE_QUESTIONS.find((q) => q.id === 'Q07')?.options?.find((o) => o.value === v);
      if (opt) selfReportedStrengths.push(opt.label);
    });
  }

  // Extract Demonstrated Abilities (Q11, Q12, Q13, Q-FOLLOW-D)
  const q11 = answers['Q11'];
  if (q11?.value && Array.isArray(q11.value)) {
    q11.value.forEach((v) => {
      const opt = CORE_QUESTIONS.find((q) => q.id === 'Q11')?.options?.find((o) => o.value === v);
      if (opt && v !== 'self_taught_informal') demonstratedAbilities.push(opt.label);
    });
  }
  const q12 = answers['Q12'];
  if (q12?.value && Array.isArray(q12.value)) {
    q12.value.forEach((v) => {
      const opt = CORE_QUESTIONS.find((q) => q.id === 'Q12')?.options?.find((o) => o.value === v);
      if (opt && v !== 'informal_only') demonstratedAbilities.push(`Operational venue: ${opt.label}`);
    });
  }
  if (answers['Q13']?.value) {
    demonstratedAbilities.push(`Key accomplishment: "${answers['Q13'].value}"`);
  }

  // Extract Work Preferences (Q15, Q16, Q17, Q18)
  const q15 = answers['Q15'];
  if (q15?.value && typeof q15.value === 'object') {
    const topDomains = Object.entries(q15.value)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 2)
      .map(([k, pct]) => `${k.replace('alloc-', '').toUpperCase()} (${pct}%)`);
    workPreferences.push(`Primary domain allocations: ${topDomains.join(', ')}`);
  }
  const q16 = answers['Q16'];
  if (q16?.value) {
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q16')?.options?.find((o) => o.value === q16.value);
    if (opt) workPreferences.push(opt.label);
  }
  const q17 = answers['Q17'];
  if (typeof q17?.value === 'number') {
    workPreferences.push(
      q17.value > 50
        ? `Autonomy preference: High Discretion (${q17.value}%)`
        : `Structure preference: Clear SOPs & Guidelines (${100 - q17.value}%)`
    );
  }

  // Extract Career Values (Q19, Q20, Q21)
  const q19 = answers['Q19'];
  if (Array.isArray(q19?.value) && q19.value.length > 0) {
    const topValueId = q19.value[0];
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q19')?.options?.find((o) => o.id === topValueId);
    if (opt) careerValues.push(`Primary Value: ${opt.label}`);
  }
  const q21 = answers['Q21'];
  if (q21?.value) {
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q21')?.options?.find((o) => o.value === q21.value);
    if (opt) careerValues.push(opt.label);
  }

  // Extract Environments (Q23, Q24, Q25)
  const q23 = answers['Q23'];
  if (q23?.value) {
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q23')?.options?.find((o) => o.value === q23.value);
    if (opt) preferredEnvironments.push(opt.label);
  }
  const q24 = answers['Q24'];
  if (typeof q24?.value === 'number') {
    preferredEnvironments.push(
      q24.value > 60
        ? 'High collaborative social density'
        : q24.value < 40
        ? 'Solitary, deep-work environment'
        : 'Balanced interpersonal contact'
    );
  }

  // Education (Q26, Q28, Q-FOLLOW-F)
  const q26 = answers['Q26'];
  if (q26?.value && typeof q26.value === 'object') {
    educationalBackground = `${q26.value.highestLevel || 'Unspecified'} — ${
      q26.value.primaryField || 'General'
    }`;
  }
  const q28 = answers['Q28'];
  if (q28?.value) {
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q28')?.options?.find((o) => o.value === q28.value);
    if (opt) learningPreferences.push(opt.label);
  }
  const q8 = answers['Q08'];
  if (q8?.value) {
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q08')?.options?.find((o) => o.value === q8.value);
    if (opt) learningPreferences.push(opt.label);
  }

  // Constraints (Q29, Q30, Q31)
  const q29 = answers['Q29'];
  if (Array.isArray(q29?.value)) {
    q29.value.forEach((v) => {
      const opt = CORE_QUESTIONS.find((q) => q.id === 'Q29')?.options?.find((o) => o.value === v);
      if (opt) geographicConstraints.push(opt.label);
    });
  }
  const q30 = answers['Q30'];
  if (q30?.value) {
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q30')?.options?.find((o) => o.value === q30.value);
    if (opt) financialConstraints.push(`Income runway requirement: ${opt.label}`);
  }

  // Ambitions (Q32, Q33, Q34)
  const q32 = answers['Q32'];
  if (q32?.value) {
    const opt = CORE_QUESTIONS.find((q) => q.id === 'Q32')?.options?.find((o) => o.value === q32.value);
    if (opt) futureAmbitions.push(`Earning ambition: ${opt.label}`);
  }
  if (answers['Q34']?.value) {
    futureAmbitions.push(`5-Year Vision: "${answers['Q34'].value}"`);
  }

  // Identify Uncertain / Conflicting Areas
  for (const signal of Object.values(dimensionSignals)) {
    if (signal.status === 'needs-information' || signal.uncertaintyRating > 50) {
      uncertainAreas.push(`${signal.label} (Signal uncertainty: ${signal.uncertaintyRating}%)`);
    }
  }

  // Synthesis summary statement
  const summarySynthesis =
    totalAnswered >= 34
      ? `Preliminary self-discovery sequence completed with ${totalAnswered} probes evaluated. The operator exhibits strongest signal clarity in ${
          Object.values(dimensionSignals).filter((s) => s.status === 'supported').length
        } dimensions, with an overall uncertainty quotient of ${globalUncertaintyScore}%. These responses form the calibrated inputs for the Exploded Self profile.`
      : `Self-discovery sequence partially calibrated (${totalAnswered} of ${activeQuestions.length} active probes completed). Profile currently exhibits emerging signal fidelity.`;

  return {
    generatedAt: new Date().toISOString(),
    totalAnswered,
    totalQuestionsEvaluated: activeQuestions.length,
    globalUncertaintyScore,
    dimensionSignals,
    taxonomies: {
      mainInterests,
      selfReportedStrengths,
      demonstratedAbilities,
      workPreferences,
      careerValues,
      preferredEnvironments,
      educationalBackground,
      geographicConstraints,
      financialConstraints,
      learningPreferences,
      futureAmbitions,
      uncertainAreas,
      contextDependentPreferences,
    },
    summarySynthesis,
  };
}
