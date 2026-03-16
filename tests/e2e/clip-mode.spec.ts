import { expect } from '@playwright/test';
import { test } from './utils/fixtures';

test.describe('clip mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="text"]', 'https://example.com/video');
    await page.click('button[type="submit"]');
  });

  test('clip mode toggle shows and hides time inputs', async ({ page }) => {
    const toggle = page.getByLabel('Clip mode');
    await expect(toggle).not.toBeChecked();

    // Time inputs hidden by default
    await expect(page.getByPlaceholder('00:00:00')).not.toBeVisible();
    await expect(page.getByPlaceholder('00:01:30')).not.toBeVisible();

    // Enable clip mode
    await toggle.click();
    await expect(toggle).toBeChecked();

    // Time inputs now visible
    await expect(page.getByPlaceholder('00:00:00')).toBeVisible();
    await expect(page.getByPlaceholder('00:01:30')).toBeVisible();
  });

  test('shows format error for invalid start time', async ({ page }) => {
    await page.getByLabel('Clip mode').click();
    const startInput = page.getByPlaceholder('00:00:00');
    await startInput.fill('notatime');
    await startInput.blur();
    await expect(page.getByText('Invalid start time')).toBeVisible();
  });

  test('shows format error for invalid end time', async ({ page }) => {
    await page.getByLabel('Clip mode').click();
    const endInput = page.getByPlaceholder('00:01:30');
    await endInput.fill('notatime');
    await endInput.blur();
    await expect(page.getByText('Invalid end time')).toBeVisible();
  });

  test('shows range error when end time is not after start time', async ({ page }) => {
    await page.getByLabel('Clip mode').click();
    const startInput = page.getByPlaceholder('00:00:00');
    const endInput = page.getByPlaceholder('00:01:30');
    await startInput.fill('01:00');
    await endInput.fill('00:30');
    await startInput.blur();
    await expect(page.getByText('End time must be after start time')).toBeVisible();
  });

  test('no errors for a valid time range', async ({ page }) => {
    await page.getByLabel('Clip mode').click();
    const startInput = page.getByPlaceholder('00:00:00');
    const endInput = page.getByPlaceholder('00:01:30');
    await startInput.fill('00:30');
    await endInput.fill('01:00');
    await startInput.blur();
    await expect(page.locator('.text-error')).not.toBeVisible();
  });

  test('quality selector defaults to 720p', async ({ page }) => {
    await page.getByLabel('Clip mode').click();
    const qualitySelect = page.locator('select').filter({ hasText: '720p' });
    await expect(qualitySelect).toHaveValue('720');
  });

  test('toggling clip mode off hides time inputs again', async ({ page }) => {
    const toggle = page.getByLabel('Clip mode');
    await toggle.click();
    await expect(page.getByPlaceholder('00:00:00')).toBeVisible();
    await toggle.click();
    await expect(page.getByPlaceholder('00:00:00')).not.toBeVisible();
  });
});

test('clip mode shows playlist warning for playlist items', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[type="text"]', 'https://example.com/playlist');
  await page.click('button[type="submit"]');
  await page.getByLabel('Clip mode').click();
  await expect(page.getByText('Clip mode applies to all items in a playlist')).toBeVisible();
});
