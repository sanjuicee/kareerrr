// ============================================================================
// CAREER PILOT — CONFIDENCE ENGINE
// Transparent confidence determination for profile signals
// ============================================================================

import type { ConfidenceLevel, EvidenceRecord } from '../../types/profileIntelligence';

interface ConfidenceParams {
  evidenceRecords: EvidenceRecord[];
  isUserConfirmed?: boolean;
  hasUncertaintyFlag?: boolean;
  isContested?: boolean;
  isSelfReportedOnly?: boolean;
}

/**
 * Computes a transparent, human-readable confidence level based on
 * available evidence depth, directness, and corroboration.
 */
export const evaluateSignalConfidence = (params: ConfidenceParams): ConfidenceLevel => {
  const {
    evidenceRecords,
    isUserConfirmed = false,
    hasUncertaintyFlag = false,
    isContested = false,
    isSelfReportedOnly = false,
  } = params;

  // 1. If actively contested or conflicting, requires clarification
  if (isContested) {
    return 'requires-clarification';
  }

  // 2. User confirmed findings always achieve strong support
  if (isUserConfirmed) {
    return 'strongly-supported';
  }

  // 3. Check for demonstrated practical application
  const hasDemonstratedApplication = evidenceRecords.some(
    (ev) => ev.evidenceType === 'demonstrated-application' || ev.evidenceType === 'written-description'
  );

  const directAnswerCount = evidenceRecords.filter(
    (ev) => ev.evidenceType === 'direct-selection' || ev.evidenceType === 'self-reported-proficiency'
  ).length;

  // 4. Uncertainty flag degrades confidence
  if (hasUncertaintyFlag) {
    return directAnswerCount >= 2 ? 'emerging-pattern' : 'limited-evidence';
  }

  // 5. Demonstrated practical accomplishment + direct selection -> Strongly Supported
  if (hasDemonstratedApplication && directAnswerCount >= 1) {
    return 'strongly-supported';
  }

  // 6. Multiple independent congruent direct selections without uncertainty -> Moderately Supported
  if (directAnswerCount >= 2 && !isSelfReportedOnly) {
    return 'moderately-supported';
  }

  // 7. Single direct selection or self-reported only with no external corroboration
  if (directAnswerCount === 1) {
    return isSelfReportedOnly ? 'limited-evidence' : 'emerging-pattern';
  }

  // 8. If empty or indirect inference only
  return 'limited-evidence';
};
