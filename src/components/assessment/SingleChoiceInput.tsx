import React, { useState } from 'react';
import type { QuestionOption } from '../../types/assessment';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface SingleChoiceInputProps {
  options: QuestionOption[];
  selectedValue: any;
  customText?: string;
  allowCustomResponse?: boolean;
  onSelect: (value: any, customText?: string) => void;
}

export const SingleChoiceInput: React.FC<SingleChoiceInputProps> = ({
  options,
  selectedValue,
  customText = '',
  allowCustomResponse = false,
  onSelect,
}) => {
  const [localCustom, setLocalCustom] = useState(customText);
  const [isCustomActive, setIsCustomActive] = useState(selectedValue === '__CUSTOM__');

  const handleCustomChange = (text: string) => {
    setLocalCustom(text);
    onSelect('__CUSTOM__', text);
  };

  return (
    <div className="space-y-3 font-mono">
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => {
              setIsCustomActive(false);
              onSelect(opt.value);
            }}
            className={clsx(
              'w-full text-left p-4 border transition-all duration-150 relative group flex items-start gap-3.5 select-none btn-tactile',
              isSelected
                ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-white shadow-[0_0_15px_rgba(0,240,180,0.12)] ring-1 ring-[#00F0B4]/40'
                : 'border-white/10 bg-[#0E1217]/70 hover:border-white/30 text-slate-300 hover:bg-white/[0.03]'
            )}
          >
            {/* Reticle Check Box */}
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

      {/* Optional Custom Response */}
      {allowCustomResponse && (
        <div className="pt-2">
          {!isCustomActive && selectedValue !== '__CUSTOM__' ? (
            <button
              type="button"
              onClick={() => {
                setIsCustomActive(true);
                onSelect('__CUSTOM__', localCustom);
              }}
              className="text-xs font-mono text-slate-400 hover:text-[#00F0B4] transition-colors flex items-center gap-1.5"
            >
              <span>+ Add a custom response not listed above</span>
            </button>
          ) : (
            <div className="p-3 border border-[#00F0B4]/40 bg-[#00F0B4]/5 space-y-2">
              <span className="text-[10px] text-[#00F0B4] uppercase block">
                Your Answer
              </span>
              <input
                type="text"
                value={localCustom}
                placeholder="Specify your distinct answer..."
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
