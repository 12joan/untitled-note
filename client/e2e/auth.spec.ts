import { expect, Page, test } from '@playwright/test';

const randomEmail = () => `test_${Math.random()}@preview.local`;
const randomPassword = () => Math.random().toString();

let email: string;
let password: string;

const expectFlashMessage = (page: Page, message: string) =>
  expect(page.locator('.flash-message').getByText(message)).toHaveCount(1);

const gotoLatestEmail = async (page: Page, to = email) => {
  await page.goto(`/email_previews?to=${encodeURIComponent(to)}`);
  await page.locator('.email-preview').first().click();
};

const signUpWithoutConfirming = async (page: Page) => {
  await page.goto('/welcome');
  await page.getByText('Create account').click();
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByLabel('Confirm password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expectFlashMessage(page, 'Confirm your email address');
};

const confirmEmail = async (page: Page, currentEmail = email) => {
  await gotoLatestEmail(page, currentEmail);
  await page.getByText('Confirm my account').click();
};

const expectApp = (page: Page) =>
  expect(page.getByRole('heading', { name: 'My project' })).toBeVisible({
    timeout: 30000,
  });

const signIn = async (
  page: Page,
  navigate = true,
  currentEmail = email,
  currentPassword = password
) => {
  if (navigate) await page.goto('/users/sign_in');
  await page.getByLabel('Email address').fill(currentEmail);
  await page.getByLabel('Password').fill(currentPassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expectApp(page);
};

const signUpAndSignIn = async (page: Page) => {
  await signUpWithoutConfirming(page);
  await confirmEmail(page);
  await signIn(page, false);
};

const signOut = async (page: Page) => {
  await page.goto('/');
  await page.getByLabel('Account').hover();
  await page.getByText('Sign out').click();
  await expect(page.getByText('Create account')).toBeVisible();
};

test.describe('Auth', () => {
  // Tests are slow when running with multiple workers
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    email = randomEmail();
    password = randomPassword();
    await signUpAndSignIn(page);
  });

  test('sign out and in again', async ({ page }) => {
    await signOut(page);
    await signIn(page);
  });

  test('forgot password', async ({ page }) => {
    await signOut(page);

    await page.getByText('Sign in').click();
    await page.getByText('Forgot your password').click();
    await page.getByLabel('Email address').fill(email);
    await page
      .getByRole('button', { name: 'Send reset password email' })
      .click();
    await gotoLatestEmail(page);
    await page.getByText('Change my password').click();

    const newPassword = randomPassword();
    await page.getByLabel('Password', { exact: true }).fill(newPassword);
    await page.getByLabel('Confirm password').fill(newPassword);
    await page.getByRole('button', { name: 'Change my password' }).click();
    await expectFlashMessage(page, 'Password changed');
    await expectApp(page);

    await gotoLatestEmail(page);
    await expect(
      page.getByText('your password has been changed')
    ).toBeVisible();

    await signOut(page);
    await signIn(page, true, email, newPassword);
  });

  test('change password', async ({ page }) => {
    await page.goto('/users/edit');

    const newPassword = randomPassword();
    const form = page.getByTestId('change-password');
    await form.getByLabel('Current password').fill(password);
    await form.getByLabel('New password', { exact: true }).fill(newPassword);
    await form.getByLabel('Confirm new password').fill(newPassword);
    await form.getByRole('button', { name: 'Change password' }).click();
    await expectFlashMessage(page, 'Account updated');
    await expectApp(page);

    await gotoLatestEmail(page);
    await expect(
      page.getByText('your password has been changed')
    ).toBeVisible();

    await signOut(page);
    await signIn(page, true, email, newPassword);
  });

  test('change email', async ({ page }) => {
    await page.goto('/users/edit');

    const newEmail = randomEmail();
    const form = page.getByTestId('change-email-address');
    await form.getByLabel('New email address').fill(newEmail);
    await form.getByLabel('Current password').fill(password);
    await form.getByRole('button', { name: 'Change email address' }).click();
    await expectFlashMessage(page, 'Confirm your email address');
    await expectApp(page);

    await gotoLatestEmail(page, email);
    await expect(
      page.getByText('your email address is being changed')
    ).toBeVisible();

    await confirmEmail(page, newEmail);

    await signOut(page);
    await signIn(page, true, newEmail);
  });

  test('delete account', async ({ page }) => {
    await page.goto('/users/edit');
    await page
      .getByLabel(
        'I understand that this action is permanent and cannot be undone.'
      )
      .check();
    await page.getByRole('button', { name: 'Delete account' }).click();
    await expectFlashMessage(page, 'Account deleted');
  });
});
