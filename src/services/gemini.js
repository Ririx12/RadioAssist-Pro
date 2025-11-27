// RadioAssist Pro - Google Gemini API Service
import { GEMINI_API_URL } from '../utils/constants';

/**
 * Call Google Gemini API with a prompt
 * @param {string} apiKey - Google Gemini API key
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} The generated text response
 * @throws {Error} If API call fails
 */
export const callGemini = async (apiKey, prompt) => {
  if (!apiKey) {
    throw new Error('Clé API Google Gemini manquante. Veuillez la configurer dans les paramètres.');
  }

  if (!prompt || !prompt.trim()) {
    throw new Error('Prompt manquant');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Réponse Gemini illisible.');
  }

  if (!response.ok) {
    const message = data?.error?.message || `Erreur Gemini (${response.status})`;
    throw new Error(message);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return 'Pas de réponse.';
  }

  return text;
};
