/**
 * Combinatorics utilities for generating all possible blocking configurations
 */

/**
 * Compute binomial coefficient C(n, k) = n! / (k! * (n-k)!)
 * Uses iterative multiplication to avoid factorial overflow
 *
 * @param n - Total number of items
 * @param k - Number of items to choose
 * @returns The binomial coefficient C(n, k)
 */
export function combinationCount(n: number, k: number): number {
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
    result *= (n - i);
    result /= (i + 1);
  }

  return Math.round(result);
}

/**
 * Generate all C(n, k) combinations of k indices from 0 to n-1
 * Each combination represents a set of blocked hole global indices
 *
 * Uses iterative generation with lexicographic ordering:
 * - Start with [0, 1, 2, ..., k-1]
 * - Find rightmost index that can be incremented
 * - Increment it and reset all indices to its right
 *
 * @param totalHoles - Total number of holes (n)
 * @param blockedCount - Number of holes to block (k)
 * @returns Array of all combinations, each combination is an array of k indices
 */
export function generateAllCombinations(
  totalHoles: number,
  blockedCount: number
): number[][] {
  if (blockedCount < 0 || blockedCount > totalHoles) {
    return [];
  }

  if (blockedCount === 0) {
    return [[]];
  }

  if (blockedCount === totalHoles) {
    return [Array.from({ length: totalHoles }, (_, i) => i)];
  }

  const numCombinations = combinationCount(totalHoles, blockedCount);
  const combinations: number[][] = [];

  // Initialize first combination [0, 1, 2, ..., k-1]
  const current = Array.from({ length: blockedCount }, (_, i) => i);
  combinations.push([...current]);

  // Generate remaining combinations
  while (combinations.length < numCombinations) {
    // Find the rightmost index that can be incremented
    let i = blockedCount - 1;
    while (i >= 0 && current[i] === totalHoles - blockedCount + i) {
      i--;
    }

    // If no such index exists, we're done (shouldn't happen with correct count)
    if (i < 0) {
      break;
    }

    // Increment current[i] and reset all indices to its right
    current[i]++;
    for (let j = i + 1; j < blockedCount; j++) {
      current[j] = current[j - 1] + 1;
    }

    combinations.push([...current]);
  }

  return combinations;
}
