// ============================================================================
// CAREER PILOT — PROFILE ENGINE
// Signal Extraction and Dimensional Synthesis for Personal Intelligence
// ============================================================================

import type {
  ProfileSignal,
  ProfileSkillItem,
  ProfilePreferencesRecord,
  ProfileConstraintsRecord,
  ProfileGoalsRecord,
  GrowthAreaItem,
  ProfileSummaryReport,
} from '../../types/profileIntelligence';
import { collectEvidenceRecords } from './evidenceManager';
import { evaluateSignalConfidence } from './confidenceEngine';

const getVal = (answers: Record<string, any>, qId: string) => {
  const a = answers[qId] ?? answers[qId.toLowerCase()] ?? answers[qId.toUpperCase()];
  return a && typeof a === 'object' && 'value' in a ? a.value : a;
};

const getUncertainty = (answers: Record<string, any>, qId: string): boolean => {
  const a = answers[qId] ?? answers[qId.toLowerCase()] ?? answers[qId.toUpperCase()];
  return a && typeof a === 'object' && a.isUncertain === true;
};

// ----------------------------------------------------------------------------
// 1. INTEREST INTELLIGENCE
// ----------------------------------------------------------------------------
export const extractInterestSignals = (
  answers: Record<string, any>
): ProfileSignal[] => {
  const signals: ProfileSignal[] = [];

  const q1 = getVal(answers, 'Q01'); // Attention activities
  const q2 = getVal(answers, 'Q02'); // Voluntary exploration
  const q3 = getVal(answers, 'Q03'); // Problem categories
  const q4 = getVal(answers, 'Q04'); // Greatest satisfaction
  const q5 = getVal(answers, 'Q05'); // Desired difference
  const qFollowA = getVal(answers, 'Q-FOLLOW-A'); // Clarification

  // Frequency aggregation
  const topicCounts: Record<string, { count: number; questionIds: string[] }> = {};

  const tally = (val: string, qId: string) => {
    if (!val || val === 'unclear_interests') return;
    if (!topicCounts[val]) topicCounts[val] = { count: 0, questionIds: [] };
    topicCounts[val].count += 1;
    if (!topicCounts[val].questionIds.includes(qId)) {
      topicCounts[val].questionIds.push(qId);
    }
  };

  if (Array.isArray(q1)) q1.forEach((v) => tally(v, 'Q01'));
  if (Array.isArray(q2)) q2.forEach((v) => tally(v, 'Q02'));
  if (Array.isArray(q3)) q3.forEach((v) => tally(v, 'Q03'));
  if (typeof q4 === 'string') tally(q4, 'Q04');
  if (typeof q5 === 'string') tally(q5, 'Q05');

  // Convert tallies to signals
  for (const [topic, meta] of Object.entries(topicCounts)) {
    const isPrimary = meta.count >= 2;
    const hasUncertainty = meta.questionIds.some((id) => getUncertainty(answers, id));
    const evidenceRecords = collectEvidenceRecords(meta.questionIds, answers);
    const confidence = evaluateSignalConfidence({
      evidenceRecords,
      hasUncertaintyFlag: hasUncertainty,
    });

    const formattedName = topic
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    signals.push({
      signalId: `sig-interest-${topic}`,
      dimensionKey: 'interestIntelligence',
      category: isPrimary ? 'primary-interest' : 'secondary-interest',
      name: formattedName,
      description: isPrimary
        ? `Consistently indicated across multiple inquiry probes (${meta.questionIds.join(', ')}).`
        : `Indicated in probe ${meta.questionIds.join(', ')}.`,
      strength: Math.min(1.0, 0.4 + meta.count * 0.25),
      confidenceLevel: confidence,
      evidenceType: isPrimary ? 'multi-answer-pattern' : 'direct-selection',
      supportingAnswerIds: meta.questionIds,
      evidenceRecords,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  // Cross-Domain Intersections
  const allAnsweredTopics = Object.keys(topicCounts);
  if (
    allAnsweredTopics.some((t) => t.includes('computing') || t.includes('systems')) &&
    allAnsweredTopics.some((t) => t.includes('scientific') || t.includes('data'))
  ) {
    signals.push({
      signalId: 'sig-intersection-computational-science',
      dimensionKey: 'interestIntelligence',
      category: 'interest-intersection',
      name: 'Computational & Systems Science',
      description: 'Emerging pattern at the intersection of computing architectures and empirical scientific inquiry.',
      strength: 0.9,
      confidenceLevel: 'moderately-supported',
      evidenceType: 'multi-answer-pattern',
      supportingAnswerIds: ['Q01', 'Q02'].filter((id) => getVal(answers, id) !== undefined),
      evidenceRecords: collectEvidenceRecords(['Q01', 'Q02'], answers),
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  if (
    allAnsweredTopics.some((t) => t.includes('creative') || t.includes('aesthetic') || t.includes('arts')) &&
    allAnsweredTopics.some((t) => t.includes('computing') || t.includes('engineering') || t.includes('tools'))
  ) {
    signals.push({
      signalId: 'sig-intersection-creative-tech',
      dimensionKey: 'interestIntelligence',
      category: 'interest-intersection',
      name: 'Creative Technology & Product Craft',
      description: 'Synthetic interest bridging visual/creative expression with tangible technical execution.',
      strength: 0.88,
      confidenceLevel: 'moderately-supported',
      evidenceType: 'multi-answer-pattern',
      supportingAnswerIds: ['Q01', 'Q03', 'Q04'].filter((id) => getVal(answers, id) !== undefined),
      evidenceRecords: collectEvidenceRecords(['Q01', 'Q03', 'Q04'], answers),
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  // Latent / Follow-up interest
  if (typeof qFollowA === 'string' && qFollowA.trim().length > 0) {
    signals.push({
      signalId: 'sig-interest-latent-clarification',
      dimensionKey: 'interestIntelligence',
      category: 'emerging-interest',
      name: 'Latent Flow-State Inquiry',
      description: `User reflection: "${qFollowA}"`,
      strength: 0.75,
      confidenceLevel: 'moderately-supported',
      evidenceType: 'written-description',
      supportingAnswerIds: ['Q-FOLLOW-A'],
      evidenceRecords: collectEvidenceRecords(['Q-FOLLOW-A'], answers),
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  return signals;
};

// ----------------------------------------------------------------------------
// 2. ABILITY AND APTITUDE INTELLIGENCE
// ----------------------------------------------------------------------------
export const extractAbilitySignals = (
  answers: Record<string, any>
): ProfileSignal[] => {
  const signals: ProfileSignal[] = [];

  const q6 = getVal(answers, 'Q06'); // Help requested (Self-reported strengths)
  const q7 = getVal(answers, 'Q07'); // Natural tasks (Cognitive ease)
  const q8 = getVal(answers, 'Q08'); // Learning style
  const q9 = getVal(answers, 'Q09'); // Problem-solving approach
  const q10 = getVal(answers, 'Q10'); // Realized accomplishment (Demonstrated)
  const q14 = getVal(answers, 'Q14'); // Future capabilities desired

  // Category A: Self-Reported Strengths (Q06)
  if (Array.isArray(q6)) {
    q6.forEach((str) => {
      if (str === 'unclear_strengths') return;
      const formatted = str
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const ev = collectEvidenceRecords(['Q06'], answers);
      signals.push({
        signalId: `sig-strength-${str}`,
        dimensionKey: 'abilityIntelligence',
        category: 'self-reported-strength',
        name: formatted,
        description: 'Self-reported strength: Identified as an area others frequently solicit help for.',
        strength: 0.75,
        confidenceLevel: evaluateSignalConfidence({
          evidenceRecords: ev,
          isSelfReportedOnly: true,
          hasUncertaintyFlag: getUncertainty(answers, 'Q06'),
        }),
        evidenceType: 'self-reported-proficiency',
        supportingAnswerIds: ['Q06'],
        evidenceRecords: ev,
        status: 'inferred',
        lastUpdatedAt: new Date().toISOString(),
      });
    });
  }

  // Category B: Demonstrated Abilities (Q10 accomplishment)
  if (typeof q10 === 'string' && q10.trim().length > 10) {
    const ev = collectEvidenceRecords(['Q10'], answers);
    signals.push({
      signalId: 'sig-demonstrated-accomplishment',
      dimensionKey: 'abilityIntelligence',
      category: 'demonstrated-ability',
      name: 'Demonstrated Applied Realization',
      description: `Documented accomplishment: "${q10}"`,
      strength: 0.95,
      confidenceLevel: 'strongly-supported',
      evidenceType: 'demonstrated-application',
      supportingAnswerIds: ['Q10'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  // Category C: Potential Aptitude Indicators (Cognitive ease + Problem Solving)
  if (Array.isArray(q7)) {
    q7.forEach((apt) => {
      const formatted = apt
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const qIds = ['Q07'];
      if (q9) qIds.push('Q09');
      const ev = collectEvidenceRecords(qIds, answers);

      signals.push({
        signalId: `sig-aptitude-${apt}`,
        dimensionKey: 'abilityIntelligence',
        category: 'potential-aptitude',
        name: formatted,
        description: 'Natural cognitive affinity: Tasks described as feeling relatively effortless or intuitive.',
        strength: 0.8,
        confidenceLevel: evaluateSignalConfidence({
          evidenceRecords: ev,
          hasUncertaintyFlag: getUncertainty(answers, 'Q07'),
        }),
        evidenceType: 'multi-answer-pattern',
        supportingAnswerIds: qIds,
        evidenceRecords: ev,
        status: 'inferred',
        lastUpdatedAt: new Date().toISOString(),
      });
    });
  }

  // Problem-solving persistence & approach (Q09)
  if (typeof q9 === 'string') {
    const approachLabel = q9
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const ev = collectEvidenceRecords(['Q09'], answers);
    signals.push({
      signalId: `sig-approach-${q9}`,
      dimensionKey: 'abilityIntelligence',
      category: 'cognitive-approach',
      name: `Approach: ${approachLabel}`,
      description: 'Initial heuristic deployed when confronting complex, unfamiliar challenges.',
      strength: 0.85,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q09'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  // Learning preference (Q08)
  if (typeof q8 === 'string') {
    const ev = collectEvidenceRecords(['Q08'], answers);
    signals.push({
      signalId: `sig-learning-${q8}`,
      dimensionKey: 'abilityIntelligence',
      category: 'learning-heuristic',
      name: `Learning Style: ${q8.replace(/_/g, ' ')}`,
      description: 'Dominant cognitive mechanism for integrating new domains.',
      strength: 0.75,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q08'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  // Category E: Desired Future Capabilities (Q14)
  if (Array.isArray(q14)) {
    q14.forEach((cap) => {
      const formatted = cap
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const ev = collectEvidenceRecords(['Q14'], answers);
      signals.push({
        signalId: `sig-desired-cap-${cap}`,
        dimensionKey: 'abilityIntelligence',
        category: 'desired-capability',
        name: `Target: ${formatted}`,
        description: 'Capability the user explicitly wishes to exercise regularly in future career phases.',
        strength: 0.85,
        confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
        evidenceType: 'direct-selection',
        supportingAnswerIds: ['Q14'],
        evidenceRecords: ev,
        status: 'inferred',
        lastUpdatedAt: new Date().toISOString(),
      });
    });
  }

  return signals;
};

// ----------------------------------------------------------------------------
// 3. SKILL AND EXPERIENCE INTELLIGENCE
// ----------------------------------------------------------------------------
export const extractSkillSignals = (
  answers: Record<string, any>
): { signals: ProfileSignal[]; inventory: ProfileSkillItem[] } => {
  const signals: ProfileSignal[] = [];
  const inventory: ProfileSkillItem[] = [];

  const q11 = getVal(answers, 'Q11'); // Skills currently possessed
  const q12 = getVal(answers, 'Q12'); // Venues applied
  const q13 = getVal(answers, 'Q13'); // Proud project/accomplishment
  const q14 = getVal(answers, 'Q14'); // Future capabilities

  const venues: string[] = Array.isArray(q12) ? q12 : [];
  const hasFormalVenue = venues.some(
    (v) => v === 'formal_employment' || v === 'academic_research' || v === 'freelance_consulting'
  );
  const projectText = typeof q13 === 'string' && q13.trim().length > 0 ? q13 : undefined;

  if (Array.isArray(q11)) {
    q11.forEach((skillKey) => {
      if (skillKey === 'self_taught_informal') return;

      const formattedName = skillKey
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      // Determine category
      let category: ProfileSkillItem['category'] = 'technical';
      if (skillKey.includes('design') || skillKey.includes('creative')) category = 'creative';
      else if (skillKey.includes('analysis') || skillKey.includes('financial')) category = 'analytical';
      else if (skillKey.includes('communication') || skillKey.includes('teaching')) category = 'interpersonal';
      else if (skillKey.includes('project') || skillKey.includes('coordination')) category = 'operational';

      const wantsToDevelop = Array.isArray(q14) && q14.includes(skillKey);
      const isExperienceBacked = hasFormalVenue || (venues.length > 0 && venues.includes('open_source_community'));

      const evIds = ['Q11'];
      if (venues.length > 0) evIds.push('Q12');
      if (projectText) evIds.push('Q13');
      const evRecords = collectEvidenceRecords(evIds, answers);

      const skillItem: ProfileSkillItem = {
        skillId: `skill-${skillKey}`,
        name: formattedName,
        category,
        proficiency: isExperienceBacked ? 'proficient' : 'practicing',
        supportingExperienceVenue: venues,
        demonstratedApplicationText: projectText,
        userConfidence: isExperienceBacked ? 85 : 65,
        developmentInterest: wantsToDevelop,
        evidenceSource: isExperienceBacked ? 'demonstrated-application' : 'self-reported-proficiency',
        verificationStatus: isExperienceBacked ? 'experience-backed' : 'self-reported',
        isTransferable: category === 'interpersonal' || category === 'operational' || category === 'analytical',
      };

      inventory.push(skillItem);

      // Also add as profile signal
      signals.push({
        signalId: `sig-skill-${skillKey}`,
        dimensionKey: 'skillIntelligence',
        category: skillItem.isTransferable ? 'transferable-skill' : 'domain-skill',
        name: formattedName,
        description: `${isExperienceBacked ? 'Experience-backed' : 'Self-reported'} capability in ${formattedName} across: ${venues.join(', ') || 'personal practice'}.`,
        strength: isExperienceBacked ? 0.9 : 0.7,
        confidenceLevel: evaluateSignalConfidence({
          evidenceRecords: evRecords,
          isSelfReportedOnly: !isExperienceBacked,
        }),
        evidenceType: isExperienceBacked ? 'demonstrated-application' : 'self-reported-proficiency',
        supportingAnswerIds: evIds,
        evidenceRecords: evRecords,
        status: 'inferred',
        lastUpdatedAt: new Date().toISOString(),
      });
    });
  }

  // Project Accomplishment Signal
  if (projectText) {
    const ev = collectEvidenceRecords(['Q13'], answers);
    signals.push({
      signalId: 'sig-project-accomplishment',
      dimensionKey: 'skillIntelligence',
      category: 'project-evidence',
      name: 'Demonstrated Project Milestone',
      description: `Reported applied milestone: "${projectText}"`,
      strength: 0.95,
      confidenceLevel: 'strongly-supported',
      evidenceType: 'demonstrated-application',
      supportingAnswerIds: ['Q13'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  return { signals, inventory };
};

// ----------------------------------------------------------------------------
// 4. WORK AND ENVIRONMENT INTELLIGENCE
// ----------------------------------------------------------------------------
export const extractWorkSignals = (
  answers: Record<string, any>
): { signals: ProfileSignal[]; preferences: ProfilePreferencesRecord } => {
  const signals: ProfileSignal[] = [];

  const q15 = getVal(answers, 'Q15'); // 100% allocation
  const q16 = getVal(answers, 'Q16'); // Interpersonal style
  const q17 = getVal(answers, 'Q17'); // Structure vs latitude
  const q18 = getVal(answers, 'Q18'); // Working rhythm
  const q23 = getVal(answers, 'Q23'); // Physical location
  const q24 = getVal(answers, 'Q24'); // Daily interaction frequency
  const q25 = getVal(answers, 'Q25'); // Lifestyle arrangement

  // Calculate Polarities
  let autonomyVsStructured = 0;
  if (q17 === 'fully_autonomous_exploratory') autonomyVsStructured = 0.9;
  else if (q17 === 'clear_outcomes_high_latitude') autonomyVsStructured = 0.5;
  else if (q17 === 'structured_playbook_predictable') autonomyVsStructured = -0.8;
  else if (q17 === 'dynamic_shifting_priorities') autonomyVsStructured = 0.3;

  let peopleVsSolo = 0;
  const peoplePct = q15 && typeof q15 === 'object' ? Number(q15['alloc-people'] || 0) : 20;
  if (q16 === 'autonomous_solo' || q24 === 'minimal_deep_solo') peopleVsSolo = -0.7;
  else if (q16 === 'small_autonomous_team') peopleVsSolo = 0.2;
  else if (q16 === 'cross_functional_matrix' || q16 === 'client_facing_consultative') peopleVsSolo = 0.8;
  if (peoplePct >= 40) peopleVsSolo = Math.min(1.0, peopleVsSolo + 0.3);

  let dataVsIdeas = 0;
  if (q15 && typeof q15 === 'object') {
    const dataP = Number(q15['alloc-data'] || 0);
    const ideasP = Number(q15['alloc-ideas'] || 0);
    const totalDI = dataP + ideasP;
    if (totalDI > 0) {
      dataVsIdeas = (ideasP - dataP) / totalDI; // -1 (all data) to +1 (all ideas)
    }
  }

  const coexisting: string[] = [];
  if (peopleVsSolo < 0 && peoplePct >= 30) {
    coexisting.push('Enjoys interpersonal impact via scheduled advisory sessions while requiring deep solo execution enclaves.');
  }
  if (autonomyVsStructured > 0 && q18 === 'iterative_sprint_release') {
    coexisting.push('High operational latitude paired with clear agile cadence and milestones.');
  }

  const preferences: ProfilePreferencesRecord = {
    autonomyVsStructured,
    peopleVsSolo,
    dataVsIdeas,
    varietyVsPredictability: q17 === 'dynamic_shifting_priorities' ? 0.7 : -0.4,
    remoteArrangement: q25 === 'remote_first_location_independent' ? 'remote-first' : 'hybrid',
    paceAndRhythm: String(q18 || 'balanced'),
    interactionDensity: String(q24 || 'moderate'),
    physicalEnvironment: String(q23 || 'dedicated-workspace'),
    coexistingPreferences: coexisting,
  };

  // Signals
  if (q16) {
    const ev = collectEvidenceRecords(['Q16'], answers);
    signals.push({
      signalId: 'sig-work-collaboration-style',
      dimensionKey: 'workIntelligence',
      category: 'collaboration-preference',
      name: `Collaboration: ${String(q16).replace(/_/g, ' ')}`,
      description: 'Desired team density and social configuration.',
      strength: 0.85,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q16'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  if (q17) {
    const ev = collectEvidenceRecords(['Q17'], answers);
    signals.push({
      signalId: 'sig-work-structure-preference',
      dimensionKey: 'workIntelligence',
      category: 'operational-structure',
      name: `Structure: ${String(q17).replace(/_/g, ' ')}`,
      description: 'Preferred balance between defined playbooks and strategic autonomy.',
      strength: 0.9,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q17'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  if (q18) {
    const ev = collectEvidenceRecords(['Q18'], answers);
    signals.push({
      signalId: 'sig-work-rhythm',
      dimensionKey: 'workIntelligence',
      category: 'work-rhythm',
      name: `Rhythm: ${String(q18).replace(/_/g, ' ')}`,
      description: 'Pacing model (deep monotasking vs rapid cycling vs iterative sprints).',
      strength: 0.8,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q18'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  return { signals, preferences };
};

// ----------------------------------------------------------------------------
// 5. VALUES AND MOTIVATION INTELLIGENCE
// ----------------------------------------------------------------------------
export const extractValuesSignals = (
  answers: Record<string, any>
): { signals: ProfileSignal[]; goals: Partial<ProfileGoalsRecord> } => {
  const signals: ProfileSignal[] = [];

  const q19 = getVal(answers, 'Q19'); // Ranked values
  const q20 = getVal(answers, 'Q20'); // Forced trade-off
  const q21 = getVal(answers, 'Q21'); // Persistence driver
  const q22 = getVal(answers, 'Q22'); // Unsuitable conditions / deal-breakers

  const topValues: string[] = Array.isArray(q19) ? q19 : typeof q19 === 'string' ? [q19] : [];
  const dealBreakers: string[] = Array.isArray(q22) ? q22 : [];
  const primaryMotivators: string[] = [];

  if (q21) primaryMotivators.push(String(q21));
  if (topValues.length > 0) primaryMotivators.push(topValues[0]);

  // Top Ranked Values as signals
  topValues.slice(0, 3).forEach((valKey, rank) => {
    const formatted = valKey
      .split('_')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const ev = collectEvidenceRecords(['Q19'], answers);

    signals.push({
      signalId: `sig-value-${valKey}`,
      dimensionKey: 'valuesIntelligence',
      category: 'core-value',
      name: `Priority #${rank + 1}: ${formatted}`,
      description: `Ranked #${rank + 1} among primary career motivations and decision filters.`,
      strength: Math.max(0.6, 1.0 - rank * 0.15),
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q19'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  });

  // Non-negotiable deal breakers
  dealBreakers.forEach((dbKey) => {
    const formatted = dbKey
      .split('_')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const ev = collectEvidenceRecords(['Q22'], answers);

    signals.push({
      signalId: `sig-dealbreaker-${dbKey}`,
      dimensionKey: 'valuesIntelligence',
      category: 'deal-breaker',
      name: `Deal-Breaker: ${formatted}`,
      description: 'Condition deemed explicitly intolerable, regardless of compensation or status.',
      strength: 1.0,
      confidenceLevel: 'strongly-supported',
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q22'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  });

  // Trade-off comfort
  if (q20) {
    const ev = collectEvidenceRecords(['Q20'], answers);
    signals.push({
      signalId: 'sig-value-trade-off',
      dimensionKey: 'valuesIntelligence',
      category: 'value-trade-off',
      name: `Trade-Off: ${String(q20).replace(/_/g, ' ')}`,
      description: 'Demonstrated willingness to compromise one benefit in favor of another.',
      strength: 0.85,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q20'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  return {
    signals,
    goals: {
      primaryMotivators,
      topRankedValues: topValues,
      acceptableCompromises: topValues.slice(3),
      dealBreakers,
    },
  };
};

// ----------------------------------------------------------------------------
// 6. LIFE, CONSTRAINT AND GROWTH INTELLIGENCE
// ----------------------------------------------------------------------------
export const extractGrowthSignals = (
  answers: Record<string, any>
): {
  signals: ProfileSignal[];
  constraints: ProfileConstraintsRecord;
  goalsUpdate: Partial<ProfileGoalsRecord>;
} => {
  const signals: ProfileSignal[] = [];

  const q26 = getVal(answers, 'Q26'); // Highest education & field
  const q27 = getVal(answers, 'Q27'); // Relocation
  const q28 = getVal(answers, 'Q28'); // Training willingness
  const q29 = getVal(answers, 'Q29'); // Location bounds
  const q30 = getVal(answers, 'Q30'); // Income urgency / runway
  const q31 = getVal(answers, 'Q31'); // Hours available
  const q32 = Number(getVal(answers, 'Q32') ?? 50); // Risk tolerance
  const q33 = getVal(answers, 'Q33'); // Responsibility level
  const q34 = getVal(answers, 'Q34'); // 5-year vision

  // Hard constraints vs flexible preferences
  const hardConstraints: ProfileConstraintsRecord['hardConstraints'] = [];
  const flexiblePreferences: ProfileConstraintsRecord['flexiblePreferences'] = [];

  let runwayMonths = 6;
  if (q30 === 'immediate_0_3m') {
    runwayMonths = 2;
    hardConstraints.push({
      id: 'hc-runway-immediate',
      label: 'Immediate Cash Flow Urgency (0–3 Months)',
      description: 'Requires immediate financial liquidity; cannot commit to unpaid re-skilling or delayed income.',
      isPermanent: false,
    });
  } else if (q30 === 'short_3_6m') {
    runwayMonths = 4;
  } else if (q30 === 'comfortable_6_12m') {
    runwayMonths = 9;
  } else if (q30 === 'extended_runway_12m_plus') {
    runwayMonths = 18;
  }

  let hoursAvailable = 40;
  if (q31 === 'constrained_part_time_20h') {
    hoursAvailable = 20;
    hardConstraints.push({
      id: 'hc-hours-constrained',
      label: 'Strict 20 Hours / Week Time Limit',
      description: 'Existing caretaking, study, or commitments cap professional hours at 20h/week.',
      isPermanent: false,
    });
  } else if (q31 === 'intensive_50h_plus') {
    hoursAvailable = 55;
  }

  if (q27 === 'remote_strictly') {
    hardConstraints.push({
      id: 'hc-strictly-remote',
      label: 'Strictly Remote Anchor',
      description: 'Cannot relocate or attend daily physical offices due to geographic or personal bounds.',
      isPermanent: true,
    });
  } else if (q27 === 'globally_flexible') {
    flexiblePreferences.push({
      id: 'fp-global-mobility',
      label: 'High Global Relocation Willingness',
      description: 'Open to international or multi-city relocation for compelling opportunities.',
    });
  }

  const educationText =
    q26 && typeof q26 === 'object'
      ? `${q26.highestLevel || 'Higher Education'}${q26.primaryField ? ` (${q26.primaryField})` : ''}`
      : String(q26 || 'Undergraduate or Equivalent');

  const constraints: ProfileConstraintsRecord = {
    hardConstraints,
    flexiblePreferences,
    educationBaseline: educationText,
    geographicBounds: String(q27 || q29 || 'Flexible / Remote'),
    financialRunwayMonths: runwayMonths,
    availableWeeklyHours: hoursAvailable,
    trainingCapacityDescription: String(q28 || 'Self-directed continuous learning'),
  };

  // Education Baseline Signal
  if (q26) {
    const ev = collectEvidenceRecords(['Q26'], answers);
    signals.push({
      signalId: 'sig-education-baseline',
      dimensionKey: 'growthIntelligence',
      category: 'academic-credential',
      name: `Credential: ${educationText}`,
      description: `Academic background and qualification baseline: ${educationText}.`,
      strength: 0.85,
      confidenceLevel: 'strongly-supported',
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q26'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  // Signals
  if (q32 !== undefined) {
    const ev = collectEvidenceRecords(['Q32'], answers);
    signals.push({
      signalId: 'sig-risk-tolerance',
      dimensionKey: 'growthIntelligence',
      category: 'risk-profile',
      name: `Risk Tolerance: ${q32}%`,
      description: q32 > 65 ? 'High calculated risk tolerance; comfortable with equity upside and ambiguity.' : 'Prefers capital preservation, predictability, and downside protection.',
      strength: q32 / 100,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'self-reported-proficiency',
      supportingAnswerIds: ['Q32'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  if (q33) {
    const ev = collectEvidenceRecords(['Q33'], answers);
    signals.push({
      signalId: 'sig-responsibility-target',
      dimensionKey: 'growthIntelligence',
      category: 'responsibility-horizon',
      name: `Target Scope: ${String(q33).replace(/_/g, ' ')}`,
      description: 'Desired locus of responsibility (craftsperson vs architect vs executive/founder).',
      strength: 0.9,
      confidenceLevel: evaluateSignalConfidence({ evidenceRecords: ev }),
      evidenceType: 'direct-selection',
      supportingAnswerIds: ['Q33'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  if (typeof q34 === 'string' && q34.trim().length > 10) {
    const ev = collectEvidenceRecords(['Q34'], answers);
    signals.push({
      signalId: 'sig-five-year-vision',
      dimensionKey: 'growthIntelligence',
      category: 'long-term-vision',
      name: '5-Year Strategic Horizon',
      description: `Stated vision: "${q34}"`,
      strength: 0.95,
      confidenceLevel: 'strongly-supported',
      evidenceType: 'written-description',
      supportingAnswerIds: ['Q34'],
      evidenceRecords: ev,
      status: 'inferred',
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  return {
    signals,
    constraints,
    goalsUpdate: {
      riskScore: q32,
      desiredResponsibilityLevel: String(q33 || 'Specialized Lead'),
      fiveYearVisionText: typeof q34 === 'string' ? q34 : undefined,
    },
  };
};

// ----------------------------------------------------------------------------
// 7. IDENTIFY GROWTH AREAS & GAPS
// ----------------------------------------------------------------------------
export const extractGrowthAreas = (
  answers: Record<string, any>,
  skillInventory: ProfileSkillItem[]
): GrowthAreaItem[] => {
  const areas: GrowthAreaItem[] = [];

  const q11 = getVal(answers, 'Q11');
  const q12 = getVal(answers, 'Q12');
  const q14 = getVal(answers, 'Q14');
  const q28 = getVal(answers, 'Q28');

  // 1. Untested capabilities (desired in future but currently lacking demonstrated projects)
  if (Array.isArray(q14)) {
    q14.forEach((cap) => {
      const match = skillInventory.find((s) => s.skillId.includes(cap));
      if (!match || match.verificationStatus === 'self-reported') {
        const formatted = cap
          .split('_')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        areas.push({
          areaId: `ga-untested-${cap}`,
          dimensionKey: 'abilityIntelligence',
          title: `Build Tangible Artifacts in ${formatted}`,
          description: `You expressed strong interest in deploying ${formatted} in your future career, but your current portfolio lacks demonstrated proof-of-work.`,
          gapType: 'untested-capability',
          suggestedAction: `Develop a focused public proof-of-concept or open-source contribution using ${formatted}.`,
          priority: 'high',
        });
      }
    });
  }

  // 2. Experience gap: Self-taught skills needing formal/commercial venue
  const hasOnlyInformal = Array.isArray(q12) && q12.length === 1 && q12[0] === 'informal_only';
  if (hasOnlyInformal && Array.isArray(q11) && q11.length > 0) {
    areas.push({
      areaId: 'ga-commercial-venue',
      dimensionKey: 'skillIntelligence',
      title: 'Commercial & Multi-Stakeholder Experience Verification',
      description: 'Your capabilities have primarily been exercised in isolated informal settings. Working in collaborative production environments will accelerate credibility.',
      gapType: 'experience-gap',
      suggestedAction: 'Engage in open-source collaboration, pro-bono client projects, or freelance engagements to validate team-based delivery.',
      priority: 'medium',
    });
  }

  // 3. Credential or Training Runway
  if (q28 === 'short_bootcamp_cert_months') {
    areas.push({
      areaId: 'ga-cert-runway',
      dimensionKey: 'growthIntelligence',
      title: 'Targeted Professional Accreditation',
      description: 'You prefer short, intensive certificate or bootcamp training over traditional multi-year degrees.',
      gapType: 'credential-gap',
      suggestedAction: 'Identify industry-recognized professional credentials with verifiable portfolio capstones.',
      priority: 'exploratory',
    });
  }

  return areas;
};

// ----------------------------------------------------------------------------
// 8. SYNTHESIS SUMMARY REPORT
// ----------------------------------------------------------------------------
export const generateProfileSummaryReport = (
  answers: Record<string, any>,
  signals: ProfileSignal[],
  conflicts: any[]
): ProfileSummaryReport => {
  const totalAnswered = Object.keys(answers).length;
  const completeness = Math.min(100, Math.round((totalAnswered / 34) * 100));

  // Uncertainty decreases as more high-signal probes are answered
  const globalUncertainty = Math.max(
    10,
    Math.round(85 - totalAnswered * 2.1 + conflicts.length * 4)
  );

  const primaryInterests = signals
    .filter((s) => s.category === 'primary-interest' || s.category === 'interest-intersection')
    .map((s) => s.name);

  const strengths = signals
    .filter((s) => s.category === 'demonstrated-ability' || s.category === 'self-reported-strength')
    .map((s) => s.name);

  const tradeOffSummaries = conflicts.map((c) => `${c.title}: ${c.category}`);

  let executiveSynthesis = '';
  if (totalAnswered === 0) {
    executiveSynthesis = 'Profile calibration has not yet commenced. Complete discovery probes to generate your multidimensional intelligence blueprint.';
  } else if (totalAnswered < 15) {
    executiveSynthesis = `Early calibration state (${totalAnswered} probes evaluated). Emerging signals indicate primary curiosity in ${primaryInterests.slice(0, 2).join(' and ') || 'exploratory domains'}. Additional probes required to substantiate aptitude depth.`;
  } else {
    executiveSynthesis = `Calibrated multidimensional profile based on ${totalAnswered} probes. Stated interests center on ${primaryInterests.slice(0, 3).join(', ') || 'multidisciplinary problem-solving'}, reinforced by demonstrated capabilities in ${strengths.slice(0, 2).join(' and ') || 'analytical execution'}. Exhibits an overall profile certainty of ${100 - globalUncertainty}%.`;
  }

  return {
    executiveSynthesis,
    primaryArchetypeIntersections: primaryInterests.slice(0, 4),
    signalCompletenessPercent: completeness,
    globalUncertaintyQuotient: globalUncertainty,
    strengthsHighlights: strengths.slice(0, 5),
    unexploredCuriosities: signals.filter((s) => s.confidenceLevel === 'limited-evidence').map((s) => s.name).slice(0, 4),
    criticalTradeOffsSummary: tradeOffSummaries,
  };
};
