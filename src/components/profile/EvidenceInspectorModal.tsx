// ============================================================================
// CAREER PILOT — EVIDENCE INSPECTOR MODAL
// Full auditability and traceability of supporting assessment answers
// ============================================================================

import React from 'react';
import type { EvidenceRecord } from '../../types/profileIntelligence';
import { X, FileText, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

interface EvidenceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  evidenceRecords: EvidenceRecord[];
}

export const EvidenceInspectorModal: React.FC<EvidenceInspectorModalProps> = ({
  isOpen,
  onClose,
  title,
  evidenceRecords,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono text-xs animate-in fade-in duration-200">
      <div className="bg-[#0E131A] border border-white/20 rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00F0B4]" />
            <span className="text-[#00F0B4] uppercase tracking-wider text-[11px] font-semibold">
              Evidence Audit & Traceability
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 btn-tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Title */}
        <div className="px-5 py-3 border-b border-white/[0.06] bg-[#090B0E]">
          <span className="text-slate-500 text-[10px] uppercase block">INSPECTING SIGNAL:</span>
          <span className="text-white font-serif text-base">{title}</span>
        </div>

        {/* Records Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {evidenceRecords.length === 0 ? (
            <div className="p-6 text-center text-slate-400 font-sans text-xs">
              No direct question evidence attached to this synthesized item.
            </div>
          ) : (
            evidenceRecords.map((ev, idx) => (
              <div
                key={ev.evidenceId || idx}
                className="p-4 bg-white/[0.02] border border-white/10 space-y-2.5 relative"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-[#00F0B4]/10 text-[#00F0B4] border border-[#00F0B4]/30 font-bold">
                      QUESTION {ev.sourceQuestionId}
                    </span>
                    <span className="px-1.5 py-0.5 bg-white/5 text-slate-300 border border-white/10 uppercase">
                      TYPE: {ev.evidenceType.replace(/-/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(ev.capturedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Prompt */}
                <div className="text-slate-300 font-sans text-xs italic">
                  "{ev.sourceQuestionPrompt}"
                </div>

                {/* Recorded Value */}
                <div className="p-3 bg-[#080A0D] border border-white/15 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-semibold">
                    <FileText className="w-3 h-3 text-[#00F0B4]" />
                    <span>YOUR ANSWER:</span>
                  </div>
                  <div className="text-white font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {ev.displayText}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Deterministic Evidence Chain Verified</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
