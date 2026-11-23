import { createContext } from 'react';
import type { UserProfileState, DimensionKey } from '../types/profile';
import type { ProfileSkillItem } from '../types/profileIntelligence';
import type { UserFeedbackType, UserCareerFeedbackItem, MatchingWeightsConfig } from '../types/occupation';
import type { SavedPathwayItem, GeneratedPathway, MilestoneProgressStatus } from '../types/careerGraph';

export type Destination =
  | 'discovery'
  | 'profile'
  | 'atlas'
  | 'pathways'
  | 'compare'
  | 'roadmap';

export interface CareerPilotContextType {
  destination: Destination;
  setDestination: (dest: Destination) => void;
  profile: UserProfileState;
  updateAnswer: (
    questionId: string,
    value: any,
    dimensionKey: DimensionKey,
    dimensionImpact?: Partial<Record<DimensionKey, number>>
  ) => void;
  toggleBookmarkCareer: (careerId: string) => void;
  comparedCareerIds: string[];
  toggleCompareCareer: (careerId: string) => void;
  activePathwayCareerId: string | null;
  setActivePathwayCareerId: (careerId: string | null) => void;
  exportProfile: () => void;
  importProfile: (jsonString: string) => boolean;
  resetProfile: () => void;
  setUserName: (name: string) => void;
  confirmSignal: (signalId: string) => void;
  rejectSignal: (signalId: string, reason?: string) => void;
  correctSignal: (signalId: string, name: string, description: string, reason?: string) => void;
  addCustomSkill: (skill: Omit<ProfileSkillItem, 'skillId' | 'isUserAdded'>) => void;
  resolveConflict: (conflictId: string, status: 'confirmed-trade-off' | 'clarified' | 'dismissed', notes?: string) => void;
  recomputeProfile: () => void;
  careerFeedback: Record<string, UserCareerFeedbackItem>;
  setCareerFeedback: (occupationId: string, feedback: UserFeedbackType, notes?: string) => void;
  clearCareerFeedback: (occupationId: string) => void;
  matchingWeights: MatchingWeightsConfig;
  setMatchingWeights: (weights: MatchingWeightsConfig) => void;
  savedPathways: Record<string, SavedPathwayItem>;
  savePathway: (pathway: GeneratedPathway, notes?: string) => void;
  removeSavedPathway: (pathwayId: string) => void;
  updateMilestoneStatus: (pathwayId: string, milestoneId: string, status: MilestoneProgressStatus) => void;
  togglePinMilestone: (pathwayId: string, milestoneId: string) => void;
  completedSkillIds: string[];
  markSkillCompleted: (skillId: string) => void;
  unmarkSkillCompleted: (skillId: string) => void;
  comparedPathwayIds: string[];
  toggleComparePathway: (pathwayId: string) => void;
}

export const CareerPilotContext = createContext<CareerPilotContextType | null>(null);
