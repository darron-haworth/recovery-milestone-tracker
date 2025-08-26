// Secure Storage Service
import Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt, decrypt } from '../utils/encryption';

class StorageService {
  /**
   * Secure storage for sensitive data using Keychain
   */
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await Keychain.setInternetCredentials(key, key, value);
    } catch (error) {
      console.error('Secure storage set error:', error);
      throw new Error('Failed to store data securely');
    }
  }

  async getSecureItem(key: string): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(key);
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  }

  async removeSecureItem(key: string): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(key);
    } catch (error) {
      console.error('Secure storage remove error:', error);
      throw new Error('Failed to remove secure data');
    }
  }

  /**
   * Encrypted storage for sensitive data that needs to be encrypted
   */
  async setEncryptedItem(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = encrypt(value);
      await AsyncStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Encrypted storage set error:', error);
      throw new Error('Failed to store encrypted data');
    }
  }

  async getEncryptedItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = await AsyncStorage.getItem(key);
      if (!encryptedValue) return null;
      
      return decrypt(encryptedValue);
    } catch (error) {
      console.error('Encrypted storage get error:', error);
      return null;
    }
  }

  async removeEncryptedItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Encrypted storage remove error:', error);
      throw new Error('Failed to remove encrypted data');
    }
  }

  /**
   * Regular storage for non-sensitive data
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage set error:', error);
      throw new Error('Failed to store data');
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
      throw new Error('Failed to remove data');
    }
  }

  /**
   * Object storage with JSON serialization
   */
  async setObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Object storage set error:', error);
      throw new Error('Failed to store object');
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Object storage get error:', error);
      return null;
    }
  }

  /**
   * Encrypted object storage
   */
  async setEncryptedObject(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      const encryptedValue = encrypt(jsonValue);
      await AsyncStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Encrypted object storage set error:', error);
      throw new Error('Failed to store encrypted object');
    }
  }

  async getEncryptedObject<T>(key: string): Promise<T | null> {
    try {
      const encryptedValue = await AsyncStorage.getItem(key);
      if (!encryptedValue) return null;
      
      const decryptedValue = decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Encrypted object storage get error:', error);
      return null;
    }
  }

  /**
   * Clear all storage
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
      // Note: Keychain items need to be cleared individually
      console.log('Storage cleared successfully');
    } catch (error) {
      console.error('Storage clear error:', error);
      throw new Error('Failed to clear storage');
    }
  }

  /**
   * Get all storage keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys]; // Convert readonly array to mutable array
    } catch (error) {
      console.error('Get all keys error:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   */
  async hasKey(key: string): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('Check key exists error:', error);
      return false;
    }
  }

  /**
   * Get storage size (approximate)
   */
  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Get storage size error:', error);
      return 0;
    }
  }

  /**
   * Migrate data from old storage format
   */
  async migrateStorage(oldKey: string, newKey: string): Promise<boolean> {
    try {
      const oldValue = await AsyncStorage.getItem(oldKey);
      if (oldValue) {
        await AsyncStorage.setItem(newKey, oldValue);
        await AsyncStorage.removeItem(oldKey);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Storage migration error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export secure storage for backward compatibility
export const secureStorage = {
  setItem: (key: string, value: string) => storageService.setSecureItem(key, value),
  getItem: (key: string) => storageService.getSecureItem(key),
  removeItem: (key: string) => storageService.removeSecureItem(key)
};

export default storageService;
