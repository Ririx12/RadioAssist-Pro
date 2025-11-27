// RadioAssist Pro - Code Jaune Validator Tests
import { describe, it, expect } from 'vitest';
import { validateCodeJaune, getCodeJauneErrorMessage } from './codeJauneValidator';

describe('Code Jaune Validator', () => {
  describe('Non Code Jaune cases', () => {
    it('returns valid for empty indication', () => {
      const result = validateCodeJaune('');
      expect(result.isValid).toBe(true);
      expect(result.isCodeJaune).toBe(false);
      expect(result.missingFields).toEqual([]);
    });

    it('returns valid for null indication', () => {
      const result = validateCodeJaune(null);
      expect(result.isValid).toBe(true);
      expect(result.isCodeJaune).toBe(false);
      expect(result.missingFields).toEqual([]);
    });

    it('returns valid for regular indication', () => {
      const indication = 'H 45 ans, douleur abdominale aiguë. Suspicion appendicite.';
      const result = validateCodeJaune(indication);
      expect(result.isValid).toBe(true);
      expect(result.isCodeJaune).toBe(false);
      expect(result.missingFields).toEqual([]);
    });
  });

  describe('Code Jaune detection', () => {
    it('detects "Code Jaune" text', () => {
      const indication = 'CODE JAUNE - Signes cliniques: hémiparésie';
      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
    });

    it('detects "CJ" abbreviation', () => {
      const indication = 'CJ signes cliniques: aphasie';
      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
    });
  });

  describe('Complete Code Jaune', () => {
    it('validates complete Code Jaune with all fields', () => {
      const indication = `CODE JAUNE -
Signes cliniques : Hémiparésie droite, dysarthrie
Début des symptômes à 14h30
NIHSS 8 sur table
Antécédents : HTA, diabète
Contexte : Patient retrouvé à domicile
AVC ?`;

      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
      expect(result.isValid).toBe(true);
      expect(result.missingFields).toEqual([]);
    });
  });

  describe('Incomplete Code Jaune', () => {
    it('detects missing clinical signs', () => {
      const indication = `CODE JAUNE
Début des symptômes à 14h
NIHSS 8`;

      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('Signes cliniques');
    });

    it('detects missing symptom onset time', () => {
      const indication = `CODE JAUNE
Signes cliniques : Hémiparésie
NIHSS 8`;

      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('Heure de début des symptômes');
    });

    it('detects missing NIHSS score', () => {
      const indication = `CODE JAUNE
Signes cliniques : Hémiparésie
Début des symptômes à 14h`;

      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('Score NIHSS');
    });

    it('detects NIHSS marked as missing', () => {
      const indication = `CODE JAUNE
Signes cliniques : Hémiparésie
Début des symptômes à 14h
NIHSS manquant`;

      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('Score NIHSS (marqué comme manquant)');
    });

    it('detects when time is marked as unknown', () => {
      const indication = `CODE JAUNE
Signes cliniques : Hémiparésie
Pas de renseignement pour l'heure de début
NIHSS 8`;

      const result = validateCodeJaune(indication);
      expect(result.isCodeJaune).toBe(true);
      expect(result.isValid).toBe(false);
      expect(result.missingFields).toContain('Heure de début des symptômes');
    });
  });

  describe('Error message', () => {
    it('returns empty string for no missing fields', () => {
      const message = getCodeJauneErrorMessage([]);
      expect(message).toBe('');
    });

    it('creates error message for multiple missing fields', () => {
      const message = getCodeJauneErrorMessage([
        'Signes cliniques',
        'Heure de début des symptômes',
        'Score NIHSS',
      ]);
      expect(message).toContain('PROTOCOLE CODE JAUNE INCOMPLET');
      expect(message).toContain('Signes cliniques');
      expect(message).toContain('Heure de début des symptômes');
      expect(message).toContain('Score NIHSS');
    });
  });
});
