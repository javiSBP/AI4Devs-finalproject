import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock API routes for simulations
  http.get("/api/simulations", () => {
    return HttpResponse.json([
      {
        id: "mock-simulation-1",
        name: "Test Simulation",
        leanCanvas: {
          problemSection: "Mock problem",
          solutionSection: "Mock solution",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }),

  http.post("/api/simulations", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: "new-mock-simulation",
        ...(body as object),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.get("/api/simulations/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: "Mock Simulation",
      leanCanvas: {
        problemSection: "Mock problem for " + id,
        solutionSection: "Mock solution for " + id,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),

  http.put("/api/simulations/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      id,
      ...(body as object),
      updatedAt: new Date().toISOString(),
    });
  }),

  http.delete("/api/simulations/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ message: `Simulation ${id} deleted successfully` }, { status: 200 });
  }),

  // Mock API routes for financial calculations
  http.post("/api/financial/calculate", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      revenue: 10000,
      costs: 5000,
      profit: 5000,
      breakEvenPoint: 6,
      ...(body as object),
    });
  }),

  // Mock error scenarios for testing
  http.get("/api/test/error", () => {
    return HttpResponse.json({ error: "Mock error for testing" }, { status: 500 });
  }),
];
