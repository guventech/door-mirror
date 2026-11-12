import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { activeParts, positionAt } from "./parts.ts";
import type { PartId, Level } from "./parts.ts";

export interface MirrorViewer {
  setLevel(level: Level): void;
  explode(amount: number): void;
  select(id: PartId | null): void;
  reset(): void;
  zoom(factor: number): void;
  dispose(): void;
}
type Callbacks = { select(id: PartId): void; fail(): void };
export type ViewerOptions = { modelUrl?: string; canvasLabel?: string };

export async function createViewer(
  host: HTMLElement,
  callbacks: Callbacks,
  options: ViewerOptions = {},
): Promise<MirrorViewer> {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const canvas = renderer.domElement;
  canvas.setAttribute(
    "aria-label",
    options.canvasLabel ??
      "Interactive door mirror. Use the parts list to select parts with a keyboard.",
  );
  canvas.setAttribute("role", "img");
  host.append(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
  const initialCamera = new THREE.Vector3(5.5, 3.2, 9.6);
  const target = new THREE.Vector3(-0.15, 0, 0.2);
  camera.position.copy(initialCamera);
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(target);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = false;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.maxPolarAngle = Math.PI * 0.85;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  canvas.style.touchAction = "pan-y pinch-zoom";
  controls.update();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x747c67, 2.7));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(-3, 6, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc7d9e3, 1.5);
  fill.position.set(4, 1, -4);
  scene.add(fill);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.05);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  let disposed = false,
    frame = 0,
    visible = true;
  let model: THREE.Group | undefined;
  const groups = new Map<PartId, THREE.Object3D>();
  const rest = new Map<PartId, number[]>();
  const materials: THREE.MeshStandardMaterial[] = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let down = { x: 0, y: 0 },
    dragged = false;

  function render() {
    frame = 0;
    if (!disposed && visible && !document.hidden)
      renderer.render(scene, camera);
  }
  function invalidate() {
    if (!frame && !disposed && visible && !document.hidden)
      frame = requestAnimationFrame(render);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the exploded assembly comfortably inside a narrow viewport.
    camera.fov = width / height < 1.35 ? 43 : 33;
    camera.updateProjectionMatrix();
    invalidate();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) invalidate();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  intersection.observe(host);
  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else invalidate();
  }
  function onDown(e: PointerEvent) {
    down = { x: e.clientX, y: e.clientY };
    dragged = false;
  }
  function onMove(e: PointerEvent) {
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) dragged = true;
  }
  function onUp(e: PointerEvent) {
    if (
      dragged ||
      !model ||
      Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6
    )
      return;
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    const pickable: THREE.Object3D[] = [];
    groups.forEach((group) => {
      group.traverseVisible((object) => {
        if (object instanceof THREE.Mesh) pickable.push(object);
      });
    });
    const hit = raycaster.intersectObjects(pickable, false)[0];
    if (!hit) return;
    let object: THREE.Object3D | null = hit.object;
    while (object && !groups.has(object.name as PartId)) object = object.parent;
    if (object) callbacks.select(object.name as PartId);
  }
  function onContextLost(e: Event) {
    e.preventDefault();
    dispose();
    callbacks.fail();
  }
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("webglcontextlost", onContextLost);
  controls.addEventListener("change", invalidate);
  document.addEventListener("visibilitychange", onVisibility);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersection.disconnect();
    controls.dispose();
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    const geometries = new Set<THREE.BufferGeometry>();
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) geometries.add(o.geometry);
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    environment.dispose();
    renderer.dispose();
    canvas.remove();
  }
  try {
    const gltf = await new GLTFLoader().loadAsync(
      options.modelUrl ?? "/mirror/mirror.glb",
    );
    if (disposed) {
      gltf.scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const list = Array.isArray(o.material) ? o.material : [o.material];
          list.forEach((m) => m.dispose());
        }
      });
      throw new Error("Viewer closed while loading");
    }
    model = gltf.scene.getObjectByName("genericDoorMirror") as
      THREE.Group | undefined;
    if (!model) throw new Error("The model assembly is missing");
    scene.add(model);
    model.scale.setScalar(1.55);
    for (const child of model.children) {
      if (!activeParts("High").some((p) => p.id === child.name)) continue;
      groups.set(child.name as PartId, child);
      rest.set(child.name as PartId, child.position.toArray());
    }
    if (groups.size !== 14)
      throw new Error("The model has an incomplete parts registry");
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const original = Array.isArray(object.material)
        ? object.material
        : [object.material];
      const clones = original.map((m) => {
        const clone = m.clone() as THREE.MeshStandardMaterial;
        materials.push(clone);
        return clone;
      });
      object.material = Array.isArray(object.material) ? clones : clones[0];
    });
    resize();
    controls.update();
    invalidate();
  } catch (error) {
    dispose();
    throw error;
  }

  return {
    setLevel(level) {
      const enabled = new Set(activeParts(level).map((p) => p.id));
      groups.forEach((group, id) => {
        group.visible = enabled.has(id);
      });
      model!.traverse((object) => {
        if (object.userData.blanking)
          object.visible = !enabled.has(object.userData.blanking as PartId);
        if (object.userData.optionFor)
          object.visible = enabled.has(object.userData.optionFor as PartId);
        if (object instanceof THREE.Mesh && object.userData.glassSurface) {
          const material = object.material as THREE.MeshStandardMaterial;
          material.color.set(level === "High" ? 0x6e9797 : 0xb1c9d4);
        }
      });
      invalidate();
    },
    explode(amount) {
      model!.scale.setScalar(1.55 - amount * 0.35);
      groups.forEach((group, id) => {
        group.position.fromArray(
          positionAt(
            rest.get(id)!,
            group.userData.explode ?? [0, 0, 0],
            amount,
            group.userData.explodePath,
            group.userData.explodeFinish,
          ),
        );
      });
      invalidate();
    },
    select(id) {
      groups.forEach((group, partId) => {
        group.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const list = Array.isArray(object.material)
            ? object.material
            : [object.material];
          list.forEach((m) => {
            const material = m as THREE.MeshStandardMaterial;
            const selected =
              partId === id || (id === "autoDim" && partId === "glass");
            material.emissive.set(selected ? 0x3b8898 : 0x000000);
            material.emissiveIntensity = selected ? 0.25 : 0;
          });
        });
      });
      invalidate();
    },
    reset() {
      camera.position.copy(initialCamera);
      controls.target.copy(target);
      controls.update();
      invalidate();
    },
    zoom(factor) {
      const direction = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(
        direction.length() * factor,
        6,
        17,
      );
      camera.position.copy(controls.target).add(direction.setLength(distance));
      controls.update();
      invalidate();
    },
    dispose,
  };
}
