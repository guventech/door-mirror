import { mkdir, writeFile } from "node:fs/promises";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import {
  mergeGeometries,
  mergeVertices,
} from "three/addons/utils/BufferGeometryUtils.js";
import { Mesh } from "three";
import { createMirror } from "./model.mjs";

// The exporter uses FileReader in browsers. Node provides Blob but not FileReader.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString("base64")}`;
      this.onloadend?.();
    });
  }
};
const model = createMirror();
// Merge decorative geometry within a selectable part, preserving tagged surfaces.
for (const group of model.children) {
  const batches = new Map();
  for (const child of [...group.children]) {
    if (!child.isMesh || Object.keys(child.userData).length) continue;
    child.updateMatrix();
    const geometry = (
      child.geometry.index
        ? child.geometry.toNonIndexed()
        : child.geometry.clone()
    ).applyMatrix4(child.matrix);
    geometry.deleteAttribute("uv");
    const batch = batches.get(child.material) ?? [];
    batch.push(geometry);
    batches.set(child.material, batch);
    group.remove(child);
  }
  for (const [material, geometries] of batches) {
    const merged = mergeGeometries(geometries);
    if (!merged) throw new Error("Model geometry could not be merged");
    group.add(new Mesh(mergeVertices(merged), material));
  }
}
const exporter = new GLTFExporter();
const binary = await exporter.parseAsync(model, {
  binary: true,
  onlyVisible: false,
});
await mkdir("public/mirror", { recursive: true });
await writeFile("public/mirror/mirror.glb", Buffer.from(binary));
let triangles = 0,
  meshes = 0;
model.traverse((o) => {
  if (o.isMesh) {
    meshes++;
    triangles +=
      (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
  }
});
const report = {
  groups: model.children.map((g) => g.name),
  triangles,
  meshes,
  bytes: binary.byteLength,
  source: "scripts/model.mjs",
  original: true,
};
await writeFile(
  "public/mirror/model-info.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
if (binary.byteLength > 2_000_000 || triangles >= 50_000)
  throw new Error("Model exceeds the working asset budget");
