import { test, expect } from '@playwright/test';

test('should return a successful response from the health endpoint', async ({ request }) => {
  const response = await request.get('/api/health');
  console.log(await response.text());
  expect(response.ok()).toBeTruthy();
});