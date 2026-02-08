import { generateApiKey } from '../lib/utils';
import { test, expect } from '@playwright/test';

test('generateApiKey should return a valid API key format', () => {
  const apiKey = generateApiKey();
  expect(apiKey).toMatch(/^sk_[A-Za-z0-9]{32}$/);
});

test('generateApiKey should produce unique keys', () => {
  const keys = new Set();
  for (let i = 0; i < 100; i++) {
    keys.add(generateApiKey());
  }
  expect(keys.size).toBe(100);
});
