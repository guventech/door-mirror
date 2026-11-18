import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, copyFile, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { parts } from "../src/parts.ts";
import { evidence } from "../src/evidence.ts";

test("site sync accepts matching data and rejects asset or caption drift", async () => {
  const site = await mkdtemp(join(tmpdir(), "mirror-sync-"));
  const dictionary = join(site, "src/lib/i18n/mirror-en.ts");
  const asset = join(site, "public/guven/mirror/poster.png");
  const run = () => spawnSync(process.execPath, [
    "--experimental-strip-types", "scripts/check-site-sync.mjs", site,
  ], { encoding: "utf8" });
  const copyDictionary = (data: unknown) => writeFile(dictionary,
    `export const parts = ${JSON.stringify(data)};\nexport const evidence = ${JSON.stringify(evidence)};\n`);
  try {
    await mkdir(join(site, "src/lib/i18n"), { recursive: true });
    await mkdir(join(site, "public/guven/mirror"), { recursive: true });
    for (const name of ["mirror.glb", "poster.png", "model-info.json"]) {
      await copyFile(new URL(`../public/mirror/${name}`, import.meta.url), join(site, "public/guven/mirror", name));
    }
    await copyDictionary(parts);
    const info = JSON.parse(await readFile(new URL("../public/mirror/model-info.json", import.meta.url), "utf8"));
    await writeFile(join(site, "public/guven/mirror/model-info.json"), JSON.stringify(info));
    const matching = run();
    assert.equal(matching.status, 0, matching.stderr);
    await copyDictionary(parts.map(p => p.id === "housing" ? { ...p, idea: "Changed idea" } : p));
    const captionDrift = run();
    assert.notEqual(captionDrift.status, 0);
    assert.match(captionDrift.stderr, /English part data differs/);
    await copyDictionary(parts);
    await writeFile(asset, "changed poster");
    const assetDrift = run();
    assert.notEqual(assetDrift.status, 0);
    assert.match(assetDrift.stderr, /poster.png differs/);
  } finally {
    await rm(site, { recursive: true, force: true });
  }
});
