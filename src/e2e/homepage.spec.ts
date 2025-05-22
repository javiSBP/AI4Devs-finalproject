import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display the main landing page", async ({ page }) => {
    await page.goto("/");

    // Check if the main title is visible
    await expect(
      page.getByRole("heading", { name: /simula la viabilidad de tu modelo de negocio/i })
    ).toBeVisible();

    // Check if the LeanSim logo/brand is present in header
    await expect(page.getByRole("link", { name: /leansim/i })).toBeVisible();

    // Check if the description paragraph is present
    await expect(
      page.getByText("LeanSim te ayuda a evaluar la viabilidad básica de tu idea de negocio")
    ).toBeVisible();

    // Check if action buttons are present
    await expect(page.getByRole("link", { name: /iniciar simulación/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /ver historial/i })).toBeVisible();

    // Check if feature cards are present
    await expect(page.getByText("Sencillo")).toBeVisible();
    await expect(page.getByText("Educativo")).toBeVisible();
    await expect(page.getByText("Práctico")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if main content is still visible on mobile
    await expect(
      page.getByRole("heading", { name: /simula la viabilidad de tu modelo de negocio/i })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /iniciar simulación/i })).toBeVisible();

    // Check if the logo is visible in header
    await expect(page.getByRole("link", { name: /leansim/i })).toBeVisible();
  });

  test("should have proper SEO elements", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/LeanSim/);

    // Check meta description in head (more specific selector to avoid duplicates)
    const metaDescription = page.locator('head meta[name="description"]').first();
    await expect(metaDescription).toHaveAttribute("content", /.+/);
  });

  test("should have clickable navigation links", async ({ page }) => {
    await page.goto("/");

    // Check that the simulation link has correct href
    const simulationLink = page.getByRole("link", { name: /iniciar simulación/i });
    await expect(simulationLink).toBeVisible();
    await expect(simulationLink).toHaveAttribute("href", "/simulation");

    // Check that the historial link has correct href
    const historialLink = page.getByRole("link", { name: /ver historial/i });
    await expect(historialLink).toBeVisible();
    await expect(historialLink).toHaveAttribute("href", "/historial");
  });
});
