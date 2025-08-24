// Simplified Encryption Utility for React Native
// Using base64 encoding and simple XOR encryption for development

import { STORAGE_KEYS } from '../constants';

// Simple encryption key (for development - should be replaced with proper encryption in production)
const DEFAULT_ENCRYPTION_KEY = 'recovery-milestone-tracker-dev-key-2024';

// Simple base64 implementation for React Native
const base64Encode = (str: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < str.length) {
    const char1 = str.charCodeAt(i++);
    const char2 = str.charCodeAt(i++) || 0;
    const char3 = str.charCodeAt(i++) || 0;
    
    const enc1 = char1 >> 2;
    const enc2 = ((char1 & 3) << 4) | (char2 >> 4);
    const enc3 = ((char2 & 15) << 2) | (char3 >> 6);
    const enc4 = char3 & 63;
    
    result += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
  }
  return result;
};

const base64Decode = (str: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  while (i < str.length) {
    const enc1 = chars.indexOf(str.charAt(i++));
    const enc2 = chars.indexOf(str.charAt(i++));
    const enc3 = chars.indexOf(str.charAt(i++));
    const enc4 = chars.indexOf(str.charAt(i++));
    
    const char1 = (enc1 << 2) | (enc2 >> 4);
    const char2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const char3 = ((enc3 & 3) << 6) | enc4;
    
    result += String.fromCharCode(char1);
    if (enc3 !== 64) result += String.fromCharCode(char2);
    if (enc4 !== 64) result += String.fromCharCode(char3);
  }
  return result;
};

class EncryptionService {
  private encryptionKey: string = DEFAULT_ENCRYPTION_KEY;

  /**
   * Initialize encryption service
   */
  async initialize(): Promise<void> {
    try {
      // For now, just use the default key
      // TODO: Implement proper key management in production
      this.encryptionKey = DEFAULT_ENCRYPTION_KEY;
    } catch (error) {
      console.error('Encryption initialization error:', error);
      // Fall back to default key
      this.encryptionKey = DEFAULT_ENCRYPTION_KEY;
    }
  }

  /**
   * Simple XOR encryption (for development only)
   */
  private simpleXOREncrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return base64Encode(result); // Base64 encode
  }

  /**
   * Simple XOR decryption (for development only)
   */
  private simpleXORDecrypt(encryptedText: string, key: string): string {
    try {
      const decoded = base64Decode(encryptedText); // Base64 decode
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }

  /**
   * Encrypt data (simplified for development)
   */
  encrypt(data: string): string {
    try {
      if (!data) return '';
      
      // Use simple XOR encryption for development
      return this.simpleXOREncrypt(data, this.encryptionKey);
    } catch (error) {
      console.error('Encryption error:', error);
      // Fallback to base64 encoding only
      return base64Encode(data);
    }
  }

  /**
   * Decrypt data (simplified for development)
   */
  decrypt(encryptedData: string): string {
    try {
      if (!encryptedData) return '';
      
      // Try to decrypt with XOR first
      const decrypted = this.simpleXORDecrypt(encryptedData, this.encryptionKey);
      if (decrypted) {
        return decrypted;
      }
      
      // Fallback to base64 decoding only
      return base64Decode(encryptedData);
    } catch (error) {
      console.error('Decryption error:', error);
      // Return empty string if decryption fails
      return '';
    }
  }

  /**
   * Encrypt object
   */
  encryptObject<T>(obj: T): string {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      console.error('Object encryption error:', error);
      // Fallback to base64 encoding only
      return base64Encode(JSON.stringify(obj));
    }
  }

  /**
   * Decrypt object
   */
  decryptObject<T>(encryptedData: string): T | null {
    try {
      const decrypted = this.decrypt(encryptedData);
      if (!decrypted) return null;
      
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Object decryption error:', error);
      return null;
    }
  }

  /**
   * Generate a simple encryption key
   */
  generateEncryptionKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Hash data (simple hash for development)
   */
  hash(data: string): string {
    try {
      if (!data) return '';
      
      // Simple hash function for development
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36);
    } catch (error) {
      console.error('Hash error:', error);
      return '';
    }
  }

  /**
   * Verify hash
   */
  verifyHash(data: string, hash: string): boolean {
    try {
      const calculatedHash = this.hash(data);
      return calculatedHash === hash;
    } catch (error) {
      console.error('Hash verification error:', error);
      return false;
    }
  }
}

// Create and export singleton instance
export const encryptionService = new EncryptionService();

// Export individual functions for backward compatibility
export const encrypt = (data: string): string => encryptionService.encrypt(data);
export const decrypt = (data: string): string => encryptionService.decrypt(data);
export const encryptObject = <T>(obj: T): string => encryptionService.encryptObject(obj);
export const decryptObject = <T>(data: string): T | null => encryptionService.decryptObject(data);
export const hash = (data: string): string => encryptionService.hash(data);
export const verifyHash = (data: string, hash: string): boolean => encryptionService.verifyHash(data, hash);


