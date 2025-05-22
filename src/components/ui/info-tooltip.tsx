"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="tooltip-trigger" asChild>
          {children || <HelpCircle className="h-4 w-4" />}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
