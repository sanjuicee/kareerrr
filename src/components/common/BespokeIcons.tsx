import React from 'react';
import { clsx } from 'clsx';

/**
 * CAREER PILOT — BESPOKE ARCHITECTURAL & CARTOGRAPHIC GRAPHIC SUITE
 * Handcrafted SVG elements designed specifically for Career Pilot.
 */

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 1. Compass Rose — Navigational Cartographic Instrument
export const CompassRose: React.FC<IconProps & { pulse?: boolean }> = ({
  className,
  size = 32,
  color = '#00F0B4',
  pulse = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx('transition-transform duration-500', pulse && 'animate-pulse', className)}
    >
      {/* Outer Azimuth Degree Ring */}
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.25" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 2.5" strokeOpacity="0.4" />
      
      {/* Coordinate Crosshairs */}
      <line x1="24" y1="2" x2="24" y2="46" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
      <line x1="2" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
      
      {/* Cardinal 4-Point Star Blades */}
      <polygon points="24,6 26.5,21.5 24,24 21.5,21.5" fill={color} fillOpacity="0.85" />
      <polygon points="24,42 26.5,26.5 24,24 21.5,26.5" fill="currentColor" fillOpacity="0.35" />
      <polygon points="42,24 26.5,26.5 24,24 26.5,21.5" fill="currentColor" fillOpacity="0.5" />
      <polygon points="6,24 21.5,26.5 24,24 21.5,21.5" fill="currentColor" fillOpacity="0.5" />

      {/* Ordinal Diamond Points */}
      <polygon points="35,13 25,23 24,24 25,25" fill={color} fillOpacity="0.3" />
      <polygon points="13,35 23,25 24,24 23,23" fill="currentColor" fillOpacity="0.2" />
      <polygon points="35,35 25,25 24,24 25,23" fill="currentColor" fillOpacity="0.2" />
      <polygon points="13,13 23,23 24,24 23,25" fill="currentColor" fillOpacity="0.2" />

      {/* Center Jewel Core */}
      <circle cx="24" cy="24" r="3" fill="#080A0E" stroke={color} strokeWidth="1.25" />
      <circle cx="24" cy="24" r="1" fill={color} />
    </svg>
  );
};

// 2. Dimension Emblems — Distinctive Visual Seal for All 9 Discovery Vectors
export type DimensionType =
  | 'interests'
  | 'aptitudes'
  | 'skills'
  | 'work_preferences'
  | 'values'
  | 'environment'
  | 'education'
  | 'constraints'
  | 'ambitions';

export const DimensionEmblem: React.FC<{
  dimension: DimensionType | string;
  size?: number;
  className?: string;
  color?: string;
}> = ({ dimension, size = 28, className, color = '#00F0B4' }) => {
  const norm = dimension.toLowerCase().replace(/[-_]/g, '');

  // A. Interests & Curiosity — Astrolabe Radial Ray
  if (norm.includes('interest') || norm.includes('curiosity') || norm === 'dim01') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <circle cx="16" cy="16" r="8" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
        <line x1="16" y1="3" x2="16" y2="29" stroke={color} strokeWidth="0.6" strokeOpacity="0.4" />
        <line x1="3" y1="16" x2="29" y2="16" stroke={color} strokeWidth="0.6" strokeOpacity="0.4" />
        <path d="M16 6L20 16L16 26L12 16Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="0.8" />
        <circle cx="16" cy="16" r="2" fill={color} />
      </svg>
    );
  }

  // B. Aptitudes & Strengths — Hexagonal Crystal Lattice
  if (norm.includes('aptitude') || norm.includes('strength') || norm === 'dim02') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <polygon points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
        <polygon points="16,8 23,12 23,20 16,24 9,20 9,12" stroke={color} strokeWidth="0.8" fill={color} fillOpacity="0.15" />
        <line x1="16" y1="8" x2="16" y2="24" stroke={color} strokeWidth="0.6" strokeOpacity="0.6" />
        <line x1="9" y1="16" x2="23" y2="16" stroke={color} strokeWidth="0.6" strokeOpacity="0.6" />
        <circle cx="16" cy="16" r="2.5" fill={color} />
      </svg>
    );
  }

  // C. Demonstrated Skills & Competencies — Interlocking Precision Teeth
  if (norm.includes('skill') || norm.includes('experience') || norm === 'dim03') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect x="6" y="6" width="20" height="20" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
        <rect x="10" y="10" width="12" height="12" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" />
        <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.2" />
        <line x1="16" y1="26" x2="16" y2="30" stroke={color} strokeWidth="1.2" />
        <line x1="2" y1="16" x2="6" y2="16" stroke={color} strokeWidth="1.2" />
        <line x1="26" y1="16" x2="30" y2="16" stroke={color} strokeWidth="1.2" />
        <line x1="11" y1="11" x2="21" y2="21" stroke={color} strokeWidth="0.75" />
        <line x1="21" y1="11" x2="11" y2="21" stroke={color} strokeWidth="0.75" />
      </svg>
    );
  }

  // D. Work Preferences — Harmonic Dual-Cadence Waveform
  if (norm.includes('work') || norm.includes('preference') || norm === 'dim04') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="0.8" strokeOpacity="0.25" />
        <path d="M4 16 C8 8, 12 8, 16 16 C20 24, 24 24, 28 16" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M4 16 C8 24, 12 24, 16 16 C20 8, 24 8, 28 16" stroke={color} strokeWidth="0.75" strokeOpacity="0.4" strokeDasharray="1.5 2" />
        <circle cx="16" cy="16" r="2" fill={color} />
      </svg>
    );
  }

  // E. Personal Values & Motivations — Resonant Radiating Core
  if (norm.includes('value') || norm.includes('motivation') || norm === 'dim05') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="0.75" strokeOpacity="0.2" />
        <circle cx="16" cy="16" r="9" stroke={color} strokeWidth="0.75" strokeOpacity="0.4" />
        <circle cx="16" cy="16" r="5" stroke={color} strokeWidth="0.75" strokeOpacity="0.7" fill={color} fillOpacity="0.2" />
        <circle cx="16" cy="16" r="2" fill={color} />
        <line x1="16" y1="2" x2="16" y2="8" stroke={color} strokeWidth="0.75" />
        <line x1="16" y1="24" x2="16" y2="30" stroke={color} strokeWidth="0.75" />
      </svg>
    );
  }

  // F. Environment & Lifestyle — Topographic Iso-Contour Lines
  if (norm.includes('environment') || norm.includes('lifestyle') || norm === 'dim06') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <rect x="4" y="4" width="24" height="24" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />
        <path d="M6 22 Q12 14 16 20 T26 14" stroke={color} strokeWidth="1" fill="none" />
        <path d="M6 16 Q14 8 20 14 T26 8" stroke={color} strokeWidth="0.75" strokeOpacity="0.5" fill="none" />
        <circle cx="20" cy="14" r="1.5" fill={color} />
      </svg>
    );
  }

  // G. Education & Learning — Stratified Knowledge Staircase
  if (norm.includes('education') || norm.includes('learning') || norm === 'dim07') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <path d="M5 25 L12 25 L12 19 L19 19 L19 13 L26 13 L26 7" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
        <polygon points="5,25 26,25 26,7 19,13 19,19 12,19 12,25" fill={color} fillOpacity="0.12" />
        <line x1="5" y1="25" x2="27" y2="25" stroke={color} strokeWidth="0.8" strokeOpacity="0.5" />
        <circle cx="26" cy="7" r="2" fill={color} />
      </svg>
    );
  }

  // H. Personal Constraints & Runway — Calibrated Pivot Balance
  if (norm.includes('constraint') || norm.includes('financial') || norm === 'dim08') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
        <line x1="6" y1="12" x2="26" y2="12" stroke={color} strokeWidth="1.2" />
        <polygon points="16,12 19,25 13,25" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="0.8" />
        <line x1="8" y1="25" x2="24" y2="25" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="8" cy="12" r="2" fill={color} />
        <circle cx="24" cy="12" r="2" fill={color} />
        <circle cx="16" cy="12" r="1" fill="#080A0E" />
      </svg>
    );
  }

  // I. Ambitions & Risk Tolerance — Ascending Horizon Vector
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <line x1="4" y1="26" x2="28" y2="26" stroke={color} strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="4" y1="19" x2="28" y2="19" stroke={color} strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="2 2" />
      <line x1="4" y1="12" x2="28" y2="12" stroke={color} strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="2 2" />
      <path d="M6 24 C12 22, 16 16, 26 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="26,6 21,8 24,13" fill={color} />
    </svg>
  );
};

// 3. Architectural Millimeter Ruler Component
export const ArchitecturalRuler: React.FC<{
  length?: 'full' | 'short';
  className?: string;
  label?: string;
  dimCode?: string;
}> = ({ length = 'full', className, label, dimCode }) => {
  return (
    <div className={clsx('relative flex items-center gap-3 select-none font-mono text-[9px] text-slate-500', className)}>
      {dimCode && (
        <span className="text-[#00F0B4] tracking-widest uppercase font-semibold px-1 py-0.2 border border-[#00F0B4]/30 bg-[#00F0B4]/5 text-[8px]">
          {dimCode}
        </span>
      )}
      <div className={clsx('relative h-2.5 flex items-center overflow-hidden', length === 'full' ? 'flex-1' : 'w-48')}>
        {/* Hairline ruler axis */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10" />
        {/* Repeating millimeter tick marks */}
        <div className="absolute inset-0 ruler-x opacity-60" />
      </div>
      {label && <span className="uppercase tracking-widest text-slate-400 text-[9px]">{label}</span>}
    </div>
  );
};

// 4. Architectural Corner Crosshairs
export const CornerCrosshairs: React.FC<{ color?: string; className?: string }> = ({ color, className }) => {
  return (
    <div className={clsx('pointer-events-none', className)}>
      <div
        className={clsx('absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t border-l transition-colors', !color && 'border-current')}
        style={color ? { borderColor: color } : undefined}
      />
      <div
        className={clsx('absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t border-r transition-colors', !color && 'border-current')}
        style={color ? { borderColor: color } : undefined}
      />
      <div
        className={clsx('absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b border-l transition-colors', !color && 'border-current')}
        style={color ? { borderColor: color } : undefined}
      />
      <div
        className={clsx('absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b border-r transition-colors', !color && 'border-current')}
        style={color ? { borderColor: color } : undefined}
      />
    </div>
  );
};

// 5. Editorial Section Divider
export const EditorialSectionDivider: React.FC<{
  sectionNumber?: string;
  title?: string;
  className?: string;
}> = ({ sectionNumber, title, className }) => {
  return (
    <div className={clsx('flex items-center gap-4 py-4 select-none', className)}>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-white/10" />
      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
        {sectionNumber && (
          <span className="text-[#00F0B4] font-semibold tracking-widest uppercase">
            § {sectionNumber}
          </span>
        )}
        {title && <span className="tracking-widest uppercase text-slate-300 font-medium">{title}</span>}
      </div>
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-white/10 to-white/10" />
    </div>
  );
};

// 6. Pathway Route Transit Glyph
export const PathwayGlyph: React.FC<{
  category: string;
  size?: number;
  className?: string;
}> = ({ category, size = 20, className }) => {
  switch (category) {
    case 'direct-pathway':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <line x1="3" y1="12" x2="21" y2="12" stroke="#00F0B4" strokeWidth="2" strokeLinecap="round" />
          <polygon points="21,12 15,8 15,16" fill="#00F0B4" />
        </svg>
      );
    case 'skill-based-pathway':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="6" cy="12" r="3" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="9" y1="12" x2="15" y2="12" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="1.5 2" />
          <circle cx="18" cy="12" r="3" fill="#38BDF8" />
        </svg>
      );
    case 'bridge-career':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 17 L7 17 L10 10 L14 10 L17 17 L21 17" stroke="#C084FC" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="2" fill="#C084FC" />
        </svg>
      );
    case 'interdisciplinary':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="9" cy="12" r="5" stroke="#34D399" strokeWidth="1.25" strokeOpacity="0.8" />
          <circle cx="15" cy="12" r="5" stroke="#34D399" strokeWidth="1.25" strokeOpacity="0.8" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <polyline points="4,16 9,10 14,14 20,7" stroke="#E5A93C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};
