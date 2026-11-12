import { test } from "@playwright/test";
import { build } from "vite";
import { resolve } from "node:path";
import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import "../handoff/site-showcase.spec.ts";

// This optional fixture is a local copy of the destination React components.
// The standalone suite must remain runnable in a fresh checkout without it.
test.skip(!existsSync(resolve("tmp/site-fix/main.tsx")), "Local website fixture is unavailable. Run the handoff tests in the website project.");

test.beforeAll(async () => {
  process.env.SHOWCASE_TEST_PATH = "/site-check/";
  await build({ configFile: false, root: resolve("tmp/site-fix"), base: "/site-check/",
    resolve: { alias: { "@": resolve("tmp/site-fix/src"), "next/image": resolve("tmp/site-fix/image.tsx") } },
    build: { outDir: resolve("dist/site-check"), emptyOutDir: true },
  });
  await mkdir("dist/guven", { recursive: true });
  await cp("public/mirror", "dist/guven/mirror", { recursive: true });
});
