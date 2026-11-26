import { readFileSync } from 'fs';
import { join } from 'path';
import type { Page } from '@playwright/test';

interface User {
  username: string;
  password: string;
}

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async loginWithFirstUser(): Promise<void> {
    const usersPath = join(process.cwd(), 'users.json');
    const rawUsers = readFileSync(usersPath, 'utf-8');
    const users = JSON.parse(rawUsers) as User[];
    const firstUser = users[0];

    if (!firstUser) {
      throw new Error('users.json must contain at least one user');
    }

    await this.page.getByLabel('Username').fill(firstUser.username);
    await this.page.getByLabel('Password').fill(firstUser.password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
