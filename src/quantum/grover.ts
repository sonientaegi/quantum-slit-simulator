/**
 * Grover's algorithm state-vector simulation with REAL amplitudes
 * All operations are immutable - each function returns a new state object
 */

import type { GroverState, GroverHistory } from '../types/index.js';

/**
 * Initialize Grover state with uniform amplitudes
 * Initial amplitude for each state is 1/sqrt(S) where S is the number of states
 *
 * @param numStates - Total number of states in the search space
 * @param markedIndices - Indices of the marked (target) states
 * @returns Initial Grover state with uniform superposition
 */
export function initGroverState(
  numStates: number,
  markedIndices: number[]
): GroverState {
  const amplitudes = new Float64Array(numStates);
  const initialAmplitude = 1 / Math.sqrt(numStates);

  for (let i = 0; i < numStates; i++) {
    amplitudes[i] = initialAmplitude;
  }

  const optimalIterations = Math.max(
    1,
    Math.floor((Math.PI / 4) * Math.sqrt(numStates / markedIndices.length))
  );

  return {
    amplitudes,
    numStates,
    markedIndices,
    iteration: 0,
    optimalIterations,
  };
}

/**
 * Apply oracle operation: negate amplitude of marked states
 * O|x⟩ = -|x⟩ if x is marked, O|x⟩ = |x⟩ otherwise
 *
 * @param state - Current Grover state
 * @returns New state with oracle applied (immutable)
 */
export function applyOracle(state: GroverState): GroverState {
  const newAmplitudes = new Float64Array(state.amplitudes);

  // Negate amplitudes of marked states
  for (const markedIdx of state.markedIndices) {
    newAmplitudes[markedIdx] = -newAmplitudes[markedIdx];
  }

  return {
    ...state,
    amplitudes: newAmplitudes,
  };
}

/**
 * Apply diffuser operation: inversion about average
 * D|ψ⟩ where each amplitude becomes 2*mean - amplitude
 * This is equivalent to the reflection operator 2|s⟩⟨s| - I
 *
 * @param state - Current Grover state
 * @returns New state with diffuser applied (immutable)
 */
export function applyDiffuser(state: GroverState): GroverState {
  const newAmplitudes = new Float64Array(state.amplitudes);

  // Compute mean amplitude
  let sum = 0;
  for (let i = 0; i < state.numStates; i++) {
    sum += newAmplitudes[i];
  }
  const mean = sum / state.numStates;

  // Apply inversion about average: a_i -> 2*mean - a_i
  for (let i = 0; i < state.numStates; i++) {
    newAmplitudes[i] = 2 * mean - newAmplitudes[i];
  }

  return {
    ...state,
    amplitudes: newAmplitudes,
  };
}

/**
 * Perform one complete Grover iteration (oracle + diffuser)
 *
 * @param state - Current Grover state
 * @returns New state after one iteration (immutable)
 */
export function groverIteration(state: GroverState): GroverState {
  let newState = applyOracle(state);
  newState = applyDiffuser(newState);
  newState = {
    ...newState,
    iteration: state.iteration + 1,
  };

  return newState;
}

/**
 * Compute probability of measuring a marked state
 * Sum of |amplitude|^2 for all marked states
 *
 * @param state - Current Grover state
 * @returns Probability of measuring a marked state
 */
function computeMarkedProbability(state: GroverState): number {
  let probability = 0;

  for (const markedIdx of state.markedIndices) {
    const amplitude = state.amplitudes[markedIdx];
    probability += amplitude * amplitude;
  }

  return probability;
}

/**
 * Run Grover's algorithm and record history at each step
 * Records the initial state and state after each iteration
 *
 * @param numStates - Total number of states in the search space
 * @param markedIndices - Indices of the marked (target) states
 * @param maxIterations - Maximum number of iterations (defaults to optimal + 3)
 * @returns History of all states and marked probabilities
 */
export function runGroverWithHistory(
  numStates: number,
  markedIndices: number[],
  maxIterations?: number
): GroverHistory {
  const initialState = initGroverState(numStates, markedIndices);

  const iterations =
    maxIterations ?? initialState.optimalIterations + 3;

  const states: GroverState[] = [initialState];
  const markedProbability: number[] = [computeMarkedProbability(initialState)];

  let currentState = initialState;

  for (let i = 0; i < iterations; i++) {
    currentState = groverIteration(currentState);
    states.push(currentState);
    markedProbability.push(computeMarkedProbability(currentState));
  }

  return {
    states,
    markedProbability,
  };
}
