import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("site theme tokens work in dark and light mode and the choice persists", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/light/);
  expect(
    await page
      .locator("html")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--color-accent").trim(),
      ),
  ).toBe("#6cc0d2");
  const dark = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(dark.violations).toEqual([]);
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await page.locator("#explode").fill("100");
  await page.screenshot({
    path: "tmp/screenshots/site-dark-exploded.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Switch to light theme", exact: true })
    .click();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(
    await page
      .locator("html")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--color-accent").trim(),
      ),
  ).toBe("#0f4c5c");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
});

test("the workbench has no automatically detected accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-part="glass"]').click();
  await page.getByText("Evidence and limits", { exact: true }).click();
  const mobile = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(mobile.violations).toEqual([]);
});

test("every insight separates function, cost proposal, checks and linked evidence", async ({
  page,
}) => {
  await page.goto("/");
  const rows = page.locator("[data-part]");
  for (let i = 0; i < (await rows.count()); i++) {
    await rows.nth(i).click();
    const detail = page.locator("#detail-card");
    for (const heading of ["What it does", "A cost idea", "Still to check"])
      await expect(
        detail.getByRole("heading", { name: heading, exact: true }),
      ).toBeVisible();
    await detail.getByText("Evidence and limits", { exact: true }).click();
    const links = detail.locator(".detail-evidence a");
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute("href", /^https:\/\//);
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    await page.keyboard.press("Escape");
  }
});

test("housing interior remains visible in exploded front and rear views", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await page.locator("#explode").fill("100");
  await page.locator('[data-part="housing"]').click();
  await page.getByText("Evidence and limits", { exact: true }).click();
  await page.screenshot({
    path: "tmp/screenshots/housing-insight.png",
    fullPage: true,
  });
  const canvas = page.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const front = await canvas.screenshot({
    path: "tmp/screenshots/housing-front.png",
  });
  const box = (await canvas.boundingBox())!;
  await canvas.hover({ position: { x: box.width * 0.5, y: box.height * 0.5 } });
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width * 0.5 + 280,
    box.y + box.height * 0.5 - 35,
    { steps: 12 },
  );
  await page.mouse.up();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await expect(
    page.getByRole("heading", { name: "Housing", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () => (await canvas.screenshot()).equals(front))
    .toBe(false);
  await canvas.screenshot({
    path: "tmp/screenshots/housing-rear.png",
  });
});

test("first paint stays static and the parts explorer works without loading 3D", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /Load 3D viewer/ }),
  ).toBeVisible();
  await expect(page.locator("#poster")).toBeVisible();
  await page.locator("#workbench").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "High Full feature", exact: true })
    .click();
  await page.locator('[data-part="camera"]').click();
  await expect(
    page.getByRole("heading", { name: "Side camera", exact: true }),
  ).toBeVisible();
  expect(requests.filter((url) => /viewer-.*\.js|\.glb/.test(url))).toEqual([]);
  expect(await page.locator("canvas").count()).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("#detail-card")).toBeHidden();
  await expect(page.locator('[data-part="camera"]')).toBeFocused();
  await page.screenshot({
    path: "tmp/screenshots/desktop-static.png",
    fullPage: true,
  });
});

test("the real model loads on activation and controls preserve explosion across levels", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  const model = page.waitForResponse((response) =>
    response.url().endsWith("/mirror/mirror.glb"),
  );
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  expect((await model).status()).toBe(200);
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await expect(page.locator("canvas")).toBeVisible();
  const captureStyle = await page.addStyleTag({
    content:
      ":root,body,.stage,.workbench{background:transparent!important}.stage::after{display:none!important}.stage-top,.stage-bottom{visibility:hidden!important}",
  });
  const posterBounds = (await page.locator("canvas").boundingBox())!;
  await page.screenshot({
    path: "tmp/screenshots/mirror-poster.png",
    omitBackground: true,
    clip: {
      x: posterBounds.x + 2,
      y: posterBounds.y + 2,
      width: posterBounds.width - 4,
      height: posterBounds.height - 4,
    },
  });
  await captureStyle.evaluate((element) => element.remove());
  await page.locator("#explode").fill("100");
  await expect(page.locator("#explode-value")).toHaveText("100%");
  await page.locator('[data-level="High"]').click();
  await expect(page.locator("#part-count")).toHaveText("15");
  await expect(page.locator("#explode")).toHaveValue("100");
  await page.locator('[data-part="glass"]').click();
  await expect(page.locator(".dim-note")).toContainText("High option");
  await page.screenshot({
    path: "tmp/screenshots/desktop-exploded.png",
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await page.locator("#reset-view").click();
  await expect(page.locator("#explode")).toHaveValue("0");
  await page.locator('[data-level="Mid"]').click();
  await page.screenshot({
    path: "tmp/screenshots/desktop-model.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("canvas picking selects glass, while a rotation drag does not open a card", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  const canvas = page.locator("canvas");
  const bounds = (await canvas.boundingBox())!;
  await canvas.click({
    position: { x: bounds.width * 0.52, y: bounds.height * 0.52 },
  });
  await expect(
    page.getByRole("heading", { name: "Mirror glass", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await canvas.scrollIntoViewIfNeeded();
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 80,
    box.y + box.height / 2 + 20,
    { steps: 6 },
  );
  await page.mouse.up();
  await expect(page.locator("#detail-card")).toBeHidden();
});

test("animation can stop midway and reverse back to the assembled state", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await page.locator("#animate").click();
  await expect.poll(() => page.locator("#explode").inputValue()).not.toBe("0");
  await page.locator("#animate").click();
  await expect(page.locator("#animate-label")).toHaveText("Animate explode");
  const stopped = await page.locator("#explode").inputValue();
  expect(Number(stopped)).toBeGreaterThan(0);
  expect(Number(stopped)).toBeLessThan(100);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await expect(page.locator("#explode")).toHaveValue(stopped);
  await page.locator("#animate").click();
  await expect(page.locator("#explode")).toHaveValue("0");
});

test("an unavailable option switches level and lowering the level closes that selection", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-part="autoDim"]').click();
  await expect(page.locator('[data-level="High"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: "Auto-dimming glass", exact: true }),
  ).toBeVisible();
  await page.locator('[data-level="Low"]').click();
  await expect(page.locator("#detail-card")).toBeHidden();
  await expect(page.locator("#part-count")).toHaveText("9");
});

test("failed model loading keeps the poster and parts explorer usable and permits retry", async ({
  page,
}) => {
  await page.route("**/mirror/mirror.glb", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(
    page.getByRole("button", { name: "Try again", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#poster")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.locator('[data-part="housing"]').click();
  await expect(
    page.getByRole("heading", { name: "Housing", exact: true }),
  ).toBeVisible();
  await page.unroute("**/mirror/mirror.glb");
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
});

test("missing WebGL uses the static fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: unknown[]
    ) {
      if (type.startsWith("webgl")) return null;
      return original.apply(this, [type, ...args] as never);
    } as typeof original;
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#load-message")).toContainText(
    "You can still explore every part below.",
  );
  await expect(page.locator("#poster")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("reduced motion jumps directly to the exploded state", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await page.locator("#animate").click();
  await expect(page.locator("#explode")).toHaveValue("100");
  await page.locator("#animate").click();
  await expect(page.locator("#explode")).toHaveValue("0");
});

test("phone layout stays within the viewport before and after loading", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "tmp/screenshots/mobile-static.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await page.locator("#explode").fill("60");
  await page.screenshot({
    path: "tmp/screenshots/mobile-model.png",
    fullPage: true,
  });
  expect(
    await page
      .locator("canvas")
      .evaluate((canvas) => getComputedStyle(canvas).touchAction),
  ).toBe("pan-y pinch-zoom");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 320, height: 720 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("the renderer does no drawing while the workbench is off screen", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as Window & { mirrorDrawCalls: number };
    state.mirrorDrawCalls = 0;
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      state.mirrorDrawCalls++;
      return original.apply(this, args);
    };
  });
  await page.setViewportSize({ width: 1000, height: 600 });
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const settle = () =>
    page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
  await settle();
  const count = () =>
    page.evaluate(
      () => (window as Window & { mirrorDrawCalls: number }).mirrorDrawCalls,
    );
  const before = await count();
  expect(before).toBeGreaterThan(0);
  await page.locator("#explode").evaluate((input: HTMLInputElement) => {
    input.value = "60";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await settle();
  expect(await count()).toBe(before);
  await page.locator("#stage").scrollIntoViewIfNeeded();
  await expect.poll(count).toBeGreaterThan(before);
});

test("a lost rendering context returns to the poster and can be retried", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Load 3D viewer/ }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
  await page
    .locator("canvas")
    .dispatchEvent("webglcontextlost", { cancelable: true });
  await expect(page.locator("#poster")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("#explode")).toBeDisabled();
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.locator("#stage-status")).toHaveText("LIVE 3D");
});
