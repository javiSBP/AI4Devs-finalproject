import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear usuario de ejemplo
  const user = await prisma.user.upsert({
    where: { email: "demo@leansim.com" },
    update: {},
    create: {
      email: "demo@leansim.com",
      name: "Usuario Demo",
    },
  });

  console.log("Usuario de demostración creado:", user);

  // Crear Lean Canvas de ejemplo
  const leanCanvas = await prisma.leanCanvas.upsert({
    where: { id: "demo-lean-canvas" },
    update: {},
    create: {
      id: "demo-lean-canvas",
      name: "Proyecto de Ejemplo",
      description: "Un ejemplo de Lean Canvas para demostración",
      problem:
        "Los emprendedores tienen dificultades para evaluar la viabilidad financiera de sus ideas",
      solution:
        "Una herramienta simple que permite simular resultados financieros con pocos datos de entrada",
      uniqueValueProposition: "Evaluación financiera simplificada para no expertos",
      customerSegments: "Emprendedores primerizos, Estudiantes de negocios, Pequeñas startups",
      channels: "Plataforma web, Redes sociales, Universidades",
      revenueStreams: "Suscripción premium, Servicios de consultoría",
      userId: user.id,
    },
  });

  console.log("Lean Canvas de ejemplo creado:", leanCanvas);

  // Crear simulación de ejemplo
  const simulation = await prisma.simulation.upsert({
    where: { id: "demo-simulation" },
    update: {},
    create: {
      id: "demo-simulation",
      name: "Primera Simulación",
      description: "Simulación de prueba para el proyecto de ejemplo",
      initialInvestment: 10000,
      monthlyExpenses: 2000,
      avgRevenue: 3000,
      growthRate: 0.1,
      timeframeMonths: 12,
      otherParams: {
        customerAcquisitionCost: 100,
        averageCustomerLifetime: 24,
      },
      results: {
        breakEvenPoint: 6,
        totalProfit: 5000,
        roi: 0.5,
      },
      userId: user.id,
      leanCanvasId: leanCanvas.id,
    },
  });

  console.log("Simulación de ejemplo creada:", simulation);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
