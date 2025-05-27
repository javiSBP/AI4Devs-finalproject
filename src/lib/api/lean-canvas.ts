import {
  LeanCanvasResponse,
  LeanCanvasListResponse,
  CreateLeanCanvasData,
  UpdateLeanCanvasData,
  LeanCanvasUpdateData,
  ApiResponse,
} from "@/types/lean-canvas";

// Get device ID from localStorage or generate a new one
function getDeviceId(): string {
  if (typeof window === "undefined") return "server-side";

  let deviceId = localStorage.getItem("leansim-device-id");
  if (!deviceId) {
    // Generate a simple device ID
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("leansim-device-id", deviceId);
  }
  return deviceId;
}

// Base fetch function with error handling
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const deviceId = getDeviceId();

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Device-ID": deviceId,
        ...options.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || {
          code: "HTTP_ERROR",
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Error de conexión",
      },
    };
  }
}

/**
 * Create a new lean canvas
 */
export async function createLeanCanvas(
  data: CreateLeanCanvasData
): Promise<ApiResponse<LeanCanvasResponse>> {
  return apiRequest<LeanCanvasResponse>("/api/v1/lean-canvas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get a specific lean canvas by ID
 */
export async function getLeanCanvas(id: string): Promise<ApiResponse<LeanCanvasResponse>> {
  return apiRequest<LeanCanvasResponse>(`/api/v1/lean-canvas/${id}`);
}

/**
 * Update a lean canvas completely
 */
export async function updateLeanCanvas(
  id: string,
  data: UpdateLeanCanvasData
): Promise<ApiResponse<LeanCanvasResponse>> {
  return apiRequest<LeanCanvasResponse>(`/api/v1/lean-canvas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Partially update a lean canvas
 */
export async function patchLeanCanvas(
  id: string,
  data: LeanCanvasUpdateData
): Promise<ApiResponse<Partial<LeanCanvasResponse>>> {
  return apiRequest<Partial<LeanCanvasResponse>>(`/api/v1/lean-canvas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a lean canvas
 */
export async function deleteLeanCanvas(id: string): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/api/v1/lean-canvas/${id}`, {
    method: "DELETE",
  });
}

/**
 * List lean canvases with pagination
 */
export async function listLeanCanvases(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<ApiResponse<LeanCanvasListResponse>> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);

  const url = `/api/v1/lean-canvas${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return apiRequest<LeanCanvasListResponse>(url);
}

/**
 * Check if the API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const result = await apiRequest<LeanCanvasListResponse>("/api/v1/lean-canvas?limit=1");
    return result.success;
  } catch {
    return false;
  }
}

/**
 * Get the current device ID
 */
export function getCurrentDeviceId(): string {
  return getDeviceId();
}
