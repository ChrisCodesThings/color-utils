import type { CSSColor } from './types.js';

/**
 * Generates a random CSS color in hexadecimal format.
 *
 * @returns {CSSColor} A random hex color string (e.g. "#1a2b3c").
 */
export const randomColor = (): CSSColor => {
    return `#${Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')}`;
};
