import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createMirror } from "../scripts/model.mjs";
import { activeParts, positionAt } from "../src/parts.ts";

for (const level of ["Low", "Mid", "High"] as const) {
  test(`${level}: every module has a separate bounding box at full explosion`, () => {
    const assembly = createMirror();
    const enabled = new Set(activeParts(level).map((p) => p.id));
    const modules = assembly.children.filter((g) =>
      enabled.has(g.name as never),
    );
    for (const group of modules) {
      group.position.fromArray(
        positionAt(
          [0, 0, 0],
          group.userData.explode,
          1,
          group.userData.explodePath,
        ),
      );
    }
    assembly.updateMatrixWorld(true);
    for (let i = 0; i < modules.length; i++) {
      for (let j = i + 1; j < modules.length; j++) {
        assert.equal(
          new THREE.Box3()
            .setFromObject(modules[i])
            .intersectsBox(new THREE.Box3().setFromObject(modules[j])),
          false,
          `${modules[i].name} overlaps ${modules[j].name}`,
        );
      }
    }
  });
}

test("separated modules do not cross back through each other during explosion", () => {
  const assembly = createMirror();
  const cleared = new Set<string>();
  for (let step = 0; step <= 100; step++) {
    for (const group of assembly.children)
      group.position.fromArray(
        positionAt(
          [0, 0, 0],
          group.userData.explode,
          step / 100,
          group.userData.explodePath,
        ),
      );
    assembly.updateMatrixWorld(true);
    const boxes = assembly.children.map((g) =>
      new THREE.Box3().setFromObject(g),
    );
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const key = `${assembly.children[i].name}/${assembly.children[j].name}`;
        const overlap = boxes[i].intersectsBox(boxes[j]);
        if (!overlap) cleared.add(key);
        else assert.ok(!cleared.has(key), `${key} crosses at ${step}%`);
      }
    }
  }
});

test("the fully exploded bracket clears the housing envelope", () => {
  const assembly = createMirror();
  for (const group of assembly.children)
    group.position.fromArray(
      positionAt(
        [0, 0, 0],
        group.userData.explode,
        1,
        group.userData.explodePath,
        group.userData.explodeFinish,
      ),
    );
  assembly.updateMatrixWorld(true);
  const bracket = new THREE.Box3().setFromObject(
    assembly.getObjectByName("structuralCarrierBracket")!,
  );
  const housing = new THREE.Box3().setFromObject(
    assembly.getObjectByName("housing")!,
  );
  assert.equal(
    bracket.intersectsBox(housing),
    false,
    "the bracket must not cut through the housing in the exploded pose",
  );
});

test("the bracket clears the open face before it moves sideways", () => {
  const assembly = createMirror();
  const base = assembly.getObjectByName("base")!;
  const actuator = assembly.getObjectByName("actuator")!;
  assert.deepEqual(
    positionAt(
      [0, 0, 0],
      base.userData.explode,
      0.3,
      base.userData.explodePath,
    ),
    [0, 0, 0],
  );
  assert.equal(
    positionAt(
      [0, 0, 0],
      actuator.userData.explode,
      0.35,
      actuator.userData.explodePath,
      actuator.userData.explodeFinish,
    )[2],
    actuator.userData.explode[2],
  );
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    base.position.fromArray(
      positionAt(
        [0, 0, 0],
        base.userData.explode,
        t,
        base.userData.explodePath,
      ),
    );
    assembly.updateMatrixWorld(true);
    if (base.position.x < -0.001) {
      const bracket = new THREE.Box3().setFromObject(
        assembly.getObjectByName("structuralCarrierBracket")!,
      );
      const housing = new THREE.Box3().setFromObject(
        assembly.getObjectByName("housing")!,
      );
      assert.ok(
        bracket.min.z > housing.max.z,
        "lateral extraction must stay in front of the housing",
      );
    }
  }
  assert.deepEqual(
    positionAt([0, 0, 0], base.userData.explode, 0, base.userData.explodePath),
    [0, 0, 0],
  );
});

test("all representative geometry has finite positions and normals", () => {
  createMirror().traverse((object: THREE.Object3D) => {
    if (!(object instanceof THREE.Mesh)) return;
    for (const name of ["position", "normal"]) {
      assert.ok(
        Array.from(object.geometry.attributes[name].array).every(
          Number.isFinite,
        ),
        `${object.name || "mesh"} ${name} contains a non-finite value`,
      );
    }
  });
});

test("the housing wall is visible from the cavity and from outside", () => {
  const assembly = createMirror();
  assembly.updateMatrixWorld(true);
  const wall = assembly.getObjectByName("housing")!.children[0];
  const outside = new THREE.Raycaster(
    new THREE.Vector3(2, 0, -0.1),
    new THREE.Vector3(-1, 0, 0),
  );
  assert.ok(
    outside.intersectObject(wall).length > 0,
    "outer wall must face the exterior",
  );
  for (const direction of [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
  ]) {
    const inside = new THREE.Raycaster(
      new THREE.Vector3(0, 0, -0.1),
      direction,
    );
    assert.ok(
      inside.intersectObject(wall).length > 0,
      "the interior must have a real inward-facing wall",
    );
  }
});

test("the housing has a finite wall, rather than a two-sided zero-thickness surface", () => {
  const assembly = createMirror();
  assembly.updateMatrixWorld(true);
  const wall = assembly.getObjectByName("housing")!.children[0] as THREE.Mesh;
  wall.material = (wall.material as THREE.Material).clone();
  (wall.material as THREE.Material).side = THREE.DoubleSide;
  const ray = new THREE.Raycaster(
    new THREE.Vector3(0, 0, -0.1),
    new THREE.Vector3(1, 0, 0),
  );
  const hits = ray.intersectObject(wall).map((hit) => hit.distance);
  const distances = hits.filter(
    (distance, i) => i === 0 || Math.abs(distance - hits[i - 1]) > 1e-4,
  );
  assert.equal(
    distances.length,
    2,
    "ray should cross the inner and outer surfaces",
  );
  assert.ok(
    distances[1] - distances[0] > 0.015 && distances[1] - distances[0] < 0.08,
  );
});

test("screw posts are hollow and rooted in the housing floor", () => {
  const assembly = createMirror();
  assembly.updateMatrixWorld(true);
  const housing = assembly.getObjectByName("housing")!;
  const wall = housing.children[0];
  const posts = housing.children.filter(
    (o: THREE.Object3D) => o.userData.feature === "screwBoss",
  ) as THREE.Mesh[];
  assert.equal(posts.length, 3);
  for (const post of posts) {
    const { x, y } = post.position;
    const bore = new THREE.Raycaster(
      new THREE.Vector3(x, y, 0.3),
      new THREE.Vector3(0, 0, -1),
    );
    assert.equal(
      bore.intersectObject(post).length,
      0,
      "a screw needs an open pilot bore",
    );
    const rim = new THREE.Raycaster(
      new THREE.Vector3(x + 0.055, y, 0.3),
      new THREE.Vector3(0, 0, -1),
    );
    assert.ok(
      rim.intersectObject(post).length > 0,
      "the bore must have a surrounding wall",
    );
    const floor = bore.intersectObject(wall)[0];
    assert.ok(floor);
    assert.ok(
      new THREE.Box3().setFromObject(post).min.z <= floor.point.z + 0.01,
      "post must meet the shell floor",
    );
  }
});

test("heater has one continuous path ending at two connection tabs", () => {
  const assembly = createMirror();
  const heater = assembly.getObjectByName("heater")!;
  const track = heater.getObjectByName(
    "heaterResistivePath",
  ) as THREE.Mesh<THREE.TubeGeometry>;
  const terminals = heater.children.filter(
    (o: THREE.Object3D) => o.userData.feature === "heaterTerminal",
  );
  assert.equal(terminals.length, 2);
  assembly.updateMatrixWorld(true);
  const path = track.geometry.parameters.path;
  for (const t of [0, 1]) {
    const point = path.getPoint(t);
    assert.ok(
      terminals.some((terminal: THREE.Object3D) =>
        new THREE.Box3().setFromObject(terminal).containsPoint(point),
      ),
    );
  }
});

test("glass has a carrier and camera lens is exposed on the underside", () => {
  const assembly = createMirror();
  assembly.updateMatrixWorld(true);
  assert.ok(assembly.getObjectByName("glass")!.getObjectByName("glassCarrier"));
  const lens = assembly.getObjectByName("downwardCameraLens")!;
  const ray = new THREE.Raycaster(
    new THREE.Vector3(0.77, -1.2, -0.08),
    new THREE.Vector3(0, 1, 0),
  );
  assembly.traverse((object: THREE.Object3D) => {
    if (object.userData.blanking) object.visible = false;
  });
  const visible: THREE.Object3D[] = [];
  assembly.traverseVisible((object: THREE.Object3D) => {
    if (object instanceof THREE.Mesh) visible.push(object);
  });
  assert.equal(ray.intersectObjects(visible, false)[0]?.object, lens);
  assert.ok(assembly.getObjectByName("doorSeal"));
  assert.ok(assembly.getObjectByName("basePivotSpindle"));
});

test("the signal lens has an exposed outward view, clear of the glass and shell", () => {
  const assembly = createMirror();
  assembly.updateMatrixWorld(true);
  assembly.traverse((object: THREE.Object3D) => {
    if (object.userData.blanking) object.visible = false;
  });
  const visible: THREE.Object3D[] = [];
  assembly.traverseVisible((object: THREE.Object3D) => {
    if (object instanceof THREE.Mesh) visible.push(object);
  });
  const ray = new THREE.Raycaster(
    new THREE.Vector3(2.2, -0.25, 0.035),
    new THREE.Vector3(-1, 0, 0),
  );
  assert.equal(
    ray.intersectObjects(visible, false)[0]?.object.name,
    "signalLens",
  );
});
