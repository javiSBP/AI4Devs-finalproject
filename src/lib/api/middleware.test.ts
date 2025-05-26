import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import {
  applyMiddleware,
  getSecurityHeaders,
  validateDeviceId,
  checkRateLimit,
  cleanupRateLimit,
} from "./middleware";

describe("API Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset time for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getSecurityHeaders", () => {
    it("should return all required security headers", () => {
      const headers = getSecurityHeaders();

      expect(headers).toHaveProperty("Content-Security-Policy");
      expect(headers).toHaveProperty("X-Frame-Options");
      expect(headers).toHaveProperty("X-Content-Type-Options");
      expect(headers).toHaveProperty("Referrer-Policy");
      expect(headers).toHaveProperty("X-XSS-Protection");
    });

    it("should have correct CSP directive", () => {
      const headers = getSecurityHeaders();

      expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
      expect(headers["Content-Security-Policy"]).toContain("script-src 'self' 'unsafe-inline'");
      expect(headers["Content-Security-Policy"]).toContain("style-src 'self' 'unsafe-inline'");
    });

    it("should have correct frame options", () => {
      const headers = getSecurityHeaders();

      expect(headers["X-Frame-Options"]).toBe("DENY");
    });

    it("should have correct content type options", () => {
      const headers = getSecurityHeaders();

      expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    });

    it("should have correct XSS protection", () => {
      const headers = getSecurityHeaders();

      expect(headers["X-XSS-Protection"]).toBe("1; mode=block");
    });

    it("should have correct referrer policy", () => {
      const headers = getSecurityHeaders();

      expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    });
  });

  describe("validateDeviceId", () => {
    it("should return error when device ID is missing", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
      });

      const result = validateDeviceId(request);

      expect(result.error).toBeTruthy();
      expect(result.deviceId).toBeNull();
    });

    it("should return device ID when valid", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "valid-device-123",
        },
      });

      const result = validateDeviceId(request);

      expect(result.error).toBeNull();
      expect(result.deviceId).toBe("valid-device-123");
    });

    it("should return error for invalid device ID format", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "invalid@device!#$%", // Contains invalid characters
        },
      });

      const result = validateDeviceId(request);

      expect(result.error).toBeTruthy();
      expect(result.deviceId).toBeNull();
    });

    it("should accept common browser device ID formats", () => {
      const validDeviceIds = [
        "550e8400-e29b-41d4-a716-446655440000", // UUID
        "YWJjZGVmZ2hpams=", // Base64
        "fp_1234567890abcdef", // Fingerprint
        "user_123.device_456", // Custom with dots
        "device+123/456", // With plus and slash
      ];

      validDeviceIds.forEach((deviceId) => {
        const request = new NextRequest("http://localhost:3000/api/test", {
          method: "GET",
          headers: {
            "X-Device-ID": deviceId,
          },
        });

        const result = validateDeviceId(request);
        expect(result.error).toBeNull();
        expect(result.deviceId).toBe(deviceId);
      });
    });

    it("should return error for empty device ID", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "",
        },
      });

      const result = validateDeviceId(request);

      expect(result.error).toBeTruthy();
      expect(result.deviceId).toBeNull();
    });
  });

  describe("checkRateLimit", () => {
    it("should allow first request from new IP", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.1",
        },
      });

      const result = checkRateLimit(request);

      expect(result.error).toBeNull();
      expect(result.remaining).toBe(99); // 100 - 1
    });

    it("should track multiple requests from same IP", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.2",
        },
      });

      // First request
      let result = checkRateLimit(request);
      expect(result.error).toBeNull();
      expect(result.remaining).toBe(99);

      // Second request
      result = checkRateLimit(request);
      expect(result.error).toBeNull();
      expect(result.remaining).toBe(98);

      // Third request
      result = checkRateLimit(request);
      expect(result.error).toBeNull();
      expect(result.remaining).toBe(97);
    });

    it("should use x-real-ip header when x-forwarded-for is not available", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-real-ip": "192.168.1.3",
        },
      });

      const result = checkRateLimit(request);

      expect(result.error).toBeNull();
      expect(result.remaining).toBe(99);
    });

    it("should use 'unknown' when no IP headers are available", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
      });

      const result = checkRateLimit(request);

      expect(result.error).toBeNull();
      expect(result.remaining).toBe(99);
    });

    it("should block requests when rate limit is exceeded", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.4",
        },
      });

      // Make 100 requests to hit the limit
      for (let i = 0; i < 100; i++) {
        const result = checkRateLimit(request);
        expect(result.error).toBeNull();
      }

      // 101st request should be blocked
      const result = checkRateLimit(request);
      expect(result.error).toBeTruthy();
      expect(result.remaining).toBe(0);
    });

    it("should reset rate limit after time window", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.5",
        },
      });

      // Make 100 requests to hit the limit
      for (let i = 0; i < 100; i++) {
        checkRateLimit(request);
      }

      // Verify we're at the limit
      let result = checkRateLimit(request);
      expect(result.error).toBeTruthy();

      // Advance time by more than the rate limit window (1 minute)
      vi.advanceTimersByTime(61 * 1000);

      // Should be allowed again
      result = checkRateLimit(request);
      expect(result.error).toBeNull();
      expect(result.remaining).toBe(99);
    });

    it("should prefer x-forwarded-for over x-real-ip", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.6",
          "x-real-ip": "192.168.1.7",
        },
      });

      // Make a request with the first IP
      checkRateLimit(request);

      // Create a new request with only x-real-ip (same as before)
      const request2 = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-real-ip": "192.168.1.7",
        },
      });

      // Should be treated as a different IP (count should be 1, not 2)
      const result = checkRateLimit(request2);
      expect(result.remaining).toBe(99);
    });
  });

  describe("cleanupRateLimit", () => {
    it("should remove expired rate limit entries", () => {
      const request1 = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.8",
        },
      });

      const request2 = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.9",
        },
      });

      // Make requests to create entries
      checkRateLimit(request1);
      checkRateLimit(request2);

      // Advance time to expire the first entry
      vi.advanceTimersByTime(61 * 1000);

      // Make another request with request1 to create a new entry
      checkRateLimit(request1);

      // Now advance time again to expire request2 but not request1
      vi.advanceTimersByTime(30 * 1000);

      // Run cleanup
      cleanupRateLimit();

      // request1 should still have its rate limit tracked (remaining should be 98)
      const result1 = checkRateLimit(request1);
      expect(result1.remaining).toBe(98);

      // request2 should be reset (remaining should be 99)
      const result2 = checkRateLimit(request2);
      expect(result2.remaining).toBe(99);
    });

    it("should not affect non-expired entries", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "x-forwarded-for": "192.168.1.10",
        },
      });

      // Make a request
      checkRateLimit(request);

      // Run cleanup immediately (entry should not be expired)
      cleanupRateLimit();

      // Entry should still exist (remaining should be 98, not 99)
      const result = checkRateLimit(request);
      expect(result.remaining).toBe(98);
    });
  });

  describe("applyMiddleware", () => {
    it("should return error when device ID is missing", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
      });

      const result = applyMiddleware(request);

      expect(result.error).toBeTruthy();
      expect(result.deviceId).toBeNull();
    });

    it("should return device ID when valid", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "valid-device-123",
        },
      });

      const result = applyMiddleware(request);

      expect(result.error).toBeNull();
      expect(result.deviceId).toBe("valid-device-123");
    });

    it("should return error for invalid device ID", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "invalid@device!#$%", // Contains invalid characters
        },
      });

      const result = applyMiddleware(request);

      expect(result.error).toBeTruthy();
      expect(result.deviceId).toBeNull();
    });

    it("should return error when rate limit is exceeded", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "valid-device-123",
          "x-forwarded-for": "192.168.1.11",
        },
      });

      // Make 100 requests to hit the rate limit
      for (let i = 0; i < 100; i++) {
        applyMiddleware(request);
      }

      // 101st request should be blocked due to rate limit
      const result = applyMiddleware(request);
      expect(result.error).toBeTruthy();
      expect(result.deviceId).toBeNull();
    });

    it("should check rate limit before device ID validation", () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "invalid", // Invalid device ID
          "x-forwarded-for": "192.168.1.12",
        },
      });

      // Make 100 requests to hit the rate limit
      for (let i = 0; i < 100; i++) {
        checkRateLimit(request);
      }

      // Should return rate limit error, not device ID error
      const result = applyMiddleware(request);
      expect(result.error).toBeTruthy();
      expect(result.deviceId).toBeNull();

      // The error should be rate limit related
      if (result.error) {
        expect(result.error.status).toBe(429); // Rate limit status code
      }
    });

    it("should handle requests with different IPs separately", () => {
      const request1 = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "valid-device-123",
          "x-forwarded-for": "192.168.1.13",
        },
      });

      const request2 = new NextRequest("http://localhost:3000/api/test", {
        method: "GET",
        headers: {
          "X-Device-ID": "valid-device-456",
          "x-forwarded-for": "192.168.1.14",
        },
      });

      // Both should work independently
      const result1 = applyMiddleware(request1);
      const result2 = applyMiddleware(request2);

      expect(result1.error).toBeNull();
      expect(result1.deviceId).toBe("valid-device-123");
      expect(result2.error).toBeNull();
      expect(result2.deviceId).toBe("valid-device-456");
    });
  });
});
