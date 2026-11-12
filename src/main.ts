import { workbenchMarkup } from "./template.ts";
import { evidence } from "./evidence.ts";
import "./styles.css";
import {
  parts,
  levels,
  activeParts,
  badge,
  levelForPart,
  selectionAtLevel,
} from "./parts.ts";
import type { Level, PartId } from "./parts.ts";
import type { MirrorViewer } from "./viewer.ts";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = workbenchMarkup;

function el<T extends HTMLElement = HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}
let level: Level = "Low",
  selected: PartId | null = null;
let viewer: MirrorViewer | undefined;
let loading = false,
  amount = 0,
  animation = 0,
  animationTarget = 1;
let lastFocused: HTMLElement | null = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const slider = el<HTMLInputElement>("explode");

function showDetails(id: PartId, focus = true) {
  if (focus) lastFocused = document.activeElement as HTMLElement;
  if (levels.indexOf(levelForPart(id)) > levels.indexOf(level))
    setLevel(levelForPart(id));
  selected = id;
  const p = parts.find((p) => p.id === id)!;
  const dim =
    id === "glass" && level === "High"
      ? parts.find((p) => p.id === "autoDim")
      : null;
  const card = el("detail-card");
  const references = [...new Set([...p.sources, ...(dim?.sources ?? [])])].map(
    (id) => evidence[id],
  );
  card.innerHTML = /* HTML */ ` <div class="detail-index">
      ${String(parts.indexOf(p) + 1).padStart(2, "0")}<span>PART INSIGHT</span>
    </div>
    <div class="detail-body">
      <div class="detail-meta">
        <span>${p.category}</span
        ><span class="part-badge ${p.level.toLowerCase()}"
          >${badge(p.level)}</span
        >
      </div>
      <h2 tabindex="-1" id="detail-title">${p.name}</h2>
      <p class="detail-material">Construction: ${p.material.toLowerCase()}</p>
      <h3>What it does</h3>
      <p>${p.description}</p>
      <h3>A cost idea</h3>
      <p>${p.idea}</p>
      ${dim ? `<p class="dim-note"><strong>High option: auto-dimming.</strong> ${dim.description} ${dim.idea}</p>` : ""}
      <h3>Still to check</h3>
      <p class="detail-check">${p.check}${dim ? ` ${dim.check}` : ""}</p>
      <details class="detail-evidence">
        <summary>Evidence and limits</summary>
        <p>
          These sources describe the technique. Reuse is a design proposal, not
          a measured saving. A published design does not prove that this model
          can be made.
        </p>
        <ul>
          ${references.map((reference) => `<li><a href="${reference.url}" target="_blank" rel="noopener noreferrer">${reference.title} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><span class="evidence-kind">${reference.kind}</span><p>${reference.supports}</p></li>`).join("")}
        </ul>
      </details>
    </div>
    <button class="close-detail" aria-label="Close part details">×</button>`;
  card.hidden = false;
  card.querySelector("button")!.addEventListener("click", () => closeDetails());
  viewer?.select(id);
  updateRows();
  if (focus) {
    el("detail-title").focus({ preventScroll: true });
    if (card.getBoundingClientRect().top > window.innerHeight - 100)
      card.scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "nearest",
      });
  }
}
function closeDetails(restoreFocus = true) {
  selected = null;
  el("detail-card").hidden = true;
  viewer?.select(null);
  updateRows();
  if (restoreFocus) lastFocused?.focus({ preventScroll: true });
}
function updateRows() {
  const active = new Set(activeParts(level).map((p) => p.id));
  document
    .querySelectorAll<HTMLButtonElement>("[data-part]")
    .forEach((button) => {
      const id = button.dataset.part as PartId;
      button.classList.toggle("inactive", !active.has(id));
      button.setAttribute("aria-pressed", String(selected === id));
      button.title = active.has(id)
        ? `Explore ${parts.find((p) => p.id === id)!.name}`
        : `Switch to ${levelForPart(id)} to explore this option`;
    });
}
function setLevel(next: Level) {
  level = next;
  document
    .querySelectorAll<HTMLButtonElement>("[data-level]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.level === level)),
    );
  el("part-count").textContent = String(activeParts(level).length);
  viewer?.setLevel(level);
  if (selected && !selectionAtLevel(selected, level)) closeDetails(false);
  else if (selected === "glass") showDetails("glass", false);
  updateRows();
}
function setAmount(value: number) {
  amount = Math.max(0, Math.min(1, value));
  slider.value = String(Math.round(amount * 100));
  el("explode-value").textContent = `${Math.round(amount * 100)}%`;
  viewer?.explode(amount);
}
function stopAnimation() {
  cancelAnimationFrame(animation);
  animation = 0;
  el("animate-label").textContent = "Animate explode";
}
function animate() {
  if (animation) {
    stopAnimation();
    return;
  }
  animationTarget =
    amount >= 0.99 ? 0 : amount <= 0.01 ? 1 : 1 - animationTarget;
  if (reducedMotion.matches) {
    setAmount(animationTarget);
    return;
  }
  const from = amount,
    start = performance.now();
  el("animate-label").textContent = "Stop animation";
  function tick(now: number) {
    const t = Math.min(1, (now - start) / 1600);
    setAmount(from + (animationTarget - from) * (t * t * (3 - 2 * t)));
    if (t < 1) animation = requestAnimationFrame(tick);
    else stopAnimation();
  }
  animation = requestAnimationFrame(tick);
}
async function loadViewer() {
  if (loading || viewer) return;
  loading = true;
  const button = el<HTMLButtonElement>("load-viewer");
  button.disabled = true;
  el("load-message").textContent = "Preparing the 3D viewer.";
  el("stage-status").textContent = "LOADING";
  try {
    const { createViewer } = await import("./viewer.ts");
    viewer = await createViewer(el("canvas-host"), {
      select: showDetails,
      fail: failViewer,
    });
    viewer.setLevel(level);
    viewer.explode(amount);
    viewer.select(selected);
    el("load-panel").hidden = true;
    el("poster").hidden = true;
    el("stage-status").textContent = "LIVE 3D";
    el("gesture-hint").textContent =
      "Drag to rotate. Select a part to explore.";
    ["explode", "animate", "reset-view", "zoom-in", "zoom-out"].forEach(
      (id) => (el<HTMLButtonElement>(id).disabled = false),
    );
    el<HTMLButtonElement>("reset-view").focus({ preventScroll: true });
  } catch {
    failViewer();
  } finally {
    loading = false;
  }
}
function failViewer() {
  stopAnimation();
  viewer?.dispose();
  viewer = undefined;
  el("load-panel").hidden = false;
  el("poster").hidden = false;
  el("stage-status").textContent = "STATIC PREVIEW";
  el("load-message").textContent =
    "The 3D viewer could not load. You can still explore every part below.";
  const button = el<HTMLButtonElement>("load-viewer");
  button.disabled = false;
  button.textContent = "Try again";
  ["explode", "animate", "reset-view", "zoom-in", "zoom-out"].forEach(
    (id) => (el<HTMLButtonElement>(id).disabled = true),
  );
}
document
  .querySelectorAll<HTMLButtonElement>("[data-level]")
  .forEach((b) =>
    b.addEventListener("click", () => setLevel(b.dataset.level as Level)),
  );
document
  .querySelectorAll<HTMLButtonElement>("[data-part]")
  .forEach((b) =>
    b.addEventListener("click", () => showDetails(b.dataset.part as PartId)),
  );
el("load-viewer").addEventListener("click", loadViewer);
slider.addEventListener("input", () => {
  stopAnimation();
  setAmount(Number(slider.value) / 100);
});
el("animate").addEventListener("click", animate);
el("reset-view").addEventListener("click", () => {
  stopAnimation();
  setAmount(0);
  viewer?.reset();
});
el("zoom-in").addEventListener("click", () => viewer?.zoom(0.85));
el("zoom-out").addEventListener("click", () => viewer?.zoom(1.15));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && selected) closeDetails();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAnimation();
});
window.addEventListener("pagehide", () => {
  stopAnimation();
  viewer?.dispose();
});
updateRows();
