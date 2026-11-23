import React from 'react';
import type { AllocationItem } from '../../types/assessment';
import { clsx } from 'clsx';

interface ProportionalAllocationInputProps {
  items: AllocationItem[];
  currentAllocation: Record<string, number>; // item.id -> percentage
  onChange: (allocation: Record<string, number>) => void;
}

export const ProportionalAllocationInput: React.FC<ProportionalAllocationInputProps> = ({
  items,
  currentAllocation,
  onChange,
}) => {
  // Derive allocation evenly if not yet set
  const getInitialAllocation = () => {
    const perItem = Math.floor(100 / items.length);
    const rem = 100 - perItem * items.length;
    const initial: Record<string, number> = {};
    items.forEach((item, idx) => {
      initial[item.id] = perItem + (idx === 0 ? rem : 0);
    });
    return initial;
  };

  const allocation: Record<string, number> =
    currentAllocation && Object.keys(currentAllocation).length === items.length
      ? currentAllocation
      : getInitialAllocation();

  const totalAllocated = Object.values(allocation).reduce((sum, v) => sum + Number(v), 0);
  const remaining = 100 - totalAllocated;

  const handleAdjust = (id: string, delta: number) => {
    const currentVal = Number(allocation[id] || 0);
    const nextVal = Math.max(0, Math.min(100, currentVal + delta));

    // Calculate tentative new sum
    const tentativeSum = totalAllocated - currentVal + nextVal;
    if (tentativeSum > 100 && delta > 0) return; // cannot exceed 100%

    const updated = { ...allocation, [id]: nextVal };
    onChange(updated);
  };

  const handleDirectSlider = (id: string, val: number) => {
    const currentVal = Number(allocation[id] || 0);
    const delta = val - currentVal;
    if (totalAllocated + delta > 100 && delta > 0) {
      // Cap at available remaining
      const capped = currentVal + (100 - totalAllocated);
      const updated = { ...allocation, [id]: capped };
      onChange(updated);
      return;
    }
    const updated = { ...allocation, [id]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Status & Total Bar */}
      <div className="p-4 bg-[#0E1217]/90 border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 uppercase">PROPORTIONAL BALANCE:</span>
          <span
            className={clsx(
              'font-bold text-sm',
              totalAllocated === 100
                ? 'text-[#00F0B4]'
                : totalAllocated < 100
                ? 'text-amber-400'
                : 'text-rose-400'
            )}
          >
            {totalAllocated}% / 100% {totalAllocated === 100 ? '(BALANCED)' : `(${remaining}% REMAINING)`}
          </span>
        </div>

        {/* Stacked Visual Distribution Bar */}
        <div className="w-full h-3 bg-white/10 flex overflow-hidden">
          {items.map((item) => {
            const pct = allocation[item.id] || 0;
            return (
              <div
                key={item.id}
                className="h-full transition-all duration-300"
                style={{
                  width: `${pct}%`,
                  backgroundColor: item.color || '#00F0B4',
                }}
                title={`${item.label}: ${pct}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Item Sliders Stack */}
      <div className="space-y-3">
        {items.map((item) => {
          const val = allocation[item.id] || 0;
          return (
            <div
              key={item.id}
              className="p-3.5 border border-white/10 bg-[#0E1217]/70 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-none"
                    style={{ backgroundColor: item.color || '#00F0B4' }}
                  />
                  <span className="font-sans font-medium text-sm text-slate-100">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    — {item.description}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdjust(item.id, -5)}
                    className="w-6 h-6 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold btn-tactile"
                  >
                    -
                  </button>
                  <span
                    className="w-12 text-center font-bold text-sm"
                    style={{ color: item.color || '#00F0B4' }}
                  >
                    {val}%
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdjust(item.id, +5)}
                    className="w-6 h-6 border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center font-bold btn-tactile"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={val}
                onChange={(e) => handleDirectSlider(item.id, Number(e.target.value))}
                className="w-full h-1.5 bg-white/20 accent-[#00F0B4] cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
