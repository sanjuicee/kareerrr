// ============================================================================
// CAREER PILOT — PROFILE GENERATOR
// Master Orchestrator for Personal Intelligence Profile Synthesis
// ============================================================================

import type {
  PersonalIntelligenceProfile,
  IntelligenceDimensionKey,
  ProfileDimensionRecord,
  ProfileSignal,
  EvidenceRecord,
  UserCorrectionRecord,
} from '../../types/profileIntelligence';
import { INTELLIGENCE_DIMENSIONS } from '../../types/profileIntelligence';
import {
  extractInterestSignals,
  extractAbilitySignals,
  extractSkillSignals,
  extractWorkSignals,
  extractValuesSignals,
  extractGrowthSignals,
  extractGrowthAreas,
  generateProfileSummaryReport,
} from './profileEngine';
import { detectProfileConflicts } from './conflictDetector';

export interface ProfileGenerationOptions {
  profileId?: string;
  userId?: string;
  userName?: string;
  existingProfile?: PersonalIntelligenceProfile | null;
}

/**
 * Deterministically constructs a complete Personal Intelligence Profile
 * from raw assessment responses while strictly preserving all prior user corrections.
 */
export const generatePersonalIntelligenceProfile = (
  answers: Record<string, any>,
  options: ProfileGenerationOptions = {}
): PersonalIntelligenceProfile => {
  const {
    profileId = options.existingProfile?.profileId || `pip-${Date.now().toString(36)}`,
    userId = options.existingProfile?.userId || 'usr-local-operator',
    userName = options.existingProfile?.userName || options.userName || 'Operator',
    existingProfile = null,
  } = options;

  // 1. Extract signals and records across all 6 intelligence dimensions
  const interestSignals = extractInterestSignals(answers);
  const abilitySignals = extractAbilitySignals(answers);
  const { signals: skillSignals, inventory: rawSkillInventory } = extractSkillSignals(answers);
  const { signals: workSignals, preferences } = extractWorkSignals(answers);
  const { signals: valuesSignals, goals: valuesGoals } = extractValuesSignals(answers);
  const { signals: growthSignals, constraints, goalsUpdate } = extractGrowthSignals(answers);

  // 2. Combine all raw inferred signals
  let allSignals: ProfileSignal[] = [
    ...interestSignals,
    ...abilitySignals,
    ...skillSignals,
    ...workSignals,
    ...valuesSignals,
    ...growthSignals,
  ];

  // 3. Collect all associated evidence records
  const allEvidence: EvidenceRecord[] = [];
  allSignals.forEach((sig) => {
    sig.evidenceRecords.forEach((ev) => {
      if (!allEvidence.some((existing) => existing.evidenceId === ev.evidenceId)) {
        allEvidence.push(ev);
      }
    });
  });

  // 4. Detect conflicts and trade-offs
  const conflicts = detectProfileConflicts(answers);

  // If existing profile has conflict resolutions, preserve them
  if (existingProfile?.uncertainties) {
    existingProfile.uncertainties.forEach((oldConf) => {
      const match = conflicts.find((c) => c.conflictId === oldConf.conflictId);
      if (match && oldConf.userResolutionStatus !== 'unresolved') {
        match.userResolutionStatus = oldConf.userResolutionStatus;
        match.userResolutionNotes = oldConf.userResolutionNotes;
      }
    });
  }

  // 5. Growth areas
  const growthAreas = extractGrowthAreas(answers, rawSkillInventory);

  // 6. Assemble Goals Record
  const goals = {
    riskScore: goalsUpdate.riskScore ?? 50,
    desiredResponsibilityLevel: goalsUpdate.desiredResponsibilityLevel || 'Specialized Lead',
    fiveYearVisionText: goalsUpdate.fiveYearVisionText,
    primaryMotivators: valuesGoals.primaryMotivators || [],
    topRankedValues: valuesGoals.topRankedValues || [],
    acceptableCompromises: valuesGoals.acceptableCompromises || [],
    dealBreakers: valuesGoals.dealBreakers || [],
  };

  // 7. Replay User Corrections & Overrides from existing profile
  const userCorrections: Record<string, UserCorrectionRecord> = {
    ...(existingProfile?.userCorrections || {}),
  };

  if (Object.keys(userCorrections).length > 0) {
    allSignals = allSignals.map((sig) => {
      // Find matching correction by targetSignalId
      const matchingCorrection = Object.values(userCorrections).find(
        (c) => c.targetSignalId === sig.signalId
      );

      if (matchingCorrection) {
        if (matchingCorrection.field === 'status') {
          return {
            ...sig,
            status: matchingCorrection.correctedValue,
            confidenceLevel:
              matchingCorrection.correctedValue === 'confirmed'
                ? ('strongly-supported' as const)
                : matchingCorrection.correctedValue === 'rejected'
                ? ('requires-clarification' as const)
                : sig.confidenceLevel,
            userNotes: matchingCorrection.reason,
            lastUpdatedAt: matchingCorrection.timestamp,
          };
        } else if (matchingCorrection.field === 'nameAndDescription') {
          return {
            ...sig,
            name: matchingCorrection.correctedValue.name,
            description: matchingCorrection.correctedValue.description,
            status: 'corrected' as const,
            confidenceLevel: 'strongly-supported' as const,
            userNotes: matchingCorrection.reason,
            lastUpdatedAt: matchingCorrection.timestamp,
          };
        }
      }
      return sig;
    });
  }

  // 8. Reconstruct Skill Inventory (merging user-added custom skills)
  let skillInventory = [...rawSkillInventory];
  if (existingProfile?.skillInventory) {
    const customSkills = existingProfile.skillInventory.filter((s) => s.isUserAdded);
    skillInventory = [...skillInventory, ...customSkills];
  }

  // 9. Construct Dimension Records
  const dimensionKeys = Object.keys(INTELLIGENCE_DIMENSIONS) as IntelligenceDimensionKey[];
  const profileDimensions: Record<IntelligenceDimensionKey, ProfileDimensionRecord> = {} as any;

  dimensionKeys.forEach((key) => {
    const meta = INTELLIGENCE_DIMENSIONS[key];
    const dimSignals = allSignals.filter((s) => s.dimensionKey === key && s.status !== 'rejected');
    const confirmedCount = dimSignals.filter((s) => s.status === 'confirmed').length;

    // Calculate calibration depth based on questions answered in this dimension
    const contributingProbesCount = meta.contributingQuestionDimensions.reduce((acc, dim) => {
      // Approximate calibration count
      if (dim === 'interests') return acc + countAnswered(answers, ['Q01', 'Q02', 'Q03', 'Q04', 'Q05', 'Q-FOLLOW-A']);
      if (dim === 'aptitudes') return acc + countAnswered(answers, ['Q06', 'Q07', 'Q08', 'Q09', 'Q10', 'Q-FOLLOW-B', 'Q-FOLLOW-C']);
      if (dim === 'skills') return acc + countAnswered(answers, ['Q11', 'Q12', 'Q13', 'Q14', 'Q-FOLLOW-D']);
      if (dim === 'workStyle') return acc + countAnswered(answers, ['Q15', 'Q16', 'Q17', 'Q18', 'Q23', 'Q24', 'Q25', 'Q-FOLLOW-E']);
      if (dim === 'values') return acc + countAnswered(answers, ['Q19', 'Q20', 'Q21', 'Q22']);
      return acc + countAnswered(answers, ['Q26', 'Q27', 'Q28', 'Q29', 'Q30', 'Q31', 'Q32', 'Q33', 'Q34', 'Q-FOLLOW-F']);
    }, 0);

    const calibrationDepth = Math.min(1.0, Number((contributingProbesCount / 5).toFixed(2)));

    // Missing information notes
    const missingNotes: string[] = [];
    if (dimSignals.length === 0) {
      missingNotes.push(`No response signals captured for ${meta.label}. Complete relevant discovery probes.`);
    } else if (dimSignals.some((s) => s.confidenceLevel === 'limited-evidence')) {
      missingNotes.push(`Some findings in ${meta.label} rest on single self-reported selections without external examples.`);
    }

    // Uncertainty notes
    const dimConflicts = conflicts.filter((c) =>
      c.competingSignalIds.some((sId) => dimSignals.some((s) => s.signalId === sId))
    );
    const uncertaintyNotes = dimConflicts.map((c) => c.explanation);

    profileDimensions[key] = {
      dimensionKey: key,
      meta,
      calibrationDepth,
      confidenceSummary:
        dimSignals.length === 0
          ? 'requires-clarification'
          : dimSignals.some((s) => s.confidenceLevel === 'strongly-supported')
          ? 'strongly-supported'
          : 'moderately-supported',
      totalSignalsCount: dimSignals.length,
      confirmedSignalsCount: confirmedCount,
      signals: dimSignals,
      evidenceRecords: dimSignals.flatMap((s) => s.evidenceRecords),
      missingInformationNotes: missingNotes,
      uncertaintyNotes,
      userConfirmationStatus:
        confirmedCount === dimSignals.length && dimSignals.length > 0
          ? 'fully-confirmed'
          : confirmedCount > 0
          ? 'partially-reviewed'
          : 'unreviewed',
    };
  });

  // 10. Generate Summary Report
  const profileSummary = generateProfileSummaryReport(answers, allSignals, conflicts);

  // 11. Completion Status
  const totalAnswered = Object.keys(answers).length;
  let completionStatus: PersonalIntelligenceProfile['completionStatus'] = 'unstarted';
  if (totalAnswered >= 30) completionStatus = 'calibrated';
  else if (totalAnswered > 0) completionStatus = 'in-progress';

  return {
    profileId,
    userId,
    userName,
    schemaVersion: '3.0.0',
    assessmentVersion: '2.0.0',
    generatedAt: existingProfile?.generatedAt || new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    completionStatus,
    profileDimensions,
    signals: allSignals,
    evidence: allEvidence,
    uncertainties: conflicts,
    preferences,
    constraints,
    goals,
    skillInventory,
    growthAreas,
    profileSummary,
    userCorrections,
  };
};

const countAnswered = (answers: Record<string, any>, qIds: string[]): number => {
  return qIds.filter((id) => {
    const a = answers[id];
    const val = a && typeof a === 'object' && 'value' in a ? a.value : a;
    return val !== undefined && val !== null && val !== '';
  }).length;
};
