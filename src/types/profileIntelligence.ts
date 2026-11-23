// ============================================================================
// CAREER PILOT — PERSONAL INTELLIGENCE PROFILE TYPE SYSTEM
// Schema Version: 3.0.0
// ============================================================================

import type { DimensionKey } from './profile';

/**
 * The Six Primary Intelligence Dimensions of Career Pilot
 */
export type IntelligenceDimensionKey =
  | 'interestIntelligence'
  | 'abilityIntelligence'
  | 'skillIntelligence'
  | 'workIntelligence'
  | 'valuesIntelligence'
  | 'growthIntelligence';

export interface IntelligenceDimensionMeta {
  key: IntelligenceDimensionKey;
  label: string;
  code: string;
  description: string;
  color: string; // Telemetry hex
  iconName: string;
  contributingQuestionDimensions: DimensionKey[];
}

export const INTELLIGENCE_DIMENSIONS: Record<
  IntelligenceDimensionKey,
  IntelligenceDimensionMeta
> = {
  interestIntelligence: {
    key: 'interestIntelligence',
    label: 'Interest Intelligence',
    code: 'INTEL-01',
    description: 'Inquiry domains, voluntary exploration subjects, and curiosity drivers.',
    color: '#00F0B4', // Precision Cyan
    iconName: 'Compass',
    contributingQuestionDimensions: ['interests'],
  },
  abilityIntelligence: {
    key: 'abilityIntelligence',
    label: 'Ability & Aptitude Intelligence',
    code: 'INTEL-02',
    description: 'Cognitive reasoning strengths, demonstrated accomplishments, and problem-solving patterns.',
    color: '#38BDF8', // Precision Sky
    iconName: 'Brain',
    contributingQuestionDimensions: ['aptitudes'],
  },
  skillIntelligence: {
    key: 'skillIntelligence',
    label: 'Skill & Experience Intelligence',
    code: 'INTEL-03',
    description: 'Structured inventory of technical, operational, and transferable capabilities across venues.',
    color: '#818CF8', // Indigo
    iconName: 'Wrench',
    contributingQuestionDimensions: ['skills'],
  },
  workIntelligence: {
    key: 'workIntelligence',
    label: 'Work & Environment Intelligence',
    code: 'INTEL-04',
    description: 'Autonomy, collaboration density, pacing rhythms, and physical context preferences.',
    color: '#A78BFA', // Violet
    iconName: 'Briefcase',
    contributingQuestionDimensions: ['workStyle'],
  },
  valuesIntelligence: {
    key: 'valuesIntelligence',
    label: 'Values & Motivation Intelligence',
    code: 'INTEL-05',
    description: 'Intrinsic career priorities, non-negotiable deal-breakers, and acceptable trade-offs.',
    color: '#F472B6', // Rose
    iconName: 'Heart',
    contributingQuestionDimensions: ['values'],
  },
  growthIntelligence: {
    key: 'growthIntelligence',
    label: 'Life, Constraint & Growth Intelligence',
    code: 'INTEL-06',
    description: 'Credential baseline, financial runway, geographic parameters, and long-term ambition horizons.',
    color: '#F59E0B', // Signal Amber
    iconName: 'TrendingUp',
    contributingQuestionDimensions: ['financialLifestyle', 'education', 'riskTolerance', 'ambitions'],
  },
};

/**
 * Types of Evidence Supporting a Signal
 */
export type EvidenceType =
  | 'direct-selection'         // User directly selected a specific categorical option
  | 'written-description'      // User explicitly typed qualitative text
  | 'self-reported-proficiency'// User indicated a proficiency grade
  | 'demonstrated-application' // Concrete project or accomplishment described
  | 'multi-answer-pattern'     // Synthesized across 2+ independent questions
  | 'system-inference'         // Derived logically by deterministic rule
  | 'user-confirmed';          // Explicitly confirmed/validated by user override

/**
 * Confidence Level of an Inferred or Reported Signal
 */
export type ConfidenceLevel =
  | 'limited-evidence'     // 1 indirect answer or unverified assertion
  | 'emerging-pattern'     // 2 matching signals or partial qualitative support
  | 'moderately-supported' // Solid direct answers with consistent context
  | 'strongly-supported'   // Direct answers backed by demonstrated accomplishment or user confirmation
  | 'requires-clarification'; // Signal is contested or contradictory

/**
 * Verification Status of an Item
 */
export type VerificationStatus =
  | 'self-reported'
  | 'experience-backed'
  | 'portfolio-demonstrated'
  | 'user-verified';

/**
 * Traceable Evidence Record
 */
export interface EvidenceRecord {
  evidenceId: string;
  sourceQuestionId: string;
  sourceQuestionPrompt: string;
  evidenceType: EvidenceType;
  rawValue: any;
  displayText: string;
  capturedAt: string; // ISO string
}

/**
 * Individual Intelligence Signal
 */
export interface ProfileSignal {
  signalId: string;
  dimensionKey: IntelligenceDimensionKey;
  category: string; // e.g., 'primary-interest', 'demonstrated-ability', 'environmental-preference'
  name: string;
  description: string;
  strength: number; // 0.0 to 1.0
  confidenceLevel: ConfidenceLevel;
  evidenceType: EvidenceType;
  supportingAnswerIds: string[];
  evidenceRecords: EvidenceRecord[];
  status: 'inferred' | 'confirmed' | 'corrected' | 'rejected';
  userNotes?: string;
  lastUpdatedAt: string;
}

/**
 * User Correction / Override Record
 */
export interface UserCorrectionRecord {
  correctionId: string;
  targetSignalId?: string;
  dimensionKey: IntelligenceDimensionKey;
  field: string;
  originalValue: any;
  correctedValue: any;
  reason?: string;
  timestamp: string;
}

/**
 * Structured Skill Inventory Item
 */
export interface ProfileSkillItem {
  skillId: string;
  name: string;
  category: 'technical' | 'creative' | 'analytical' | 'interpersonal' | 'operational' | 'domain';
  subcategory?: string;
  proficiency: 'exploring' | 'practicing' | 'proficient' | 'mastery';
  supportingExperienceVenue: string[]; // e.g., ['formal_employment', 'self_directed_projects']
  demonstratedApplicationText?: string;
  userConfidence: number; // 0 to 100
  developmentInterest: boolean;
  evidenceSource: EvidenceType;
  verificationStatus: VerificationStatus;
  isTransferable: boolean;
  isUserAdded?: boolean;
}

/**
 * Conflict & Contradiction Categories
 */
export type ConflictCategory =
  | 'compatible-preferences'   // Apparent tension that actually coexists cleanly
  | 'context-dependent'       // Preference changes based on situational context
  | 'potential-trade-offs'     // Inherent trade-off requiring conscious compromise
  | 'unresolved-information'   // Information gaps prevent clear reconciliation
  | 'contradictory-evidence';  // Direct conflict between stated desires and reported constraints

export interface ProfileConflict {
  conflictId: string;
  category: ConflictCategory;
  title: string;
  explanation: string;
  competingSignalIds: string[];
  involvedQuestionIds: string[];
  userResolutionStatus: 'unresolved' | 'confirmed-trade-off' | 'clarified' | 'dismissed';
  userResolutionNotes?: string;
  suggestedAction: string;
}

/**
 * Potential Growth Area Item
 */
export interface GrowthAreaItem {
  areaId: string;
  dimensionKey: IntelligenceDimensionKey;
  title: string;
  description: string;
  gapType: 'knowledge-gap' | 'experience-gap' | 'credential-gap' | 'untested-capability';
  suggestedAction: string;
  priority: 'high' | 'medium' | 'exploratory';
}

/**
 * Dimensions Summary Record
 */
export interface ProfileDimensionRecord {
  dimensionKey: IntelligenceDimensionKey;
  meta: IntelligenceDimensionMeta;
  calibrationDepth: number; // 0.0 to 1.0
  confidenceSummary: ConfidenceLevel;
  totalSignalsCount: number;
  confirmedSignalsCount: number;
  signals: ProfileSignal[];
  evidenceRecords: EvidenceRecord[];
  missingInformationNotes: string[];
  uncertaintyNotes: string[];
  userConfirmationStatus: 'unreviewed' | 'partially-reviewed' | 'fully-confirmed';
}

/**
 * Comprehensive Work & Environmental Preferences
 */
export interface ProfilePreferencesRecord {
  autonomyVsStructured: number; // -1.0 (strict structure) to 1.0 (full autonomy)
  peopleVsSolo: number;         // -1.0 (solo execution) to 1.0 (constant people)
  dataVsIdeas: number;          // -1.0 (pure data) to 1.0 (pure ideas)
  varietyVsPredictability: number; // -1.0 (predictable) to 1.0 (dynamic variety)
  remoteArrangement: 'remote-first' | 'hybrid' | 'onsite-specialized' | 'flexible';
  paceAndRhythm: string;
  interactionDensity: string;
  physicalEnvironment: string;
  coexistingPreferences: string[];
}

/**
 * Hard Constraints vs Flexible Preferences
 */
export interface ProfileConstraintsRecord {
  hardConstraints: Array<{
    id: string;
    label: string;
    description: string;
    isPermanent: boolean;
  }>;
  flexiblePreferences: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  educationBaseline: string;
  geographicBounds: string;
  financialRunwayMonths: number;
  availableWeeklyHours: number;
  trainingCapacityDescription: string;
}

/**
 * Career Ambitions & Goals
 */
export interface ProfileGoalsRecord {
  riskScore: number; // 0 (security) to 100 (high volatility risk)
  desiredResponsibilityLevel: string;
  fiveYearVisionText?: string;
  primaryMotivators: string[];
  topRankedValues: string[];
  acceptableCompromises: string[];
  dealBreakers: string[];
}

/**
 * Profile Summary Synthesis
 */
export interface ProfileSummaryReport {
  executiveSynthesis: string;
  primaryArchetypeIntersections: string[];
  signalCompletenessPercent: number;
  globalUncertaintyQuotient: number; // 0 (crystal clear) to 100 (high ambiguity)
  strengthsHighlights: string[];
  unexploredCuriosities: string[];
  criticalTradeOffsSummary: string[];
}

/**
 * Master Personal Intelligence Profile
 */
export interface PersonalIntelligenceProfile {
  profileId: string;
  userId: string;
  userName: string;
  schemaVersion: '3.0.0';
  assessmentVersion: string;
  generatedAt: string;
  lastUpdatedAt: string;
  completionStatus: 'unstarted' | 'in-progress' | 'calibrated' | 'verified';
  profileDimensions: Record<IntelligenceDimensionKey, ProfileDimensionRecord>;
  signals: ProfileSignal[];
  evidence: EvidenceRecord[];
  uncertainties: ProfileConflict[]; // Conflicts & uncertainties
  preferences: ProfilePreferencesRecord;
  constraints: ProfileConstraintsRecord;
  goals: ProfileGoalsRecord;
  skillInventory: ProfileSkillItem[];
  growthAreas: GrowthAreaItem[];
  profileSummary: ProfileSummaryReport;
  userCorrections: Record<string, UserCorrectionRecord>;
}
