import { test, expect } from '@playwright/test';
import { validateScreenshotRequest } from '../lib/validation';
import { AppError } from '../lib/utils';

test('should return a successful response from the health endpoint', async ({ request }) => {
  const response = await request.get('/api/health');
  console.log(await response.text());
  expect(response.ok()).toBeTruthy();
});

test('should not allow a delay over 10 seconds', () => {
  const screenshotRequest = {
    url: 'https://example.com',
    delay: 10001,
  };

  expect(() => validateScreenshotRequest(screenshotRequest)).toThrow(AppError);
});
