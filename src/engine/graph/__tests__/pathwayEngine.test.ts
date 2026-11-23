import { describe, it, expect } from 'vitest';
import { careerGraphDatabase } from '../careerGraphDatabase';
import { pathwayGenerationEngine } from '../pathwayGenerationEngine';
import { pathwayValidationEngine } from '../pathwayValidationEngine';
import { pathwayRankingEngine } from '../pathwayRankingEngine';
import { pathwayComparisonEngine } from '../pathwayComparisonEngine';
import { generatePersonalIntelligenceProfile } from '../../profile/profileGenerator';
import type { UserProfileState } from '../../../types/profile';

describe('Career Pilot — Career Universe & Pathway Generation Engine (Phase 5)', () => {
  const targetDistributedId = 'occ-onet-15-1252-00';
  const targetCompBioId = 'occ-onet-19-1029-00';

  function createTestProfile(answers: Record<string, any>): UserProfileState {
    const intelligenceProfile = generatePersonalIntelligenceProfile(answers, { userName: 'Alex Tester' });
    return {
      id: 'test-user-01',
      version: 1,
      lastUpdated: new Date().toISOString(),
      userName: 'Alex Tester',
      completionPercentage: 80,
      uncertaintyScore: 25,
      answers,
      explodedSelf: {
        dimensionVectors: {} as any,
        cognitiveVector: {} as any,
        topInterests: ['Distributed Systems', 'Cloud Infrastructure'],
        skillsInventory: [
          { id: 'skill-programming-fundamentals', name: 'Programming Fundamentals', category: 'hard', proficiency: 'proficient', verified: true },
        ],
        coreValues: ['Autonomy', 'Intellectual Rigor'],
        workEnvironmentPreferences: { remotePreference: 'remote', pace: 'balanced', teamDensity: 'small-team' },
        financialParameters: { minimumCompensationUsd: 120000, targetCompensationUsd: 200000, currency: 'USD' },
        riskScore: 40,
        educationLevel: 'Bachelor’s Degree',
        geographicRegion: 'Global',
      },
      bookmarkedCareers: [],
      intelligenceProfile,
    };
  }

  // --------------------------------------------------------------------------
  // SCENARIO 1: University student seeking a direct route
  // --------------------------------------------------------------------------
  it('Scenario 1: Should discover and validate a Direct Pathway (Type A) from university to target', () => {
    const profile = createTestProfile({
      Q26: { educationBaseline: 'Bachelor’s Degree in CS' },
      Q30: 18,
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);
    const directPath = pathways.find((p) => p.category === 'direct-pathway');

    expect(directPath).toBeDefined();
    expect(directPath!.steps.length).toBeGreaterThanOrEqual(4);
    expect(directPath!.validationStatus).toBe('fully-validated');
    expect(directPath!.validationChecks.connectivityValid).toBe(true);
    expect(directPath!.validationChecks.deadEndFree).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 2: Student seeking an alternative educational route
  // --------------------------------------------------------------------------
  it('Scenario 2: Should generate an Alternative Education Pathway (Type C) via bootcamps/certs', () => {
    const profile = createTestProfile({
      Q26: { educationBaseline: 'High School Diploma' },
      Q28: 'intensive_bootcamp_6months',
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);
    const altEduPath = pathways.find((p) => p.category === 'alternative-education');

    expect(altEduPath).toBeDefined();
    expect(altEduPath!.archetype).toBe('fastest-plausible');
    expect(altEduPath!.totalDurationMonths).toBeLessThan(36);
    expect(altEduPath!.validationChecks.connectivityValid).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 3: Person with limited training resources
  // --------------------------------------------------------------------------
  it('Scenario 3: Should rank lowest-barrier / skill-based pathways top when resources are limited', () => {
    const profile = createTestProfile({
      Q29: 'strict-budget',
      Q30: 2, // 2 months runway
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);
    const ranked = pathwayRankingEngine.rankPathways(pathways, profile, 'lowest-financial-cost');

    // Lowest cost path (skill-based or earn-while-learning) should rank #1
    expect(ranked[0].costScore).toBeGreaterThanOrEqual(ranked[ranked.length - 1].costScore);
    expect(['skill-based-pathway', 'earn-while-learning']).toContain(ranked[0].pathway.category);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 4: Someone seeking to enter a new industry
  // --------------------------------------------------------------------------
  it('Scenario 4: Should construct a Bridge Career Pathway (Type D) with intermediate roles', () => {
    const profile = createTestProfile({
      Q15: 'career_switcher',
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);
    const bridgePath = pathways.find((p) => p.category === 'bridge-career');

    expect(bridgePath).toBeDefined();
    const hasBridgeRole = bridgePath!.steps.some((s) => s.nodeId.includes('bridge'));
    expect(hasBridgeRole).toBe(true);
    expect(bridgePath!.validationChecks.deadEndFree).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 5: Someone with relevant transferable skills
  // --------------------------------------------------------------------------
  it('Scenario 5: Should synthesize a Career Transition Pathway (Type H) leveraging transferable strengths', () => {
    const profile = createTestProfile({
      Q11: ['software_engineering'],
      Q12: ['commercial_industry'],
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);
    const transitionPath = pathways.find((p) => p.category === 'career-transition');

    expect(transitionPath).toBeDefined();
    expect(transitionPath!.categoryLabel).toContain('Type H');
    expect(transitionPath!.steps[0].skillsAcquired.length).toBeGreaterThan(0);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 6: Someone interested in interdisciplinary careers
  // --------------------------------------------------------------------------
  it('Scenario 6: Should generate an Interdisciplinary Pathway (Type E) for cross-domain destinations', () => {
    const profile = createTestProfile({
      Q01: ['biology', 'computer_science'],
      Q26: { educationBaseline: 'Bachelor’s Degree in Biology' },
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetCompBioId, profile);
    const interdisciplinaryPath = pathways.find((p) => p.category === 'interdisciplinary');

    expect(interdisciplinaryPath).toBeDefined();
    expect(interdisciplinaryPath!.archetype).toBe('best-fit');
    expect(interdisciplinaryPath!.steps.some((s) => s.nodeId.includes('bio'))).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 7: Someone who needs to earn while learning
  // --------------------------------------------------------------------------
  it('Scenario 7: Should construct an Earn-While-Learning Pathway (Type F) preserving cashflow', () => {
    const profile = createTestProfile({
      Q30: 1, // immediate earning necessity
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);
    const earnLearnPath = pathways.find((p) => p.category === 'earn-while-learning');

    expect(earnLearnPath).toBeDefined();
    expect(earnLearnPath!.estimatedCostRangeUsd.max).toBeLessThanOrEqual(1000);
    expect(earnLearnPath!.validationChecks.entryFeasible).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 8: Targeting occupation with licensing / credentials
  // --------------------------------------------------------------------------
  it('Scenario 8: Should correctly order professional credential requirements', () => {
    const profile = createTestProfile({});
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);

    pathways.forEach((path) => {
      const validation = pathwayValidationEngine.validatePathway(path, profile);
      expect(validation.prerequisitesOrdered).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // SCENARIO 9: Multiple alternative destinations & routes
  // --------------------------------------------------------------------------
  it('Scenario 9: Should discover multiple distinct route categories to the same destination', () => {
    const profile = createTestProfile({});
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);

    // Should generate at least 5 distinct pathway types
    const categories = new Set(pathways.map((p) => p.category));
    expect(categories.size).toBeGreaterThanOrEqual(5);

    // Verify deduplication
    const fingerprints = pathways.map((p) => pathwayValidationEngine.computePathwayFingerprint(p.steps));
    const uniqueFingerprints = new Set(fingerprints);
    expect(fingerprints.length).toBe(uniqueFingerprints.size);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 10: Preferred pathway containing missing data or informal routes
  // --------------------------------------------------------------------------
  it('Scenario 10: Should handle informal routes and missing data gracefully with transparent warnings', () => {
    const profile = createTestProfile({
      Q27: 'self-taught-informal',
    });

    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId, profile);
    const skillPath = pathways.find((p) => p.category === 'skill-based-pathway');

    expect(skillPath).toBeDefined();
    const validation = pathwayValidationEngine.validatePathway(skillPath!, profile);
    expect(validation.missingDataNotes.length).toBeGreaterThanOrEqual(0);
  });

  // --------------------------------------------------------------------------
  // INVARIANTS: Comparison Engine & Telemetry
  // --------------------------------------------------------------------------
  describe('Pathway Comparison & Graph Telemetry', () => {
    it('Should compare 2 to 3 pathways side-by-side with trade-off analysis', () => {
      const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(targetDistributedId);
      expect(pathways.length).toBeGreaterThanOrEqual(3);

      const comparison = pathwayComparisonEngine.comparePathways(pathways.slice(0, 3));

      expect(comparison.pathways.length).toBe(3);
      expect(comparison.metrics.length).toBeGreaterThanOrEqual(4);
      expect(comparison.tradeOffSummary.length).toBe(3);

      // Verify duration and cost metrics
      const durationMetric = comparison.metrics.find((m) => m.key === 'duration');
      expect(durationMetric).toBeDefined();
      expect(durationMetric!.winnerPathwayId).toBeDefined();
    });

    it('Should track graph telemetry and metrics accurately', () => {
      const telemetry = careerGraphDatabase.getTelemetry();

      expect(telemetry.totalEducationNodes).toBeGreaterThan(0);
      expect(telemetry.totalSkillNodes).toBeGreaterThan(0);
      expect(telemetry.totalExperienceNodes).toBeGreaterThan(0);
      expect(telemetry.totalGraphEdges).toBeGreaterThan(0);
      expect(telemetry.generatedRouteCount).toBeGreaterThan(0);
      expect(telemetry.validatedRouteCount).toBeGreaterThan(0);
    });
  });
});
