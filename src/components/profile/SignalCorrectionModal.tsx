// ============================================================================
// CAREER PILOT — SIGNAL CORRECTION MODAL
// Allows user to confirm, refine, or reject inferred profile findings
// ============================================================================

import React, { useState } from 'react';
import type { ProfileSignal } from '../../types/profileIntelligence';
import { useCareerPilot } from '../../context/useCareerPilot';
import { X, Check, Edit3, Trash2, ShieldAlert } from 'lucide-react';

interface SignalCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: ProfileSignal;
}

export const SignalCorrectionModal: React.FC<SignalCorrectionModalProps> = ({
  isOpen,
  onClose,
  signal,
}) => {
  const { confirmSignal, correctSignal, rejectSignal } = useCareerPilot();

  const [mode, setMode] = useState<'view' | 'edit' | 'reject'>('view');
  const [editedName, setEditedName] = useState(signal.name);
  const [editedDesc, setEditedDesc] = useState(signal.description);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    confirmSignal(signal.signalId);
    onClose();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    correctSignal(signal.signalId, editedName, editedDesc, reason);
    onClose();
  };

  const handleReject = () => {
    rejectSignal(signal.signalId, reason || 'User indicated finding is inapplicable.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono text-xs animate-in fade-in duration-200">
      <div className="bg-[#0E131A] border border-white/20 rounded-lg w-full max-w-lg shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <span className="text-[#00F0B4] uppercase tracking-wider text-[11px] font-semibold">
            REFINE PROFILE INSIGHT
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 btn-tactile">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">CURRENT SIGNAL FINDING:</span>
            <div className="text-white font-serif text-lg">{signal.name}</div>
            <p className="text-slate-300 font-sans text-xs mt-1 leading-relaxed">
              {signal.description}
            </p>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/10 text-[10px] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">CURRENT STATUS:</span>
              <span className="text-[#00F0B4] uppercase font-bold">{signal.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CONFIDENCE LEVEL:</span>
              <span className="text-sky-400 uppercase">{signal.confidenceLevel}</span>
            </div>
          </div>

          {mode === 'view' && (
            <div className="space-y-3 pt-2">
              <p className="text-slate-400 font-sans text-xs">
                Does this accurately reflect your cognitive strengths and preferences? Your corrections will permanently override system inferences.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="p-2.5 bg-[#00F0B4] text-black font-semibold flex items-center justify-center gap-1.5 hover:bg-[#00F0B4]/90 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>CONFIRM</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('edit')}
                  className="p-2.5 border border-white/20 hover:border-white/40 text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  <span>REFINE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('reject')}
                  className="p-2.5 border border-rose-500/30 hover:border-rose-500/60 text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>REJECT</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">REFINED NAME:</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">REFINED DESCRIPTION:</label>
                <textarea
                  rows={3}
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">REASON / CONTEXT (OPTIONAL):</label>
                <input
                  type="text"
                  placeholder="e.g., Applies specifically to distributed systems"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('view')}
                  className="px-3 py-1.5 border border-white/20 text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00F0B4] text-black font-semibold"
                >
                  SAVE OVERRIDE
                </button>
              </div>
            </form>
          )}

          {mode === 'reject' && (
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="font-sans text-xs">
                  Rejecting this signal will exclude it from downstream career path matching calculations.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">REASON FOR REJECTION (OPTIONAL):</label>
                <input
                  type="text"
                  placeholder="e.g., Answering artifact; doesn't reflect my actual interests"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('view')}
                  className="px-3 py-1.5 border border-white/20 text-slate-300"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  CONFIRM REJECTION
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
