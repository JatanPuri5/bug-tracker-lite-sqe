import { test, expect, Page } from '@playwright/test';

const BASE = 'http://localhost:3000';

async function clearAllBugs(page: Page) {
  const deleteButtons = page.locator('[data-testid="btn-delete"]');
  const count = await deleteButtons.count();
  for (let i = 0; i < count; i++) {
    await deleteButtons.first().click();
    await page.waitForTimeout(300);
  }
}

async function createBug(
  page: Page,
  title: string,
  description = '',
  severity = 'Low'
) {
  await page.fill('[data-testid="input-title"]', title);
  if (description) await page.fill('[data-testid="input-description"]', description);
  await page.selectOption('[data-testid="select-severity"]', severity);
  await page.click('[data-testid="btn-create"]');
  await expect(page.locator('[data-testid="bug-title"]').first()).toContainText(title);
}

test.describe('Bug Tracker Lite — Jira Test Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.waitForSelector('[data-testid="app-title"]');
    await clearAllBugs(page);
  });

  // KAN-8 | TC-01
  test('KAN-8 | TC-01 | Create Bug Successfully', async ({ page }) => {
    await page.fill('[data-testid="input-title"]', 'Login button not working');
    await page.fill('[data-testid="input-description"]', 'Clicking login does nothing');
    await page.selectOption('[data-testid="select-severity"]', 'High');
    await page.click('[data-testid="btn-create"]');

    await expect(page.locator('[data-testid="bug-title"]').first()).toContainText(
      'Login button not working'
    );
    await expect(page.locator('[data-testid="bug-severity"]').first()).toContainText('High');
    await expect(page.locator('[data-testid="bug-status-badge"]').first()).toContainText('Open');
  });

  // KAN-9 | TC-02
  test('KAN-9 | TC-02 | Required Title Validation', async ({ page }) => {
    await page.click('[data-testid="btn-create"]');

    await expect(page.locator('[data-testid="form-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="form-error"]')).toContainText('Title is required');
    await expect(page.locator('[data-testid="bug-list"]')).toHaveCount(0);
  });

  // KAN-10 | TC-03
  test('KAN-10 | TC-03 | Update Bug Status', async ({ page }) => {
    await createBug(page, 'Status update bug');

    await page.locator('[data-testid="select-status"]').first().selectOption('In Progress');
    await expect(page.locator('[data-testid="bug-status-badge"]').first()).toContainText(
      'In Progress'
    );

    await page.locator('[data-testid="select-status"]').first().selectOption('Resolved');
    await expect(page.locator('[data-testid="bug-status-badge"]').first()).toContainText(
      'Resolved'
    );
  });

  // KAN-11 | TC-04
  test('KAN-11 | TC-04 | Filter Bugs by Severity and Status', async ({ page }) => {
    await createBug(page, 'Critical login crash', '', 'Critical');
    await createBug(page, 'Low priority typo', '', 'Low');

    // Filter by severity
    await page.selectOption('[data-testid="filter-severity"]', 'Critical');
    await expect(page.locator('[data-testid="bug-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="bug-severity"]').first()).toContainText('Critical');

    // Reset and filter by status
    await page.click('[data-testid="btn-reset-filters"]');
    await expect(page.locator('[data-testid="bug-card"]')).toHaveCount(2);

    await page.locator('[data-testid="select-status"]').first().selectOption('Resolved');
    await expect(page.locator('[data-testid="bug-status-badge"]').first()).toContainText('Resolved');

    await page.selectOption('[data-testid="filter-status"]', 'Resolved');
    await expect(page.locator('[data-testid="bug-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="bug-status-badge"]').first()).toContainText('Resolved');
  });

  // KAN-12 | TC-05
  test('KAN-12 | TC-05 | Delete Bug Successfully', async ({ page }) => {
    await createBug(page, 'Bug to be deleted');

    await page.click('[data-testid="btn-delete"]');

    await expect(page.locator('[data-testid="bug-title"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
  });

  // KAN-13 | TC-06
  test('KAN-13 | TC-06 | Page Loads with Title and Empty State', async ({ page }) => {
    await expect(page.locator('[data-testid="app-title"]')).toContainText('Bug Tracker Lite');
    await expect(page.locator('[data-testid="bug-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="bug-filters"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="bug-count"]')).toContainText('0 bugs found');
  });

  // KAN-14 | TC-07
  test('KAN-14 | TC-07 | Bug Count Updates as Bugs Are Added', async ({ page }) => {
    await expect(page.locator('[data-testid="bug-count"]')).toContainText('0 bugs found');

    await createBug(page, 'First bug');
    await expect(page.locator('[data-testid="bug-count"]')).toContainText('1 bug found');

    await createBug(page, 'Second bug');
    await expect(page.locator('[data-testid="bug-count"]')).toContainText('2 bugs found');
  });

  // KAN-15 | TC-08
  test('KAN-15 | TC-08 | Form Resets After Successful Submission', async ({ page }) => {
    await page.fill('[data-testid="input-title"]', 'Reset test bug');
    await page.fill('[data-testid="input-description"]', 'Some description');
    await page.selectOption('[data-testid="select-severity"]', 'High');
    await page.click('[data-testid="btn-create"]');

    await expect(page.locator('[data-testid="bug-title"]').first()).toContainText('Reset test bug');
    await expect(page.locator('[data-testid="input-title"]')).toHaveValue('');
    await expect(page.locator('[data-testid="input-description"]')).toHaveValue('');
    await expect(page.locator('[data-testid="select-severity"]')).toHaveValue('Low');
  });

  // KAN-16 | TC-09
  test('KAN-16 | TC-09 | Bug Description Is Displayed on Card', async ({ page }) => {
    await createBug(page, 'Desc test bug', 'This is a detailed description', 'Medium');

    await expect(page.locator('[data-testid="bug-description"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="bug-description"]').first()).toContainText(
      'This is a detailed description'
    );
  });

  // KAN-17 | TC-10
  test('KAN-17 | TC-10 | Filter by Severity and Status Combined', async ({ page }) => {
    await createBug(page, 'High Open bug', '', 'High');
    await createBug(page, 'High Resolved bug', '', 'High');

    await page.locator('[data-testid="select-status"]').nth(1).selectOption('Resolved');
    await expect(page.locator('[data-testid="bug-status-badge"]').nth(1)).toContainText('Resolved');

    await page.selectOption('[data-testid="filter-severity"]', 'High');
    await page.selectOption('[data-testid="filter-status"]', 'Resolved');

    await expect(page.locator('[data-testid="bug-card"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="bug-severity"]').first()).toContainText('High');
    await expect(page.locator('[data-testid="bug-status-badge"]').first()).toContainText('Resolved');
  });
});
