import { NextRequest } from "next/server";
import { DeviceIdSchema } from "../validation/lean-canvas";
import { CommonErrors } from "./response";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

// Device ID validation middleware
export function validateDeviceId(request: NextRequest) {
  const deviceId = request.headers.get("X-Device-ID");

  if (!deviceId) {
    return { error: CommonErrors.DEVICE_ID_REQUIRED(), deviceId: null };
  }

  try {
    const validatedDeviceId = DeviceIdSchema.parse(deviceId);
    return { error: null, deviceId: validatedDeviceId };
  } catch {
    return { error: CommonErrors.INVALID_DEVICE_ID(), deviceId: null };
  }
}

// Rate limiting middleware
export function checkRateLimit(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const key = `rate_limit:${ip}`;

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { error: null, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { error: CommonErrors.RATE_LIMITED(), remaining: 0 };
  }

  current.count++;
  rateLimitStore.set(key, current);

  return { error: null, remaining: RATE_LIMIT_MAX_REQUESTS - current.count };
}

// Security headers
export function getSecurityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  };
}

// Combined middleware function
export function applyMiddleware(request: NextRequest) {
  // Check rate limit
  const rateLimitResult = checkRateLimit(request);
  if (rateLimitResult.error) {
    return { error: rateLimitResult.error, deviceId: null };
  }

  // Validate device ID
  const deviceIdResult = validateDeviceId(request);
  if (deviceIdResult.error) {
    return { error: deviceIdResult.error, deviceId: null };
  }

  return { error: null, deviceId: deviceIdResult.deviceId };
}

// Cleanup old rate limit entries (call periodically)
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}
