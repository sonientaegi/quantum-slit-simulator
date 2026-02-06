/**
 * Color utilities for quantum slit diffraction simulator
 * Converts wavelength to RGB and maps intensity to colors
 */

/**
 * Convert wavelength (380-780nm) to RGB color values
 * Uses standard visible spectrum approximation
 * @param wavelength Wavelength in nanometers (380-780)
 * @returns RGB tuple [r, g, b] each 0-255
 */
export function wavelengthToRGB(wavelength: number): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;

  // Clamp wavelength to visible spectrum
  const wl = Math.max(380, Math.min(780, wavelength));

  // Standard visible spectrum approximation
  if (wl >= 380 && wl < 440) {
    // Violet to Blue
    r = -(wl - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wl >= 440 && wl < 490) {
    // Blue to Cyan
    r = 0;
    g = (wl - 440) / (490 - 440);
    b = 1;
  } else if (wl >= 490 && wl < 510) {
    // Cyan to Green
    r = 0;
    g = 1;
    b = -(wl - 510) / (510 - 490);
  } else if (wl >= 510 && wl < 580) {
    // Green to Yellow
    r = (wl - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wl >= 580 && wl < 645) {
    // Yellow to Red
    r = 1;
    g = -(wl - 645) / (645 - 580);
    b = 0;
  } else if (wl >= 645 && wl <= 780) {
    // Red
    r = 1;
    g = 0;
    b = 0;
  }

  // Apply intensity falloff at spectrum edges
  let factor = 1.0;
  if (wl >= 380 && wl < 420) {
    factor = 0.3 + 0.7 * (wl - 380) / (420 - 380);
  } else if (wl >= 700 && wl <= 780) {
    factor = 0.3 + 0.7 * (780 - wl) / (780 - 700);
  }

  // Scale to 0-255 and apply gamma correction (γ=0.8)
  const gamma = 0.8;
  r = Math.round(255 * Math.pow(r * factor, gamma));
  g = Math.round(255 * Math.pow(g * factor, gamma));
  b = Math.round(255 * Math.pow(b * factor, gamma));

  return [r, g, b];
}

/**
 * Map intensity value (0-1) to CSS color string using wavelength color
 * @param intensity Normalized intensity (0 = dark, 1 = bright)
 * @param wavelength Wavelength in nanometers
 * @returns CSS rgb() color string
 */
export function intensityToColor(intensity: number, wavelength: number): string {
  const [r, g, b] = wavelengthToRGB(wavelength);

  // Scale RGB by intensity (0 = black, 1 = full color)
  const scaledR = Math.round(r * intensity);
  const scaledG = Math.round(g * intensity);
  const scaledB = Math.round(b * intensity);

  return `rgb(${scaledR}, ${scaledG}, ${scaledB})`;
}

/**
 * Map intensity to grayscale for screen display
 * @param intensity Normalized intensity (0 = black, 1 = white)
 * @returns CSS rgb() grayscale color string
 */
export function intensityToGrayscale(intensity: number): string {
  // Clamp intensity to [0, 1]
  const clamped = Math.max(0, Math.min(1, intensity));

  // Scale to 0-255
  const value = Math.round(255 * clamped);

  return `rgb(${value}, ${value}, ${value})`;
}
