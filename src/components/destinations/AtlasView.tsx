import React, { useState, useMemo } from 'react';
import { useCareerPilot } from '../../context/CareerPilotContext';
import { occupationDatabase } from '../../engine/career/occupationDatabase';
import { CareerMatchingEngine } from '../../engine/career/careerMatchingEngine';
import type { CareerMatchResult, RecommendationCategory, UserFeedbackType } from '../../types/occupation';
import { CareerUniverseNetwork } from '../atlas/CareerUniverseNetwork';
import { TechCard } from '../common/TechCard';
import { CompassRose } from '../common/BespokeIcons';
import {
  Search,
  Bookmark,
  Scale,
  GitFork,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Globe,
  Sliders,
  DollarSign,
  Briefcase,
  HelpCircle,
  ThumbsUp,
  EyeOff,
  Clock,
} from 'lucide-react';
import { clsx } from 'clsx';

export const AtlasView: React.FC = () => {
  const {
    profile,
    toggleBookmarkCareer,
    comparedCareerIds,
    toggleCompareCareer,
    setActivePathwayCareerId,
    setDestination,
    careerFeedback,
    setCareerFeedback,
  } = useCareerPilot();

  // Engine instance
  const matchingEngine = useMemo(() => new CareerMatchingEngine(), []);

  // Compute matches if intelligence profile exists
  const careerMatches = useMemo(() => {
    if (profile.intelligenceProfile) {
      return matchingEngine.matchProfile(profile.intelligenceProfile);
    }
    // Fallback: match against all occupations with neutral baseline
    return occupationDatabase.getAll().map((occ) => {
      return matchingEngine.evaluateSingleOccupation(
        profile.intelligenceProfile || ({} as any),
        occ
      );
    });
  }, [profile.intelligenceProfile, matchingEngine]);

  // Mode Switcher: Personalized vs Universal Catalog
  const [viewMode, setViewMode] = useState<'personalized' | 'catalog'>('personalized');
  const [showNetworkGraph, setShowNetworkGraph] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [selectedRemote, setSelectedRemote] = useState<string>('All');
  const [selectedCurrencyRegion, setSelectedCurrencyRegion] = useState<'US' | 'EU' | 'India'>('US');

  // Active Selected Career for Deep Drawer (dynamically derived to preserve freshness)
  const [selectedOccupationId, setSelectedOccupationId] = useState<string>(careerMatches[0]?.occupation.id || '');

  const selectedMatch = useMemo(() => {
    return careerMatches.find((m) => m.occupation.id === selectedOccupationId) || careerMatches[0];
  }, [careerMatches, selectedOccupationId]);

  const setSelectedMatch = (match: CareerMatchResult) => {
    setSelectedOccupationId(match.occupation.id);
  };

  // Dynamic filter lists
  const allOccupations = occupationDatabase.getAll();
  const families = ['All', ...Array.from(new Set(allOccupations.map((c) => c.family)))];
  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Categories' },
    { id: 'direct-match', label: 'Direct Matches' },
    { id: 'adjacent-match', label: 'Adjacent Matches' },
    { id: 'interdisciplinary', label: 'Interdisciplinary' },
    { id: 'unexpected-discovery', label: 'Unexpected Discovery' },
    { id: 'aspirational', label: 'Aspirational' },
    { id: 'alternative-direction', label: 'Alternative Direction' },
  ];

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    return careerMatches.filter((match) => {
      const occ = match.occupation;
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        q === '' ||
        occ.title.toLowerCase().includes(q) ||
        occ.industry.toLowerCase().includes(q) ||
        occ.alternativeTitles.some((t) => t.toLowerCase().includes(q)) ||
        occ.essentialSkills.some((s) => s.toLowerCase().includes(q)) ||
        occ.typicalWorkActivities.some((a) => a.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'All' || match.recommendationCategory === selectedCategory;

      const matchesFamily = selectedFamily === 'All' || occ.family === selectedFamily;

      const matchesRemote =
        selectedRemote === 'All' || occ.workEnvironments.remoteViability === selectedRemote;

      return matchesSearch && matchesCategory && matchesFamily && matchesRemote;
    });
  }, [careerMatches, searchQuery, selectedCategory, selectedFamily, selectedRemote]);

  const activeOcc = selectedMatch?.occupation || allOccupations[0];
  const activeFeedback = careerFeedback[activeOcc.id]?.feedback;

  const getCategoryColor = (cat: RecommendationCategory) => {
    switch (cat) {
      case 'direct-match':
        return 'border-[#00F0B4] text-[#00F0B4] bg-[#00F0B4]/10';
      case 'adjacent-match':
        return 'border-sky-400 text-sky-400 bg-sky-400/10';
      case 'interdisciplinary':
        return 'border-purple-400 text-purple-400 bg-purple-400/10';
      case 'unexpected-discovery':
        return 'border-amber-400 text-amber-400 bg-amber-400/10';
      case 'aspirational':
        return 'border-rose-400 text-rose-400 bg-rose-400/10';
      case 'alternative-direction':
        return 'border-emerald-400 text-emerald-400 bg-emerald-400/10';
      default:
        return 'border-slate-500 text-slate-300 bg-slate-800/40';
    }
  };

  const getFeasibilityBadge = (status: string) => {
    switch (status) {
      case 'current-feasibility':
        return { label: 'Current Feasibility', color: 'text-[#00F0B4] border-[#00F0B4]/30 bg-[#00F0B4]/5' };
      case 'feasible-with-preparation':
        return { label: 'Feasible w/ Prep (1-2y)', color: 'text-amber-400 border-amber-400/30 bg-amber-400/5' };
      case 'long-term-potential':
        return { label: 'Long-term Potential (3-5y)', color: 'text-purple-400 border-purple-400/30 bg-purple-400/5' };
      case 'currently-incompatible':
        return { label: 'Currently Blocked', color: 'text-rose-400 border-rose-400/30 bg-rose-400/5' };
      default:
        return { label: 'Feasible', color: 'text-slate-300 border-slate-500/30' };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Technical Spec */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#00F0B4] tracking-wider uppercase font-medium">
              <CompassRose size={16} color="#00F0B4" />
              <span>Career Atlas</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
              Career Recommendations
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl mt-1.5 leading-relaxed font-sans">
              Explore career directions matched to your personal profile, with explainable compatibility scores and real-world labor market data.
            </p>
          </div>

          {/* Telemetry Stats & Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="inline-flex p-1 bg-[#0D1117] border border-white/10 font-mono text-xs">
              <button
                onClick={() => setViewMode('personalized')}
                className={clsx(
                  'px-3 py-1.5 transition-all flex items-center gap-1.5 btn-tactile',
                  viewMode === 'personalized'
                    ? 'bg-[#00F0B4]/10 text-[#00F0B4] border border-[#00F0B4]/30 font-medium'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Sparkles className="w-3 h-3" />
                <span>Personalized Matches</span>
              </button>
              <button
                onClick={() => setViewMode('catalog')}
                className={clsx(
                  'px-3 py-1.5 transition-all flex items-center gap-1.5 btn-tactile',
                  viewMode === 'catalog'
                    ? 'bg-sky-400/10 text-sky-400 border border-sky-400/30 font-medium'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Globe className="w-3 h-3" />
                <span>Universal Catalog ({allOccupations.length})</span>
              </button>
            </div>

            <button
              onClick={() => setShowNetworkGraph(!showNetworkGraph)}
              className={clsx(
                'px-3 py-2 border font-mono text-xs transition-all flex items-center gap-1.5 btn-tactile',
                showNetworkGraph
                  ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-[#00F0B4]'
                  : 'border-white/10 text-slate-400 hover:text-white'
              )}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>{showNetworkGraph ? 'Hide Graph' : 'Show Career Network'}</span>
            </button>

            <div className="flex items-center gap-3 bg-[#0D1117] border border-white/10 rounded p-2.5 font-mono text-xs">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Compare</div>
                <div className="text-sky-400 font-semibold">{comparedCareerIds.length} / 3 selected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Career Universe Network Visualizer */}
      {showNetworkGraph && (
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-[#00F0B4]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Career Network</span>
            </span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">
              You → Education → Skills → Bridge Roles → Target Careers
            </span>
          </div>
          <CareerUniverseNetwork
            occupations={allOccupations}
            selectedOccupation={activeOcc}
            onSelectOccupation={(occ) => {
              const match = careerMatches.find((m) => m.occupation.id === occ.id);
              if (match) setSelectedMatch(match);
            }}
            profile={profile.intelligenceProfile}
          />
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-[#090B0E] border border-white/10 p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, activity, skill, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0E1217] border border-white/10 pl-10 pr-4 py-2 font-mono text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00F0B4]"
            />
          </div>

          {/* Family Filter Dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500 uppercase text-[10px]">FAMILY:</span>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="bg-[#0E1217] border border-white/10 text-slate-200 px-3 py-1.5 focus:outline-none focus:border-[#00F0B4]"
            >
              {families.map((fam) => (
                <option key={fam} value={fam}>
                  {fam}
                </option>
              ))}
            </select>
          </div>

          {/* Remote Viability Filter */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-500 uppercase text-[10px]">REMOTE:</span>
            <select
              value={selectedRemote}
              onChange={(e) => setSelectedRemote(e.target.value)}
              className="bg-[#0E1217] border border-white/10 text-slate-200 px-3 py-1.5 focus:outline-none focus:border-[#00F0B4]"
            >
              <option value="All">All Arrangements</option>
              <option value="high">High Remote Viability</option>
              <option value="medium">Medium Remote Viability</option>
              <option value="low">Low Remote Viability</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Personalized Mode) */}
        {viewMode === 'personalized' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-white/[0.06] font-mono text-xs">
            <span className="text-slate-500 uppercase text-[10px] mr-2">CATEGORIES:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={clsx(
                  'px-2.5 py-1 border whitespace-nowrap transition-colors text-[11px]',
                  selectedCategory === cat.id
                    ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-[#00F0B4] font-medium'
                    : 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Split Layout: Ranked Career List (5 cols) + Deep Technical Inspector (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Career Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="font-mono text-xs text-slate-500 flex items-center justify-between pb-1">
            <span>RESULTS ({filteredMatches.length})</span>
            <span>SORTED BY: COMPATIBILITY</span>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="p-8 border border-white/10 bg-[#0E1217] text-center space-y-3 font-mono text-xs text-slate-400">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <div>No occupations match the active search criteria.</div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedFamily('All');
                  setSelectedRemote('All');
                }}
                className="text-[#00F0B4] underline hover:text-[#00F0B4]/80"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredMatches.map((match) => {
              const occ = match.occupation;
              const isSelected = selectedMatch?.occupation.id === occ.id;
              const isBookmarked = profile.bookmarkedCareers.includes(occ.id);
              const isCompared = comparedCareerIds.includes(occ.id);
              const categoryBadge = getCategoryColor(match.recommendationCategory);
              const feasibility = getFeasibilityBadge(match.feasibilityStatus);

              return (
                <div
                  key={occ.id}
                  onClick={() => setSelectedMatch(match)}
                  className={clsx(
                    'p-4 border transition-all cursor-pointer relative bg-[#0E1217] text-left group',
                    isSelected
                      ? 'border-[#00F0B4] bg-[#00F0B4]/[0.03] shadow-[0_0_15px_rgba(0,240,180,0.1)]'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/[0.01]'
                  )}
                >
                  {/* Top Bar: Code, Category, Match Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500">{occ.provenance.sourceId}</span>
                      <span className={clsx('px-1.5 py-0.5 border text-[9px] uppercase font-semibold', categoryBadge)}>
                        {match.recommendationCategory.replace('-', ' ')}
                      </span>
                      <span className={clsx('px-1.5 py-0.5 border text-[9px]', feasibility.color)}>
                        {feasibility.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-[#00F0B4]">
                          {match.overallCompatibility}%
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          {match.scoreConfidence}% Conf.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Industry */}
                  <div className="pr-12">
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#00F0B4] transition-colors leading-snug">
                      {occ.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 line-clamp-1">
                      {occ.family} · <span className="text-slate-500">{occ.industry}</span>
                    </p>
                  </div>

                  {/* 6-Dimension Mini Bar Sparkline */}
                  <div className="grid grid-cols-6 gap-1 my-3 pt-2 border-t border-white/[0.06]">
                    {match.dimensionScores.map((dim) => (
                      <div key={dim.dimensionKey} className="space-y-0.5 text-center">
                        <div className="h-1 bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[#00F0B4]"
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                        <div className="text-[8px] font-mono text-slate-500">
                          {dim.label.split(' ')[0]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Compensation & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] font-mono text-xs">
                    <div className="text-[#00F0B4] text-[11px] font-semibold">
                      ${(occ.salaryBand.medianUsd / 1000).toFixed(0)}k USD
                      <span className="text-slate-500 text-[10px] font-normal ml-1">median</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Bookmark Toggle */}
                      <button
                        onClick={() => toggleBookmarkCareer(occ.id)}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Career'}
                        className={clsx(
                          'p-1.5 border transition-colors',
                          isBookmarked
                            ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                            : 'border-white/10 text-slate-500 hover:text-slate-300'
                        )}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>

                      {/* Compare Toggle */}
                      <button
                        onClick={() => toggleCompareCareer(occ.id)}
                        title={isCompared ? 'Remove from Compare' : 'Add to Compare (up to 3)'}
                        className={clsx(
                          'px-2 py-1 border text-[10px] font-mono transition-colors flex items-center gap-1',
                          isCompared
                            ? 'border-sky-400 bg-sky-400/10 text-sky-400'
                            : 'border-white/10 text-slate-400 hover:text-slate-200'
                        )}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isCompared ? 'Compared' : 'Compare'}</span>
                      </button>

                      {/* Pathways Quick Link */}
                      <button
                        onClick={() => {
                          setActivePathwayCareerId(occ.id);
                          setDestination('pathways');
                        }}
                        title="Generate Strategic Pathways"
                        className="px-2 py-1 border border-[#00F0B4]/40 bg-[#00F0B4]/10 text-[#00F0B4] hover:bg-[#00F0B4]/20 text-[10px] font-mono transition-colors flex items-center gap-1"
                      >
                        <GitFork className="w-3 h-3" />
                        <span className="hidden sm:inline">Pathways</span>
                      </button>

                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#00F0B4] transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Deep Technical Inspection Drawer */}
        <div className="lg:col-span-7 sticky top-6 space-y-6">
          <TechCard
            tag={`PROVENANCE: ${activeOcc.provenance.primarySource} ${activeOcc.provenance.sourceId}`}
            title={activeOcc.title.toUpperCase()}
            action={
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => toggleBookmarkCareer(activeOcc.id)}
                  className={clsx(
                    'px-2.5 py-1 border transition-colors flex items-center gap-1.5',
                    profile.bookmarkedCareers.includes(activeOcc.id)
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  )}
                >
                  <Bookmark className="w-3 h-3" />
                  <span>{profile.bookmarkedCareers.includes(activeOcc.id) ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={() => toggleCompareCareer(activeOcc.id)}
                  className={clsx(
                    'px-2.5 py-1 border transition-colors flex items-center gap-1.5',
                    comparedCareerIds.includes(activeOcc.id)
                      ? 'border-sky-400 bg-sky-400/10 text-sky-400'
                      : 'border-white/10 text-slate-400 hover:text-white'
                  )}
                >
                  <Scale className="w-3 h-3" />
                  <span>{comparedCareerIds.includes(activeOcc.id) ? 'Compared (1/3)' : 'Compare'}</span>
                </button>
              </div>
            }
          >
            <div className="space-y-6">
              {/* Header Overview */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                  <span>{activeOcc.family}</span> · <span>{activeOcc.industry}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed font-sans">
                  {activeOcc.description}
                </p>

                {/* Alternative Titles */}
                {activeOcc.alternativeTitles.length > 0 && (
                  <div className="mt-2 text-[11px] font-mono text-slate-500">
                    <span className="text-slate-400">Also classified as: </span>
                    {activeOcc.alternativeTitles.join(' · ')}
                  </div>
                )}
              </div>

              {/* Match Diagnostics Header (Personalized Mode) */}
              <div className="p-4 bg-white/[0.02] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00F0B4]" />
                    <span className="text-white font-semibold">COMPATIBILITY VERIFICATION</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-[#00F0B4]">
                      {selectedMatch.overallCompatibility}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      ({selectedMatch.compatibilityTier})
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {selectedMatch.categoryRationale}
                </div>

                {/* 6-Dimensional Breakdown Grid */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                    6-DIMENSIONAL COHERENCE VECTOR
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMatch.dimensionScores.map((dim) => (
                      <div
                        key={dim.dimensionKey}
                        className="p-2 border border-white/[0.06] bg-black/20 space-y-1"
                      >
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">{dim.label}</span>
                          <span className="text-[#00F0B4] font-semibold">{dim.score}%</span>
                        </div>
                        <div className="h-1 bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[#00F0B4]"
                            style={{ width: `${dim.score}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-slate-500 line-clamp-1">{dim.rationale}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Structured Explainability Accordion */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#00F0B4]" />
                  <span>TRANSPARENT EXPLAINABILITY ENGINE</span>
                </div>

                {/* 1. Why it Matches */}
                <div className="p-3 border border-emerald-500/20 bg-emerald-500/[0.03] space-y-1.5 font-mono text-xs">
                  <div className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WHY THIS MATCHES YOUR PROFILE</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 font-sans">
                    {selectedMatch.explanation.whyItMatches.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. What Might Be Difficult */}
                {selectedMatch.explanation.whatMightBeDifficult.length > 0 && (
                  <div className="p-3 border border-amber-500/20 bg-amber-500/[0.03] space-y-1.5 font-mono text-xs">
                    <div className="text-amber-400 font-semibold text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>POTENTIAL FRICTION & COGNITIVE DEMANDS</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 font-sans">
                      {selectedMatch.explanation.whatMightBeDifficult.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3. What You Already Have vs Need to Develop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 border border-white/10 bg-white/[0.01] space-y-1.5">
                    <div className="text-sky-400 font-semibold text-[11px]">
                      WHAT YOU CURRENTLY HAVE
                    </div>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 font-sans">
                      {selectedMatch.explanation.whatUserHas.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 border border-white/10 bg-white/[0.01] space-y-1.5">
                    <div className="text-purple-400 font-semibold text-[11px]">
                      WHAT YOU NEED TO DEVELOP
                    </div>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 font-sans">
                      {selectedMatch.explanation.whatUserNeeds.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Concrete Next Steps */}
                <div className="p-3 border border-white/10 bg-white/[0.01] space-y-1.5 font-mono text-xs">
                  <div className="text-[#00F0B4] font-semibold text-[11px] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>RECOMMENDED EXPLORATORY NEXT STEPS</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1 font-sans">
                    {selectedMatch.explanation.howToExploreFurther.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Multi-Region Compensation Matrix */}
              <div className="p-4 border border-white/10 bg-[#090B0E] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <DollarSign className="w-3.5 h-3.5 text-[#00F0B4]" />
                    <span className="uppercase text-[11px]">MULTI-REGION COMPENSATION BENCHMARK</span>
                  </div>
                  {/* Region Currency Selector */}
                  <div className="flex items-center gap-1 text-[10px]">
                    {(['US', 'EU', 'India'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setSelectedCurrencyRegion(r)}
                        className={clsx(
                          'px-2 py-0.5 border transition-colors',
                          selectedCurrencyRegion === r
                            ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-[#00F0B4]'
                            : 'border-white/10 text-slate-500 hover:text-slate-300'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCurrencyRegion === 'US' && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border border-white/[0.06] bg-black/20">
                      <div className="text-[10px] text-slate-500 uppercase">ENTRY LEVEL</div>
                      <div className="text-slate-200 font-semibold text-sm">
                        ${(activeOcc.salaryBand.entryUsd / 1000).toFixed(0)}k USD
                      </div>
                    </div>
                    <div className="p-2 border border-[#00F0B4]/30 bg-[#00F0B4]/5">
                      <div className="text-[10px] text-[#00F0B4] uppercase">MEDIAN SALARY</div>
                      <div className="text-[#00F0B4] font-bold text-sm">
                        ${(activeOcc.salaryBand.medianUsd / 1000).toFixed(0)}k USD
                      </div>
                    </div>
                    <div className="p-2 border border-white/[0.06] bg-black/20">
                      <div className="text-[10px] text-slate-500 uppercase">TOP DECILE</div>
                      <div className="text-slate-200 font-semibold text-sm">
                        ${(activeOcc.salaryBand.topDecileUsd / 1000).toFixed(0)}k USD
                      </div>
                    </div>
                  </div>
                )}

                {selectedCurrencyRegion === 'EU' && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border border-white/[0.06] bg-black/20">
                      <div className="text-[10px] text-slate-500 uppercase">ENTRY LEVEL</div>
                      <div className="text-slate-200 font-semibold text-sm">
                        €{Math.round(activeOcc.salaryBand.entryUsd * 0.92 / 1000)}k EUR
                      </div>
                    </div>
                    <div className="p-2 border border-sky-400/30 bg-sky-400/5">
                      <div className="text-[10px] text-sky-400 uppercase">MEDIAN SALARY</div>
                      <div className="text-sky-400 font-bold text-sm">
                        €{Math.round(activeOcc.salaryBand.medianUsd * 0.92 / 1000)}k EUR
                      </div>
                    </div>
                    <div className="p-2 border border-white/[0.06] bg-black/20">
                      <div className="text-[10px] text-slate-500 uppercase">TOP DECILE</div>
                      <div className="text-slate-200 font-semibold text-sm">
                        €{Math.round(activeOcc.salaryBand.topDecileUsd * 0.92 / 1000)}k EUR
                      </div>
                    </div>
                  </div>
                )}

                {selectedCurrencyRegion === 'India' && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border border-white/[0.06] bg-black/20">
                      <div className="text-[10px] text-slate-500 uppercase">ENTRY LEVEL</div>
                      <div className="text-slate-200 font-semibold text-sm">
                        ₹{(activeOcc.geographicApplicability.regionalProfiles?.India?.salaryBand?.entry || 1000000) / 100000} LPA
                      </div>
                    </div>
                    <div className="p-2 border border-emerald-400/30 bg-emerald-400/5">
                      <div className="text-[10px] text-emerald-400 uppercase">MEDIAN SALARY</div>
                      <div className="text-emerald-400 font-bold text-sm">
                        ₹{(activeOcc.geographicApplicability.regionalProfiles?.India?.salaryBand?.median || 2400000) / 100000} LPA
                      </div>
                    </div>
                    <div className="p-2 border border-white/[0.06] bg-black/20">
                      <div className="text-[10px] text-slate-500 uppercase">TOP DECILE</div>
                      <div className="text-slate-200 font-semibold text-sm">
                        ₹{(activeOcc.geographicApplicability.regionalProfiles?.India?.salaryBand?.top || 5000000) / 100000} LPA
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 pt-1">
                  Source: {activeOcc.salaryBand.source}
                </div>
              </div>

              {/* Work Characteristics & Conditions */}
              <div className="p-4 border border-white/10 bg-white/[0.01] space-y-3 font-mono text-xs">
                <div className="text-[11px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#00F0B4]" />
                  <span>WORK ENVIRONMENT & CHARACTERISTICS</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 text-[10px] block">AUTONOMY LATITUDE:</span>
                    <span className="text-slate-200 uppercase font-semibold">{activeOcc.typicalAutonomy}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">REMOTE VIABILITY:</span>
                    <span className="text-[#00F0B4] uppercase font-semibold">{activeOcc.workEnvironments.remoteViability}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">COLLABORATION DENSITY:</span>
                    <span className="text-slate-200 uppercase font-semibold">{activeOcc.collaborationLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">TRAVEL REQUIREMENT:</span>
                    <span className="text-slate-200 uppercase font-semibold">{activeOcc.workEnvironments.travelRequirement}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-400 font-sans">
                  <span className="font-mono text-[10px] text-slate-500 uppercase block">PACE & RHYTHM:</span>
                  {activeOcc.workEnvironments.paceAndRhythm}
                </div>
              </div>

              {/* User Feedback & Calibration Actions */}
              <div className="p-4 border border-white/10 bg-[#090B0E] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px] uppercase tracking-widest">
                    YOUR VERIFICATION & FEEDBACK
                  </span>
                  {activeFeedback && (
                    <span className="text-[#00F0B4] text-[10px]">
                      STATUS: {activeFeedback.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'interested', label: 'Interested', icon: ThumbsUp },
                    { id: 'already-considered', label: 'Already Considered', icon: Clock },
                    { id: 'not-interested-in-work', label: 'Dislike Daily Work', icon: EyeOff },
                    { id: 'concerned-about-requirements', label: 'Concerned by Prep Time', icon: AlertTriangle },
                    { id: 'dismissed', label: 'Dismiss', icon: AlertTriangle },
                  ].map((fb) => (
                    <button
                      key={fb.id}
                      onClick={() => setCareerFeedback(activeOcc.id, fb.id as UserFeedbackType)}
                      className={clsx(
                        'px-2.5 py-1.5 border text-[10px] transition-colors flex items-center gap-1.5',
                        activeFeedback === fb.id
                          ? 'border-[#00F0B4] bg-[#00F0B4]/10 text-[#00F0B4] font-medium'
                          : 'border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      )}
                    >
                      <fb.icon className="w-3 h-3" />
                      <span>{fb.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Attribution and Cross-Classifications */}
              <div className="p-3 border border-white/[0.06] bg-black/40 font-mono text-[10px] text-slate-500 space-y-1">
                <div className="flex items-center justify-between">
                  <span>CLASSIFICATION PROVENANCE:</span>
                  <span className="text-slate-400">{activeOcc.provenance.datasetVersion}</span>
                </div>
                <div className="flex gap-4">
                  <span>O*NET SOC: {activeOcc.provenance.crossClassifications?.onetSoc || 'N/A'}</span>
                  <span>ESCO: {activeOcc.provenance.crossClassifications?.escoCode || 'N/A'}</span>
                  <span>India NCO-2015: {activeOcc.provenance.crossClassifications?.nco2015Code || 'N/A'}</span>
                </div>
                <div className="text-[9px] text-slate-600 pt-1">
                  License: {activeOcc.provenance.license} · {activeOcc.provenance.attribution}
                </div>
              </div>

              {/* Active Pathway CTA */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActivePathwayCareerId(activeOcc.id);
                    setDestination('pathways');
                  }}
                  className="w-full py-3 bg-[#00F0B4] hover:bg-[#00F0B4]/90 text-black font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <GitFork className="w-4 h-4" />
                  <span>CONSTRUCT STRATEGIC PATHWAY FOR THIS CAREER</span>
                </button>
              </div>
            </div>
          </TechCard>
        </div>
      </div>
    </div>
  );
};
