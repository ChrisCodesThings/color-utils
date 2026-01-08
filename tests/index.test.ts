import { describe, it, expect } from 'vitest';

// Dependencies
import { isHexColor } from '@chriscodesthings/is';

// Functions to test
import { randomColor } from '../src/colorUtils';
import * as validate from '../src/validate';

describe('randomColor', () => {
    it('should generate a valid CSS color', () => {
        expect(isHexColor(randomColor())).toBe(true);
    });
});

describe('isCSSRGB', () => {
    describe('CSS3 (Legacy/Comma-separated)', () => {
        it('should validate standard integer rgb values', () => {
            expect(validate.isCSSRGB('rgb(255, 0, 0)')).toBe(true);
            expect(validate.isCSSRGB('rgba(255, 0, 0, 0.5)')).toBe(true);
        });

        it('should validate percentage values', () => {
            expect(validate.isCSSRGB('rgb(100%, 0%, 0%)')).toBe(true);
            expect(validate.isCSSRGB('rgba(100%, 0%, 0%, 0.5)')).toBe(true);
        });

        it('should enforce same unit type for r, g, b', () => {
            expect(validate.isCSSRGB('rgb(255, 0%, 0)')).toBe(false);
            expect(validate.isCSSRGB('rgb(100%, 0, 0%)')).toBe(false);
        });

        it('should enforce integers for numeric r, g, b', () => {
            expect(validate.isCSSRGB('rgb(255.5, 0, 0)')).toBe(false);
            expect(validate.isCSSRGB('rgb(0, 10.2, 0)')).toBe(false);
        });

        it('should enforce alpha as a number (0-1), not percentage', () => {
            expect(validate.isCSSRGB('rgba(0, 0, 0, 50%)')).toBe(false);
            expect(validate.isCSSRGB('rgba(0, 0, 0, 1.1)')).toBe(false);
        });

        it('should reject "none" keyword', () => {
            expect(validate.isCSSRGB('rgb(none, 0, 0)')).toBe(false);
        });
    });

    describe('CSS4 (Modern/Space-separated)', () => {
        it('should validate space-separated syntax', () => {
            expect(validate.isCSSRGB('rgb(255 0 0)')).toBe(true);
            expect(validate.isCSSRGB('rgba(255 0 0 / 0.5)')).toBe(true);
        });

        it('should allow "none" keyword', () => {
            expect(validate.isCSSRGB('rgb(none 0 0)')).toBe(true);
            expect(validate.isCSSRGB('rgb(0 none 0)')).toBe(true);
            expect(validate.isCSSRGB('rgb(0 0 none)')).toBe(true);
            expect(validate.isCSSRGB('rgba(0 0 0 / none)')).toBe(true);
        });

        it('should allow floats for r, g, b', () => {
            expect(validate.isCSSRGB('rgb(12.5 0 0)')).toBe(true);
        });

        it('should allow percentage for alpha', () => {
            expect(validate.isCSSRGB('rgba(0 0 0 / 50%)')).toBe(true);
        });
    });

    describe('General Validation', () => {
        it('should reject invalid ranges', () => {
            expect(validate.isCSSRGB('rgb(256, 0, 0)')).toBe(false);
            expect(validate.isCSSRGB('rgb(0, 0, 0, 2)')).toBe(false); // Alpha > 1
        });

        it('should reject malformed strings', () => {
            expect(validate.isCSSRGB('rgb(,,)')).toBe(false);
            expect(validate.isCSSRGB('rgb(255 0 0, 0.5)')).toBe(false); // Mixed delimiters
            expect(validate.isCSSRGB('rgb(255, 0, 0 / 0.5)')).toBe(false); // Mixed delimiters
            expect(validate.isCSSRGB('rgb(255 0 / 0 0.5)')).toBe(false); // Slash in wrong place
            expect(validate.isCSSRGB('rgb(255 / 0 0 / 0.5)')).toBe(false); // Too many slashes
            expect(validate.isCSSRGB('rgb(255 255 255 /)')).toBe(false); // Trailing slash
        });
    });

    describe('level 4 functional notation', () => {
        it('should allow any function in any component', () => {
            expect(validate.isCSSRGB('rgb(calc(0 + 255) 0 0)')).toBe(true);
            expect(validate.isCSSRGB('rgb(0 calc(0 + 255) 0)')).toBe(true);
            expect(validate.isCSSRGB('rgb(0 0 calc(0 + 255))')).toBe(true);
            expect(validate.isCSSRGB('rgb(0 0 0 / calc(0.5 + 0.2))')).toBe(true);
            expect(validate.isCSSRGB('rgb(var(--red) var(--green) var(--blue) / var(--alpha))')).toBe(true);
            expect(validate.isCSSRGB('rgb(randomfunction(10) 0 0)')).toBe(true);
        });

        it('should reject functions in CSS3 (Legacy)', () => {
            expect(validate.isCSSRGB('rgb(calc(0 + 255), 0, 0)')).toBe(false);
            expect(validate.isCSSRGB('rgba(0, 0, 0, calc(0.5))')).toBe(false);
        });

        it('should handle nested functions', () => {
            expect(validate.isCSSRGB('rgb(calc(min(100, 200) + 50) 0 0)')).toBe(true);
            expect(validate.isCSSRGB('rgb(0 0 0 / calc((0.1 + 0.2) * 2))')).toBe(true);
        });

        it('should reject malformed functions', () => {
            expect(validate.isCSSRGB('rgb(calc(0 + 255 0 0)')).toBe(false);
            expect(validate.isCSSRGB('rgb(calc((0 + 255) 0 0)')).toBe(false);
        });
    });
});
