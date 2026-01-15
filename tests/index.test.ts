import { describe, it, expect } from 'vitest';

// Dependencies
import { randomColor } from '../src/colorUtils';
import { isCSSHex } from '../src/css';

// Functions to test
import * as css from '../src/css';

describe('colorUtils', () => {
    describe('randomColor', () => {
        it('should return a valid hex color', () => {
            expect(randomColor()).toMatch(/^#[0-9a-f]{6}$/);
        });
    });
});

describe('css', () => {
    describe('isCSSHex', () => {
        it('should return true for valid hex colors', () => {
            expect(isCSSHex('#abc')).toBe(true);
            expect(isCSSHex('#aabbcc')).toBe(true);
            expect(isCSSHex('#abcd')).toBe(true);
            expect(isCSSHex('#aabbccdd')).toBe(true);
        });

        it('should return false for invalid hex colors', () => {
            expect(isCSSHex('abc')).toBe(false);
            expect(isCSSHex('#ab')).toBe(false);
            expect(isCSSHex('#abcde')).toBe(false);
            expect(isCSSHex('#gggggg')).toBe(false);
        });
    });

    describe('parseColorString', () => {
        it('should parse named colors', () => {
            const result = css.parseColorString('red');
            expect(result.valid).toBe(true);
            expect(result.color).toEqual({
                model: 'name',
                p1: 'red',
                p2: '#ff0000'
            });
        });

        it('should parse special keywords', () => {
            const result = css.parseColorString('transparent');
            expect(result.valid).toBe(true);
            expect(result.color).toEqual({
                model: 'keyword',
                p1: 'transparent'
            });
        });

        it('should parse hex colors', () => {
            let result = css.parseColorString('#ff0000');
            expect(result.error).toBe('no errors');
            expect(result.valid).toBe(true);
            expect(result.color).toEqual({
                model: 'hex',
                p1: '0xff',
                p2: '0x00',
                p3: '0x00'
            });

            result = css.parseColorString('#0f0');
            expect(result.error).toBe('no errors');
            expect(result.valid).toBe(true);
            expect(result.color).toEqual({
                model: 'hex',
                p1: '0x00',
                p2: '0xff',
                p3: '0x00'
            });
        });

        it('should parse hex colors with alpha', () => {
            const result = css.parseColorString('#0000ff80');
            expect(result.error).toBe('no errors');
            expect(result.valid).toBe(true);
            expect(result.color).toEqual({
                model: 'hex',
                p1: '0x00',
                p2: '0x00',
                p3: '0xff',
                alpha: '0x80'
            });
        });

        describe('color model level 3', () => {
            it('should parse rgb with integers', () => {
                const result = css.parseColorString('rgb(255, 0, 0)');
                expect(result.error).toBe('no errors');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'rgb',
                    p1: '255',
                    p2: '0',
                    p3: '0'
                });
            });

            it('should parse rgb with percentages', () => {
                const result = css.parseColorString('rgb(100%, 0%, 0%)');
                expect(result.error).toBe('no errors');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'rgb',
                    p1: '100%',
                    p2: '0%',
                    p3: '0%'
                });
            });

            it('should parse rgba with alpha', () => {
                const result = css.parseColorString('rgba(255, 0, 0, 0.5)');
                expect(result.error).toBe('no errors');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'rgb',
                    p1: '255',
                    p2: '0',
                    p3: '0',
                    alpha: '0.5'
                });
            });

            it('should parse hsl', () => {
                const result = css.parseColorString('hsl(120, 100%, 50%)');
                expect(result.error).toBe('no errors');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'hsl',
                    p1: '120',
                    p2: '100%',
                    p3: '50%'
                });
            });

            it('should fail on invalid values', () => {
                // Expressions not allowed at level 3
                expect(css.parseColorString('rgb(calc(100 + 100), 0, 0)').valid).toBe(false);

                // Wrong number of values
                expect(css.parseColorString('rgb(255, 0)').valid).toBe(false);
                expect(css.parseColorString('rgb(255, 0, 0, 0.5)').valid).toBe(false);
                expect(css.parseColorString('rgba(255, 0, 0)').valid).toBe(false);

                // Malformed
                expect(css.parseColorString('rgb(255, 0, 0,)').valid).toBe(false);
                expect(css.parseColorString('rgb(255, 0, 0, 0, 0)').valid).toBe(false);
                expect(css.parseColorString('rgb(255, 0, abc)').valid).toBe(false);
                expect(css.parseColorString('rgb(,,)').valid).toBe(false);

                // out of range values 
                expect(css.parseColorString('rgb(256, 0, 0)').valid).toBe(false);
                expect(css.parseColorString('rgb(-1, 0, 0)').valid).toBe(false);
                expect(css.parseColorString('rgb(101%, 0%, 0%)').valid).toBe(false);
                expect(css.parseColorString('rgb(-1%, 0%, 0%)').valid).toBe(false);
                expect(css.parseColorString('rgba(0, 0, 0, 1.1)').valid).toBe(false);
                expect(css.parseColorString('rgba(0, 0, 0, -0.1)').valid).toBe(false);
                expect(css.parseColorString('rgba(0, 0, 0, 101%)').valid).toBe(false);
                expect(css.parseColorString('rgba(0, 0, 0, -1%)').valid).toBe(false);
                expect(css.parseColorString('hsl(0, 101%, 50%)').valid).toBe(false);
                expect(css.parseColorString('hsl(0, 50%, 101%)').valid).toBe(false);
            });

            it('should fail on none keyword', () => {
                expect(css.parseColorString('rgb(none, 0, 0)').valid).toBe(false);
                expect(css.parseColorString('hsl(none, 0%, 0%)').valid).toBe(false);
            });

            it('should fail with junk after closing bracket', () => {
                expect(css.parseColorString('rgb(255, 0, 0)junk').valid).toBe(false);
            });
        });

        describe('color model level 4', () => {
            it('should parse hwb', () => {
                const result = css.parseColorString('hwb(120 10% 50%)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'hwb',
                    p1: '120',
                    p2: '10%',
                    p3: '50%'
                });
            });

            it('should parse lab', () => {
                const result = css.parseColorString('lab(50% 40 30)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'lab',
                    p1: '50%',
                    p2: '40',
                    p3: '30'
                });
            });

            it('should parse lch', () => {
                const result = css.parseColorString('lch(50% 40 30)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'lch',
                    p1: '50%',
                    p2: '40',
                    p3: '30'
                });
            });

            it('should parse oklab', () => {
                const result = css.parseColorString('oklab(50% 0.4 0.3)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'oklab',
                    p1: '50%',
                    p2: '0.4',
                    p3: '0.3'
                });
            });

            it('should parse oklch', () => {
                const result = css.parseColorString('oklch(50% 0.4 30)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'oklch',
                    p1: '50%',
                    p2: '0.4',
                    p3: '30'
                });
            });

            it('should parse cmyk', () => {
                const result = css.parseColorString('cmyk(0 100% 0 0)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'cmyk',
                    p1: '0',
                    p2: '100%',
                    p3: '0',
                    p4: '0'
                });
            });

            it('should preserve expressions', () => {
                const result = css.parseColorString('rgb(calc(100 + 100) 0 0)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'rgb',
                    p1: 'calc(100 + 100)',
                    p2: '0',
                    p3: '0'
                });
            });

            it('should handle nested and multiple expressions', () => {
                // Nested
                expect(css.parseColorString('rgb(calc(100 + calc(50 * 2)) 0 0)').valid).toBe(true);

                // Multiple
                const result = css.parseColorString('rgb(calc(50 * 2) calc(50 * 2) 0)');
                expect(result.valid).toBe(true);
                expect(result.color?.p1).toBe('calc(50 * 2)');
                expect(result.color?.p2).toBe('calc(50 * 2)');
            });

            it('should handle alpha with / separator', () => {
                const result = css.parseColorString('rgb(0 0 0 / 0.5)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'rgb',
                    p1: '0',
                    p2: '0',
                    p3: '0',
                    alpha: '0.5'
                });
            });

            it('should handle numbers with units', () => {
                const result = css.parseColorString('hsl(120deg 100% 50%)');
                expect(result.valid).toBe(true);
                expect(result.color).toEqual({
                    model: 'hsl',
                    p1: '120deg',
                    p2: '100%',
                    p3: '50%'
                });
            });

            it('should allow none keyword', () => {
                expect(css.parseColorString('rgb(none 0 0)').valid).toBe(true);
                expect(css.parseColorString('hsl(none 0% 0%)').valid).toBe(true);
            });

            it('should fail on comma separation for level 4 models', () => {
                expect(css.parseColorString('hwb(120, 10%, 50%)').valid).toBe(false);
                expect(css.parseColorString('lab(50%, 40, 30)').valid).toBe(false);
            });

            it('should fail on incorrect number of values', () => {
                expect(css.parseColorString('rgb(0 0 0 /)').valid).toBe(false);
                expect(css.parseColorString('rgb(0 0 0 / 0.5 0.5)').valid).toBe(false);
                expect(css.parseColorString('rgb(0 0 / 0.5)').valid).toBe(false);
            });

            it('should fail on malformed expressions', () => {
                expect(css.parseColorString('rgb(calc(100 + 100 0 0)').valid).toBe(false);
            });

            it('should fail on missing cmyk value', () => {
                expect(css.parseColorString('cmyk(0 0 0)').valid).toBe(false);
            });

            it('should fail on invalid values', () => {
                expect(css.parseColorString('rgb(300 0 0)').valid).toBe(false);
                expect(css.parseColorString('hsl(120 110% 50%)').valid).toBe(false);
            });

            it('should fail on degree units in invalid places', () => {
                expect(css.parseColorString('rgb(10deg 0 0)').valid).toBe(false);
            });
        });
    });
});
