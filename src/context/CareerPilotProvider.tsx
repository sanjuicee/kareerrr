import React, { useState, useEffect } from 'react';
import type { UserProfileState, DimensionKey } from '../types/profile';
import type { ProfileSkillItem } from '../types/profileIntelligence';
import type { Destination } from './CareerPilotContextTypes';
import { CareerPilotContext } from './CareerPilotContextTypes';
import type { UserFeedbackType, MatchingWeightsConfig } from '../types/occupation';
import type { GeneratedPathway, MilestoneProgressStatus } from '../types/careerGraph';
import { DEFAULT_MATCHING_WEIGHTS } from '../types/occupation';
import { loadStoredProfile, saveStoredProfile, purgeStoredProfile, exportProfileJson, importProfileJson } from '../utils/storage';
import { generatePersonalIntelligenceProfile } from '../engine/profile/profileGenerator';
import { confirmSignal, rejectSignal, correctSignal, addCustomSkill, resolveConflict } from '../engine/profile/profileEditor';

export const CareerPilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfileState>(loadStoredProfile);
  const [destination, setDestination] = useState<Destination>('discovery');
  const [comparedCareerIds, setComparedCareerIds] = useState<string[]>([]);
  const [comparedPathwayIds, setComparedPathwayIds] = useState<string[]>([]);
  const [activePathwayCareerId, setActivePathwayCareerId] = useState<string | null>(null);
  const [matchingWeights, setMatchingWeights] = useState<MatchingWeightsConfig>(DEFAULT_MATCHING_WEIGHTS);

  // Sync to local storage whenever profile changes
  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  const updateAnswer = (
    questionId: string,
    value: any,
    dimensionKey: DimensionKey,
    dimensionImpact?: Partial<Record<DimensionKey, number>>
  ) => {
    setProfile((prev) => {
      const newAnswers = { ...prev.answers, [questionId]: value };
      const totalAnswered = Object.keys(newAnswers).length;
      
      // Update completion percentage based on expected 34 core questions
      const completionPercentage = Math.min(100, Math.round((totalAnswered / 34) * 100));
      
      // Uncertainty reduces as more high-signal answers are logged
      const uncertaintyScore = Math.max(10, Math.round(90 - (totalAnswered * 2.2)));

      // Update dimension vector progress
      const updatedDimensionVectors = { ...prev.explodedSelf.dimensionVectors };
      const currentDimVal = updatedDimensionVectors[dimensionKey] || 0.1;
      updatedDimensionVectors[dimensionKey] = Math.min(1.0, currentDimVal + 0.12);

      // Apply dimensional impact if specified
      if (dimensionImpact) {
        Object.entries(dimensionImpact).forEach(([k, delta]) => {
          const dim = k as DimensionKey;
          if (updatedDimensionVectors[dim] !== undefined && delta) {
            updatedDimensionVectors[dim] = Math.max(0.1, Math.min(1.0, updatedDimensionVectors[dim] + delta));
          }
        });
      }

      // Recalculate intelligence profile preserving user overrides
      const intelligenceProfile = generatePersonalIntelligenceProfile(newAnswers, {
        existingProfile: prev.intelligenceProfile,
        userName: prev.userName,
      });

      return {
        ...prev,
        answers: newAnswers,
        completionPercentage,
        uncertaintyScore,
        explodedSelf: {
          ...prev.explodedSelf,
          dimensionVectors: updatedDimensionVectors,
        },
        intelligenceProfile,
      };
    });
  };

  const toggleBookmarkCareer = (careerId: string) => {
    setProfile((prev) => {
      const exists = prev.bookmarkedCareers.includes(careerId);
      const updated = exists
        ? prev.bookmarkedCareers.filter((id) => id !== careerId)
        : [...prev.bookmarkedCareers, careerId];
      return { ...prev, bookmarkedCareers: updated };
    });
  };

  const toggleCompareCareer = (careerId: string) => {
    setComparedCareerIds((prev) => {
      if (prev.includes(careerId)) {
        return prev.filter((id) => id !== careerId);
      }
      if (prev.length >= 3) {
        // limit to 3 for clean side-by-side technical comparison
        return [...prev.slice(1), careerId];
      }
      return [...prev, careerId];
    });
  };

  const exportProfile = () => {
    exportProfileJson(profile);
  };

  const importProfile = (jsonString: string): boolean => {
    try {
      const imported = importProfileJson(jsonString);
      setProfile(imported);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const resetProfile = () => {
    const fresh = purgeStoredProfile();
    setProfile(fresh);
    setComparedCareerIds([]);
    setActivePathwayCareerId(null);
  };

  const setUserName = (name: string) => {
    setProfile((prev) => {
      const updated = { ...prev, userName: name };
      if (updated.intelligenceProfile) {
        updated.intelligenceProfile = { ...updated.intelligenceProfile, userName: name };
      }
      return updated;
    });
  };

  const confirmSignalHandler = (signalId: string) => {
    setProfile((prev) => {
      if (!prev.intelligenceProfile) return prev;
      const updated = confirmSignal(prev.intelligenceProfile, signalId);
      return { ...prev, intelligenceProfile: updated };
    });
  };

  const rejectSignalHandler = (signalId: string, reason?: string) => {
    setProfile((prev) => {
      if (!prev.intelligenceProfile) return prev;
      const updated = rejectSignal(prev.intelligenceProfile, signalId, reason);
      return { ...prev, intelligenceProfile: updated };
    });
  };

  const correctSignalHandler = (
    signalId: string,
    name: string,
    description: string,
    reason?: string
  ) => {
    setProfile((prev) => {
      if (!prev.intelligenceProfile) return prev;
      const updated = correctSignal(prev.intelligenceProfile, signalId, name, description, reason);
      return { ...prev, intelligenceProfile: updated };
    });
  };

  const addCustomSkillHandler = (
    skill: Omit<ProfileSkillItem, 'skillId' | 'isUserAdded'>
  ) => {
    setProfile((prev) => {
      if (!prev.intelligenceProfile) return prev;
      const updated = addCustomSkill(prev.intelligenceProfile, skill);
      return { ...prev, intelligenceProfile: updated };
    });
  };

  const resolveConflictHandler = (
    conflictId: string,
    status: 'confirmed-trade-off' | 'clarified' | 'dismissed',
    notes?: string
  ) => {
    setProfile((prev) => {
      if (!prev.intelligenceProfile) return prev;
      const updated = resolveConflict(prev.intelligenceProfile, conflictId, status, notes);
      return { ...prev, intelligenceProfile: updated };
    });
  };

  const recomputeProfileHandler = () => {
    setProfile((prev) => {
      const updated = generatePersonalIntelligenceProfile(prev.answers, {
        existingProfile: prev.intelligenceProfile,
        userName: prev.userName,
      });
      return { ...prev, intelligenceProfile: updated };
    });
  };

  const setCareerFeedbackHandler = (
    occupationId: string,
    feedback: UserFeedbackType,
    notes?: string
  ) => {
    setProfile((prev) => {
      const currentFeedback = prev.careerFeedback || {};
      const updatedFeedback = {
        ...currentFeedback,
        [occupationId]: {
          occupationId,
          feedback,
          notes,
          timestamp: new Date().toISOString(),
        },
      };
      return { ...prev, careerFeedback: updatedFeedback };
    });
  };

  const clearCareerFeedbackHandler = (occupationId: string) => {
    setProfile((prev) => {
      const currentFeedback = { ...(prev.careerFeedback || {}) };
      delete currentFeedback[occupationId];
      return { ...prev, careerFeedback: currentFeedback };
    });
  };

  const savePathwayHandler = (pathway: GeneratedPathway, notes?: string) => {
    setProfile((prev) => {
      const currentSaved = prev.savedPathways || {};
      const milestones = pathway.steps.map((step) => ({
        id: `ms-${pathway.id}-${step.stepIndex}`,
        pathwayId: pathway.id,
        stepIndex: step.stepIndex,
        title: step.title,
        status: (step.isCompleted ? 'completed' : 'not-started') as MilestoneProgressStatus,
        isPinned: step.stepIndex === 1,
      }));

      const updatedSaved = {
        ...currentSaved,
        [pathway.id]: {
          pathwayId: pathway.id,
          pathway,
          savedAt: new Date().toISOString(),
          customNotes: notes,
          isPrimaryTarget: Object.keys(currentSaved).length === 0,
          milestones,
          completedSkillIds: [],
        },
      };

      return { ...prev, savedPathways: updatedSaved };
    });
  };

  const removeSavedPathwayHandler = (pathwayId: string) => {
    setProfile((prev) => {
      const currentSaved = { ...(prev.savedPathways || {}) };
      delete currentSaved[pathwayId];
      return { ...prev, savedPathways: currentSaved };
    });
  };

  const updateMilestoneStatusHandler = (
    pathwayId: string,
    milestoneId: string,
    status: MilestoneProgressStatus
  ) => {
    setProfile((prev) => {
      const currentSaved = { ...(prev.savedPathways || {}) };
      const item = currentSaved[pathwayId];
      if (!item) return prev;

      const updatedMilestones = item.milestones.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return m;
      });

      currentSaved[pathwayId] = { ...item, milestones: updatedMilestones };
      return { ...prev, savedPathways: currentSaved };
    });
  };

  const togglePinMilestoneHandler = (pathwayId: string, milestoneId: string) => {
    setProfile((prev) => {
      const currentSaved = { ...(prev.savedPathways || {}) };
      const item = currentSaved[pathwayId];
      if (!item) return prev;

      const updatedMilestones = item.milestones.map((m) =>
        m.id === milestoneId ? { ...m, isPinned: !m.isPinned } : m
      );

      currentSaved[pathwayId] = { ...item, milestones: updatedMilestones };
      return { ...prev, savedPathways: currentSaved };
    });
  };

  const markSkillCompletedHandler = (skillId: string) => {
    setProfile((prev) => {
      const currentSkills = prev.completedSkillIds || [];
      if (currentSkills.includes(skillId)) return prev;
      return { ...prev, completedSkillIds: [...currentSkills, skillId] };
    });
  };

  const unmarkSkillCompletedHandler = (skillId: string) => {
    setProfile((prev) => {
      const currentSkills = prev.completedSkillIds || [];
      return { ...prev, completedSkillIds: currentSkills.filter((id) => id !== skillId) };
    });
  };

  const toggleComparePathwayHandler = (pathwayId: string) => {
    setComparedPathwayIds((prev) => {
      if (prev.includes(pathwayId)) {
        return prev.filter((id) => id !== pathwayId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), pathwayId];
      }
      return [...prev, pathwayId];
    });
  };

  const careerFeedback = profile.careerFeedback || {};
  const savedPathways = profile.savedPathways || {};
  const completedSkillIds = profile.completedSkillIds || [];

  return (
    <CareerPilotContext.Provider
      value={{
        destination,
        setDestination,
        profile,
        updateAnswer,
        toggleBookmarkCareer,
        comparedCareerIds,
        toggleCompareCareer,
        activePathwayCareerId,
        setActivePathwayCareerId,
        exportProfile,
        importProfile,
        resetProfile,
        setUserName,
        confirmSignal: confirmSignalHandler,
        rejectSignal: rejectSignalHandler,
        correctSignal: correctSignalHandler,
        addCustomSkill: addCustomSkillHandler,
        resolveConflict: resolveConflictHandler,
        recomputeProfile: recomputeProfileHandler,
        careerFeedback,
        setCareerFeedback: setCareerFeedbackHandler,
        clearCareerFeedback: clearCareerFeedbackHandler,
        matchingWeights,
        setMatchingWeights,
        savedPathways,
        savePathway: savePathwayHandler,
        removeSavedPathway: removeSavedPathwayHandler,
        updateMilestoneStatus: updateMilestoneStatusHandler,
        togglePinMilestone: togglePinMilestoneHandler,
        completedSkillIds,
        markSkillCompleted: markSkillCompletedHandler,
        unmarkSkillCompleted: unmarkSkillCompletedHandler,
        comparedPathwayIds,
        toggleComparePathway: toggleComparePathwayHandler,
      }}
    >
      {children}
    </CareerPilotContext.Provider>
  );
};
