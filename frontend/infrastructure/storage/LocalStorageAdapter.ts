/**
 * LocalStorage Adapter
 * Infrastructure implementation of StoragePort
 */

import type { StoragePort } from "@/domain/ports/StoragePort";

export class LocalStorageAdapter implements StoragePort {
  getItem(key: string): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail if storage is unavailable
    }
  }

  removeItem(key: string): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail if storage is unavailable
    }
  }
}
