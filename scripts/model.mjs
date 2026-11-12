import * as T from "three";

// Original procedural design. Units are illustrative, not manufacturing dimensions.
const outline = [
  [-1.32, -0.58],
  [-1.52, -0.19],
  [-1.48, 0.36],
  [-1.14, 0.67],
  [0.62, 0.79],
  [1.25, 0.62],
  [1.48, 0.24],
  [1.4, -0.32],
  [1.1, -0.58],
  [-0.65, -0.68],
];
const curve = new T.CatmullRomCurve3(
  outline.map(([x, y]) => new T.Vector3(x, y, 0)),
  true,
  "centripetal",
);
const contour = curve.getPoints(72).slice(0, -1);
const mounts = [
  [-0.55, 0.32],
  [0.55, 0.32],
  [0.24, -0.5],
];
function material(color, roughness = 0.55, metalness = 0) {
  return new T.MeshStandardMaterial({ color, roughness, metalness });
}
const charcoal = material("#303833", 0.53, 0.15),
  dark = material("#161e1b", 0.45, 0.1);
const white = material("#dedfd5", 0.29, 0.12),
  metal = material("#9caaa6", 0.3, 0.8);
const amber = material("#d98a35", 0.24, 0.35),
  glass = material("#b1c9d4", 0.12, 0.98);
const copper = material("#a86b43", 0.54, 0.5),
  rubber = material("#343b34", 0.95);

function plate(scale, depth) {
  const shape = new T.Shape(
    contour.map((p) => new T.Vector2(p.x * scale, p.y * scale)),
  );
  return new T.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: Math.min(depth * 0.2, 0.012),
    bevelThickness: Math.min(depth * 0.2, 0.008),
    curveSegments: 12,
  });
}
function shell(rings, profile = contour) {
  const positions = [],
    indices = [];
  rings.forEach(([scale, z]) =>
    profile.forEach((p) => positions.push(p.x * scale, p.y * scale, z)),
  );
  for (let r = 0; r < rings.length - 1; r++)
    for (let i = 0; i < profile.length; i++) {
      const a = r * profile.length + i,
        b = r * profile.length + ((i + 1) % profile.length),
        c = a + profile.length,
        d = b + profile.length;
      indices.push(a, b, c, b, d, c);
    }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// A closed thin-walled cup, including the lip and the cut edges of option ports.
// The inner skin follows the outer vertex normals. This is a visual wall offset,
// not a resin-specific mould, draft analysis or dimensional production model.
function hollowShell(
  rings,
  thickness = 0.035,
  ports = false,
  profile = contour,
) {
  const outer = shell(rings, profile);
  const original = Array.from(outer.attributes.position.array);
  const center = original.length / 3;
  original.push(0, 0, rings.at(-1)[1]);
  const source = Array.from(outer.index.array);
  const last = (rings.length - 1) * profile.length;
  for (let i = 0; i < profile.length; i++)
    source.push(last + i, last + ((i + 1) % profile.length), center);
  outer.setAttribute("position", new T.Float32BufferAttribute(original, 3));
  outer.setIndex(source);
  outer.deleteAttribute("normal");
  outer.computeVertexNormals();
  const normals = outer.attributes.normal.array;
  const positions = [...original];
  for (let i = 0; i < original.length; i++)
    positions.push(original[i] - normals[i] * thickness);
  const count = center + 1,
    triangles = [],
    edges = new Map();
  const inPort = (x, y, z) =>
    ports &&
    ((y < -0.48 && x > 0.54 && x < 1.0 && z > -0.27 && z < 0.14) ||
      (y < -0.48 && x > -0.44 && x < -0.05 && z > -0.38 && z < 0.08) ||
      (x > 1.24 && y > -0.35 && y < -0.1 && z > -0.12 && z < 0.18));
  for (let i = 0; i < source.length; i += 3) {
    const [a, b, c] = source.slice(i, i + 3);
    const x = (original[a * 3] + original[b * 3] + original[c * 3]) / 3;
    const y =
      (original[a * 3 + 1] + original[b * 3 + 1] + original[c * 3 + 1]) / 3;
    const z =
      (original[a * 3 + 2] + original[b * 3 + 2] + original[c * 3 + 2]) / 3;
    if (inPort(x, y, z)) continue;
    triangles.push(a, b, c, a + count, c + count, b + count);
    for (const [start, end] of [
      [a, b],
      [b, c],
      [c, a],
    ]) {
      const key = [start, end].sort((a, b) => a - b).join(":");
      const edge = edges.get(key);
      if (edge) edge.count++;
      else edges.set(key, { start, end, count: 1 });
    }
  }
  for (const { start: a, end: b, count: uses } of edges.values()) {
    if (uses === 1) triangles.push(b, a, a + count, b, a + count, b + count);
  }
  // Cutouts can leave unused vertices. Remove them before computing normals.
  const compact = [],
    remap = new Map();
  const indices = triangles.map((index) => {
    if (!remap.has(index)) {
      remap.set(index, compact.length / 3);
      compact.push(...positions.slice(index * 3, index * 3 + 3));
    }
    return remap.get(index);
  });
  const geometry = new T.BufferGeometry();
  geometry.setAttribute("position", new T.Float32BufferAttribute(compact, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  outer.dispose();
  return geometry;
}

function annulus(outerRadius, innerRadius, depth, segments = 28) {
  const shape = new T.Shape();
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
  const hole = new T.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return new T.ExtrudeGeometry(shape, {
    depth,
    steps: 1,
    bevelEnabled: false,
    curveSegments: segments / 2,
  });
}

function screwBoss(parent, x, y, back = -0.49, front = -0.035) {
  back =
    Math.min(
      ...Array.from({ length: 8 }, (_, i) =>
        floorAt(
          parent,
          x + 0.08 * Math.cos((i * Math.PI) / 4),
          y + 0.08 * Math.sin((i * Math.PI) / 4),
          back,
        ),
      ),
    ) - 0.004;
  const boss = mesh(parent, annulus(0.086, 0.032, front - back), charcoal, [
    x,
    y,
    back,
  ]);
  boss.name = "coredScrewPost";
  boss.userData.feature = "screwBoss";
  // Taper the post toward the tool opening. The bore stays open.
  const positions = boss.geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const z = positions.getZ(i),
      ratio = Math.hypot(positions.getX(i), positions.getY(i));
    if (ratio > 0.06) {
      const scale = 1 - (0.12 * z) / (front - back);
      positions.setXY(i, positions.getX(i) * scale, positions.getY(i) * scale);
    }
  }
  boss.geometry.computeVertexNormals();
  return boss;
}

function floorAt(parent, x, y, fallback) {
  const wall = parent.getObjectByName("housingWall");
  if (!wall) return fallback;
  wall.updateMatrixWorld(true);
  const ray = new T.Raycaster(
    new T.Vector3(x, y, 0.3),
    new T.Vector3(0, 0, -1),
  );
  return ray.intersectObject(wall)[0]?.point.z ?? fallback;
}

function rib(parent, from, to, back = -0.52, front = -0.08) {
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const geometry = new T.BoxGeometry(length, 0.025, front - back);
  const positions = geometry.attributes.position;
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  for (let i = 0; i < positions.count; i++) {
    const ratio = (positions.getZ(i) + (front - back) / 2) / (front - back);
    positions.setY(i, positions.getY(i) * (1 - 0.2 * ratio));
    const x =
      (from[0] + to[0]) / 2 +
      positions.getX(i) * Math.cos(angle) -
      positions.getY(i) * Math.sin(angle);
    const y =
      (from[1] + to[1]) / 2 +
      positions.getX(i) * Math.sin(angle) +
      positions.getY(i) * Math.cos(angle);
    const floor = floorAt(parent, x, y, back);
    const along = positions.getX(i) / length + 0.5;
    const top =
      floor +
      Math.min(0.07, (front - floor) * 0.5) +
      along * Math.max(0, front - floor - 0.07);
    positions.setZ(i, (ratio > 0.5 ? top : floor - 0.004) - (back + front) / 2);
  }
  geometry.computeVertexNormals();
  const part = mesh(parent, geometry, charcoal, [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (back + front) / 2,
  ]);
  part.rotation.z = angle;
  part.userData.feature = "supportRib";
  return part;
}
function mesh(parent, geometry, mat, pos = [0, 0, 0]) {
  const m = new T.Mesh(geometry, mat);
  m.position.fromArray(pos);
  parent.add(m);
  return m;
}
function box(parent, size, mat, pos = [0, 0, 0], radius = 0.04) {
  const [w, h, d] = size;
  const s = new T.Shape();
  s.moveTo(-w / 2 + radius, -h / 2);
  s.lineTo(w / 2 - radius, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
  s.lineTo(w / 2, h / 2 - radius);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
  s.lineTo(-w / 2 + radius, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius);
  s.lineTo(-w / 2, -h / 2 + radius);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
  const g = new T.ExtrudeGeometry(s, {
    depth: d,
    bevelEnabled: true,
    bevelSize: 0.015,
    bevelThickness: 0.015,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 5,
  });
  g.translate(0, 0, -d / 2);
  return mesh(parent, g, mat, pos);
}
function cylinder(parent, radius, depth, mat, pos) {
  const m = mesh(
    parent,
    new T.CylinderGeometry(radius, radius, depth, 32),
    mat,
    pos,
  );
  m.rotation.x = Math.PI / 2;
  return m;
}
function tube(parent, points, radius, mat) {
  const c = new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p)));
  return mesh(parent, new T.TubeGeometry(c, 28, radius, 7, false), mat);
}

export function createMirror() {
  const root = new T.Group();
  root.name = "genericDoorMirror";
  const group = (name, explode) => {
    const g = new T.Group();
    g.name = name;
    g.userData = { explode, explodeFinish: 0.35 };
    root.add(g);
    return g;
  };
  const housing = group("housing", [0, 0, 0]);
  const housingWall = mesh(
    housing,
    hollowShell(
      [
        [1, 0.23],
        [1.045, 0.13],
        [1.04, -0.06],
        [0.97, -0.3],
        [0.72, -0.5],
        [0.18, -0.56],
      ],
      0.035,
      true,
    ),
    charcoal,
  );
  housingWall.name = "housingWall";
  housingWall.userData.feature = "thinWalledHousing";
  const rimMat = material("#161f1c", 0.38, 0.2);
  mesh(
    housing,
    shell([
      [0.96, 0.245],
      [1.025, 0.22],
    ]),
    rimMat,
  );
  // Posts meet the bowl floor. Thin gussets connect each mounting area to it.
  for (const [x, y] of mounts) {
    screwBoss(housing, x, y);
    rib(housing, [x - 0.24, y - 0.1], [x, y]);
    rib(housing, [x + 0.24, y + 0.1], [x, y]);
  }
  rib(housing, [-1.24, -0.3], [-0.5, 0.32], -0.46, -0.16);
  rib(housing, [-1.24, -0.3], [0, -0.49], -0.46, -0.16);
  // A wiring saddle is open to the draw direction, with a flexible lead loop.
  box(housing, [0.14, 0.05, 0.09], charcoal, [-0.88, -0.36, -0.18], 0.015);
  const cap = group("cap", [0, 1.7, -0.4]);
  const capMat = white.clone();
  // Cosmetic upper cover. Lower ports stay entirely in the lower housing.
  const capContour = contour.map(
    (p) => new T.Vector3(p.x, Math.max(p.y, -0.12), 0),
  );
  mesh(
    cap,
    hollowShell(
      [
        [1.023, -0.035],
        [1.04, -0.2],
        [0.96, -0.48],
        [0.76, -0.72],
        [0.45, -0.87],
        [0.15, -0.94],
      ],
      0.032,
      false,
      capContour,
    ),
    capMat,
  );
  // Cantilever tabs have separate catches. Exact tool release remains unvalidated.
  for (const x of [-0.9, 0.9]) {
    const tab = box(cap, [0.065, 0.08, 0.34], white, [x, 0.42, -0.34], 0.012);
    tab.userData.feature = "coverSnap";
    box(cap, [0.105, 0.05, 0.06], white, [x, 0.46, -0.16], 0.01);
    box(housing, [0.17, 0.035, 0.1], charcoal, [x, 0.52, -0.22], 0.01);
    for (const dx of [-0.085, 0.085])
      box(housing, [0.035, 0.12, 0.1], charcoal, [x + dx, 0.46, -0.22], 0.01);
  }
  const glassGroup = group("glass", [0, 0.02, 2.65]);
  const carrier = mesh(glassGroup, plate(0.9, 0.03), charcoal, [0, 0, 0.185]);
  carrier.name = "glassCarrier";
  carrier.userData.feature = "glassCarrier";
  const coupling = mesh(
    glassGroup,
    annulus(0.29, 0.235, 0.085),
    dark,
    [0, 0, 0.11],
  );
  coupling.userData.feature = "carrierCoupling";
  for (const x of [-0.52, 0.52])
    rib(glassGroup, [x, -0.3], [x, 0.3], 0.15, 0.18);
  const glassMesh = mesh(glassGroup, plate(0.928, 0.027), glass, [0, 0, 0.25]);
  glassMesh.userData.glassSurface = true;
  const heater = group("heater", [0, -0.02, 1.85]);
  const film = mesh(
    heater,
    plate(0.87, 0.006),
    material("#686e59", 0.9),
    [0, 0, 0.229],
  );
  film.userData.feature = "heaterFilm";
  const path = [];
  for (let row = 0; row < 6; row++) {
    const y = -0.42 + row * 0.17;
    path.push(
      [row % 2 ? 1.0 : -1.0, y, 0.239],
      [row % 2 ? -1.0 : 1.0, y, 0.239],
    );
  }
  const circuit = tube(heater, path, 0.005, material("#383c34", 0.85));
  circuit.name = "heaterResistivePath";
  circuit.userData.feature = "continuousHeaterCircuit";
  for (const y of [-0.42, 0.43]) {
    const terminal = box(
      heater,
      [0.13, 0.07, 0.018],
      copper,
      [-1.06, y, 0.24],
      0.01,
    );
    terminal.userData.feature = "heaterTerminal";
  }
  const actuator = group("actuator", [0, 0.02, 0.95]);
  cylinder(actuator, 0.47, 0.19, charcoal, [0, 0, -0.015]);
  cylinder(actuator, 0.36, 0.075, metal, [0, 0, 0.105]);
  cylinder(actuator, 0.15, 0.11, dark, [0, 0, 0.15]);
  for (const x of [-0.43, 0.43])
    box(actuator, [0.3, 0.24, 0.25], dark, [x, -0.22, -0.07]);
  for (const [x, y] of mounts)
    mesh(actuator, annulus(0.09, 0.033, 0.06), charcoal, [x, y, 0.03]);
  for (const side of [-1, 1])
    box(
      actuator,
      [0.29, 0.13, 0.06],
      charcoal,
      [side * 0.43, 0.27, 0.05],
      0.025,
    );
  const base = group("base", [-2, -0.15, 0.7]);
  // Clear the optical stack, lift through the mouth, then move sideways.
  base.userData.explodePath = [
    { at: 0, offset: [0, 0, 0] },
    { at: 0.35, offset: [0, 0, 0] },
    { at: 0.65, offset: [0, 0, 0.55] },
    { at: 1, offset: [-2, -0.15, 0.7] },
  ];
  const footOutline = new T.Shape();
  footOutline.moveTo(-0.26, -0.715);
  footOutline.lineTo(0.26, -0.715);
  footOutline.lineTo(0.21, 0.715);
  footOutline.lineTo(-0.2, 0.715);
  footOutline.closePath();
  const footCore = new T.Path();
  footCore.moveTo(-0.15, -0.61);
  footCore.lineTo(-0.15, 0.61);
  footCore.lineTo(0.16, 0.61);
  footCore.lineTo(0.16, -0.61);
  footCore.closePath();
  footOutline.holes.push(footCore);
  const foot = mesh(
    base,
    new T.ExtrudeGeometry(footOutline, { depth: 0.56, bevelEnabled: false }),
    charcoal,
    [-1.97, -0.25, -0.68],
  );
  foot.name = "coredBaseTrim";
  foot.rotation.z = -0.13;
  const arm = box(
    base,
    [0.83, 0.35, 0.55],
    charcoal,
    [-1.56, -0.54, -0.3],
    0.13,
  );
  arm.rotation.z = 0.22;
  box(base, [0.47, 0.2, 0.64], dark, [-1.32, -0.41, -0.3], 0.08);
  const bracketShape = new T.Shape();
  bracketShape.absellipse(0, 0, 0.76, 0.62, 0, Math.PI * 2, false, 0);
  const centerOpening = new T.Path();
  centerOpening.absarc(0, 0, 0.49, 0, Math.PI * 2, true);
  bracketShape.holes.push(centerOpening);
  for (const [x, y] of mounts) {
    const hole = new T.Path();
    hole.absarc(x, y, 0.033, 0, Math.PI * 2, true);
    bracketShape.holes.push(hole);
  }
  const bracket = mesh(
    base,
    new T.ExtrudeGeometry(bracketShape, {
      depth: 0.045,
      bevelEnabled: false,
      curveSegments: 20,
    }),
    charcoal,
    [0, 0, -0.035],
  );
  bracket.name = "structuralCarrierBracket";
  bracket.userData.feature = "structuralBracket";
  for (const [x, y] of mounts)
    mesh(base, annulus(0.075, 0.033, 0.02), charcoal, [x, y, 0.01]);
  const bridge = new T.Shape();
  bridge.moveTo(-1.65, -0.52);
  bridge.lineTo(-0.55, -0.32);
  bridge.lineTo(-0.58, -0.05);
  bridge.lineTo(-1.65, -0.27);
  bridge.closePath();
  mesh(
    base,
    new T.ExtrudeGeometry(bridge, { depth: 0.055, bevelEnabled: false }),
    charcoal,
    [0, 0, -0.045],
  );
  // The supporting hinge exists on every level, even without power folding.
  const spindle = mesh(
    base,
    annulus(0.15, 0.075, 0.52),
    metal,
    [-1.35, -0.64, -0.26],
  );
  spindle.rotation.x = -Math.PI / 2;
  spindle.name = "basePivotSpindle";
  spindle.userData.feature = "verticalPivot";
  const gasket = group("gasket", [-2.8, -0.15, 0.7]);
  gasket.userData.explodePath = [
    { at: 0, offset: [0, 0, 0] },
    { at: 0.35, offset: [0, 0, 0] },
    { at: 0.65, offset: [0, 0, 0.55] },
    { at: 1, offset: [-2.8, -0.15, 0.7] },
  ];
  const sealShape = new T.Shape();
  sealShape.moveTo(-0.33, -0.74);
  sealShape.lineTo(0.33, -0.74);
  sealShape.lineTo(0.27, 0.74);
  sealShape.lineTo(-0.25, 0.74);
  sealShape.closePath();
  for (const [u, v, radius] of [
    [0, 0, 0.13],
    [0.12, 0.48, 0.05],
    [0.12, -0.48, 0.05],
    [-0.15, 0.2, 0.05],
  ]) {
    const hole = new T.Path();
    hole.absarc(u, v, radius, 0, Math.PI * 2, true);
    sealShape.holes.push(hole);
  }
  const seal = mesh(
    gasket,
    new T.ExtrudeGeometry(sealShape, {
      depth: 0.035,
      bevelEnabled: false,
      curveSegments: 14,
    }),
    rubber,
    [-2.25, -0.25, -0.4],
  );
  seal.rotation.y = Math.PI / 2;
  seal.name = "doorSeal";
  seal.userData.feature = "perforatedGasket";
  const doorPlate = mesh(
    base,
    new T.ExtrudeGeometry(sealShape, {
      depth: 0.05,
      bevelEnabled: false,
      curveSegments: 14,
    }),
    charcoal,
    [-2.2, -0.25, -0.4],
  );
  doorPlate.rotation.y = Math.PI / 2;
  doorPlate.name = "doorMountingFlange";
  const harness = group("harness", [0, -1.42, 0.35]);
  const sheath = material("#242c27", 0.8);
  tube(
    harness,
    [
      [-2, -0.3, -0.35],
      [-1.48, -0.48, -0.27],
      [-0.9, -0.43, -0.06],
      [-0.45, -0.48, 0.06],
      [0.12, -0.33, 0.1],
    ],
    0.035,
    sheath,
  );
  for (const [i, mat] of [charcoal, copper, material("#8e9474")].entries())
    tube(
      harness,
      [
        [0.1, -0.33 + i * 0.025, 0.1],
        [0.35, -0.25 + i * 0.025, 0.05],
        [0.55, -0.12 + i * 0.025, 0.03],
      ],
      0.011,
      mat,
    );
  box(
    harness,
    [0.32, 0.2, 0.23],
    material("#aeaa93"),
    [0.55, -0.1, 0.02],
    0.025,
  );
  for (let i = 0; i < 4; i++)
    box(
      harness,
      [0.025, 0.09, 0.03],
      metal,
      [0.45 + i * 0.06, -0.1, 0.15],
      0.005,
    );
  // Representative service loops and option-specific branches, not a full circuit.
  for (const terminalY of [-0.42, 0.43])
    tube(
      harness,
      [
        [-0.72, -0.34, -0.05],
        [-1.18, -0.22, 0.1],
        [-1.18, terminalY, 0.16],
        [-1.06, terminalY, 0.24],
      ],
      0.012,
      sheath,
    );
  const branches = [
    ["foldMotor", [-1.1, -0.35, -0.27]],
    ["turnSignal", [1.4, -0.25, 0.035]],
    ["puddleLamp", [-0.22, -0.64, -0.21]],
    ["blindSpot", [1.39, 0.2, 0.18]],
    ["camera", [0.77, -0.56, -0.08]],
  ];
  for (const [option, endpoint] of branches) {
    const branch = tube(
      harness,
      [
        [-0.32, -0.4, -0.1],
        [0.15, -0.43, -0.12],
        [endpoint[0], endpoint[1] - 0.06, endpoint[2] - 0.06],
        endpoint,
      ],
      0.013,
      sheath,
    );
    branch.userData.optionFor = option;
  }
  const fasteners = group("fasteners", [0.35, -0.48, 2]);
  for (const [x, y] of mounts) {
    cylinder(fasteners, 0.027, 0.29, metal, [x, y, -0.03]);
    cylinder(fasteners, 0.065, 0.035, metal, [x, y, 0.14]);
    box(fasteners, [0.06, 0.012, 0.008], dark, [x, y, 0.164], 0.003);
  }
  for (const [u, v] of [
    [0.12, 0.48],
    [0.12, -0.48],
    [-0.15, 0.2],
  ]) {
    const stud = mesh(
      base,
      new T.CylinderGeometry(0.035, 0.035, 0.21, 16),
      metal,
      [-2.25, v - 0.25, -0.4 - u],
    );
    stud.rotation.z = Math.PI / 2;
  }
  const fold = group("foldMotor", [-1.1, 0.75, 0.85]);
  const foldRing = mesh(
    fold,
    annulus(0.285, 0.16, 0.29),
    dark,
    [-1.35, -0.5, -0.26],
  );
  foldRing.rotation.x = -Math.PI / 2;
  foldRing.name = "foldGearcase";
  const motor = cylinder(fold, 0.13, 0.35, metal, [-1.1, -0.35, -0.27]);
  motor.rotation.x = 0;
  box(fold, [0.33, 0.22, 0.3], charcoal, [-1.14, -0.49, -0.26], 0.04);
  const signal = group("turnSignal", [0.2, -0.2, -1.25]);
  box(signal, [0.12, 0.14, 0.3], dark, [1.4, -0.25, 0.035], 0.025);
  const lamp = box(
    signal,
    [0.022, 0.1, 0.26],
    amber,
    [1.478, -0.25, 0.035],
    0.008,
  );
  lamp.name = "signalLens";
  const puddle = group("puddleLamp", [0, -1.25, -0.6]);
  box(puddle, [0.4, 0.15, 0.34], dark, [-0.22, -0.64, -0.21]);
  const lens = box(
    puddle,
    [0.3, 0.04, 0.24],
    material("#e6e6cf", 0.2),
    [-0.22, -0.735, -0.21],
  );
  lens.rotation.x = 0.03;
  const blind = group("blindSpot", [1.1, 0.7, 1.5]);
  box(blind, [0.12, 0.17, 0.11], dark, [1.39, 0.2, 0.18], 0.02);
  const indicator = box(
    blind,
    [0.07, 0.11, 0.015],
    amber,
    [1.415, 0.2, 0.25],
    0.02,
  );
  indicator.name = "warningWindow";
  const cameraGroup = group("camera", [1.15, -0.8, 0.3]);
  box(cameraGroup, [0.35, 0.27, 0.36], dark, [0.77, -0.56, -0.08], 0.07);
  const barrel = cylinder(cameraGroup, 0.11, 0.12, metal, [0.77, -0.74, -0.08]);
  barrel.rotation.x = 0;
  const cameraLens = cylinder(
    cameraGroup,
    0.075,
    0.015,
    material("#1a3540", 0.08, 0.9),
    [0.77, -0.81, -0.08],
  );
  cameraLens.rotation.x = 0;
  cameraLens.name = "downwardCameraLens";
  const cameraSeal = mesh(
    cameraGroup,
    new T.TorusGeometry(0.105, 0.014, 6, 24),
    rubber,
    [0.77, -0.7, -0.08],
  );
  cameraSeal.rotation.x = Math.PI / 2;
  for (const x of [0.56, 0.98]) {
    const lug = mesh(cameraGroup, annulus(0.055, 0.025, 0.04), dark, [
      x,
      -0.57,
      -0.08,
    ]);
    lug.rotation.x = Math.PI / 2;
  }
  // Unfitted ports use a cover and a sealing lip, rather than an open hole.
  for (const [option, x, z, width, depth] of [
    ["camera", 0.77, -0.08, 0.44, 0.42],
    ["puddleLamp", -0.22, -0.21, 0.45, 0.49],
  ]) {
    const blank = new T.Group();
    blank.userData.blanking = option;
    blank.name = `${option}Blank`;
    housing.add(blank);
    const y = -0.68;
    box(blank, [width, 0.045, depth], charcoal, [x, y, z], 0.02);
    box(
      blank,
      [width - 0.04, 0.018, depth - 0.035],
      rubber,
      [x, y + 0.03, z],
      0.015,
    );
  }
  const signalBlank = new T.Group();
  signalBlank.userData.blanking = "turnSignal";
  housing.add(signalBlank);
  box(signalBlank, [0.028, 0.15, 0.31], charcoal, [1.478, -0.25, 0.035], 0.01);
  box(signalBlank, [0.018, 0.13, 0.29], rubber, [1.454, -0.25, 0.035], 0.008);
  return root;
}
