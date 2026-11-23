// ============================================================================
// CAREER PILOT — OCCUPATION INTELLIGENCE DATA MODEL
// Authoritative Multi-Classification Career Architecture (O*NET, ESCO, NCO-2015)
// ============================================================================

import type { IntelligenceDimensionKey } from './profileIntelligence';

export type ClassificationSource =
  | 'O*NET'
  | 'ESCO'
  | 'India NCO-2015'
  | 'Multi-Source Synthesized';

export type RecommendationCategory =
  | 'direct-match'          // Category 1: Closely aligned with current capabilities and profile
  | 'adjacent-match'        // Category 2: Related interests/abilities with transferable skills
  | 'interdisciplinary'     // Category 3: Combining 2+ distinct inquiry areas
  | 'unexpected-discovery'  // Category 4: Unconsidered path with strong underlying activity overlap
  | 'aspirational'          // Category 5: High values alignment requiring significant developmental ramp-up
  | 'alternative-direction';// Category 6: Similar core skills/values in different working environments

export type CompatibilityTier =
  | 'Strong potential match'
  | 'Promising direction'
  | 'Worth exploring'
  | 'Requires significant development'
  | 'Currently difficult to pursue';

export type FeasibilityStatus =
  | 'current-feasibility'
  | 'feasible-with-preparation'
  | 'long-term-potential'
  | 'currently-incompatible';

export type UserFeedbackType =
  | 'interested'
  | 'not-interested'
  | 'already-considered'
  | 'not-interested-in-work'
  | 'concerned-about-requirements'
  | 'need-more-info'
  | 'dismissed';

export interface UserCareerFeedbackItem {
  occupationId: string;
  feedback: UserFeedbackType;
  notes?: string;
  timestamp: string;
}

export interface QualificationPathway {
  level: 'High School / Vocational' | 'Associate / Diploma' | 'Bachelor’s Degree' | 'Master’s Degree' | 'Doctorate / Post-Grad';
  field: string;
  isMinimumRequirement: boolean;
  typicalPreparationYears: number;
}

export interface RegionalProfileData {
  educationRequirement: string;
  licensingBody?: string;
  localClassificationCode?: string;
  localIndustryContext?: string;
  notes?: string;
  salaryBand?: {
    currency: string;
    entry: number;
    median: number;
    top: number;
  };
}

export interface OccupationProvenance {
  primarySource: ClassificationSource;
  sourceId: string; // e.g. "15-1252.00", "2512", "2512.0101"
  crossClassifications?: {
    onetSoc?: string;
    escoCode?: string;
    nco2015Code?: string;
  };
  datasetVersion: string;
  license: string;
  attribution: string;
  lastVerifiedDate: string;
}

export interface OccupationRecord {
  id: string; // stable identifier
  title: string;
  alternativeTitles: string[];
  family: string; // Occupational Family (e.g. Engineering & Systems)
  industry: string;
  specializations: string[];
  description: string;
  mainResponsibilities: string[];
  typicalWorkActivities: string[];
  requiredKnowledge: string[];
  essentialSkills: string[];
  optionalSkills: string[];
  relevantAbilities: string[];
  qualificationPathways: QualificationPathway[];
  workEnvironments: {
    physicalContext: string;
    remoteViability: 'high' | 'medium' | 'low' | 'none';
    travelRequirement: 'none' | 'occasional' | 'frequent';
    paceAndRhythm: string;
  };
  collaborationLevel: 'solo-dominant' | 'balanced' | 'team-intensive' | 'client-facing';
  typicalAutonomy: 'high' | 'moderate' | 'structured';
  importantWorkingConditions: string[];
  potentialEntryRoutes: string[];
  relatedOccupations: string[]; // IDs or titles of lateral/adjacent roles
  salaryBand: {
    entryUsd: number;
    medianUsd: number;
    topDecileUsd: number;
    source: string;
  };
  growthOutlook: {
    trend: 'Expanding Rapidly' | 'Stable Growth' | 'Specialized Niche' | 'Transforming with AI';
    demandScore: number; // 1-100
  };
  keyTradeOffs: Array<{
    dimension: string;
    positive: string;
    negativeOrCost: string;
    severity: 'low' | 'moderate' | 'high';
  }>;
  geographicApplicability: {
    global: boolean;
    regionalProfiles: Record<string, RegionalProfileData>;
  };
  provenance: OccupationProvenance;
  dataCompleteness: 'verified-complete' | 'standard' | 'partial-coverage';
}

export interface DimensionCompatibilityScore {
  dimensionKey: IntelligenceDimensionKey | 'practicalFeasibility';
  label: string;
  score: number; // 0 to 100
  weight: number; // e.g. 0.25
  weightedScore: number;
  confidence: 'high' | 'moderate' | 'limited';
  rationale: string;
  supportingEvidencePoints: string[];
  frictionPoints: string[];
}

export interface CareerExplanation {
  whyItMatches: string[];
  whatMightBeDifficult: string[];
  whatUserHas: string[];
  whatUserNeeds: string[];
  howToExploreFurther: string[];
}

export interface CareerMatchResult {
  occupationId: string;
  occupation: OccupationRecord;
  overallCompatibility: number; // 0 to 100
  scoreConfidence: number; // 0 to 100 based on profile certainty and data coverage
  compatibilityTier: CompatibilityTier;
  recommendationCategory: RecommendationCategory;
  category?: RecommendationCategory; // convenience alias
  feasibilityStatus: FeasibilityStatus;
  categoryRationale: string;
  dimensionScores: DimensionCompatibilityScore[];
  skillsAnalysis: {
    matchedSkills: string[];
    transferableSkills: string[];
    missingEssentialSkills: string[];
    missingOptionalSkills: string[];
  };
  explanation: CareerExplanation;
  userFeedback?: UserFeedbackType;
}

export interface MatchingWeightsConfig {
  interestAlignment: number; // default 0.25
  abilityAlignment: number;  // default 0.20
  skillsCompatibility: number; // default 0.15
  workStyleAlignment: number; // default 0.15
  valuesAlignment: number;    // default 0.15
  practicalFeasibility: number; // default 0.10
}

export const DEFAULT_MATCHING_WEIGHTS: MatchingWeightsConfig = {
  interestAlignment: 0.25,
  abilityAlignment: 0.20,
  skillsCompatibility: 0.15,
  workStyleAlignment: 0.15,
  valuesAlignment: 0.15,
  practicalFeasibility: 0.10,
};
