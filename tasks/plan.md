# Standalone door mirror implementation

Updated 12 November 2026. Local implementation is complete. The user changed the original site-integration scope to a new project in this directory. No existing site was edited or deployed.

## Architecture

- Vite and TypeScript produce a static standalone app. English is the initial scope.
- The HTML shell, parts registry and three.js lifecycle are separate. There is no backend, account system or analytics.
- The viewer and GLB load only after explicit activation. Static part exploration works without WebGL.
- Original procedural geometry is editable in scripts/model.mjs. The GLB has 14 selectable groups. Auto-dimming is a High option on the existing glass, making 15 logical entries.
- Same-origin assets and bundled libraries preserve the future integration path. The local CSP only adds loopback WebSocket access for development.
- See tasks/agreement.md for the interaction contract and README.md for commands and integration notes.

## Delivery sequence and outcome

1. Established the standalone contract, project guidance and package scripts.
2. Wrote meaningful part/transform tests before implementing their behavior.
3. Built a poster shell, keyboard-accessible parts explorer and explicit load/retry flow.
4. Added the three.js lifecycle, rotation, limited button zoom, picking and deterministic explosion.
5. Added cumulative specification filtering, option badges, glass state and detail cards.
6. Authored and exported the original model, then merged compatible geometry to reduce its asset size.
7. Rendered the poster from the actual Low-spec GLB. Polished desktop and phone-width layouts.
8. Tested the production build in Chrome, including accessibility scans, failed loads, missing WebGL, context loss and offscreen rendering.
9. Documented the source, asset regeneration workflow and remaining external checks.

## Verification

The final automated suite passes fourteen behavior/geometry/asset tests and fourteen Chrome browser tests. TypeScript and the production build pass. Screenshots were visually inspected at desktop and phone widths. Detailed evidence and limitations are in tasks/verification.md.

Actual model budget: 1,602,840 bytes, 29,604 triangles, 68 render meshes within 14 selectable groups. The optional viewer is about 149 KB gzipped. The initial page does not request it.

## Remaining checks

Real-device mobile performance, Safari, and a fresh online dependency install remain unverified. Independent manufacturing research and source/copy review were completed. These are recorded explicitly, not treated as passed.

Future site placement, translations, CV/contact destinations, deployment and a preview PR belong to the later integration phase. Publishing requires a separate user instruction.
