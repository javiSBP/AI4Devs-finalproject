import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display the main landing page", async ({ page }) => {
    await page.goto("/");

    // Check if the main title is visible
    await expect(page.getByRole("heading", { name: /leansim/i })).toBeVisible();

    // Check if the description paragraph is present (using more specific text)
    await expect(
      page.getByText("Simulador de modelos de negocio para emprendedores.")
    ).toBeVisible();

    // Check if action buttons are present
    await expect(page.getByRole("button", { name: /comenzar/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /aprender más/i })).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if main content is still visible on mobile
    await expect(page.getByRole("heading", { name: /leansim/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /comenzar/i })).toBeVisible();
  });

  test("should have proper SEO elements", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/LeanSim/);

    // Check meta description (if implemented)
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);
  });
});
