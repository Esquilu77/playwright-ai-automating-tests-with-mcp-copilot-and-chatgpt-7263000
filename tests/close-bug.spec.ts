import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const users = JSON.parse(
  readFileSync(new URL('../users.json', import.meta.url), 'utf8'),
) as Array<{ username: string; password: string }>;

test.use({ video: 'on' });

test('logs in and closes an existing bug', async ({ page }) => {
  const user = users[0];

  await page.goto('/login');
  await page.getByLabel('Username').fill(user.username);
  await page.getByLabel('Password').fill(user.password);

  const bugsResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/bugs') && response.request().method() === 'GET',
  );
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/board$/);

  const bugsResponse = await bugsResponsePromise;
  const bugs = (await bugsResponse.json()) as Array<{
    id: number;
    title: string;
    state: string;
  }>;
  let targetBug = bugs.find((bug) => bug.state.toUpperCase() === 'OPEN');

  if (!targetBug) {
    const createResponse = await page.request.post(new URL('/api/bugs', page.url()).toString(), {
      data: {
        title: `Bug to close ${Date.now()}`,
        severity: 'mid',
        owner: user.username,
        description: 'Created as test data for the close-bug workflow.',
      },
    });
    expect(createResponse.status()).toBe(201);
    targetBug = (await createResponse.json()) as { id: number; title: string; state: string };

    const reloadResponsePromise = page.waitForResponse(
      (response) => response.url().endsWith('/api/bugs') && response.request().method() === 'GET',
    );
    await page.reload();
    await reloadResponsePromise;
  }

  const openBugRows = page.getByRole('table', { name: 'Bugs' }).locator('tbody tr[role="button"]');
  const targetBugRow = openBugRows.filter({
    has: page.getByRole('cell', { name: String(targetBug.id), exact: true }),
  });
  await expect(targetBugRow).toHaveCount(1);
  const openBugCountBefore = await openBugRows.count();

  await targetBugRow.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('State').selectOption('closed');

  const updateResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith(`/api/bugs/${targetBug.id}`) &&
      response.request().method() === 'PUT',
  );
  const saveButton = dialog.getByRole('button', { name: 'Save' });
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const updateResponse = await updateResponsePromise;
  expect(updateResponse.status()).toBe(200);
  await expect(await updateResponse.json()).toMatchObject({ state: 'CLOSED' });
  await expect(dialog).toBeHidden();
  await expect(targetBugRow).toHaveCount(0);
  await expect(openBugRows).toHaveCount(openBugCountBefore - 1);

  const reloadResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/bugs') && response.request().method() === 'GET',
  );
  await page.reload();
  await reloadResponsePromise;
  await expect(targetBugRow).toHaveCount(0);
  await expect(openBugRows).toHaveCount(openBugCountBefore - 1);
});