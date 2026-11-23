import type { PersonalIntelligenceProfile } from './profileIntelligence';

// The 9 Foundational Dimensions of the Exploded Self

export type DimensionKey =
  | 'interests'
  | 'aptitudes'
  | 'skills'
  | 'workStyle'
  | 'values'
  | 'financialLifestyle'
  | 'education'
  | 'riskTolerance'
  | 'ambitions';

export interface DimensionMetadata {
  key: DimensionKey;
  label: string;
  code: string;
  description: string;
  color: string; // telemetry color hex
  weight: number;
}

export const DIMENSIONS: Record<DimensionKey, DimensionMetadata> = {
  interests: {
    key: 'interests',
    label: 'Interests & Curiosity',
    code: 'DIM-01',
    description: 'Intrinsic inquiry domains, intellectual curiosities, and focus topics.',
    color: '#00F0B4',
    weight: 1.0,
  },
  aptitudes: {
    key: 'aptitudes',
    label: 'Aptitudes & Cognitive Style',
    code: 'DIM-02',
    description: 'Natural cognitive affinities (analytical, spatial, systemic, linguistic).',
    color: '#38BDF8',
    weight: 1.0,
  },
  skills: {
    key: 'skills',
    label: 'Demonstrated Skills',
    code: 'DIM-03',
    description: 'Verifiable technical, operational, and transferable competencies.',
    color: '#818CF8',
    weight: 1.1,
  },
  workStyle: {
    key: 'workStyle',
    label: 'Work Style & Environment',
    code: 'DIM-04',
    description: 'Autonomy, collaboration density, pacing, and physical context.',
    color: '#A78BFA',
    weight: 0.9,
  },
  values: {
    key: 'values',
    label: 'Values & Core Motivations',
    code: 'DIM-05',
    description: 'Intrinsic drivers: autonomy, impact, craftsmanship, status, stability.',
    color: '#F472B6',
    weight: 1.0,
  },
  financialLifestyle: {
    key: 'financialLifestyle',
    label: 'Financial & Lifestyle Constraints',
    code: 'DIM-06',
    description: 'Target compensation floor, work-life boundaries, and location parameters.',
    color: '#F59E0B',
    weight: 0.95,
  },
  education: {
    key: 'education',
    label: 'Education & Qualifications',
    code: 'DIM-07',
    description: 'Formal credentials, certifications, self-taught proficiencies.',
    color: '#34D399',
    weight: 0.85,
  },
  riskTolerance: {
    key: 'riskTolerance',
    label: 'Risk Tolerance & Ambiguity',
    code: 'DIM-08',
    description: 'Willingness to endure volatility, reskilling time, and uncertain outcomes.',
    color: '#FB7185',
    weight: 0.9,
  },
  ambitions: {
    key: 'ambitions',
    label: 'Long-term Ambitions',
    code: 'DIM-09',
    description: '3-10 year strategic horizon: deep specialization, leadership, or entrepreneurship.',
    color: '#C084FC',
    weight: 0.9,
  },
};

export type SkillProficiency = 'exploring' | 'practicing' | 'proficient' | 'mastery';

export interface UserSkillItem {
  id: string;
  name: string;
  category: 'hard' | 'soft' | 'domain' | 'tool';
  proficiency: SkillProficiency;
  verified: boolean;
}

export interface DimensionScoreVector {
  analyticalVsIntuitive: number; // -1.0 to 1.0
  abstractVsConcrete: number;     // -1.0 to 1.0
  autonomyVsStructured: number;   // -1.0 to 1.0
  peopleVsThings: number;         // -1.0 to 1.0
  riskTolerantVsAverse: number;   // -1.0 to 1.0
  speedVsThoroughness: number;    // -1.0 to 1.0
  depthVsBreadth: number;         // -1.0 to 1.0
}

export interface ExplodedSelfProfile {
  dimensionVectors: Record<DimensionKey, number>; // 0.0 to 1.0 completion/clarity
  cognitiveVector: DimensionScoreVector;
  topInterests: string[];
  skillsInventory: UserSkillItem[];
  coreValues: string[];
  workEnvironmentPreferences: {
    remotePreference: 'remote' | 'hybrid' | 'onsite' | 'flexible';
    pace: 'fast' | 'balanced' | 'methodical';
    teamDensity: 'solo' | 'small-team' | 'large-org';
  };
  financialParameters: {
    minimumCompensationUsd: number;
    targetCompensationUsd: number;
    currency: string;
  };
  riskScore: number; // 0 (low) to 100 (high)
  educationLevel: string;
  geographicRegion: string;
}

export interface UserProfileState {
  id: string;
  version: number;
  lastUpdated: string;
  userName: string;
  completionPercentage: number;
  uncertaintyScore: number; // 0 to 100 (lower means higher confidence)
  answers: Record<string, any>; // questionId -> response payload
  explodedSelf: ExplodedSelfProfile;
  bookmarkedCareers: string[];
  activePathwayId?: string;
  intelligenceProfile?: PersonalIntelligenceProfile;
  careerFeedback?: Record<string, import('./occupation').UserCareerFeedbackItem>;
  savedPathways?: Record<string, import('./careerGraph').SavedPathwayItem>;
  completedSkillIds?: string[];
}
