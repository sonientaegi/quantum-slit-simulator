/**
 * Pattern comparison utilities for diffraction patterns
 */

/**
 * Compute normalized mean squared error (MSE) between two patterns
 *
 * MSE = Σ(a[i] - b[i])² / n
 * Normalized by dividing by the variance of pattern a
 *
 * @param a - First intensity pattern
 * @param b - Second intensity pattern
 * @returns Normalized MSE distance (lower is more similar)
 */
export function patternDistance(a: Float64Array, b: Float64Array): number {
  if (a.length !== b.length) {
    throw new Error(
      `Pattern lengths must match: a.length=${a.length}, b.length=${b.length}`
    );
  }

  const n = a.length;

  if (n === 0) {
    return 0;
  }

  // Compute mean squared error
  let mse = 0;
  for (let i = 0; i < n; i++) {
    const diff = a[i] - b[i];
    mse += diff * diff;
  }
  mse /= n;

  // Compute variance of pattern a for normalization
  let mean_a = 0;
  for (let i = 0; i < n; i++) {
    mean_a += a[i];
  }
  mean_a /= n;

  let variance_a = 0;
  for (let i = 0; i < n; i++) {
    const diff = a[i] - mean_a;
    variance_a += diff * diff;
  }
  variance_a /= n;

  // Avoid division by zero
  if (variance_a === 0) {
    return mse === 0 ? 0 : Infinity;
  }

  // Return normalized MSE
  return mse / variance_a;
}

/**
 * Check if two patterns match within a given threshold
 *
 * @param a - First intensity pattern
 * @param b - Second intensity pattern
 * @param threshold - Maximum allowed normalized MSE (default: 1e-10)
 * @returns True if patterns match within threshold
 */
export function patternsMatch(
  a: Float64Array,
  b: Float64Array,
  threshold: number = 1e-10
): boolean {
  const distance = patternDistance(a, b);
  return distance <= threshold;
}

/**
 * Compute the correlation coefficient between two patterns
 *
 * ρ = Cov(a,b) / (σ_a * σ_b)
 *
 * @param a - First intensity pattern
 * @param b - Second intensity pattern
 * @returns Correlation coefficient (-1 to 1, where 1 is perfect correlation)
 */
export function patternCorrelation(a: Float64Array, b: Float64Array): number {
  if (a.length !== b.length) {
    throw new Error(
      `Pattern lengths must match: a.length=${a.length}, b.length=${b.length}`
    );
  }

  const n = a.length;

  if (n === 0) {
    return 0;
  }

  // Compute means
  let mean_a = 0;
  let mean_b = 0;
  for (let i = 0; i < n; i++) {
    mean_a += a[i];
    mean_b += b[i];
  }
  mean_a /= n;
  mean_b /= n;

  // Compute covariance and standard deviations
  let cov = 0;
  let var_a = 0;
  let var_b = 0;

  for (let i = 0; i < n; i++) {
    const diff_a = a[i] - mean_a;
    const diff_b = b[i] - mean_b;

    cov += diff_a * diff_b;
    var_a += diff_a * diff_a;
    var_b += diff_b * diff_b;
  }

  // Avoid division by zero
  if (var_a === 0 || var_b === 0) {
    return var_a === 0 && var_b === 0 ? 1 : 0;
  }

  const std_a = Math.sqrt(var_a);
  const std_b = Math.sqrt(var_b);

  return cov / (std_a * std_b);
}

/**
 * Find the index of maximum intensity in a pattern
 *
 * @param pattern - Intensity pattern
 * @returns Index of maximum value
 */
export function findMaxIntensityIndex(pattern: Float64Array): number {
  let maxIndex = 0;
  let maxValue = pattern[0];

  for (let i = 1; i < pattern.length; i++) {
    if (pattern[i] > maxValue) {
      maxValue = pattern[i];
      maxIndex = i;
    }
  }

  return maxIndex;
}
