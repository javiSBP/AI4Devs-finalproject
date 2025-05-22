"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface TipCardProps {
  stepIndex: number;
}

const leanCanvasTips = [
  "El Lean Canvas es una adaptación del Business Model Canvas, creado por Ash Maurya para startups.",
  "Enfócate primero en definir claramente el problema antes de pensar en la solución.",
  "La Propuesta de Valor debe responder a la pregunta: ¿Por qué los clientes te elegirán a ti?",
  "Especificar bien el segmento de clientes te ayudará a enfocar mejor tu propuesta de valor.",
  "Los canales definen cómo llegarás a tus clientes y cómo les entregarás tu propuesta de valor.",
  "Un buen problema bien definido ya contiene la mitad de la solución.",
  "Tu propuesta de valor debe ser única, clara y fácil de entender para tus clientes.",
  "Los mejores modelos de negocio resuelven problemas que los clientes reconocen que tienen.",
  "Valida tus hipótesis con clientes reales antes de invertir demasiado en tu idea.",
];

const financialTips = [
  "El CAC (Coste de Adquisición de Cliente) es lo que gastas en marketing y ventas para conseguir un nuevo cliente.",
  "Es mejor sobreestimar los costes fijos que subestimarlos en tus cálculos iniciales.",
  "Un buen precio no es solo lo que cubre tus costes sino lo que refleja el valor para el cliente.",
  "Considera diferentes escenarios (optimista, realista, pesimista) para tus estimaciones financieras.",
  "Intenta basar tus cifras en datos reales o benchmarks de tu industria siempre que sea posible.",
  "Los costes fijos no dependen del número de clientes o ventas que tengas.",
  "El CAC suele ser más alto en las primeras fases de una empresa y disminuye con el tiempo.",
  "Los costes de adquisición se pueden reducir mejorando las tasas de conversión y recomendaciones.",
  "La duración media del cliente (y por tanto el LTV) puede aumentarse con un buen servicio post-venta.",
];

const resultsTips = [
  "Un ratio LTV/CAC superior a 3:1 generalmente indica un modelo de negocio saludable.",
  "El punto de equilibrio te indica cuántas ventas necesitas para cubrir todos tus costes.",
  "Si tu CAC es mayor que tu LTV, necesitarás revisar tu modelo de negocio urgentemente.",
  "Un margen por cliente alto te da más espacio para invertir en crecimiento y marketing.",
  "Considera no solo la cantidad de clientes sino la calidad y duración de la relación con ellos.",
  "Las startups exitosas consiguen que su LTV sea al menos 3 veces mayor que su CAC.",
  "El tiempo para recuperar tu CAC debería ser idealmente inferior a 12 meses.",
  "Para mejorar el margen unitario puedes subir precios o reducir costes variables.",
  "Mejorar la retención de clientes suele ser más rentable que adquirir nuevos clientes.",
];

const stepTips = [leanCanvasTips, financialTips, resultsTips];

const TipCard: React.FC<TipCardProps> = ({ stepIndex }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const tips = stepTips[stepIndex] || leanCanvasTips;

  useEffect(() => {
    // Reset tip index when step changes
    setTipIndex(0);

    // Change tip every 10 seconds
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [stepIndex, tips.length]);

  return (
    <Card className="p-4 bg-accent/50 border border-accent shadow-sm">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-sm mb-1">Tip</h4>
          <p className="text-sm text-muted-foreground">{tips[tipIndex]}</p>
        </div>
      </div>
    </Card>
  );
};

export default TipCard;
