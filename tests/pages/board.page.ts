import type { Locator, Page } from '@playwright/test';

export class BoardPage {
  constructor(private readonly page: Page) {}

  get title(): Locator {
    return this.page.getByRole('heading', { name: 'BuggyBoard' });
  }

  get newBugButton(): Locator {
    return this.page.getByRole('button', { name: 'New Bug', exact: true });
  }

  get logoutButton(): Locator {
    return this.page.getByRole('button', { name: 'Logout' });
  }

  async openCreateBugModal(): Promise<void> {
    await this.newBugButton.click();
  }
}
