// ============================================================================
// CAREER PILOT — COMPREHENSIVE END-TO-END JOURNEY & INTEGRATION TEST SUITE
// Verifies all 8 user personas, full pipeline flow, and Phase 6 quality invariants
// ============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { generatePersonalIntelligenceProfile } from '../profile/profileGenerator';
import { CareerMatchingEngine } from '../career/careerMatchingEngine';
import { careerComparisonEngine } from '../career/comparisonEngine';
import { occupationDatabase } from '../career/occupationDatabase';
import { careerGraphDatabase } from '../graph/careerGraphDatabase';
import { pathwayGenerationEngine } from '../graph/pathwayGenerationEngine';
import { pathwayValidationEngine } from '../graph/pathwayValidationEngine';
import { pathwayRankingEngine } from '../graph/pathwayRankingEngine';
import { evaluateActiveQuestions } from '../branchingEngine';
import { confirmSignal, addCustomSkill } from '../profile/profileEditor';
import { importProfileJson } from '../../utils/storage';
import type { UserProfileState } from '../../types/profile';

describe('Career Pilot — End-to-End Pipeline & Integration Verification', () => {
  let matchingEngine: CareerMatchingEngine;

  beforeEach(() => {
    matchingEngine = new CareerMatchingEngine();
  });

  // --------------------------------------------------------------------------
  // SECTION 1: E2E TESTS FOR THE 8 REPRESENTATIVE USER PERSONAS
  // --------------------------------------------------------------------------

  it('Persona 1: Student with limited professional experience', () => {
    const studentAnswers = {
      q01: ['systems-architecture', 'abstract-modeling'],
      q02: 'Computer architecture, operating systems, and distributed algorithms.',
      q03: 'Algorithmic efficiency and systems design.',
      q11: ['data-structures'],
      q12: ['informal-learning'],
      q14: 'academic',
      q15: 'Completed theoretical undergraduate coursework; zero professional tenure.',
      q26: 'bachelors',
      q29: 'moderate-runway',
      q30: 'full-time',
    };

    // 1. Generate Personal Intelligence Profile
    const pip = generatePersonalIntelligenceProfile(studentAnswers, { userName: 'Alex (Student)' });
    expect(pip).toBeDefined();
    expect(pip.constraints.educationBaseline).toBeDefined();
    expect(pip.skillInventory.length).toBeGreaterThan(0);

    // 2. Match Occupations
    const matches = matchingEngine.matchProfile(pip);
    expect(matches.length).toBe(10);
    const topMatch = matches[0];
    expect(topMatch.overallCompatibility).toBeGreaterThan(45);
    expect(topMatch.explanation.whyItMatches.length).toBeGreaterThan(0);

    // 3. Generate & Validate Pathways
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(topMatch.occupation.id);
    expect(pathways.length).toBeGreaterThanOrEqual(4);

    // Direct route should be valid
    const directRoute = pathways.find((p) => p.category === 'direct-pathway');
    expect(directRoute).toBeDefined();
    const validation = pathwayValidationEngine.validatePathway(directRoute!);
    expect(validation.isValid).toBe(true);
    expect(validation.cycleFree).toBe(true);
  });

  it('Persona 2: Someone changing careers from traditional IT to Cloud Systems', () => {
    const careerChangerAnswers = {
      q01: ['systems-architecture', 'optimization'],
      q06: 'Debugging server hardware, script automation, and network topology.',
      q11: ['software-engineering', 'systems-architecture'],
      q12: ['production-enterprise'],
      q14: 'extensive-industry',
      q15: 'Over 8 years managing legacy datacenter infrastructure.',
      q26: 'bachelors',
      q29: 'substantial-runway',
      q30: 'part-time',
      q32: 'moderate-risk',
    };

    const pip = generatePersonalIntelligenceProfile(careerChangerAnswers, { userName: 'Sarah (Career Changer)' });
    const matches = matchingEngine.matchProfile(pip);

    // Cloud / Distributed systems should be among top recommendations
    const cloudMatch = matches.find((m) => m.occupation.id === 'occ-onet-15-1252-00');
    expect(cloudMatch).toBeDefined();
    expect(cloudMatch!.overallCompatibility).toBeGreaterThan(50);

    // Bridge career pathway should be available
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation('occ-onet-15-1252-00');
    const bridgePath = pathways.find((p) => p.category === 'bridge-career');
    expect(bridgePath).toBeDefined();
    expect(bridgePath!.steps.some((s) => s.nodeId.startsWith('occ-bridge-'))).toBe(true);
  });

  it('Persona 3: Someone with interdisciplinary interests (Biology + Computer Science)', () => {
    const interdisciplinaryAnswers = {
      q01: ['biological-systems', 'systems-architecture'],
      q02: 'Genomic sequencing pipelines, bioinformatics tools, and molecular models.',
      q03: 'High-throughput biological sequence processing.',
      q11: ['data-structures', 'biological-analysis'],
      q26: 'bachelors',
      q30: 'flexible',
    };

    const pip = generatePersonalIntelligenceProfile(interdisciplinaryAnswers, { userName: 'Dr. Jordan (Interdisciplinary)' });
    const matches = matchingEngine.matchProfile(pip);

    // Computational Biology / Genomics Data Scientist must be present
    const compBioMatch = matches.find((m) => m.occupation.id === 'occ-onet-19-1029-00');
    expect(compBioMatch).toBeDefined();

    // Generate interdisciplinary pathway
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation('occ-onet-19-1029-00');
    const interPath = pathways.find((p) => p.category === 'interdisciplinary');
    expect(interPath).toBeDefined();
    expect(interPath!.categoryLabel).toContain('Interdisciplinary');
  });

  it('Persona 4: Someone prioritizing income and stability', () => {
    const stabilityAnswers = {
      q01: ['quantitative-finance', 'systems-architecture'],
      q19: 'high-compensation-priority',
      q20: 'maximise-earnings',
      q21: 'financial-stability',
      q22: 'unstable-income-dealbreaker',
      q29: 'substantial-runway',
      q32: 'low-risk',
    };

    const pip = generatePersonalIntelligenceProfile(stabilityAnswers, { userName: 'Marcus (Finance Focus)' });
    const matches = matchingEngine.matchProfile(pip);

    // Quantitative Financial Analyst or Cloud Architect
    const quantMatch = matches.find((m) => m.occupation.id === 'occ-onet-13-2051-00');
    expect(quantMatch).toBeDefined();

    // Ranking lens: lowest-financial-cost or balanced
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(quantMatch!.occupation.id);
    const ranked = pathwayRankingEngine.rankPathways(pathways, undefined, 'lowest-financial-cost');
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].pathway.estimatedCostRangeUsd.min).toBeLessThanOrEqual(
      ranked[ranked.length - 1].pathway.estimatedCostRangeUsd.max
    );
  });

  it('Persona 5: Someone interested in unconventional career paths (Creative Tech)', () => {
    const unconventionalAnswers = {
      q01: ['creative-technology', 'visual-systems'],
      q02: 'Generative interactive installations, creative coding, and spatial interaction.',
      q05: 'Creative cultural impact and human-centric computing.',
      q11: ['design-systems', 'software-engineering'],
      q15: 'Autonomous creative agency with variable project cycles.',
      q32: 'high-risk',
    };

    const pip = generatePersonalIntelligenceProfile(unconventionalAnswers, { userName: 'Elena (Creative Tech)' });
    const matches = matchingEngine.matchProfile(pip);

    // Creative Technology & Human-Centric Systems Designer
    const creativeMatch = matches.find((m) => m.occupation.id === 'occ-onet-27-1024-00');
    expect(creativeMatch).toBeDefined();

    // Skill-based alternative route should exist
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation('occ-onet-27-1024-00');
    const skillPath = pathways.find((p) => p.category === 'skill-based-pathway');
    expect(skillPath).toBeDefined();
    expect(skillPath!.steps.some((s) => s.practicalDeliverables.length > 0)).toBe(true);
  });

  it('Persona 6: Someone with significant financial and educational constraints', () => {
    const constrainedAnswers = {
      q01: ['systems-architecture'],
      q12: ['self-taught'],
      q14: 'entry',
      q26: 'secondary',
      q29: 'zero-runway',
      q30: 'part-time',
    };

    const profileState: UserProfileState = {
      id: 'test-p6',
      version: 1,
      lastUpdated: new Date().toISOString(),
      userName: 'Devon (Constrained)',
      completionPercentage: 50,
      uncertaintyScore: 40,
      answers: constrainedAnswers,
      intelligenceProfile: generatePersonalIntelligenceProfile(constrainedAnswers, { userName: 'Devon' }),
      explodedSelf: {
        dimensionVectors: { interests: 0.8, skills: 0.3, financialLifestyle: 0.1, education: 0.1 } as any,
        cognitiveVector: {} as any,
        topInterests: [],
        skillsInventory: [],
        coreValues: [],
        workEnvironmentPreferences: {} as any,
        financialParameters: { minimumCompensationUsd: 40000, targetCompensationUsd: 70000, currency: 'USD' },
        riskScore: 20,
        educationLevel: 'Secondary',
        geographicRegion: 'Global',
      },
      bookmarkedCareers: [],
    };

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation('occ-onet-15-1252-00', profileState);
    const earnLearnPath = pathways.find((p) => p.category === 'earn-while-learning');
    expect(earnLearnPath).toBeDefined();

    // In ranking with work-while-learning priority lens, earn-while-learning ranks in the top tier
    const ranked = pathwayRankingEngine.rankPathways(pathways, profileState, 'work-while-learning');
    const topCategories = ranked.slice(0, 2).map((r) => r.pathway.category);
    expect(topCategories).toContain('earn-while-learning');
  });

  it('Persona 7: Someone with unclear preferences & high uncertainty', () => {
    const unclearAnswers = {
      q01: ['exploratory-broad'],
      q15: 'balanced',
      q20: 'exploring-options',
    };

    const pip = generatePersonalIntelligenceProfile(unclearAnswers, { userName: 'Riley (Uncertain)' });
    expect(pip).toBeDefined();

    // Uncertainty score should be handled gracefully without crash
    const matches = matchingEngine.matchProfile(pip);
    expect(matches.length).toBe(10);
    // Confidence should reflect incomplete data
    expect(matches[0].scoreConfidence).toBeLessThan(80);
    // Explanations should disclose what user needs
    expect(matches[0].explanation.whatUserNeeds.length).toBeGreaterThan(0);
  });

  it('Persona 8: Someone with extensive experience and transferable skills', () => {
    const veteranAnswers = {
      q01: ['systems-architecture', 'cloud-infrastructure'],
      q11: ['software-engineering', 'systems-architecture', 'cloud-infrastructure'],
      q12: ['production-enterprise', 'open-source'],
      q14: 'executive-lead',
      q15: 'Over a decade leading cross-functional infrastructure and distributed security teams.',
      q26: 'masters',
      q29: 'substantial-runway',
      q30: 'full-time',
    };

    const pip = generatePersonalIntelligenceProfile(veteranAnswers, { userName: 'Chief Engineer Chris' });
    const matches = matchingEngine.matchProfile(pip);

    // High compatibility for Cloud Security or Distributed Systems
    const securityMatch = matches.find((m) => m.occupation.id === 'occ-onet-15-1212-00');
    expect(securityMatch).toBeDefined();
    expect(securityMatch!.overallCompatibility).toBeGreaterThan(55);
  });

  // --------------------------------------------------------------------------
  // SECTION 2: ADAPTIVE QUESTIONNAIRE & PROFILE LIFECYCLE
  // --------------------------------------------------------------------------

  it('Verifies question branching, queue length <= 40, and modification recomputation', () => {
    const answers: Record<string, any> = {
      Q01: { questionId: 'Q01', dimension: 'interests' as const, format: 'multi-choice' as const, value: ['unclear_interests'], answeredAt: '' },
    };

    const activeQuestions = evaluateActiveQuestions(answers);
    expect(activeQuestions.length).toBeGreaterThanOrEqual(34);
    expect(activeQuestions.length).toBeLessThanOrEqual(40);
    expect(activeQuestions.some((q) => q.id === 'Q-FOLLOW-A')).toBe(true);

    // If answer to Q01 is changed to clear interests, Q-FOLLOW-A should not trigger
    const updatedAnswers = {
      Q01: { questionId: 'Q01', dimension: 'interests' as const, format: 'multi-choice' as const, value: ['scientific_inquiry'], answeredAt: '' },
    };
    const updatedQueue = evaluateActiveQuestions(updatedAnswers);
    expect(updatedQueue.some((q) => q.id === 'Q-FOLLOW-A')).toBe(false);
  });

  it('Verifies user profile signal override preservation during recalculation', () => {
    const initialAnswers = {
      Q01: { questionId: 'Q01', dimension: 'interests' as const, format: 'multi-choice' as const, value: ['scientific_inquiry'], answeredAt: '' },
      Q26: { questionId: 'Q26', dimension: 'education' as const, format: 'structured-input' as const, value: { highestLevel: 'Master’s Degree' }, answeredAt: '' },
    };
    let pip = generatePersonalIntelligenceProfile(initialAnswers, { userName: 'Test User' });

    // User confirms a signal
    const firstSignalId = pip.signals[0]?.signalId || 'sig-test';
    pip = confirmSignal(pip, firstSignalId);
    pip = addCustomSkill(pip, {
      name: 'Custom Distributed Systems Debugging',
      category: 'technical',
      proficiency: 'mastery',
      supportingExperienceVenue: ['workplace-production'],
      userConfidence: 95,
      developmentInterest: true,
      evidenceSource: 'user-confirmed',
      verificationStatus: 'user-verified',
      isTransferable: true,
    });

    // Answering more questions should recompute but preserve custom skill
    const newAnswers = {
      ...initialAnswers,
      Q11: { questionId: 'Q11', dimension: 'skills' as const, format: 'multi-choice' as const, value: ['data_analysis'], answeredAt: '' },
    };
    const recomputed = generatePersonalIntelligenceProfile(newAnswers, {
      userName: 'Test User',
      existingProfile: pip,
    });

    expect(recomputed.skillInventory.some((s) => s.name === 'Custom Distributed Systems Debugging')).toBe(true);
    expect(recomputed.skillInventory.find((s) => s.name === 'Custom Distributed Systems Debugging')?.isUserAdded).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SECTION 3: CAREER COMPARISON STUDIO & PRIORITY SIMULATION
  // --------------------------------------------------------------------------

  it('Verifies multi-career comparison across 3 occupations with priority simulation', () => {
    const occA = occupationDatabase.getById('occ-onet-15-1252-00')!; // Distributed Systems
    const occB = occupationDatabase.getById('occ-onet-19-1029-00')!; // Comp Bio
    const occC = occupationDatabase.getById('occ-onet-13-2051-00')!; // Quant Finance

    const pip = generatePersonalIntelligenceProfile({
      q01: ['systems-architecture', 'quantitative-finance'],
      q26: 'bachelors',
    });

    const report = careerComparisonEngine.compareOccupations([occA, occB, occC], pip);
    expect(report.occupations.length).toBe(3);
    expect(report.dimensionalDifferences.length).toBeGreaterThan(0);

    // Priority simulation rankings
    const compRankings = report.priorityLensRankings['maximize-compensation'];
    expect(compRankings.length).toBe(3);
    expect(compRankings[0].simulatedScore).toBeGreaterThanOrEqual(compRankings[1].simulatedScore);

    const autonomyRankings = report.priorityLensRankings['maximize-autonomy'];
    expect(autonomyRankings.length).toBe(3);
  });

  // --------------------------------------------------------------------------
  // SECTION 4: SECURITY & IMPORT SANITIZATION
  // --------------------------------------------------------------------------

  it('Verifies security sanitization on profile JSON import', () => {
    // Malicious payload attempting prototype pollution & script injection
    const maliciousJson = JSON.stringify({
      id: 'cp-malicious-1',
      version: 1,
      userName: '<script>alert("xss")</script>Dr. Hacker',
      answers: { Q01: ['opt-1-1'] },
      explodedSelf: { dimensionVectors: { interests: 0.5 } },
      __proto__: { isAdmin: true },
    });

    const sanitized = importProfileJson(maliciousJson);
    expect(sanitized.userName).not.toContain('<script>');
    expect(sanitized.userName).toContain('Dr. Hacker');
    expect((sanitized as any).isAdmin).toBeUndefined();
    expect(sanitized.id).toBe('cp-malicious-1');
  });

  // --------------------------------------------------------------------------
  // SECTION 5: CAREER UNIVERSE & GRAPH INTEGRITY
  // --------------------------------------------------------------------------

  it('Verifies career universe graph metrics and reproducible pathway synthesis', () => {
    const telemetry = careerGraphDatabase.getTelemetry();
    expect(telemetry.totalOccupations).toBeGreaterThan(5);
    expect(telemetry.totalGraphEdges).toBeGreaterThan(10);

    const occ = occupationDatabase.getAll()[0];
    const pathways1 = pathwayGenerationEngine.generatePathwaysForOccupation(occ.id);
    const pathways2 = pathwayGenerationEngine.generatePathwaysForOccupation(occ.id);

    // Deterministic reproducibility: same inputs produce identical route IDs and steps
    expect(pathways1.length).toBe(pathways2.length);
    expect(pathways1[0].id).toBe(pathways2[0].id);
    const fp1 = pathwayValidationEngine.computePathwayFingerprint(pathways1[0].steps);
    const fp2 = pathwayValidationEngine.computePathwayFingerprint(pathways2[0].steps);
    expect(fp1).toBe(fp2);
  });
});
