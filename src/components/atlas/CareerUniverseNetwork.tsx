// ============================================================================
// CAREER PILOT — CAREER UNIVERSE NETWORK VISUALIZER
// Interactive Cartographic Graph Map: Education -> Skills -> Bridge -> Careers
// ============================================================================

import React, { useState, useMemo } from 'react';
import type { OccupationRecord } from '../../types/occupation';
import type { GeneratedPathway } from '../../types/careerGraph';
import type { PersonalIntelligenceProfile } from '../../types/profileIntelligence';
import { useCareerPilot } from '../../context/CareerPilotContext';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

interface CareerUniverseNetworkProps {
  occupations: OccupationRecord[];
  selectedOccupation?: OccupationRecord | null;
  onSelectOccupation: (occ: OccupationRecord) => void;
  selectedPathway?: GeneratedPathway | null;
  profile?: PersonalIntelligenceProfile | null;
}

export const CareerUniverseNetwork: React.FC<CareerUniverseNetworkProps> = ({
  occupations,
  selectedOccupation,
  onSelectOccupation,
  selectedPathway,
}) => {
  const { profile } = useCareerPilot();
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [activeFilterCluster, setActiveFilterCluster] = useState<'all' | 'education' | 'skills' | 'occupations'>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Deterministic SVG coordinates for nodes
  const networkLayout = useMemo(() => {
    const width = 940;
    const height = 520;

    // Column 0: Exploded Self Persona Origin (x: 90)
    const personaCenter = { x: 90, y: 260 };

    // Column 1: Education Nodes (x: 260)
    const eduNodes = [
      { id: 'edu-bs-cs', label: 'B.S. Computer Science', type: 'education', y: 110 },
      { id: 'edu-bs-bio', label: 'B.S. Computational Bio', type: 'education', y: 210 },
      { id: 'edu-bootcamp', label: 'Full-Stack Immersive', type: 'education', y: 310 },
      { id: 'edu-ms-cs-dist', label: 'M.S. Distributed Systems', type: 'education', y: 410 },
    ];

    // Column 2: Skill Nodes (x: 460)
    const skillNodes = [
      { id: 'skill-distributed-systems', label: 'Distributed Systems', type: 'skill', y: 80 },
      { id: 'skill-bioinformatics-pipelines', label: 'Bioinformatics Pipelines', type: 'skill', y: 170 },
      { id: 'skill-computer-networking-os', label: 'OS & Low-Level Kernels', type: 'skill', y: 260 },
      { id: 'skill-data-structures-algorithms', label: 'Advanced Algorithms', type: 'skill', y: 350 },
      { id: 'skill-cloud-k8s', label: 'Cloud Architecture & K8s', type: 'skill', y: 440 },
    ];

    // Column 3: Bridge Roles (x: 640)
    const bridgeNodes = [
      { id: 'occ-bridge-backend-dev', label: 'Systems Engineer', type: 'bridge', y: 140 },
      { id: 'occ-bridge-bioinformatics-tech', label: 'Genomics Analyst', type: 'bridge', y: 260 },
      { id: 'occ-bridge-technical-writer', label: 'Architecture Consultant', type: 'bridge', y: 380 },
    ];

    // Column 4: Target Occupations (x: 810)
    const occNodes = occupations.slice(0, 6).map((occ, idx) => ({
      id: occ.id,
      label: occ.title.length > 24 ? occ.title.slice(0, 22) + '...' : occ.title,
      fullTitle: occ.title,
      type: 'occupation',
      occupation: occ,
      y: 75 + idx * 72,
    }));

    return {
      width,
      height,
      personaCenter,
      eduNodes,
      skillNodes,
      bridgeNodes,
      occNodes,
    };
  }, [occupations]);

  // Determine active nodes & edges
  const activeNodeIds = useMemo(() => {
    const ids = new Set<string>();
    if (selectedPathway) {
      selectedPathway.steps.forEach((s: any) => ids.add(s.nodeId));
      ids.add(selectedPathway.destinationOccupationId);
    } else if (selectedOccupation) {
      ids.add(selectedOccupation.id);
      if (selectedOccupation.id.includes('15-1252')) {
        ids.add('edu-bs-cs');
        ids.add('edu-ms-cs-dist');
        ids.add('skill-computer-networking-os');
        ids.add('skill-distributed-systems');
        ids.add('occ-bridge-backend-dev');
      } else if (selectedOccupation.id.includes('19-1029')) {
        ids.add('edu-bs-bio');
        ids.add('skill-bioinformatics-pipelines');
        ids.add('occ-bridge-bioinformatics-tech');
      }
    }
    return ids;
  }, [selectedOccupation, selectedPathway]);

  return (
    <div className="relative w-full bg-[#080A0E] border border-white/10 rounded-lg overflow-hidden font-mono text-xs select-none shadow-md">
      {/* Top Overlay Bar: Clusters, Zoom, Coordinate Stamp */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-[#0D1117]/90 border border-white/10 backdrop-blur-md">
            <span className="text-[9px] text-slate-500 uppercase px-1">CLUSTERS:</span>
            {(['all', 'education', 'skills', 'occupations'] as const).map((cluster) => (
              <button
                key={cluster}
                onClick={() => setActiveFilterCluster(cluster)}
                className={clsx(
                  'px-2 py-0.5 text-[10px] uppercase transition-all btn-tactile',
                  activeFilterCluster === cluster
                    ? 'bg-[#00F0B4]/10 text-[#00F0B4] border border-[#00F0B4]/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {cluster}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#0D1117]/90 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
            title="Zoom Out"
            className="p-1 hover:text-[#00F0B4] text-slate-400 transition-colors btn-tactile"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 px-1 tabular-nums">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, Number((z + 0.15).toFixed(2))))}
            title="Zoom In"
            className="p-1 hover:text-[#00F0B4] text-slate-400 transition-colors btn-tactile"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1.0)}
            title="Reset Zoom"
            className="p-1 hover:text-[#00F0B4] text-slate-400 border-l border-white/10 pl-1.5 transition-colors btn-tactile"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Interactive Cartographic Canvas */}
      <div className="w-full overflow-x-auto no-scrollbar py-8 flex justify-center">
        <svg
          viewBox={`0 0 ${networkLayout.width} ${networkLayout.height}`}
          className="w-full max-w-[940px] h-[520px] transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Subtle Grid Pattern Background */}
          <defs>
            <pattern id="net-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#net-grid)" />

          {/* Layer Column Headers */}
          <g className="font-mono text-[9px] uppercase tracking-widest pointer-events-none">
            <text x="90" y="32" fill="#00F0B4" textAnchor="middle" fontWeight="bold">§ 01 · YOU</text>
            <text x="260" y="32" fill="#38BDF8" textAnchor="middle" fontWeight="bold">§ 02 · EDUCATION</text>
            <text x="460" y="32" fill="#818CF8" textAnchor="middle" fontWeight="bold">§ 03 · SKILLS</text>
            <text x="640" y="32" fill="#E5A93C" textAnchor="middle" fontWeight="bold">§ 04 · BRIDGES</text>
            <text x="810" y="32" fill="#F472B6" textAnchor="middle" fontWeight="bold">§ 05 · DESTINATIONS</text>
          </g>

          {/* Connectors: You -> Education */}
          {networkLayout.eduNodes.map((edu) => {
            const isLineActive = activeNodeIds.has(edu.id);
            return (
              <line
                key={`line-self-${edu.id}`}
                x1={networkLayout.personaCenter.x + 38}
                y1={networkLayout.personaCenter.y}
                x2={260 - 70}
                y2={edu.y}
                stroke={isLineActive ? '#00F0B4' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isLineActive ? 2 : 1}
                strokeDasharray={isLineActive ? 'none' : '3 4'}
                className={isLineActive ? 'animate-signal-pulse' : ''}
              />
            );
          })}

          {/* Connectors: Education -> Skills */}
          {networkLayout.eduNodes.slice(0, 3).map((edu, idx) => {
            const targetSkill = networkLayout.skillNodes[idx];
            const isLineActive = activeNodeIds.has(edu.id) && activeNodeIds.has(targetSkill.id);
            return (
              <line
                key={`line-edu-skill-${idx}`}
                x1={260 + 70}
                y1={edu.y}
                x2={460 - 75}
                y2={targetSkill.y}
                stroke={isLineActive ? '#00F0B4' : 'rgba(255,255,255,0.07)'}
                strokeWidth={isLineActive ? 2 : 1}
                className={isLineActive ? 'animate-signal-pulse' : ''}
              />
            );
          })}

          {/* Connectors: Skills -> Bridges */}
          {networkLayout.skillNodes.slice(0, 4).map((skill, idx) => {
            const bridge = networkLayout.bridgeNodes[idx % networkLayout.bridgeNodes.length];
            const isLineActive = activeNodeIds.has(skill.id) && activeNodeIds.has(bridge.id);
            return (
              <line
                key={`line-skill-bridge-${idx}`}
                x1={460 + 75}
                y1={skill.y}
                x2={640 - 65}
                y2={bridge.y}
                stroke={isLineActive ? '#00F0B4' : 'rgba(255,255,255,0.06)'}
                strokeWidth={isLineActive ? 2 : 1}
                className={isLineActive ? 'animate-signal-pulse' : ''}
              />
            );
          })}

          {/* Connectors: Bridges -> Destinations */}
          {networkLayout.bridgeNodes.map((bridge, idx) => {
            const targetOcc = networkLayout.occNodes[idx % networkLayout.occNodes.length];
            const isLineActive = activeNodeIds.has(bridge.id) && activeNodeIds.has(targetOcc.id);
            return (
              <line
                key={`line-bridge-occ-${idx}`}
                x1={640 + 65}
                y1={bridge.y}
                x2={810 - 75}
                y2={targetOcc.y}
                stroke={isLineActive ? '#00F0B4' : 'rgba(255,255,255,0.08)'}
                strokeWidth={isLineActive ? 2.5 : 1}
                className={isLineActive ? 'animate-signal-pulse' : ''}
              />
            );
          })}

          {/* 1. Exploded Self Core Origin */}
          <g transform={`translate(${networkLayout.personaCenter.x}, ${networkLayout.personaCenter.y})`}>
            <circle r="36" fill="#0D1117" stroke="#00F0B4" strokeWidth="1.75" />
            <circle r="28" fill="rgba(0,240,180,0.06)" stroke="rgba(0,240,180,0.3)" strokeDasharray="2 3" />
            <text textAnchor="middle" y="-6" fill="#00F0B4" fontSize="9" fontWeight="bold" letterSpacing="0.1em">
              YOU
            </text>
            <text textAnchor="middle" y="8" fill="#CBD5E1" fontSize="8" fontFamily="Inter, sans-serif">
              {profile?.userName || 'Core'}
            </text>
          </g>

          {/* 2. Education Nodes: Chamfered Architectural Plaques */}
          {networkLayout.eduNodes.map((node) => {
            const isActive = activeNodeIds.has(node.id);
            const isHovered = hoveredNodeId === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(260, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <polygon
                  points="-68,-14 62,-14 68,-8 68,14 -62,14 -68,8"
                  fill="#0D1117"
                  stroke={isActive ? '#38BDF8' : isHovered ? '#38BDF8' : 'rgba(255,255,255,0.14)'}
                  strokeWidth={isActive || isHovered ? 1.75 : 1}
                />
                <text
                  textAnchor="middle"
                  y="3.5"
                  fill={isActive || isHovered ? '#38BDF8' : '#CBD5E1'}
                  fontSize="8.5"
                  fontFamily="Inter, sans-serif"
                  fontWeight={isActive || isHovered ? '600' : '400'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* 3. Skill Nodes: Diamond Pill Tags */}
          {networkLayout.skillNodes.map((node) => {
            const isActive = activeNodeIds.has(node.id);
            const isHovered = hoveredNodeId === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(460, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <rect
                  x="-75"
                  y="-13"
                  width="150"
                  height="26"
                  rx="13"
                  fill="#0D1117"
                  stroke={isActive ? '#818CF8' : isHovered ? '#818CF8' : 'rgba(255,255,255,0.12)'}
                  strokeWidth={isActive || isHovered ? 1.75 : 1}
                />
                <circle cx="-60" cy="0" r="2.5" fill={isActive ? '#818CF8' : 'rgba(255,255,255,0.3)'} />
                <text
                  textAnchor="middle"
                  y="3.5"
                  fill={isActive || isHovered ? '#818CF8' : '#CBD5E1'}
                  fontSize="8.5"
                  fontFamily="Inter, sans-serif"
                  fontWeight={isActive || isHovered ? '600' : '400'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* 4. Bridge Role Nodes: Slanted Stepped Chevrons */}
          {networkLayout.bridgeNodes.map((node) => {
            const isActive = activeNodeIds.has(node.id);
            const isHovered = hoveredNodeId === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(640, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <polygon
                  points="-65,-14 55,-14 65,14 -55,14"
                  fill="#0D1117"
                  stroke={isActive ? '#E5A93C' : isHovered ? '#E5A93C' : 'rgba(255,255,255,0.14)'}
                  strokeWidth={isActive || isHovered ? 1.75 : 1}
                />
                <text
                  textAnchor="middle"
                  y="3.5"
                  fill={isActive || isHovered ? '#E5A93C' : '#CBD5E1'}
                  fontSize="8.5"
                  fontFamily="Inter, sans-serif"
                  fontWeight={isActive || isHovered ? '600' : '400'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* 5. Destination Occupation Nodes: Architectural Dossier Cards */}
          {networkLayout.occNodes.map((node) => {
            const isSelected = selectedOccupation?.id === node.id;
            const isActive = activeNodeIds.has(node.id);
            const isHovered = hoveredNodeId === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(810, ${node.y})`}
                onClick={() => onSelectOccupation(node.occupation)}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <rect
                  x="-75"
                  y="-17"
                  width="150"
                  height="34"
                  fill="#0D1117"
                  stroke={isSelected ? '#00F0B4' : isActive ? '#F472B6' : isHovered ? '#00F0B4' : 'rgba(255,255,255,0.18)'}
                  strokeWidth={isSelected ? 2 : isActive || isHovered ? 1.5 : 1}
                  className="transition-colors"
                />
                <line x1="-70" y1="14" x2="70" y2="14" stroke={isSelected ? '#00F0B4' : 'rgba(255,255,255,0.06)'} strokeWidth="1" />
                <text
                  textAnchor="middle"
                  y="3.5"
                  fill={isSelected ? '#00F0B4' : isActive ? '#F472B6' : isHovered ? '#00F0B4' : '#F0F4F8'}
                  fontSize="8.5"
                  fontFamily="Instrument Serif, serif"
                  fontWeight={isSelected || isActive || isHovered ? 'bold' : 'normal'}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Cartographic Legend */}
      <div className="p-3 border-t border-white/[0.08] bg-[#0D1117] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00F0B4]" />
            <span className="text-slate-300">Profile Core</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#38BDF8]" />
            <span className="text-slate-300">Education</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
            <span className="text-slate-300">Skills</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#E5A93C]" />
            <span className="text-slate-300">Bridge Roles</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#F472B6]" />
            <span className="text-slate-300">Destination</span>
          </span>
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
          <span className="text-[#00F0B4]">›</span>
          <span>Click any destination to trace verified pathway routes across nodes</span>
        </div>
      </div>
    </div>
  );
};
