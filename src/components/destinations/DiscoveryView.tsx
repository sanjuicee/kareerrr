import React, { useState } from 'react';
import { useCareerPilot } from '../../context/useCareerPilot';
import { DIMENSIONS } from '../../types/profile';
import type { DimensionKey } from '../../types/profile';
import { AdaptiveAssessmentConsole } from '../assessment/AdaptiveAssessmentConsole';
import { computeDimensionSignals } from '../../engine/branchingEngine';
import { DimensionEmblem } from '../common/BespokeIcons';
import {
  ArrowRight,
  Layers,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const DiscoveryView: React.FC = () => {
  const { profile, setDestination } = useCareerPilot();
  const [isQuestionnaireActive, setIsQuestionnaireActive] = useState<boolean>(
    Object.keys(profile.answers).length > 0
  );

  const totalAnswered = Object.keys(profile.answers).length;
  const dimensionSignals = computeDimensionSignals(profile.answers);

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Hero Header */}
      <div className="border-b border-white/[0.08] pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0B4] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00F0B4]" />
              <span>Career Pilot · Self-Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
              Discover career paths aligned with <span className="text-[#00F0B4]">who you actually are</span>.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
              An adaptive self-discovery tool exploring your curiosities, aptitudes, working preferences, and practical constraints to recommend realistic career directions.
            </p>
          </div>

          {/* Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isQuestionnaireActive ? (
              <button
                onClick={() => setIsQuestionnaireActive(true)}
                className="px-6 py-3 bg-[#00F0B4] hover:bg-[#00F0B4]/90 text-black text-xs font-semibold uppercase tracking-wider rounded-md transition-all shadow-[0_0_20px_rgba(0,240,180,0.18)] flex items-center justify-center gap-2 btn-tactile group"
              >
                <span>{totalAnswered > 0 ? 'Resume Assessment' : 'Start Assessment'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => setDestination('profile')}
                className="px-5 py-2.5 border border-[#00F0B4]/40 bg-[#00F0B4]/10 hover:bg-[#00F0B4]/20 text-[#00F0B4] text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2 btn-tactile"
              >
                <Layers className="w-4 h-4" />
                <span>View Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Experience: Active Questionnaire OR Discovery Overview */}
      {isQuestionnaireActive ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-3 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0B4] animate-pulse" />
              <span>Assessment in Progress</span>
            </div>
            <button
              onClick={() => setIsQuestionnaireActive(false)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>← Back to Overview</span>
            </button>
          </div>
          <AdaptiveAssessmentConsole />
        </div>
      ) : (
        <div className="space-y-10">
          {/* 3 Core Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-[#0D1117] border border-white/[0.08] rounded-lg space-y-2.5">
              <div className="flex items-center gap-2 text-[#00F0B4] text-xs font-mono font-medium uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Adaptive Inquiry</span>
              </div>
              <h3 className="text-base text-white font-medium">
                Beyond Generic Quizzes
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                No arbitrary personality types. The questions adapt based on your specific trade-offs, confidence levels, and skills.
              </p>
            </div>

            <div className="p-5 bg-[#0D1117] border border-white/[0.08] rounded-lg space-y-2.5">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-medium uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Authoritative Data</span>
              </div>
              <h3 className="text-base text-white font-medium">
                Real Labor Market Models
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Career connections are grounded in international taxonomies (O*NET, ESCO, NCO), validating real-world feasibility.
              </p>
            </div>

            <div className="p-5 bg-[#0D1117] border border-white/[0.08] rounded-lg space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-medium uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Private</span>
              </div>
              <h3 className="text-base text-white font-medium">
                Client-Side Storage
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Your responses and profile stay private in your browser. Zero third-party telemetry, zero external tracking.
              </p>
            </div>
          </div>

          {/* 9 Dimensions Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="uppercase tracking-wider">Nine Areas of Discovery</span>
              <span className="text-[#00F0B4] text-[11px]">
                {totalAnswered} of 34 Questions Answered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(DIMENSIONS) as DimensionKey[]).map((key) => {
                const meta = DIMENSIONS[key];
                const signal = dimensionSignals[key];
                const percent = Math.round(
                  (signal.coreQuestionsAnswered / signal.totalCoreQuestions) * 100
                );
                const isComplete = percent === 100;

                return (
                  <div
                    key={key}
                    onClick={() => setIsQuestionnaireActive(true)}
                    className="p-5 bg-[#0D1117] border border-white/[0.08] hover:border-white/20 hover:bg-[#111722] rounded-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-3.5 select-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded border transition-colors group-hover:scale-105 duration-200"
                          style={{
                            borderColor: `${meta.color}40`,
                            backgroundColor: `${meta.color}10`,
                          }}
                        >
                          <DimensionEmblem dimension={key} size={20} color={meta.color} />
                        </div>
                        <div>
                          <div className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                            {meta.code}
                          </div>
                          <h4 className="text-sm font-medium text-white group-hover:text-[#00F0B4] transition-colors">
                            {meta.label}
                          </h4>
                        </div>
                      </div>

                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00F0B4] flex-shrink-0" />
                      ) : (
                        <span className="font-mono text-[10px] text-slate-400 font-semibold tabular-nums">
                          {percent}%
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
                      {meta.description}
                    </p>

                    {/* Progress Bar & Footer */}
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                        <span>
                          {signal.coreQuestionsAnswered} / {signal.totalCoreQuestions} answered
                        </span>
                        <span className="text-slate-300 group-hover:text-[#00F0B4] transition-colors">
                          {isComplete ? 'Completed' : 'Explore →'}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
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
      )}
    </div>
  );
};
