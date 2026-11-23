import React, { useState, useMemo } from 'react';
import { useCareerPilot } from '../../context/CareerPilotContext';
import { occupationDatabase } from '../../engine/career/occupationDatabase';
import { careerComparisonEngine } from '../../engine/career/comparisonEngine';
import type { ComparisonPriorityLens } from '../../engine/career/comparisonEngine';
import type { OccupationRecord } from '../../types/occupation';
import { TechCard } from '../common/TechCard';
import { CompassRose } from '../common/BespokeIcons';
import {
  X,
  AlertTriangle,
  Map as MapIcon,
  Sliders,
  GitFork,
  TrendingUp,
} from 'lucide-react';
import { clsx } from 'clsx';

export const CompareView: React.FC = () => {
  const {
    comparedCareerIds,
    toggleCompareCareer,
    setDestination,
    profile,
    setActivePathwayCareerId,
  } = useCareerPilot();

  const allOccupations = occupationDatabase.getAll();

  // Selected careers for comparison (at least 2, at most 3)
  const comparedOccupations: OccupationRecord[] = useMemo(() => {
    const selected = comparedCareerIds
      .map((id) => occupationDatabase.getById(id))
      .filter(Boolean) as OccupationRecord[];

    if (selected.length >= 2) {
      return selected.slice(0, 3);
    }
    if (selected.length === 1) {
      // Complement with a second occupation from the database
      const fallback = allOccupations.find((o) => o.id !== selected[0].id) || allOccupations[1];
      return [selected[0], fallback];
    }
    // Default: compare the first two authoritative occupations
    return [allOccupations[0], allOccupations[1]];
  }, [comparedCareerIds, allOccupations]);

  // Active Priority Lens for dynamic simulation
  const [activeLens, setActiveLens] = useState<ComparisonPriorityLens>('balanced');
  const [selectedCurrencyRegion, setSelectedCurrencyRegion] = useState<'US' | 'EU' | 'India'>('US');

  // Compute multi-career comparison report
  const report = useMemo(() => {
    return careerComparisonEngine.compareOccupations(
      comparedOccupations,
      profile.intelligenceProfile
    );
  }, [comparedOccupations, profile.intelligenceProfile]);

  const lensRankings = report.priorityLensRankings[activeLens];

  const lenses: Array<{ id: ComparisonPriorityLens; label: string; desc: string }> = [
    { id: 'balanced', label: 'Balanced Baseline', desc: 'Standard 6-dimensional weighting' },
    { id: 'maximize-compensation', label: 'Max Compensation', desc: 'Prioritizes highest salary envelope' },
    { id: 'maximize-autonomy', label: 'Max Autonomy', desc: 'Prioritizes strategic latitude and independence' },
    { id: 'maximize-remote', label: 'Max Remote', desc: 'Prioritizes location independence' },
    { id: 'low-barrier-entry', label: 'Low Entry Barrier', desc: 'Prioritizes shortest preparation curve' },
    { id: 'maximize-values', label: 'Values & Impact', desc: 'Prioritizes societal impact and purpose' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Technical Spec */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#00F0B4] tracking-wider uppercase font-medium">
              <CompassRose size={16} color="#00F0B4" />
              <span>Career Comparison</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
              Side-by-Side Trade-Off Analysis
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1.5 leading-relaxed font-sans">
              Compare compensation, required skills, work environment, and suitability across multiple target careers.
            </p>
          </div>

          {/* Status Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDestination('atlas')}
              className="px-4 py-2 border border-white/20 bg-white/[0.02] text-xs font-mono text-slate-200 hover:bg-white/[0.05] hover:border-[#00F0B4] transition-all flex items-center gap-2 rounded btn-tactile"
            >
              <MapIcon className="w-3.5 h-3.5 text-[#00F0B4]" />
              <span>Select Careers From Atlas ({comparedCareerIds.length}/3)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Priority Lens Simulator Toolbar */}
      <div className="p-4 bg-[#090B0E] border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
          <div className="flex items-center gap-2 text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-[#00F0B4]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              INTERACTIVE PRIORITY SIMULATOR
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            Dynamically recalculates ranking among compared options based on simulated priorities.
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {lenses.map((lens) => (
            <button
              key={lens.id}
              onClick={() => setActiveLens(lens.id)}
              className={clsx(
                'px-3 py-1.5 border text-left transition-colors whitespace-nowrap',
                activeLens === lens.id
                  ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-[#00F0B4] font-medium'
                  : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.02]'
              )}
            >
              <div className="text-[11px]">{lens.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid (2 to 3 Columns) */}
      <div
        className={clsx(
          'grid gap-6 items-stretch',
          comparedOccupations.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
        )}
      >
        {comparedOccupations.map((occ) => {
          const match = report.matchResults?.[occ.id];
          const lensRank = lensRankings?.find((r) => r.occupationId === occ.id);
          const isTopRank = lensRank?.rank === 1;

          return (
            <TechCard
              key={occ.id}
              tag={occ.provenance.sourceId}
              title={occ.title.toUpperCase()}
              glow={isTopRank}
              action={
                <button
                  onClick={() => toggleCompareCareer(occ.id)}
                  title="Remove from comparison"
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              }
            >
              <div className="space-y-6 font-mono text-xs">
                {/* Priority Lens Simulated Fitness Score */}
                <div
                  className={clsx(
                    'p-3 border space-y-1',
                    isTopRank
                      ? 'border-[#00F0B4]/40 bg-[#00F0B4]/[0.04]'
                      : 'border-white/10 bg-white/[0.01]'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase">
                      LENS FITNESS (RANK #{lensRank?.rank || 1})
                    </span>
                    <span
                      className={clsx(
                        'text-base font-bold',
                        isTopRank ? 'text-[#00F0B4]' : 'text-slate-200'
                      )}
                    >
                      {lensRank?.simulatedScore || match?.overallCompatibility || 80}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans leading-tight">
                    {lensRank?.lensRationale}
                  </div>
                </div>

                {/* Profile Compatibility (if profile available) */}
                {match && (
                  <div className="flex items-center justify-between p-2.5 bg-black/30 border border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">
                        PROFILE COMPATIBILITY
                      </span>
                      <span className="text-[#00F0B4] font-bold text-sm">
                        {match.overallCompatibility}%
                      </span>
                    </div>
                    <span className="px-2 py-0.5 border border-white/10 text-[9px] text-slate-300">
                      {match.compatibilityTier}
                    </span>
                  </div>
                )}

                {/* Industry & Family */}
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <span className="text-slate-500 block uppercase text-[10px]">OCCUPATIONAL DOMAIN</span>
                  <div className="text-white font-medium">{occ.family}</div>
                  <div className="text-slate-400 text-[10px]">{occ.industry}</div>
                </div>

                {/* Multi-Region Compensation Envelope */}
                <div className="p-3 bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
                    <span className="text-slate-400 text-[10px] uppercase">COMPENSATION</span>
                    <div className="flex gap-1 text-[9px]">
                      {(['US', 'EU', 'India'] as const).map((r) => (
                        <button
                          key={r}
                          onClick={() => setSelectedCurrencyRegion(r)}
                          className={clsx(
                            'px-1.5 py-0.5 border',
                            selectedCurrencyRegion === r
                              ? 'border-[#00F0B4] text-[#00F0B4]'
                              : 'border-white/10 text-slate-500'
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedCurrencyRegion === 'US' && (
                    <div className="space-y-0.5">
                      <div className="text-[#00F0B4] text-xl font-bold">
                        ${(occ.salaryBand.medianUsd / 1000).toFixed(0)}k USD
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Range: ${(occ.salaryBand.entryUsd / 1000).toFixed(0)}k – ${(occ.salaryBand.topDecileUsd / 1000).toFixed(0)}k
                      </div>
                    </div>
                  )}

                  {selectedCurrencyRegion === 'EU' && (
                    <div className="space-y-0.5">
                      <div className="text-sky-400 text-xl font-bold">
                        €{Math.round(occ.salaryBand.medianUsd * 0.92 / 1000)}k EUR
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Range: €{Math.round(occ.salaryBand.entryUsd * 0.92 / 1000)}k – €{Math.round(occ.salaryBand.topDecileUsd * 0.92 / 1000)}k
                      </div>
                    </div>
                  )}

                  {selectedCurrencyRegion === 'India' && (
                    <div className="space-y-0.5">
                      <div className="text-emerald-400 text-xl font-bold">
                        ₹{(occ.geographicApplicability.regionalProfiles?.India?.salaryBand?.median || 2400000) / 100000} LPA
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Range: ₹{(occ.geographicApplicability.regionalProfiles?.India?.salaryBand?.entry || 1000000) / 100000} – ₹{(occ.geographicApplicability.regionalProfiles?.India?.salaryBand?.top || 5000000) / 100000} LPA
                      </div>
                    </div>
                  )}

                  <div className="text-[9px] text-slate-500">{occ.salaryBand.source}</div>
                </div>

                {/* Work Environment & Characteristics */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <span className="text-slate-500 uppercase text-[10px] block">
                    WORK CHARACTERISTICS
                  </span>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Autonomy Latitude:</span>
                    <span className="text-slate-200 uppercase">{occ.typicalAutonomy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remote Viability:</span>
                    <span className="text-[#00F0B4] uppercase">{occ.workEnvironments.remoteViability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Collaboration Level:</span>
                    <span className="text-slate-200 uppercase">{occ.collaborationLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Travel Requirement:</span>
                    <span className="text-slate-200 uppercase">{occ.workEnvironments.travelRequirement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min. Preparation Years:</span>
                    <span className="text-slate-200">
                      {report.workCharacteristicsMatrix.preparationYears[occ.id]} Years
                    </span>
                  </div>
                </div>

                {/* Primary Trade-Offs */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <span className="text-amber-400 uppercase text-[10px] block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>DELIBERATE TRADE-OFF</span>
                  </span>
                  {occ.keyTradeOffs.slice(0, 1).map((to, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-amber-500/[0.03] border border-amber-500/20 text-[11px] space-y-1 font-sans"
                    >
                      <div className="text-emerald-400 font-medium">
                        + Gain: <span className="text-slate-200">{to.positive}</span>
                      </div>
                      <div className="text-rose-300 font-medium">
                        - Cost: <span className="text-slate-300">{to.negativeOrCost}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Essential Skills */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <span className="text-slate-500 uppercase text-[10px] block">
                    ESSENTIAL COMPETENCIES ({occ.essentialSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {occ.essentialSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 border border-white/10 bg-white/[0.02] text-[10px] text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA: Select for Pathway */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActivePathwayCareerId(occ.id);
                      setDestination('pathways');
                    }}
                    className="w-full py-2.5 border border-[#00F0B4]/40 hover:bg-[#00F0B4]/10 text-[#00F0B4] text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Select for Pathway</span>
                  </button>
                </div>
              </div>
            </TechCard>
          );
        })}
      </div>

      {/* Comparative Dimensional Synthesis Table */}
      {report.dimensionalDifferences.length > 0 && (
        <div className="p-6 border border-white/10 bg-[#090B0E] space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300 border-b border-white/[0.08] pb-3">
            <TrendingUp className="w-4 h-4 text-[#00F0B4]" />
            <span className="font-semibold text-sm">
              DIMENSIONAL ADVANTAGE & DELTA ANALYSIS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase">
                  <th className="py-2 pr-4">Dimension</th>
                  {comparedOccupations.map((occ) => (
                    <th key={occ.id} className="py-2 px-4">
                      {occ.title.split(' ')[0]} {occ.title.split(' ')[1]}
                    </th>
                  ))}
                  <th className="py-2 pl-4">Advantage Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-[11px]">
                {report.dimensionalDifferences.map((diff) => {
                  return (
                    <tr key={diff.dimension} className="hover:bg-white/[0.01]">
                      <td className="py-2.5 pr-4 text-slate-300 font-medium">{diff.label}</td>
                      {comparedOccupations.map((occ) => {
                        const val = diff.values[occ.id];
                        const isWinner = diff.winnerOccupationId === occ.id;
                        return (
                          <td key={occ.id} className="py-2.5 px-4 font-mono">
                            <span
                              className={clsx(
                                isWinner
                                  ? 'text-[#00F0B4] font-bold'
                                  : 'text-slate-400'
                              )}
                            >
                              {val}% {isWinner && '★'}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-2.5 pl-4 text-slate-400 font-sans text-[11px]">
                        {diff.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
