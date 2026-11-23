// ============================================================================
// CAREER PILOT — CAREER GRAPH DATABASE & ADJACENCY ENGINE
// In-memory indexed graph topology linking Education, Skills, Experience, and Occupations
// ============================================================================

import type {
  CareerGraphNode,
  GraphEdge,
  CareerUniverseTelemetry,
} from '../../types/careerGraph';
import type { OccupationRecord } from '../../types/occupation';
import {
  GRAPH_EDUCATION_NODES,
  GRAPH_SKILL_NODES,
  GRAPH_EXPERIENCE_NODES,
  GRAPH_INTERMEDIATE_OCCUPATIONS,
  GRAPH_INDUSTRY_NODES,
  GRAPH_EDGES,
} from '../../data/graph/careerKnowledgeGraph';
import { AUTHORITATIVE_OCCUPATIONS } from '../../data/occupations/authoritativeOccupations';

export class CareerGraphDatabase {
  private nodes: Map<string, CareerGraphNode> = new Map();
  private occupations: Map<string, OccupationRecord> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private outgoing: Map<string, GraphEdge[]> = new Map();
  private incoming: Map<string, GraphEdge[]> = new Map();

  // Telemetry metrics
  private generatedRouteCount = 0;
  private validatedRouteCount = 0;
  private rejectedRouteCount = 0;

  constructor() {
    this.initializeGraph();
  }

  private initializeGraph() {
    // 1. Index All Specialized Graph Nodes
    GRAPH_EDUCATION_NODES.forEach((n) => this.nodes.set(n.id, n));
    GRAPH_SKILL_NODES.forEach((n) => this.nodes.set(n.id, n));
    GRAPH_EXPERIENCE_NODES.forEach((n) => this.nodes.set(n.id, n));
    GRAPH_INTERMEDIATE_OCCUPATIONS.forEach((n) => this.nodes.set(n.id, n));
    GRAPH_INDUSTRY_NODES.forEach((n) => this.nodes.set(n.id, n));

    // 2. Index Authoritative Target Occupations
    AUTHORITATIVE_OCCUPATIONS.forEach((occ) => {
      this.occupations.set(occ.id, occ);
    });

    // 3. Index Edges & Construct Adjacency Lists
    GRAPH_EDGES.forEach((edge) => {
      this.edges.set(edge.id, edge);

      if (!this.outgoing.has(edge.sourceNodeId)) {
        this.outgoing.set(edge.sourceNodeId, []);
      }
      this.outgoing.get(edge.sourceNodeId)!.push(edge);

      if (!this.incoming.has(edge.targetNodeId)) {
        this.incoming.set(edge.targetNodeId, []);
      }
      this.incoming.get(edge.targetNodeId)!.push(edge);
    });
  }

  public getNode(id: string): CareerGraphNode | undefined {
    return this.nodes.get(id);
  }

  public getOccupation(id: string): OccupationRecord | undefined {
    return this.occupations.get(id);
  }

  public getAllNodes(): CareerGraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllOccupations(): OccupationRecord[] {
    return Array.from(this.occupations.values());
  }

  public getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }

  public getOutgoingEdges(nodeId: string): GraphEdge[] {
    return this.outgoing.get(nodeId) || [];
  }

  public getIncomingEdges(nodeId: string): GraphEdge[] {
    return this.incoming.get(nodeId) || [];
  }

  // Telemetry & Metrics Tracking
  public recordRouteGenerated() {
    this.generatedRouteCount += 1;
  }

  public recordRouteValidated() {
    this.validatedRouteCount += 1;
  }

  public recordRouteRejected() {
    this.rejectedRouteCount += 1;
  }

  public getTelemetry(): CareerUniverseTelemetry {
    return {
      totalOccupations: this.occupations.size + GRAPH_INTERMEDIATE_OCCUPATIONS.length,
      totalEducationNodes: GRAPH_EDUCATION_NODES.length,
      totalSkillNodes: GRAPH_SKILL_NODES.length,
      totalExperienceNodes: GRAPH_EXPERIENCE_NODES.length,
      totalGraphEdges: this.edges.size,
      generatedRouteCount: this.generatedRouteCount,
      validatedRouteCount: this.validatedRouteCount,
      rejectedRouteCount: this.rejectedRouteCount,
    };
  }
}

export const careerGraphDatabase = new CareerGraphDatabase();
