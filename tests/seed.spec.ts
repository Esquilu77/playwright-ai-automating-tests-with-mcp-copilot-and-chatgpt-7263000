import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const users = JSON.parse(
  readFileSync(new URL('../users.json', import.meta.url), 'utf8'),
) as Array<{ username: string; password: string }>;

test.describe('Seed tests', () => {
  test('logs in with the first user', { tag: '@seed' }, async ({ page }) => {
  const user = users[0];

    await page.goto('/login');
    await page.getByLabel('Username').fill(user.username);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/board$/);
  });
});
