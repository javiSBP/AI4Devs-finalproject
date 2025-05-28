"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

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

// Colores diferentes para cada paso
const stepColors = [
  {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-l-4 border-blue-500",
    icon: "text-blue-600 dark:text-blue-400",
    accent: "#3b82f6",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-l-4 border-emerald-500",
    icon: "text-emerald-600 dark:text-emerald-400",
    accent: "#10b981",
  },
  {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-l-4 border-purple-500",
    icon: "text-purple-600 dark:text-purple-400",
    accent: "#8b5cf6",
  },
];

const TipCard: React.FC<TipCardProps> = ({ stepIndex }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const tips = stepTips[stepIndex] || leanCanvasTips;
  const colors = stepColors[stepIndex] || stepColors[0];

  useEffect(() => {
    // Reset tip index when step changes
    setTipIndex(0);
    setAutoRotate(true);
    setIsVisible(true);
  }, [stepIndex]);

  useEffect(() => {
    if (!autoRotate) return;

    // Change tip every 7 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setIsVisible(true);
      }, 300); // Wait for fade out before changing content
    }, 7000);

    return () => clearInterval(interval);
  }, [tipIndex, tips.length, autoRotate]);

  const goToTip = (index: number) => {
    setIsVisible(false);
    setTimeout(() => {
      setTipIndex(index);
      setAutoRotate(false); // Pausar auto-rotación cuando el usuario navega manualmente
      setIsVisible(true);
    }, 300);
  };

  const goToPrevious = () => {
    const newIndex = tipIndex === 0 ? tips.length - 1 : tipIndex - 1;
    goToTip(newIndex);
  };

  const goToNext = () => {
    const newIndex = (tipIndex + 1) % tips.length;
    goToTip(newIndex);
  };

  return (
    <Card
      className={`p-4 h-52 ${colors.bg} ${colors.border} shadow-md transition-all duration-300 hover:shadow-lg flex flex-col`}
    >
      <div className="flex flex-col h-full">
        {/* Header con navegación */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Lightbulb className={`h-5 w-5 ${colors.icon} flex-shrink-0`} />
            <h4 className="font-semibold text-sm text-foreground">Consejos</h4>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className={`h-6 w-6 p-0 ${colors.icon} hover:bg-current/10`}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className={`h-6 w-6 p-0 ${colors.icon} hover:bg-current/10`}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Contenido del tip con animación fade */}
        <div className="flex-1 flex items-center min-h-0 mb-4">
          <p
            className={`text-sm text-muted-foreground leading-relaxed transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {tips[tipIndex]}
          </p>
        </div>

        {/* Indicadores clickables */}
        <div className="flex justify-center space-x-1 flex-shrink-0 pb-1">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTip(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1 ${
                index === tipIndex
                  ? "bg-current opacity-100 scale-110"
                  : "bg-current opacity-30 hover:opacity-60"
              }`}
              style={{ color: colors.accent }}
              aria-label={`Ir al consejo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TipCard;
