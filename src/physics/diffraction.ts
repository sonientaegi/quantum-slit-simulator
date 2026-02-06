/**
 * Fraunhofer diffraction pattern calculation
 */

import type { HolePosition, DiffractionConfig } from '../types/index.js';

/**
 * Compute the Fraunhofer diffraction pattern for a given set of open holes
 *
 * For each screen point y_s, the electric field is:
 * E(y_s) = Σ_j exp(i * k * y_j * y_s / D)
 *
 * where:
 * - k = 2π/λ (wave number)
 * - y_j is the y-coordinate of hole j
 * - D is the distance to the screen
 *
 * The intensity is I(y_s) = |E(y_s)|²
 *
 * @param openHoles - Array of open (unblocked) holes
 * @param config - Diffraction configuration (wavelength, screen distance, etc.)
 * @returns Float64Array of intensity values at each screen point
 */
export function computeDiffractionPattern(
  openHoles: HolePosition[],
  config: DiffractionConfig
): Float64Array {
  const { wavelength, screenDistance, screenPoints, screenHeight } = config;

  // Wave number k = 2π/λ
  const k = (2 * Math.PI) / wavelength;

  // Initialize intensity array
  const intensity = new Float64Array(screenPoints);

  // Screen y-coordinates (centered at 0)
  const dy = screenHeight / (screenPoints - 1);
  const yMin = -screenHeight / 2;

  // Compute intensity at each screen point
  for (let i = 0; i < screenPoints; i++) {
    const y_s = yMin + i * dy;

    // Sum complex amplitudes: E = Σ exp(i * phase)
    // Split into real and imaginary parts
    let realSum = 0;
    let imagSum = 0;

    for (const hole of openHoles) {
      const phase = (k * hole.y * y_s) / screenDistance;
      realSum += Math.cos(phase);
      imagSum += Math.sin(phase);
    }

    // Intensity I = |E|² = real² + imag²
    intensity[i] = realSum * realSum + imagSum * imagSum;
  }

  return intensity;
}

/**
 * Normalize an intensity pattern to have maximum value of 1
 *
 * @param pattern - Intensity pattern array
 * @returns Normalized pattern
 */
export function normalizePattern(pattern: Float64Array): Float64Array {
  const max = Math.max(...pattern);

  if (max === 0) {
    return new Float64Array(pattern.length);
  }

  const normalized = new Float64Array(pattern.length);
  for (let i = 0; i < pattern.length; i++) {
    normalized[i] = pattern[i] / max;
  }

  return normalized;
}

/**
 * Get the screen y-coordinates corresponding to the intensity array
 *
 * @param screenPoints - Number of points on the screen
 * @param screenHeight - Total height of the screen
 * @returns Array of y-coordinates
 */
export function getScreenCoordinates(
  screenPoints: number,
  screenHeight: number
): Float64Array {
  const coords = new Float64Array(screenPoints);
  const dy = screenHeight / (screenPoints - 1);
  const yMin = -screenHeight / 2;

  for (let i = 0; i < screenPoints; i++) {
    coords[i] = yMin + i * dy;
  }

  return coords;
}
