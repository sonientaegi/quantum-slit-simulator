/**
 * Hole grid model for multi-slit diffraction
 */

import type { HolePosition, HoleGridConfig } from '../types/index.js';

/**
 * Create a grid of N*L holes arranged in L slits with N holes each
 *
 * The y-coordinate for hole n in slit l is:
 * y(l, n) = (l - (L-1)/2) * slitSpacing + (n - (N-1)/2) * holeSpacing
 *
 * @param config - Configuration specifying N, L, and spacings
 * @returns Array of hole positions with all holes initially unblocked
 */
export function createHoleGrid(config: HoleGridConfig): HolePosition[] {
  const { N, L, slitSpacing, holeSpacing } = config;
  const holes: HolePosition[] = [];

  let globalIndex = 0;

  for (let l = 0; l < L; l++) {
    for (let n = 0; n < N; n++) {
      const y = (l - (L - 1) / 2) * slitSpacing + (n - (N - 1) / 2) * holeSpacing;

      holes.push({
        slitIndex: l,
        holeIndex: n,
        globalIndex: globalIndex++,
        y,
        isBlocked: false,
      });
    }
  }

  return holes;
}

/**
 * Randomly block C holes in the grid
 *
 * @param grid - Original hole grid
 * @param C - Number of holes to block
 * @returns New grid with C randomly selected holes blocked
 */
export function randomlyBlockHoles(grid: HolePosition[], C: number): HolePosition[] {
  if (C < 0 || C > grid.length) {
    throw new Error(`Cannot block ${C} holes in a grid of ${grid.length} holes`);
  }

  // Create a shallow copy of the grid
  const newGrid = grid.map(hole => ({ ...hole }));

  if (C === 0) {
    return newGrid;
  }

  // Create array of indices and shuffle using Fisher-Yates
  const indices = Array.from({ length: grid.length }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Block the first C holes
  for (let i = 0; i < C; i++) {
    newGrid[indices[i]].isBlocked = true;
  }

  return newGrid;
}

/**
 * Get all open (unblocked) holes from a grid
 *
 * @param grid - Hole grid
 * @returns Array of open holes
 */
export function getOpenHoles(grid: HolePosition[]): HolePosition[] {
  return grid.filter(hole => !hole.isBlocked);
}

/**
 * Count the number of open holes in a grid
 *
 * @param grid - Hole grid
 * @returns Number of open holes
 */
export function countOpenHoles(grid: HolePosition[]): number {
  return grid.filter(hole => !hole.isBlocked).length;
}
