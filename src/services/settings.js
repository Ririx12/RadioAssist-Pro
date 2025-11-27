// RadioAssist Pro - Settings persistence

const SETTINGS_KEY = 'radioassist_settings';

export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

export const saveSettings = (partial) => {
  try {
    const current = loadSettings();
    const next = { ...current, ...partial };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {
    // fail silently to avoid blocking the app
  }
};
