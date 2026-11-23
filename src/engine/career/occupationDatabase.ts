// ============================================================================
// CAREER PILOT — OCCUPATION DATABASE SERVICE & QUERY INDEX
// Indexed in-memory data layer supporting authoritative occupational standards
// ============================================================================

import type { OccupationRecord } from '../../types/occupation';
import { AUTHORITATIVE_OCCUPATIONS } from '../../data/occupations/authoritativeOccupations';

export interface OccupationSearchFilters {
  query?: string;
  family?: string;
  industry?: string;
  skill?: string;
  minimumEducation?: string;
  remoteViability?: 'high' | 'medium' | 'low' | 'none';
  region?: 'US' | 'EU' | 'India' | 'Global';
}

class OccupationDatabaseService {
  private occupations: Map<string, OccupationRecord> = new Map();
  private familyIndex: Map<string, Set<string>> = new Map();
  private skillIndex: Map<string, Set<string>> = new Map();

  constructor(initialData: OccupationRecord[] = AUTHORITATIVE_OCCUPATIONS) {
    this.indexData(initialData);
  }

  private indexData(data: OccupationRecord[]) {
    this.occupations.clear();
    this.familyIndex.clear();
    this.skillIndex.clear();

    data.forEach((occ) => {
      this.occupations.set(occ.id, occ);

      // Index by family
      if (!this.familyIndex.has(occ.family)) {
        this.familyIndex.set(occ.family, new Set());
      }
      this.familyIndex.get(occ.family)!.add(occ.id);

      // Index by skills
      [...occ.essentialSkills, ...occ.optionalSkills].forEach((skill) => {
        const normalized = skill.toLowerCase();
        if (!this.skillIndex.has(normalized)) {
          this.skillIndex.set(normalized, new Set());
        }
        this.skillIndex.get(normalized)!.add(occ.id);
      });
    });
  }

  public getAll(): OccupationRecord[] {
    return Array.from(this.occupations.values());
  }

  public getById(id: string): OccupationRecord | undefined {
    return this.occupations.get(id);
  }

  public search(filters: OccupationSearchFilters = {}): OccupationRecord[] {
    let results = this.getAll();

    // 1. Text Query Search (title, alternative titles, description, activities)
    if (filters.query && filters.query.trim().length > 0) {
      const q = filters.query.toLowerCase().trim();
      results = results.filter((occ) => {
        const inTitle = occ.title.toLowerCase().includes(q);
        const inAlt = occ.alternativeTitles.some((t) => t.toLowerCase().includes(q));
        const inDesc = occ.description.toLowerCase().includes(q);
        const inInd = occ.industry.toLowerCase().includes(q);
        const inFam = occ.family.toLowerCase().includes(q);
        const inSkills = occ.essentialSkills.some((s) => s.toLowerCase().includes(q));
        const inActs = occ.typicalWorkActivities.some((a) => a.toLowerCase().includes(q));
        return inTitle || inAlt || inDesc || inInd || inFam || inSkills || inActs;
      });
    }

    // 2. Family Filter
    if (filters.family && filters.family !== 'All') {
      results = results.filter((occ) => occ.family === filters.family);
    }

    // 3. Industry Filter
    if (filters.industry && filters.industry !== 'All') {
      results = results.filter((occ) => occ.industry === filters.industry);
    }

    // 4. Remote Viability
    if (filters.remoteViability) {
      results = results.filter((occ) => occ.workEnvironments.remoteViability === filters.remoteViability);
    }

    // 5. Region applicability
    if (filters.region && filters.region !== 'Global') {
      results = results.filter((occ) => {
        return occ.geographicApplicability.global || !!occ.geographicApplicability.regionalProfiles[filters.region!];
      });
    }

    return results;
  }

  public getFamilies(): string[] {
    return Array.from(this.familyIndex.keys());
  }

  public getProvenanceOverview(): {
    totalRecords: number;
    sources: Record<string, number>;
    datasetVersions: string[];
    licenses: string[];
  } {
    const sources: Record<string, number> = {};
    const datasetVersions = new Set<string>();
    const licenses = new Set<string>();

    this.occupations.forEach((occ) => {
      const src = occ.provenance.primarySource;
      sources[src] = (sources[src] || 0) + 1;
      datasetVersions.add(occ.provenance.datasetVersion);
      licenses.add(occ.provenance.license);
    });

    return {
      totalRecords: this.occupations.size,
      sources,
      datasetVersions: Array.from(datasetVersions),
      licenses: Array.from(licenses),
    };
  }
}

export const occupationDatabase = new OccupationDatabaseService();
