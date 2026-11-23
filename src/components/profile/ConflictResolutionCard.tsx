// ============================================================================
// CAREER PILOT — CONFLICT RESOLUTION CARD
// Interactive card to inspect and resolve identified structural trade-offs
// ============================================================================

import React, { useState } from 'react';
import type { ProfileConflict } from '../../types/profileIntelligence';
import { useCareerPilot } from '../../context/useCareerPilot';
import { AlertCircle, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface ConflictResolutionCardProps {
  conflict: ProfileConflict;
}

export const ConflictResolutionCard: React.FC<ConflictResolutionCardProps> = ({ conflict }) => {
  const { resolveConflict } = useCareerPilot();
  const [isClarifying, setIsClarifying] = useState(false);
  const [notes, setNotes] = useState(conflict.userResolutionNotes || '');

  const handleTradeOff = () => {
    resolveConflict(conflict.conflictId, 'confirmed-trade-off');
  };

  const handleSaveClarification = (e: React.FormEvent) => {
    e.preventDefault();
    resolveConflict(conflict.conflictId, 'clarified', notes);
    setIsClarifying(false);
  };

  const handleDismiss = () => {
    resolveConflict(conflict.conflictId, 'dismissed');
  };

  const isResolved = conflict.userResolutionStatus !== 'unresolved';

  return (
    <div
      className={clsx(
        'p-4 border font-mono text-xs space-y-3 transition-colors',
        isResolved ? 'bg-white/[0.01] border-white/10' : 'bg-[#0E1217] border-amber-500/30 shadow-lg'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className={clsx('w-3.5 h-3.5', isResolved ? 'text-slate-400' : 'text-amber-400')} />
          <span className="text-white font-semibold uppercase text-[11px]">{conflict.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 border border-white/10 bg-white/5 text-slate-400 text-[10px] uppercase">
            {conflict.category.replace(/-/g, ' ')}
          </span>
          {isResolved && (
            <span className="px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>{conflict.userResolutionStatus.toUpperCase()}</span>
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-300 font-sans text-xs leading-relaxed">{conflict.explanation}</p>

      {/* Suggested Action */}
      <div className="p-2.5 bg-white/[0.02] border-l-2 border-[#00F0B4] text-[11px] space-y-0.5">
        <span className="text-[#00F0B4] font-semibold uppercase text-[10px] block">STRATEGIC RESOLUTION PATH:</span>
        <span className="text-slate-300 font-sans">{conflict.suggestedAction}</span>
      </div>

      {conflict.userResolutionNotes && (
        <div className="p-2.5 bg-[#080A0D] border border-white/10 text-[11px] text-slate-300">
          <span className="text-slate-500 text-[10px] uppercase block">YOUR NOTE:</span>
          "{conflict.userResolutionNotes}"
        </div>
      )}

      {/* Actions */}
      {!isClarifying ? (
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTradeOff}
              className={clsx(
                'px-3 py-1.5 border transition-colors flex items-center gap-1.5 text-[11px] btn-tactile',
                conflict.userResolutionStatus === 'confirmed-trade-off'
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/20 bg-white/5 hover:bg-white/10 text-slate-200'
              )}
            >
              <span>Accept as Intentional Trade-Off</span>
            </button>

            <button
              onClick={() => setIsClarifying(true)}
              className="px-3 py-1.5 border border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 transition-colors flex items-center gap-1.5 text-[11px] btn-tactile"
            >
              <MessageSquare className="w-3 h-3 text-sky-400" />
              <span>Add Context Note</span>
            </button>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-500 hover:text-slate-300 text-[10px] underline"
          >
            Dismiss Tension
          </button>
        </div>
      ) : (
        <form onSubmit={handleSaveClarification} className="pt-2 border-t border-white/[0.06] space-y-2">
          <label className="text-slate-400 text-[10px] uppercase block">CONTEXTUAL CLARIFICATION:</label>
          <input
            type="text"
            value={notes}
            placeholder="e.g., Open to startup risk only after building 12 months savings buffer"
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsClarifying(false)}
              className="px-3 py-1 border border-white/20 text-slate-400 text-[11px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-[#00F0B4] text-black font-semibold text-[11px] flex items-center gap-1"
            >
              <span>Save Note</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
