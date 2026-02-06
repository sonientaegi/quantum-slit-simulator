/**
 * Main orchestration hook for quantum slit diffraction simulation
 * Manages the entire simulation lifecycle from setup through Grover search
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  SimulationParams,
  HolePosition,
  DiffractionConfig,
  HoleGridConfig,
  GroverHistory,
  SimulationPhase,
} from '../types/index.js';
import { createHoleGrid, randomlyBlockHoles, getOpenHoles } from '../physics/holeGrid.js';
import { computeDiffractionPattern } from '../physics/diffraction.js';
import { patternsMatch } from '../physics/patternComparison.js';
import { combinationCount, generateAllCombinations } from '../quantum/combinatorics.js';
import { buildOracle } from '../quantum/oracle.js';
import { runGroverWithHistory } from '../quantum/grover.js';

export interface UseSimulationResult {
  params: SimulationParams;
  updateParams: (newParams: Partial<SimulationParams>) => void;
  holeGrid: HolePosition[];
  observedPattern: Float64Array | null;
  diffractionConfig: DiffractionConfig;
  groverHistory: GroverHistory | null;
  currentIteration: number;
  phase: SimulationPhase;
  searchSpaceSize: number;
  allCandidates: number[][];
  randomizeBlocking: () => void;
  clearBlocking: () => void;
  startGrover: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetSearch: () => void;
}

export function useSimulation(): UseSimulationResult {
  // Core simulation parameters
  const [params, setParams] = useState<SimulationParams>({
    N: 4,
    L: 3,
    C: 2,
    wavelength: 550,
  });

  // Physical state
  const [holeGrid, setHoleGrid] = useState<HolePosition[]>([]);
  const [observedPattern, setObservedPattern] = useState<Float64Array | null>(null);

  // Quantum search state
  const [groverHistory, setGroverHistory] = useState<GroverHistory | null>(null);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [allCandidates, setAllCandidates] = useState<number[][]>([]);
  const [searchSpaceSize, setSearchSpaceSize] = useState(0);

  // Simulation phase
  const [phase, setPhase] = useState<SimulationPhase>('setup');

  // Diffraction configuration (wavelength in micrometers for physics calculations)
  const diffractionConfig: DiffractionConfig = {
    wavelength: params.wavelength * 1e-3, // nm to μm
    screenDistance: 100,
    screenPoints: 500,
    screenHeight: 50,
  };

  // Hole grid configuration
  const gridConfig: HoleGridConfig = {
    N: params.N,
    L: params.L,
    slitSpacing: 5,
    holeSpacing: 1.2,
  };

  // Initialize hole grid when params change
  useEffect(() => {
    const grid = createHoleGrid(gridConfig);
    setHoleGrid(grid);
    setPhase('setup');
    setObservedPattern(null);
    setGroverHistory(null);
    setCurrentIteration(0);
    setAllCandidates([]);

    // Calculate search space size
    const totalHoles = params.N * params.L;
    const spaceSize = combinationCount(totalHoles, params.C);
    setSearchSpaceSize(spaceSize);
  }, [params.N, params.L, params.C]);

  // Update parameters
  const updateParams = useCallback((newParams: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  // Randomly block C holes and compute observed pattern
  const randomizeBlocking = useCallback(() => {
    // Always start from a fresh unblocked grid
    const freshGrid = createHoleGrid(gridConfig);
    const blockedGrid = randomlyBlockHoles(freshGrid, params.C);
    setHoleGrid(blockedGrid);

    // Compute the observed diffraction pattern
    const openHoles = getOpenHoles(blockedGrid);
    const pattern = computeDiffractionPattern(openHoles, diffractionConfig);
    setObservedPattern(pattern);

    setPhase('blocked');
    setGroverHistory(null);
    setCurrentIteration(0);
    setAllCandidates([]);
  }, [params.N, params.L, params.C, diffractionConfig]);

  // Clear blocking only (reset holes to all open)
  const clearBlocking = useCallback(() => {
    const freshGrid = createHoleGrid(gridConfig);
    setHoleGrid(freshGrid);
    setObservedPattern(null);
    setPhase('setup');
    setGroverHistory(null);
    setCurrentIteration(0);
    setAllCandidates([]);
  }, [gridConfig]);

  // Start Grover's algorithm
  const startGrover = useCallback(() => {
    if (!observedPattern) return;

    setPhase('computing');

    // Generate all possible blocking configurations
    const totalHoles = params.N * params.L;
    const candidates = generateAllCombinations(totalHoles, params.C);
    setAllCandidates(candidates);

    // Build the oracle to identify matching configurations
    const markedIndices = buildOracle({
      observedPattern,
      allCandidates: candidates,
      holeGrid: createHoleGrid(gridConfig), // Use fresh unblocked grid
      diffractionConfig,
      computeDiffractionPattern,
      patternsMatch,
    });

    // Run Grover's algorithm with history tracking
    const history = runGroverWithHistory(candidates.length, markedIndices);
    setGroverHistory(history);
    setCurrentIteration(0);
    setPhase('searching');
  }, [observedPattern, params.N, params.L, params.C, diffractionConfig, gridConfig]);

  // Step forward in Grover history
  const stepForward = useCallback(() => {
    if (!groverHistory) return;
    if (currentIteration < groverHistory.states.length - 1) {
      setCurrentIteration((prev) => prev + 1);
    }
  }, [groverHistory, currentIteration]);

  // Step backward in Grover history
  const stepBackward = useCallback(() => {
    if (currentIteration > 0) {
      setCurrentIteration((prev) => prev - 1);
    }
  }, [currentIteration]);

  // Reset search state
  const resetSearch = useCallback(() => {
    setGroverHistory(null);
    setCurrentIteration(0);
    setPhase('blocked');
  }, []);

  return {
    params,
    updateParams,
    holeGrid,
    observedPattern,
    diffractionConfig,
    groverHistory,
    currentIteration,
    phase,
    searchSpaceSize,
    allCandidates,
    randomizeBlocking,
    clearBlocking,
    startGrover,
    stepForward,
    stepBackward,
    resetSearch,
  };
}
