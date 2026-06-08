const { test, expect } = require("@playwright/test");

const BASE_URL = process.env.CAP4_BASE_URL || "http://127.0.0.1:3104";

const viewports = [
  { name: "mobile-360", width: 360, height: 740 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1366", width: 1366, height: 768 },
];

const checkpoints = [
  "#inicio-capitulo4",
  "#cena-ampulheta",
  "#cena-kanban",
  "#cena-forja",
  "#cena-ponte",
  "#cena-divida",
  "#cena-metricas",
  "#cena-stakeholders",
  "#cena-retrospectiva",
  "#cena-finalizar-historia",
];

const surfaces = [
  ".chapter-progress",
  "#cena-ampulheta .story-text",
  "#cena-kanban .kanban-panel",
  "#cena-forja .dod-forge",
  "#cena-ponte .pipeline-neon-board",
  "#cena-divida .refactor-board-shell",
  "#cena-retrospectiva .retro-form",
  "#cena-finalizar-historia .porta-boss-scene",
];

test.describe("Capitulo 4 responsive contract", () => {
  for (const viewport of viewports) {
    test(`${viewport.name} has no horizontal overflow or clipped key surfaces`, async ({ page }) => {
      const messages = [];

      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type())) {
          messages.push(`${message.type()}: ${message.text()}`);
        }
      });

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.route("**/api/progresso/mapa", async (route) => {
        await route.fulfill({
          contentType: "application/json",
          status: 200,
          body: JSON.stringify({ modulos: [] }),
        });
      });
      await page.route("**/api/navbar/status", async (route) => {
        await route.fulfill({
          contentType: "application/json",
          status: 200,
          body: JSON.stringify({ desbloqueada: false }),
        });
      });
      await page.goto(BASE_URL);
      await page.evaluate(() => localStorage.setItem("token", "cap4-responsive-check"));
      await page.goto(`${BASE_URL}/capitulo4`);
      await expect(page.locator("h1")).toContainText("Travessia Viva do Tempo Quebrado");

      for (const selector of checkpoints) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        await page.waitForTimeout(80);

        const overflow = await page.evaluate(() => {
          const widthOverflow = document.documentElement.scrollWidth - window.innerWidth;
          const bodyOverflow = document.body.scrollWidth - window.innerWidth;

          return Math.max(widthOverflow, bodyOverflow);
        });

        expect(overflow, `${viewport.name} ${selector} overflow`).toBeLessThanOrEqual(2);
      }

      const clipped = await page.evaluate((selectors) => {
        return selectors.flatMap((selector) => {
          const node = document.querySelector(selector);

          if (!node) return [`missing ${selector}`];

          const rect = node.getBoundingClientRect();
          const outsideLeft = rect.left < -2;
          const outsideRight = rect.right > window.innerWidth + 2;
          const hasSize = rect.width > 0 && rect.height > 0;

          return hasSize && (outsideLeft || outsideRight)
            ? [`${selector}: left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)} width=${window.innerWidth}`]
            : [];
        });
      }, surfaces);

      expect(clipped).toEqual([]);
      expect(messages).toEqual([]);
    });
  }
});
