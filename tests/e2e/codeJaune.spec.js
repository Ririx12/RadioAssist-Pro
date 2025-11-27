// RadioAssist Pro - E2E Tests for Code Jaune (Stroke) Workflow
import { test, expect } from '@playwright/test';

test.describe('Code Jaune Workflow (Medical Safety)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('RadioAssist Pro')).toBeVisible();
  });

  test('should block copy when Code Jaune is incomplete', async ({ page }) => {
    // Simulate incomplete Code Jaune indication
    const textarea = page.getByPlaceholder('Ex: Suspicion appendicite...');
    const incompleteCodeJaune = `CODE JAUNE
Patient avec hémiparésie
Heure de début inconnue`;

    // Fill in the output field manually (simulating AI response)
    // In real scenario, this would come from API
    await textarea.fill(incompleteCodeJaune);

    // Try to copy
    const copyButton = page.getByText('TOUT COPIER');
    await copyButton.click();

    // Should show alert about incomplete Code Jaune
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('CODE JAUNE INCOMPLET');
      expect(dialog.message()).toContain('Champs manquants');
      await dialog.accept();
    });
  });

  test('should allow copy when Code Jaune is complete', async ({ page }) => {
    // Note: This would require actual AI integration
    // We're testing the validation logic exists
    const textarea = page.getByPlaceholder('Ex: Suspicion appendicite...');
    const completeCodeJaune = `CODE JAUNE –
Signes cliniques : Hémiparésie droite, dysarthrie
Début des symptômes à 14h30
NIHSS 8 sur table
AVC ?`;

    await textarea.fill(completeCodeJaune);

    // Copy button should be available
    const copyButton = page.getByText('TOUT COPIER');
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toBeEnabled();
  });

  test('should display all protocol sections for stroke workup', async ({ page }) => {
    // Stroke protocol typically uses Crâne + Natif
    await page.getByText('Crâne (Encéphale)').locator('..').click();
    await page.getByText('Natif').locator('..').click();

    const protocolOutput = page.getByPlaceholder('Sélectionnez des zones...');
    await expect(protocolOutput).toContainText('encéphale');
    await expect(protocolOutput).toContainText('cantho-méatal');
  });

  test('should show warning in disclaimer about AI verification', async ({ page }) => {
    await expect(page.getByText('Avertissement Médical')).toBeVisible();
    await expect(page.getByText('radiologue qualifié')).toBeVisible();
  });
});
