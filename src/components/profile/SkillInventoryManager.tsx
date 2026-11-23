// ============================================================================
// CAREER PILOT — SKILL INVENTORY MANAGER
// Structured capability catalog with verification statuses and manual additions
// ============================================================================

import React, { useState } from 'react';
import type { ProfileSkillItem } from '../../types/profileIntelligence';
import { useCareerPilot } from '../../context/useCareerPilot';
import { TechCard } from '../common/TechCard';
import { Plus, ShieldCheck, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

export const SkillInventoryManager: React.FC = () => {
  const { profile, addCustomSkill } = useCareerPilot();
  const skills = profile.intelligenceProfile?.skillInventory || [];

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<ProfileSkillItem['category']>('technical');
  const [newSkillProficiency, setNewSkillProficiency] = useState<ProfileSkillItem['proficiency']>('proficient');
  const [newSkillVenue, setNewSkillVenue] = useState('Production Project / Employment');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addCustomSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      supportingExperienceVenue: [newSkillVenue],
      userConfidence: 85,
      developmentInterest: true,
      evidenceSource: 'user-confirmed',
      verificationStatus: 'user-verified',
      isTransferable: newSkillCategory === 'interpersonal' || newSkillCategory === 'operational',
    });

    setNewSkillName('');
    setIsAddingSkill(false);
  };

  return (
    <TechCard
      title="Skills & Capability Inventory"
      action={
        <button
          onClick={() => setIsAddingSkill(!isAddingSkill)}
          className="px-2.5 py-1 border border-[#00F0B4]/40 bg-[#00F0B4]/10 text-[#00F0B4] hover:bg-[#00F0B4]/20 rounded transition-colors flex items-center gap-1 text-[11px] font-sans font-medium btn-tactile"
        >
          <Plus className="w-3 h-3" />
          <span>{isAddingSkill ? 'Cancel' : 'Add Verified Skill'}</span>
        </button>
      }
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Add Skill Drawer */}
        {isAddingSkill && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-white/[0.02] border border-[#00F0B4]/30 space-y-3">
            <span className="text-[#00F0B4] font-semibold text-[11px] uppercase block">
              ADD CUSTOM VERIFIED CAPABILITY
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">SKILL NAME:</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems Architecture"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">CATEGORY:</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
                >
                  <option value="technical">Technical</option>
                  <option value="analytical">Analytical</option>
                  <option value="creative">Creative</option>
                  <option value="interpersonal">Interpersonal</option>
                  <option value="operational">Operational</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">PROFICIENCY LEVEL:</label>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
                >
                  <option value="exploring">Exploring (Learning Fundamentals)</option>
                  <option value="practicing">Practicing (Applied in Personal Projects)</option>
                  <option value="proficient">Proficient (Independent Production Delivery)</option>
                  <option value="mastery">Mastery (Domain Authority / Architecture)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase">SUPPORTING VENUE / EVIDENCE:</label>
                <input
                  type="text"
                  value={newSkillVenue}
                  placeholder="e.g. 5+ years production engineering, open-source maintainer"
                  onChange={(e) => setNewSkillVenue(e.target.value)}
                  className="w-full bg-[#080A0D] border border-white/20 p-2 text-white font-mono text-xs focus:outline-none focus:border-[#00F0B4]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingSkill(false)}
                className="px-3 py-1.5 border border-white/20 text-slate-300 text-[11px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#00F0B4] text-black font-semibold text-[11px]"
              >
                Save to Inventory
              </button>
            </div>
          </form>
        )}

        {/* Skills Table */}
        {skills.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-sans text-xs">
            No capabilities logged yet. Complete discovery questions or add custom skills above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] text-slate-500 uppercase">
                  <th className="py-2 px-3">CAPABILITY</th>
                  <th className="py-2 px-3">CATEGORY</th>
                  <th className="py-2 px-3">PROFICIENCY</th>
                  <th className="py-2 px-3">EVIDENCE VENUE</th>
                  <th className="py-2 px-3">VERIFICATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {skills.map((skill) => (
                  <tr key={skill.skillId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{skill.name}</span>
                        {skill.isTransferable && (
                          <span className="px-1 py-0.2 bg-white/5 border border-white/10 text-slate-400 text-[9px] uppercase">
                            Transferable
                          </span>
                        )}
                        {skill.isUserAdded && (
                          <span className="px-1 py-0.2 bg-[#00F0B4]/10 border border-[#00F0B4]/30 text-[#00F0B4] text-[9px] uppercase">
                            User Verified
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-400 capitalize">{skill.category}</td>

                    <td className="py-2.5 px-3">
                      <span
                        className={clsx(
                          'px-2 py-0.5 text-[10px] uppercase font-semibold border',
                          skill.proficiency === 'mastery'
                            ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                            : skill.proficiency === 'proficient'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : skill.proficiency === 'practicing'
                            ? 'border-sky-500/30 bg-sky-500/10 text-sky-300'
                            : 'border-white/20 bg-white/5 text-slate-400'
                        )}
                      >
                        {skill.proficiency}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-slate-300 font-sans text-xs">
                      {skill.supportingExperienceVenue.join(', ') || 'Self-directed exploration'}
                    </td>

                    <td className="py-2.5 px-3">
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1 text-[10px] uppercase',
                          skill.verificationStatus === 'experience-backed' || skill.verificationStatus === 'user-verified'
                            ? 'text-[#00F0B4]'
                            : 'text-amber-400'
                        )}
                      >
                        {skill.verificationStatus === 'experience-backed' || skill.verificationStatus === 'user-verified' ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <HelpCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{skill.verificationStatus.replace(/-/g, ' ')}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TechCard>
  );
};
