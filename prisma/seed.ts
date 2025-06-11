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

  // Crear simulación de ejemplo con el nuevo modelo
  const simulation = await prisma.simulation.upsert({
    where: { id: "demo-simulation" },
    update: {},
    create: {
      id: "demo-simulation",
      name: "Primera Simulación",
      description: "Simulación de prueba para el proyecto de ejemplo",
      userId: user.id,
      leanCanvasId: leanCanvas.id,
      financialInputs: {
        create: {
          averagePrice: 100,
          costPerUnit: 30,
          fixedCosts: 2000,
          customerAcquisitionCost: 50,
          monthlyNewCustomers: 100,
          averageCustomerLifetime: 24,
          calculationNotes: "Datos de ejemplo para demostración",
        },
      },
      results: {
        create: {
          unitMargin: 70,
          monthlyRevenue: 10000,
          monthlyProfit: 2000,
          ltv: 1680,
          cac: 50,
          cacLtvRatio: 0.03,
          breakEvenUnits: 28.57,
          breakEvenMonths: 0.29,
          profitabilityHealth: "good",
          ltvCacHealth: "good",
          overallHealth: "good",
          recommendations: [
            {
              type: "viability",
              title: "Viabilidad económica",
              message:
                "Tu modelo muestra un beneficio mensual positivo. Esto indica que tu negocio puede ser viable si se cumplen las previsiones de ventas e ingresos.",
              status: "positive",
            },
          ],
          insights: {},
          calculationVersion: "1.0",
        },
      },
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
