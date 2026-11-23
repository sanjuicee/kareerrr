import { describe, it, expect } from 'vitest';
import { CORE_QUESTIONS, CONDITIONAL_FOLLOW_UPS } from '../../data/questionBank';
import {
  evaluateActiveQuestions,
  calculateOverallUncertainty,
  computeDimensionSignals,
  generateDiscoverySummary,
} from '../branchingEngine';
import type { AssessmentAnswer } from '../../types/assessment';

describe('Adaptive Question Bank & Structure Specifications', () => {
  it('contains exactly 34 core questions', () => {
    expect(CORE_QUESTIONS.length).toBe(34);
  });

  it('matches the exact dimensional distribution specified in instructions', () => {
    const distribution: Record<string, number> = {};
    for (const q of CORE_QUESTIONS) {
      distribution[q.dimension] = (distribution[q.dimension] || 0) + 1;
    }

    expect(distribution['interests']).toBe(5);
    expect(distribution['aptitudes']).toBe(5);
    expect(distribution['skills']).toBe(4);
    expect(distribution['workStyle']).toBe(4);
    expect(distribution['values']).toBe(4);
    expect(distribution['financialLifestyle']).toBe(6); // 3 lifestyle/env + 3 constraints
    expect(distribution['education']).toBe(3);
    expect(distribution['ambitions']).toBe(2);
    expect(distribution['riskTolerance']).toBe(1); // 2 ambitions + 1 risk = 3 total in ambition & risk
  });

  it('contains exactly 6 conditional follow-up questions', () => {
    expect(CONDITIONAL_FOLLOW_UPS.length).toBe(6);
    const codes = CONDITIONAL_FOLLOW_UPS.map((q) => q.followUpCode);
    expect(codes).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });
});

describe('Branching Engine Dynamic Invariants', () => {
  it('returns default 34 questions when no follow-ups are triggered', () => {
    const emptyAnswers: Record<string, AssessmentAnswer> = {};
    const queue = evaluateActiveQuestions(emptyAnswers);
    expect(queue.length).toBe(34);
    expect(queue.some((q) => q.isFollowUp)).toBe(false);
  });

  it('triggers Follow-Up A (Interest clarification) on unclear interests', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q01: {
        questionId: 'Q01',
        dimension: 'interests',
        format: 'multi-choice',
        value: ['unclear_interests'],
        answeredAt: new Date().toISOString(),
      },
    };
    const queue = evaluateActiveQuestions(answers);
    expect(queue.length).toBe(35);
    expect(queue.some((q) => q.id === 'Q-FOLLOW-A')).toBe(true);

    // Follow-Up A should be anchored right after Q02
    const q2Index = queue.findIndex((q) => q.id === 'Q02');
    expect(queue[q2Index + 1].id).toBe('Q-FOLLOW-A');
  });

  it('triggers Follow-Up C (Learning clarification) when learning depends on subject', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q08: {
        questionId: 'Q08',
        dimension: 'aptitudes',
        format: 'single-choice',
        value: 'depends_on_subject',
        answeredAt: new Date().toISOString(),
      },
    };
    const queue = evaluateActiveQuestions(answers);
    expect(queue.length).toBe(35);
    expect(queue.some((q) => q.id === 'Q-FOLLOW-C')).toBe(true);
  });

  it('triggers Follow-Up E (Conflict clarification) on people vs solo conflict', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q15: {
        questionId: 'Q15',
        dimension: 'workStyle',
        format: 'allocation',
        value: { 'alloc-people': 40, 'alloc-systems': 30, 'alloc-data': 30 },
        answeredAt: new Date().toISOString(),
      },
      Q16: {
        questionId: 'Q16',
        dimension: 'workStyle',
        format: 'single-choice',
        value: 'autonomous_solo',
        answeredAt: new Date().toISOString(),
      },
    };
    const queue = evaluateActiveQuestions(answers);
    expect(queue.some((q) => q.id === 'Q-FOLLOW-E')).toBe(true);
  });

  it('triggers Follow-Up F (Earn while studying) on degree training + immediate income urgency', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q28: {
        questionId: 'Q28',
        dimension: 'education',
        format: 'single-choice',
        value: 'formal_degree_program',
        answeredAt: new Date().toISOString(),
      },
      Q30: {
        questionId: 'Q30',
        dimension: 'financialLifestyle',
        format: 'single-choice',
        value: 'immediate_0_3m',
        answeredAt: new Date().toISOString(),
      },
    };
    const queue = evaluateActiveQuestions(answers);
    expect(queue.some((q) => q.id === 'Q-FOLLOW-F')).toBe(true);
  });

  it('re-evaluates and removes follow-up when previous answer is changed', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q08: {
        questionId: 'Q08',
        dimension: 'aptitudes',
        format: 'single-choice',
        value: 'depends_on_subject',
        answeredAt: new Date().toISOString(),
      },
    };
    let queue = evaluateActiveQuestions(answers);
    expect(queue.some((q) => q.id === 'Q-FOLLOW-C')).toBe(true);

    // User edits Q08 to first principles
    answers['Q08'] = {
      ...answers['Q08'],
      value: 'first_principles_theory',
    };
    queue = evaluateActiveQuestions(answers);
    expect(queue.some((q) => q.id === 'Q-FOLLOW-C')).toBe(false);
    expect(queue.length).toBe(34);
  });

  it('never exceeds 40 total questions even when all follow-ups trigger', () => {
    const allTriggerAnswers: Record<string, AssessmentAnswer> = {
      Q01: { questionId: 'Q01', dimension: 'interests', format: 'multi-choice', value: ['unclear_interests'], answeredAt: '' },
      Q06: { questionId: 'Q06', dimension: 'aptitudes', format: 'multi-choice', value: ['unclear_strengths'], answeredAt: '' },
      Q08: { questionId: 'Q08', dimension: 'aptitudes', format: 'single-choice', value: 'depends_on_subject', answeredAt: '' },
      Q11: { questionId: 'Q11', dimension: 'skills', format: 'multi-choice', value: ['self_taught_informal'], answeredAt: '' },
      Q15: { questionId: 'Q15', dimension: 'workStyle', format: 'allocation', value: { 'alloc-people': 50 }, answeredAt: '' },
      Q16: { questionId: 'Q16', dimension: 'workStyle', format: 'single-choice', value: 'autonomous_solo', answeredAt: '' },
      Q28: { questionId: 'Q28', dimension: 'education', format: 'single-choice', value: 'multi_year_doctorate', answeredAt: '' },
      Q30: { questionId: 'Q30', dimension: 'financialLifestyle', format: 'single-choice', value: 'immediate_0_3m', answeredAt: '' },
    };

    const queue = evaluateActiveQuestions(allTriggerAnswers);
    expect(queue.length).toBe(40); // 34 core + 6 follow-ups = 40 max
    expect(queue.length).toBeLessThanOrEqual(40);

    // Ensure no duplicates exist in queue
    const idSet = new Set(queue.map((q) => q.id));
    expect(idSet.size).toBe(queue.length);
  });
});

describe('Discovery Summary Generation', () => {
  it('correctly calculates overall uncertainty and dimension signals', () => {
    const emptySignals = computeDimensionSignals({});
    expect(Object.keys(emptySignals).length).toBe(9);
    expect(emptySignals['interests'].status).toBe('unstarted');
    expect(calculateOverallUncertainty({})).toBe(85);

    const partialSignals = computeDimensionSignals({
      Q01: { questionId: 'Q01', dimension: 'interests', format: 'multi-choice', value: ['tech'], isUncertain: true, answeredAt: '' },
      Q02: { questionId: 'Q02', dimension: 'interests', format: 'multi-choice', value: ['science'], isUncertain: true, answeredAt: '' },
    });
    expect(partialSignals['interests'].status).toBe('needs-information');
  });

  it('correctly categorizes answered taxonomies into Preliminary Discovery Report', () => {
    const answers: Record<string, AssessmentAnswer> = {
      Q01: {
        questionId: 'Q01',
        dimension: 'interests',
        format: 'multi-choice',
        value: ['systems_analysis'],
        answeredAt: '',
      },
      Q06: {
        questionId: 'Q06',
        dimension: 'aptitudes',
        format: 'multi-choice',
        value: ['technical_troubleshooting'],
        answeredAt: '',
      },
      Q11: {
        questionId: 'Q11',
        dimension: 'skills',
        format: 'multi-choice',
        value: ['software_engineering'],
        answeredAt: '',
      },
      Q16: {
        questionId: 'Q16',
        dimension: 'workStyle',
        format: 'single-choice',
        value: 'autonomous_solo',
        answeredAt: '',
      },
      Q26: {
        questionId: 'Q26',
        dimension: 'education',
        format: 'structured-input',
        value: { highestLevel: 'Bachelor’s Degree (BA / BS / BEng)', primaryField: 'Computer Science' },
        answeredAt: '',
      },
    };

    const report = generateDiscoverySummary(answers);
    expect(report.taxonomies.mainInterests.length).toBeGreaterThan(0);
    expect(report.taxonomies.selfReportedStrengths.length).toBeGreaterThan(0);
    expect(report.taxonomies.demonstratedAbilities.length).toBeGreaterThan(0);
    expect(report.taxonomies.educationalBackground).toContain('Bachelor’s Degree');
    expect(report.globalUncertaintyScore).toBeLessThanOrEqual(85);
  });
});
