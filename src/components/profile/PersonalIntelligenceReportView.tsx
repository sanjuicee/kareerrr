// ============================================================================
// CAREER PILOT — PERSONAL INTELLIGENCE REPORT VIEW
// Comprehensive, Evidence-Linked Multidimensional Personal Intelligence Synthesis
// Sections A through I per Master Specification
// ============================================================================

import React, { useState } from 'react';
import type { PersonalIntelligenceProfile, ProfileSignal } from '../../types/profileIntelligence';
import { useCareerPilot } from '../../context/useCareerPilot';
import { TechCard } from '../common/TechCard';
import { EvidenceInspectorModal } from './EvidenceInspectorModal';
import { SignalCorrectionModal } from './SignalCorrectionModal';
import { ConflictResolutionCard } from './ConflictResolutionCard';
import {
  ShieldCheck,
  Compass,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { clsx } from 'clsx';

interface PersonalIntelligenceReportViewProps {
  profile: PersonalIntelligenceProfile;
}

export const PersonalIntelligenceReportView: React.FC<PersonalIntelligenceReportViewProps> = ({
  profile,
}) => {
  const { setDestination } = useCareerPilot();

  const [inspectingSignal, setInspectingSignal] = useState<ProfileSignal | null>(null);
  const [correctingSignal, setCorrectingSignal] = useState<ProfileSignal | null>(null);

  const summary = profile.profileSummary;
  const preferences = profile.preferences;
  const constraints = profile.constraints;
  const goals = profile.goals;

  // Filter signals by intelligence dimension
  const interestSignals = profile.signals.filter((s) => s.dimensionKey === 'interestIntelligence');
  const abilitySignals = profile.signals.filter((s) => s.dimensionKey === 'abilityIntelligence');

  return (
    <div className="space-y-10 max-w-6xl mx-auto font-mono text-xs">
      {/* Evidence & Correction Modals */}
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

      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#00F0B4] tracking-wider uppercase text-[11px] font-mono font-medium">
            <ShieldCheck className="w-4 h-4 text-[#00F0B4]" />
            <span>Personal Intelligence Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
            Personal Intelligence Synthesis
          </h1>
          <p className="text-slate-300 font-sans text-xs sm:text-sm max-w-3xl leading-relaxed">
            Evidence-linked profile reflecting your interests, demonstrated capabilities, working preferences, and personal circumstances. All conclusions trace directly to your responses.
          </p>
        </div>
      </div>

      {/* SECTION A — PERSONAL OVERVIEW */}
      <TechCard title="Executive Summary" glow={true}>
        <div className="space-y-5">
          <div className="p-4 bg-white/[0.02] border-l-2 border-[#00F0B4] text-slate-200 font-sans text-sm sm:text-base leading-relaxed">
            {summary.executiveSynthesis}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">SIGNAL COMPLETION:</span>
              <span className="text-white font-bold text-lg">{summary.signalCompletenessPercent}%</span>
              <span className="text-[10px] text-slate-400 block">{profile.signals.length} Extracted Signals</span>
            </div>

            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">EXPLORATION AREAS:</span>
              <span className="text-amber-400 font-bold text-lg">{profile.uncertainties.length} Open</span>
              <span className="text-[10px] text-slate-400 block">Questions to Explore</span>
            </div>

            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">ACTIVE TENSIONS:</span>
              <span className="text-sky-400 font-bold text-lg">{profile.uncertainties.length} Identified</span>
              <span className="text-[10px] text-slate-400 block">Contextual Trade-Offs</span>
            </div>

            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">DATA INTEGRITY:</span>
              <span className="text-emerald-400 font-bold text-lg">100% Traceable</span>
              <span className="text-[10px] text-slate-400 block">{profile.evidence.length} Evidence Links</span>
            </div>
          </div>
        </div>
      </TechCard>

      {/* SECTION B — INTEREST MAP */}
      <TechCard title="Interests & Inquiry Domains">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary & Intersections */}
            <div className="space-y-3">
              <span className="text-[#00F0B4] text-[10px] uppercase font-semibold tracking-wider block">
                Primary Interests & Intersections
              </span>
              <div className="space-y-2">
                {interestSignals
                  .filter((s) => s.category === 'primary-interest' || s.category === 'interest-intersection')
                  .map((sig) => (
                    <SignalListItem
                      key={sig.signalId}
                      signal={sig}
                      onInspect={() => setInspectingSignal(sig)}
                      onCorrect={() => setCorrectingSignal(sig)}
                    />
                  ))}
              </div>
            </div>

            {/* Secondary & Emerging */}
            <div className="space-y-3">
              <span className="text-sky-400 text-[10px] uppercase font-semibold tracking-wider block">
                Secondary & Emerging Topics
              </span>
              <div className="space-y-2">
                {interestSignals
                  .filter((s) => s.category === 'secondary-interest' || s.category === 'emerging-interest')
                  .map((sig) => (
                    <SignalListItem
                      key={sig.signalId}
                      signal={sig}
                      onInspect={() => setInspectingSignal(sig)}
                      onCorrect={() => setCorrectingSignal(sig)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </TechCard>

      {/* SECTION C — ABILITY & APTITUDE MAP */}
      <TechCard title="Aptitudes & Demonstrated Abilities">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category A: Self-reported strengths */}
            <div className="space-y-3">
              <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider block">
                Self-Reported Strengths
              </span>
              <div className="space-y-2">
                {abilitySignals
                  .filter((s) => s.category === 'self-reported-strength')
                  .map((sig) => (
                    <SignalListItem
                      key={sig.signalId}
                      signal={sig}
                      onInspect={() => setInspectingSignal(sig)}
                      onCorrect={() => setCorrectingSignal(sig)}
                    />
                  ))}
              </div>
            </div>

            {/* Category B: Demonstrated Accomplishments */}
            <div className="space-y-3">
              <span className="text-emerald-400 text-[10px] uppercase font-semibold tracking-wider block">
                Demonstrated Capabilities
              </span>
              <div className="space-y-2">
                {abilitySignals
                  .filter((s) => s.category === 'demonstrated-ability')
                  .map((sig) => (
                    <SignalListItem
                      key={sig.signalId}
                      signal={sig}
                      onInspect={() => setInspectingSignal(sig)}
                      onCorrect={() => setCorrectingSignal(sig)}
                    />
                  ))}
                {abilitySignals.filter((s) => s.category === 'demonstrated-ability').length === 0 && (
                  <div className="p-4 bg-white/[0.01] border border-dashed border-white/10 text-slate-500 font-sans text-xs">
                    No concrete project accomplishment documented yet. Add qualitative details in Question 10 to substantiate demonstrated abilities.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category C & D: Aptitudes and Approach */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <span className="text-purple-400 text-[10px] uppercase font-semibold tracking-wider block">
              Cognitive Approach & Problem-Solving
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {abilitySignals
                .filter((s) => s.category === 'potential-aptitude' || s.category === 'cognitive-approach' || s.category === 'learning-heuristic')
                .map((sig) => (
                  <SignalListItem
                    key={sig.signalId}
                    signal={sig}
                    onInspect={() => setInspectingSignal(sig)}
                    onCorrect={() => setCorrectingSignal(sig)}
                  />
                ))}
            </div>
          </div>
        </div>
      </TechCard>

      {/* SECTION D — SKILLS INVENTORY & VENUES */}
      <TechCard title="Skills & Capability Inventory">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.skillInventory.map((sk) => (
              <div key={sk.skillId} className="p-3.5 bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{sk.name}</span>
                  <span
                    className={clsx(
                      'px-1.5 py-0.5 text-[9px] uppercase font-bold border',
                      sk.verificationStatus === 'experience-backed' || sk.verificationStatus === 'user-verified'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    )}
                  >
                    {sk.proficiency}
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 font-sans">
                  Venue: <span className="text-slate-300">{sk.supportingExperienceVenue.join(', ') || 'Independent study'}</span>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 uppercase">{sk.category}</span>
                  <span className={clsx(sk.verificationStatus === 'experience-backed' ? 'text-[#00F0B4]' : 'text-amber-400')}>
                    {sk.verificationStatus.replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TechCard>

      {/* SECTION E — WORK COMPATIBILITY PREFERENCES */}
      <TechCard title="Work Preferences & Operational Style">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PolarityGauge
              label="STRUCTURE VS AUTONOMY"
              leftLabel="Rigid Playbooks"
              rightLabel="Complete Strategic Freedom"
              value={preferences.autonomyVsStructured}
            />

            <PolarityGauge
              label="PEOPLE VS SOLITARY FOCUS"
              leftLabel="Deep Solo Focus"
              rightLabel="Constant Collaboration"
              value={preferences.peopleVsSolo}
            />

            <PolarityGauge
              label="DATA VS IDEAS DOMAIN"
              leftLabel="Empirical Data & Systems"
              rightLabel="Conceptual Abstract Ideas"
              value={preferences.dataVsIdeas}
            />

            <PolarityGauge
              label="PACE & VARIETY"
              leftLabel="Predictable Monotasking"
              rightLabel="Rapid Dynamic Shifting"
              value={preferences.varietyVsPredictability}
            />
          </div>

          {preferences.coexistingPreferences.length > 0 && (
            <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
              <span className="text-[#00F0B4] uppercase text-[10px] font-bold block">
                COMPATIBLE COEXISTING PREFERENCES:
              </span>
              <ul className="space-y-1 text-slate-300 font-sans text-xs">
                {preferences.coexistingPreferences.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#00F0B4]">›</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TechCard>

      {/* SECTION F — VALUES AND MOTIVATION */}
      <TechCard title="Core Priorities & Motivations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Priorities */}
          <div className="space-y-3">
            <span className="text-white text-[10px] uppercase font-bold tracking-wider block pb-1 border-b border-white/10">
              HIGHEST RANKED VALUES (1–3):
            </span>
            <div className="space-y-2">
              {goals.topRankedValues.slice(0, 3).map((v, idx) => (
                <div key={v} className="p-3 bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <span className="text-white font-medium capitalize">{v.replace(/_/g, ' ')}</span>
                  <span className="px-1.5 py-0.5 bg-[#00F0B4]/10 text-[#00F0B4] font-bold text-[10px]">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deal-Breakers */}
          <div className="space-y-3">
            <span className="text-rose-400 text-[10px] uppercase font-bold tracking-wider block pb-1 border-b border-white/10">
              NON-NEGOTIABLE DEAL-BREAKERS:
            </span>
            <div className="space-y-2">
              {goals.dealBreakers.map((db) => (
                <div key={db} className="p-3 bg-rose-500/[0.04] border border-rose-500/20 text-rose-300 flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span className="capitalize">{db.replace(/_/g, ' ')}</span>
                </div>
              ))}
              {goals.dealBreakers.length === 0 && (
                <div className="p-3 text-slate-500 italic">No deal-breakers specified.</div>
              )}
            </div>
          </div>

          {/* Persistence Motivator */}
          <div className="space-y-3">
            <span className="text-sky-400 text-[10px] uppercase font-bold tracking-wider block pb-1 border-b border-white/10">
              MULTI-YEAR PERSISTENCE DRIVER:
            </span>
            <div className="p-4 bg-sky-500/[0.03] border border-sky-500/20 text-slate-200 font-sans text-xs leading-relaxed">
              {goals.primaryMotivators[0]
                ? `Driven by: ${goals.primaryMotivators[0].replace(/_/g, ' ')}`
                : 'Driven by continuous professional mastery and craftsmanship.'}
            </div>
          </div>
        </div>
      </TechCard>

      {/* SECTION G — PRACTICAL REALITY & CONSTRAINTS */}
      <TechCard title="Practical Circumstances & Runway">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">CREDENTIAL BASELINE:</span>
              <span className="text-white font-medium">{constraints.educationBaseline}</span>
            </div>

            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">GEOGRAPHIC BOUNDS:</span>
              <span className="text-[#00F0B4]">{constraints.geographicBounds}</span>
            </div>

            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">FINANCIAL RUNWAY:</span>
              <span className="text-amber-400 font-bold">{constraints.financialRunwayMonths} Months</span>
            </div>

            <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">HOURS / WEEK:</span>
              <span className="text-sky-400 font-bold">{constraints.availableWeeklyHours} Hours</span>
            </div>
          </div>

          {/* Hard Constraints Callout */}
          {constraints.hardConstraints.length > 0 && (
            <div className="p-4 bg-amber-500/[0.03] border border-amber-500/20 space-y-2">
              <span className="text-amber-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>IDENTIFIED HARD CONSTRAINTS (CURRENT LIMITERS):</span>
              </span>
              <div className="space-y-1.5">
                {constraints.hardConstraints.map((hc) => (
                  <div key={hc.id} className="text-slate-200 font-sans text-xs">
                    • <strong className="text-white">{hc.label}:</strong> {hc.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TechCard>

      {/* SECTION H — POTENTIAL GROWTH AREAS */}
      <TechCard title="Potential Growth Areas">
        <div className="space-y-4">
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            These are areas where your interests or desired capabilities exceed your currently demonstrated proof-of-work. Developing artifacts here will expand your viable career routes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.growthAreas.map((ga) => (
              <div key={ga.areaId} className="p-4 bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-xs">{ga.title}</span>
                  <span
                    className={clsx(
                      'px-1.5 py-0.5 text-[9px] uppercase font-bold border',
                      ga.priority === 'high'
                        ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                        : 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                    )}
                  >
                    {ga.gapType.replace(/-/g, ' ')}
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">{ga.description}</p>
                <div className="pt-2 text-[11px] text-[#00F0B4] font-mono">
                  ACTION: {ga.suggestedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TechCard>

      {/* SECTION I — TRADE-OFFS & AREAS FOR EXPLORATION */}
      <TechCard title="Trade-Offs & Decisions">
        <div className="space-y-6">
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            Rather than asserting false certainty, Career Pilot surfaces where your preferences compete or where additional information is needed before making irreversible career commitments.
          </p>

          {/* Identified Conflicts */}
          {profile.uncertainties.length > 0 ? (
            <div className="space-y-3">
              <span className="text-amber-400 uppercase text-[10px] font-bold block">
                ACTIVE STRUCTURAL TENSIONS & DECISION TRADE-OFFS:
              </span>
              <div className="space-y-3">
                {profile.uncertainties.map((conf) => (
                  <ConflictResolutionCard key={conf.conflictId} conflict={conf} />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/[0.04] border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No major structural tensions or contradictions detected in current response set.</span>
            </div>
          )}

          {/* Auditability Footer */}
          <div className="p-4 bg-[#080A0D] border border-white/10 flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="space-y-0.5">
              <span className="text-white font-semibold">100% Private Client-Side Intelligence</span>
              <p className="text-slate-500 font-sans text-xs">
                Your profile is stored privately in your browser.
              </p>
            </div>

            <button
              onClick={() => setDestination('discovery')}
              className="px-4 py-2 bg-[#00F0B4] text-black font-semibold flex items-center gap-1.5 btn-tactile"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Refine In Discovery</span>
            </button>
          </div>
        </div>
      </TechCard>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Helper: Polarity Gauge Bar (-1.0 to 1.0)
// ----------------------------------------------------------------------------
const PolarityGauge: React.FC<{
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number; // -1 to 1
}> = ({ label, leftLabel, rightLabel, value }) => {
  const normalizedPct = Math.round(((value + 1) / 2) * 100);

  return (
    <div className="p-3.5 bg-[#080A0D] border border-white/10 space-y-2">
      <div className="flex justify-between text-[10px]">
        <span className="text-slate-400 uppercase font-semibold">{label}</span>
        <span className="text-[#00F0B4] font-bold">{normalizedPct}%</span>
      </div>

      <div className="w-full h-2 bg-white/10 relative overflow-hidden">
        <div
          className="absolute top-0 bottom-0 bg-[#00F0B4] transition-all duration-500"
          style={{
            left: `${Math.min(50, normalizedPct)}%`,
            width: `${Math.abs(normalizedPct - 50)}%`,
          }}
        />
        {/* Center line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40" />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500">
        <span>← {leftLabel}</span>
        <span>{rightLabel} →</span>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Helper: Signal List Item with Evidence & Edit Buttons
// ----------------------------------------------------------------------------
const SignalListItem: React.FC<{
  signal: ProfileSignal;
  onInspect: () => void;
  onCorrect: () => void;
}> = ({ signal, onInspect, onCorrect }) => {
  return (
    <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1.5 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              signal.confidenceLevel === 'strongly-supported'
                ? 'bg-[#00F0B4]'
                : signal.confidenceLevel === 'moderately-supported'
                ? 'bg-sky-400'
                : 'bg-amber-400'
            )}
          />
          <span className="text-white font-medium text-xs">{signal.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 border border-white/10 bg-white/5 text-slate-400 text-[9px] uppercase">
            {signal.confidenceLevel.replace(/-/g, ' ')}
          </span>

          {signal.status === 'confirmed' && (
            <span className="text-emerald-400 text-[9px] uppercase font-bold">Confirmed</span>
          )}
        </div>
      </div>

      <p className="text-slate-400 font-sans text-xs leading-relaxed">{signal.description}</p>

      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
        <button
          onClick={onInspect}
          className="text-[#00F0B4] hover:underline flex items-center gap-1 btn-tactile"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Inspect Evidence ({signal.supportingAnswerIds.length} Answers)</span>
        </button>

        <button
          onClick={onCorrect}
          className="text-slate-400 hover:text-white flex items-center gap-1 btn-tactile"
        >
          <Edit3 className="w-3 h-3 text-sky-400" />
          <span>Refine</span>
        </button>
      </div>
    </div>
  );
};
