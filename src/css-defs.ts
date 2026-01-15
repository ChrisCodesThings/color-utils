import * as T from './types.js';

// define ranges for each parameter of each color model
export interface ComponentRange {
    name?: [number, number];  // Never used, just to keep TS happy
    keyword?: [number, number];  // Never used, just to keep TS happy
    num?: [number, number];
    pct?: [number, number];
    deg?: [number, number];
    rad?: [number, number];
    grad?: [number, number];
    turn?: [number, number];
}

export const rangeMatrix: Record<T.CSSColorModels, ComponentRange[]> = {
    name: [{ name: [0, 0] }], // Never used, just to keep TS happy
    keyword: [{ keyword: [0, 0] }], // Never used, just to keep TS happy
    hex: [
        { num: [0, 255] }, // R
        { num: [0, 255] }, // G
        { num: [0, 255] }, // B
        { num: [0, 255] }  // A
    ],
    rgb: [
        { num: [0, 255], pct: [0, 100] }, // R
        { num: [0, 255], pct: [0, 100] }, // G
        { num: [0, 255], pct: [0, 100] }, // B
        { num: [0, 1], pct: [0, 100] }  // A
    ],
    hsl: [
        {
            deg: [-359, 359],
            num: [-359, 359],
            rad: [-(359 * Math.PI / 180), 359 * Math.PI / 180], // Exact radians for 359deg
            grad: [-(359 * 400 / 360), 359 * 400 / 360],         // ~398.88 grad
            turn: [-(359 / 360), 359 / 360]                      // ~0.9972 turn
        },
        { pct: [0, 100] }, // S
        { pct: [0, 100] }, // L
        { num: [0, 1], pct: [0, 100] } // A
    ],
    hwb: [
        {
            deg: [-359, 359],
            num: [-359, 359],
            rad: [-(359 * Math.PI / 180), 359 * Math.PI / 180],
            grad: [-(359 * 400 / 360), 359 * 400 / 360],
            turn: [-(359 / 360), 359 / 360]
        },
        { pct: [0, 100] }, // W
        { pct: [0, 100] }, // B
        { num: [0, 1], pct: [0, 100] } // A
    ],
    lab: [
        { num: [0, 100], pct: [0, 100] },       // L: Lightness
        { num: [-125, 125], pct: [-100, 100] }, // a: green-red
        { num: [-125, 125], pct: [-100, 100] }, // b: blue-yellow
        { num: [0, 1], pct: [0, 100] }          // A
    ],
    oklab: [
        { num: [0, 1], pct: [0, 100] },         // L: Lightness
        { num: [-0.4, 0.4], pct: [-100, 100] }, // a: green-red
        { num: [-0.4, 0.4], pct: [-100, 100] }, // b: blue-yellow
        { num: [0, 1], pct: [0, 100] }          // A
    ],
    lch: [
        { num: [0, 100], pct: [0, 100] },       // L: Lightness
        { num: [0, 150], pct: [0, 100] },       // C: Chroma
        {
            deg: [-359, 359],
            num: [-359, 359],
            rad: [-(359 * Math.PI / 180), 359 * Math.PI / 180],
            grad: [-(359 * 400 / 360), 359 * 400 / 360],
            turn: [-(359 / 360), 359 / 360]
        },
        { num: [0, 1], pct: [0, 100] } // A
    ],
    oklch: [
        { num: [0, 1], pct: [0, 100] },         // L: Lightness
        { num: [0, 0.4], pct: [0, 100] },       // C: Chroma
        {
            deg: [-359, 359],
            num: [-359, 359],
            rad: [-(359 * Math.PI / 180), 359 * Math.PI / 180],
            grad: [-(359 * 400 / 360), 359 * 400 / 360],
            turn: [-(359 / 360), 359 / 360]
        },
        { num: [0, 1], pct: [0, 100] } // A
    ],
    cmyk: [
        { pct: [0, 100], num: [0, 1] }, // C
        { pct: [0, 100], num: [0, 1] }, // M
        { pct: [0, 100], num: [0, 1] }, // Y
        { pct: [0, 100], num: [0, 1] }, // K
        { num: [0, 1], pct: [0, 100] } // A
    ]
};

export const CSS_KEYWORDS = new Set([
    // Essentials
    "transparent",
    "currentcolor",

    // System Colors (Standardized in CSS4)
    "accentcolor",
    "accentcolortext",
    "activetext",
    "buttonborder",
    "buttonface",
    "buttontext",
    "canvas",
    "canvastext",
    "field",
    "fieldtext",
    "graytext",
    "highlight",
    "highlighttext",
    "linktext",
    "mark",
    "marktext",
    "selecteditem",
    "selecteditemtext",
    "visitedtext"
]);
