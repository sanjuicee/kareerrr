// ============================================================================
// CAREER PILOT — PROFILE VIEW
// Personal Intelligence Exploration Interface & Multidimensional Workspace
// ============================================================================

import React, { useState } from 'react';
import { useCareerPilot } from '../../context/useCareerPilot';
import { ExplodedSelfCanvas } from '../exploded-self/ExplodedSelfCanvas';
import { PersonalIntelligenceReportView } from '../profile/PersonalIntelligenceReportView';
import { SkillInventoryManager } from '../profile/SkillInventoryManager';
import { ConflictResolutionCard } from '../profile/ConflictResolutionCard';
import { generatePersonalIntelligenceProfile } from '../../engine/profile/profileGenerator';
import {
  Layers,
  Compass,
  FileText,
  Wrench,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { clsx } from 'clsx';

type ProfileTab = 'visualization' | 'report' | 'skills' | 'tensions';

export const ProfileView: React.FC = () => {
  const { profile, setDestination, recomputeProfile } = useCareerPilot();
  const [activeTab, setActiveTab] = useState<ProfileTab>('visualization');

  // Ensure intelligence profile is available
  const pip =
    profile.intelligenceProfile ||
    generatePersonalIntelligenceProfile(profile.answers, { userName: profile.userName });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Title & Architectural Schematic Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs text-[#00F0B4] tracking-wider uppercase font-mono font-medium">
              <Layers className="w-3.5 h-3.5" />
              <span>Personal Profile · Synthesis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
              Personal Intelligence Profile
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1.5 leading-relaxed font-sans">
              An evidence-linked synthesis of your interests, aptitudes, demonstrated capabilities, working style, and practical constraints.
            </p>
          </div>

          {/* Actions with Tactile Physics */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              onClick={() => setDestination('discovery')}
              className="px-4 py-2 border border-[#00F0B4]/40 bg-[#00F0B4]/10 text-[#00F0B4] hover:bg-[#00F0B4]/20 transition-all flex items-center gap-1.5 font-medium btn-tactile"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Answer More Questions</span>
            </button>

            <button
              onClick={recomputeProfile}
              className="px-3.5 py-2 border border-white/20 bg-white/[0.02] text-slate-300 hover:text-white transition-all flex items-center gap-1.5 btn-tactile"
              title="Re-calculate profile insights from answers"
            >
              <RotateCcw className="w-3 h-3 text-sky-400" />
              <span>Re-calculate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Tab Navigation Ribbon */}
      <div className="flex border-b border-white/10 gap-1 overflow-x-auto text-xs font-mono font-medium">
        <button
          onClick={() => setActiveTab('visualization')}
          className={clsx(
            'px-4 py-2.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap btn-tactile',
            activeTab === 'visualization'
              ? 'border-[#00F0B4] text-[#00F0B4] bg-[#00F0B4]/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Exploded Self Model</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={clsx(
            'px-4 py-2.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap btn-tactile',
            activeTab === 'report'
              ? 'border-[#00F0B4] text-[#00F0B4] bg-[#00F0B4]/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Intelligence Blueprint</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={clsx(
            'px-4 py-2.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap btn-tactile',
            activeTab === 'skills'
              ? 'border-[#00F0B4] text-[#00F0B4] bg-[#00F0B4]/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          )}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Skills Inventory ({pip.skillInventory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tensions')}
          className={clsx(
            'px-4 py-2.5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap btn-tactile',
            activeTab === 'tensions'
              ? 'border-[#00F0B4] text-[#00F0B4] bg-[#00F0B4]/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
          )}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Trade-offs & Considerations ({pip.uncertainties.length})</span>
        </button>
      </div>

      {/* Main Tab Content Display */}
      {activeTab === 'visualization' && <ExplodedSelfCanvas />}

      {activeTab === 'report' && <PersonalIntelligenceReportView profile={pip} />}

      {activeTab === 'skills' && <SkillInventoryManager />}

      {activeTab === 'tensions' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="p-5 bg-[#0D1117] border border-white/10 rounded-lg space-y-1">
            <span className="text-amber-400 font-mono font-semibold uppercase text-xs block">
              IDENTIFIED STRUCTURAL TENSIONS & DECISION TRADE-OFFS
            </span>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Real careers involve conscious trade-offs between competing desires. Review below to confirm whether apparent tensions are intentional compromises or require contextual clarification.
            </p>
          </div>

          {pip.uncertainties.length === 0 ? (
            <div className="p-8 text-center bg-white/[0.01] border border-white/10 text-slate-500 font-sans text-xs">
              No structural contradictions or competing preferences detected in your response history.
            </div>
          ) : (
            pip.uncertainties.map((conf) => (
              <ConflictResolutionCard key={conf.conflictId} conflict={conf} />
            ))
          )}
        </div>
      )}
    </div>
  );
};
