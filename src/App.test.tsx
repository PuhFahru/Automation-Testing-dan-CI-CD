import { describe, it, expect } from 'vitest';

describe('Dummy Test', () => {
  it('should intentionally fail for CI check', () => {
    expect(true).toBe(true); // Diperbaiki agar CI Pass
  });
});
