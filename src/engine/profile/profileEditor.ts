// ============================================================================
// CAREER PILOT — PROFILE EDITOR
// User-controlled profile modifications, overrides, and evidence confirmations
// ============================================================================

import type {
  PersonalIntelligenceProfile,
  UserCorrectionRecord,
  ProfileSkillItem,
} from '../../types/profileIntelligence';

/**
 * Confirms an inferred signal as accurate and endorsed by the user.
 */
export const confirmSignal = (
  profile: PersonalIntelligenceProfile,
  signalId: string
): PersonalIntelligenceProfile => {
  const updatedSignals = profile.signals.map((sig) => {
    if (sig.signalId === signalId) {
      return {
        ...sig,
        status: 'confirmed' as const,
        confidenceLevel: 'strongly-supported' as const,
        lastUpdatedAt: new Date().toISOString(),
      };
    }
    return sig;
  });

  const correction: UserCorrectionRecord = {
    correctionId: `corr-confirm-${signalId}-${Date.now()}`,
    targetSignalId: signalId,
    dimensionKey: profile.signals.find((s) => s.signalId === signalId)?.dimensionKey || 'interestIntelligence',
    field: 'status',
    originalValue: 'inferred',
    correctedValue: 'confirmed',
    reason: 'User explicitly confirmed finding as accurate.',
    timestamp: new Date().toISOString(),
  };

  const updatedProfile: PersonalIntelligenceProfile = {
    ...profile,
    signals: updatedSignals,
    userCorrections: {
      ...profile.userCorrections,
      [correction.correctionId]: correction,
    },
    lastUpdatedAt: new Date().toISOString(),
  };

  return syncDimensionsWithSignals(updatedProfile);
};

/**
 * Rejects an inaccurate or misleading signal.
 */
export const rejectSignal = (
  profile: PersonalIntelligenceProfile,
  signalId: string,
  reason?: string
): PersonalIntelligenceProfile => {
  const updatedSignals = profile.signals.map((sig) => {
    if (sig.signalId === signalId) {
      return {
        ...sig,
        status: 'rejected' as const,
        confidenceLevel: 'requires-clarification' as const,
        userNotes: reason,
        lastUpdatedAt: new Date().toISOString(),
      };
    }
    return sig;
  });

  const correction: UserCorrectionRecord = {
    correctionId: `corr-reject-${signalId}-${Date.now()}`,
    targetSignalId: signalId,
    dimensionKey: profile.signals.find((s) => s.signalId === signalId)?.dimensionKey || 'interestIntelligence',
    field: 'status',
    originalValue: 'inferred',
    correctedValue: 'rejected',
    reason: reason || 'User rejected signal as inaccurate or inapplicable.',
    timestamp: new Date().toISOString(),
  };

  const updatedProfile: PersonalIntelligenceProfile = {
    ...profile,
    signals: updatedSignals,
    userCorrections: {
      ...profile.userCorrections,
      [correction.correctionId]: correction,
    },
    lastUpdatedAt: new Date().toISOString(),
  };

  return syncDimensionsWithSignals(updatedProfile);
};

/**
 * Corrects/overrides the specific name or description of a signal.
 */
export const correctSignal = (
  profile: PersonalIntelligenceProfile,
  signalId: string,
  correctedName: string,
  correctedDescription: string,
  reason?: string
): PersonalIntelligenceProfile => {
  const target = profile.signals.find((s) => s.signalId === signalId);
  if (!target) return profile;

  const updatedSignals = profile.signals.map((sig) => {
    if (sig.signalId === signalId) {
      return {
        ...sig,
        name: correctedName,
        description: correctedDescription,
        status: 'corrected' as const,
        confidenceLevel: 'strongly-supported' as const,
        userNotes: reason,
        lastUpdatedAt: new Date().toISOString(),
      };
    }
    return sig;
  });

  const correction: UserCorrectionRecord = {
    correctionId: `corr-edit-${signalId}-${Date.now()}`,
    targetSignalId: signalId,
    dimensionKey: target.dimensionKey,
    field: 'nameAndDescription',
    originalValue: { name: target.name, description: target.description },
    correctedValue: { name: correctedName, description: correctedDescription },
    reason: reason || 'User provided manual refinement.',
    timestamp: new Date().toISOString(),
  };

  const updatedProfile: PersonalIntelligenceProfile = {
    ...profile,
    signals: updatedSignals,
    userCorrections: {
      ...profile.userCorrections,
      [correction.correctionId]: correction,
    },
    lastUpdatedAt: new Date().toISOString(),
  };

  return syncDimensionsWithSignals(updatedProfile);
};

/**
 * Adds a custom user-defined skill to the inventory.
 */
export const addCustomSkill = (
  profile: PersonalIntelligenceProfile,
  skill: Omit<ProfileSkillItem, 'skillId' | 'isUserAdded'>
): PersonalIntelligenceProfile => {
  const newSkill: ProfileSkillItem = {
    ...skill,
    skillId: `custom-skill-${Date.now().toString(36)}`,
    isUserAdded: true,
    verificationStatus: 'user-verified',
    evidenceSource: 'user-confirmed',
  };

  return {
    ...profile,
    skillInventory: [...profile.skillInventory, newSkill],
    lastUpdatedAt: new Date().toISOString(),
  };
};

/**
 * Updates a conflict resolution status.
 */
export const resolveConflict = (
  profile: PersonalIntelligenceProfile,
  conflictId: string,
  status: 'confirmed-trade-off' | 'clarified' | 'dismissed',
  notes?: string
): PersonalIntelligenceProfile => {
  const updatedConflicts = profile.uncertainties.map((c) => {
    if (c.conflictId === conflictId) {
      return {
        ...c,
        userResolutionStatus: status,
        userResolutionNotes: notes,
      };
    }
    return c;
  });

  return {
    ...profile,
    uncertainties: updatedConflicts,
    lastUpdatedAt: new Date().toISOString(),
  };
};

/**
 * Internal helper to re-synchronize dimensional records with updated signals.
 */
const syncDimensionsWithSignals = (
  profile: PersonalIntelligenceProfile
): PersonalIntelligenceProfile => {
  const updatedDims = { ...profile.profileDimensions };

  for (const dimKey of Object.keys(updatedDims) as (keyof typeof updatedDims)[]) {
    const dimSignals = profile.signals.filter((s) => s.dimensionKey === dimKey && s.status !== 'rejected');
    const confirmedCount = dimSignals.filter((s) => s.status === 'confirmed').length;

    updatedDims[dimKey] = {
      ...updatedDims[dimKey],
      signals: dimSignals,
      totalSignalsCount: dimSignals.length,
      confirmedSignalsCount: confirmedCount,
      userConfirmationStatus:
        confirmedCount === dimSignals.length && dimSignals.length > 0
          ? 'fully-confirmed'
          : confirmedCount > 0
          ? 'partially-reviewed'
          : 'unreviewed',
    };
  }

  return {
    ...profile,
    profileDimensions: updatedDims,
  };
};
