import React from "react";
import { cn } from "@/lib/utils";

interface RocketLoaderProps {
  className?: string;
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const RocketLoader: React.FC<RocketLoaderProps> = ({
  className,
  message = "Despegando...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      {/* Rocket Container */}
      <div className="relative">
        {/* Trail/Smoke Effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 flex flex-col items-center gap-1">
          <div className="w-1 h-3 bg-gradient-to-b from-yellow-400 to-transparent rounded-full animate-pulse opacity-80"></div>
          <div
            className="w-0.5 h-2 bg-gradient-to-b from-orange-400 to-transparent rounded-full animate-pulse opacity-60"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-0.5 h-1 bg-gradient-to-b from-red-400 to-transparent rounded-full animate-pulse opacity-40"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Rocket SVG with Floating Animation */}
        <div className={cn("animate-rocket-launch", sizeClasses[size])}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-primary drop-shadow-lg"
          >
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="fireGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Rocket Body */}
            <path d="M12 2L15 8H9L12 2Z" fill="currentColor" filter="url(#glow)" />
            <path d="M9 8H15V16H9V8Z" fill="currentColor" filter="url(#glow)" />

            {/* Rocket Wings */}
            <path d="M7 12L9 14V16L7 18V12Z" fill="currentColor" />
            <path d="M17 12L15 14V16L17 18V12Z" fill="currentColor" />

            {/* Rocket Window */}
            <circle cx="12" cy="11" r="1.5" fill="white" opacity="0.9" />

            {/* Rocket Fire */}
            <path d="M10 16L12 20L14 16H10Z" fill="url(#fireGradient)" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Loading Message */}
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse font-medium tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};
