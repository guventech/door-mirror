import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parts } from "../src/parts.ts";
import { evidence } from "../src/evidence.ts";

// This command only reads the destination. Run it after an intentional handoff.
const site = process.argv[2]
  ? pathToFileURL(resolve(process.argv[2]) + "/")
  : new URL("../../site/", import.meta.url);
const integrated = await import(new URL("src/lib/i18n/mirror-en.ts", site));
assert.deepEqual(integrated.parts, parts, "English part data differs from src/parts.ts");
assert.deepEqual(integrated.evidence, evidence, "English evidence differs from src/evidence.ts");

for (const name of ["mirror.glb", "poster.png"]) {
  const hash = async url => createHash("sha256").update(await readFile(url)).digest("hex");
  const standalone = await hash(new URL(`../public/mirror/${name}`, import.meta.url));
  const destination = await hash(new URL(`public/guven/mirror/${name}`, site));
  assert.equal(destination, standalone, `${name} differs from the standalone asset`);
}
const metadata = async url => JSON.parse(await readFile(url, "utf8"));
assert.deepEqual(
  await metadata(new URL("public/guven/mirror/model-info.json", site)),
  await metadata(new URL("../public/mirror/model-info.json", import.meta.url)),
  "Model metadata differs from the standalone asset",
);
console.log("Site mirror matches: English parts, evidence, GLB, poster and model metadata.");
