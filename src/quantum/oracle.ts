/**
 * Oracle builder that bridges physics and quantum computation
 * Identifies which blocking configurations match the observed diffraction pattern
 */

import type { HolePosition, DiffractionConfig } from '../types/index.js';

export interface OracleConfig {
  observedPattern: Float64Array;
  allCandidates: number[][];
  holeGrid: HolePosition[];
  diffractionConfig: DiffractionConfig;
  computeDiffractionPattern: (
    openHoles: HolePosition[],
    config: DiffractionConfig
  ) => Float64Array;
  patternsMatch: (
    pattern1: Float64Array,
    pattern2: Float64Array,
    tolerance?: number
  ) => boolean;
}

/**
 * Build the oracle by testing all candidate blocking configurations
 * Returns indices of candidates that produce patterns matching the observed pattern
 *
 * @param config - Oracle configuration including observed pattern and candidates
 * @returns Array of candidate indices that match the observed pattern
 */
export function buildOracle(config: OracleConfig): number[] {
  const {
    observedPattern,
    allCandidates,
    holeGrid,
    diffractionConfig,
    computeDiffractionPattern,
    patternsMatch,
  } = config;

  const markedIndices: number[] = [];

  // Test each candidate blocking configuration
  for (let candidateIdx = 0; candidateIdx < allCandidates.length; candidateIdx++) {
    const blockedIndices = allCandidates[candidateIdx];

    // Create a set of blocked indices for fast lookup
    const blockedSet = new Set(blockedIndices);

    // Filter holeGrid to get open holes (not in blockedSet)
    const openHoles = holeGrid.filter(
      (hole) => !blockedSet.has(hole.globalIndex)
    );

    // Compute diffraction pattern for this configuration
    const candidatePattern = computeDiffractionPattern(
      openHoles,
      diffractionConfig
    );

    // Compare with observed pattern
    if (patternsMatch(observedPattern, candidatePattern)) {
      markedIndices.push(candidateIdx);
    }
  }

  return markedIndices;
}
