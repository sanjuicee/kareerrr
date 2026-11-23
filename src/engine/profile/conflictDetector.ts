// ============================================================================
// CAREER PILOT — CONFLICT DETECTOR
// Transparent contradiction, tension, and trade-off detection
// ============================================================================

import type { AssessmentAnswer } from '../../types/assessment';
import type { ProfileConflict } from '../../types/profileIntelligence';

/**
 * Evaluates assessment answers to identify genuine structural tensions,
 * trade-offs, and context-dependent preferences.
 */
export const detectProfileConflicts = (
  answers: Record<string, AssessmentAnswer | any>
): ProfileConflict[] => {
  const conflicts: ProfileConflict[] = [];

  const getVal = (qId: string) => {
    const a = answers[qId];
    return a && typeof a === 'object' && 'value' in a ? a.value : a;
  };

  // --------------------------------------------------------------------------
  // CONFLICT 1: Predictability vs. High Risk / Entrepreneurship
  // --------------------------------------------------------------------------
  const q17 = getVal('Q17'); // Structure preference
  const q22 = getVal('Q22'); // Unsuitable conditions
  const q32 = Number(getVal('Q32') ?? 50); // Risk tolerance (0-100)
  const q33 = getVal('Q33'); // Responsibility level

  const seeksPredictability =
    q17 === 'structured_playbook_predictable' ||
    (Array.isArray(q22) && q22.includes('high_uncertainty_instability'));
  const seeksEntrepreneurship =
    q32 >= 70 || q33 === 'executive_entrepreneur';

  if (seeksPredictability && seeksEntrepreneurship) {
    conflicts.push({
      conflictId: 'conf-predictability-vs-risk',
      category: 'potential-trade-offs',
      title: 'Operational Predictability vs. Entrepreneurial Ambition',
      explanation:
        'You indicated a preference for predictable structure or low tolerance for instability, while also expressing strong interest in entrepreneurial responsibility or high career risk-taking. Entrepreneurial environments typically demand high comfort with operational ambiguity.',
      competingSignalIds: ['sig-structure-preference', 'sig-entrepreneurial-ambition'],
      involvedQuestionIds: ['Q17', 'Q22', 'Q32', 'Q33'].filter((id) => getVal(id) !== undefined),
      userResolutionStatus: 'unresolved',
      suggestedAction:
        'Clarify whether you prefer an intrapreneurial role within a stable organization, or if you are willing to embrace startup volatility for long-term equity upside.',
    });
  }

  // --------------------------------------------------------------------------
  // CONFLICT 2: Immediate Income Runway vs. Multi-Year Degree Training
  // --------------------------------------------------------------------------
  const q28 = getVal('Q28'); // Willingness for education/training
  const q30 = getVal('Q30'); // Income urgency / runway

  const desiresMultiYearDegree =
    q28 === 'formal_degree_program' || q28 === 'multi_year_doctorate';
  const needsImmediateIncome =
    q30 === 'immediate_0_3m' || q30 === 'short_3_6m';

  if (desiresMultiYearDegree && needsImmediateIncome) {
    conflicts.push({
      conflictId: 'conf-income-vs-degree',
      category: 'potential-trade-offs',
      title: 'Immediate Financial Runway vs. Multi-Year Degree Training',
      explanation:
        'You desire formal degree or multi-year academic training, but your current financial runway requires immediate or short-term income within 0–6 months. Full-time degree programs usually defer income generation.',
      competingSignalIds: ['sig-education-willingness', 'sig-financial-runway'],
      involvedQuestionIds: ['Q28', 'Q30'],
      userResolutionStatus: 'unresolved',
      suggestedAction:
        'Consider employer-sponsored education, part-time/night degree programs, or modular paid apprenticeships that provide immediate cash flow.',
    });
  }

  // --------------------------------------------------------------------------
  // CONFLICT 3: High Social Collaboration vs. Solo Autonomous Execution
  // --------------------------------------------------------------------------
  const q15 = getVal('Q15'); // Proportional allocation
  const q16 = getVal('Q16'); // Interpersonal style
  const q24 = getVal('Q24'); // Daily interaction frequency

  const peopleAllocation =
    q15 && typeof q15 === 'object' ? Number(q15['alloc-people'] || 0) : 0;
  const prefersSolo =
    q16 === 'autonomous_solo' || q24 === 'minimal_deep_solo';

  if (peopleAllocation >= 35 && prefersSolo) {
    conflicts.push({
      conflictId: 'conf-people-vs-solo',
      category: 'context-dependent',
      title: 'Substantial People Allocation vs. Autonomous Solo Execution',
      explanation:
        'You allocated 35% or more of your ideal working time to People domains, yet expressed a strong preference for solitary autonomous work and minimal daily meetings. These preferences can coexist cleanly through asynchronous collaboration or deep-work blocks punctuated by focused team workshops.',
      competingSignalIds: ['sig-people-domain', 'sig-solo-preference'],
      involvedQuestionIds: ['Q15', 'Q16', 'Q24'].filter((id) => getVal(id) !== undefined),
      userResolutionStatus: 'unresolved',
      suggestedAction:
        'Confirm if you prefer consultative advisory work (working with people for high-impact segments) while protecting large uninterrupted blocks for solo analysis.',
    });
  }

  // --------------------------------------------------------------------------
  // CONFLICT 4: Advanced Skills Reported with Limited Practical Venues
  // --------------------------------------------------------------------------
  const q11 = getVal('Q11'); // Skills possessed
  const q12 = getVal('Q12'); // Venues applied

  const reportedManySkills = Array.isArray(q11) && q11.filter((s) => s !== 'self_taught_informal').length >= 3;
  const limitedVenues =
    Array.isArray(q12) &&
    q12.length === 1 &&
    (q12.includes('informal_only') || q12.includes('self_directed_projects'));

  if (reportedManySkills && limitedVenues) {
    conflicts.push({
      conflictId: 'conf-skills-vs-venues',
      category: 'unresolved-information',
      title: 'Extensive Self-Reported Skills with Informal Experience Venues',
      explanation:
        'You report capabilities across multiple specialized skill domains, but your applied experience has been largely self-directed or informal without institutional or commercial verification. This does not diminish your ability, but highlights that tangible portfolio artifacts will be vital to demonstrate your competencies to others.',
      competingSignalIds: ['sig-skills-inventory', 'sig-experience-venues'],
      involvedQuestionIds: ['Q11', 'Q12'],
      userResolutionStatus: 'unresolved',
      suggestedAction:
        'Create verifiable public proof-of-work (e.g. open-source repositories, case studies, or portfolio builds) to validate these capabilities.',
    });
  }

  // --------------------------------------------------------------------------
  // CONFLICT 5: High Financial Ambition vs. Burnout Deal-Breaker / Part-Time
  // --------------------------------------------------------------------------
  const q19 = getVal('Q19'); // Values ranking (first is top)
  const q31 = getVal('Q31'); // Hours available

  const topValueIsWealth =
    (Array.isArray(q19) && q19[0] === 'financial_prosperity') ||
    (typeof q19 === 'string' && q19.includes('financial_prosperity'));
  const rejectsBurnout = Array.isArray(q22) && q22.includes('high_stress_burnout_hours');
  const partTimeOnly = q31 === 'constrained_part_time_20h';

  if (topValueIsWealth && (rejectsBurnout && partTimeOnly)) {
    conflicts.push({
      conflictId: 'conf-wealth-vs-hours',
      category: 'potential-trade-offs',
      title: 'Accelerated Financial Prosperity vs. Constrained Time Capacity',
      explanation:
        'Financial prosperity is your highest priority value, yet you strictly reject high-stress burnout hours and have only 20 hours per week available. Rapid financial acceleration on limited hours typically requires specialized high-leverage technical or intellectual property ownership rather than wage-labor.',
      competingSignalIds: ['sig-value-wealth', 'sig-constraint-hours'],
      involvedQuestionIds: ['Q19', 'Q22', 'Q31'].filter((id) => getVal(id) !== undefined),
      userResolutionStatus: 'unresolved',
      suggestedAction:
        'Target high-margin specialized consulting, software products, or asymmetric equity upside where compensation is decoupled from direct hours logged.',
    });
  }

  return conflicts;
};
