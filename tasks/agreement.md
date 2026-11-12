# Milestone 0: standalone viewer contract

User approved standalone implementation on 12 November 2026. The original site-integration requirement is deferred.

## Design

An engineering workbench, with warm ivory surfaces, dark ink, muted orange accents and a large studio view. Desktop: canvas left, inspector right. Mobile: canvas, controls, inspector in normal scroll order. No contact links until real integration targets exist.

Primary task: load the model, separate its parts and inspect a cost idea. English first. No external fonts, images, scripts or models. The illustration is an original generic design.

## Identity and selection

Keep housing, cap, glass, heater, actuator, base, gasket, harness, fasteners, foldMotor, turnSignal, puddleLamp, blindSpot, camera. These are 14 selectable groups. `autoDim` is the fifteenth logical entry and a High material state of glass, with its own list item and card.

Low has nine groups. Mid adds foldMotor and turnSignal. High adds puddleLamp, blindSpot, camera and the autoDim state. Inactive list items are visible and explain their level. Selecting an inactive option switches to its required level. Hidden geometry cannot be picked. Switching level clears an incompatible selection but preserves explosion and camera.

Group extras own explode offsets. All transforms are recomputed from rest positions. Raycast on pointer-up and suppress selection after any drag over six pixels. Keyboard users can select every part through the HTML list. Esc closes the inspector detail. Glass on High shows its standard idea and the High option idea.

## Copy and controls

Heading: Cost teardown: door mirror.
Intro: A generic exterior mirror. Take it apart to explore the decisions behind a lower-cost design.
Primary: Load 3D viewer.
Controls: Low, Mid, High, Assembly, Exploded, Animate explode, Stop animation, Reset view, Zoom in, Zoom out, Close part details.
Helper: Low is the basic specification. Mid and High add optional parts.
Poster: Explore the parts without loading 3D, or open the interactive viewer.
Loading: Preparing the 3D viewer.
Failure: The 3D viewer could not load. You can still explore every part below.
Retry: Try again.
Gesture hint: Drag to rotate. Select a part to explore.
Captions: the later manufacturing review supersedes the original brief where a claim was too broad. Each entry in src/parts.ts separates function, conditional cost idea and required checks. src/evidence.ts provides primary-source links with neutral labels. Source URLs may identify their publishers, while displayed showcase text stays free of supplier names and branded savings.

## Architecture and delivery

Use Vite and TypeScript for a static standalone app, with plain three.js behind a dynamic import. DOM shell and model lifecycle remain separate. No backend, accounts, analytics or remote services.

Files: src/main.ts, src/template.ts, src/styles.css, src/workbench.css, src/parts.ts, src/viewer.ts, scripts/model.mjs, scripts/build-model.mjs, public/mirror/mirror.glb and public/mirror/poster.png. The poster is rendered from the actual scene through the browser test workflow. Tests live under tests/ and e2e/.

The shell, behavior tests, original GLB and final scene are implemented and verified in Chrome. See tasks/plan.md and tasks/verification.md for the delivery state. Independent AI review and device coverage remain pending before shipping.
