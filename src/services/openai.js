// RadioAssist Pro - OpenAI API Service
import { OPENAI_API_URL, OPENAI_MODEL, OPENAI_TEMPERATURE, SYSTEM_PROMPT } from '../utils/constants';

/**
 * Call OpenAI API to reformulate medical indication and suggest protocol
 * @param {string} apiKey - OpenAI API key
 * @param {string} indicationInput - Raw medical indication text
 * @returns {Promise<{reformulation: string, protocol: object}>}
 * @throws {Error} If API call fails
 */
export const reformulateIndication = async (apiKey, indicationInput) => {
  if (!apiKey) {
    throw new Error('Clé API OpenAI manquante');
  }

  if (!indicationInput || !indicationInput.trim()) {
    throw new Error("Texte d'indication manquant");
  }

  const controller = new AbortController();

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: indicationInput },
      ],
      temperature: OPENAI_TEMPERATURE,
      response_format: { type: 'json_object' },
    }),
    signal: controller.signal,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Réponse OpenAI illisible.");
  }

  if (!response.ok) {
    const message = data?.error?.message || `Erreur OpenAI (${response.status})`;
    throw new Error(message);
  }

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Réponse API vide');
  }

  const parsedContent = JSON.parse(data.choices[0].message.content);

  return {
    reformulation: parsedContent.reformulation || '',
    protocol: parsedContent.protocol || null,
  };
};
