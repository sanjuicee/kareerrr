import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ShortTextInputProps {
  value: string;
  placeholder?: string;
  guidance?: string[];
  onChange: (value: string) => void;
}

export const ShortTextInput: React.FC<ShortTextInputProps> = ({
  value = '',
  placeholder = 'Articulate your thoughts in 2–4 sentences...',
  guidance = [],
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Guidance Box if provided */}
      {guidance.length > 0 && (
        <div className="p-3.5 bg-white/[0.02] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#00F0B4]" />
            <span>Illustrative Examples</span>
          </div>
          {guidance.map((g, i) => (
            <p key={i} className="text-slate-400 font-sans text-xs italic">
              {g}
            </p>
          ))}
        </div>
      )}

      {/* Textarea */}
      <div className="space-y-2">
        <textarea
          rows={4}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full bg-[#0E1217] border border-white/20 p-4 font-sans text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00F0B4] focus:ring-1 focus:ring-[#00F0B4]/40 leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Focus on concrete actions rather than abstract generalizations.</span>
          <span>{value.length} characters</span>
        </div>
      </div>
    </div>
  );
};
