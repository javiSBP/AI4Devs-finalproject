"use client";

import React from "react";
import { LeanCanvasData } from "@/types/lean-canvas";
import { Card } from "@/components/ui/card";

interface LeanCanvasVisualProps {
  data: LeanCanvasData;
}

const LeanCanvasVisual: React.FC<LeanCanvasVisualProps> = ({ data }) => {
  return (
    <div className="mt-8">
      <h3 className="font-semibold text-lg mb-4">Tu Lean Canvas</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-card rounded-lg p-2 shadow-sm">
        <Card className="p-4 md:col-span-1 bg-background/80 border border-border/50 min-h-[160px]">
          <h4 className="text-primary font-semibold mb-2 text-sm">PROBLEMA</h4>
          <p className="text-sm">{data.problem || "No definido"}</p>
        </Card>
        <Card className="p-4 md:col-span-1 bg-background/80 border border-primary/20 min-h-[160px]">
          <h4 className="text-primary font-semibold mb-2 text-sm">SOLUCIÓN</h4>
          <p className="text-sm">{data.solution || "No definida"}</p>
        </Card>
        <Card className="p-4 md:col-span-1 bg-background/80 border border-border/50 min-h-[160px]">
          <h4 className="text-primary font-semibold mb-2 text-sm">SEGMENTOS DE CLIENTES</h4>
          <p className="text-sm">{data.customerSegments || "No definidos"}</p>
        </Card>
        <Card className="p-4 md:col-span-3 bg-background/80 border border-primary/20 min-h-[100px]">
          <h4 className="text-primary font-semibold mb-2 text-sm">PROPUESTA DE VALOR ÚNICA</h4>
          <p className="text-sm">{data.uniqueValueProposition || "No definida"}</p>
        </Card>
        <Card className="p-4 md:col-span-3 md:grid md:grid-cols-2 gap-4 bg-background/80">
          <div>
            <h4 className="text-primary font-semibold mb-2 text-sm">CANALES</h4>
            <p className="text-sm">{data.channels || "No definidos"}</p>
          </div>
          <div>
            <h4 className="text-primary font-semibold mb-2 text-sm">FLUJOS DE INGRESOS</h4>
            <p className="text-sm">{data.revenueStreams || "No definidos"}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeanCanvasVisual;
