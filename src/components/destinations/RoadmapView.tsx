import React, { useState, useMemo } from 'react';
import { useCareerPilot } from '../../context/useCareerPilot';
import { careerGraphDatabase } from '../../engine/graph/careerGraphDatabase';
import { pathwayGenerationEngine } from '../../engine/graph/pathwayGenerationEngine';
import type { MilestoneProgressStatus, UserCareerMilestone } from '../../types/careerGraph';
import { TechCard } from '../common/TechCard';
import { CompassRose } from '../common/BespokeIcons';
import {
  CheckSquare,
  Square,
  Printer,
  Compass,
  GitFork,
  CheckCircle2,
  Clock,
  Pin,
  Sparkles,
  ArrowRight,
  Target,
} from 'lucide-react';
import { clsx } from 'clsx';

interface ActionSprintItem {
  id: string;
  title: string;
  timeframe: 'Next 7 Days' | 'Next 30 Days' | 'Quarter 1';
  category: 'Skill Acquisition' | 'Portfolio Project' | 'Industry Research';
  hours: number;
  completed: boolean;
}

export const RoadmapView: React.FC = () => {
  const {
    profile,
    activePathwayCareerId,
    setActivePathwayCareerId,
    savedPathways,
    updateMilestoneStatus,
    togglePinMilestone,
    completedSkillIds,
    markSkillCompleted,
    unmarkSkillCompleted,
    setDestination,
  } = useCareerPilot();

  const allOccupations = useMemo(() => careerGraphDatabase.getAllOccupations(), []);

  // Determine Target Occupation
  const targetOccupation = useMemo(() => {
    if (activePathwayCareerId) {
      const found = careerGraphDatabase.getOccupation(activePathwayCareerId);
      if (found) return found;
    }
    // Check if user has any saved pathways
    const savedKeys = Object.keys(savedPathways || {});
    if (savedKeys.length > 0) {
      const firstSaved = savedPathways[savedKeys[0]];
      const found = careerGraphDatabase.getOccupation(firstSaved.pathway.destinationOccupationId);
      if (found) return found;
    }
    return allOccupations[0];
  }, [activePathwayCareerId, savedPathways, allOccupations]);

  // Saved pathway for this target occupation if exists
  const activeSavedPathway = useMemo(() => {
    const list = Object.values(savedPathways || {});
    return list.find((item) => item.pathway.destinationOccupationId === targetOccupation.id);
  }, [savedPathways, targetOccupation.id]);

  // Generate fallback pathway if not saved
  const generatedFallbackPathway = useMemo(() => {
    if (activeSavedPathway) return activeSavedPathway.pathway;
    const pathways = pathwayGenerationEngine.generatePathwaysForOccupation(
      targetOccupation.id,
      profile
    );
    return pathways[0] || null;
  }, [activeSavedPathway, targetOccupation.id, profile]);

  // Current active pathway
  const activePathway = activeSavedPathway ? activeSavedPathway.pathway : generatedFallbackPathway;

  // Local immediate sprint actions
  const [sprintActions, setSprintActions] = useState<ActionSprintItem[]>([
    {
      id: 'act-01',
      title: `Audit foundational literature & architecture specifications for ${targetOccupation.title}.`,
      timeframe: 'Next 7 Days',
      category: 'Skill Acquisition',
      hours: 6,
      completed: true,
    },
    {
      id: 'act-02',
      title: `Initialize public proof repository benchmarking key competencies for ${targetOccupation.specializations[0] || 'core systems'}.`,
      timeframe: 'Next 7 Days',
      category: 'Portfolio Project',
      hours: 4,
      completed: false,
    },
    {
      id: 'act-03',
      title: 'Analyze 3 real-world production post-mortems and technical whitepapers in this industry.',
      timeframe: 'Next 7 Days',
      category: 'Industry Research',
      hours: 3,
      completed: false,
    },
    {
      id: 'act-04',
      title: 'Implement demonstration prototype showcasing domain constraints, error resilience, and metrics.',
      timeframe: 'Next 30 Days',
      category: 'Portfolio Project',
      hours: 15,
      completed: false,
    },
    {
      id: 'act-05',
      title: 'Conduct peer code review and author comprehensive technical RFC documentation.',
      timeframe: 'Next 30 Days',
      category: 'Skill Acquisition',
      hours: 8,
      completed: false,
    },
  ]);

  const toggleSprintAction = (id: string) => {
    setSprintActions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedSprintCount = sprintActions.filter((a) => a.completed).length;
  const sprintProgressPercent = Math.round((completedSprintCount / sprintActions.length) * 100);

  // Target Skills
  const targetSkills = useMemo(() => {
    return targetOccupation.essentialSkills.map((name: string, index: number) => {
      const skillId = `sk-${targetOccupation.id}-${index}`;
      const isCompleted = completedSkillIds.includes(skillId);
      return {
        id: skillId,
        name,
        isCompleted,
      };
    });
  }, [targetOccupation, completedSkillIds]);

  // Milestone Progress within active pathway
  const allMilestones = useMemo(() => {
    if (activeSavedPathway && activeSavedPathway.milestones?.length > 0) {
      return activeSavedPathway.milestones;
    }
    if (!activePathway) return [];

    // Synthesize milestones from pathway steps if not already saved
    return activePathway.steps.map((step, idx) => ({
      id: `ms-${activePathway.id}-${idx}`,
      pathwayId: activePathway.id,
      stepIndex: step.stepIndex,
      title: `${step.title}: ${step.practicalDeliverables[0] || step.subtitle}`,
      status: (idx === 0 ? 'in-progress' : 'not-started') as MilestoneProgressStatus,
      isPinned: idx === 0,
    }));
  }, [activePathway, activeSavedPathway]);

  const completedMilestoneCount = allMilestones.filter((m) => m.status === 'completed').length;
  const milestoneProgressPercent =
    allMilestones.length > 0
      ? Math.round((completedMilestoneCount / allMilestones.length) * 100)
      : 0;

  const handleMilestoneToggle = (milestone: UserCareerMilestone) => {
    if (!activePathway) return;
    const nextStatus: MilestoneProgressStatus =
      milestone.status === 'completed'
        ? 'not-started'
        : milestone.status === 'in-progress'
        ? 'completed'
        : 'in-progress';
    updateMilestoneStatus(activePathway.id, milestone.id, nextStatus);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header & Target Career Selector */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[#00F0B4] tracking-wider uppercase font-medium">
              <CompassRose size={16} color="#00F0B4" />
              <span>Career Roadmap & Execution Plan</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
              Action Plan: <span className="text-[#00F0B4]">{targetOccupation.title}</span>
            </h1>

            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed font-sans">
              Concrete weekly milestones, portfolio deliverables, and targeted skills to guide your transition toward {targetOccupation.title}.
            </p>
          </div>

          {/* Controls: Target Role Switcher & Print */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={targetOccupation.id}
              onChange={(e) => setActivePathwayCareerId(e.target.value)}
              className="px-3 py-2 bg-[#0E1217] border border-white/20 text-slate-200 text-xs font-sans rounded focus:border-[#00F0B4] focus:outline-none"
              aria-label="Select target role for roadmap"
            >
              {allOccupations.map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.title} ({occ.industry})
                </option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 border border-white/20 bg-white/[0.02] text-xs font-mono text-slate-200 hover:bg-white/[0.05] hover:border-[#00F0B4] transition-all flex items-center gap-1.5 rounded btn-tactile"
              title="Print execution roadmap"
            >
              <Printer className="w-3.5 h-3.5 text-[#00F0B4]" />
              <span>Print Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Overview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0D1117] border border-white/[0.08] rounded font-mono text-xs">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            PATHWAY STATUS
          </div>
          <div className="text-white text-base font-semibold mt-1 flex items-center gap-2">
            {activeSavedPathway ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#00F0B4]" />
                <span className="text-[#00F0B4]">Saved to My Pathways</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span className="text-sky-300">Generated Roadmap</span>
              </>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Category: {activePathway?.categoryLabel || 'Standard Entry'}
          </div>
        </div>

        <div className="p-4 bg-[#0D1117] border border-white/[0.08] rounded font-mono text-xs">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            MILESTONES COMPLETED
          </div>
          <div className="text-[#00F0B4] text-xl font-bold mt-1">
            {completedMilestoneCount} of {allMilestones.length}
          </div>
          <div className="w-full h-1.5 bg-white/10 mt-2 rounded overflow-hidden">
            <div
              className="h-full bg-[#00F0B4] transition-all duration-300"
              style={{ width: `${milestoneProgressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-[#0D1117] border border-white/[0.08] rounded font-mono text-xs">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            ESTIMATED TIMELINE
          </div>
          <div className="text-white text-xl font-bold mt-1">
            {activePathway?.totalDurationMonths || 18} Months
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Feasibility Score: {activePathway?.feasibilityScore || 85}%
          </div>
        </div>

        <div className="p-4 bg-[#0D1117] border border-white/[0.08] rounded font-mono text-xs">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            ACTION CADENCE
          </div>
          <div className="text-amber-400 text-xl font-bold mt-1">10 – 12 Hours / Wk</div>
          <div className="text-[11px] text-slate-400 mt-1">Sustainable pace for mastery</div>
        </div>
      </div>

      {/* Main Grid: Sprint Checklist + Pathway Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Sprints & Pathway Milestones */}
        <div className="lg:col-span-7 space-y-6">
          {/* SPRINT 01: Immediate Actions */}
          <TechCard
            tag="SPRINT-01"
            title="IMMEDIATE SPRINT ACTIONS (NEXT 7 TO 30 DAYS)"
            glow={true}
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/[0.06] pb-2">
                <span>Task Checklist</span>
                <span className="text-[#00F0B4] font-bold">
                  {completedSprintCount}/{sprintActions.length} Completed ({sprintProgressPercent}%)
                </span>
              </div>

              {sprintActions.map((act) => (
                <div
                  key={act.id}
                  onClick={() => toggleSprintAction(act.id)}
                  className={clsx(
                    'p-3.5 border transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none rounded',
                    act.completed
                      ? 'border-[#00F0B4]/40 bg-[#00F0B4]/5 text-slate-400'
                      : 'border-white/10 bg-[#0E1217]/80 hover:border-white/30 text-slate-200'
                  )}
                >
                  <button
                    className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-[#00F0B4] transition-colors"
                    aria-label={act.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {act.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#00F0B4]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div
                      className={clsx(
                        'font-sans text-xs sm:text-sm font-medium leading-snug',
                        act.completed && 'line-through text-slate-500'
                      )}
                    >
                      {act.title}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="text-[#00F0B4] uppercase font-mono">{act.timeframe}</span>
                      <span>·</span>
                      <span>{act.category}</span>
                      <span>·</span>
                      <span>~{act.hours}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TechCard>

          {/* PATHWAY STAGES & STEPS */}
          {activePathway && (
            <TechCard
              tag="PROGRESSION"
              title={`PATHWAY STEPS: ${activePathway.title.toUpperCase()}`}
            >
              <div className="space-y-6">
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {activePathway.description}
                </p>

                <div className="space-y-4">
                  {activePathway.steps.map((step) => {
                    const matchedMilestone = allMilestones.find(
                      (m) => m.stepIndex === step.stepIndex
                    );
                    const isDone = matchedMilestone?.status === 'completed';
                    const isInProgress = matchedMilestone?.status === 'in-progress';
                    const isPinned = matchedMilestone?.isPinned;

                    return (
                      <div
                        key={step.stepIndex}
                        className="p-4 bg-[#090C10] border border-white/[0.08] rounded space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00F0B4]/10 text-[#00F0B4] border border-[#00F0B4]/30 rounded">
                              Step {step.stepIndex + 1}
                            </span>
                            <h4 className="text-sm font-medium text-white font-sans">
                              {step.title}
                            </h4>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{step.durationMonths} Months</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {step.description}
                        </p>

                        {/* Step Milestone Action */}
                        {matchedMilestone && (
                          <div
                            onClick={() => handleMilestoneToggle(matchedMilestone)}
                            className={clsx(
                              'p-2.5 border rounded flex items-center justify-between gap-3 cursor-pointer transition-colors select-none font-mono text-xs',
                              isDone
                                ? 'border-[#00F0B4]/40 bg-[#00F0B4]/5 text-slate-400'
                                : isInProgress
                                ? 'border-sky-400/40 bg-sky-400/5 text-slate-200'
                                : 'border-white/10 bg-white/[0.01] hover:border-white/20 text-slate-300'
                            )}
                          >
                            <div className="flex items-center gap-2.5 flex-1">
                              <button className="text-slate-400 hover:text-[#00F0B4]">
                                {isDone ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-[#00F0B4]" />
                                ) : (
                                  <Square className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <div>
                                <span
                                  className={clsx(
                                    'font-sans text-xs font-medium',
                                    isDone && 'line-through text-slate-500'
                                  )}
                                >
                                  {matchedMilestone.title}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={clsx(
                                  'px-2 py-0.5 text-[9px] uppercase tracking-wider rounded border',
                                  isDone
                                    ? 'border-[#00F0B4]/40 bg-[#00F0B4]/10 text-[#00F0B4]'
                                    : isInProgress
                                    ? 'border-sky-400/40 bg-sky-400/10 text-sky-300'
                                    : 'border-white/10 bg-white/[0.02] text-slate-400'
                                )}
                              >
                                {matchedMilestone.status}
                              </span>

                              {activeSavedPathway && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePinMilestone(activePathway.id, matchedMilestone.id);
                                  }}
                                  className={clsx(
                                    'p-1 text-slate-400 hover:text-amber-400 transition-colors',
                                    isPinned && 'text-amber-400'
                                  )}
                                  title={isPinned ? 'Unpin milestone' : 'Pin milestone'}
                                >
                                  <Pin className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Deliverables tags */}
                        {step.practicalDeliverables.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1.5 font-mono text-[10px]">
                            {step.practicalDeliverables.map((del, dIdx) => (
                              <span
                                key={dIdx}
                                className="px-2 py-0.5 bg-white/[0.02] border border-white/[0.06] text-slate-400 rounded"
                              >
                                Deliverable: {del}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </TechCard>
          )}
        </div>

        {/* Right Column (5 cols): Skills Acquisition & Connected Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          {/* SKILLS DELTA ANALYSIS */}
          <TechCard tag="SKILLS-GAP" title="SKILLS ACQUISITION TARGETS">
            <div className="space-y-4 font-mono text-xs">
              <p className="text-slate-300 text-xs font-sans leading-relaxed">
                Prioritized competencies required for {targetOccupation.title}. Check off skills as you demonstrate mastery:
              </p>

              <div className="space-y-2">
                {targetSkills.map((sk) => (
                  <div
                    key={sk.id}
                    onClick={() => {
                      if (sk.isCompleted) {
                        unmarkSkillCompleted(sk.id);
                      } else {
                        markSkillCompleted(sk.id);
                      }
                    }}
                    className={clsx(
                      'p-3 border rounded flex items-center justify-between cursor-pointer transition-colors select-none',
                      sk.isCompleted
                        ? 'border-[#00F0B4]/40 bg-[#00F0B4]/5 text-slate-400'
                        : 'border-white/10 bg-[#0E1217]/70 hover:border-white/20 text-slate-200'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {sk.isCompleted ? (
                        <CheckSquare className="w-4 h-4 text-[#00F0B4]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <div
                          className={clsx(
                            'font-sans text-xs font-medium',
                            sk.isCompleted && 'line-through text-slate-500'
                          )}
                        >
                          {sk.name}
                        </div>
                      </div>
                    </div>

                    <span
                      className={clsx(
                        'px-2 py-0.5 text-[9px] uppercase tracking-wider border rounded',
                        sk.isCompleted
                          ? 'border-[#00F0B4]/40 bg-[#00F0B4]/10 text-[#00F0B4]'
                          : 'border-white/20 bg-white/[0.02] text-slate-400'
                      )}
                    >
                      {sk.isCompleted ? 'VERIFIED' : 'TARGET'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white/[0.01] border border-dashed border-white/20 rounded text-[11px] text-slate-400 space-y-1 font-sans">
                <span className="text-[#00F0B4] font-semibold block uppercase font-mono text-[10px]">
                  PRACTICAL GUIDANCE
                </span>
                <p>
                  Focus on shipping demonstrable public work. A publicly verifiable repository with unit tests and clear design documentation outweighs course certificates.
                </p>
              </div>
            </div>
          </TechCard>

          {/* QUICK TRANSITION CONTROLS */}
          <TechCard tag="NAVIGATION" title="EXPLORATION SHORTCUTS">
            <div className="space-y-3 font-sans text-xs">
              <button
                onClick={() => {
                  setActivePathwayCareerId(targetOccupation.id);
                  setDestination('pathways');
                }}
                className="w-full p-3 bg-[#0D1117] border border-white/10 hover:border-[#00F0B4]/50 rounded flex items-center justify-between transition-colors group btn-tactile text-left"
              >
                <div className="flex items-center gap-2.5">
                  <GitFork className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-white font-medium group-hover:text-[#00F0B4] transition-colors">
                      Compare Alternative Pathways
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Explore academic, boot camp, and lateral transfer routes
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#00F0B4] group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  setActivePathwayCareerId(targetOccupation.id);
                  setDestination('atlas');
                }}
                className="w-full p-3 bg-[#0D1117] border border-white/10 hover:border-sky-400/50 rounded flex items-center justify-between transition-colors group btn-tactile text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="text-white font-medium group-hover:text-sky-300 transition-colors">
                      View in Career Atlas
                    </div>
                    <div className="text-[11px] text-slate-400">
                      See labor market graph connections and adjacent roles
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => setDestination('profile')}
                className="w-full p-3 bg-[#0D1117] border border-white/10 hover:border-purple-400/50 rounded flex items-center justify-between transition-colors group btn-tactile text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-white font-medium group-hover:text-purple-300 transition-colors">
                      Update Profile & Constraints
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Refine time availability, financial runway, and values
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </TechCard>
        </div>
      </div>
    </div>
  );
};
