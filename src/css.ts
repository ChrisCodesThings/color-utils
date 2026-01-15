import * as T from './types.js';
import { isNum, isPct, isStr, isWord } from '@chriscodesthings/is';
import parseNumber from '@chriscodesthings/parse-number';
import CSS_COLORS from 'css-color-names' with { type: 'json' };

import { ComponentRange, rangeMatrix, CSS_KEYWORDS } from './css-defs.js';

/**
 * Checks if a string is a valid CSS color, in any format.
 * @param x The string to validate.
 * @returns True if the string is a valid CSS color.
 */
export const isCSSColor = (x: string): x is T.CSSColor => {
    return (
        isCSSHex(x)
        || isCSSNamedColor(x)
        || isCSSRGB(x)
        || isCSSHSL(x)
        || isCSSHWB(x)
        || isCSSLAB(x)
        || isCSSLCH(x)
        || isCSSOKLAB(x)
        || isCSSOKLCH(x)
        || isCSSCMYK(x)
    );
};

/**
 * Checks if a string is a valid CSS hex color.
 * @param x The string to validate.
 * @returns True if the string is a valid hex color.
 */
export const isCSSHex = (x: string): x is T.CSSColor => {
    return (
        isStr(x)
        && x.startsWith('#')
        && (x.length === 4 || x.length === 5 || x.length === 7 || x.length === 9)
        && /^#[0-9A-Fa-f]+$/.test(x)
    );
}

/**
 * Checks if a string is a valid CSS named color.
 * @param x The string to validate.
 * @returns True if the string is a valid named color.
 */
export const isCSSNamedColor = (x: string): x is T.CSSColor => {
    return isWord(x) && x.toLowerCase() in CSS_COLORS;
}

/**
 * Checks if a string is a valid CSS RGB or RGBA color.
 * @param x The string to validate.
 * @returns True if the string is a valid RGB/RGBA color.
 */
export const isCSSRGB = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('rgb')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Checks if a string is a valid CSS HSL or HSLA color.
 * @param x The string to validate.
 * @returns True if the string is a valid HSL/HSLA color.
 */
export const isCSSHSL = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('hsl')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Checks if a string is a valid CSS HWB color.
 * @param x The string to validate.
 * @returns True if the string is a valid HWB color.
 */
export const isCSSHWB = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('hwb')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Checks if a string is a valid CSS LAB color.
 * @param x The string to validate.
 * @returns True if the string is a valid LAB color.
 */
export const isCSSLAB = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('lab')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Checks if a string is a valid CSS LCH color.
 * @param x The string to validate.
 * @returns True if the string is a valid LCH color.
 */
export const isCSSLCH = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('lch')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Checks if a string is a valid CSS OKLAB color.
 * @param x The string to validate.
 * @returns True if the string is a valid OKLAB color.
 */
export const isCSSOKLAB = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('oklab')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Checks if a string is a valid CSS OKLCH color.
 * @param x The string to validate.
 * @returns True if the string is a valid OKLCH color.
 */
export const isCSSOKLCH = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('oklch')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Checks if a string is a valid CSS CMYK color.
 * @param x The string to validate.
 * @returns True if the string is a valid CMYK color.
 */
export const isCSSCMYK = (x: string): x is T.CSSColor => {
    if (!isStr(x)) return false;
    if (!x.startsWith('cmyk')) return false;

    const parsed: T.CSSParseResult = parseColorString(x);

    if (!parsed.valid) return false;

    return true;
}

/**
 * Parses a CSS color string and outputs the color model and parameters if valid.
 * Supports comma-separated (legacy) and space-separated (modern) syntax for RGB and HSL.
 * @param x The string to validate.
 * @returns A {@link CSSParseResult} object containing the validation status, 
 * parsed color components, and any error messages.
 */
export const parseColorString = (x: string): T.CSSParseResult => {

    // for output later
    const parsedColor: T.CSSParseResult = {
        valid: false,
        color: null,
        error: "no errors"
    }

    // Tidy input
    x = x.toLowerCase().trim();

    // could be name or keyword
    if (isWord(x)) {
        // If keyword or named color, quit as valid. Nothing else to do. 
        if (CSS_KEYWORDS.has(x)) {
            parsedColor.valid = true;
            parsedColor.color = {
                model: "keyword",
                p1: x
            };

            return parsedColor;
        }

        if (x in CSS_COLORS) {
            parsedColor.valid = true;
            parsedColor.color = {
                model: "name",
                p1: x,
                p2: CSS_COLORS[x as keyof typeof CSS_COLORS]
            };

            return parsedColor;
        }

        parsedColor.error = "unrecognised color in: " + x;
        return parsedColor;
    }

    // Check color model
    let modelName = x.startsWith("#") ? 'hex' : x.slice(0, x.indexOf("("));

    // (rgba and hsla are not in rangeMatrix because we remove the 'a')
    if (!(modelName in rangeMatrix) && modelName !== 'rgba' && modelName !== 'hsla') {
        parsedColor.error = "unrecognised color model in: " + x;
        return parsedColor;
    }

    let model = modelName as T.CSSColorModels;
    let modelLevel = 3;
    let reqVals: number = 3;
    let vals: Array<any> = [];

    // Check hex first
    if (model === 'hex') {
        if (!isCSSHex(x)) {
            parsedColor.error = "invalid hex string: " + x;
            return parsedColor;
        }

        // Expand string to full length, e.g. handle #000
        let hexStr: string = "";

        if (x.length <= 5) {
            for (let i = 0; i < (x.length == 4 ? 6 : 8); i++) {
                hexStr = hexStr + x[1 + Math.floor(i / 2)];
            }

        } else {
            hexStr = x.slice(1);
        }

        // Capture hex pairs, add 0x for number parsing later
        vals[0] = "0x" + hexStr.slice(0, 2);
        vals[1] = "0x" + hexStr.slice(2, 4);
        vals[2] = "0x" + hexStr.slice(4, 6);

        if (hexStr.length === 8) {
            vals[3] = "0x" + hexStr.slice(6, 8);
            reqVals = 4;
        }
    }

    // get contents of brackets from x
    let xStripped = x.substring(x.indexOf("(") + 1, x.lastIndexOf(")")).trim();

    // we should have a color model here like rgb( )
    // if string doesn't end with ) then it's invalid
    if (model !== 'hex' && !x.endsWith(")")) {
        parsedColor.error = "missing closing bracket in: " + x;
        return parsedColor;
    }

    // Check rgb/hsl for CSS color model 3 syntax
    if (model.startsWith('rgb') || model.startsWith('hsl')) {
        // Check if alpha is required and remove from model string
        if (model[3] === "a") {
            reqVals = 4;
            model = model.slice(0, -1) as T.CSSColorModels;
        }

        // Split on commas
        vals = xStripped.split(",").map(v => v.trim());
    }

    const exprs: Array<string> = [];

    if (vals.length < reqVals) {
        // if no values yet, we're at color model level 4
        modelLevel = 4;

        // expressions bugger things up here, filter out so we can parse properly

        // Find an expression
        let startPos = xStripped.search(/[a-z-][a-z0-9-]+\(/);

        while (startPos != -1) {
            const exprEnd = findExpressionEnd(xStripped, startPos);

            // expression is malformed if exprEnd fails
            if (exprEnd === -1) {
                parsedColor.error = "an expression is malformed in: " + x;
                return parsedColor;
            }

            // extract expression, save for later and substitute with placeholder
            const expr = xStripped.slice(startPos, exprEnd + 1);
            exprs.push(expr);
            xStripped = xStripped.replace(expr, "__EXPR__");

            // find next
            startPos = xStripped.search(/[a-z-][a-z0-9-]+\(/);
        }

        // Now we should be able to split on space and /

        // Split on / and space
        const someValsAndAlpha = xStripped.split("/").map(v => v.trim());
        vals = someValsAndAlpha[0].split(/\s+/);

        // Add alpha, if present
        if (someValsAndAlpha[1]) {
            vals[vals.length] = someValsAndAlpha[1];
        }

        // Check value count
        if (someValsAndAlpha.length == 2) {
            reqVals = 4;
        }

        // If more than one / separator, string is invalid
        // reqVals will still = 3 but vals.length will = 4
        // causes fail later on reqVals length check later
    }

    // cmyk will have an extra value
    if (model === 'cmyk') {
        reqVals++;
    }

    // we should have the correct number of values now
    if (vals.length !== reqVals) {
        parsedColor.error = "not enough, or too many color values in: " + x;
        return parsedColor;
    }

    // Now let's check the values we have actually make sense to us
    for (let i = 0; i < vals.length; i++) {
        const v: string = vals[i];
        let unit: string | null = null;
        let value: string = v;

        // none's and expression's are valid but can't be checked
        if (v === 'none') {
            if (modelLevel === 3) {
                parsedColor.error = "none keyword is not allowed in Color Model Level 3 in: " + x;
                return parsedColor;
            }

            continue;
        } else if (v === '__EXPR__') {
            // swap our placeholder for expression out from the saved expression earlier
            vals[i] = exprs.shift();
            continue;
        }

        // Too easy, but, it might just be a number or percentage? 
        // Check for numbers later
        if (isPct(v)) {
            unit = "pct";
        }

        // It could be a number with units
        const numUnits = v.match(/^([+-]?\d*\.?\d+)(deg|rad|grad|turn)$/);

        if (numUnits) {
            unit = numUnits[2];
            value = numUnits[1];
        }

        // If we don't know the unit here, it's either a number, or invalid
        const vNum = parseNumber(value);

        if (unit === null) {
            if (!Number.isNaN(vNum)) {
                unit = "num";
            } else {
                parsedColor.error = "parameter " + (i + 1) + " doesn't look right in: " + x;
                return parsedColor;
            }
        }

        // Make sure a unit isn't used where it shouldn't be
        if (!(unit in rangeMatrix[model][i])) {
            parsedColor.error = "unit " + unit + " not allowed as parameter " + (i + 1) + " in: " + x;
            return parsedColor;
        }

        // Lastly, range check against the range matrix
        const min = rangeMatrix[model][i][unit as keyof ComponentRange]![0];
        const max = rangeMatrix[model][i][unit as keyof ComponentRange]![1];

        if (vNum < min || vNum > max) {
            parsedColor.error = "parameter " + (i + 1) + " out of range in: " + x;
            return parsedColor;
        }
    }

    // build output object
    parsedColor.valid = true;
    parsedColor.color = {
        model,
        p1: vals.shift(),
        p2: vals.shift(),
        p3: vals.shift(),
    };

    // extra parameter for cmyk
    if (model === 'cmyk') {
        parsedColor.color.p4 = vals.shift();
    }

    // if anything left, it's alpha
    if (vals.length) {
        parsedColor.color.alpha = vals.shift();
    }

    // done!
    return parsedColor;
}

const findExpressionEnd = (str: string, startIdx: number): number => {
    let depth = 0;
    let trigger = false;

    for (let i = startIdx; i < str.length; i++) {
        if (str[i] === '(') depth++;
        if (str[i] === ')') depth--;

        if (depth > 0) trigger = true;
        if (depth === 0 && trigger) return i;

        if (depth < 0) return -1; // found close bracket first
    }

    return -1; // Not found
}
