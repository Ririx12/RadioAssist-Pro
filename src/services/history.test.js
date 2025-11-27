// RadioAssist Pro - History Service Tests

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {

  getHistory,

  saveToHistory,

  getHistoryItem,

  deleteHistoryItem,

  clearHistory,

  formatHistoryTimestamp

} from './history';



// Mock localStorage

const localStorageMock = (() => {

  let store = {};

  return {

    getItem: (key) => store[key] || null,

    setItem: (key, value) => { store[key] = value.toString(); },

    removeItem: (key) => { delete store[key]; },

    clear: () => { store = {}; }

  };

})();



global.localStorage = localStorageMock;



describe('History Service', () => {

  beforeEach(() => {

    localStorage.clear();

  });



  afterEach(() => {

    localStorage.clear();

  });



  describe('getHistory', () => {

    it('should return empty array when no history exists', () => {

      const history = getHistory();

      expect(history).toEqual([]);

    });



    it('should return stored history', () => {

      const mockHistory = [

        { id: '1', input: 'test', output: 'result', timestamp: new Date().toISOString() }

      ];

      localStorage.setItem('radioassist_history', JSON.stringify(mockHistory));



      const history = getHistory();

      expect(history).toEqual(mockHistory);

    });



    it('should handle corrupted localStorage gracefully', () => {

      localStorage.setItem('radioassist_history', 'invalid json');

      const history = getHistory();

      expect(history).toEqual([]);

    });

  });



  describe('saveToHistory', () => {

    it('should save new item to history', () => {

      const item = saveToHistory('test input', 'test output', null);



      expect(item).toBeDefined();

      expect(item.input).toBe('test input');

      expect(item.output).toBe('test output');

      expect(item.protocol).toBeNull();

      expect(item.id).toBeDefined();

      expect(item.timestamp).toBeDefined();



      const history = getHistory();

      expect(history.length).toBe(1);

      expect(history[0]).toEqual(item);

    });



    it('should save item with protocol', () => {

      const protocol = { regions: { crane: true }, phases: { natif: true } };

      const item = saveToHistory('test', 'result', protocol);



      expect(item.protocol).toEqual(protocol);

    });



    it('should trim whitespace from input and output', () => {

      const item = saveToHistory('  test input  ', '  test output  ');



      expect(item.input).toBe('test input');

      expect(item.output).toBe('test output');

    });



    it('should add new items to beginning of history', () => {

      saveToHistory('first', 'first result');

      saveToHistory('second', 'second result');



      const history = getHistory();

      expect(history[0].input).toBe('second');

      expect(history[1].input).toBe('first');

    });



    it('should limit history to 10 items', () => {

      // Add 12 items

      for (let i = 0; i < 12; i++) {

        saveToHistory(`input ${i}`, `output ${i}`);

      }



      const history = getHistory();

      expect(history.length).toBe(10);

      expect(history[0].input).toBe('input 11'); // Newest

      expect(history[9].input).toBe('input 2');  // 10th newest

    });



    it('should generate unique IDs', async () => {

      const item1 = saveToHistory('test1', 'result1');

      // Add small delay to ensure different timestamps

      await new Promise(resolve => setTimeout(resolve, 10));

      const item2 = saveToHistory('test2', 'result2');



      expect(item1.id).not.toBe(item2.id);

    });

  });



  describe('getHistoryItem', () => {

    it('should return null for non-existent ID', () => {

      const item = getHistoryItem('nonexistent');

      expect(item).toBeNull();

    });



    it('should return specific history item by ID', () => {

      const saved = saveToHistory('test', 'result');

      const retrieved = getHistoryItem(saved.id);



      expect(retrieved).toEqual(saved);

    });

  });



  describe('deleteHistoryItem', () => {

    it('should delete specific item from history', async () => {

      const item1 = saveToHistory('test1', 'result1');

      // Add small delay to ensure different timestamps

      await new Promise(resolve => setTimeout(resolve, 10));

      const item2 = saveToHistory('test2', 'result2');



      const success = deleteHistoryItem(item1.id);

      expect(success).toBe(true);



      const history = getHistory();

      expect(history.length).toBe(1);

      expect(history[0].id).toBe(item2.id);

    });



    it('should return true even if item does not exist', () => {

      const success = deleteHistoryItem('nonexistent');

      expect(success).toBe(true);

    });

  });



  describe('clearHistory', () => {

    it('should remove all history', () => {

      saveToHistory('test1', 'result1');

      saveToHistory('test2', 'result2');



      const success = clearHistory();

      expect(success).toBe(true);



      const history = getHistory();

      expect(history).toEqual([]);

    });

  });



  describe('formatHistoryTimestamp', () => {

    it('should format very recent timestamp as " l\'instant"', () => {

      const now = new Date().toISOString();

      const formatted = formatHistoryTimestamp(now);

      expect(formatted).toBe(" l'instant");

    });



    it('should format minutes ago', () => {

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      const formatted = formatHistoryTimestamp(fiveMinutesAgo);

      expect(formatted).toContain('min');

    });



    it('should format hours ago', () => {

      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

      const formatted = formatHistoryTimestamp(twoHoursAgo);

      expect(formatted).toContain('h');

    });



    it('should format days ago', () => {

      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

      const formatted = formatHistoryTimestamp(threeDaysAgo);

      expect(formatted).toContain('j');

    });



    it('should format older dates with date string', () => {

      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

      const formatted = formatHistoryTimestamp(tenDaysAgo);

      // Should return a date format, not relative time

      expect(formatted).not.toContain('j');

    });



    it('should handle invalid timestamp gracefully', () => {

      const formatted = formatHistoryTimestamp('invalid');

      expect(formatted).toBe('invalid');

    });

  });



  describe('Integration scenarios', () => {

    it('should handle complete workflow', async () => {

      // Save multiple items

      const item1 = saveToHistory('indication 1', 'reformulation 1', { regions: { crane: true } });

      await new Promise(resolve => setTimeout(resolve, 10));

      const item2 = saveToHistory('indication 2', 'reformulation 2', null);

      await new Promise(resolve => setTimeout(resolve, 10));

      const item3 = saveToHistory('indication 3', 'reformulation 3', { regions: { thorax: true } });



      // Verify all saved

      let history = getHistory();

      expect(history.length).toBe(3);



      // Get specific item

      const retrieved = getHistoryItem(item2.id);

      expect(retrieved.input).toBe('indication 2');



      // Delete one

      deleteHistoryItem(item2.id);

      history = getHistory();

      expect(history.length).toBe(2);



      // Clear all

      clearHistory();

      history = getHistory();

      expect(history.length).toBe(0);

    });



    it('should maintain history across multiple saves and deletes', async () => {

      // Add 5 items

      const items = [];

      for (let i = 0; i < 5; i++) {

        items.push(saveToHistory(`input ${i}`, `output ${i}`));

        // Add small delay to ensure unique IDs

        await new Promise(resolve => setTimeout(resolve, 10));

      }



      // Delete 2nd and 4th items

      deleteHistoryItem(items[1].id);

      deleteHistoryItem(items[3].id);



      const history = getHistory();

      expect(history.length).toBe(3);

      expect(history.find(h => h.id === items[0].id)).toBeDefined();

      expect(history.find(h => h.id === items[2].id)).toBeDefined();

      expect(history.find(h => h.id === items[4].id)).toBeDefined();

    });

  });

});

