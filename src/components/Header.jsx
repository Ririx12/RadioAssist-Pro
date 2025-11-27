// RadioAssist Pro - Header Component

import React from 'react';
import { Settings, Activity, Clock } from 'lucide-react';

/**
 * Application header with logo, history, and settings buttons
 * @param {Object} props
 * @param {Function} props.onSettingsClick - Handler for settings button click
 * @param {Function} props.onHistoryClick - Handler for history button click
 * @param {number} props.historyCount - Number of history items (for badge)
 */
const Header = ({ onSettingsClick, onHistoryClick, historyCount = 0 }) => (
  <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg text-white shadow-lg">
        <Activity size={28} />
      </div>
      <div>
        <h1 className="text-5xl font-bold text-slate-800" style={{ lineHeight: 1.2 }}>
          RadioAssist Pro
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Radiologie augmentée par IA</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={onHistoryClick}
        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative"
        aria-label="Voir l'historique"
      >
        <Clock size={24} />
        {historyCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {historyCount > 9 ? '9+' : historyCount}
          </span>
        )}
      </button>
      <button
        onClick={onSettingsClick}
        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Ouvrir les paramètres"
      >
        <Settings size={24} />
      </button>
    </div>
  </header>
);

export default Header;

