import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const users = JSON.parse(
  readFileSync(new URL('../users.json', import.meta.url), 'utf8'),
) as Array<{ username: string; password: string }>;

test.use({ video: 'on' });

test('logs in and creates a bug', async ({ page }) => {
  const user = users[0];
  const bug = {
    title: `Playwright test bug ${Date.now()}`,
    severity: 'high',
    description: 'Created by the Playwright end-to-end test.',
  };

  await page.goto('/login');
  await page.getByLabel('Username').fill(user.username);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/board$/);

  await page.getByRole('button', { name: 'New Bug' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Owner')).toHaveValue(user.username);
  await dialog.getByLabel('Title').fill(bug.title);
  await dialog.getByLabel('Severity').selectOption(bug.severity);
  await dialog.getByLabel('Description').fill(bug.description);

  const createResponse = page.waitForResponse(
    (response) => response.url().endsWith('/api/bugs') && response.request().method() === 'POST',
  );
  await dialog.getByRole('button', { name: 'Save' }).click();

  const response = await createResponse;
  expect(response.status()).toBe(201);
  await expect(dialog).toBeHidden();
  await expect(await response.json()).toMatchObject({
    title: bug.title,
    severity: 'HIGH',
    owner: user.username,
    description: bug.description,
  });
});