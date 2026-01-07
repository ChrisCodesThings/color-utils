import { describe, it, expect } from 'vitest';
import { helloWorld } from '../src/index.js';

describe('helloWorld', () => {
    it('should log "Hello, world!" to the console', () => {
        expect(helloWorld).toBe(true);
    });
});
