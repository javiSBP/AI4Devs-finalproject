import { useState, useCallback } from "react";
import type {
  CompleteSimulation,
  CreateSimulationData,
  UpdateSimulationData,
  PaginatedSimulationsResponse,
} from "@/types/simulation";

// Helper to generate a device ID (browser fingerprint)
function getDeviceId(): string {
  if (typeof window === "undefined") return "server";

  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    // Generate a simple device ID based on browser characteristics
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Device fingerprint", 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join("|");

    deviceId = "fp_" + btoa(fingerprint).slice(0, 20);
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
}

export function useSimulations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Make API call with device ID header
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const deviceId = getDeviceId();

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Device-ID": deviceId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  };

  // Create a complete simulation
  const createSimulation = useCallback(
    async (data: CreateSimulationData): Promise<CompleteSimulation> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall("/api/v1/simulations", {
          method: "POST",
          body: JSON.stringify(data),
        });

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get a specific simulation
  const getSimulation = useCallback(async (id: string): Promise<CompleteSimulation> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(`/api/v1/simulations/${id}`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a simulation
  const updateSimulation = useCallback(
    async (id: string, data: UpdateSimulationData): Promise<CompleteSimulation> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(`/api/v1/simulations/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // List simulations with pagination
  const listSimulations = useCallback(
    async (
      page = 1,
      limit = 10,
      sort = "updatedAt",
      order = "desc"
    ): Promise<PaginatedSimulationsResponse> => {
      setLoading(true);
      setError(null);

      try {
        const url = `/api/v1/simulations?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;
        const result = await apiCall(url);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a simulation
  const deleteSimulation = useCallback(async (id: string): Promise<{ message: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(`/api/v1/simulations/${id}`, {
        method: "DELETE",
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Duplicate a simulation
  const duplicateSimulation = useCallback(async (id: string): Promise<CompleteSimulation> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(`/api/v1/simulations/${id}`, {
        method: "POST",
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createSimulation,
    getSimulation,
    updateSimulation,
    listSimulations,
    deleteSimulation,
    duplicateSimulation,
    loading,
    error,
    clearError: () => setError(null),
  };
}
