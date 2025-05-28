export interface LeanCanvasFieldHelp {
  label: string;
  description: string;
  placeholder: string;
  example: string;
  tips: string[];
}

export const LEAN_CANVAS_HELP: Record<string, LeanCanvasFieldHelp> = {
  problem: {
    label: "Problema",
    description:
      "¿Qué problema o necesidad específica resuelve tu producto o servicio? Identifica el dolor principal de tus clientes.",
    placeholder: "Describe el problema que resuelves...",
    example:
      "Los freelancers pierden mucho tiempo en tareas administrativas (facturas, gestión de clientes, seguimiento de proyectos) en lugar de enfocarse en su trabajo principal.",
    tips: [
      "Enfócate en un problema específico y real",
      "Piensa en situaciones frustrantes que vives o has observado",
      "Evita problemas demasiado generales o vagos",
    ],
  },
  solution: {
    label: "Solución",
    description:
      "¿Cómo resuelve tu producto o servicio el problema identificado? Describe tu propuesta de forma clara y específica.",
    placeholder: "Describe tu solución...",
    example:
      "Una plataforma todo-en-uno para freelancers que automatiza facturas, gestiona clientes y proyectos, y genera reportes financieros en minutos.",
    tips: [
      "Mantén la solución simple y fácil de entender",
      "Explica cómo específicamente resuelves el problema",
      "Evita detalles técnicos complejos",
    ],
  },
  uniqueValueProposition: {
    label: "Propuesta de Valor Única",
    description:
      "¿Qué hace diferente a tu producto? ¿Por qué deberían elegirte sobre otras opciones? Tu ventaja competitiva única.",
    placeholder: "Define tu propuesta de valor...",
    example:
      "La única plataforma que permite a freelancers gestionar todo su negocio en 15 minutos semanales, con automatización inteligente y sin configuración técnica.",
    tips: [
      "Destaca qué te hace único en el mercado",
      "Piensa en el beneficio principal que ofreces",
      "Usa números o datos específicos cuando sea posible",
    ],
  },
  customerSegments: {
    label: "Segmentos de Cliente",
    description:
      "¿Quiénes son tus clientes ideales? Define sus características principales, necesidades y comportamientos.",
    placeholder: "Define tus segmentos de cliente...",
    example:
      "Freelancers de diseño y desarrollo con 1-3 años de experiencia, facturación mensual de €2000-8000, que trabajan con múltiples clientes simultáneamente.",
    tips: [
      "Sé específico sobre quién es tu cliente ideal",
      "Incluye características demográficas y psicográficas",
      "Piensa en diferentes grupos si tienes varios tipos de clientes",
    ],
  },
  channels: {
    label: "Canales",
    description:
      "¿Cómo llegas a tus clientes? ¿Dónde los encuentras y cómo te comunicas con ellos? Canales de distribución, marketing y venta.",
    placeholder: "Define tus canales...",
    example:
      "LinkedIn (networking profesional), YouTube (tutoriales), podcasts de freelancing, comunidades online, recomendaciones boca a boca, Google Ads.",
    tips: [
      "Lista dónde están tus clientes potenciales",
      "Incluye canales de marketing, venta y distribución",
      "Piensa en canales digitales y offline",
    ],
  },
  revenueStreams: {
    label: "Estructura de Ingresos/Costes",
    description:
      "¿Cómo vas a ganar dinero? Define tu modelo de ingresos y los principales costes de tu negocio.",
    placeholder: "Define tus fuentes de ingresos y estructura de costes...",
    example:
      "Ingresos: Suscripción mensual €29/mes, plan premium €59/mes. Costes: desarrollo y mantenimiento, hosting, marketing digital, atención al cliente.",
    tips: [
      "Describe claramente cómo generas ingresos",
      "Incluye los costes principales del negocio",
      "Piensa en diferentes modelos: suscripción, pago único, comisiones",
    ],
  },
};
