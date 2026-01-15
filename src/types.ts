
export type CSSColor = string;
export type CSSColorModels = 'name' | 'keyword' | 'hex' | 'rgb' | 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch' | 'cmyk';

export type Color =
    | { model: 'name', r: number, g: number, b: number, a: number }
    | { model: 'keyword', keyword: string }
    | { model: 'hex', r: number, g: number, b: number, a: number }
    | { model: 'rgb', r: number, g: number, b: number, a: number }
    | { model: 'hsl', h: number, s: number, l: number, a: number }
    | { model: 'hwb', h: number, w: number, b: number, a: number }
    | { model: 'lab' | 'oklab', l: number, a: number, b: number, alpha: number }
    | { model: 'lch' | 'oklch', l: number, c: number, h: number, a: number }
    | { model: 'cmyk', c: number, m: number, y: number, k: number, a: number };

export type CSSParseResult = {
    valid: boolean,
    color: null | {
        model: string;
        p1: string;
        p2?: string;
        p3?: string;
        p4?: string;    // May be present in cmyk model
        alpha?: string;
    },
    error: string
}
