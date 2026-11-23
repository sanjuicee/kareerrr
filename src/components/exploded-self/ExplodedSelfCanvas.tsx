// ============================================================================
// CAREER PILOT — THE EXPLODED SELF CANVAS
// Dynamic 3D/2D Spatial Visualization of Personal Intelligence Dimensions
// ============================================================================

import React, { useState, useRef } from 'react';
import { useCareerPilot } from '../../context/useCareerPilot';
import type {
  IntelligenceDimensionKey,
  ProfileSignal,
} from '../../types/profileIntelligence';
import { INTELLIGENCE_DIMENSIONS } from '../../types/profileIntelligence';
import { EvidenceInspectorModal } from '../profile/EvidenceInspectorModal';
import { SignalCorrectionModal } from '../profile/SignalCorrectionModal';
import {
  CompassRose,
  DimensionEmblem,
} from '../common/BespokeIcons';
import {
  Rotate3d,
  Compass,
  Info,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Edit3,
} from 'lucide-react';
import { clsx } from 'clsx';

interface IntelligenceLayerCoord {
  key: IntelligenceDimensionKey;
  angleDeg: number;
  distancePx: number;
  zDepth: number;
}

const SIX_INTELLIGENCE_COORDINATES: IntelligenceLayerCoord[] = [
  { key: 'interestIntelligence', angleDeg: 270, distancePx: 220, zDepth: 40 },
  { key: 'abilityIntelligence', angleDeg: 330, distancePx: 240, zDepth: 20 },
  { key: 'skillIntelligence', angleDeg: 30, distancePx: 240, zDepth: -15 },
  { key: 'workIntelligence', angleDeg: 90, distancePx: 220, zDepth: -35 },
  { key: 'valuesIntelligence', angleDeg: 150, distancePx: 235, zDepth: -15 },
  { key: 'growthIntelligence', angleDeg: 210, distancePx: 235, zDepth: 30 },
];

export const ExplodedSelfCanvas: React.FC = () => {
  const { profile, setDestination } = useCareerPilot();
  const pip = profile.intelligenceProfile;

  const [selectedDimension, setSelectedDimension] = useState<IntelligenceDimensionKey | null>(null);
  const [hoveredDimension, setHoveredDimension] = useState<IntelligenceDimensionKey | null>(null);
  const [explosionDistance, setExplosionDistance] = useState<number>(85); // 20% to 100%
  const [is3DMode, setIs3DMode] = useState<boolean>(true);

  // Modals for deep inspection
  const [inspectingSignal, setInspectingSignal] = useState<ProfileSignal | null>(null);
  const [correctingSignal, setCorrectingSignal] = useState<ProfileSignal | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeDimRecord = selectedDimension && pip?.profileDimensions
    ? pip.profileDimensions[selectedDimension]
    : null;

  const activeDimMeta = selectedDimension
    ? INTELLIGENCE_DIMENSIONS[selectedDimension]
    : null;

  const handleDimensionClick = (key: IntelligenceDimensionKey) => {
    if (selectedDimension === key) {
      setSelectedDimension(null);
    } else {
      setSelectedDimension(key);
    }
  };

  const handleResetView = () => {
    setSelectedDimension(null);
    setHoveredDimension(null);
  };

  const navigateDimension = (direction: 'prev' | 'next') => {
    const keys = SIX_INTELLIGENCE_COORDINATES.map((c) => c.key);
    const currentIndex = selectedDimension ? keys.indexOf(selectedDimension) : 0;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % keys.length
        : (currentIndex - 1 + keys.length) % keys.length;
    setSelectedDimension(keys[nextIndex]);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Evidence and Correction Modals */}
      {inspectingSignal && (
        <EvidenceInspectorModal
          isOpen={true}
          onClose={() => setInspectingSignal(null)}
          title={inspectingSignal.name}
          evidenceRecords={inspectingSignal.evidenceRecords}
        />
      )}

      {correctingSignal && (
        <SignalCorrectionModal
          isOpen={true}
          onClose={() => setCorrectingSignal(null)}
          signal={correctingSignal}
        />
      )}

      {/* Instrumentation Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#0D1117] border border-white/10 rounded-lg font-mono text-xs shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CompassRose size={16} color="#00F0B4" />
            <span className="text-slate-200 uppercase tracking-wider text-[11px] font-semibold">
              Exploded Self Model
            </span>
          </div>
        </div>

        {/* Spatial Knobs */}
        <div className="flex items-center gap-4">
          {/* Explosion Scale Slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">EXPANSION:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={explosionDistance}
              onChange={(e) => setExplosionDistance(Number(e.target.value))}
              className="w-24 h-1 bg-white/20 accent-[#00F0B4] cursor-pointer"
              title="Adjust exploded layer separation distance"
            />
            <span className="text-[10px] text-[#00F0B4] w-7 text-right font-mono">{explosionDistance}%</span>
          </div>

          {/* 3D Isometric Tilt Toggle */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={clsx(
              'px-2.5 py-1 border rounded transition-all flex items-center gap-1.5 text-[11px] btn-tactile',
              is3DMode
                ? 'border-[#00F0B4]/40 bg-[#00F0B4]/10 text-[#00F0B4] font-medium'
                : 'border-white/10 text-slate-400 hover:text-white'
            )}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D View' : '2D View'}</span>
          </button>

          {/* Reset Assembly Button */}
          {selectedDimension && (
            <button
              onClick={handleResetView}
              className="px-2.5 py-1 border border-white/20 bg-white/[0.04] text-slate-200 hover:text-white hover:bg-white/[0.08] transition-all text-[11px] flex items-center gap-1 btn-tactile"
            >
              <span>RESET ASSEMBLY</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Stage: Interactive Canvas + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spatial Exploded Visualization Canvas */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onClick={(e) => {
              if (e.target === containerRef.current) {
                handleResetView();
              }
            }}
            className={clsx(
              'relative w-full h-[560px] sm:h-[640px] bg-[#080A0E] border border-white/10 overflow-hidden flex items-center justify-center select-none bg-tech-grid',
              is3DMode && 'perspective-1000'
            )}
          >
            {/* Visual Guides & Status */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 pointer-events-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#00F0B4] rounded-full" />
              <span>Axonometric Profile Cutaway</span>
            </div>
            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500 pointer-events-none">
              Completeness: <span className="text-[#00F0B4] font-semibold">{pip?.profileSummary.signalCompletenessPercent || 0}%</span>
            </div>

            {/* Concentric Technical Range Rings */}
            <div className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-white/[0.06] pointer-events-none" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-white/[0.04] pointer-events-none" />
            <div className="absolute w-[480px] h-[480px] rounded-full border border-dashed border-white/[0.03] pointer-events-none" />

            {/* SVG Connector Rays Overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              style={{
                transform: is3DMode ? 'rotateX(22deg) rotateZ(-3deg)' : 'none',
                transformStyle: 'preserve-3d',
              }}
            >
              {SIX_INTELLIGENCE_COORDINATES.map((layer) => {
                const rad = (layer.angleDeg * Math.PI) / 180;
                const distanceFactor = explosionDistance / 100;
                const adjustedDist = layer.distancePx * distanceFactor;

                const isSelected = selectedDimension === layer.key;
                const strokeColor = isSelected ? '#00F0B4' : 'rgba(255,255,255,0.18)';
                const strokeWidth = isSelected ? 2 : 1;

                return (
                  <g key={`ray-${layer.key}`}>
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% + ${Math.cos(rad) * adjustedDist}px)`}
                      y2={`calc(50% + ${Math.sin(rad) * adjustedDist}px)`}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isSelected ? 'none' : '3 4'}
                      className={isSelected ? 'animate-signal-pulse' : ''}
                    />
                    <circle
                      cx={`calc(50% + ${Math.cos(rad) * adjustedDist}px)`}
                      cy={`calc(50% + ${Math.sin(rad) * adjustedDist}px)`}
                      r={isSelected ? 4 : 2.5}
                      fill={isSelected ? '#00F0B4' : 'rgba(255,255,255,0.4)'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* 3D Transformation Wrapper for Core & Layers */}
            <div
              className={clsx(
                'relative w-full h-full flex items-center justify-center transition-transform duration-700 preserve-3d',
                is3DMode && 'rotate-x-[22deg] -rotate-z-[3deg]'
              )}
            >
              {/* Central Cognitive Core (User Nucleus) */}
              <div
                className="absolute z-30 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={handleResetView}
                title="Click to reset exploded view"
              >
                {/* Central Core Box */}
                <div className="w-28 h-28 bg-[#0D1117] border border-[#00F0B4] rounded-lg p-2.5 flex flex-col items-center justify-center text-center shadow-lg relative backdrop-blur-md">
                  <CompassRose size={22} color="#00F0B4" className="mb-1" />
                  <span className="font-sans text-xs font-semibold text-white truncate max-w-[90px]">
                    {profile.userName}
                  </span>
                  <span className="font-mono text-[8px] text-[#00F0B4] uppercase tracking-wider mt-0.5">
                    PROFILE CORE
                  </span>
                  <span className="font-mono text-[8px] text-slate-400">
                    {pip?.signals.length || 0} Signals
                  </span>
                </div>
              </div>

              {/* 6 Spatially Separated Major Intelligence Layers */}
              {SIX_INTELLIGENCE_COORDINATES.map((coord) => {
                const meta = INTELLIGENCE_DIMENSIONS[coord.key];
                const dimRecord = pip?.profileDimensions[coord.key];
                const rad = (coord.angleDeg * Math.PI) / 180;
                const distanceFactor = explosionDistance / 100;
                const adjustedDist = coord.distancePx * distanceFactor;
                const xOffset = Math.cos(rad) * adjustedDist;
                const yOffset = Math.sin(rad) * adjustedDist;

                const isSelected = selectedDimension === coord.key;
                const isHovered = hoveredDimension === coord.key;
                const percent = Math.round((dimRecord?.calibrationDepth || 0.1) * 100);
                const signalCount = dimRecord?.signals.length || 0;

                const hasActiveSelection = selectedDimension !== null;
                const isDimmed = hasActiveSelection && !isSelected;

                return (
                  <div
                    key={coord.key}
                    onMouseEnter={() => setHoveredDimension(coord.key)}
                    onMouseLeave={() => setHoveredDimension(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDimensionClick(coord.key);
                    }}
                    style={{
                      transform: `translate3d(${xOffset}px, ${yOffset}px, ${
                        isSelected ? 90 : coord.zDepth
                      }px) scale(${isSelected ? 1.15 : isHovered ? 1.05 : 1})`,
                    }}
                    className={clsx(
                      'absolute z-20 cursor-pointer transition-all duration-300 font-mono select-none',
                      isDimmed ? 'opacity-30 blur-[0.5px] scale-95' : 'opacity-100'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-44 p-3 border rounded-lg transition-all duration-200 relative backdrop-blur-md',
                        isSelected
                          ? 'border-[#00F0B4] bg-[#0E131A] shadow-[0_0_20px_rgba(0,240,180,0.18)] ring-1 ring-[#00F0B4]'
                          : isHovered
                          ? 'border-white/40 bg-[#0E131A]/95 shadow-md'
                          : 'border-white/10 bg-[#0E131A]/85 hover:border-white/30'
                      )}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between text-[8px] mb-1.5 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <DimensionEmblem dimension={coord.key} size={14} color={meta.color} />
                          <span className="font-bold text-white font-mono">{meta.code}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[9px]">
                          {signalCount} signals
                        </span>
                      </div>

                      {/* Dimension Label */}
                      <div className="text-xs font-sans font-medium text-slate-100 line-clamp-1 leading-snug">
                        {meta.label}
                      </div>

                      {/* Top 2 Signal Pills */}
                      <div className="mt-2 space-y-1">
                        {dimRecord?.signals.slice(0, 2).map((sig) => (
                          <div
                            key={sig.signalId}
                            className="flex items-center gap-1.5 text-[9px] text-slate-300 line-clamp-1 font-sans"
                          >
                            <span
                              className={clsx(
                                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                                sig.confidenceLevel === 'strongly-supported'
                                  ? 'bg-[#00F0B4]'
                                  : sig.confidenceLevel === 'moderately-supported'
                                  ? 'bg-sky-400'
                                  : 'bg-amber-400'
                              )}
                            />
                            <span className="truncate">{sig.name}</span>
                          </div>
                        ))}
                        {signalCount === 0 && (
                          <div className="text-[9px] text-slate-500 italic">No signals yet</div>
                        )}
                      </div>

                      {/* Calibration Level Bar */}
                      <div className="w-full h-1 bg-white/10 mt-2.5 overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: meta.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Layer Specification Inspector Panel */}
        <div className="lg:col-span-5 space-y-4">
          {activeDimMeta && activeDimRecord ? (
            <div className="p-6 bg-[#0D1117] border border-white/15 rounded-lg shadow-xl relative font-mono text-xs space-y-5">
              {/* Inspector Header with Next/Prev controls */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <DimensionEmblem dimension={activeDimMeta.code} size={20} color={activeDimMeta.color} />
                  <div>
                    <span className="text-slate-100 font-bold uppercase tracking-wider text-xs block">
                      {activeDimMeta.label}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      LAYER SPECIFICATION · {activeDimMeta.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigateDimension('prev')}
                    className="p-1.5 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all btn-tactile"
                    title="Previous dimension"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigateDimension('next')}
                    className="p-1.5 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white transition-all btn-tactile"
                    title="Next dimension"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleResetView}
                    className="text-slate-400 hover:text-white text-[10px] pl-2 border-l border-white/10 uppercase"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {activeDimMeta.description}
              </p>

              {/* Profile Depth Gauge */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 uppercase text-[10px]">Profile Depth:</span>
                  <span className="text-[#00F0B4] font-bold text-sm">
                    {Math.round(activeDimRecord.calibrationDepth * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.round(activeDimRecord.calibrationDepth * 100)}%`,
                      backgroundColor: activeDimMeta.color,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>Confidence: {activeDimRecord.confidenceSummary}</span>
                  <span>{activeDimRecord.signals.length} Insights Identified</span>
                </div>
              </div>

              {/* Connected Profile Signals List */}
              <div className="space-y-2">
                <span className="text-slate-400 uppercase text-[10px] font-bold block font-mono">
                  CONNECTED INTELLIGENCE SIGNALS:
                </span>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {activeDimRecord.signals.map((sig) => (
                    <div
                      key={sig.signalId}
                      className="p-3 bg-white/[0.02] border border-white/10 space-y-1.5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-xs font-sans">{sig.name}</span>
                        <span
                          className={clsx(
                            'text-[9px] uppercase px-1.5 py-0.2 border font-mono',
                            sig.confidenceLevel === 'strongly-supported'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : 'border-white/10 text-slate-400'
                          )}
                        >
                          {sig.confidenceLevel.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-400 font-sans text-xs line-clamp-2 leading-relaxed">{sig.description}</p>
                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono">
                        <button
                          onClick={() => setInspectingSignal(sig)}
                          className="text-[#00F0B4] hover:underline flex items-center gap-1"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Audit Evidence ({sig.supportingAnswerIds.length})</span>
                        </button>
                        <button
                          onClick={() => setCorrectingSignal(sig)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 btn-tactile"
                        >
                          <Edit3 className="w-3 h-3 text-sky-400" />
                          <span>Refine</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {activeDimRecord.signals.length === 0 && (
                    <div className="p-4 text-center text-slate-500 italic font-sans text-xs">
                      No insights extracted for this dimension yet. Complete questions in Discovery.
                    </div>
                  )}
                </div>
              </div>

              {/* Missing Information / Uncertainty Notes */}
              {activeDimRecord.missingInformationNotes.length > 0 && (
                <div className="p-3 bg-amber-500/[0.04] border border-amber-500/20 text-amber-200 text-xs space-y-1 font-sans">
                  <div className="text-[10px] font-mono font-bold uppercase text-amber-400">
                    Areas for Exploration:
                  </div>
                  {activeDimRecord.missingInformationNotes.map((note, i) => (
                    <div key={i}>• {note}</div>
                  ))}
                </div>
              )}

              {/* Direct Action */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => setDestination('discovery')}
                  className="w-full py-2.5 px-4 bg-[#00F0B4] hover:bg-[#00F0B4]/90 text-black font-semibold text-xs font-mono transition-all flex items-center justify-center gap-2 btn-tactile"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Answer More Questions in Discovery</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-[#0D1117] border border-white/10 rounded-lg font-mono text-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Info className="w-4 h-4 text-[#00F0B4]" />
                <span className="text-[11px] uppercase tracking-wider text-slate-200 font-semibold">
                  PERSONAL INTELLIGENCE EXPLORER
                </span>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                Click any of the <strong className="text-white">6 major intelligence dimension plates</strong> to inspect its cognitive vectors, verify its underlying evidence trail, and refine system-generated inferences.
              </p>
              <div className="p-3.5 bg-white/[0.02] border border-white/10 text-[11px] space-y-1.5 text-slate-400 font-sans">
                <div className="text-slate-200 font-semibold uppercase font-mono text-[10px]">
                  HOW TO NAVIGATE:
                </div>
                <div>• Drag <span className="text-[#00F0B4] font-mono">Expansion</span> slider to explode or collapse layers.</div>
                <div>• Toggle <span className="text-[#00F0B4] font-mono">3D Axonometric / 2D Orthographic</span> to shift perspective.</div>
                <div>• Click any plate to inspect evidence records or refine profile signals.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};