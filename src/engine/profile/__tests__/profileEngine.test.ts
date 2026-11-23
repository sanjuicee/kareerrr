// ============================================================================
// CAREER PILOT — PERSONAL INTELLIGENCE PROFILE ENGINE TEST SUITE
// Tests the 10 core scenarios specified in Phase 3 Section 10
// ============================================================================

import { describe, it, expect } from 'vitest';
import { generatePersonalIntelligenceProfile } from '../profileGenerator';
import { confirmSignal, rejectSignal, correctSignal, addCustomSkill } from '../profileEditor';
import type { AssessmentAnswer } from '../../../types/assessment';

describe('Personal Intelligence Profile Engine — Section 10 Test Invariants', () => {
  // --------------------------------------------------------------------------
  // Scenario 1: Strong academic interests but little practical experience
  // --------------------------------------------------------------------------
  it('Scenario 1: Handles strong academic interests with limited practical experience', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q01: { questionId: 'Q01', dimension: 'interests', format: 'multi-choice', value: ['scientific_inquiry'], answeredAt: '' },
      Q02: { questionId: 'Q02', dimension: 'interests', format: 'multi-choice', value: ['physics_cosmology', 'philosophy_ethics'], answeredAt: '' },
      Q11: { questionId: 'Q11', dimension: 'skills', format: 'multi-choice', value: ['data_analysis'], answeredAt: '' },
      Q12: { questionId: 'Q12', dimension: 'skills', format: 'multi-choice', value: ['informal_only'], answeredAt: '' },
      Q26: { questionId: 'Q26', dimension: 'education', format: 'structured-input', value: { highestLevel: 'Master’s Degree', primaryField: 'Theoretical Physics' }, answeredAt: '' },
    };

    const profile = generatePersonalIntelligenceProfile(answers, { userName: 'Academic Explorer' });
    
    // Interests should be recognized
    expect(profile.signals.some((s) => s.dimensionKey === 'interestIntelligence')).toBe(true);
    
    // Skill should NOT be marked as experience-backed because venue is informal only
    const dataSkill = profile.skillInventory.find((s) => s.name.includes('Data Analysis'));
    expect(dataSkill).toBeDefined();
    expect(dataSkill?.verificationStatus).toBe('self-reported');
    expect(dataSkill?.proficiency).toBe('practicing');

    // Evidence must trace back to Q26
    const eduEvidence = profile.evidence.find((ev) => ev.sourceQuestionId === 'Q26');
    expect(eduEvidence).toBeDefined();
    expect(eduEvidence?.displayText).toContain('Theoretical Physics');
  });

  // --------------------------------------------------------------------------
  // Scenario 2: Extensive practical skills but unclear academic interests
  // --------------------------------------------------------------------------
  it('Scenario 2: Handles extensive practical skills with unclear academic interests', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q01: { questionId: 'Q01', dimension: 'interests', format: 'multi-choice', value: ['unclear_interests'], answeredAt: '' },
      Q11: { questionId: 'Q11', dimension: 'skills', format: 'multi-choice', value: ['software_engineering', 'mechanical_fabrication'], answeredAt: '' },
      Q12: { questionId: 'Q12', dimension: 'skills', format: 'multi-choice', value: ['formal_employment', 'open_source_community'], answeredAt: '' },
      Q13: { questionId: 'Q13', dimension: 'skills', format: 'short-text', value: 'Built full production distributed telemetry cluster for manufacturing client.', answeredAt: '' },
    };

    const profile = generatePersonalIntelligenceProfile(answers, { userName: 'Practical Builder' });

    // Unclear interests should not generate fake specific interest signals
    const specificInterestSignals = profile.signals.filter(
      (s) => s.dimensionKey === 'interestIntelligence' && s.category === 'primary-interest'
    );
    expect(specificInterestSignals.length).toBe(0);

    // Practical skills should be experience-backed and strongly supported
    const sweSkill = profile.skillInventory.find((s) => s.name.includes('Software Engineering'));
    expect(sweSkill).toBeDefined();
    expect(sweSkill?.verificationStatus).toBe('experience-backed');

    const projectSignal = profile.signals.find((s) => s.signalId === 'sig-project-accomplishment');
    expect(projectSignal).toBeDefined();
    expect(projectSignal?.confidenceLevel).toBe('strongly-supported');
  });

  // --------------------------------------------------------------------------
  // Scenario 3: Diverse and overlapping interests
  // --------------------------------------------------------------------------
  it('Scenario 3: Identifies cross-domain intersection patterns for diverse interests', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q01: { questionId: 'Q01', dimension: 'interests', format: 'multi-choice', value: ['systems_analysis', 'creative_expression'], answeredAt: '' },
      Q02: { questionId: 'Q02', dimension: 'interests', format: 'multi-choice', value: ['computing_ai', 'arts_literature'], answeredAt: '' },
      Q03: { questionId: 'Q03', dimension: 'interests', format: 'multi-choice', value: ['debugging_logic', 'aesthetic_design'], answeredAt: '' },
    };

    const profile = generatePersonalIntelligenceProfile(answers);
    const creativeTechIntersection = profile.signals.find(
      (s) => s.signalId === 'sig-intersection-creative-tech'
    );

    expect(creativeTechIntersection).toBeDefined();
    expect(creativeTechIntersection?.category).toBe('interest-intersection');
    expect(creativeTechIntersection?.confidenceLevel).toBe('moderately-supported');
  });

  // --------------------------------------------------------------------------
  // Scenario 4: Conflicting career preferences (Predictability vs Risk / Degree vs Cashflow)
  // --------------------------------------------------------------------------
  it('Scenario 4: Detects conflicting career preferences as explainable trade-offs', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q17: { questionId: 'Q17', dimension: 'workStyle', format: 'single-choice', value: 'structured_playbook_predictable', answeredAt: '' },
      Q28: { questionId: 'Q28', dimension: 'education', format: 'single-choice', value: 'formal_degree_program', answeredAt: '' },
      Q30: { questionId: 'Q30', dimension: 'financialLifestyle', format: 'single-choice', value: 'immediate_0_3m', answeredAt: '' },
      Q32: { questionId: 'Q32', dimension: 'riskTolerance', format: 'slider', value: 85, answeredAt: '' },
      Q33: { questionId: 'Q33', dimension: 'ambitions', format: 'single-choice', value: 'executive_entrepreneur', answeredAt: '' },
    };

    const profile = generatePersonalIntelligenceProfile(answers);

    expect(profile.uncertainties.length).toBeGreaterThanOrEqual(2);
    
    // Conflict: Predictability vs Risk
    const riskConflict = profile.uncertainties.find((c) => c.conflictId === 'conf-predictability-vs-risk');
    expect(riskConflict).toBeDefined();
    expect(riskConflict?.category).toBe('potential-trade-offs');

    // Conflict: Income urgency vs Degree training
    const degreeConflict = profile.uncertainties.find((c) => c.conflictId === 'conf-income-vs-degree');
    expect(degreeConflict).toBeDefined();
    expect(degreeConflict?.category).toBe('potential-trade-offs');
  });

  // --------------------------------------------------------------------------
  // Scenario 5: Incomplete answers
  // --------------------------------------------------------------------------
  it('Scenario 5: Gracefully processes sparse or incomplete answers without crashing', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q01: { questionId: 'Q01', dimension: 'interests', format: 'multi-choice', value: ['systems_analysis'], answeredAt: '' },
    };

    const profile = generatePersonalIntelligenceProfile(answers);

    expect(profile.completionStatus).toBe('in-progress');
    expect(profile.signals.length).toBeGreaterThan(0);
    expect(profile.profileDimensions['abilityIntelligence'].totalSignalsCount).toBe(0);
    expect(profile.profileDimensions['abilityIntelligence'].missingInformationNotes.length).toBeGreaterThan(0);
  });

  // --------------------------------------------------------------------------
  // Scenario 6: Limited time and financial resources
  // --------------------------------------------------------------------------
  it('Scenario 6: Captures hard constraints versus flexible preferences', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q27: { questionId: 'Q27', dimension: 'financialLifestyle', format: 'single-choice', value: 'remote_strictly', answeredAt: '' },
      Q30: { questionId: 'Q30', dimension: 'financialLifestyle', format: 'single-choice', value: 'immediate_0_3m', answeredAt: '' },
      Q31: { questionId: 'Q31', dimension: 'financialLifestyle', format: 'single-choice', value: 'constrained_part_time_20h', answeredAt: '' },
    };

    const profile = generatePersonalIntelligenceProfile(answers);

    expect(profile.constraints.hardConstraints.length).toBe(3);
    expect(profile.constraints.financialRunwayMonths).toBe(2);
    expect(profile.constraints.availableWeeklyHours).toBe(20);
    expect(profile.constraints.hardConstraints.some((hc) => hc.id === 'hc-strictly-remote')).toBe(true);
  });

  // --------------------------------------------------------------------------
  // Scenario 7: Many self-reported skills but no supporting evidence
  // --------------------------------------------------------------------------
  it('Scenario 7: Flags self-reported skills without external application as limited evidence / tension', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q11: {
        questionId: 'Q11',
        dimension: 'skills',
        format: 'multi-choice',
        value: ['software_engineering', 'data_analysis', 'visual_design', 'project_coordination'],
        answeredAt: '',
      },
      Q12: {
        questionId: 'Q12',
        dimension: 'skills',
        format: 'multi-choice',
        value: ['informal_only'],
        answeredAt: '',
      },
    };

    const profile = generatePersonalIntelligenceProfile(answers);

    // Each skill must be self-reported
    profile.skillInventory.forEach((skill) => {
      expect(skill.verificationStatus).toBe('self-reported');
    });

    // Conflict detector should surface the discrepancy
    const venueConflict = profile.uncertainties.find((c) => c.conflictId === 'conf-skills-vs-venues');
    expect(venueConflict).toBeDefined();
    expect(venueConflict?.category).toBe('unresolved-information');
  });

  // --------------------------------------------------------------------------
  // Scenario 8: User changes an important previous answer
  // --------------------------------------------------------------------------
  it('Scenario 8: Deterministically recalculates signals when earlier answers change', () => {
    const initialAnswers: Record<string, AssessmentAnswer> = {
      Q17: { questionId: 'Q17', dimension: 'workStyle', format: 'single-choice', value: 'structured_playbook_predictable', answeredAt: '' },
    };

    const initialProfile = generatePersonalIntelligenceProfile(initialAnswers);
    expect(initialProfile.preferences.autonomyVsStructured).toBe(-0.8);

    // Change answer to fully autonomous
    const updatedAnswers: Record<string, AssessmentAnswer> = {
      Q17: { questionId: 'Q17', dimension: 'workStyle', format: 'single-choice', value: 'fully_autonomous_exploratory', answeredAt: '' },
    };

    const updatedProfile = generatePersonalIntelligenceProfile(updatedAnswers);
    expect(updatedProfile.preferences.autonomyVsStructured).toBe(0.9);
  });

  // --------------------------------------------------------------------------
  // Scenario 9: User corrects / confirms a system-generated profile finding
  // --------------------------------------------------------------------------
  it('Scenario 9: Preserves user confirmations and corrections across re-computations', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q01: { questionId: 'Q01', dimension: 'interests', format: 'multi-choice', value: ['systems_analysis'], answeredAt: '' },
    };

    const initialProfile = generatePersonalIntelligenceProfile(answers);
    const targetSignal = initialProfile.signals.find((s) => s.signalId.includes('systems_analysis'));
    expect(targetSignal).toBeDefined();

    // User confirms signal
    let confirmedProfile = confirmSignal(initialProfile, targetSignal!.signalId);
    expect(confirmedProfile.signals.find((s) => s.signalId === targetSignal!.signalId)?.status).toBe('confirmed');
    expect(confirmedProfile.signals.find((s) => s.signalId === targetSignal!.signalId)?.confidenceLevel).toBe('strongly-supported');

    // User also tests correcting signal
    confirmedProfile = correctSignal(
      confirmedProfile,
      targetSignal!.signalId,
      'Systems & Infrastructure Architecture',
      'Refined technical domain title',
      'Preferred domain terminology'
    );
    expect(confirmedProfile.signals.find((s) => s.signalId === targetSignal!.signalId)?.name).toBe('Systems & Infrastructure Architecture');

    // Test rejecting an irrelevant signal
    const dummySignal = confirmedProfile.signals[1];
    if (dummySignal) {
      const rejectedProfile = rejectSignal(confirmedProfile, dummySignal.signalId, 'Inapplicable to my path');
      expect(rejectedProfile.signals.find((s) => s.signalId === dummySignal.signalId)?.status).toBe('rejected');
    }

    // Recompute profile with new answers added, passing existing confirmed profile
    const moreAnswers = {
      ...answers,
      Q02: { questionId: 'Q02', dimension: 'interests', format: 'multi-choice', value: ['computing_ai'], answeredAt: '' },
    };

    const recomputedProfile = generatePersonalIntelligenceProfile(moreAnswers, {
      existingProfile: confirmedProfile,
    });

    // The user confirmation MUST be preserved!
    const preservedSignal = recomputedProfile.signals.find((s) => s.signalId === targetSignal!.signalId);
    expect(preservedSignal?.status).toBe('confirmed');
    expect(preservedSignal?.confidenceLevel).toBe('strongly-supported');
  });

  // --------------------------------------------------------------------------
  // Scenario 10: Resuming an existing profile restores state cleanly
  // --------------------------------------------------------------------------
  it('Scenario 10: Restores existing profile with custom skills and resolutions intact', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q11: { questionId: 'Q11', dimension: 'skills', format: 'multi-choice', value: ['software_engineering'], answeredAt: '' },
    };

    let profile = generatePersonalIntelligenceProfile(answers);

    // User adds custom skill
    profile = addCustomSkill(profile, {
      name: 'System Architecture Design',
      category: 'technical',
      proficiency: 'mastery',
      supportingExperienceVenue: ['10 years enterprise architecture'],
      userConfidence: 95,
      developmentInterest: true,
      evidenceSource: 'user-confirmed',
      verificationStatus: 'user-verified',
      isTransferable: true,
    });

    expect(profile.skillInventory.some((s) => s.name === 'System Architecture Design')).toBe(true);

    // Resume profile with additional question answered
    const resumedProfile = generatePersonalIntelligenceProfile(
      {
        ...answers,
        Q14: { questionId: 'Q14', dimension: 'skills', format: 'multi-choice', value: ['software_engineering'], answeredAt: '' },
      },
      { existingProfile: profile }
    );

    // Custom skill still exists
    expect(resumedProfile.skillInventory.some((s) => s.name === 'System Architecture Design')).toBe(true);
    expect(resumedProfile.skillInventory.find((s) => s.name === 'System Architecture Design')?.isUserAdded).toBe(true);
  });
});
