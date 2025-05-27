import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SharedLeanCanvasSchema } from "@/lib/validation/shared/lean-canvas";
import { LeanCanvasData, LeanCanvasFormState, ApiError } from "@/types/lean-canvas";
import {
  saveLeanCanvasTemporarily,
  loadLeanCanvasFromStorage,
  removeLeanCanvasFromStorage,
} from "@/utils/storage/lean-canvas";
import { createLeanCanvas, patchLeanCanvas, getLeanCanvas } from "@/lib/api/lean-canvas";

interface UseLeanCanvasOptions {
  id?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
  loadFromStorage?: boolean;
}

interface UseLeanCanvasReturn {
  form: ReturnType<typeof useForm<LeanCanvasData>>;
  formState: LeanCanvasFormState;
  actions: {
    save: () => Promise<boolean>;
    saveTemporarily: () => void;
    loadFromStorage: () => void;
    clearStorage: () => void;
    reset: () => void;
    loadFromApi: (id: string) => Promise<boolean>;
  };
  api: {
    isLoading: boolean;
    error: ApiError | null;
    lastSaved: Date | null;
  };
}

const defaultValues: LeanCanvasData = {
  problem: "",
  solution: "",
  uniqueValueProposition: "",
  customerSegments: "",
  channels: "",
  revenueStreams: "",
};

export function useLeanCanvas(options: UseLeanCanvasOptions = {}): UseLeanCanvasReturn {
  const { id, autoSave = false, autoSaveDelay = 2000, loadFromStorage = true } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const form = useForm<LeanCanvasData>({
    resolver: zodResolver(SharedLeanCanvasSchema),
    defaultValues,
    mode: "onChange",
  });

  const { watch, formState, reset, getValues } = form;
  const { isValid, isDirty, isSubmitting, errors } = formState;

  // Load data from storage on mount
  useEffect(() => {
    if (loadFromStorage && id) {
      const storedData = loadLeanCanvasFromStorage(id);
      if (storedData) {
        reset(storedData);
        toast.info("Datos cargados desde el almacenamiento temporal");
      }
    }
  }, [id, loadFromStorage, reset]);

  // Save temporarily to localStorage
  const saveTemporarily = useCallback(() => {
    if (!id) return;

    const data = getValues();
    saveLeanCanvasTemporarily(id, data);
  }, [getValues, id]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !id || !isDirty) return;

    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    const timeout = setTimeout(() => {
      saveTemporarily();
    }, autoSaveDelay);

    setAutoSaveTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [watch(), autoSave, autoSaveDelay, id, isDirty, saveTemporarily]);

  // Save to API
  const save = useCallback(async (): Promise<boolean> => {
    if (!isValid) {
      toast.error("Por favor, completa todos los campos requeridos");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = getValues();

      if (id) {
        // Update existing lean canvas
        const response = await patchLeanCanvas(id, data);

        if (response.success) {
          setLastSaved(new Date());
          toast.success("Lean Canvas actualizado correctamente");

          // Clear temporary storage after successful save
          if (id) {
            removeLeanCanvasFromStorage(id);
          }

          return true;
        } else {
          setError(response.error || { code: "UNKNOWN", message: "Error desconocido" });
          toast.error(response.error?.message || "Error al actualizar el Lean Canvas");
          return false;
        }
      } else {
        // Create new lean canvas
        const createData = {
          name: `Lean Canvas ${new Date().toLocaleDateString()}`,
          ...data,
        };

        const response = await createLeanCanvas(createData);

        if (response.success) {
          setLastSaved(new Date());
          toast.success("Lean Canvas creado correctamente");
          return true;
        } else {
          setError(response.error || { code: "UNKNOWN", message: "Error desconocido" });
          toast.error(response.error?.message || "Error al crear el Lean Canvas");
          return false;
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error inesperado";
      setError({ code: "UNEXPECTED", message: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isValid, getValues, id]);

  // Load from storage
  const loadFromStorageAction = useCallback(() => {
    if (!id) return;

    const storedData = loadLeanCanvasFromStorage(id);
    if (storedData) {
      reset(storedData);
      toast.info("Datos cargados desde el almacenamiento temporal");
    } else {
      toast.info("No hay datos temporales disponibles");
    }
  }, [id, reset]);

  // Clear storage
  const clearStorage = useCallback(() => {
    if (!id) return;

    removeLeanCanvasFromStorage(id);
    toast.info("Datos temporales eliminados");
  }, [id]);

  // Reset form
  const resetForm = useCallback(() => {
    reset(defaultValues);
    setError(null);
    setLastSaved(null);
  }, [reset]);

  // Load from API
  const loadFromApi = useCallback(
    async (apiId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getLeanCanvas(apiId);

        if (response.success && response.data) {
          const { data } = response;
          const leanCanvasData: LeanCanvasData = {
            problem: data.problem,
            solution: data.solution,
            uniqueValueProposition: data.uniqueValueProposition,
            customerSegments: data.customerSegments,
            channels: data.channels,
            revenueStreams: data.revenueStreams,
          };

          reset(leanCanvasData);
          toast.success("Lean Canvas cargado correctamente");
          return true;
        } else {
          setError(response.error || { code: "UNKNOWN", message: "Error desconocido" });
          toast.error(response.error?.message || "Error al cargar el Lean Canvas");
          return false;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error inesperado";
        setError({ code: "UNEXPECTED", message: errorMessage });
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [reset]
  );

  const formStateData: LeanCanvasFormState = {
    data: getValues(),
    isValid,
    isDirty,
    isSubmitting: isSubmitting || isLoading,
    errors: Object.keys(errors).reduce(
      (acc, key) => {
        const error = errors[key as keyof LeanCanvasData];
        if (error?.message) {
          acc[key] = error.message;
        }
        return acc;
      },
      {} as Record<string, string>
    ),
  };

  return {
    form,
    formState: formStateData,
    actions: {
      save,
      saveTemporarily,
      loadFromStorage: loadFromStorageAction,
      clearStorage,
      reset: resetForm,
      loadFromApi,
    },
    api: {
      isLoading,
      error,
      lastSaved,
    },
  };
}
