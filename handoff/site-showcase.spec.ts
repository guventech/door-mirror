import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // These scripts are supplied by the deployment platform, not local next start.
  await page.route("**/_vercel/**/script.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
});

for (const width of [1440, 390]) {
  test(`${width}px: mirror selection, neutral evidence and phone dialog`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1080 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(process.env.SHOWCASE_TEST_PATH ?? "/guven");
    const mirror = page.locator("#mirror");
    await expect(mirror).toBeVisible();
    for (const button of await page.getByRole("button").all()) {
      expect(
        (await button.getAttribute("aria-label")) ||
          (await button.innerText()).trim(),
      ).not.toBe("");
    }
    await expect(mirror).not.toContainText(/[;\u2014]/);
    await mirror
      .getByRole("button", { name: "Load 3D viewer", exact: true })
      .click();
    await expect(mirror.locator("canvas")).toBeVisible();
    await page.screenshot({ path: `tmp/screenshots/site-${width}-loaded.png` });
    const dialog = mirror.locator("dialog");
    if (width === 390) {
      await expect(dialog).toHaveJSProperty("open", true);
      expect(await dialog.evaluate((el) => el.matches(":modal"))).toBe(true);
      await expect(
        mirror.getByRole("button", { name: "Close viewer ×", exact: true }),
      ).toBeVisible();
    }
    await mirror.getByRole("slider").fill("100");
    for (const level of ["Low", "Mid", "High"]) {
      await mirror.getByRole("button", { name: level, exact: true }).click();
      const canvas = mirror.locator("canvas");
      await canvas.scrollIntoViewIfNeeded();
      const rect = (await canvas.boundingBox())!;
      for (let angle = 0; angle < 3; angle++) {
        await canvas.hover({
          position: { x: rect.width * 0.5, y: rect.height * 0.5 },
        });
        await page.mouse.down();
        await page.mouse.move(
          rect.x + rect.width * 0.5 + Math.min(100, rect.width * 0.25),
          rect.y + rect.height * 0.5,
          { steps: 8 },
        );
        await page.mouse.up();
        await canvas.screenshot({
          path: `tmp/screenshots/site-${width}-${level}-${angle}.png`,
        });
      }
    }
    await mirror.locator('[data-part="housing"]').click();
    await mirror.locator('[data-part="camera"]').click();
    await expect(
      mirror.locator('[data-part][aria-pressed="true"]'),
    ).toHaveCount(1);
    await expect(mirror.locator('[data-part="camera"]')).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await mirror.locator('[data-part="housing"]').hover();
    const colors = await mirror.evaluate((root) =>
      ["housing", "camera"].map(
        (id) =>
          getComputedStyle(root.querySelector(`[data-part="${id}"]`)!)
            .backgroundColor,
      ),
    );
    expect(colors[0]).not.toBe(colors[1]);
    await mirror.getByText("Evidence and limits", { exact: true }).click();
    const summary = mirror.locator("summary");
    await expect
      .poll(async () => (await summary.boundingBox())!.y)
      .toBeGreaterThanOrEqual(width === 390 ? 64 : 80);
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.screenshot({
      path: `tmp/screenshots/site-${width}-evidence.png`,
    });
    const links = mirror.locator("details a");
    for (const link of await links.all()) {
      expect(["patents.google.com", "www.nhtsa.gov"]).toContain(
        new URL((await link.getAttribute("href"))!).hostname,
      );
    }
    if (width === 390) {
      const close = mirror.getByRole("button", {
        name: "Close viewer ×",
        exact: true,
      });
      await expect(close).toBeInViewport();
      await close.click();
      expect(await dialog.evaluate((el) => el.matches(":modal"))).toBe(false);
      await expect(
        mirror.getByRole("button", { name: "Open full screen", exact: true }),
      ).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
      await mirror
        .getByRole("button", { name: "Open full screen", exact: true })
        .click();
      await page.keyboard.press("Escape");
      expect(await dialog.evaluate((el) => el.matches(":modal"))).toBe(false);
    }
    const projects = page.getByRole("heading", {
      name: "Personal projects",
      exact: true,
    });
    if (await projects.count()) {
      expect(
        await projects.locator("../..").locator("article").count(),
      ).toBeGreaterThan(0);
    }
    expect(errors).toEqual([]);
  });
}
