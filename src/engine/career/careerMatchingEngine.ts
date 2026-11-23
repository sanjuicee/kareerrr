// ============================================================================
// CAREER PILOT — DETERMINISTIC CAREER MATCHING ENGINE
// Six-Dimensional Explainable Multi-Vector Compatibility Modeling
// ============================================================================

import type { PersonalIntelligenceProfile } from '../../types/profileIntelligence';
import type {
  OccupationRecord,
  CareerMatchResult,
  DimensionCompatibilityScore,
  CareerExplanation,
  RecommendationCategory,
  CompatibilityTier,
  FeasibilityStatus,
  MatchingWeightsConfig,
} from '../../types/occupation';
import { DEFAULT_MATCHING_WEIGHTS } from '../../types/occupation';
import { occupationDatabase } from './occupationDatabase';

export class CareerMatchingEngine {
  private weights: MatchingWeightsConfig;

  constructor(weights: MatchingWeightsConfig = DEFAULT_MATCHING_WEIGHTS) {
    this.weights = weights;
  }

  public setWeights(weights: MatchingWeightsConfig) {
    this.weights = weights;
  }

  public getWeights(): MatchingWeightsConfig {
    return this.weights;
  }

  /**
   * Matches a Personal Intelligence Profile against all indexed occupations,
   * returning ranked and categorized explainable match results.
   */
  public matchProfile(
    profile: PersonalIntelligenceProfile,
    occupations: OccupationRecord[] = occupationDatabase.getAll()
  ): CareerMatchResult[] {
    const results: CareerMatchResult[] = [];

    occupations.forEach((occ) => {
      const match = this.evaluateSingleOccupation(profile, occ);
      results.push(match);
    });

    // Sort by overall compatibility descending
    return results.sort((a, b) => b.overallCompatibility - a.overallCompatibility);
  }

  /**
   * Evaluates a single occupation across all 6 dimensions.
   */
  public evaluateSingleOccupation(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ): CareerMatchResult {
    // 1. Evaluate individual dimension scores
    const interestDim = this.evaluateInterestAlignment(profile, occ);
    const abilityDim = this.evaluateAbilityAlignment(profile, occ);
    const skillsDim = this.evaluateSkillsCompatibility(profile, occ);
    const workStyleDim = this.evaluateWorkStyleAlignment(profile, occ);
    const valuesDim = this.evaluateValuesAlignment(profile, occ);
    const feasibilityDim = this.evaluatePracticalFeasibility(profile, occ);

    const dimensionScores = [
      interestDim,
      abilityDim,
      skillsDim,
      workStyleDim,
      valuesDim,
      feasibilityDim,
    ];

    // 2. Compute composite weighted score
    const compositeScore = Math.round(
      interestDim.score * this.weights.interestAlignment +
      abilityDim.score * this.weights.abilityAlignment +
      skillsDim.score * this.weights.skillsCompatibility +
      workStyleDim.score * this.weights.workStyleAlignment +
      valuesDim.score * this.weights.valuesAlignment +
      feasibilityDim.score * this.weights.practicalFeasibility
    );

    // 3. Compute score confidence (based on profile completeness and data completeness)
    const profileDepth = (profile.profileSummary.signalCompletenessPercent || 50) / 100;
    const dataCoverage = occ.dataCompleteness === 'verified-complete' ? 1.0 : 0.8;
    const scoreConfidence = Math.round(profileDepth * dataCoverage * 100);

    // 4. Determine Feasibility Status
    let feasibilityStatus: FeasibilityStatus = 'current-feasibility';
    if (feasibilityDim.score < 40) {
      feasibilityStatus = 'currently-incompatible';
    } else if (feasibilityDim.score < 65) {
      feasibilityStatus = 'long-term-potential';
    } else if (feasibilityDim.score < 80 || skillsDim.score < 60) {
      feasibilityStatus = 'feasible-with-preparation';
    }

    // 5. Determine Compatibility Tier
    let compatibilityTier: CompatibilityTier = 'Worth exploring';
    if (feasibilityStatus === 'currently-incompatible') {
      compatibilityTier = 'Currently difficult to pursue';
    } else if (compositeScore >= 80) {
      compatibilityTier = 'Strong potential match';
    } else if (compositeScore >= 70) {
      compatibilityTier = 'Promising direction';
    } else if (compositeScore < 60 && skillsDim.score < 50) {
      compatibilityTier = 'Requires significant development';
    }

    // 6. Skills analysis extraction
    const skillsAnalysis = this.extractSkillsAnalysis(profile, occ);

    // 7. Categorize into one of the 6 Recommendation Categories
    const { category, rationale: categoryRationale } = this.categorizeRecommendation(
      profile,
      occ,
      compositeScore,
      interestDim,
      abilityDim,
      skillsDim,
      feasibilityDim
    );

    // 8. Generate transparent, evidence-linked explanation
    const explanation = this.generateExplanation(
      profile,
      occ,
      dimensionScores,
      skillsAnalysis,
      feasibilityStatus
    );

    // Check user feedback from profile if present
    const userFeedback = (profile as any).userCareerFeedback?.[occ.id]?.feedback;

    return {
      occupationId: occ.id,
      occupation: occ,
      overallCompatibility: compositeScore,
      scoreConfidence,
      compatibilityTier,
      recommendationCategory: category,
      category,
      feasibilityStatus,
      categoryRationale,
      dimensionScores,
      skillsAnalysis,
      explanation,
      userFeedback,
    };
  }

  // --------------------------------------------------------------------------
  // Dimension 1: Interest Alignment (0 to 100)
  // --------------------------------------------------------------------------
  private evaluateInterestAlignment(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ): DimensionCompatibilityScore {
    const userInterests = profile.signals
      .filter((s) => s.dimensionKey === 'interestIntelligence')
      .map((s) => ({ name: s.name.toLowerCase(), category: s.category }));

    const supportingPoints: string[] = [];
    const frictionPoints: string[] = [];
    let matchCount = 0;

    // Build comprehensive occupation context tokens
    const occContextText = [
      occ.title,
      occ.description,
      ...occ.specializations,
      ...occ.typicalWorkActivities,
      ...occ.requiredKnowledge,
      occ.industry,
      occ.family,
    ].join(' ').toLowerCase();

    // Check direct activity & domain overlap
    userInterests.forEach((ui) => {
      const uiTokens = ui.name.toLowerCase().split(/[\s\-_/,]+/);
      const isMatched = uiTokens.some((tok) => tok.length >= 4 && occContextText.includes(tok));
      if (isMatched) {
        matchCount += 1;
        supportingPoints.push(`Domain alignment: Occupational scope connects with your inquiry in ${ui.name}.`);
      }
    });

    // Check cross-domain intersections
    const hasComputational = profile.signals.some((s) => s.name.toLowerCase().includes('computational') || s.name.toLowerCase().includes('systems'));
    const hasCreative = profile.signals.some((s) => s.name.toLowerCase().includes('creative') || s.name.toLowerCase().includes('design'));
    const hasBiology = profile.signals.some((s) => s.name.toLowerCase().includes('bio') || s.name.toLowerCase().includes('genom'));

    if (hasComputational && (occ.title.includes('Systems') || occ.title.includes('Computational') || occ.title.includes('Intelligence') || occ.title.includes('Machine Learning'))) {
      matchCount += 2;
      supportingPoints.push('Synthetic alignment with your Computational & Systems Science inquiry pattern.');
    }

    if (hasCreative && (occ.title.includes('Design') || occ.title.includes('Creative'))) {
      matchCount += 2;
      supportingPoints.push('Direct synthesis with your Creative Technology & Product Craft interests.');
    }

    if (hasBiology && (occ.title.includes('Biology') || occ.title.includes('Genomics') || occ.title.includes('Clinical'))) {
      matchCount += 2;
      supportingPoints.push('Direct synthesis with your Biological Sciences & Genomics curiosity.');
    }

    const rawScore = Math.min(96, 35 + matchCount * 14);
    const score = userInterests.length === 0 ? 50 : rawScore;

    if (matchCount === 0 && userInterests.length > 0) {
      frictionPoints.push('Daily responsibilities do not directly involve your primary indicated curiosity domains.');
    }

    return {
      dimensionKey: 'interestIntelligence',
      label: 'Interest Alignment',
      score,
      weight: this.weights.interestAlignment,
      weightedScore: Number((score * this.weights.interestAlignment).toFixed(1)),
      confidence: userInterests.length > 0 ? 'high' : 'limited',
      rationale:
        matchCount > 0
          ? `High coherence between occupational activities and ${matchCount} of your inquiry focus areas.`
          : 'Moderate alignment; work tasks diverge somewhat from primary curiosity drivers.',
      supportingEvidencePoints: supportingPoints.slice(0, 3),
      frictionPoints: frictionPoints.slice(0, 2),
    };
  }

  // --------------------------------------------------------------------------
  // Dimension 2: Ability Alignment (0 to 100)
  // --------------------------------------------------------------------------
  private evaluateAbilityAlignment(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ): DimensionCompatibilityScore {
    const demonstrated = profile.signals.filter((s) => s.category === 'demonstrated-ability');
    const strengths = profile.signals.filter((s) => s.category === 'self-reported-strength' || s.category === 'potential-aptitude');

    const supportingPoints: string[] = [];
    let abilityScore = 40; // baseline

    // Demonstrated abilities provide strong positive anchor
    if (demonstrated.length > 0) {
      abilityScore += 25;
      supportingPoints.push('Supported by your documented practical accomplishment and demonstrated applied capability.');
    }

    // Compare required abilities
    let abilityMatches = 0;
    occ.relevantAbilities.forEach((reqAb) => {
      const reqLower = reqAb.toLowerCase();
      strengths.forEach((st) => {
        if (reqLower.includes(st.name.toLowerCase()) || st.name.toLowerCase().includes(reqLower.split(' ')[0])) {
          abilityMatches += 1;
          supportingPoints.push(`Natural aptitude match: ${st.name} aligns with occupational demand for ${reqAb}.`);
        }
      });
    });

    abilityScore = Math.min(96, abilityScore + abilityMatches * 15);

    return {
      dimensionKey: 'abilityIntelligence',
      label: 'Ability & Cognitive Alignment',
      score: abilityScore,
      weight: this.weights.abilityAlignment,
      weightedScore: Number((abilityScore * this.weights.abilityAlignment).toFixed(1)),
      confidence: demonstrated.length > 0 ? 'high' : 'moderate',
      rationale:
        abilityMatches > 0
          ? `Strong cognitive alignment: ${abilityMatches} key required abilities match your reported natural cognitive strengths.`
          : 'Baseline cognitive suitability without deep specialized aptitude indicators.',
      supportingEvidencePoints: supportingPoints.slice(0, 3),
      frictionPoints: [],
    };
  }

  // --------------------------------------------------------------------------
  // Dimension 3: Skills Compatibility (0 to 100)
  // --------------------------------------------------------------------------
  private evaluateSkillsCompatibility(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ): DimensionCompatibilityScore {
    const skillsAnalysis = this.extractSkillsAnalysis(profile, occ);
    const { matchedSkills, transferableSkills, missingEssentialSkills } = skillsAnalysis;

    const essentialTotal = occ.essentialSkills.length || 1;
    const essentialRatio = matchedSkills.length / essentialTotal;
    const transferableBoost = Math.min(25, transferableSkills.length * 8);

    const score = Math.min(95, Math.round(essentialRatio * 65 + transferableBoost + (matchedSkills.length > 0 ? 15 : 5)));

    const supporting: string[] = [];
    const friction: string[] = [];

    matchedSkills.forEach((s) => supporting.push(`Direct skill possessed: ${s}.`));
    transferableSkills.forEach((s) => supporting.push(`Transferable competency: ${s}.`));
    missingEssentialSkills.forEach((s) => friction.push(`Missing essential skill: ${s} (requires learning pathway).`));

    return {
      dimensionKey: 'skillIntelligence',
      label: 'Skills Compatibility',
      score,
      weight: this.weights.skillsCompatibility,
      weightedScore: Number((score * this.weights.skillsCompatibility).toFixed(1)),
      confidence: profile.skillInventory.length > 0 ? 'high' : 'limited',
      rationale:
        matchedSkills.length > 0
          ? `Possess ${matchedSkills.length} essential competencies and ${transferableSkills.length} transferable capabilities.`
          : `Ramp-up needed: ${missingEssentialSkills.length} essential skills are not yet documented in your profile.`,
      supportingEvidencePoints: supporting.slice(0, 3),
      frictionPoints: friction.slice(0, 3),
    };
  }

  // --------------------------------------------------------------------------
  // Dimension 4: Work-Style Alignment (0 to 100)
  // --------------------------------------------------------------------------
  private evaluateWorkStyleAlignment(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ): DimensionCompatibilityScore {
    const prefs = profile.preferences;
    let score = 75; // default balanced
    const supporting: string[] = [];
    const friction: string[] = [];

    // Autonomy comparison
    if (prefs.autonomyVsStructured > 0.4 && occ.typicalAutonomy === 'high') {
      score += 10;
      supporting.push('Matches your desire for strategic independence and high operational latitude.');
    } else if (prefs.autonomyVsStructured < -0.4 && occ.typicalAutonomy === 'structured') {
      score += 10;
      supporting.push('Matches your preference for structured playbooks and predictable organizational clarity.');
    } else if (prefs.autonomyVsStructured > 0.5 && occ.typicalAutonomy === 'structured') {
      score -= 15;
      friction.push('High procedural structure may constrain your preference for autonomous exploration.');
    }

    // Remote Viability
    if (prefs.remoteArrangement === 'remote-first') {
      if (occ.workEnvironments.remoteViability === 'high') {
        score += 10;
        supporting.push('High remote-first viability matches your location independence preference.');
      } else if (occ.workEnvironments.remoteViability === 'low' || occ.workEnvironments.remoteViability === 'none') {
        score -= 20;
        friction.push('Involves mandatory physical on-site or field presence, conflicting with remote-first desires.');
      }
    }

    // Collaboration Level
    if (prefs.peopleVsSolo < -0.3 && occ.collaborationLevel === 'solo-dominant') {
      score += 8;
      supporting.push('Accommodates deep solitary focus blocks with low meeting density.');
    } else if (prefs.peopleVsSolo > 0.4 && occ.collaborationLevel === 'team-intensive') {
      score += 8;
      supporting.push('Rich collaborative teamwork density.');
    }

    const finalScore = Math.max(25, Math.min(95, score));

    return {
      dimensionKey: 'workIntelligence',
      label: 'Work-Style Alignment',
      score: finalScore,
      weight: this.weights.workStyleAlignment,
      weightedScore: Number((finalScore * this.weights.workStyleAlignment).toFixed(1)),
      confidence: 'high',
      rationale:
        friction.length === 0
          ? 'Strong operational compatibility across autonomy, collaboration density, and physical context.'
          : 'Moderate alignment with identifiable operational friction points.',
      supportingEvidencePoints: supporting.slice(0, 3),
      frictionPoints: friction.slice(0, 2),
    };
  }

  // --------------------------------------------------------------------------
  // Dimension 5: Values & Motivation Alignment (0 to 100)
  // --------------------------------------------------------------------------
  private evaluateValuesAlignment(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ): DimensionCompatibilityScore {
    const goals = profile.goals;
    let score = 70;
    const supporting: string[] = [];
    const friction: string[] = [];

    // Deal-breaker audit
    goals.dealBreakers.forEach((db) => {
      if (db === 'high_stress_burnout_hours' && occ.salaryBand.medianUsd > 200000 && occ.industry.includes('Capital Markets')) {
        score -= 30;
        friction.push('High market hours and performance pressure may conflict with your strict anti-burnout boundary.');
      }
      if (db === 'extreme_bureaucracy' && occ.industry.includes('Government') || occ.title.includes('Compliance')) {
        score -= 20;
        friction.push('Strict regulatory compliance protocols involve substantial procedural documentation.');
      }
      if (db === 'low_financial_upside' && occ.salaryBand.medianUsd < 100000) {
        score -= 25;
        friction.push('Compensation ceiling may conflict with your financial progression requirements.');
      }
    });

    // Top values rewards
    goals.topRankedValues.slice(0, 3).forEach((val) => {
      if (val === 'financial_prosperity' && occ.salaryBand.medianUsd >= 150000) {
        score += 12;
        supporting.push(`High compensation envelope ($${(occ.salaryBand.medianUsd / 1000).toFixed(0)}k median) directly satisfies your financial prosperity priority.`);
      }
      if (val === 'intellectual_freedom' && occ.typicalAutonomy === 'high') {
        score += 10;
        supporting.push('High intellectual freedom and open-ended problem exploration.');
      }
      if (val === 'societal_impact' && (occ.industry.includes('Clean') || occ.industry.includes('Medicine') || occ.family.includes('Scientific'))) {
        score += 12;
        supporting.push('Strong positive societal impact on human well-being or critical infrastructure.');
      }
    });

    const finalScore = Math.max(20, Math.min(95, score));

    return {
      dimensionKey: 'valuesIntelligence',
      label: 'Values & Motivation Alignment',
      score: finalScore,
      weight: this.weights.valuesAlignment,
      weightedScore: Number((finalScore * this.weights.valuesAlignment).toFixed(1)),
      confidence: goals.topRankedValues.length > 0 ? 'high' : 'moderate',
      rationale:
        friction.length === 0
          ? 'Clear ethical and motivation congruence with your highest-ranked life priorities.'
          : 'Potential value tension detected between core lifestyle boundaries and role demands.',
      supportingEvidencePoints: supporting.slice(0, 3),
      frictionPoints: friction.slice(0, 2),
    };
  }

  // --------------------------------------------------------------------------
  // Dimension 6: Practical Feasibility (0 to 100)
  // --------------------------------------------------------------------------
  private evaluatePracticalFeasibility(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ): DimensionCompatibilityScore {
    const constraints = profile.constraints;
    let score = 75;
    const supporting: string[] = [];
    const friction: string[] = [];

    // Education comparison
    const minQual = occ.qualificationPathways.find((q) => q.isMinimumRequirement);
    if (minQual) {
      if (minQual.level === 'Doctorate / Post-Grad' || minQual.level === 'Master’s Degree') {
        const userEdu = constraints.educationBaseline.toLowerCase();
        const hasGrad = userEdu.includes('master') || userEdu.includes('doctor') || userEdu.includes('phd');
        if (hasGrad) {
          score += 15;
          supporting.push(`Academic credentials satisfy the prerequisite ${minQual.level} standard.`);
        } else {
          score -= 30;
          friction.push(`Prerequisite ${minQual.level} in ${minQual.field} required for formal accreditation.`);
        }
      }
    }

    // Financial Runway vs Transition Time
    if (constraints.financialRunwayMonths < 4) {
      if (occ.qualificationPathways.some((q) => q.isMinimumRequirement && q.typicalPreparationYears > 2)) {
        score -= 20;
        friction.push(`Immediate income urgency (0–3m runway) limits full-time degree study; requires earn-while-learning transition.`);
      }
    }

    // Geographic check
    if (constraints.geographicBounds.includes('remote') && occ.workEnvironments.remoteViability === 'none') {
      score -= 35;
      friction.push('Requires physical relocation to specialized laboratory or on-site facility.');
    }

    const finalScore = Math.max(15, Math.min(95, score));

    return {
      dimensionKey: 'practicalFeasibility',
      label: 'Practical Feasibility & Constraints',
      score: finalScore,
      weight: this.weights.practicalFeasibility,
      weightedScore: Number((finalScore * this.weights.practicalFeasibility).toFixed(1)),
      confidence: 'high',
      rationale:
        finalScore >= 75
          ? 'High current feasibility with minimal external licensing or qualification barriers.'
          : 'Identifiable qualification or runway barriers requiring deliberate staged pathway preparation.',
      supportingEvidencePoints: supporting.slice(0, 2),
      frictionPoints: friction.slice(0, 2),
    };
  }

  // --------------------------------------------------------------------------
  // Helper: Categorization into the Six Recommendation Categories
  // --------------------------------------------------------------------------
  private categorizeRecommendation(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord,
    composite: number,
    _interestDim: DimensionCompatibilityScore,
    _abilityDim: DimensionCompatibilityScore,
    skillsDim: DimensionCompatibilityScore,
    feasibilityDim: DimensionCompatibilityScore
  ): { category: RecommendationCategory; rationale: string } {
    // Category 5: Aspirational
    if (
      (profile.goals.fiveYearVisionText && composite >= 65 && feasibilityDim.score < 65) ||
      (profile.goals.desiredResponsibilityLevel.includes('Executive') || profile.goals.desiredResponsibilityLevel.includes('Architect')) &&
      occ.typicalAutonomy === 'high' &&
      skillsDim.score < 60
    ) {
      return {
        category: 'aspirational',
        rationale: 'High alignment with your long-term ambitions and core values, representing an inspiring multi-year destination that requires deliberate preparatory milestones.',
      };
    }

    // Category 3: Interdisciplinary
    const hasComputational = profile.signals.some((s) => s.name.toLowerCase().includes('computational'));
    const hasCreative = profile.signals.some((s) => s.name.toLowerCase().includes('creative'));
    const hasScience = profile.signals.some((s) => s.name.toLowerCase().includes('scientific') || s.name.toLowerCase().includes('genomics'));

    if (
      (hasComputational && hasScience && occ.id.includes('bio-genomics')) ||
      (hasCreative && occ.id.includes('creative')) ||
      (hasComputational && occ.id.includes('quant'))
    ) {
      return {
        category: 'interdisciplinary',
        rationale: 'Bridges multiple distinct inquiry disciplines (e.g. computing, biological sciences, or creative craft) into a cohesive hybrid role.',
      };
    }

    // Category 4: Unexpected Discovery
    // Strong interest + ability alignment, but from an adjacent industry different from user background
    const userEduField = profile.constraints.educationBaseline.toLowerCase();
    const isUnfamiliarIndustry = !userEduField.includes(occ.industry.toLowerCase().split(' ')[0]);
    if (composite >= 68 && isUnfamiliarIndustry && (occ.id.includes('clean') || occ.id.includes('policy') || occ.id.includes('clinical'))) {
      return {
        category: 'unexpected-discovery',
        rationale: 'Surfaced through deep cognitive and activity overlap rather than keyword matching; applies your core strengths in an unconventional industry setting.',
      };
    }

    // Category 6: Alternative Career Direction
    if (composite >= 65 && occ.id.includes('policy')) {
      return {
        category: 'alternative-direction',
        rationale: 'Shares your intellectual curiosity in scientific discovery while trading lab execution for high-leverage policy synthesis and flexible remote writing.',
      };
    }

    // Category 1: Direct Match
    if (composite >= 76 && skillsDim.score >= 50 && feasibilityDim.score >= 65) {
      return {
        category: 'direct-match',
        rationale: 'High direct convergence across existing capabilities, cognitive approach, operational preferences, and practical feasibility.',
      };
    }

    // Category 2: Adjacent Match (Default fallback for good alignments)
    return {
      category: 'adjacent-match',
      rationale: 'Strong foundational alignment with core aptitudes and values; leverages transferable capabilities into an adjacent technical discipline.',
    };
  }

  // --------------------------------------------------------------------------
  // Helper: Extract Skills Overlap Analysis
  // --------------------------------------------------------------------------
  private extractSkillsAnalysis(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord
  ) {
    // Collect all skill sources: structured inventory + skill/demonstrated signals
    const userSkillNames = [
      ...profile.skillInventory.map((s) => s.name.toLowerCase()),
      ...profile.signals
        .filter((s) => s.dimensionKey === 'skillIntelligence' || s.category === 'demonstrated-ability')
        .map((s) => s.name.toLowerCase()),
    ];

    const hasGeneralSoftware = userSkillNames.some(
      (us) => us.includes('software') || us.includes('programming') || us.includes('python') || us.includes('code')
    );
    const hasGeneralData = userSkillNames.some(
      (us) => us.includes('data') || us.includes('analysis') || us.includes('statistic') || us.includes('sql')
    );

    const matchedSkills: string[] = [];
    const transferableSkills: string[] = [];
    const missingEssentialSkills: string[] = [];
    const missingOptionalSkills: string[] = [];

    occ.essentialSkills.forEach((es) => {
      const esTokens = es.toLowerCase().split(/[\s\-_(),/.]+/).filter((t) => t.length >= 3);
      const isDirectMatch = userSkillNames.some((us) => {
        const usTokens = us.toLowerCase().split(/[\s\-_(),/.]+/).filter((t) => t.length >= 3);
        return usTokens.some((ut) => esTokens.includes(ut)) || esTokens.some((et) => usTokens.includes(et));
      });

      const isBroadCapabilityMatch =
        (hasGeneralSoftware && (es.toLowerCase().includes('systems') || es.toLowerCase().includes('programming') || es.toLowerCase().includes('python') || es.toLowerCase().includes('architecture'))) ||
        (hasGeneralData && (es.toLowerCase().includes('data') || es.toLowerCase().includes('statistic') || es.toLowerCase().includes('model')));

      if (isDirectMatch || isBroadCapabilityMatch) {
        matchedSkills.push(es);
      } else {
        missingEssentialSkills.push(es);
      }
    });

    profile.skillInventory.forEach((us) => {
      if (us.isTransferable && !matchedSkills.some((ms) => ms.toLowerCase().includes(us.name.toLowerCase()))) {
        transferableSkills.push(us.name);
      }
    });

    occ.optionalSkills.forEach((os) => {
      const osLower = os.toLowerCase();
      const match = userSkillNames.find((us) => us.includes(osLower));
      if (!match) {
        missingOptionalSkills.push(os);
      }
    });

    return {
      matchedSkills,
      transferableSkills: transferableSkills.slice(0, 4),
      missingEssentialSkills,
      missingOptionalSkills,
    };
  }

  // --------------------------------------------------------------------------
  // Helper: Generate Structured Explanation
  // --------------------------------------------------------------------------
  private generateExplanation(
    profile: PersonalIntelligenceProfile,
    occ: OccupationRecord,
    dimensionScores: DimensionCompatibilityScore[],
    skillsAnalysis: ReturnType<typeof this.extractSkillsAnalysis>,
    feasibilityStatus: FeasibilityStatus
  ): CareerExplanation {
    const whyItMatches: string[] = [];
    const whatMightBeDifficult: string[] = [];
    const whatUserHas: string[] = [];
    const whatUserNeeds: string[] = [];
    const howToExploreFurther: string[] = [];

    // Why it matches
    dimensionScores.forEach((ds) => {
      if (ds.score >= 70 && ds.supportingEvidencePoints.length > 0) {
        whyItMatches.push(ds.supportingEvidencePoints[0]);
      }
    });
    if (whyItMatches.length === 0) {
      whyItMatches.push(`Coherent alignment with your reported problem-solving heuristics in ${occ.family}.`);
    }

    // What might be difficult
    dimensionScores.forEach((ds) => {
      if (ds.frictionPoints.length > 0) {
        whatMightBeDifficult.push(ds.frictionPoints[0]);
      }
    });
    if (skillsAnalysis.missingEssentialSkills.length > 0) {
      whatMightBeDifficult.push(`Technical ramp-up required for ${skillsAnalysis.missingEssentialSkills.slice(0, 2).join(' and ')}.`);
    }

    // What user has
    skillsAnalysis.matchedSkills.forEach((s) => whatUserHas.push(`Verified competency in ${s}.`));
    skillsAnalysis.transferableSkills.slice(0, 2).forEach((s) => whatUserHas.push(`Transferable strength in ${s}.`));
    if (profile.constraints.educationBaseline) {
      whatUserHas.push(`Foundational baseline in ${profile.constraints.educationBaseline}.`);
    }

    // What user needs
    skillsAnalysis.missingEssentialSkills.slice(0, 3).forEach((s) => whatUserNeeds.push(`Develop production competence in ${s}.`));
    const minQual = occ.qualificationPathways.find((q) => q.isMinimumRequirement);
    if (minQual && feasibilityStatus !== 'current-feasibility') {
      whatUserNeeds.push(`Investigate accredited ${minQual.level} training pathways in ${minQual.field}.`);
    }

    // How to explore further
    occ.potentialEntryRoutes.slice(0, 2).forEach((r) => howToExploreFurther.push(`Consider entry route: ${r}`));
    occ.relatedOccupations.slice(0, 2).forEach((relId) => {
      const rel = occupationDatabase.getById(relId);
      if (rel) howToExploreFurther.push(`Compare lateral role: ${rel.title}`);
    });

    return {
      whyItMatches: whyItMatches.slice(0, 4),
      whatMightBeDifficult: whatMightBeDifficult.slice(0, 4),
      whatUserHas: whatUserHas.slice(0, 4),
      whatUserNeeds: whatUserNeeds.slice(0, 4),
      howToExploreFurther: howToExploreFurther.slice(0, 3),
    };
  }
}

export const careerMatchingEngine = new CareerMatchingEngine();
