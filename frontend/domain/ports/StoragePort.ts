/**
 * Storage port interface
 * Abstraction for storage operations (localStorage, etc.)
 */

export interface StoragePort {
  /**
   * Get a value from storage
   */
  getItem(key: string): string | null;

  /**
   * Set a value in storage
   */
  setItem(key: string, value: string): void;

  /**
   * Remove a value from storage
   */
  removeItem(key: string): void;
}
