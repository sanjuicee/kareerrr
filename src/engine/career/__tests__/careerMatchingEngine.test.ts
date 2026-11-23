import { describe, it, expect } from 'vitest';
import { CareerMatchingEngine } from '../careerMatchingEngine';
import { occupationDatabase } from '../occupationDatabase';
import { careerComparisonEngine } from '../comparisonEngine';
import { generatePersonalIntelligenceProfile } from '../../profile/profileGenerator';
import type { PersonalIntelligenceProfile } from '../../../types/profileIntelligence';

describe('Career Pilot — Career Intelligence and Explainable Matching Engine', () => {
  const engine = new CareerMatchingEngine();

  // Helper to build a synthetic profile from answer overrides
  function createSyntheticProfile(answers: Record<string, any>): PersonalIntelligenceProfile {
    return generatePersonalIntelligenceProfile(answers, { userName: 'Test Engineer' });
  }

  // --------------------------------------------------------------------------
  // SCENARIO 1: Strong academic interests + limited practical experience
  // --------------------------------------------------------------------------
  it('Scenario 1: Should recommend careers where strong theoretical comprehension accelerates growth', () => {
    const profile = createSyntheticProfile({
      q01: ['systems-architecture', 'abstract-modeling'],
      q02: 'Advanced algorithmic theory, computational mathematics, and systems design.',
      q03: 'Formal verification, distributed consensus proofs, and deep theoretical computer science problems.',
      q08: 'Deep solitary reading of foundational whitepapers and formal specifications.',
      q09: 'Deconstruct the problem into first principles and theoretical axioms.',
      q11: ['theoretical-modeling'],
      q12: ['systems-architecture'],
      q14: 'academic',
      q15: 'No professional engineering roles yet; completed rigorous academic research projects.',
      q19: 'high',
      q27: 'masters',
    });

    const matches = engine.matchProfile(profile);
    expect(matches.length).toBeGreaterThan(0);

    // Should recommend theory-heavy/systems careers highly (e.g. ML Systems, Distributed Systems, Computational Biology)
    const topMatchIds = matches.slice(0, 3).map((m) => m.occupation.id);
    const theoryMatches = [
      'occ-onet-15-1299-08', // Machine Learning & Applied AI Systems Engineer
      'occ-onet-15-1252-00', // Distributed Systems & Cloud Infrastructure Architect
      'occ-onet-19-1029-00', // Computational Biology & Genomics Data Scientist
    ];
    const hasTheoryMatch = topMatchIds.some((id) => theoryMatches.includes(id));
    expect(hasTheoryMatch).toBe(true);

    // Explanation should highlight learning velocity / theoretical strength
    const top = matches[0];
    expect(top.explanation.whyItMatches.length).toBeGreaterThan(0);
    expect(top.explanation.whatUserHas.length).toBeGreaterThan(0);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 2: Strong technical skills with unclear long-term interests
  // --------------------------------------------------------------------------
  it('Scenario 2: Strong technical skills with unclear long-term interests should present diverse applications', () => {
    const profile = createSyntheticProfile({
      q01: ['unsure-varied'],
      q02: 'General computing and exploring various open source tools.',
      q06: 'Writing code, fixing broken scripts, optimizing databases, building tools.',
      q07: 'Programming in Python, Rust, and SQL, shell scripting, container setup.',
      q11: ['software_engineering', 'data_analysis'],
      q12: ['commercial_industry', 'public_opensource'],
      q13: 'Built high-scale web crawlers and data pipelines.',
      q15: '3 years of full-stack software development experience.',
      q32: 'open-ended-exploration',
    });

    const matches = engine.matchProfile(profile);
    const topMatches = matches.slice(0, 5);

    // Verify diversity in families or industries across top recommendations
    const families = new Set(topMatches.map((m) => m.occupation.family));
    const industries = new Set(topMatches.map((m) => m.occupation.industry));
    expect(families.size + industries.size).toBeGreaterThanOrEqual(2);

    // Skills match should be strong
    const highSkillMatch = topMatches.some((m) => {
      const skillsScore = m.dimensionScores.find((d) => d.dimensionKey === 'skillIntelligence')?.score || 0;
      return skillsScore >= 50;
    });
    expect(highSkillMatch).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 3: Creative individual with strong analytical abilities
  // --------------------------------------------------------------------------
  it('Scenario 3: Creative individual with strong analytical abilities should produce interdisciplinary recommendations', () => {
    const profile = createSyntheticProfile({
      q01: ['human-computer-interaction', 'spatial-design', 'data-visualization'],
      q02: 'Generative art, cognitive ergonomics, interactive digital simulations.',
      q06: 'Bridging technical engineering teams with visual product design.',
      q07: 'Visualizing complex multidimensional data and interactive interface architecture.',
      q09: 'Sketch conceptual workflows while modeling underlying state machines.',
      q11: ['interaction-design', 'systems-architecture'],
      q12: ['design-systems', 'frontend-performance', 'webgl'],
      q21: 'craftsmanship',
    });

    const matches = engine.matchProfile(profile);
    
    // Should match Creative Technology & Human-Centric Systems Designer
    const creativeMatch = matches.find((m) => m.occupation.id === 'occ-onet-27-1024-00');
    expect(creativeMatch).toBeDefined();
    expect(creativeMatch!.overallCompatibility).toBeGreaterThan(50);

    // Should be categorized appropriately
    expect(['direct-match', 'adjacent-match', 'interdisciplinary', 'unexpected-discovery', 'aspirational']).toContain(
      creativeMatch!.recommendationCategory
    );
  });

  // --------------------------------------------------------------------------
  // SCENARIO 4: User prioritizing financial stability and low uncertainty
  // --------------------------------------------------------------------------
  it('Scenario 4: User prioritizing financial stability should prioritize high-stability, established occupations', () => {
    const profile = createSyntheticProfile({
      q21: 'stability',
      q22: 'high-compensation-predictable',
      q25: 'predictable',
      q31: 'low-risk',
      q32: 'clear-established-track',
      q33: 'minimize-downside',
      q28: 'financial-obligation',
    });

    const matches = engine.matchProfile(profile);
    
    // Top matches should have high practical feasibility and stable compensation
    const topMatch = matches[0];
    const feasibilityScore = topMatch.dimensionScores.find((d) => d.dimensionKey === 'practicalFeasibility')?.score || 0;
    expect(feasibilityScore).toBeGreaterThanOrEqual(40);

    // High compensation paths should be ranked high
    const quantOrCloudMatch = matches.slice(0, 4).some(
      (m) =>
        m.occupation.id === 'occ-onet-13-2051-00' || // Quantitative Finance
        m.occupation.id === 'occ-onet-15-1252-00' || // Distributed Systems
        m.occupation.id === 'occ-onet-15-1212-00'    // Cyber Defense
    );
    expect(quantOrCloudMatch).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 5: User interested in research and independent work
  // --------------------------------------------------------------------------
  it('Scenario 5: User interested in research and independent work should match high autonomy roles', () => {
    const profile = createSyntheticProfile({
      q01: ['scientific-discovery', 'computational-biology'],
      q02: 'Genomics, molecular dynamics, bio-informatics research.',
      q17: 'autonomous-solo',
      q18: 'deep-focus-asynchronous',
      q19: 'high',
      q21: 'discovery-knowledge',
      q27: 'masters',
    });

    const matches = engine.matchProfile(profile);
    const topMatch = matches[0];

    // High autonomy occupations (Bioinformatics, ML, or Systems) should score at the top
    expect(['occ-onet-19-1029-00', 'occ-onet-15-1299-08', 'occ-onet-15-1252-00']).toContain(
      topMatch.occupation.id
    );
    expect(topMatch.occupation.typicalAutonomy).toBe('high');

    // Work style dimension score should be solid
    const workStyleScore = topMatch.dimensionScores.find((d) => d.dimensionKey === 'workIntelligence')?.score || 0;
    expect(workStyleScore).toBeGreaterThanOrEqual(50);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 6: User with strong interpersonal preferences
  // --------------------------------------------------------------------------
  it('Scenario 6: User with strong interpersonal preferences should prioritize collaborative/people-centric careers', () => {
    const profile = createSyntheticProfile({
      q01: ['science-policy', 'technology-ethics', 'public-communication'],
      q04: 'Facilitating consensus across conflicting technical and public stakeholders.',
      q06: 'Explaining complex technical phenomena clearly to non-technical leaders.',
      q17: 'highly-collaborative',
      q18: 'synchronous-interactive',
      q21: 'societal-impact',
    });

    const matches = engine.matchProfile(profile);
    
    // Should favor Scientific Communication / Technology Policy or Regulatory Operations
    const policyOrClinical = matches.slice(0, 4).some(
      (m) =>
        m.occupation.id === 'occ-onet-27-3042-00' || // Science Communication & Policy
        m.occupation.id === 'occ-onet-13-1041-00' || // Clinical Trial Operations
        m.occupation.id === 'occ-onet-27-1024-00'    // Creative Systems Designer
    );
    expect(policyOrClinical).toBe(true);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 7: User with limited educational and training resources
  // --------------------------------------------------------------------------
  it('Scenario 7: User with limited resources should identify non-degree/self-taught entry routes', () => {
    const profile = createSyntheticProfile({
      q26: 'self-directed-bootcamp',
      q27: 'high-school',
      q28: 'strict-financial-and-time-ceiling',
      q29: 'need-immediate-earning-within-1-year',
      q30: 'low-geographic-mobility',
    });

    const matches = engine.matchProfile(profile);
    
    // Feasibility status should distinguish careers requiring 6-year PhD vs careers accessible via self-taught routes
    const selfTaughtAccessible = matches.find(
      (m) => m.occupation.potentialEntryRoutes.some((r) => r.toLowerCase().includes('self-taught'))
    );
    expect(selfTaughtAccessible).toBeDefined();

    // Verify explanation warns about credential hurdles on strictly gated pathways
    const gatedCareer = matches.find((m) => m.occupation.qualificationPathways.some((p) => p.isMinimumRequirement && p.level.includes('Bachelor')));
    if (gatedCareer) {
      expect(gatedCareer.explanation.whatUserNeeds.length).toBeGreaterThan(0);
    }
  });

  // --------------------------------------------------------------------------
  // SCENARIO 8: Entrepreneurship interest with low uncertainty tolerance
  // --------------------------------------------------------------------------
  it('Scenario 8: User interested in entrepreneurship with low uncertainty tolerance should show trade-offs', () => {
    const profile = createSyntheticProfile({
      q04: 'Founding an independent venture and commercializing new tools.',
      q21: 'autonomy-and-impact',
      q31: 'low-risk',
      q32: 'entrepreneurial-ambition-with-safety-net',
      q33: 'anxious-about-income-volatility',
    });

    const matches = engine.matchProfile(profile);
    
    // Check that friction warnings or difficulty factors exist
    const hasTradeOffWarnings = matches.some((m) => m.explanation.whatMightBeDifficult.length > 0);
    expect(hasTradeOffWarnings).toBe(true);

    // Profile summary or conflicts should be defined
    expect(profile.uncertainties).toBeDefined();
    expect(profile.profileSummary).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // SCENARIO 9: Interdisciplinary interests (e.g., Biology + Computer Science)
  // --------------------------------------------------------------------------
  it('Scenario 9: Interdisciplinary interests should surface hybrid/interdisciplinary careers', () => {
    const profile = createSyntheticProfile({
      q01: ['biology', 'computer-science', 'data-science'],
      q02: 'Genomic sequencing, bioinformatics tools, CRISPR, Python data pipelines.',
      q03: 'Analyzing high-throughput sequencing data to identify rare genetic variants.',
      q06: 'Writing Python scripts to process biological fasta and vcf datasets.',
      q11: ['bioinformatics', 'python', 'genomics'],
      q12: ['next-generation-sequencing', 'statistical-genetics'],
      q27: 'bachelors',
    });

    const matches = engine.matchProfile(profile);
    
    // Computational Biology & Genomics Data Scientist should be ranked high
    const compBioMatch = matches.find((m) => m.occupation.id === 'occ-onet-19-1029-00');
    expect(compBioMatch).toBeDefined();
    expect(compBioMatch!.overallCompatibility).toBeGreaterThan(60);

    // Explanation should highlight inquiry domains
    expect(compBioMatch!.explanation.whyItMatches.length).toBeGreaterThan(0);
  });

  // --------------------------------------------------------------------------
  // SCENARIO 10: Conflicting preferences (High Income + Minimal Stress/Hours)
  // --------------------------------------------------------------------------
  it('Scenario 10: Conflicting preferences should evaluate trade-offs without engine failure', () => {
    const profile = createSyntheticProfile({
      q20: 'relaxed-low-pressure',
      q21: 'leisure-and-minimal-work',
      q22: 'top-1-percent-income',
      q25: 'strict-30-hour-workweek',
    });

    // Should not throw or crash
    const matches = engine.matchProfile(profile);
    expect(matches.length).toBeGreaterThan(0);

    // Top matches should have transparent trade-offs in explanation
    matches.forEach((m) => {
      expect(m.overallCompatibility).toBeGreaterThanOrEqual(0);
      expect(m.overallCompatibility).toBeLessThanOrEqual(100);
      expect(m.dimensionScores.length).toBe(6);
      expect(m.explanation).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // INVARIANTS & INTEGRITY TESTS
  // --------------------------------------------------------------------------
  it('Missing information should be handled fairly (never treated as negative or perfect match)', () => {
    // Empty answers profile
    const emptyProfile = createSyntheticProfile({});
    const matches = engine.matchProfile(emptyProfile);

    matches.forEach((m) => {
      // Score should fall in reasonable neutral exploratory range (30 - 75), not 0 or 100
      expect(m.overallCompatibility).toBeGreaterThanOrEqual(30);
      expect(m.overallCompatibility).toBeLessThanOrEqual(75);
      // Score confidence should be low due to zero profile completeness
      expect(m.scoreConfidence).toBeLessThanOrEqual(50);
    });
  });

  it('Engine output should be strictly deterministic for identical inputs', () => {
    const profile = createSyntheticProfile({
      q01: ['systems-architecture'],
      q06: 'Debugging distributed concurrency issues.',
      q11: ['distributed-systems', 'kubernetes'],
      q27: 'bachelors',
    });

    const run1 = engine.matchProfile(profile);
    const run2 = engine.matchProfile(profile);

    expect(run1.map((m) => m.occupation.id)).toEqual(run2.map((m) => m.occupation.id));
    expect(run1.map((m) => m.overallCompatibility)).toEqual(run2.map((m) => m.overallCompatibility));
  });

  it('No duplicate recommendations should ever be returned in the output', () => {
    const profile = createSyntheticProfile({ q01: ['data-science'] });
    const matches = engine.matchProfile(profile);

    const ids = matches.map((m) => m.occupation.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('All 6 recommendation categories should be valid and supported', () => {
    const validCategories = [
      'direct-match',
      'adjacent-match',
      'interdisciplinary',
      'unexpected-discovery',
      'aspirational',
      'alternative-direction',
    ];

    const profile = createSyntheticProfile({
      q01: ['systems-architecture'],
      q11: ['python'],
    });
    const matches = engine.matchProfile(profile);

    matches.forEach((m) => {
      expect(validCategories).toContain(m.recommendationCategory);
    });
  });

  // --------------------------------------------------------------------------
  // CAREER COMPARISON ENGINE TESTS
  // --------------------------------------------------------------------------
  describe('Career Comparison Engine', () => {
    it('Should compare 2 to 3 occupations side-by-side with regional compensation and trade-offs', () => {
      const allOccs = occupationDatabase.getAll();
      const occ1 = allOccs[0];
      const occ2 = allOccs[1];
      const occ3 = allOccs[2];

      const report = careerComparisonEngine.compareOccupations([occ1, occ2, occ3]);

      expect(report.occupations.length).toBe(3);
      expect(report.compensationComparison.us[occ1.id]).toBeDefined();
      expect(report.compensationComparison.eu?.[occ1.id]).toBeDefined();
      expect(report.compensationComparison.india?.[occ1.id]).toBeDefined();

      expect(report.workCharacteristicsMatrix.autonomy[occ1.id]).toBeDefined();
      expect(report.workCharacteristicsMatrix.remoteViability[occ2.id]).toBeDefined();

      expect(report.tradeOffInsights.length).toBe(3);
      expect(report.priorityLensRankings['maximize-compensation'].length).toBe(3);
      expect(report.priorityLensRankings['maximize-remote'].length).toBe(3);
    });

    it('Should throw if less than 2 or more than 3 occupations are supplied to compare', () => {
      const allOccs = occupationDatabase.getAll();
      expect(() => careerComparisonEngine.compareOccupations([allOccs[0]])).toThrow();
      expect(() =>
        careerComparisonEngine.compareOccupations([allOccs[0], allOccs[1], allOccs[2], allOccs[3]])
      ).toThrow();
    });
  });
});
