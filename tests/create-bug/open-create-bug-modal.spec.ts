import { test, expect } from '@playwright/test';
import { BoardPage } from '../pages/board.page';
import { CreateBugModal } from '../pages/create-bug-modal.page';
import { LoginPage } from '../pages/login.page';

test.describe('Create Bug', () => {
  test('opens the create-bug modal from the board', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const boardPage = new BoardPage(page);

    await loginPage.goto();
    await loginPage.loginWithFirstUser();

    await page.waitForURL('**/board');
    await expect(boardPage.logoutButton).toBeVisible();
    await expect(boardPage.title).toBeVisible();
    await expect(boardPage.newBugButton).toBeVisible();

    await boardPage.openCreateBugModal();

    const createBugModal = new CreateBugModal(page);
    await expect(createBugModal.dialog).toBeVisible();
    await expect(createBugModal.titleField).toBeVisible();
    await expect(createBugModal.severityField).toBeVisible();
    await expect(createBugModal.ownerField).toBeVisible();
    await expect(createBugModal.descriptionField).toBeVisible();
    await expect(createBugModal.saveButton).toBeVisible();
    await expect(createBugModal.cancelButton).toBeVisible();
  });
});
