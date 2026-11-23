import React, { useState, useMemo } from 'react';
import { useCareerPilot } from '../../context/CareerPilotContext';
import { careerGraphDatabase } from '../../engine/graph/careerGraphDatabase';
import { pathwayGenerationEngine } from '../../engine/graph/pathwayGenerationEngine';
import { pathwayRankingEngine } from '../../engine/graph/pathwayRankingEngine';
import { pathwayComparisonEngine } from '../../engine/graph/pathwayComparisonEngine';
import type { PathwayRankingPriorityLens } from '../../engine/graph/pathwayRankingEngine';
import type { GeneratedPathway, PathwayCategory, MilestoneProgressStatus } from '../../types/careerGraph';
import type { OccupationRecord } from '../../types/occupation';
import { TechCard } from '../common/TechCard';
import { CompassRose } from '../common/BespokeIcons';
import {
  GitFork,
  Scale,
  Bookmark,
  Pin,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Trash2,
} from 'lucide-react';
import { clsx } from 'clsx';

export const PathwaysView: React.FC = () => {
  const {
    profile,
    activePathwayCareerId,
    setActivePathwayCareerId,
    savedPathways,
    savePathway,
    removeSavedPathway,
    updateMilestoneStatus,
    togglePinMilestone,
    comparedPathwayIds,
    toggleComparePathway,
  } = useCareerPilot();

  const allOccupations = careerGraphDatabase.getAllOccupations();

  // Selected Target Career (defaults to activePathwayCareerId or first occupation)
  const selectedOccupation: OccupationRecord = useMemo(() => {
    if (activePathwayCareerId) {
      const found = careerGraphDatabase.getOccupation(activePathwayCareerId);
      if (found) return found;
    }
    return allOccupations[0];
  }, [activePathwayCareerId, allOccupations]);

  // View Mode: 'generator' | 'compare' | 'collection'
  const [activeTab, setActiveTab] = useState<'generator' | 'compare' | 'collection'>('generator');

  // Priority Lens for Ranking
  const [priorityLens, setPriorityLens] = useState<PathwayRankingPriorityLens>('balanced');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Generate and Rank Pathways for the Selected Career
  const candidatePathways = useMemo(() => {
    return pathwayGenerationEngine.generatePathwaysForOccupation(
      selectedOccupation.id,
      profile
    );
  }, [selectedOccupation.id, profile]);

  const rankedPathways = useMemo(() => {
    return pathwayRankingEngine.rankPathways(candidatePathways, profile, priorityLens);
  }, [candidatePathways, profile, priorityLens]);

  // Filtered Pathways
  const filteredRankedPathways = useMemo(() => {
    if (selectedCategoryFilter === 'All') return rankedPathways;
    return rankedPathways.filter((item) => item.pathway.category === selectedCategoryFilter);
  }, [rankedPathways, selectedCategoryFilter]);

  // Selected Pathway to inspect step-by-step
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>(
    rankedPathways[0]?.pathway.id || ''
  );

  const activePathway = useMemo(() => {
    const found = candidatePathways.find((p) => p.id === selectedPathwayId);
    return found || rankedPathways[0]?.pathway;
  }, [candidatePathways, selectedPathwayId, rankedPathways]);

  // Compare Report
  const comparedPathwaysList = useMemo(() => {
    return comparedPathwayIds
      .map((id) => candidatePathways.find((p) => p.id === id) || savedPathways[id]?.pathway)
      .filter(Boolean) as GeneratedPathway[];
  }, [comparedPathwayIds, candidatePathways, savedPathways]);

  const compareReport = useMemo(() => {
    if (comparedPathwaysList.length >= 2) {
      return pathwayComparisonEngine.comparePathways(comparedPathwaysList.slice(0, 3));
    }
    // Fallback: compare top 2 ranked pathways
    if (candidatePathways.length >= 2) {
      return pathwayComparisonEngine.comparePathways([candidatePathways[0], candidatePathways[1]]);
    }
    return null;
  }, [comparedPathwaysList, candidatePathways]);

  // Telemetry metrics from graph
  const telemetry = careerGraphDatabase.getTelemetry();

  // Helper formatting
  const getCategoryBadgeColor = (category: PathwayCategory) => {
    switch (category) {
      case 'direct-pathway':
        return 'border-[#00F0B4] text-[#00F0B4] bg-[#00F0B4]/10';
      case 'skill-based-pathway':
        return 'border-sky-400 text-sky-400 bg-sky-400/10';
      case 'alternative-education':
        return 'border-amber-400 text-amber-400 bg-amber-400/10';
      case 'bridge-career':
        return 'border-purple-400 text-purple-400 bg-purple-400/10';
      case 'interdisciplinary':
        return 'border-emerald-400 text-emerald-400 bg-emerald-400/10';
      case 'earn-while-learning':
        return 'border-teal-400 text-teal-400 bg-teal-400/10';
      case 'long-term-specialization':
        return 'border-indigo-400 text-indigo-400 bg-indigo-400/10';
      case 'career-transition':
        return 'border-rose-400 text-rose-400 bg-rose-400/10';
      default:
        return 'border-slate-500 text-slate-300';
    }
  };

  const isCurrentPathwaySaved = !!savedPathways[activePathway?.id || ''];
  const isCurrentPathwayCompared = comparedPathwayIds.includes(activePathway?.id || '');

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Architectural Spec */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#00F0B4] tracking-wider uppercase font-medium">
              <CompassRose size={16} color="#00F0B4" />
              <span>Career Pathways</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
              Actionable Pathways
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1.5 leading-relaxed font-sans">
              Step-by-step pathways showing realistic routes to reach target occupations through education, skill acquisition, and stepping-stone roles.
            </p>
          </div>

          {/* Career Graph Stats */}
          <div className="flex items-center gap-4 bg-[#0D1117] border border-white/10 p-3 font-mono text-xs shadow-md">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">CAREER NODES</div>
              <div className="text-[#00F0B4] font-semibold">
                {telemetry.totalEducationNodes + telemetry.totalSkillNodes + telemetry.totalExperienceNodes + telemetry.totalOccupations} Verified
              </div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">CAREER CONNECTIONS</div>
              <div className="text-sky-400 font-semibold">{telemetry.totalGraphEdges} Active</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase">ROUTES MAPPED</div>
              <div className="text-amber-400 font-semibold">{telemetry.generatedRouteCount} Validated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Destination Selector & View Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#090B0E] border border-white/10 p-4">
        {/* Destination Dropdown */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-500 uppercase text-[10px]">TARGET DESTINATION:</span>
          <select
            value={selectedOccupation.id}
            onChange={(e) => setActivePathwayCareerId(e.target.value)}
            className="bg-[#0E1217] border border-white/10 text-white font-medium px-3 py-1.5 focus:outline-none focus:border-[#00F0B4] max-w-xs sm:max-w-md"
          >
            {allOccupations.map((occ) => (
              <option key={occ.id} value={occ.id}>
                {occ.title}
              </option>
            ))}
          </select>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex p-1 bg-[#0E1217] border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('generator')}
            className={clsx(
              'px-3 py-1.5 transition-colors flex items-center gap-1.5',
              activeTab === 'generator'
                ? 'bg-[#00F0B4]/10 text-[#00F0B4] border border-[#00F0B4]/30 font-medium'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Generated Pathways ({candidatePathways.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={clsx(
              'px-3 py-1.5 transition-colors flex items-center gap-1.5',
              activeTab === 'compare'
                ? 'bg-sky-400/10 text-sky-400 border border-sky-400/30 font-medium'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare Routes ({comparedPathwayIds.length}/3)</span>
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={clsx(
              'px-3 py-1.5 transition-colors flex items-center gap-1.5',
              activeTab === 'collection'
                ? 'bg-purple-400/10 text-purple-400 border border-purple-400/30 font-medium'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>My Career Collection ({Object.keys(savedPathways).length})</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: GENERATED PATHWAYS EXPLORER                                    */}
      {/* ==================================================================== */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          {/* Priority Lens Simulator & Category Filter */}
          <div className="p-4 bg-[#0E1217] border border-white/10 space-y-3 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-[#00F0B4]" />
                <span className="uppercase text-[11px] font-semibold">
                  PATHWAY OPTIMIZATION LENS
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                Adjusts ranking weights across duration, out-of-pocket costs, and institutional credentials.
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'balanced', label: 'Balanced Baseline' },
                { id: 'fastest-timeline', label: 'Fastest Timeline' },
                { id: 'lowest-financial-cost', label: 'Lowest Out-of-Pocket Cost' },
                { id: 'maximum-pedigree', label: 'Institutional Degree Rigor' },
                { id: 'work-while-learning', label: 'Earn-While-Learning Cashflow' },
              ].map((lens) => (
                <button
                  key={lens.id}
                  onClick={() => setPriorityLens(lens.id as PathwayRankingPriorityLens)}
                  className={clsx(
                    'px-2.5 py-1 border text-[11px] transition-colors',
                    priorityLens === lens.id
                      ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-[#00F0B4] font-medium'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  )}
                >
                  {lens.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-white/[0.04]">
              <span className="text-slate-500 text-[10px] uppercase mr-1">CATEGORY:</span>
              {[
                'All',
                'direct-pathway',
                'skill-based-pathway',
                'alternative-education',
                'bridge-career',
                'interdisciplinary',
                'earn-while-learning',
                'long-term-specialization',
                'career-transition',
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={clsx(
                    'px-2 py-0.5 border text-[10px] whitespace-nowrap transition-colors',
                    selectedCategoryFilter === cat
                      ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-[#00F0B4]'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  )}
                >
                  {cat === 'All' ? 'All (8 Types)' : cat.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Main Stage: Pathways List (5 cols) + Detailed Step-by-Step Inspector (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Ranked Pathway Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="font-mono text-xs text-slate-500 flex items-center justify-between pb-1">
                <span>RANKED PATHWAYS ({filteredRankedPathways.length})</span>
                <span>SORT: FITNESS UNDER {priorityLens.toUpperCase()}</span>
              </div>

              {filteredRankedPathways.map((item, index) => {
                const path = item.pathway;
                const isSelected = activePathway?.id === path.id;
                const categoryStyle = getCategoryBadgeColor(path.category);

                return (
                  <div
                    key={path.id}
                    onClick={() => setSelectedPathwayId(path.id)}
                    className={clsx(
                      'p-4 border transition-all cursor-pointer relative bg-[#0E1217] text-left group',
                      isSelected
                        ? 'border-[#00F0B4] bg-[#00F0B4]/[0.03] shadow-[0_0_15px_rgba(0,240,180,0.1)]'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]'
                    )}
                  >
                    {/* Header: Rank, Category, Score */}
                    <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-500 font-bold">#{index + 1}</span>
                        <span className={clsx('px-1.5 py-0.5 border text-[9px] uppercase font-semibold', categoryStyle)}>
                          {path.categoryLabel.split('—')[1]?.trim() || path.category}
                        </span>
                        <span className="px-1.5 py-0.5 border border-white/10 text-slate-400 text-[9px]">
                          {path.steps.length} Stages
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-[#00F0B4]">
                          {item.compositeScore}%
                        </span>
                        <span className="text-[9px] text-slate-500 block">Fitness</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#00F0B4] transition-colors leading-snug">
                      {path.title}
                    </h3>
                    <p className="text-[11px] font-sans text-slate-400 mt-1 line-clamp-2">
                      {path.description}
                    </p>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/[0.06] font-mono text-[10px]">
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px]">DURATION</span>
                        <span className="text-slate-200 font-semibold">{path.totalDurationMonths} mo</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px]">CAPITAL</span>
                        <span className="text-slate-200 font-semibold">
                          ${(path.estimatedCostRangeUsd.max / 1000).toFixed(0)}k max
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase text-[9px]">RISK</span>
                        <span className={path.riskLevel === 'Low' ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                          {path.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Step-by-Step Pathway Inspector */}
            <div className="lg:col-span-7 sticky top-6 space-y-6">
              {activePathway && (
                <TechCard
                  tag={activePathway.categoryLabel.toUpperCase()}
                  title={activePathway.title.toUpperCase()}
                  action={
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <button
                        onClick={() => savePathway(activePathway)}
                        className={clsx(
                          'px-2.5 py-1 border transition-colors flex items-center gap-1.5',
                          isCurrentPathwaySaved
                            ? 'border-purple-400 bg-purple-400/10 text-purple-400'
                            : 'border-white/10 text-slate-400 hover:text-white'
                        )}
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>{isCurrentPathwaySaved ? 'Saved in Collection' : 'Save Pathway'}</span>
                      </button>

                      <button
                        onClick={() => toggleComparePathway(activePathway.id)}
                        className={clsx(
                          'px-2.5 py-1 border transition-colors flex items-center gap-1.5',
                          isCurrentPathwayCompared
                            ? 'border-sky-400 bg-sky-400/10 text-sky-400'
                            : 'border-white/10 text-slate-400 hover:text-white'
                        )}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isCurrentPathwayCompared ? 'Compared (1/3)' : 'Compare'}</span>
                      </button>
                    </div>
                  }
                >
                  <div className="space-y-6">
                    {/* Pathway Executive Summary */}
                    <div className="p-4 bg-white/[0.02] border border-white/10 space-y-3 font-mono text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-2">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">STARTING POINT</span>
                          <span className="text-white font-medium">{activePathway.startingPointSummary}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 text-[10px] uppercase block">VALIDATION STATUS</span>
                          <span className="text-[#00F0B4] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{activePathway.validationStatus.replace(/-/g, ' ').toUpperCase()}</span>
                          </span>
                        </div>
                      </div>

                      {/* Trade-Off Disclosure */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-2.5 bg-emerald-500/[0.03] border border-emerald-500/20 text-[11px] font-sans">
                          <span className="font-mono text-[10px] text-emerald-400 font-semibold block mb-0.5">
                            + STRATEGIC ADVANTAGE
                          </span>
                          <span className="text-slate-200">{activePathway.tradeOffSummary.primaryAdvantage}</span>
                        </div>
                        <div className="p-2.5 bg-amber-500/[0.03] border border-amber-500/20 text-[11px] font-sans">
                          <span className="font-mono text-[10px] text-amber-400 font-semibold block mb-0.5">
                            - CRITICAL COST OR SACRIFICE
                          </span>
                          <span className="text-slate-300">{activePathway.tradeOffSummary.criticalCostOrSacrifice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Progression Timeline */}
                    <div className="space-y-4">
                      <div className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#00F0B4]" />
                        <span>SEQUENTIAL TRANSITION STAGES ({activePathway.steps.length} STAGES)</span>
                      </div>

                      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                        {activePathway.steps.map((step) => {
                          return (
                            <div key={step.stepIndex} className="relative group">
                              {/* Timeline Pip */}
                              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#0E1217] border-2 border-[#00F0B4] flex items-center justify-center font-mono text-[10px] font-bold text-[#00F0B4]">
                                {step.stepIndex}
                              </div>

                              {/* Step Card */}
                              <div className="p-4 border border-white/10 bg-[#0E1217] space-y-2">
                                <div className="flex items-center justify-between gap-2 font-mono text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-500 uppercase">
                                      {step.nodeType.toUpperCase()}
                                    </span>
                                    <span className="text-white font-semibold text-sm">
                                      {step.title}
                                    </span>
                                  </div>
                                  <span className="text-[#00F0B4] text-[11px] font-semibold">
                                    {step.durationMonths > 0 ? `${step.durationMonths} Months` : 'Destination'}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                                  {step.description}
                                </p>

                                {/* Deliverables & Acquired Skills */}
                                {step.practicalDeliverables.length > 0 && (
                                  <div className="pt-2 border-t border-white/[0.04] text-[11px] font-mono text-slate-400">
                                    <span className="text-slate-500 uppercase text-[9px] block">DELIVERABLE:</span>
                                    <span className="text-slate-200">{step.practicalDeliverables.join(' · ')}</span>
                                  </div>
                                )}

                                {step.potentialFrictions.length > 0 && (
                                  <div className="text-[10px] text-amber-400/90 font-mono flex items-center gap-1.5 pt-1">
                                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                                    <span>{step.potentialFrictions.join('; ')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exploded Self Dimensional Contributions */}
                    <div className="p-4 border border-white/10 bg-[#090B0E] space-y-3 font-mono text-xs">
                      <div className="text-[11px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#00F0B4]" />
                        <span>EXPLODED SELF DIMENSIONAL MAPPING</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                        <div className="p-2 border border-white/[0.06] bg-black/20">
                          <span className="text-slate-500 block uppercase">INTEREST COHERENCE</span>
                          <span className="text-[#00F0B4] font-semibold text-xs">High</span>
                        </div>
                        <div className="p-2 border border-white/[0.06] bg-black/20">
                          <span className="text-slate-500 block uppercase">APTITUDE REASONING</span>
                          <span className="text-sky-400 font-semibold text-xs">Analytical</span>
                        </div>
                        <div className="p-2 border border-white/[0.06] bg-black/20">
                          <span className="text-slate-500 block uppercase">WORK STYLE MATCH</span>
                          <span className="text-purple-400 font-semibold text-xs">High Autonomy</span>
                        </div>
                        <div className="p-2 border border-white/[0.06] bg-black/20">
                          <span className="text-slate-500 block uppercase">FEASIBILITY INDEX</span>
                          <span className="text-emerald-400 font-semibold text-xs">{activePathway.feasibilityScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Attribution & Provenance */}
                    <div className="p-3 border border-white/[0.06] bg-black/40 font-mono text-[10px] text-slate-500 flex justify-between items-center">
                      <span>EVIDENCE SOURCES: {activePathway.evidenceSources.join(' · ')}</span>
                      <span>GEOGRAPHIC CONTEXT: {activePathway.geographicContext}</span>
                    </div>
                  </div>
                </TechCard>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: PATHWAY COMPARISON STUDIO                                     */}
      {/* ==================================================================== */}
      {activeTab === 'compare' && compareReport && (
        <div className="space-y-6">
          <div className="p-4 bg-[#0E1217] border border-white/10 font-mono text-xs flex justify-between items-center">
            <div>
              <span className="text-slate-400 uppercase text-[10px] block">COMPARING ROUTES TOWARDS:</span>
              <span className="text-white font-bold text-sm">{selectedOccupation.title}</span>
            </div>
            <span className="text-[#00F0B4] text-xs">
              {compareReport.pathways.length} ROUTES SELECTED
            </span>
          </div>

          {/* Side-by-Side Pathway Cards */}
          <div
            className={clsx(
              'grid gap-6 items-stretch',
              compareReport.pathways.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
            )}
          >
            {compareReport.pathways.map((path) => (
              <TechCard
                key={path.id}
                tag={path.categoryLabel.split('—')[1]?.trim() || path.category}
                title={path.title.toUpperCase()}
                glow={path.archetype === 'best-fit'}
              >
                <div className="space-y-5 font-mono text-xs">
                  {/* Archetype & Total Duration */}
                  <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase">PREPARATION TIMELINE</div>
                    <div className="text-[#00F0B4] text-2xl font-bold">
                      {path.totalDurationMonths} Months
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Total Stages: {path.steps.length} sequential transitions
                    </div>
                  </div>

                  {/* Capital Cost */}
                  <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase">ESTIMATED CAPITAL OUTLAY</div>
                    <div className="text-sky-400 text-lg font-bold">
                      ${path.estimatedCostRangeUsd.min.toLocaleString()} – ${path.estimatedCostRangeUsd.max.toLocaleString()} USD
                    </div>
                    <div className="text-[9px] text-slate-500">
                      ₹{path.estimatedCostRangeInr.min}–₹{path.estimatedCostRangeInr.max} Lakhs INR
                    </div>
                  </div>

                  {/* Risk & Feasibility */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Feasibility Index:</span>
                      <span className="text-[#00F0B4] font-semibold">{path.feasibilityScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk Profile:</span>
                      <span className={path.riskLevel === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>
                        {path.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Trade-Off Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06] font-sans">
                    <div className="p-2.5 bg-emerald-500/[0.03] border border-emerald-500/20 text-[11px]">
                      <span className="font-mono text-[9px] text-emerald-400 font-bold block mb-0.5">
                        CORE ADVANTAGE
                      </span>
                      <span className="text-slate-200">{path.tradeOffSummary.primaryAdvantage}</span>
                    </div>
                    <div className="p-2.5 bg-amber-500/[0.03] border border-amber-500/20 text-[11px]">
                      <span className="font-mono text-[9px] text-amber-400 font-bold block mb-0.5">
                        SACRIFICE OR COST
                      </span>
                      <span className="text-slate-300">{path.tradeOffSummary.criticalCostOrSacrifice}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => savePathway(path)}
                    className="w-full py-2 border border-white/20 hover:border-[#00F0B4] text-slate-200 hover:text-white transition-colors text-[11px] font-mono"
                  >
                    Select for Career Collection
                  </button>
                </div>
              </TechCard>
            ))}
          </div>

          {/* Side-by-Side Metric Comparison Table */}
          <div className="p-6 border border-white/10 bg-[#090B0E] space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-300 border-b border-white/[0.08] pb-3">
              <Scale className="w-4 h-4 text-[#00F0B4]" />
              <span className="font-semibold text-sm uppercase">PATHWAY COMPARISON MATRIX</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase">
                    <th className="py-2 pr-4">Evaluation Dimension</th>
                    {compareReport.pathways.map((p) => (
                      <th key={p.id} className="py-2 px-4">
                        {p.categoryLabel.split('—')[1]?.trim() || p.title}
                      </th>
                    ))}
                    <th className="py-2 pl-4">Analytical Insight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[11px]">
                  {compareReport.metrics.map((metric) => (
                    <tr key={metric.key} className="hover:bg-white/[0.01]">
                      <td className="py-2.5 pr-4 text-slate-300 font-medium">{metric.label}</td>
                      {compareReport.pathways.map((p) => {
                        const val = metric.values[p.id];
                        const isWinner = metric.winnerPathwayId === p.id;
                        return (
                          <td key={p.id} className="py-2.5 px-4 font-mono">
                            <span className={clsx(isWinner ? 'text-[#00F0B4] font-bold' : 'text-slate-400')}>
                              {String(val)} {isWinner && '★'}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-2.5 pl-4 text-slate-400 font-sans text-[11px]">
                        {metric.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: PERSONAL CAREER COLLECTION & MILESTONES                        */}
      {/* ==================================================================== */}
      {activeTab === 'collection' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#0E1217] border border-white/10 font-mono text-xs flex justify-between items-center">
            <div>
              <span className="text-slate-400 uppercase text-[10px] block">PERSONAL CAREER VAULT</span>
              <span className="text-white font-bold text-sm">
                Saved Pathways ({Object.keys(savedPathways).length})
              </span>
            </div>
            <span className="text-slate-500 text-[11px]">
              Progress is continuously preserved across profile updates.
            </span>
          </div>

          {Object.keys(savedPathways).length === 0 ? (
            <div className="p-12 border border-white/10 bg-[#0E1217] text-center space-y-3 font-mono text-xs text-slate-400">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-white font-semibold">Your Career Collection is Empty</div>
              <p className="max-w-md mx-auto text-slate-400 font-sans text-xs">
                Explore generated pathways for your target careers and save your preferred routes to track sequential milestone progress and pin key deliverables.
              </p>
              <button
                onClick={() => setActiveTab('generator')}
                className="px-4 py-2 bg-[#00F0B4] text-black font-semibold uppercase tracking-wider text-[11px] hover:bg-[#00F0B4]/90 transition-colors"
              >
                Explore Pathways
              </button>
            </div>
          ) : (
            Object.values(savedPathways).map((saved) => {
              const path = saved.pathway;
              const completedCount = saved.milestones.filter((m) => m.status === 'completed').length;
              const progressPct = Math.round((completedCount / (saved.milestones.length || 1)) * 100);

              return (
                <div key={path.id} className="p-6 border border-white/10 bg-[#0E1217] space-y-4 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#00F0B4] font-bold text-sm">{path.title}</span>
                        <span className="px-1.5 py-0.5 border border-white/10 text-slate-400 text-[10px]">
                          Target: {path.destinationTitle}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px]">Saved on {new Date(saved.savedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-slate-500 text-[10px] block uppercase">MILESTONE PROGRESS</span>
                        <span className="text-[#00F0B4] font-bold text-sm">
                          {completedCount} / {saved.milestones.length} ({progressPct}%)
                        </span>
                      </div>
                      <button
                        onClick={() => removeSavedPathway(path.id)}
                        title="Remove from collection"
                        className="text-slate-500 hover:text-rose-400 p-1.5 border border-white/10 hover:border-rose-400/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#00F0B4] transition-all duration-300" style={{ width: `${progressPct}%` }} />
                  </div>

                  {/* Milestones Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-slate-400 uppercase text-[10px] block">INTERACTIVE MILESTONES:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {saved.milestones.map((m) => (
                        <div
                          key={m.id}
                          className={clsx(
                            'p-3 border flex items-center justify-between gap-3 transition-colors',
                            m.status === 'completed'
                              ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                              : m.status === 'in-progress'
                              ? 'border-sky-400/30 bg-sky-400/[0.03]'
                              : 'border-white/[0.06] bg-black/20'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const nextStatus: MilestoneProgressStatus =
                                  m.status === 'completed'
                                    ? 'not-started'
                                    : m.status === 'in-progress'
                                    ? 'completed'
                                    : 'in-progress';
                                updateMilestoneStatus(path.id, m.id, nextStatus);
                              }}
                              className={clsx(
                                'w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-colors',
                                m.status === 'completed'
                                  ? 'border-emerald-400 bg-emerald-400 text-black'
                                  : m.status === 'in-progress'
                                  ? 'border-sky-400 bg-sky-400 text-black'
                                  : 'border-white/20'
                              )}
                            >
                              {m.status === 'completed' ? '✓' : m.status === 'in-progress' ? '●' : ''}
                            </button>
                            <span className={clsx(m.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200')}>
                              {m.stepIndex}. {m.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase text-slate-500">{m.status}</span>
                            <button
                              onClick={() => togglePinMilestone(path.id, m.id)}
                              title={m.isPinned ? 'Unpin' : 'Pin to Active Focus'}
                              className={clsx(
                                'p-1 transition-colors',
                                m.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                              )}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
