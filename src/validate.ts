import type * as T from './types.js';
import { isHexColor, isPct, isStr } from '@chriscodesthings/is';
import parseNumber from '@chriscodesthings/parse-number';

export const isRGBColor = (x: any): x is T.RGBColor => {
    if (typeof x !== 'object' || x === null) return false;
    const keys = Object.keys(x);
    if (keys.length < 3 || keys.length > 4) return false;
    if (typeof x.r !== 'number' || typeof x.g !== 'number' || typeof x.b !== 'number') return false;
    if ('a' in x && typeof x.a !== 'number') return false;
    return keys.every(k => ['r', 'g', 'b', 'a'].includes(k));
};

export const isHSLColor = (x: any): x is T.HSLColor => {
    if (typeof x !== 'object' || x === null) return false;
    const keys = Object.keys(x);
    if (keys.length < 3 || keys.length > 4) return false;
    if (typeof x.h !== 'number' || typeof x.s !== 'number' || typeof x.l !== 'number') return false;
    if ('a' in x && typeof x.a !== 'number') return false;
    return keys.every(k => ['h', 's', 'l', 'a'].includes(k));
};

export const isCSSColor = (x: string): x is T.CSSColor => {
    const hsl = /^hsla?\(\s*\d+\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?\s*(,\s*[\d\.]+\s*)?\)$/;

    return (
        isHexColor(x)
        || isCSSRGB(x)
        || hsl.test(x)
    );
};

export const isCSSHex = (x: string): x is T.CSSColor => {
    if (isStr(x)) {
        return (
            x.startsWith('#')
            && (x.length === 4 || x.length === 5 || x.length === 7 || x.length === 9)
            && /^#[0-9A-Fa-f]+$/.test(x)
        );
    }

    return false;
}

/**
 * Checks if a string is a valid CSS RGB or RGBA color.
 * Supports comma-separated (legacy) and space-separated (modern) syntax.
 * @param x The string to validate.
 * @returns True if the string is a valid RGB/RGBA color.
 */
export const isCSSRGB = (x: string): x is T.CSSColor => {
    // Tidy
    x = x.toLowerCase().trim();

    // Must start with 'rgb' or 'rgba'
    let minParts = 0;

    if (x.startsWith('rgb')) {
        minParts = 3;
    }

    if (x.startsWith('rgba')) {
        minParts = 4;
    }

    // Fail if not
    if (!minParts) return false;

    // Get contents of brackets, return if no match
    const debracketed = x.match(/^.*?\((.*)\)$/);
    if (!debracketed) return false;

    // Switch a potential slash to space for easier splitting
    let data = debracketed[1];

    // Try comma separated first
    let colModVer = 3;
    let vals = data.split(',').map(p => p.trim());

    if (vals.length < minParts) {
        colModVer = 4;

        // Color mod v4 functions bugger things up here, check for and remove them
        let startPos = data.search(/[a-z-][a-z0-9-]+\(/);

        while (startPos != -1) {
            console.log("resolving functions", data);

            const exprEnd = findExpressionEnd(data, startPos);

            // string is malformed if exprEnd fails
            if (exprEnd === -1) {
                return false;
            }

            const expr = data.slice(startPos, exprEnd + 1);

            console.log("start", startPos, "end", exprEnd, "expr", expr);

            // substitute with 0 in data string to pass validation
            data = data.replace(expr, "0");

            // find next
            startPos = data.search(/[a-z-][a-z0-9-]+\(/);
        }

        // Split on space and slash
        const rgbAndA = [...data.split("/"), "0"].map(v => v.trim()); // Add phantom zero in case there is no / alpha
        vals = [...rgbAndA[0].split(/\s+/), rgbAndA[1]].map(v => v.trim());
    }

    // We should now have enough values (but not too many!)
    if (vals.length < minParts || vals.length > 4) {
        return false;
    }

    // Validate each value
    let firstValPct: boolean = false; // true = pct, false = num

    for (let i = 0; i < vals.length; i++) {
        // Handle 'none' keyword for color mod v4
        vals[i] = colModVer === 4 && vals[i] === 'none' ? '0' : vals[i];

        const v = vals[i];
        const thisValPct = isPct(v);

        // Color mod v3 rules
        if (colModVer === 3) {
            // Check r, g, b, unit type consistency for v3
            // r, g, b must all be the same type, a must be a number
            if (i === 0) {
                firstValPct = thisValPct;
            } else if (i <= 2 && firstValPct !== thisValPct) {
                return false;
            } else if (i === 3 && thisValPct) {
                return false;
            }

            // Alpha cannot be percentage in v3
            if (i === 3 && thisValPct) {
                return false;
            }
        }

        // Max value
        let vValMax: number = 255; // Default range 0 - 255

        // Percent must be 100 max
        if (thisValPct) {
            vValMax = 100;
        }

        // Alpha must be 0 - 1 if it's a number
        if (i === 3 && !thisValPct) {
            vValMax = 1;
        }

        // Parse and check value
        const vVal = parseNumber(v);

        // r, g, b must be int in v3
        if (i <= 2 && colModVer === 3 && !Number.isInteger(vVal)) {
            return false;
        }

        // Check is a number in range
        if (isNaN(vVal) || vVal < 0 || vVal > vValMax) {
            return false;
        }
    }

    return true;
}

const findExpressionEnd = (str: string, startIdx: number): number => {
    let depth = 0;
    let trigger = false;

    for (let i = startIdx; i < str.length; i++) {
        if (str[i] === '(') depth++;
        if (str[i] === ')') depth--;

        if (depth > 0) trigger = true;
        if (depth === 0 && trigger) return i;

        if (depth < 0) return -1;
    }

    return -1; // Not found
}