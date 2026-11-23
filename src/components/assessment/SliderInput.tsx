import React from 'react';
import type { SliderEndpointConfig } from '../../types/assessment';

interface SliderInputProps {
  config: SliderEndpointConfig;
  value: number; // 0 to 100
  onChange: (value: number) => void;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  config,
  value = 50,
  onChange,
}) => {
  const currentVal = typeof value === 'number' ? value : 50;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Endpoint Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left Endpoint */}
        <div className="p-3.5 border border-white/10 bg-[#0E1217]/80 space-y-1">
          <div className="text-[#00F0B4] font-semibold uppercase text-[11px] flex items-center gap-1">
            <span>‹</span>
            <span>{config.leftLabel}</span>
          </div>
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            {config.leftDescription}
          </p>
        </div>

        {/* Right Endpoint */}
        <div className="p-3.5 border border-white/10 bg-[#0E1217]/80 space-y-1 text-right">
          <div className="text-sky-400 font-semibold uppercase text-[11px] flex items-center justify-end gap-1">
            <span>{config.rightLabel}</span>
            <span>›</span>
          </div>
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            {config.rightDescription}
          </p>
        </div>
      </div>

      {/* Slider Control Bar */}
      <div className="p-4 bg-white/[0.01] border border-white/10 space-y-3">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0%</span>
          <span className="text-[#00F0B4] font-bold text-sm tracking-wider">
            {currentVal}%
          </span>
          <span>100%</span>
        </div>

        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={currentVal}
          onChange={handleChange}
          className="w-full h-2.5 bg-white/20 accent-[#00F0B4] cursor-pointer"
        />

        <div className="w-full flex justify-between text-[10px] text-slate-500 pt-1">
          <span>← {config.leftLabel}</span>
          <span>Balanced (50%)</span>
          <span>{config.rightLabel} →</span>
        </div>
      </div>
    </div>
  );
};
