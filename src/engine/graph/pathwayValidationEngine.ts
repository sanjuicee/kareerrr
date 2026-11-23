// ============================================================================
// CAREER PILOT — PATHWAY VALIDATION ENGINE
// Multi-factor logical connectivity, prerequisite ordering, cycle detection, & geographic validity
// ============================================================================

import type {
  GeneratedPathway,
  PathwayStep,
} from '../../types/careerGraph';
import type { UserProfileState } from '../../types/profile';
import { careerGraphDatabase } from './careerGraphDatabase';

export interface PathwayValidationResult {
  isValid: boolean;
  connectivityValid: boolean;
  prerequisitesOrdered: boolean;
  geographicCompliant: boolean;
  entryFeasible: boolean;
  deadEndFree: boolean;
  cycleFree: boolean;
  errors: string[];
  warnings: string[];
  missingDataNotes: string[];
}

export class PathwayValidationEngine {
  /**
   * Validates a candidate pathway against strict structural, prerequisite,
   * geographic, and profile feasibility invariants.
   */
  public validatePathway(
    pathway: GeneratedPathway,
    userProfile?: UserProfileState
  ): PathwayValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingDataNotes: string[] = [];

    // 1. Cycle Detection (no node may appear twice in the sequence)
    const visitedNodes = new Set<string>();
    let cycleFree = true;
    for (const step of pathway.steps) {
      if (visitedNodes.has(step.nodeId)) {
        cycleFree = false;
        errors.push(`Cycle detected: Node "${step.title}" (${step.nodeId}) appears multiple times in the route sequence.`);
        break;
      }
      visitedNodes.add(step.nodeId);
    }

    // 2. Dead-end & Destination Check
    const lastStep = pathway.steps[pathway.steps.length - 1];
    const deadEndFree =
      lastStep &&
      (lastStep.nodeId === pathway.destinationOccupationId ||
        lastStep.nodeType === 'occupation' ||
        lastStep.nodeType === 'goal');
    if (!deadEndFree) {
      errors.push(`Dead-end detected: Pathway does not terminate at target destination ${pathway.destinationTitle}.`);
    }

    // 3. Logical Connectivity Check (Consecutive steps must connect or be sequentially compatible)
    let connectivityValid = true;
    for (let i = 0; i < pathway.steps.length - 1; i++) {
      const current = pathway.steps[i];
      const next = pathway.steps[i + 1];

      // Check if direct graph edge exists
      const outgoingEdges = careerGraphDatabase.getOutgoingEdges(current.nodeId);
      const connectsDirectly = outgoingEdges.some((e) => e.targetNodeId === next.nodeId);

      // Or check if valid stage transition (e.g. education -> skill -> experience -> occupation)
      const isValidTransitionType =
        (current.nodeType === 'education' && (next.nodeType === 'education' || next.nodeType === 'skill' || next.nodeType === 'experience' || next.nodeType === 'occupation')) ||
        (current.nodeType === 'skill' && (next.nodeType === 'skill' || next.nodeType === 'education' || next.nodeType === 'experience' || next.nodeType === 'occupation')) ||
        (current.nodeType === 'experience' && (next.nodeType === 'education' || next.nodeType === 'experience' || next.nodeType === 'occupation')) ||
        (current.nodeType === 'occupation' && (next.nodeType === 'occupation' || next.nodeType === 'education' || next.nodeType === 'goal'));

      if (!connectsDirectly && !isValidTransitionType) {
        connectivityValid = false;
        errors.push(`Disjoint transition between step ${i + 1} (${current.title}) and step ${i + 2} (${next.title}).`);
      }
    }

    // 4. Prerequisite Ordering Check (Prerequisite skills must precede advanced skills)
    let prerequisitesOrdered = true;
    const acquiredSkillsSoFar = new Set<string>();

    // Seed with user's existing skills if profile available
    if (userProfile?.explodedSelf?.skillsInventory) {
      userProfile.explodedSelf.skillsInventory.forEach((s) => acquiredSkillsSoFar.add(s.id));
    }

    pathway.steps.forEach((step, idx) => {
      if (step.nodeType === 'skill') {
        const skillNode = careerGraphDatabase.getNode(step.nodeId);
        if (skillNode && skillNode.type === 'skill' && skillNode.prerequisiteSkillIds.length > 0) {
          skillNode.prerequisiteSkillIds.forEach((prereqId) => {
            if (!acquiredSkillsSoFar.has(prereqId)) {
              // Check if prerequisite appears LATER in the pathway
              const laterInPath = pathway.steps.slice(idx + 1).some((s) => s.nodeId === prereqId);
              if (laterInPath) {
                prerequisitesOrdered = false;
                errors.push(`Prerequisite violation: ${skillNode.name} appears before its prerequisite (${prereqId}).`);
              } else {
                warnings.push(`Prerequisite assumption: ${skillNode.name} assumes foundational familiarity with ${prereqId}.`);
              }
            }
          });
        }
      }

      // Add skills acquired in this step
      step.skillsAcquired.forEach((s) => acquiredSkillsSoFar.add(s));
    });

    // 5. Geographic Validity
    let geographicCompliant = true;
    if (pathway.geographicContext !== 'Global') {
      pathway.steps.forEach((step) => {
        const node = careerGraphDatabase.getNode(step.nodeId);
        if (node && node.type === 'education') {
          const supportsRegion =
            node.geographicApplicability.includes('Global') ||
            node.geographicApplicability.includes(pathway.geographicContext);
          if (!supportsRegion) {
            geographicCompliant = false;
            warnings.push(`Geographic notice: ${node.name} may require regional accreditation conversion for ${pathway.geographicContext}.`);
          }
        }
      });
    }

    // 6. Entry Feasibility Check
    let entryFeasible = true;
    if (userProfile) {
      const runwayMonths = userProfile.intelligenceProfile?.constraints?.financialRunwayMonths ?? 12;

      // If user has zero runway but pathway requires 48 months of unpaid full-time study
      if (runwayMonths < 3 && pathway.category === 'direct-pathway' && pathway.totalDurationMonths > 24) {
        entryFeasible = false;
        warnings.push('High financial friction: 0–3 month income runway conflicts with multi-year full-time study without earning.');
      }
    }

    // 7. Missing Information Detection
    pathway.steps.forEach((step) => {
      const node = careerGraphDatabase.getNode(step.nodeId);
      if (node && node.type === 'education' && !node.isAccredited && node.verificationStatus === 'suggested-route') {
        missingDataNotes.push(`Informal route: ${node.name} lacks institutional accreditation; portfolio proof required.`);
      }
    });

    const isValid = errors.length === 0 && cycleFree && deadEndFree && connectivityValid && prerequisitesOrdered;

    // Record telemetry
    if (isValid) {
      careerGraphDatabase.recordRouteValidated();
    } else {
      careerGraphDatabase.recordRouteRejected();
    }

    return {
      isValid,
      connectivityValid,
      prerequisitesOrdered,
      geographicCompliant,
      entryFeasible,
      deadEndFree,
      cycleFree,
      errors,
      warnings,
      missingDataNotes,
    };
  }

  /**
   * Computes a canonical fingerprint string to detect and deduplicate identical routes.
   */
  public computePathwayFingerprint(steps: PathwayStep[]): string {
    return steps.map((s) => s.nodeId).join('->');
  }
}

export const pathwayValidationEngine = new PathwayValidationEngine();
