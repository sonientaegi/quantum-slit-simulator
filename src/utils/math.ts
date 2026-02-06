/**
 * Math utilities for the multi-slit diffraction simulator
 */

/**
 * Compute binomial coefficient C(n, k) using multiplicative formula
 * C(n, k) = n! / (k! * (n-k)!)
 *
 * Uses the multiplicative formula to avoid overflow:
 * C(n, k) = (n * (n-1) * ... * (n-k+1)) / (k * (k-1) * ... * 1)
 */
export function combination(n: number, k: number): number {
  if (k < 0 || k > n) {
    return 0;
  }

  if (k === 0 || k === n) {
    return 1;
  }

  // Optimize by using the smaller of k and n-k
  k = Math.min(k, n - k);

  let result = 1;
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1);
  }

  return Math.round(result);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
