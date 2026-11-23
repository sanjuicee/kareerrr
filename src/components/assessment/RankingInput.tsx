import React from 'react';
import type { QuestionOption } from '../../types/assessment';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface RankingInputProps {
  options: QuestionOption[];
  currentOrder: string[]; // array of option IDs
  onChange: (orderedIds: string[]) => void;
}

export const RankingInput: React.FC<RankingInputProps> = ({
  options,
  currentOrder,
  onChange,
}) => {
  // If currentOrder is empty, default to options IDs
  const orderedIds = currentOrder?.length ? currentOrder : options.map((o) => o.id);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedIds.length) return;

    const copy = [...orderedIds];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    onChange(copy);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="text-[11px] text-slate-400 pb-1.5 border-b border-white/[0.06] flex justify-between">
        <span>PRIORITY SEQUENCE (1 = HIGHEST PRIORITY):</span>
        <span className="text-[#00F0B4] tracking-wider">REORDER WITH CHEVRONS</span>
      </div>

      <div className="space-y-2.5">
        {orderedIds.map((id, index) => {
          const opt = options.find((o) => o.id === id);
          if (!opt) return null;

          const isTop = index === 0;
          const isBottom = index === orderedIds.length - 1;

          return (
            <div
              key={id}
              className={clsx(
                'p-3.5 border transition-all flex items-center gap-3.5 bg-[#0E1217]/80',
                isTop
                  ? 'border-[#00F0B4]/60 bg-[#00F0B4]/5'
                  : 'border-white/10 hover:border-white/20'
              )}
            >
              {/* Priority Badge */}
              <div
                className={clsx(
                  'w-6 h-6 border flex items-center justify-center font-bold text-xs flex-shrink-0',
                  isTop
                    ? 'border-[#00F0B4] bg-[#00F0B4] text-black'
                    : 'border-white/20 bg-white/5 text-slate-300'
                )}
              >
                0{index + 1}
              </div>

              {/* Text */}
              <div className="flex-1 font-sans font-medium text-sm text-slate-100">
                {opt.label}
              </div>

              {/* Up / Down Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isTop}
                  onClick={() => moveItem(index, 'up')}
                  className={clsx(
                    'p-1.5 border transition-colors btn-tactile',
                    isTop
                      ? 'border-white/5 text-slate-600 cursor-not-allowed'
                      : 'border-white/10 text-slate-300 hover:text-white hover:border-[#00F0B4] hover:bg-white/5'
                  )}
                  title="Move priority up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={isBottom}
                  onClick={() => moveItem(index, 'down')}
                  className={clsx(
                    'p-1.5 border transition-colors btn-tactile',
                    isBottom
                      ? 'border-white/5 text-slate-600 cursor-not-allowed'
                      : 'border-white/10 text-slate-300 hover:text-white hover:border-[#00F0B4] hover:bg-white/5'
                  )}
                  title="Move priority down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
