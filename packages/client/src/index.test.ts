import { describe, it, expect } from 'vitest';
import { createCascadeClient } from './index.js';

describe('createCascadeClient', () => {
  it('returns a client instance', () => {
    const client = createCascadeClient<any>();
    expect(client).toBeDefined();
  });
});
