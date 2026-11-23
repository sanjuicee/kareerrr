import React, { useState } from 'react';
import { useCareerPilot } from '../../context/useCareerPilot';
import { evaluateActiveQuestions, generateDiscoverySummary } from '../../engine/branchingEngine';
import type { AssessmentAnswer, AssessmentQuestion } from '../../types/assessment';
import { DIMENSIONS } from '../../types/profile';
import { TechCard } from '../common/TechCard';
import { AssessmentProgressMap } from './AssessmentProgressMap';
import { SingleChoiceInput } from './SingleChoiceInput';
import { MultiChoiceInput } from './MultiChoiceInput';
import { RankingInput } from './RankingInput';
import { SliderInput } from './SliderInput';
import { ProportionalAllocationInput } from './ProportionalAllocationInput';
import { TradeOffInput } from './TradeOffInput';
import { ScenarioInput } from './ScenarioInput';
import { ShortTextInput } from './ShortTextInput';
import { StructuredInput } from './StructuredInput';
import { PreliminaryDiscoveryReportView } from './PreliminaryDiscoveryReportView';
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  GitBranch,
} from 'lucide-react';
import { clsx } from 'clsx';

export const AdaptiveAssessmentConsole: React.FC = () => {
  const { profile, updateAnswer } = useCareerPilot();

  // Typed answers cache
  const answers: Record<string, AssessmentAnswer> = profile.answers || {};

  // Dynamically evaluate active question queue (34 core + any triggered follow-ups)
  const activeQuestions: AssessmentQuestion[] = evaluateActiveQuestions(answers);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showRationale, setShowRationale] = useState<boolean>(false);
  const [isReportView, setIsReportView] = useState<boolean>(false);

  // Safely bound index against dynamic queue adjustments
  const safeIndex = Math.min(currentIndex, Math.max(0, activeQuestions.length - 1));
  const currentQ = activeQuestions[safeIndex];
  if (!currentQ) return null;

  const rawAnswer = answers[currentQ.id];
  const currentAnswer: AssessmentAnswer | undefined =
    rawAnswer && typeof rawAnswer === 'object' && 'value' in rawAnswer && 'questionId' in rawAnswer
      ? (rawAnswer as AssessmentAnswer)
      : rawAnswer !== undefined
      ? {
          questionId: currentQ.id,
          dimension: currentQ.dimension,
          format: currentQ.format,
          value: rawAnswer,
          answeredAt: '',
        }
      : undefined;

  const dimensionMeta = DIMENSIONS[currentQ.dimension];

  // Check if answer is provided for current question
  const isCurrentAnswered =
    currentAnswer !== undefined &&
    currentAnswer.value !== undefined &&
    (Array.isArray(currentAnswer.value) ? currentAnswer.value.length > 0 : true);

  const handleAnswerChange = (val: any, customText?: string) => {
    const answerObj: AssessmentAnswer = {
      questionId: currentQ.id,
      dimension: currentQ.dimension,
      format: currentQ.format,
      value: val,
      customText: customText ?? currentAnswer?.customText,
      isUncertain: currentAnswer?.isUncertain ?? false,
      answeredAt: new Date().toISOString(),
    };
    updateAnswer(currentQ.id, answerObj, currentQ.dimension);
  };

  const handleToggleUncertain = (checked: boolean) => {
    const answerObj: AssessmentAnswer = {
      questionId: currentQ.id,
      dimension: currentQ.dimension,
      format: currentQ.format,
      value: currentAnswer?.value,
      customText: currentAnswer?.customText,
      isUncertain: checked,
      answeredAt: new Date().toISOString(),
    };
    updateAnswer(currentQ.id, answerObj, currentQ.dimension);
  };

  const handleNext = () => {
    if (safeIndex < activeQuestions.length - 1) {
      setCurrentIndex(safeIndex + 1);
      setShowRationale(false);
    } else {
      // Completed all active questions in queue
      setIsReportView(true);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setShowRationale(false);
    }
  };

  // If user has answered all questions and report is requested
  const totalAnswered = Object.keys(answers).length;
  const isAllAnswered = totalAnswered >= activeQuestions.length;

  if (isReportView || (isAllAnswered && safeIndex === activeQuestions.length - 1 && isCurrentAnswered)) {
    const report = generateDiscoverySummary(answers);
    return (
      <PreliminaryDiscoveryReportView
        report={report}
        onRetake={() => {
          setIsReportView(false);
          setCurrentIndex(0);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
      {/* Top Adaptive Branching Progress Map */}
      <AssessmentProgressMap
        activeQuestions={activeQuestions}
        currentIndex={safeIndex}
        answers={answers}
        onSelectQuestionIndex={(idx) => {
          setCurrentIndex(idx);
          setShowRationale(false);
        }}
      />

      {/* Main Active Question Card */}
      <TechCard
        tag={currentQ.isFollowUp ? 'Follow-Up' : `Question ${currentQ.number} of ${activeQuestions.length}`}
        title={currentQ.dimensionLabel}
        glow={true}
        action={
          <div className="flex items-center gap-3">
            {currentQ.isFollowUp && (
              <span className="px-2 py-0.5 border border-sky-400/40 bg-sky-400/10 text-sky-400 text-[10px] font-bold flex items-center gap-1 rounded">
                <GitBranch className="w-3 h-3" />
                <span>Clarification</span>
              </span>
            )}
            <button
              onClick={() => setShowRationale(!showRationale)}
              className="text-slate-400 hover:text-[#00F0B4] font-mono text-xs flex items-center gap-1.5 transition-colors"
              title="Toggle explanatory context"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-[11px]">{showRationale ? 'Hide Details' : 'Why We Ask'}</span>
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Prompt */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: dimensionMeta.color }}
              />
              <span
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: dimensionMeta.color }}
              >
                {currentQ.dimensionLabel}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white font-normal leading-snug tracking-tight">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Rationale Drawer */}
          {showRationale && (
            <div className="p-4 bg-white/[0.02] border-l-2 border-[#00F0B4] font-mono text-xs text-slate-300 leading-relaxed space-y-1">
              <span className="text-[#00F0B4] font-semibold tracking-wider uppercase text-[10px] block">
                CONTEXT & BACKGROUND
              </span>
              <p className="font-sans text-xs text-slate-300">{currentQ.contextHelp}</p>
            </div>
          )}

          {/* DYNAMIC QUESTION FORMAT RENDERER */}
          <div key={currentQ.id} className="pt-2">
            {currentQ.format === 'single-choice' && currentQ.options && (
              <SingleChoiceInput
                options={currentQ.options}
                selectedValue={currentAnswer?.value}
                customText={currentAnswer?.customText}
                allowCustomResponse={currentQ.allowCustomResponse}
                onSelect={handleAnswerChange}
              />
            )}

            {currentQ.format === 'multi-choice' && currentQ.options && (
              <MultiChoiceInput
                options={currentQ.options}
                selectedValues={Array.isArray(currentAnswer?.value) ? currentAnswer.value : []}
                maxSelections={currentQ.maxSelections || 3}
                customText={currentAnswer?.customText}
                allowCustomResponse={currentQ.allowCustomResponse}
                onSelect={handleAnswerChange}
              />
            )}

            {currentQ.format === 'ranking' && currentQ.options && (
              <RankingInput
                options={currentQ.options}
                currentOrder={Array.isArray(currentAnswer?.value) ? currentAnswer.value : []}
                onChange={handleAnswerChange}
              />
            )}

            {currentQ.format === 'slider' && currentQ.sliderConfig && (
              <SliderInput
                config={currentQ.sliderConfig}
                value={typeof currentAnswer?.value === 'number' ? currentAnswer.value : 50}
                onChange={handleAnswerChange}
              />
            )}

            {currentQ.format === 'allocation' && currentQ.allocationItems && (
              <ProportionalAllocationInput
                items={currentQ.allocationItems}
                currentAllocation={
                  typeof currentAnswer?.value === 'object' && currentAnswer?.value !== null
                    ? currentAnswer.value
                    : {}
                }
                onChange={handleAnswerChange}
              />
            )}

            {currentQ.format === 'trade-off' && currentQ.tradeOffConfig && (
              <TradeOffInput
                optionA={currentQ.tradeOffConfig.optionA}
                optionB={currentQ.tradeOffConfig.optionB}
                selectedOptionId={typeof currentAnswer?.value === 'string' ? currentAnswer.value : null}
                onSelect={handleAnswerChange}
              />
            )}

            {currentQ.format === 'scenario' && currentQ.scenarioConfig && (
              <ScenarioInput
                context={currentQ.scenarioConfig.context}
                choices={currentQ.scenarioConfig.choices}
                selectedChoiceId={typeof currentAnswer?.value === 'string' ? currentAnswer.value : null}
                onSelect={handleAnswerChange}
              />
            )}

            {currentQ.format === 'short-text' && (
              <ShortTextInput
                value={typeof currentAnswer?.value === 'string' ? currentAnswer.value : ''}
                placeholder={currentQ.textPlaceholder}
                guidance={currentQ.textGuidance}
                onChange={handleAnswerChange}
              />
            )}

            {currentQ.format === 'structured-input' && currentQ.structuredFields && (
              <StructuredInput
                fields={currentQ.structuredFields}
                values={
                  typeof currentAnswer?.value === 'object' && currentAnswer?.value !== null
                    ? currentAnswer.value
                    : {}
                }
                onChange={handleAnswerChange}
              />
            )}
          </div>

          {/* Stepper Controls & Action Ribbon */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            {/* Back Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className={clsx(
                'px-4 py-2 border flex items-center gap-2 transition-colors btn-tactile',
                safeIndex === 0
                  ? 'border-white/5 text-slate-600 cursor-not-allowed'
                  : 'border-white/20 text-slate-300 hover:text-white hover:border-white/40 bg-white/[0.02]'
              )}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Uncertainty Flag Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200 select-none text-[11px]">
              <input
                type="checkbox"
                checked={currentAnswer?.isUncertain === true}
                onChange={(e) => handleToggleUncertain(e.target.checked)}
                className="accent-amber-400 w-3.5 h-3.5 rounded-none"
              />
              <span>I'm exploring this / not completely sure</span>
            </label>

            {/* Next / Finish Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className={clsx(
                'px-5 py-2.5 font-semibold transition-all duration-150 flex items-center gap-2 btn-tactile',
                isCurrentAnswered
                  ? 'bg-[#00F0B4] hover:bg-[#00F0B4]/90 text-black shadow-[0_0_15px_rgba(0,240,180,0.2)]'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'
              )}
            >
              <span>
                {safeIndex === activeQuestions.length - 1
                  ? 'Complete Assessment'
                  : 'Continue'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </TechCard>
    </div>
  );
};
