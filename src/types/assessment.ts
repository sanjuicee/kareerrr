import type { DimensionKey } from './profile';

export type QuestionFormat =
  | 'single-choice'
  | 'multi-choice'
  | 'ranking'
  | 'slider'
  | 'allocation'
  | 'trade-off'
  | 'scenario'
  | 'short-text'
  | 'structured-input';

export interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
  tag?: string;
  value: any;
  dimensionImpact?: Partial<Record<DimensionKey, number>>;
  cognitiveImpact?: Record<string, number>;
  categoryTag?: 'strength' | 'ability' | 'interest' | 'preference' | 'constraint';
}

export interface SliderEndpointConfig {
  min: number;
  max: number;
  step: number;
  leftLabel: string;
  rightLabel: string;
  leftDescription: string;
  rightDescription: string;
}

export interface AllocationItem {
  id: string;
  label: string;
  description: string;
  color?: string;
}

export interface TradeOffOption {
  id: string;
  title: string;
  description: string;
  gain: string;
  sacrifice: string;
  impact?: Partial<Record<DimensionKey, number>>;
}

export interface ScenarioChoice {
  id: string;
  action: string;
  reasoning: string;
  inferredTrait: string;
}

export interface AssessmentQuestion {
  id: string;
  number: number; // 1 to 34 for core; 100+ for follow-ups
  isFollowUp?: boolean;
  followUpCode?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  dimension: DimensionKey;
  dimensionLabel: string;
  format: QuestionFormat;
  prompt: string;
  contextHelp: string; // "Why we ask this"
  options?: QuestionOption[];
  allowCustomResponse?: boolean;
  maxSelections?: number;
  sliderConfig?: SliderEndpointConfig;
  allocationItems?: AllocationItem[];
  tradeOffConfig?: {
    optionA: TradeOffOption;
    optionB: TradeOffOption;
  };
  scenarioConfig?: {
    context: string;
    choices: ScenarioChoice[];
  };
  textPlaceholder?: string;
  textGuidance?: string[];
  structuredFields?: {
    fieldId: string;
    label: string;
    type: 'select' | 'text' | 'checkbox';
    options?: string[];
  }[];
}

export interface AssessmentAnswer {
  questionId: string;
  dimension: DimensionKey;
  format: QuestionFormat;
  value: any; // Raw answer data
  customText?: string;
  isUncertain?: boolean;
  answeredAt: string;
}

export type DimensionStatus =
  | 'unstarted'
  | 'exploring'
  | 'emerging'
  | 'supported'
  | 'needs-information';

export interface DimensionSignalState {
  dimension: DimensionKey;
  label: string;
  code: string;
  status: DimensionStatus;
  coreQuestionsAnswered: number;
  totalCoreQuestions: number;
  followUpsAnswered: number;
  uncertaintyRating: number; // 0 to 100%
  extractedHighlights: string[];
}

export interface PreliminaryDiscoveryReport {
  generatedAt: string;
  totalAnswered: number;
  totalQuestionsEvaluated: number;
  globalUncertaintyScore: number;
  dimensionSignals: Record<DimensionKey, DimensionSignalState>;
  taxonomies: {
    mainInterests: string[];
    selfReportedStrengths: string[];
    demonstratedAbilities: string[];
    workPreferences: string[];
    careerValues: string[];
    preferredEnvironments: string[];
    educationalBackground: string;
    geographicConstraints: string[];
    financialConstraints: string[];
    learningPreferences: string[];
    futureAmbitions: string[];
    uncertainAreas: string[];
    contextDependentPreferences: string[];
  };
  summarySynthesis: string;
}
