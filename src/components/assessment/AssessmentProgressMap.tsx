import React from 'react';
import type { AssessmentQuestion, AssessmentAnswer } from '../../types/assessment';
import type { DimensionKey } from '../../types/profile';
import { DIMENSIONS } from '../../types/profile';
import { computeDimensionSignals } from '../../engine/branchingEngine';
import { Layers, GitBranch } from 'lucide-react';
import { clsx } from 'clsx';

interface AssessmentProgressMapProps {
  activeQuestions: AssessmentQuestion[];
  currentIndex: number;
  answers: Record<string, AssessmentAnswer>;
  onSelectQuestionIndex: (index: number) => void;
}

export const AssessmentProgressMap: React.FC<AssessmentProgressMapProps> = ({
  activeQuestions,
  currentIndex,
  answers,
  onSelectQuestionIndex,
}) => {
  const dimensionSignals = computeDimensionSignals(answers);
  const currentQ = activeQuestions[currentIndex];

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = activeQuestions.length;
  const progressPercent = Math.round((totalAnswered / totalQuestions) * 100);

  const dimensionKeys = Object.keys(DIMENSIONS) as DimensionKey[];
  const activeFollowUps = activeQuestions.filter((q) => q.isFollowUp);

  return (
    <div className="p-4 bg-[#0E1217] border border-white/10 font-mono text-xs space-y-4">
      {/* Top Status & Queue Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#00F0B4]" />
          <span className="text-white text-xs font-semibold">
            Assessment Questions ({totalQuestions} Total)
          </span>
          {activeFollowUps.length > 0 && (
            <span className="px-1.5 py-0.2 border border-sky-400/40 bg-sky-400/10 text-sky-400 text-[10px] flex items-center gap-1 rounded">
              <GitBranch className="w-3 h-3" />
              <span>+{activeFollowUps.length} follow-up</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Progress:</span>
          <span className="text-[#00F0B4] font-semibold">
            {totalAnswered} / {totalQuestions} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* 9 Dimensions Status Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
        {dimensionKeys.map((dimKey) => {
          const meta = DIMENSIONS[dimKey];
          const signal = dimensionSignals[dimKey];
          const isCurrentDimension = currentQ?.dimension === dimKey;

          const statusStyles = {
            unstarted: 'border-white/10 bg-white/[0.01] text-slate-500',
            exploring: 'border-sky-400/30 bg-sky-400/5 text-sky-300',
            emerging: 'border-indigo-400/40 bg-indigo-400/10 text-indigo-300',
            supported: 'border-[#00F0B4]/40 bg-[#00F0B4]/10 text-[#00F0B4]',
            'needs-information': 'border-amber-400/50 bg-amber-400/10 text-amber-300',
          };

          return (
            <div
              key={dimKey}
              className={clsx(
                'p-2 border transition-all text-center space-y-1',
                statusStyles[signal.status],
                isCurrentDimension && 'ring-1 ring-white/60 shadow-[0_0_12px_rgba(255,255,255,0.1)]'
              )}
              title={`${meta.label}: ${signal.coreQuestionsAnswered}/${signal.totalCoreQuestions} answered. Status: ${signal.status}`}
            >
              <div className="text-[9px] font-bold tracking-widest">{meta.code}</div>
              <div className="text-[10px] font-sans font-medium line-clamp-1">{meta.label}</div>
              <div className="text-[8px] uppercase tracking-wider opacity-80">
                {signal.status.replace('-', ' ')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Linear Question Stepper Ticks */}
      <div className="pt-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {activeQuestions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = currentIndex === idx;
            const isFollowUp = q.isFollowUp;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestionIndex(idx)}
                className={clsx(
                  'w-7 h-7 flex-shrink-0 border flex items-center justify-center text-[10px] font-mono transition-all duration-150 btn-tactile',
                  isCurrent
                    ? 'border-[#00F0B4] bg-[#00F0B4] text-black font-bold shadow-[0_0_10px_#00F0B4]'
                    : isAnswered
                    ? isFollowUp
                      ? 'border-sky-400/60 bg-sky-400/10 text-sky-300'
                      : 'border-[#00F0B4]/40 bg-[#00F0B4]/5 text-[#00F0B4]'
                    : 'border-white/10 bg-[#080A0D] text-slate-500 hover:border-white/30 hover:text-white'
                )}
                title={`Question ${q.number}: ${q.prompt}`}
              >
                {isFollowUp ? `F${q.followUpCode}` : q.number < 10 ? `0${q.number}` : q.number}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
