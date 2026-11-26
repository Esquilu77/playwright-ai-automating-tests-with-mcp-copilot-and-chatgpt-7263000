import type { Locator, Page } from '@playwright/test';

export class CreateBugModal {
  readonly dialog: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Create bug' });
  }

  get titleField(): Locator {
    return this.dialog.getByLabel('Title');
  }

  get severityField(): Locator {
    return this.dialog.getByLabel('Severity');
  }

  get ownerField(): Locator {
    return this.dialog.getByLabel('Owner');
  }

  get descriptionField(): Locator {
    return this.dialog.getByLabel('Description');
  }

  get saveButton(): Locator {
    return this.dialog.getByRole('button', { name: 'Save' });
  }

  get cancelButton(): Locator {
    return this.dialog.getByRole('button', { name: 'Cancel' });
  }
}
