import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parts } from "../src/parts.ts";

const binary = readFileSync(
  new URL("../public/mirror/mirror.glb", import.meta.url),
);
const jsonLength = binary.readUInt32LE(12);
const gltf = JSON.parse(binary.toString("utf8", 20, 20 + jsonLength));

test("the exported GLB has an explicit assembly with every selectable part and explode metadata", () => {
  assert.equal(binary.readUInt32LE(0), 0x46546c67);
  const assembly = gltf.nodes.find(
    (node: { name: string }) => node.name === "genericDoorMirror",
  );
  assert.ok(assembly);
  const groups = assembly.children.map((index: number) => gltf.nodes[index]);
  assert.deepEqual(
    groups.map((node: { name: string }) => node.name).sort(),
    parts
      .filter((p) => p.id !== "autoDim")
      .map((p) => p.id)
      .sort(),
  );
  groups.forEach((node: { extras: { explode: number[] } }) =>
    assert.equal(node.extras.explode.length, 3),
  );
  assert.ok(
    gltf.nodes.some(
      (node: { extras?: { glassSurface?: boolean } }) =>
        node.extras?.glassSurface,
    ),
  );
});

test("model stays within the asset budget without external textures or decoders", () => {
  assert.ok(binary.length < 2_000_000);
  assert.equal(gltf.images?.length ?? 0, 0);
  assert.equal(gltf.extensionsRequired?.length ?? 0, 0);
  assert.equal(gltf.buffers[0].uri, undefined);
  const triangles = gltf.meshes.reduce(
    (
      sum: number,
      mesh: {
        primitives: { indices?: number; attributes: { POSITION: number } }[];
      },
    ) =>
      sum +
      mesh.primitives.reduce(
        (count, p) =>
          count + gltf.accessors[p.indices ?? p.attributes.POSITION].count / 3,
        0,
      ),
    0,
  );
  assert.ok(triangles < 50_000);
});
