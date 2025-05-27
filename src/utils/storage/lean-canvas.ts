import { LeanCanvasData, StoredLeanCanvas } from "@/types/lean-canvas";

const STORAGE_KEY = "leansim-lean-canvas-temp";
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Save lean canvas data temporarily to localStorage
 */
export function saveLeanCanvasTemporarily(id: string, data: LeanCanvasData): void {
  if (typeof window === "undefined") return;

  try {
    const storedData: StoredLeanCanvas = {
      id,
      data,
      timestamp: Date.now(),
      isTemporary: true,
    };

    localStorage.setItem(`${STORAGE_KEY}-${id}`, JSON.stringify(storedData));
  } catch (error) {
    console.warn("Failed to save lean canvas data to localStorage:", error);
  }
}

/**
 * Load lean canvas data from localStorage
 */
export function loadLeanCanvasFromStorage(id: string): LeanCanvasData | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${id}`);
    if (!stored) return null;

    const parsedData: StoredLeanCanvas = JSON.parse(stored);

    // Check if data has expired
    if (Date.now() - parsedData.timestamp > STORAGE_EXPIRY) {
      removeLeanCanvasFromStorage(id);
      return null;
    }

    return parsedData.data;
  } catch (error) {
    console.warn("Failed to load lean canvas data from localStorage:", error);
    return null;
  }
}

/**
 * Remove lean canvas data from localStorage
 */
export function removeLeanCanvasFromStorage(id: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(`${STORAGE_KEY}-${id}`);
  } catch (error) {
    console.warn("Failed to remove lean canvas data from localStorage:", error);
  }
}

/**
 * Clear all temporary lean canvas data
 */
export function clearAllTemporaryLeanCanvas(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_KEY)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear temporary lean canvas data:", error);
  }
}

/**
 * Get all temporary lean canvas data
 */
export function getAllTemporaryLeanCanvas(): StoredLeanCanvas[] {
  if (typeof window === "undefined") return [];

  try {
    const keys = Object.keys(localStorage);
    const tempData: StoredLeanCanvas[] = [];

    keys.forEach((key) => {
      if (key.startsWith(STORAGE_KEY)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsedData: StoredLeanCanvas = JSON.parse(stored);

          // Check if data has expired
          if (Date.now() - parsedData.timestamp <= STORAGE_EXPIRY) {
            tempData.push(parsedData);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    });

    return tempData;
  } catch (error) {
    console.warn("Failed to get temporary lean canvas data:", error);
    return [];
  }
}

/**
 * Check if there's temporary data for a specific lean canvas
 */
export function hasTemporaryLeanCanvas(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${id}`);
    if (!stored) return false;

    const parsedData: StoredLeanCanvas = JSON.parse(stored);

    // Check if data has expired
    if (Date.now() - parsedData.timestamp > STORAGE_EXPIRY) {
      removeLeanCanvasFromStorage(id);
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Failed to check temporary lean canvas data:", error);
    return false;
  }
}
