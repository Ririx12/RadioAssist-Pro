// RadioAssist Pro - Code Jaune (Stroke Protocol) Validator

const normalize = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Validates if a Code Jaune (stroke) indication has all required fields
 * @param {string} indication - The reformulated indication text
 * @returns {{isValid: boolean, missingFields: string[], isCodeJaune: boolean}}
 */
export const validateCodeJaune = (indication) => {
  if (!indication) {
    return { isValid: true, missingFields: [], isCodeJaune: false };
  }

  const normalized = normalize(indication);

  // Check if this is a Code Jaune case
  const isCodeJaune = /code\s+jaune|^cj\b/.test(normalized);

  if (!isCodeJaune) {
    return { isValid: true, missingFields: [], isCodeJaune: false };
  }

  // Required fields for Code Jaune
  const missingFields = [];

  // Check for clinical signs
  if (!/signes\s+cliniques\s*:/.test(normalized)) {
    missingFields.push('Signes cliniques');
  }

  // Check for symptom onset time
  const hasOnsetTime =
    /(debut\s+(des\s+symptomes)?|heure\s+de\s+debut)/.test(normalized) &&
    !/pas\s+de\s+renseignement\s+pour\s+l'heure|heure\s+inconnue/.test(normalized);

  if (!hasOnsetTime) {
    missingFields.push('Heure de début des symptômes');
  }

  // Check for NIHSS score
  if (!/nihss/.test(normalized)) {
    missingFields.push('Score NIHSS');
  } else if (/nihss\s+manquant|nihss\s+non\s+renseigne/.test(normalized)) {
    missingFields.push('Score NIHSS (marqué comme manquant)');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    isCodeJaune: true,
  };
};

/**
 * Creates a user-friendly error message for incomplete Code Jaune
 * @param {string[]} missingFields - Array of missing field names
 * @returns {string} Error message
 */
export const getCodeJauneErrorMessage = (missingFields) => {
  if (missingFields.length === 0) return '';

  return `⚠️ PROTOCOLE CODE JAUNE INCOMPLET

Champs manquants obligatoires:
${missingFields.map((field) => `  • ${field}`).join('\n')}

Le protocole Code Jaune (AVC) nécessite ces informations critiques pour une prise en charge optimale.

Veuillez compléter l'indication avant d'exporter.`;
};
