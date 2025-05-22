# Testing Guide for LeanSim

This document provides comprehensive guidance on testing practices, tools, and configurations used in the LeanSim project.

## Overview

LeanSim uses a multi-layered testing strategy to ensure code quality and reliability:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test API endpoints and component interactions
- **End-to-End Tests**: Test complete user workflows

## Testing Stack

### Core Testing Tools

- **Vitest**: Fast unit test runner with TypeScript support
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking for tests
- **Playwright**: End-to-end testing framework
- **Jest DOM**: Additional DOM testing matchers

### Development Tools

- **@vitest/coverage-v8**: Code coverage reporting
- **Husky**: Git hooks for running tests before push
- **ESLint**: Code quality and testing best practices

## Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "src/generated/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.setup.*",
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules/", ".next/", "src/generated/"],
  },
});
```

### Test Setup

```typescript
// vitest.setup.ts
import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "./src/mocks/handlers";

// Setup MSW server for API mocking
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Writing Tests

### Unit Tests

Unit tests should focus on testing individual components or functions in isolation.

```typescript
// Example: Button component test
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("handles loading state", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});
```

### Integration Tests

Integration tests verify that different parts of the application work together, especially API endpoints.

```typescript
// Example: API integration test
import { describe, expect, it } from "vitest";

describe("Simulations API", () => {
  it("should create a new simulation", async () => {
    const response = await fetch("/api/simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Simulation",
        leanCanvas: { problemSection: "Test problem" },
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data).toHaveProperty("id");
  });
});
```

### End-to-End Tests

E2E tests verify complete user workflows using Playwright.

```typescript
// Example: Homepage E2E test
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("user can navigate and interact", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /leansim/i })).toBeVisible();
    await page.getByRole("button", { name: /comenzar/i }).click();

    // Continue testing user flow...
  });
});
```

## Mocking with MSW

### Handler Configuration

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/simulations", () => {
    return HttpResponse.json([
      {
        id: "mock-simulation-1",
        name: "Test Simulation",
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  http.post("/api/simulations", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        id: "new-simulation",
        ...(body as object),
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];
```

## Running Tests

### Available Scripts

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui

# Run end-to-end tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed
```

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Terminal**: Summary shown after running `npm run test:coverage`
- **HTML**: Detailed report in `coverage/index.html`
- **JSON**: Machine-readable report in `coverage/coverage.json`

## Git Hooks

Tests are automatically run before pushing code:

```bash
# .husky/pre-push
npm run test -- --run
```

This ensures that only tested code is pushed to the repository.

## Best Practices

### General Guidelines

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert Pattern**: Structure tests with clear setup, action, and verification phases
4. **Keep Tests Simple**: Each test should verify one specific behavior
5. **Use Data-Testid Sparingly**: Prefer testing by role, label, or text when possible

### Component Testing

1. **Test User Interactions**: Focus on how users interact with components
2. **Mock External Dependencies**: Use MSW for API calls, mock complex dependencies
3. **Test Accessibility**: Ensure components work with screen readers and keyboard navigation
4. **Test Error States**: Verify how components handle and display errors

### API Testing

1. **Test All HTTP Methods**: Verify GET, POST, PUT, DELETE operations
2. **Test Error Responses**: Ensure proper error handling and status codes
3. **Validate Request/Response Formats**: Check data structure and types
4. **Test Authentication/Authorization**: Verify access control mechanisms

### E2E Testing

1. **Test Critical User Paths**: Focus on the most important user journeys
2. **Keep Tests Independent**: Each test should be able to run in isolation
3. **Use Page Object Pattern**: Create reusable page interaction methods
4. **Test Across Browsers**: Verify compatibility with different browsers and devices

## Troubleshooting

### Common Issues

1. **Tests Timing Out**: Increase timeout for async operations
2. **MSW Not Working**: Ensure handlers are properly configured and server is started
3. **Component Not Found**: Check that components are properly rendered and accessible
4. **Coverage Too Low**: Add missing test cases for uncovered code paths

### Debugging Tests

1. **Use `screen.debug()`**: Print current DOM state in component tests
2. **Add `console.log()`**: Debug test execution flow
3. **Use Playwright Inspector**: Debug E2E tests step by step
4. **Check Test Reports**: Review detailed test results in HTML reports

## Continuous Integration

Tests are integrated into the CI/CD pipeline:

1. **Pre-commit**: Lint and format checks
2. **Pre-push**: Run unit and integration tests
3. **CI Pipeline**: Run full test suite including E2E tests
4. **Coverage Reports**: Generate and publish coverage reports

## Examples

### Testing Custom Hooks

```typescript
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  it("should set and get values", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("initial");

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
  });
});
```

### Testing Forms

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  it("should submit form with valid data", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<ContactForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
    });
  });
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
