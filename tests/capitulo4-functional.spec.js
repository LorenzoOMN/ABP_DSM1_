const { test, expect } = require("@playwright/test");

const BASE_URL = process.env.CAP4_BASE_URL || "http://127.0.0.1:3104";
const pipelineSequence = ["codigo", "integrar", "testes", "build", "deploy"];

async function clickTaskToDone(page, taskName) {
  const task = page.getByRole("button", { name: taskName, exact: true });

  await task.click();
  await task.click();
  await task.click();
}

async function mockAuthenticatedApis(page) {
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
  await page.route("**/api/progresso/historia/4/concluir", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({ message: "ok" }),
    });
  });
}

test("Capitulo 4 interactive path unlocks every scene", async ({ page }) => {
  test.setTimeout(120000);

  await page.setViewportSize({ width: 390, height: 844 });
  await mockAuthenticatedApis(page);
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.setItem("token", "cap4-functional-check"));
  await page.goto(`${BASE_URL}/capitulo4`);
  await expect(page.locator("h1")).toContainText("Travessia Viva do Tempo Quebrado");

  await page.getByRole("button", { name: "API de progresso", exact: true }).click();
  await page.getByRole("button", { name: "API de progresso", exact: true }).click();
  await page.getByRole("button", { name: "Tela do desafio", exact: true }).click();
  await page.getByRole("button", { name: "Tela do desafio", exact: true }).click();
  await page.getByRole("button", { name: "Ajuste de layout", exact: true }).click();
  await page.getByRole("button", { name: "Ajuste de layout", exact: true }).click();
  await clickTaskToDone(page, "Refinar história");
  await clickTaskToDone(page, "Preparar critério");
  await expect(page.locator("#cena-forja")).not.toHaveClass(/is-locked/);

  for (const criterion of ["codigo", "testes", "criterios", "revisao", "defeitos"]) {
    await page.locator(`[data-dod-check="${criterion}"]`).check();
  }
  await page.locator("#btnValidarDod").click();
  await expect(page.locator("#cena-ponte")).not.toHaveClass(/is-locked/, { timeout: 3000 });

  await page.locator("#cena-ponte").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Rever sequência", exact: true }).click();
  for (let round = 2; round <= pipelineSequence.length; round += 1) {
    await expect(page.locator("[data-pipeline-step=\"codigo\"]")).toBeEnabled({ timeout: 12000 });

    for (const step of pipelineSequence.slice(0, round)) {
      await page.locator(`[data-pipeline-step="${step}"]`).click();
    }
  }
  await expect(page.locator("#cena-divida")).not.toHaveClass(/is-locked/, { timeout: 3000 });

  await page.locator("#refactorVoid").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 1000);
  await expect(page.locator("[data-refactor-tile][data-row=\"2\"][data-col=\"1\"]")).toBeEnabled({ timeout: 5000 });

  const refactorClicks = [
    ["2", "1", 3],
    ["2", "2", 2],
    ["3", "2", 2],
    ["3", "3", 2],
    ["2", "3", 1],
    ["1", "3", 1],
  ];

  for (const [row, col, totalClicks] of refactorClicks) {
    const tile = page.locator(`[data-refactor-tile][data-row="${row}"][data-col="${col}"]`);

    for (let index = 0; index < totalClicks; index += 1) {
      await tile.click();
    }
  }

  await expect(page.locator("[data-refactor-status]")).toContainText("caminho interno voltou", { timeout: 3000 });

  await page.locator("#cena-retrospectiva").scrollIntoViewIfNeeded();
  await page.locator("#retroPositivo").fill("Limitamos WIP e terminamos antes de iniciar novas tarefas.");
  await page.locator("#retroNegativo").fill("Começamos trabalho demais ao mesmo tempo.");
  await page.locator("#retroMelhoria").fill("Reforçar DoD e reservar tempo para refatoração.");
  await page.getByRole("button", { name: "Registrar reflexão", exact: true }).click();
  await expect(page.locator("#cena-finalizar-historia")).not.toHaveClass(/is-locked/, { timeout: 3000 });

  await page.getByRole("button", { name: "Registrar conclusão", exact: true }).click();
  await expect(page.locator("#statusHistoria")).toContainText("Historia concluida", { timeout: 3000 });
  await expect(page.locator("#portaBossScene")).toHaveClass(/porta-liberada/);
});
