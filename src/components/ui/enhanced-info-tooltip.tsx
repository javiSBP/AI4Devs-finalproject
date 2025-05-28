"use client";

import React, { useState } from "react";
import { HelpCircle, Lightbulb, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EnhancedInfoTooltipProps {
  content: string;
  example?: string;
  tips?: string[];
  children?: React.ReactNode;
  showExample?: boolean;
  position?: "top" | "bottom" | "left" | "right";
}

const EnhancedInfoTooltip: React.FC<EnhancedInfoTooltipProps> = ({
  content,
  example,
  tips,
  children,
  showExample = true,
  position = "top",
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasDetailedContent = example || (tips && tips.length > 0);

  // Simple tooltip for basic content
  if (!hasDetailedContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="tooltip-trigger" asChild>
            {children || (
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            )}
          </TooltipTrigger>
          <TooltipContent side={position} className="max-w-xs">
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Enhanced tooltip with dialog for detailed content
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="tooltip-trigger" asChild>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              {children || (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Ayuda
                </DialogTitle>
                <DialogDescription className="text-left">{content}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {example && showExample && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <h4 className="font-medium text-sm">Ejemplo</h4>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{example}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {tips && tips.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium text-sm">Consejos</h4>
                    </div>
                    <ul className="space-y-1">
                      {tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0 mt-0.5 bg-yellow-50 dark:bg-yellow-950/30"
                          >
                            {index + 1}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent side={position} className="max-w-xs">
          <p className="text-center">
            {content}
            {hasDetailedContent && (
              <span className="block text-xs text-blue-400 mt-1">
                Haz clic para ver ejemplo y consejos
              </span>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EnhancedInfoTooltip;
