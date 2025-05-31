export interface FinancialMetricHelp {
  label: string;
  description: string;
  example: string;
  tips: string[];
  interpretation: {
    good: string;
    warning: string;
    bad: string;
  };
}

export const FINANCIAL_METRICS_HELP: Record<string, FinancialMetricHelp> = {
  unitMargin: {
    label: "Margen unitario",
    description:
      "Es la ganancia que obtienes por cada producto o servicio vendido. Se calcula restando los costes variables del precio de venta. Un margen positivo significa que cada venta te da beneficio directo.",
    example:
      "Vendes un curso por €50 y te cuesta €15 producir y entregar (plataforma, materiales, comisiones). Tu margen unitario es €35. Esto significa que por cada curso vendido ganas €35 antes de pagar costes fijos.",
    tips: [
      "Un margen alto te da más flexibilidad para crecer",
      "Si es negativo, pierdes dinero con cada venta",
      "Considera subir precios o reducir costes variables",
      "Compara con competidores de tu sector",
    ],
    interpretation: {
      good: "Margen alto permite reinvertir en crecimiento",
      warning: "Margen justo, optimiza costes o precios",
      bad: "Margen insuficiente o negativo, revisa modelo de negocio",
    },
  },
  monthlyProfit: {
    label: "Beneficio mensual",
    description:
      "Es el dinero que realmente te queda cada mes después de pagar todos los gastos: materiales, costes fijos, marketing y salarios. Si es positivo, tu negocio es rentable.",
    example:
      "Vendes €5.000 al mes, gastas €2.000 en materiales y marketing, y €2.500 en costes fijos (alquiler, software, tu salario). Tu beneficio mensual es €500. Ese dinero puedes reinvertirlo o guardarlo.",
    tips: [
      "Si es negativo, necesitas vender más o reducir gastos",
      "Un beneficio constante indica un negocio sostenible",
      "Reinvierte parte del beneficio para crecer más rápido",
      "Guarda una reserva para meses más difíciles",
    ],
    interpretation: {
      good: "Negocio rentable y sostenible",
      warning: "Rentabilidad ajustada, optimiza operaciones",
      bad: "Pérdidas mensuales, necesitas cambios urgentes",
    },
  },
  ltv: {
    label: "LTV - Valor del cliente",
    description:
      "Es el dinero total que un cliente te va a pagar durante todo el tiempo que esté contigo. Se calcula multiplicando el margen por cliente por los meses que suele durar como cliente.",
    example:
      "Un cliente te paga €30/mes con un margen de €20/mes, y suele estar contigo 8 meses de media. Su LTV es €160. Esto significa que cada nuevo cliente vale €160 para tu negocio.",
    tips: [
      "Un LTV alto justifica invertir más en conseguir clientes",
      "Mejora la experiencia para que los clientes duren más",
      "Ofrece productos adicionales para aumentar el valor",
      "Mide la duración real de tus clientes regularmente",
    ],
    interpretation: {
      good: "Alto valor por cliente permite crecer de forma sostenible",
      warning: "Valor moderado, busca formas de aumentar la retención",
      bad: "Valor bajo, mejora la propuesta de valor o la retención",
    },
  },
  ltvCacRatio: {
    label: "Ratio LTV/CAC",
    description:
      "Compara cuánto vale un cliente (LTV) con cuánto cuesta conseguirlo (CAC). Un ratio de 3:1 significa que cada euro invertido en conseguir clientes te devuelve 3 euros de beneficio.",
    example:
      "Si tu LTV es €150 y gastas €30 en conseguir cada cliente (CAC), tu ratio es 5:1. Esto significa que cada €30 invertidos en marketing te devuelven €150, una excelente inversión.",
    tips: [
      "Ratio ideal: mayor a 3:1 para negocio sostenible",
      "Ratio 1:1 significa que no ganas dinero con nuevos clientes",
      "Si es menor a 1:1, pierdes dinero con cada cliente nuevo",
      "Mejora el ratio reduciendo CAC o aumentando LTV",
    ],
    interpretation: {
      good: "Excelente retorno de la inversión en marketing",
      warning: "Retorno justo, optimiza marketing o retención",
      bad: "Inversión en marketing no es rentable",
    },
  },
  breakEven: {
    label: "Punto de equilibrio",
    description:
      "Es la cantidad de ventas que necesitas para cubrir todos tus gastos mensuales. A partir de ese punto, cada venta adicional es beneficio puro. Te dice cuánto necesitas vender para no perder dinero.",
    example:
      "Tus costes fijos son €2.000/mes y tu margen por venta es €25. Necesitas vender 80 unidades para llegar al punto de equilibrio. A partir de la venta 81, todo es beneficio.",
    tips: [
      "Un punto de equilibrio bajo te da más seguridad",
      "Si tardas muchos meses en alcanzarlo, revisa tus costes",
      "Reduce costes fijos o aumenta márgenes para mejorarlo",
      "Es tu objetivo mínimo de ventas cada mes",
    ],
    interpretation: {
      good: "Punto de equilibrio alcanzable, negocio viable",
      warning: "Punto de equilibrio alto, requiere esfuerzo sostenido",
      bad: "Punto de equilibrio muy alto, revisa estructura de costes",
    },
  },
};
