"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number; // Duration in milliseconds
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [progress, setProgress] = React.useState(100);
  const [isExiting, setIsExiting] = React.useState(false);

  // Function to handle closing with animation
  const handleClose = React.useCallback(() => {
    setIsExiting(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 200); // Animation duration
  }, [onClose]);

  React.useEffect(() => {
    if (isVisible && duration > 0) {
      // Reset progress when toast becomes visible
      setProgress(100);
      setIsExiting(false);

      // Update progress bar every 100ms
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100);
          return Math.max(0, newProgress);
        });
      }, 100);

      // Auto-close timer
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(closeTimer);
      };
    } else {
      setProgress(100);
      setIsExiting(false);
    }
  }, [isVisible, duration, handleClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "error":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "info":
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50",
        isExiting
          ? "animate-out slide-out-to-top-2 fade-out-0 duration-200"
          : "animate-in slide-in-from-top-2 fade-in-0"
      )}
    >
      <div
        className={cn(
          "max-w-md rounded-lg border shadow-lg backdrop-blur-sm overflow-hidden",
          getColorClasses()
        )}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 rounded-md p-1 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {duration > 0 && (
          <div className="h-1 bg-black/10">
            <div
              className={cn(
                "h-full transition-all duration-100 ease-linear",
                type === "success" && "bg-green-500",
                type === "error" && "bg-red-500",
                type === "info" && "bg-blue-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
