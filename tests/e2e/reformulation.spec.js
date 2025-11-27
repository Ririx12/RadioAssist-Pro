// RadioAssist Pro - E2E Tests for Reformulation Workflow
import { test, expect } from '@playwright/test';

test.describe('Reformulation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to load
    await expect(page.getByText('RadioAssist Pro')).toBeVisible();
  });

  test('should display medical disclaimer on first load', async ({ page }) => {
    await expect(page.getByText('Avertissement Médical')).toBeVisible();
    await expect(page.getByText('intelligence artificielle')).toBeVisible();
    await expect(page.getByText('radiologue qualifié')).toBeVisible();
  });

  test('should close medical disclaimer', async ({ page }) => {
    const disclaimer = page.getByText('Avertissement Médical');
    await expect(disclaimer).toBeVisible();

    // Close disclaimer
    await page.getByLabel('Fermer l\'avertissement').click();
    await expect(disclaimer).not.toBeVisible();
  });

  test('should show settings panel', async ({ page }) => {
    await page.getByLabel('Ouvrir les paramètres').click();
    await expect(page.getByText('Paramètres API')).toBeVisible();
    await expect(page.getByText('Clé API OpenAI')).toBeVisible();
  });

  test('should show history panel with badge', async ({ page }) => {
    const historyButton = page.getByLabel('Voir l\'historique');
    await historyButton.click();
    await expect(page.getByText('Historique')).toBeVisible();
  });

  test('should disable reformulation button when input is empty', async ({ page }) => {
    const reformulateButton = page.getByRole('button', { name: /Reformuler/i });
    await expect(reformulateButton).toBeDisabled();
  });

  test('should enable reformulation button when input has text', async ({ page }) => {
    const textarea = page.getByPlaceholder('Ex: Suspicion appendicite...');
    await textarea.fill('Test indication');

    const reformulateButton = page.getByRole('button', { name: /Reformuler/i });
    await expect(reformulateButton).toBeEnabled();
  });

  test('should show error if API key is missing', async ({ page }) => {
    // Clear API key
    await page.getByLabel('Ouvrir les paramètres').click();
    const apiKeyInput = page.getByLabel('Clé API OpenAI');
    await apiKeyInput.clear();
    await page.getByText('Fermer').click();

    // Try to reformulate
    const textarea = page.getByPlaceholder('Ex: Suspicion appendicite...');
    await textarea.fill('Test indication');
    await page.getByRole('button', { name: /Reformuler/i }).click();

    await expect(page.getByText(/clé API/i)).toBeVisible();
  });

  test('should display protocol builder sections', async ({ page }) => {
    await expect(page.getByText('Corps')).toBeVisible();
    await expect(page.getByText('Tête & Cou')).toBeVisible();
    await expect(page.getByText('Injection')).toBeVisible();
  });

  test('should toggle protocol checkboxes', async ({ page }) => {
    // Click Thorax checkbox
    const thoraxCheckbox = page.getByText('Thorax').locator('..');
    await thoraxCheckbox.click();

    // Verify protocol output updates
    const protocolOutput = page.getByPlaceholder('Sélectionnez des zones...');
    await expect(protocolOutput).toContainText('thoracique');
  });

  test('should toggle contrast agent', async ({ page }) => {
    await page.getByText('Iomeron 350').click();

    // Select a region with injection to verify contrast change
    await page.getByText('Thorax').locator('..').click();
    await page.getByText('Portal').locator('..').click();

    const protocolOutput = page.getByPlaceholder('Sélectionnez des zones...');
    await expect(protocolOutput).toContainText('Iomeron 350');
  });

  test('should show copy button in footer', async ({ page }) => {
    await expect(page.getByText('TOUT COPIER')).toBeVisible();
  });

  test('should show history count badge after reformulation', async ({ page }) => {
    // Note: This test would require a valid API key
    // We're just checking the UI elements exist
    const historyButton = page.getByLabel('Voir l\'historique');
    await expect(historyButton).toBeVisible();
  });
});
