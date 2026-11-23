import React from 'react';
import type { ScenarioChoice } from '../../types/assessment';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface ScenarioInputProps {
  context: string;
  choices: ScenarioChoice[];
  selectedChoiceId: string | null;
  onSelect: (choiceId: string) => void;
}

export const ScenarioInput: React.FC<ScenarioInputProps> = ({
  context,
  choices,
  selectedChoiceId,
  onSelect,
}) => {
  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Narrative Context Box */}
      <div className="p-4 bg-white/[0.02] border-l-2 border-[#00F0B4] text-xs text-slate-300 leading-relaxed font-sans space-y-1">
        <span className="font-mono text-[10px] text-[#00F0B4] uppercase tracking-wider font-semibold block">
          Scenario Context
        </span>
        <p>{context}</p>
      </div>

      {/* Choices Stack */}
      <div className="space-y-3">
        {choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice.id)}
              className={clsx(
                'w-full text-left p-4 border transition-all duration-150 relative group flex items-start gap-3.5 select-none btn-tactile',
                isSelected
                  ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-white shadow-[0_0_15px_rgba(0,240,180,0.1)] ring-1 ring-[#00F0B4]/50'
                  : 'border-white/10 bg-[#0E1217]/70 hover:border-white/30 text-slate-300 hover:bg-white/[0.03]'
              )}
            >
              <div
                className={clsx(
                  'w-4 h-4 rounded-none border mt-0.5 flex items-center justify-center transition-colors flex-shrink-0',
                  isSelected
                    ? 'border-[#00F0B4] bg-[#00F0B4] text-black'
                    : 'border-slate-500 group-hover:border-slate-300'
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="font-sans font-medium text-sm text-slate-100 leading-snug">
                  {choice.action}
                </div>
                <div className="text-xs text-slate-400 font-mono leading-relaxed">
                  Reasoning: {choice.reasoning}
                </div>
                <div className="pt-1">
                  <span className="px-2 py-0.5 border border-white/10 bg-white/5 text-[10px] text-sky-400 uppercase tracking-wider font-mono">
                    Orientation: {choice.inferredTrait}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
