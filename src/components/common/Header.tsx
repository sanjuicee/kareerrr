import React, { useState } from 'react';
import { useCareerPilot } from '../../context/useCareerPilot';
import type { Destination } from '../../context/CareerPilotContextTypes';
import { Modal } from './Modal';
import { CompassRose } from './BespokeIcons';
import {
  Compass,
  Layers,
  Map as MapIcon,
  GitFork,
  Scale,
  CheckSquare,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const {
    destination,
    setDestination,
    profile,
    resetProfile,
    comparedCareerIds,
    savedPathways,
  } = useCareerPilot();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const savedPathwaysCount = Object.keys(savedPathways || {}).length;
  const isAssessmentStarted = profile.completionPercentage > 0;

  const destinations: {
    id: Destination;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    countColor?: string;
  }[] = [
    { id: 'discovery', label: 'Discover', icon: Compass },
    { id: 'profile', label: 'My Profile', icon: Layers },
    {
      id: 'atlas',
      label: 'Career Atlas',
      icon: MapIcon,
      count: profile.bookmarkedCareers?.length || 0,
      countColor: 'bg-sky-400',
    },
    {
      id: 'pathways',
      label: 'My Pathways',
      icon: GitFork,
      count: savedPathwaysCount,
      countColor: 'bg-amber-400',
    },
    {
      id: 'compare',
      label: 'Compare',
      icon: Scale,
      count: comparedCareerIds.length,
      countColor: 'bg-[#00F0B4]',
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: CheckSquare,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#080A0E]/95 backdrop-blur-md border-b border-white/[0.08]">
        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5">
            {/* Handcrafted Cartographic Branding */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => setDestination('discovery')}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="relative p-1 bg-white/[0.03] border border-white/10 group-hover:border-[#00F0B4]/50 transition-colors">
                  <CompassRose size={22} color="#00F0B4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-lg sm:text-xl text-white tracking-tight group-hover:text-[#00F0B4] transition-colors leading-tight">
                    Career Pilot
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                    Career Exploration & Planning
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment Progress & Actions */}
            <div className="flex items-center gap-4 text-xs font-mono">
              {isAssessmentStarted && (
                <div className="flex items-center gap-2.5 px-3 py-1 bg-white/[0.02] border border-white/[0.08]">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider hidden sm:inline">
                    Profile Progress:
                  </span>
                  <div className="w-16 sm:w-28 h-1.5 bg-white/10 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#00F0B4]/60 to-[#00F0B4] transition-all duration-300"
                      style={{ width: `${profile.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-[#00F0B4] font-semibold text-[11px] tabular-nums">
                    {profile.completionPercentage}%
                  </span>
                </div>
              )}

              {isAssessmentStarted && (
                <button
                  onClick={() => setIsResetModalOpen(true)}
                  title="Start over"
                  className="px-2.5 py-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 transition-all flex items-center gap-1.5 text-[10px] btn-tactile"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden md:inline uppercase">Start Over</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Primary Destination Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.04]">
          <nav
            className="flex space-x-1 overflow-x-auto py-1 no-scrollbar"
            aria-label="Main Navigation"
            role="tablist"
          >
            {destinations.map((tab) => {
              const Icon = tab.icon;
              const isActive = destination === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="main-content"
                  onClick={() => setDestination(tab.id)}
                  className={clsx(
                    'relative px-3.5 py-2 text-xs font-sans tracking-wide transition-all duration-200 flex items-center gap-2 border-b-2 whitespace-nowrap btn-tactile focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00F0B4]',
                    isActive
                      ? 'border-[#00F0B4] text-[#00F0B4] bg-[#00F0B4]/[0.04] font-medium'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.01]'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>

                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={clsx(
                        'ml-1 px-1.5 py-0.2 text-[9px] text-black font-bold font-mono',
                        tab.countColor || 'bg-[#00F0B4]'
                      )}
                    >
                      {tab.count}
                    </span>
                  )}

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0B4] to-transparent shadow-[0_0_8px_#00F0B4]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Start Over"
        tag="RESET"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-sans leading-relaxed">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <p>
              This will reset your answers and saved pathways so you can start the assessment fresh.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 font-sans text-xs">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetProfile();
                setIsResetModalOpen(false);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors rounded"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
