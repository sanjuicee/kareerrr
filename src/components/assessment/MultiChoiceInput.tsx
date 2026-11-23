import React, { useState } from 'react';
import type { QuestionOption } from '../../types/assessment';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface MultiChoiceInputProps {
  options: QuestionOption[];
  selectedValues: any[]; // array of selected values
  maxSelections?: number;
  customText?: string;
  allowCustomResponse?: boolean;
  onSelect: (values: any[], customText?: string) => void;
}

export const MultiChoiceInput: React.FC<MultiChoiceInputProps> = ({
  options,
  selectedValues = [],
  maxSelections = 3,
  customText = '',
  allowCustomResponse = false,
  onSelect,
}) => {
  const [localCustom, setLocalCustom] = useState(customText);
  const [showCustomInput, setShowCustomInput] = useState(Boolean(customText));

  const currentSelectionCount = selectedValues.length;

  const handleToggle = (value: any) => {
    let next: any[];
    if (selectedValues.includes(value)) {
      next = selectedValues.filter((v) => v !== value);
    } else {
      if (selectedValues.length >= maxSelections) {
        // Replace oldest or cap
        next = [...selectedValues.slice(1), value];
      } else {
        next = [...selectedValues, value];
      }
    }
    onSelect(next, localCustom);
  };

  const handleCustomChange = (text: string) => {
    setLocalCustom(text);
    onSelect(selectedValues, text);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Limit Status Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-white/[0.06]">
        <span>
          SELECT UP TO <span className="text-[#00F0B4] font-semibold">{maxSelections}</span> OPTIONS:
        </span>
        <span
          className={clsx(
            'font-medium tracking-wider',
            currentSelectionCount >= maxSelections ? 'text-[#00F0B4]' : 'text-slate-400'
          )}
        >
          {currentSelectionCount} of {maxSelections} selected
        </span>
      </div>

      <div className="space-y-2.5">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleToggle(opt.value)}
              className={clsx(
                'w-full text-left p-3.5 border transition-all duration-150 relative group flex items-start gap-3.5 select-none btn-tactile',
                isSelected
                  ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-white shadow-[0_0_15px_rgba(0,240,180,0.1)]'
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

              <div className="flex-1 space-y-0.5">
                <div className="font-sans font-medium text-sm leading-snug text-slate-100">
                  {opt.label}
                </div>
                {opt.sublabel && (
                  <div className="text-xs text-slate-400 font-mono leading-relaxed">
                    {opt.sublabel}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional Custom Tag Response */}
      {allowCustomResponse && (
        <div className="pt-2">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="text-xs font-mono text-slate-400 hover:text-[#00F0B4] transition-colors flex items-center gap-1.5"
            >
              <span>+ Add a specific custom skill / topic</span>
            </button>
          ) : (
            <div className="p-3 border border-[#00F0B4]/40 bg-[#00F0B4]/5 space-y-1.5">
              <span className="text-[10px] text-[#00F0B4] uppercase block">
                CUSTOM ENTRY
              </span>
              <input
                type="text"
                value={localCustom}
                placeholder="Enter custom specialty or skill..."
                onChange={(e) => handleCustomChange(e.target.value)}
                className="w-full bg-[#0E1217] border border-white/20 p-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#00F0B4]"
                autoFocus
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
