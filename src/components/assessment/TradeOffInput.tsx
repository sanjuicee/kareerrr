import React from 'react';
import type { TradeOffOption } from '../../types/assessment';
import { CornerCrosshairs } from '../common/BespokeIcons';
import { clsx } from 'clsx';

interface TradeOffInputProps {
  optionA: TradeOffOption;
  optionB: TradeOffOption;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
}

export const TradeOffInput: React.FC<TradeOffInputProps> = ({
  optionA,
  optionB,
  selectedOptionId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
      {/* Option A */}
      <button
        type="button"
        onClick={() => onSelect(optionA.id)}
        className={clsx(
          'w-full text-left p-5 border transition-all cursor-pointer relative space-y-3 btn-tactile',
          selectedOptionId === optionA.id
            ? 'border-[#00F0B4] bg-[#00F0B4]/10 shadow-[0_0_20px_rgba(0,240,180,0.15)] ring-1 ring-[#00F0B4]'
            : 'border-white/10 bg-[#0E1217]/70 hover:border-white/30 text-slate-300 hover:bg-white/[0.03]'
        )}
      >
        {selectedOptionId === optionA.id && <CornerCrosshairs color="#00F0B4" />}
        <div className="flex items-center justify-between">
          <span className="text-[#00F0B4] font-bold uppercase text-[10px] tracking-wider">
            OPTION A
          </span>
          {selectedOptionId === optionA.id && (
            <span className="px-2 py-0.5 bg-[#00F0B4] text-black text-[9px] font-bold">
              SELECTED
            </span>
          )}
        </div>

        <h4 className="font-serif text-lg font-normal text-white leading-snug">
          {optionA.title}
        </h4>

        <p className="text-slate-300 font-sans text-xs leading-relaxed">
          {optionA.description}
        </p>

        <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px]">
          <div className="text-emerald-400 font-mono">+ Gain: {optionA.gain}</div>
          <div className="text-rose-300 font-mono">- Trade-off: {optionA.sacrifice}</div>
        </div>
      </button>

      {/* Option B */}
      <button
        type="button"
        onClick={() => onSelect(optionB.id)}
        className={clsx(
          'w-full text-left p-5 border transition-all cursor-pointer relative space-y-3 btn-tactile',
          selectedOptionId === optionB.id
            ? 'border-[#00F0B4] bg-[#00F0B4]/10 shadow-[0_0_20px_rgba(0,240,180,0.15)] ring-1 ring-[#00F0B4]'
            : 'border-white/10 bg-[#0E1217]/70 hover:border-white/30 text-slate-300 hover:bg-white/[0.03]'
        )}
      >
        {selectedOptionId === optionB.id && <CornerCrosshairs color="#00F0B4" />}
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">
            OPTION B
          </span>
          {selectedOptionId === optionB.id && (
            <span className="px-2 py-0.5 bg-[#00F0B4] text-black text-[9px] font-bold">
              SELECTED
            </span>
          )}
        </div>

        <h4 className="font-serif text-lg font-normal text-white leading-snug">
          {optionB.title}
        </h4>

        <p className="text-slate-300 font-sans text-xs leading-relaxed">
          {optionB.description}
        </p>

        <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px]">
          <div className="text-emerald-400 font-mono">+ Gain: {optionB.gain}</div>
          <div className="text-rose-300 font-mono">- Trade-off: {optionB.sacrifice}</div>
        </div>
      </button>
    </div>
  );
};
