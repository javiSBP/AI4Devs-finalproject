export interface FinancialFieldHelp {
  label: string;
  description: string;
  placeholder: string;
  example: string;
  tips: string[];
}

export const FINANCIAL_INPUTS_HELP: Record<string, FinancialFieldHelp> = {
  averagePrice: {
    label: "Precio medio por unidad/servicio (€)",
    description:
      "El precio promedio que cobras por cada producto o servicio vendido, sin incluir IVA. Este valor debe ser mayor que 0 y es fundamental para calcular tus márgenes y rentabilidad.",
    placeholder: "ej: 29.99",
    example:
      "Si vendes un curso online a €49, una consultoría a €150/hora y un producto físico a €25, y vendes cantidades similares de cada uno, tu precio medio sería aproximadamente €75.",
    tips: [
      "Siempre excluye el IVA del precio final",
      "Si tienes varios productos, calcula un promedio ponderado",
      "Considera descuentos y promociones frecuentes",
      "Revisa si este precio es competitivo en tu mercado",
    ],
  },
  costPerUnit: {
    label: "Coste variable por cliente (€)",
    description:
      "Los costes directos que tienes que pagar cada vez que produces una unidad o atiendes a un cliente. No incluye costes fijos como alquiler o salarios base.",
    placeholder: "ej: 12.50",
    example:
      "Para un curso online: costo de la plataforma por estudiante (€2), comisiones de pago (€1.50), material digital (€0.50). Total: €4 por estudiante.",
    tips: [
      "Solo incluye costes que varían con cada venta",
      "Considera materiales, comisiones, envíos, trabajo directo",
      "No incluyas costes fijos como oficina o software mensual",
      "Si es un servicio puro, este valor puede ser muy bajo o cero",
    ],
  },
  fixedCosts: {
    label: "Costes fijos mensuales (€)",
    description:
      "Gastos recurrentes que pagas cada mes independientemente de cuánto vendas: alquiler, salarios base, software, seguros, suministros.",
    placeholder: "ej: 2000",
    example:
      "Alquiler de oficina (€800), software esencial (€200), seguro (€100), móvil/internet (€80), contabilidad (€120). Total: €1.300/mes.",
    tips: [
      "Incluye todos los gastos que tienes aunque no vendas nada",
      "Considera tu salario mínimo necesario para vivir",
      "Revisa facturas recurrentes de los últimos 3 meses",
      "Añade un margen del 10-20% para imprevistos",
    ],
  },
  customerAcquisitionCost: {
    label: "Coste de adquisición de cliente - CAC (€)",
    description:
      "Cuánto dinero necesitas invertir en promedio para conseguir un nuevo cliente. Incluye marketing, publicidad, ventas y tiempo dedicado a conseguir clientes.",
    placeholder: "ej: 15",
    example:
      "Gastas €1.000/mes en Google Ads y consigues 50 nuevos clientes. Tu CAC sería €20. Si además dedicas 20 horas de tu tiempo valoradas a €30/hora, sería €32.",
    tips: [
      "Incluye tanto dinero como tiempo invertido en conseguir clientes",
      "Calcula basándote en datos reales de los últimos meses",
      "Un CAC bajo indica eficiencia en tu marketing",
      "Considera canales orgánicos (SEO, referencias) y de pago",
    ],
  },
  monthlyNewCustomers: {
    label: "Nuevos clientes por mes",
    description:
      "Número estimado de nuevos clientes que esperas conseguir cada mes con tu estrategia actual de marketing y ventas. Debe ser al menos 1 para poder simular un negocio.",
    placeholder: "ej: 50",
    example:
      "Actualmente consigues 30 clientes/mes. Con mejoras en tu web y más presencia en redes sociales, estimas que podrías llegar a 50 clientes/mes.",
    tips: [
      "Basa tu estimación en datos históricos si los tienes",
      "Sé realista: es mejor empezar conservador",
      "Considera la estacionalidad de tu negocio",
      "Piensa en tu capacidad para atender más clientes",
    ],
  },
  averageCustomerLifetime: {
    label: "Duración media del cliente (meses)",
    description:
      "Durante cuántos meses un cliente típico sigue comprando tus productos o servicios antes de abandonar o dejar de necesitarte.",
    placeholder: "ej: 12",
    example:
      "En un servicio de suscripción mensual, si el 50% se va en 6 meses, el 30% en 12 meses y el 20% dura 24 meses, la duración media sería unos 11 meses.",
    tips: [
      "Para suscripciones, calcula cuánto duran antes de cancelar",
      "Para productos únicos, considera frecuencia de recompra",
      "Si no tienes datos, empieza con 6-12 meses",
      "Una mayor duración significa mayor valor del cliente",
    ],
  },
};
