/**
 * Safely access browser storage (localStorage/sessionStorage) with fallbacks
 * for environments where storage access is restricted
 */

// In-memory fallback storage when browser storage is not available
const memoryStorage: Record<string, string> = {};

// Check if storage is available
const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const testKey = `__storage_test__${Math.random()}`;
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Safe localStorage functions
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('localStorage')) {
        return localStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    } catch (e) {
      console.warn('Error accessing localStorage:', e);
      return memoryStorage[key] || null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('localStorage')) {
        localStorage.setItem(key, value);
      }
      memoryStorage[key] = value;
    } catch (e) {
      console.warn('Error setting localStorage:', e);
      memoryStorage[key] = value;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('localStorage')) {
        localStorage.removeItem(key);
      }
      delete memoryStorage[key];
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
      delete memoryStorage[key];
    }
  },
  
  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('localStorage')) {
        localStorage.clear();
      }
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    }
  }
};

// Safe sessionStorage functions
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('sessionStorage')) {
        return sessionStorage.getItem(key);
      }
      return memoryStorage[`session_${key}`] || null;
    } catch (e) {
      console.warn('Error accessing sessionStorage:', e);
      return memoryStorage[`session_${key}`] || null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('sessionStorage')) {
        sessionStorage.setItem(key, value);
      }
      memoryStorage[`session_${key}`] = value;
    } catch (e) {
      console.warn('Error setting sessionStorage:', e);
      memoryStorage[`session_${key}`] = value;
    }
  },
  
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('sessionStorage')) {
        sessionStorage.removeItem(key);
      }
      delete memoryStorage[`session_${key}`];
    } catch (e) {
      console.warn('Error removing from sessionStorage:', e);
      delete memoryStorage[`session_${key}`];
    }
  },
  
  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && isStorageAvailable('sessionStorage')) {
        sessionStorage.clear();
      }
      Object.keys(memoryStorage)
        .filter(key => key.startsWith('session_'))
        .forEach(key => delete memoryStorage[key]);
    } catch (e) {
      console.warn('Error clearing sessionStorage:', e);
      Object.keys(memoryStorage)
        .filter(key => key.startsWith('session_'))
        .forEach(key => delete memoryStorage[key]);
    }
  }
}; 