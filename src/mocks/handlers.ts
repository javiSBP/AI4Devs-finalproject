import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock API routes for Lean Canvas
  http.post("/api/v1/lean-canvas", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    // Check for test error scenarios
    const testError = request.headers.get("x-test-error");
    if (testError === "validation") {
      return HttpResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Invalid data" },
        },
        { status: 400 }
      );
    }
    if (testError === "network") {
      return HttpResponse.error();
    }
    if (testError === "http") {
      return HttpResponse.json(
        { success: false },
        { status: 500, statusText: "Internal Server Error" }
      );
    }
    if (testError === "json") {
      return new Response("Invalid JSON", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return HttpResponse.json(
      {
        success: true,
        data: {
          id: "test-id",
          ...body,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          deviceId: "test-device",
        },
      },
      { status: 201 }
    );
  }),

  http.get("/api/v1/lean-canvas/:id", ({ params }) => {
    const { id } = params;
    if (id === "nonexistent-id") {
      return HttpResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Lean Canvas not found" },
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        id,
        name: "Test Canvas",
        problem: "Test problem",
        solution: "Test solution",
        uniqueValueProposition: "Test UVP",
        customerSegments: "Test segments",
        channels: "Test channels",
        revenueStreams: "Test revenue",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        deviceId: "test-device",
      },
    });
  }),

  http.put("/api/v1/lean-canvas/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: {
        id,
        ...body,
        updatedAt: "2024-01-01T00:00:00Z",
      },
    });
  }),

  http.patch("/api/v1/lean-canvas/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: {
        id,
        ...body,
        updatedAt: "2024-01-01T00:00:00Z",
      },
    });
  }),

  http.delete("/api/v1/lean-canvas/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      data: { message: `Lean Canvas ${id} eliminado correctamente` },
    });
  }),

  http.get("/api/v1/lean-canvas", ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit");
    const page = url.searchParams.get("page");
    const sort = url.searchParams.get("sort");
    const order = url.searchParams.get("order");

    // Check for test error scenarios
    const testError = request.headers.get("x-test-error");
    if (testError === "unhealthy" && limit === "1") {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }
    if (testError === "network" && limit === "1") {
      return HttpResponse.error();
    }

    // Health check endpoint
    if (limit === "1") {
      return HttpResponse.json({
        success: true,
        data: { leanCanvases: [], pagination: { total: 0, pages: 0, currentPage: 1, limit: 1 } },
      });
    }

    // Custom parameters test case
    if (page === "2" && limit === "5" && sort === "name" && order === "asc") {
      return HttpResponse.json({
        success: true,
        data: {
          leanCanvases: [],
          pagination: {
            total: 0,
            pages: 0,
            currentPage: 2,
            limit: 5,
          },
        },
      });
    }

    // Regular list endpoint
    return HttpResponse.json({
      success: true,
      data: {
        leanCanvases: [
          {
            id: "test-id",
            name: "Test Canvas",
            problem: "Test problem",
            solution: "Test solution",
            uniqueValueProposition: "Test UVP",
            customerSegments: "Test segments",
            channels: "Test channels",
            revenueStreams: "Test revenue",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-01T00:00:00Z",
            deviceId: "test-device",
          },
        ],
        pagination: {
          total: 1,
          pages: 1,
          currentPage: 1,
          limit: 10,
        },
      },
    });
  }),

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
      breakEvenUnits: 28.57,
      breakEvenMonths: 0.29,
      ...(body as object),
    });
  }),

  // Mock error scenarios for testing
  http.get("/api/test/error", () => {
    return HttpResponse.json({ error: "Mock error for testing" }, { status: 500 });
  }),
];
