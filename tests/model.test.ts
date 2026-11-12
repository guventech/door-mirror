import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parts, activeParts, positionAt } from "../src/parts.ts";
import { Box3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const binary = readFileSync(
  new URL("../public/mirror/mirror.glb", import.meta.url),
);
const jsonLength = binary.readUInt32LE(12);
const gltf = JSON.parse(binary.toString("utf8", 20, 20 + jsonLength));

test("the actual exported asset has no module box intersections at full explosion in every spec", async () => {
  const { scene } = await new GLTFLoader().parseAsync(
    binary.buffer.slice(
      binary.byteOffset,
      binary.byteOffset + binary.byteLength,
    ),
    "",
  );
  const assembly = scene.getObjectByName("genericDoorMirror")!;
  for (const group of assembly.children)
    group.position.fromArray(
      positionAt(
        [0, 0, 0],
        group.userData.explode,
        1,
        group.userData.explodePath,
      ),
    );
  scene.updateMatrixWorld(true);
  for (const level of ["Low", "Mid", "High"] as const) {
    const enabled = new Set<string>(activeParts(level).map((p) => p.id));
    const groups = assembly.children.filter((g) => enabled.has(g.name));
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++)
        assert.equal(
          new Box3()
            .setFromObject(groups[i])
            .intersectsBox(new Box3().setFromObject(groups[j])),
          false,
          `${level}: ${groups[i].name} intersects ${groups[j].name}`,
        );
    }
  }
});

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
