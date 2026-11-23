// ============================================================================
// CAREER PILOT — CAREER KNOWLEDGE GRAPH & PATHWAY DATA MODEL
// Strongly-typed entities, graph relationships, and dynamic pathway schema
// ============================================================================

// ----------------------------------------------------------------------------
// 1. GRAPH NODE SCHEMAS
// ----------------------------------------------------------------------------

export type GraphNodeType =
  | 'education'
  | 'skill'
  | 'experience'
  | 'occupation'
  | 'industry'
  | 'specialization'
  | 'goal';

export type QualificationLevel =
  | 'High School / Secondary'
  | 'Vocational Certificate'
  | 'Associate Degree'
  | 'Bachelor’s Degree'
  | 'Master’s Degree'
  | 'Doctorate / Ph.D.'
  | 'Professional Certification'
  | 'Apprenticeship / Bootcamp';

export interface EducationNode {
  id: string; // e.g. "edu-bs-cs"
  type: 'education';
  name: string;
  qualificationLevel: QualificationLevel;
  fieldOfStudy: string;
  entryRequirements: string[];
  geographicApplicability: ('Global' | 'US' | 'EU' | 'India')[];
  typicalDurationMonths: number;
  costRangeUsd?: { min: number; max: number };
  costRangeInr?: { min: number; max: number }; // In INR Lakhs
  isAccredited: boolean;
  officialReference?: string;
  verificationStatus: 'verified' | 'source-supported' | 'suggested-route';
}

export interface SkillNode {
  id: string; // e.g. "skill-distributed-systems"
  type: 'skill';
  name: string;
  category: 'foundational' | 'technical' | 'analytical' | 'scientific' | 'creative' | 'practical' | 'leadership' | 'emerging';
  description: string;
  prerequisiteSkillIds: string[];
  suggestedLearningMethods: string[];
  isTransferable: boolean;
  evidenceSource: string;
  proficiencyLevelSupported: 'foundational' | 'intermediate' | 'advanced' | 'mastery';
}

export interface ExperienceNode {
  id: string; // e.g. "exp-open-source-contributor"
  type: 'experience';
  title: string;
  experienceType: 'academic-project' | 'personal-project' | 'research-lab' | 'internship' | 'apprenticeship' | 'open-source' | 'entry-employment' | 'professional-practice';
  description: string;
  typicalDurationMonths: number;
  skillsDemonstrated: string[];
  compensationType: 'unpaid' | 'stipend' | 'market-wage';
}

export interface IntermediateOccupationNode {
  id: string; // e.g. "occ-junior-systems-admin"
  type: 'occupation';
  title: string;
  family: string;
  industry: string;
  careerLevel: 'entry-level' | 'junior' | 'mid-professional' | 'senior' | 'specialized-lead';
  description: string;
  essentialSkillIds: string[];
  isBridgeRole: boolean;
  typicalSalaryUsd: number;
  typicalSalaryInrLpa: number;
  remoteViability: 'high' | 'medium' | 'low';
}

export interface IndustryNode {
  id: string; // e.g. "ind-cloud-infra"
  type: 'industry';
  name: string;
  subfields: string[];
  growthTrajectory: 'Expanding Rapidly' | 'Stable Growth' | 'Emerging Niche';
  description: string;
}

export interface GoalNode {
  id: string; // e.g. "goal-distributed-systems-architect"
  type: 'goal';
  targetOccupationId: string;
  title: string;
  horizonYears: number;
  requiredMilestoneCount: number;
}

export type CareerGraphNode =
  | EducationNode
  | SkillNode
  | ExperienceNode
  | IntermediateOccupationNode
  | IndustryNode
  | GoalNode;

// ----------------------------------------------------------------------------
// 2. GRAPH RELATIONSHIP / EDGE SCHEMAS
// ----------------------------------------------------------------------------

export type GraphRelationshipType =
  | 'requires-skill'
  | 'develops-skill'
  | 'requires-qualification'
  | 'enables-qualification'
  | 'leads-to-occupation'
  | 'enables-entry'
  | 'related-occupation'
  | 'possible-career-transition'
  | 'requires-experience'
  | 'alternative-route'
  | 'specialization-of'
  | 'builds-upon'
  | 'geographic-dependency';

export type EdgeVerificationStatus =
  | 'verified-relationship'
  | 'source-supported'
  | 'suggested-bridge'
  | 'incomplete-information'
  | 'unverified';

export interface GraphEdge {
  id: string; // e.g. "edge-bs-cs-to-occ-distributed"
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: GraphRelationshipType;
  preconditions: string[];
  geographicApplicability: ('Global' | 'US' | 'EU' | 'India')[];
  evidenceSource: string;
  verificationStatus: EdgeVerificationStatus;
  confidenceScore: number; // 0 to 100
  alternativeConditions?: string[];
  weight: number; // graph traversal cost (lower is easier/more direct)
}

// ----------------------------------------------------------------------------
// 3. PATHWAY CATEGORIES & STEP SCHEMAS
// ----------------------------------------------------------------------------

export type PathwayCategory =
  | 'direct-pathway'             // Type A: Standard direct qualification & entry
  | 'skill-based-pathway'        // Type B: Portfolio & practical skills without formal degree reboot
  | 'alternative-education'      // Type C: Bootcamps, diplomas, micro-credentials
  | 'bridge-career'              // Type D: Stepping stone intermediary occupation
  | 'interdisciplinary'          // Type E: Combining 2 distinct inquiry fields
  | 'earn-while-learning'        // Type F: Apprenticeship or part-time work supporting income runway
  | 'long-term-specialization'   // Type G: Broad entry stepping into elite specialization
  | 'career-transition';         // Type H: Lateral pivot leveraging transferable capabilities

export type PathwayArchetype =
  | 'best-fit'
  | 'lowest-barrier'
  | 'fastest-plausible'
  | 'most-flexible'
  | 'strongest-development'
  | 'alternative-entry'
  | 'exploratory-aspirational';

export interface PathwayStep {
  stepIndex: number;
  nodeId: string;
  nodeType: GraphNodeType;
  title: string;
  subtitle: string;
  description: string;
  durationMonths: number;
  isCompleted: boolean;
  isOptional: boolean;
  skillsAcquired: string[];
  qualificationsExamined: string[];
  practicalDeliverables: string[];
  transitionRequirements: string[];
  potentialFrictions: string[];
  alternativeStepIds?: string[];
  edgeUsed?: GraphEdge;
}

export interface GeneratedPathway {
  id: string;
  destinationOccupationId: string;
  destinationTitle: string;
  category: PathwayCategory;
  categoryLabel: string;
  archetype: PathwayArchetype;
  archetypeLabel: string;
  title: string;
  description: string;
  startingPointSummary: string;
  totalDurationMonths: number;
  estimatedCostRangeUsd: { min: number; max: number };
  estimatedCostRangeInr: { min: number; max: number };
  steps: PathwayStep[];
  feasibilityScore: number; // 0 to 100
  riskLevel: 'Low' | 'Moderate' | 'High / Volatile';
  geographicContext: 'Global' | 'US' | 'EU' | 'India';
  validationStatus: 'fully-validated' | 'validated-with-assumptions' | 'requires-verification';
  validationChecks: {
    connectivityValid: boolean;
    prerequisitesOrdered: boolean;
    geographicCompliant: boolean;
    entryFeasible: boolean;
    deadEndFree: boolean;
  };
  evidenceSources: string[];
  tradeOffSummary: {
    primaryAdvantage: string;
    criticalCostOrSacrifice: string;
  };
}

// ----------------------------------------------------------------------------
// 4. USER CAREER COLLECTION & PROGRESS TRACKING
// ----------------------------------------------------------------------------

export type MilestoneProgressStatus =
  | 'not-started'
  | 'exploring'
  | 'preparing'
  | 'in-progress'
  | 'completed'
  | 'paused';

export interface UserCareerMilestone {
  id: string;
  pathwayId: string;
  stepIndex: number;
  title: string;
  status: MilestoneProgressStatus;
  targetCompletionDate?: string;
  completedAt?: string;
  notes?: string;
  isPinned: boolean;
}

export interface SavedPathwayItem {
  pathwayId: string;
  pathway: GeneratedPathway;
  savedAt: string;
  customNotes?: string;
  isPrimaryTarget: boolean;
  milestones: UserCareerMilestone[];
  completedSkillIds: string[];
}

export interface CareerUniverseCollection {
  savedPathways: Record<string, SavedPathwayItem>; // pathwayId -> SavedPathwayItem
  bookmarkedOccupationIds: string[];
  completedSkillIds: string[];
  acquiredQualificationIds: string[];
  userNotes: Record<string, string>; // occupationId or pathwayId -> notes
}

// ----------------------------------------------------------------------------
// 5. UNIVERSE METRICS & TELEMETRY
// ----------------------------------------------------------------------------

export interface CareerUniverseTelemetry {
  totalOccupations: number;
  totalEducationNodes: number;
  totalSkillNodes: number;
  totalExperienceNodes: number;
  totalGraphEdges: number;
  generatedRouteCount: number;
  validatedRouteCount: number;
  rejectedRouteCount: number;
}
