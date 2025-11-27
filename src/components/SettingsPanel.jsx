// RadioAssist Pro - Settings Panel Component
import React from 'react';

/**
 * Settings panel for API key configuration
 * @param {Object} props
 * @param {string} props.apiKey - OpenAI API key value
 * @param {Function} props.onApiKeyChange - Handler for API key changes
 * @param {string} props.googleApiKey - Google Gemini API key value
 * @param {Function} props.onGoogleApiKeyChange - Handler for Google API key changes
 * @param {Function} props.onClose - Handler for close button click
 */
const SettingsPanel = ({ apiKey, onApiKeyChange, googleApiKey, onGoogleApiKeyChange, onClose }) => (
  <div className="max-w-6xl mx-auto mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h2 className="text-2xl font-bold text-slate-800 mb-4" style={{ lineHeight: 1.2 }}>
      Paramètres API
    </h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Clé API OpenAI</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-proj-..."
          className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm"
          aria-label="Clé API OpenAI"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Clé API Google Gemini (optionnel)</label>
        <input
          type="password"
          value={googleApiKey}
          onChange={(e) => onGoogleApiKeyChange(e.target.value)}
          placeholder="AIza..."
          className="w-full p-3 border border-slate-300 rounded-lg font-mono text-sm"
          aria-label="Clé API Google Gemini"
        />
        <p className="text-xs text-slate-500 mt-1">Requis pour les points de vigilance et explications patient</p>
      </div>
      <button
        onClick={onClose}
        className="bg-slate-800 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
);

export default SettingsPanel;
