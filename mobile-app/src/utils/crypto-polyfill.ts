// Crypto polyfill for React Native
// This prevents the "core.js Native crypto module could not be used" error

// Declare global type for React Native
declare const global: any;

// Polyfill crypto.getRandomValues if it doesn't exist
if (typeof global !== 'undefined' && !global.crypto) {
  global.crypto = {} as any;
}

if (typeof global !== 'undefined' && global.crypto && !global.crypto.getRandomValues) {
  global.crypto.getRandomValues = function(array: any) {
    // Simple fallback random implementation
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}

// Polyfill crypto.randomUUID if it doesn't exist
if (typeof global !== 'undefined' && global.crypto && !global.crypto.randomUUID) {
  global.crypto.randomUUID = function() {
    // Simple UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Export to ensure this file is loaded
export const cryptoPolyfill = {
  initialized: true
};
