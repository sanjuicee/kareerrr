import React from 'react';
import { clsx } from 'clsx';

interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  tag?: string;
  title?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  glow?: boolean;
  variant?: 'architectural' | 'editorial' | 'plate' | 'minimal';
  sectionIndex?: string;
}

export const TechCard: React.FC<TechCardProps> = ({
  children,
  className,
  tag,
  title,
  action,
  badge,
  glow = false,
  variant = 'architectural',
  sectionIndex,
}) => {
  return (
    <div
      className={clsx(
        'relative rounded-lg transition-all duration-200 overflow-hidden',
        variant === 'architectural' &&
          'bg-[#0D1117]/90 border border-white/[0.08] shadow-md',
        variant === 'editorial' &&
          'bg-[#0B0E14]/90 border border-white/[0.07] shadow-sm',
        variant === 'plate' &&
          'bg-[#10151E]/90 border border-white/[0.1] shadow-lg',
        variant === 'minimal' &&
          'bg-transparent border border-white/[0.06]',
        glow && 'border-[#00F0B4]/40 shadow-[0_0_20px_rgba(0,240,180,0.08)] ring-1 ring-[#00F0B4]/20',
        className
      )}
    >
      {/* Header bar if title, tag, or action exists */}
      {(title || tag || action || badge || sectionIndex) && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.01]">
          <div className="flex items-center gap-2.5">
            {sectionIndex && (
              <span className="font-mono text-[10px] text-[#00F0B4] font-semibold">
                {sectionIndex}
              </span>
            )}
            {tag && (
              <span className="font-mono text-[9px] tracking-wider text-[#00F0B4] uppercase px-1.5 py-0.5 rounded border border-[#00F0B4]/25 bg-[#00F0B4]/5">
                {tag}
              </span>
            )}
            {title && (
              <h3 className="font-medium text-xs sm:text-sm text-slate-200 tracking-wide font-sans">
                {title}
              </h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            {badge}
            {action}
          </div>
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-5">{children}</div>
    </div>
  );
};
