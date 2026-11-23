import React from 'react';
import type { PreliminaryDiscoveryReport } from '../../types/assessment';
import { useCareerPilot } from '../../context/useCareerPilot';
import { TechCard } from '../common/TechCard';
import {
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

interface PreliminaryDiscoveryReportViewProps {
  report: PreliminaryDiscoveryReport;
  onRetake: () => void;
}

export const PreliminaryDiscoveryReportView: React.FC<PreliminaryDiscoveryReportViewProps> = ({
  report,
  onRetake,
}) => {
  const { setDestination } = useCareerPilot();
  const tax = report.taxonomies;

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono text-xs">
      {/* Report Header */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#00F0B4] tracking-widest uppercase text-[11px] font-semibold">
            <Sparkles className="w-4 h-4 text-[#00F0B4]" />
            <span>Preliminary Assessment Summary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight font-normal">
            Personal Intelligence Synthesis
          </h1>
          <p className="text-slate-400 font-sans text-xs sm:text-sm max-w-2xl leading-relaxed">
            {report.summarySynthesis}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDestination('profile')}
            className="px-4 py-2.5 bg-[#00F0B4] text-black font-semibold text-xs transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,180,0.2)]"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>View Full Profile</span>
          </button>
        </div>
      </div>

      {/* Global Signal Overview Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0E1217] border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">QUESTIONS COMPLETED</div>
          <div className="text-xl font-bold text-white">
            {report.totalAnswered} / {report.totalQuestionsEvaluated}
          </div>
          <div className="text-[10px] text-slate-400">100% Sequence Complete</div>
        </div>

        <div className="p-4 bg-[#0E1217] border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">SIGNAL FIDELITY</div>
          <div className="text-xl font-bold text-[#00F0B4]">High Multi-Vector</div>
          <div className="text-[10px] text-slate-400">9 Dimensions Assessed</div>
        </div>

        <div className="p-4 bg-[#0E1217] border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">CLARITY RATING</div>
          <div className="text-xl font-bold text-emerald-400">{Math.max(10, 100 - report.globalUncertaintyScore)}%</div>
          <div className="text-[10px] text-slate-400">Profile definition confidence</div>
        </div>

        <div className="p-4 bg-[#0E1217] border border-white/10 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">RECOMMENDED NEXT STEP</div>
          <div className="text-xl font-bold text-sky-400">Explore Careers</div>
          <div className="text-[10px] text-slate-400">Discover matching directions</div>
        </div>
      </div>

      {/* Structured Taxonomies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Box 1: Core Interests & Curious Domains */}
        <TechCard title="Primary Interests & Inquiry Domains">
          <div className="space-y-3 font-mono text-xs">
            {tax.mainInterests.length > 0 ? (
              <ul className="space-y-2">
                {tax.mainInterests.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-200">
                    <span className="text-[#00F0B4] mt-0.5 font-bold">›</span>
                    <span className="font-sans text-xs leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No specific interest clusters logged.</p>
            )}
          </div>
        </TechCard>

        {/* Box 2: Self-Reported Strengths vs Demonstrated Abilities */}
        <TechCard title="Strengths & Demonstrated Abilities">
          <div className="space-y-4 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                SELF-REPORTED NATURAL APTITUDES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tax.selfReportedStrengths.map((str, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 border border-white/15 bg-white/[0.03] text-slate-200 text-xs font-sans"
                  >
                    {str}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                VERIFIABLE CAPABILITIES & VENUES:
              </span>
              <ul className="space-y-1.5">
                {tax.demonstratedAbilities.map((ab, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 font-sans text-xs">
                    <span className="text-sky-400 font-bold font-mono">›</span>
                    <span>{ab}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TechCard>

        {/* Box 3: Work Preferences & Values */}
        <TechCard title="Work Style & Core Values">
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                OPERATIONAL TIME ALLOCATION & STYLE:
              </span>
              <ul className="space-y-1.5">
                {tax.workPreferences.map((pref, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-200 font-sans text-xs">
                    <span className="text-[#00F0B4] font-bold font-mono">›</span>
                    <span>{pref}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                CORE CAREER VALUES:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tax.careerValues.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 border border-white/15 bg-[#00F0B4]/5 text-[#00F0B4] text-xs font-mono"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TechCard>

        {/* Box 4: Environment & Constraints */}
        <TechCard title="Credentials & Practical Constraints">
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.06]">
              <span className="text-slate-400">CREDENTIAL BASELINE:</span>
              <span className="text-white font-medium">{tax.educationalBackground}</span>
            </div>

            <div className="space-y-1 py-1 border-b border-white/[0.06]">
              <span className="text-slate-400">GEOGRAPHIC PARAMETERS:</span>
              <div className="text-slate-200 font-sans text-xs">
                {tax.geographicConstraints.join(' · ') || 'Global Remote'}
              </div>
            </div>

            <div className="space-y-1 py-1">
              <span className="text-slate-400">FINANCIAL CONSTRAINTS & RUNWAY:</span>
              <div className="text-amber-400 font-mono text-xs">
                {tax.financialConstraints.join(' · ') || 'Flexible'}
              </div>
            </div>
          </div>
        </TechCard>
      </div>

      {/* Areas for Consideration */}
      <TechCard tag="AREAS-FOR-EXPLORATION" title="IDENTIFIED INFORMATION GAPS & AREAS TO EXPLORE">
        <div className="space-y-4 font-mono text-xs">
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Rather than pretending every career decision is 100% definitive, Career Pilot explicitly identifies areas where your profile exhibits higher variance or exploratory answers:
          </p>

          {tax.uncertainAreas.length > 0 ? (
            <div className="space-y-2">
              {tax.uncertainAreas.map((unc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-500/[0.04] border border-amber-500/20 text-xs font-mono flex items-start gap-2.5 text-amber-200"
                >
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{unc}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/[0.04] border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>High signal consistency across all 9 assessed dimensions.</span>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onRetake}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revisit or Edit Specific Answers</span>
            </button>

            <button
              onClick={() => setDestination('profile')}
              className="px-4 py-2 bg-[#00F0B4] text-black font-semibold flex items-center gap-2 hover:bg-[#00F0B4]/90 transition-colors"
            >
              <span>View In Exploded Self</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </TechCard>
    </div>
  );
};
