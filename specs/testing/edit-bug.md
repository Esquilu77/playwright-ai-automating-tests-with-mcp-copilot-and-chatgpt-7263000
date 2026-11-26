# Edit Bug End-to-End Test Plan

## Application Overview

Plan E2E coverage for editing an existing BuggyBoard bug, following specs/features/09-edit-bug.md. Browser exploration used the Playwright MCP on Chromium after tests/seed.spec.ts authenticated. The initially empty board required a temporary bug fixture, which was created in the UI for exploration and deleted afterward. Live behavior matched the spec for opening the modal, ID read-only behavior, save/cancel/X/Escape, backdrop persistence, unchanged-save disabling, and severity styling. The modal also currently exposes State and Delete controls (from later features); these are excluded from feature 09 coverage.

The severity dropdown has only HIGH/MID/LOW options and no blank option, so a blank severity cannot be produced through the current UI even though the spec includes it among required fields. Keep the spec as authority and flag this reachability gap; do not simulate an impossible user action by mutating the DOM. Clarify whether whitespace-only text counts as blank before encoding that expected behavior.

`tests/seed.spec.ts` authenticates but does not create bug data. Each scenario must create its own uniquely identifiable bug fixture through the UI and clean it up after the test so tests remain independent. Use page objects under `tests/pages/` (one class per file) for all browser interactions, including fixture setup and cleanup.

## Test Scenarios

### 1. Edit Bug

**Seed:** `tests/seed.spec.ts`

#### 1.1. Open a bug from the board

**File:** `tests/edit-bug/open-edit-bug-modal.spec.ts`

**Steps:**
  1. Create a unique bug fixture and open the board.
    - expect: The board shows the fixture's exact ID, title, severity, and owner.
  2. Click the bug's row.
    - expect: A dialog titled Edit bug #<id> opens.
    - expect: The dialog's ID, title, severity, owner, and description exactly match the fixture values.
    - expect: The dialog has Save and Cancel controls, and Save is disabled because no values have changed.

#### 1.2. ID is read-only and other bug fields are editable

**File:** `tests/edit-bug/editable-fields.spec.ts`

**Steps:**
  1. Open the edit modal for a bug.
    - expect: The ID field is not editable.
    - expect: Title, severity, owner, and description are editable.

#### 1.3. HIGH severity uses the board color in the edit modal

**File:** `tests/edit-bug/severity-high-color.spec.ts`

**Steps:**
  1. Create a HIGH-severity fixture and open its edit modal.
    - expect: The severity control is a dropdown with HIGH, MID, and LOW options.
    - expect: The selected HIGH value's rendered text color matches both the high-severity CSS token (#b84a2e) and the HIGH badge for that bug on the board.

#### 1.4. MID severity uses the board color in the edit modal

**File:** `tests/edit-bug/severity-mid-color.spec.ts`

**Steps:**
  1. Create a MID-severity fixture and open its edit modal.
    - expect: The selected MID value's rendered text color matches both the mid-severity CSS token (#a67c47) and the MID badge for that bug on the board.

#### 1.5. LOW severity uses the board color in the edit modal

**File:** `tests/edit-bug/severity-low-color.spec.ts`

**Steps:**
  1. Create a LOW-severity fixture and open its edit modal.
    - expect: The selected LOW value's rendered text color matches both the low-severity CSS token (#4a6b5e) and the LOW badge for that bug on the board.

#### 1.6. Clicking the backdrop preserves unsaved edits

**File:** `tests/edit-bug/backdrop-preserves-edit.spec.ts`

**Steps:**
  1. Open the edit modal and change a field.
    - expect: The changed value is visible in the form.
  2. Click the dimmed area outside the modal.
    - expect: The modal remains open.
    - expect: The unsaved field value is preserved.

#### 1.7. Save changes to a bug

**File:** `tests/edit-bug/save-edit.spec.ts`

**Steps:**
  1. Create a fixture with known values and MID severity, open it, then change its title to "Edited title" and severity to HIGH.
    - expect: Save is enabled.
  2. Click Save.
    - expect: The modal closes.
    - expect: The board displays the exact title "Edited title" and severity HIGH for the fixture's ID.
    - expect: Reopening the bug shows those exact values and the unchanged original owner and description.

#### 1.8. Cancel edits without saving

**File:** `tests/edit-bug/cancel-edit.spec.ts`

**Steps:**
  1. Record the fixture's original values, then change its title and severity.
    - expect: Both changed values are visible in the form.
  2. Click Cancel.
    - expect: The modal closes.
    - expect: Reopening the bug shows every exact original value, including description.

#### 1.9. Close with X without saving

**File:** `tests/edit-bug/close-x-without-saving.spec.ts`

**Steps:**
  1. Record the fixture's original values, then change its title and severity.
    - expect: Both changed values are visible in the form.
  2. Click the upper-right Close (X) control.
    - expect: The modal closes.
    - expect: Reopening the bug shows every exact original value, including description.

#### 1.10. Close with Escape without saving

**File:** `tests/edit-bug/escape-without-saving.spec.ts`

**Steps:**
  1. Record the fixture's original values, then change its title and severity.
    - expect: Both changed values are visible in the form.
  2. Press Escape.
    - expect: The modal closes.
    - expect: Reopening the bug shows every exact original value, including description.

#### 1.11. Save is disabled when there are no changes

**File:** `tests/edit-bug/save-disabled-without-changes.spec.ts`

**Steps:**
  1. Open the edit modal and leave all values unchanged.
    - expect: Save is disabled.

#### 1.12. Save is disabled when title is blank

**File:** `tests/edit-bug/save-disabled-with-blank-title.spec.ts`

**Steps:**
  1. Open the edit modal and clear the title.
    - expect: Save is disabled.
  2. Fill the title with a different nonblank value.
    - expect: Save becomes enabled.

#### 1.13. Save is disabled when owner is blank

**File:** `tests/edit-bug/save-disabled-with-blank-owner.spec.ts`

**Steps:**
  1. Open the edit modal and clear the owner.
    - expect: Save is disabled.
  2. Fill the owner with a different nonblank value.
    - expect: Save becomes enabled.

#### 1.14. Save is disabled when description is blank

**File:** `tests/edit-bug/save-disabled-with-blank-description.spec.ts`

**Steps:**
  1. Open the edit modal and clear the description.
    - expect: Save is disabled.
  2. Fill the description with a different nonblank value.
    - expect: Save becomes enabled.

#### 1.15. Save persists an owner change

**File:** `tests/edit-bug/save-owner.spec.ts`

**Steps:**
  1. Open the edit modal for a fixture and change only the owner to "Edited owner".
    - expect: Save is enabled.
  2. Save and reopen the fixture.
    - expect: The owner is exactly "Edited owner"; the title, severity, and description retain their original values.

#### 1.16. Save persists a description change

**File:** `tests/edit-bug/save-description.spec.ts`

**Steps:**
  1. Open the edit modal for a fixture and change only the description to "Edited description".
    - expect: Save is enabled.
  2. Save and reopen the fixture.
    - expect: The description is exactly "Edited description"; the title, severity, and owner retain their original values.

#### 1.17. Save is disabled after reverting a title change

**File:** `tests/edit-bug/save-disabled-after-title-revert.spec.ts`

**Steps:**
  1. Open the edit modal, change the title, then restore its exact original value.
    - expect: Save is disabled because the bug data is unchanged from when the modal opened.

#### 1.18. Save is disabled after reverting a severity change

**File:** `tests/edit-bug/save-disabled-after-severity-revert.spec.ts`

**Steps:**
  1. Open the edit modal for a MID-severity fixture, change severity to HIGH, then restore MID.
    - expect: Save is disabled because the bug data is unchanged from when the modal opened.

#### 1.19. Multiple blank required fields keep Save disabled

**File:** `tests/edit-bug/save-disabled-multiple-blank-fields.spec.ts`

**Steps:**
  1. Open the edit modal and clear both the title and owner.
    - expect: Save is disabled while either required field is blank.
  2. Fill both fields with different nonblank values.
    - expect: Save becomes enabled.

#### 1.20. A valid edit does not enable Save while another required field is blank

**File:** `tests/edit-bug/save-disabled-with-valid-change-and-blank-field.spec.ts`

**Steps:**
  1. Open the edit modal, change the title to a different valid value, and clear the owner.
    - expect: Save remains disabled while the owner is blank despite the valid title change.
  2. Fill the owner with a different nonblank value.
    - expect: Save becomes enabled.

#### 1.21. Whitespace-only text validation (pending requirement)

**File:** `tests/edit-bug/save-disabled-whitespace-only.spec.ts`

**Steps:**
  1. For title, owner, and description, enter a value containing only spaces.
    - expect: Pending confirmation of whether whitespace-only values count as blank; do not make this a normative assertion until clarified.

**Open question:** Confirm whether whitespace-only values count as blank before treating this expected result as normative.
