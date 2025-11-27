// RadioAssist Pro - History Service

// Manages reformulation history with localStorage persistence



const HISTORY_KEY = 'radioassist_history';

const MAX_HISTORY_ITEMS = 10;



/**

 * History item structure

 * @typedef {Object} HistoryItem

 * @property {string} id - Unique identifier (timestamp)

 * @property {string} input - Original indication input

 * @property {string} output - Reformulated indication

 * @property {Object|null} protocol - Suggested protocol object

 * @property {string} timestamp - ISO timestamp

 */



/**

 * Get all history items from localStorage

 * @returns {HistoryItem[]} Array of history items, newest first

 */

export const getHistory = () => {

  try {

    const stored = localStorage.getItem(HISTORY_KEY);

    if (!stored) return [];

    return JSON.parse(stored);

  } catch (error) {

    console.error('Error reading history:', error);

    return [];

  }

};



/**

 * Save a new reformulation to history

 * @param {string} input - Original indication input

 * @param {string} output - Reformulated indication

 * @param {Object|null} protocol - Suggested protocol object

 * @returns {HistoryItem} The saved history item

 */

export const saveToHistory = (input, output, protocol = null) => {

  try {

    const history = getHistory();



    const newItem = {

      id: Date.now().toString(),

      input: input.trim(),

      output: output.trim(),

      protocol,

      timestamp: new Date().toISOString()

    };



    // Add to beginning (newest first)

    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);



    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));



    return newItem;

  } catch (error) {

    console.error('Error saving to history:', error);

    return null;

  }

};



/**

 * Get a specific history item by ID

 * @param {string} id - History item ID

 * @returns {HistoryItem|null} History item or null if not found

 */

export const getHistoryItem = (id) => {

  const history = getHistory();

  return history.find(item => item.id === id) || null;

};



/**

 * Delete a specific history item

 * @param {string} id - History item ID to delete

 * @returns {boolean} True if deleted successfully

 */

export const deleteHistoryItem = (id) => {

  try {

    const history = getHistory();

    const filtered = history.filter(item => item.id !== id);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));

    return true;

  } catch (error) {

    console.error('Error deleting history item:', error);

    return false;

  }

};



/**

 * Clear all history

 * @returns {boolean} True if cleared successfully

 */

export const clearHistory = () => {

  try {

    localStorage.removeItem(HISTORY_KEY);

    return true;

  } catch (error) {

    console.error('Error clearing history:', error);

    return false;

  }

};



/**

 * Format timestamp for display

 * @param {string} isoTimestamp - ISO timestamp string

 * @returns {string} Formatted date/time string

 */

export const formatHistoryTimestamp = (isoTimestamp) => {

  try {

    const date = new Date(isoTimestamp);



    // Check if date is invalid

    if (isNaN(date.getTime())) {

      return isoTimestamp;

    }



    const now = new Date();

    const diffMs = now - date;

    const diffMins = Math.floor(diffMs / 60000);

    const diffHours = Math.floor(diffMs / 3600000);

    const diffDays = Math.floor(diffMs / 86400000);



    // Less than 1 hour ago

    if (diffMins < 60) {

      return diffMins === 0 ? " l'instant" : `Il y a ${diffMins} min`;

    }



    // Less than 24 hours ago

    if (diffHours < 24) {

      return `Il y a ${diffHours}h`;

    }



    // Less than 7 days ago

    if (diffDays < 7) {

      return `Il y a ${diffDays}j`;

    }



    // Older - show date

    return date.toLocaleDateString('fr-FR', {

      day: 'numeric',

      month: 'short',

      hour: '2-digit',

      minute: '2-digit'

    });

  } catch (error) {

    return isoTimestamp;

  }

};

