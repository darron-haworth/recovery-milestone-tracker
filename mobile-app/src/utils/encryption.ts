// Encryption Utility
import CryptoJS from 'crypto-js';
import { STORAGE_KEYS } from '../../shared/constants';
import { storageService } from '../services/storage';

// Default encryption key (should be replaced with device-specific key)
const DEFAULT_ENCRYPTION_KEY = 'recovery-milestone-tracker-default-key-2024';

class EncryptionService {
  private encryptionKey: string = DEFAULT_ENCRYPTION_KEY;

  /**
   * Initialize encryption service
   */
  async initialize(): Promise<void> {
    try {
      // Try to get stored encryption key
      const storedKey = await storageService.getSecureItem(STORAGE_KEYS.ENCRYPTION_KEY);
      
      if (storedKey) {
        this.encryptionKey = storedKey;
      } else {
        // Generate new encryption key
        const newKey = this.generateEncryptionKey();
        await storageService.setSecureItem(STORAGE_KEYS.ENCRYPTION_KEY, newKey);
        this.encryptionKey = newKey;
      }
    } catch (error) {
      console.error('Encryption initialization error:', error);
      // Fall back to default key
      this.encryptionKey = DEFAULT_ENCRYPTION_KEY;
    }
  }

  /**
   * Generate a new encryption key
   */
  private generateEncryptionKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Encrypt data
   */
  encrypt(data: string): string {
    try {
      if (!data) return '';
      
      const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey);
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data
   */
  decrypt(encryptedData: string): string {
    try {
      if (!encryptedData) return '';
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!result) {
        throw new Error('Decryption failed - invalid data or key');
      }
      
      return result;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
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
      throw new Error('Failed to encrypt object');
    }
  }

  /**
   * Decrypt object
   */
  decryptObject<T>(encryptedData: string): T {
    try {
      const decryptedString = this.decrypt(encryptedData);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Object decryption error:', error);
      throw new Error('Failed to decrypt object');
    }
  }

  /**
   * Hash data (one-way encryption)
   */
  hash(data: string): string {
    try {
      return CryptoJS.SHA256(data).toString();
    } catch (error) {
      console.error('Hashing error:', error);
      throw new Error('Failed to hash data');
    }
  }

  /**
   * Generate secure random string
   */
  generateSecureRandom(length: number = 32): string {
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const randomValues = new Uint8Array(length);
      crypto.getRandomValues(randomValues);
      
      for (let i = 0; i < length; i++) {
        result += chars.charAt(randomValues[i] % chars.length);
      }
      
      return result;
    } catch (error) {
      console.error('Secure random generation error:', error);
      // Fallback to Math.random
      return this.generateFallbackRandom(length);
    }
  }

  /**
   * Fallback random generation
   */
  private generateFallbackRandom(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Verify encryption key integrity
   */
  async verifyEncryptionKey(): Promise<boolean> {
    try {
      const testData = 'test-encryption-data';
      const encrypted = this.encrypt(testData);
      const decrypted = this.decrypt(encrypted);
      
      return testData === decrypted;
    } catch (error) {
      console.error('Encryption key verification failed:', error);
      return false;
    }
  }

  /**
   * Rotate encryption key
   */
  async rotateEncryptionKey(): Promise<void> {
    try {
      const newKey = this.generateEncryptionKey();
      
      // Store new key
      await storageService.setSecureItem(STORAGE_KEYS.ENCRYPTION_KEY, newKey);
      
      // Update current key
      this.encryptionKey = newKey;
      
      console.log('Encryption key rotated successfully');
    } catch (error) {
      console.error('Encryption key rotation error:', error);
      throw new Error('Failed to rotate encryption key');
    }
  }

  /**
   * Get encryption key hash (for verification)
   */
  getEncryptionKeyHash(): string {
    return this.hash(this.encryptionKey);
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();

// Initialize encryption service
encryptionService.initialize().catch(console.error);

// Export convenience functions
export const encrypt = (data: string): string => encryptionService.encrypt(data);
export const decrypt = (data: string): string => encryptionService.decrypt(data);
export const encryptObject = <T>(obj: T): string => encryptionService.encryptObject(obj);
export const decryptObject = <T>(data: string): T => encryptionService.decryptObject(data);
export const hash = (data: string): string => encryptionService.hash(data);

export default encryptionService;
