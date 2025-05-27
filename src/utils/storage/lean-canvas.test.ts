import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  saveLeanCanvasTemporarily,
  loadLeanCanvasFromStorage,
  removeLeanCanvasFromStorage,
  clearAllTemporaryLeanCanvas,
  getAllTemporaryLeanCanvas,
  hasTemporaryLeanCanvas,
} from "./lean-canvas";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Store original Object.keys
const originalObjectKeys = Object.keys;

const mockLeanCanvasData = {
  problem: "Test problem",
  solution: "Test solution",
  uniqueValueProposition: "Test UVP",
  customerSegments: "Test segments",
  channels: "Test channels",
  revenueStreams: "Test revenue",
};

const FIXED_TIMESTAMP = 1640995200000; // 2022-01-01T00:00:00Z

const mockStoredData = {
  id: "test-id",
  data: mockLeanCanvasData,
  timestamp: FIXED_TIMESTAMP,
  isTemporary: true,
};

describe("Lean Canvas Storage Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FIXED_TIMESTAMP));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    // Restore original Object.keys
    Object.keys = originalObjectKeys;
  });

  describe("Basic storage operations", () => {
    it("should save data to localStorage", () => {
      saveLeanCanvasTemporarily("test-id", mockLeanCanvasData);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "leansim-lean-canvas-temp-test-id",
        JSON.stringify({
          id: "test-id",
          data: mockLeanCanvasData,
          timestamp: FIXED_TIMESTAMP,
          isTemporary: true,
        })
      );
    });

    it("should load valid data from localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockStoredData));

      const result = loadLeanCanvasFromStorage("test-id");

      expect(result).toEqual(mockLeanCanvasData);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("leansim-lean-canvas-temp-test-id");
    });

    it("should return null when no data exists", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = loadLeanCanvasFromStorage("test-id");

      expect(result).toBeNull();
    });

    it("should remove data from localStorage", () => {
      removeLeanCanvasFromStorage("test-id");

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("leansim-lean-canvas-temp-test-id");
    });

    it("should return true when valid data exists", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockStoredData));

      const result = hasTemporaryLeanCanvas("test-id");

      expect(result).toBe(true);
    });

    it("should return false when no data exists", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = hasTemporaryLeanCanvas("test-id");

      expect(result).toBe(false);
    });
  });

  describe("Expiration handling", () => {
    it("should remove expired data and return null", () => {
      const expiredData = {
        ...mockStoredData,
        timestamp: FIXED_TIMESTAMP - 25 * 60 * 60 * 1000, // 25 hours ago
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredData));

      const result = loadLeanCanvasFromStorage("test-id");

      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("leansim-lean-canvas-temp-test-id");
    });

    it("should return false and remove expired data", () => {
      const expiredData = {
        ...mockStoredData,
        timestamp: FIXED_TIMESTAMP - 25 * 60 * 60 * 1000, // 25 hours ago
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(expiredData));

      const result = hasTemporaryLeanCanvas("test-id");

      expect(result).toBe(false);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("leansim-lean-canvas-temp-test-id");
    });
  });

  describe("Error handling", () => {
    it("should handle localStorage save errors gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      expect(() => {
        saveLeanCanvasTemporarily("test-id", mockLeanCanvasData);
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save lean canvas data to localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it("should handle JSON parsing errors gracefully", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      mockLocalStorage.getItem.mockReturnValue("invalid json");

      const result = loadLeanCanvasFromStorage("test-id");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load lean canvas data from localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Bulk operations", () => {
    it("should clear all temporary lean canvas data", () => {
      const mockKeys = [
        "leansim-lean-canvas-temp-id1",
        "leansim-lean-canvas-temp-id2",
        "other-key",
        "leansim-lean-canvas-temp-id3",
      ];

      // Mock Object.keys for this test only
      Object.keys = vi.fn().mockReturnValue(mockKeys);

      clearAllTemporaryLeanCanvas();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("leansim-lean-canvas-temp-id1");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("leansim-lean-canvas-temp-id2");
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("leansim-lean-canvas-temp-id3");
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalledWith("other-key");
    });

    it("should return all valid temporary data", () => {
      const mockKeys = [
        "leansim-lean-canvas-temp-id1",
        "leansim-lean-canvas-temp-id2",
        "other-key",
      ];

      const validData1 = { ...mockStoredData, id: "id1" };
      const validData2 = { ...mockStoredData, id: "id2" };

      // Mock Object.keys for this test only
      Object.keys = vi.fn().mockReturnValue(mockKeys);
      mockLocalStorage.getItem
        .mockReturnValueOnce(JSON.stringify(validData1))
        .mockReturnValueOnce(JSON.stringify(validData2));

      const result = getAllTemporaryLeanCanvas();

      expect(result).toEqual([validData1, validData2]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(2);
    });
  });
});
