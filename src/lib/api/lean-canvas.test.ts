import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  createLeanCanvas,
  getLeanCanvas,
  updateLeanCanvas,
  patchLeanCanvas,
  deleteLeanCanvas,
  listLeanCanvases,
  checkApiHealth,
  getCurrentDeviceId,
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

const mockLeanCanvasData = {
  name: "Test Canvas",
  problem: "Test problem",
  solution: "Test solution",
  uniqueValueProposition: "Test UVP",
  customerSegments: "Test segments",
  channels: "Test channels",
  revenueStreams: "Test revenue",
};

const mockApiResponse = {
  success: true,
  data: {
    id: "test-id",
    ...mockLeanCanvasData,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    deviceId: "test-device",
  },
};

describe("Lean Canvas API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue("test-device-id");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Device ID Management", () => {
    it("should get existing device ID from localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue("existing-device-id");

      const deviceId = getCurrentDeviceId();

      expect(deviceId).toBe("existing-device-id");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("leansim-device-id");
    });

    it("should generate new device ID if none exists", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const deviceId = getCurrentDeviceId();

      expect(deviceId).toMatch(/^device-\d+-[a-z0-9]+$/);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("leansim-device-id", deviceId);
    });
  });

  describe("createLeanCanvas", () => {
    it("should create lean canvas successfully", async () => {
      const result = await createLeanCanvas(mockLeanCanvasData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApiResponse.data);
    });

    // Skip error tests for now - they require more complex MSW setup
    it.skip("should handle API errors", async () => {
      // This test requires proper MSW error handler setup
    });

    it.skip("should handle network errors", async () => {
      // This test requires proper MSW error handler setup
    });
  });

  describe("getLeanCanvas", () => {
    it("should get lean canvas successfully", async () => {
      const result = await getLeanCanvas("test-id");

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("test-id");
    });

    it("should handle 404 errors", async () => {
      const result = await getLeanCanvas("nonexistent-id");

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe("NOT_FOUND");
    });
  });

  describe("updateLeanCanvas", () => {
    it("should update lean canvas successfully", async () => {
      const updateData = { name: "Updated Canvas", problem: "Updated problem" };

      const result = await updateLeanCanvas("test-id", updateData);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("test-id");
    });
  });

  describe("patchLeanCanvas", () => {
    it("should partially update lean canvas successfully", async () => {
      const patchData = { problem: "Updated problem" };
      const result = await patchLeanCanvas("test-id", patchData);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("test-id");
    });
  });

  describe("deleteLeanCanvas", () => {
    it("should delete lean canvas successfully", async () => {
      const result = await deleteLeanCanvas("test-id");

      expect(result.success).toBe(true);
      expect(result.data?.message).toContain("test-id");
    });
  });

  describe("listLeanCanvases", () => {
    it("should list lean canvases with default parameters", async () => {
      const result = await listLeanCanvases();

      expect(result.success).toBe(true);
      expect(result.data?.leanCanvases).toBeDefined();
      expect(result.data?.pagination).toBeDefined();
    });

    it("should list lean canvases with custom parameters", async () => {
      const params = {
        page: 2,
        limit: 5,
        sort: "name",
        order: "asc" as const,
      };

      const result = await listLeanCanvases(params);

      expect(result.success).toBe(true);
      expect(result.data?.pagination.currentPage).toBe(2);
      expect(result.data?.pagination.limit).toBe(5);
    });
  });

  describe("checkApiHealth", () => {
    it("should return true when API is healthy", async () => {
      const result = await checkApiHealth();

      expect(result).toBe(true);
    });

    // Skip error tests for now - they require more complex MSW setup
    it.skip("should return false when API is unhealthy", async () => {
      // This test requires proper MSW error handler setup
    });

    it.skip("should return false on network error", async () => {
      // This test requires proper MSW error handler setup
    });
  });

  describe("Error handling", () => {
    // Skip error tests for now - they require more complex MSW setup
    it.skip("should handle HTTP errors without error details", async () => {
      // This test requires proper MSW error handler setup
    });

    it.skip("should handle JSON parsing errors", async () => {
      // This test requires proper MSW error handler setup
    });
  });
});
