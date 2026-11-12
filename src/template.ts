import { parts, levels, badge } from "./parts.ts";

export const workbenchMarkup = /* HTML */ ` <header class="site-header">
    <a class="wordmark" href="#" aria-label="Guven, back to top"
      ><span class="monogram">g.</span
      ><span
        >GUVEN <span class="wordmark-light">/ ENGINEERING NOTES</span></span
      ></a
    >
    <div class="header-actions">
      <button
        id="theme-toggle"
        class="theme-toggle"
        aria-label="Switch to light theme"
      >
        Light theme</button
      ><a class="header-link" href="#about"
        >About this project <span aria-hidden="true">↗</span></a
      >
    </div>
  </header>
  <main id="mirror">
    <section class="intro" aria-labelledby="page-title">
      <div class="eyebrow">
        <span class="accent-line"></span> INTERACTIVE COST STUDY
        <span class="study-no">NO. 001</span>
      </div>
      <div class="intro-row">
        <h1 id="page-title">
          Small assembly.<br /><span>Many decisions.</span>
        </h1>
        <div class="intro-copy">
          <p class="intro-title">Cost teardown: door mirror</p>
          <p>
            A generic exterior mirror. Take it apart to explore the decisions
            behind a lower-cost design.
          </p>
          <a class="text-link" href="#workbench"
            >Explore the assembly <span aria-hidden="true">↓</span></a
          >
        </div>
      </div>
    </section>
    <section
      class="workbench"
      id="workbench"
      aria-label="Door mirror workbench"
    >
      <div class="workbench-bar">
        <div>
          <span class="live-dot"></span> <strong>DOOR MIRROR</strong
          ><span class="bar-divider">/</span><span>EXTERIOR ASSEMBLY</span>
        </div>
        <span class="bar-note">ORIGINAL GENERIC MODEL</span>
      </div>
      <div class="workspace">
        <div class="scene-column">
          <div class="stage" id="stage">
            <div class="stage-top">
              <span class="stage-label">ASSEMBLY VIEW</span
              ><span class="stage-status" id="stage-status"
                >PREVIEW IMAGE</span
              >
            </div>
            <img
              class="poster"
              id="poster"
              src="/mirror/poster.png"
              alt="Assembled generic door mirror with its glass, housing and mounting base"
            />
            <div class="canvas-host" id="canvas-host"></div>
            <div class="load-panel" id="load-panel">
              <button class="primary-button" id="load-viewer">
                <span class="cube-icon" aria-hidden="true">◇</span> Load 3D
                viewer <span aria-hidden="true">↗</span>
              </button>
              <p id="load-message" role="status">
                Load the 3D model to rotate it, or pick a part below to read
                about it.
              </p>
            </div>
            <div class="stage-bottom">
              <span class="axis-symbol" aria-hidden="true"
                >↗ <span>Y</span><br />↳ X</span
              >
              <p id="gesture-hint">
                Preview image. Load the 3D model to rotate and explode it.
              </p>
              <button
                class="reset-button"
                id="reset-view"
                disabled
                aria-label="Reset view"
              >
                ↺ <span>Reset view</span>
              </button>
            </div>
          </div>
          <div class="scene-controls">
            <div class="explode-heading">
              <label for="explode">Separate the assembly</label
              ><output id="explode-value" for="explode">0%</output>
            </div>
            <input
              id="explode"
              type="range"
              disabled
              min="0"
              max="100"
              value="0"
              aria-label="Explode assembly"
            />
            <div class="range-captions">
              <span>Assembly</span><span>Exploded</span>
            </div>
            <div class="playback-row">
              <button id="animate" class="outline-button" disabled>
                <span aria-hidden="true">▷</span>
                <span id="animate-label">Animate explode</span>
              </button>
              <div class="zoom-controls">
                <button id="zoom-out" aria-label="Zoom out" disabled>−</button
                ><button id="zoom-in" aria-label="Zoom in" disabled>+</button>
              </div>
            </div>
          </div>
        </div>
        <aside class="inspector" aria-label="Specification and part inspector">
          <div class="spec-panel">
            <div class="eyebrow">01 <span>CHOOSE A SPECIFICATION</span></div>
            <div
              class="spec-tabs"
              role="group"
              aria-label="Specification level"
            >
              ${levels.map((l) => `<button data-level="${l}" aria-pressed="${l === "Low"}">${l}<span>${l === "Low" ? "Essential" : l === "Mid" ? "Comfort" : "Full feature"}</span></button>`).join("")}
            </div>
            <p class="spec-helper">
              Low is the basic specification. Mid and High add optional parts.
              Selecting an optional part switches the model to the specification
              level that includes it.
            </p>
            <div class="spec-summary">
              <strong id="part-count">9</strong
              ><span
                >parts in this specification<br /><span id="part-total"
                  >${parts.length} across all levels</span
                ></span
              ><span class="spec-summary-icon" aria-hidden="true">⊞</span>
            </div>
          </div>
          <div class="parts-panel">
            <div class="parts-heading">
              <div class="eyebrow">02 <span>EXPLORE THE PARTS</span></div>
              <span class="small-label">SELECT A PART ↘</span>
            </div>
            <div class="parts-list" id="parts-list">
              ${parts.map((p, i) => `<button class="part-row" data-part="${p.id}" aria-pressed="false" aria-label="${p.name}, ${badge(p.level)}"><span class="part-number">${String(i + 1).padStart(2, "0")}</span><span class="part-name">${p.name}</span><span class="part-badge ${p.level.toLowerCase()}">${badge(p.level)}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join("")}
            </div>
            <div class="parts-notes" aria-label="Part notes">
              ${parts.map((p) => `<details class="part-note" data-part-note="${p.id}"><summary>${p.name} · ${badge(p.level)}</summary><p><strong>What it does.</strong> ${p.description}</p><p><strong>A cost idea.</strong> ${p.idea}</p><p><strong>Still to check.</strong> ${p.check}</p></details>`).join("")}
            </div>
          </div>
        </aside>
      </div>
      <p class="provenance">
        Illustrative study, not validated. This is a generic model I built
        myself. It is not based on any manufacturer's or supplier's drawings,
        parts or cost data.
      </p>
      <div class="workbench-footer">
        <span
          ><span class="legend-dot"></span> In Low spec
          <span class="legend-dot mid-dot"></span> Added at Mid
          <span class="legend-dot high-dot"></span> Added at High</span
        ><span>ILLUSTRATIVE DESIGN · QUALITATIVE COST IDEAS</span>
      </div>
    </section>
    <section
      class="detail-card"
      id="detail-card"
      aria-label="Part details"
      hidden
    ></section>
    <section class="project-note" id="about">
      <div class="eyebrow">THE THINKING BEHIND THE PARTS</div>
      <div class="note-grid">
        <h2>Cost starts<br />with design.</h2>
        <div>
          <p>
            A painted surface. An extra screw. A motor that cannot be replaced.
            Small choices shape the cost of the whole assembly.
          </p>
          <p>
            This study explores those choices through an original generic model.
            The ideas are illustrative engineering approaches, not measured
            savings or a production design.
          </p>
          <p>
            This is a generic model I built myself. It is not based on any
            manufacturer's or supplier's drawings, parts or cost data.
          </p>
        </div>
        <div class="note-index">
          <span>01 / Simplify the process</span
          ><span>02 / Share the architecture</span
          ><span>03 / Keep repair in reach</span>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <span>GUVEN <span class="muted">/ COST · DESIGN · R&amp;D</span></span
    ><span>Built to look closer. <a href="#mirror">Back to top ↑</a></span>
  </footer>`;
