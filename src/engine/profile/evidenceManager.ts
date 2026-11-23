// ============================================================================
// CAREER PILOT — EVIDENCE MANAGER
// Traceable evidence extraction from raw assessment responses
// ============================================================================

import type { AssessmentAnswer } from '../../types/assessment';
import type { EvidenceRecord, EvidenceType } from '../../types/profileIntelligence';
import { CORE_QUESTIONS, CONDITIONAL_FOLLOW_UPS } from '../../data/questionBank';

const ALL_QUESTIONS_LOOKUP = new Map<string, string>();

// Precompute question prompts
[...CORE_QUESTIONS, ...CONDITIONAL_FOLLOW_UPS].forEach((q) => {
  ALL_QUESTIONS_LOOKUP.set(q.id, q.prompt);
});

/**
 * Derives an EvidenceRecord from an assessment answer.
 */
export const createEvidenceRecord = (
  questionId: string,
  answer: AssessmentAnswer | any,
  overrideType?: EvidenceType,
  customDisplayText?: string
): EvidenceRecord => {
  const prompt = ALL_QUESTIONS_LOOKUP.get(questionId) || `Probe [${questionId}]`;
  const rawValue =
    answer && typeof answer === 'object' && 'value' in answer ? answer.value : answer;
  const answeredAt =
    answer && typeof answer === 'object' && 'answeredAt' in answer
      ? answer.answeredAt
      : new Date().toISOString();

  // Determine appropriate evidence type if not explicitly overridden
  let evidenceType: EvidenceType = overrideType || 'direct-selection';
  if (!overrideType) {
    if (typeof rawValue === 'string' && rawValue.length > 25) {
      evidenceType = 'written-description';
    } else if (typeof rawValue === 'number') {
      evidenceType = 'self-reported-proficiency';
    } else if (questionId === 'Q10' || questionId === 'Q13') {
      evidenceType = 'demonstrated-application';
    }
  }

  // Generate human-readable display text
  let displayText = customDisplayText;
  if (!displayText) {
    if (typeof rawValue === 'string') {
      displayText = rawValue;
    } else if (Array.isArray(rawValue)) {
      displayText = rawValue.join(', ');
    } else if (typeof rawValue === 'object' && rawValue !== null) {
      displayText = Object.entries(rawValue)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');
    } else {
      displayText = String(rawValue ?? 'Unspecified');
    }
  }

  return {
    evidenceId: `ev-${questionId}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    sourceQuestionId: questionId,
    sourceQuestionPrompt: prompt,
    evidenceType,
    rawValue,
    displayText,
    capturedAt: answeredAt,
  };
};

/**
 * Builds evidence records for an array of question IDs from the user's answers dictionary.
 */
export const collectEvidenceRecords = (
  questionIds: string[],
  answers: Record<string, AssessmentAnswer | any>
): EvidenceRecord[] => {
  const records: EvidenceRecord[] = [];

  for (const qId of questionIds) {
    const ans = answers[qId];
    if (ans !== undefined && ans !== null) {
      // Check if value is non-empty
      const rawVal = typeof ans === 'object' && 'value' in ans ? ans.value : ans;
      if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
        records.push(createEvidenceRecord(qId, ans));
      }
    }
  }

  return records;
};
