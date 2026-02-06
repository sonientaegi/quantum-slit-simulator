export interface HolePosition {
  slitIndex: number;
  holeIndex: number;
  globalIndex: number;
  y: number;
  isBlocked: boolean;
}

export interface HoleGridConfig {
  N: number;
  L: number;
  slitSpacing: number;
  holeSpacing: number;
}

export interface DiffractionConfig {
  wavelength: number;
  screenDistance: number;
  screenPoints: number;
  screenHeight: number;
}

export interface GroverState {
  amplitudes: Float64Array;
  numStates: number;
  markedIndices: number[];
  iteration: number;
  optimalIterations: number;
}

export interface GroverHistory {
  states: GroverState[];
  markedProbability: number[];
}

export type SimulationPhase = 'setup' | 'blocked' | 'computing' | 'searching' | 'found';

export interface SimulationParams {
  N: number;
  L: number;
  C: number;
  wavelength: number;
}
