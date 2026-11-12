# Standalone door mirror implementation

## Recovered showcase fixes

The interrupted session left the six requested fixes in the local source and `handoff/site-showcase.patch`. They have not been applied to the destination website or deployed. The homepage is untouched.

Recovery verification passed 21 unit/geometry/asset tests, TypeScript, the production build and 17 Chrome browser tests. Two browser tests use an optional local React fixture at desktop and 390px. They do not verify the full Next.js profile page. The fixture is ignored temporary data, so those two tests skip when it is absent. Run the supplied handoff tests in the website project for final integration coverage.

Current GLB: 1,604,736 bytes, 29,604 triangles and 68 meshes. Final exploded bounding boxes are separate in Low, Mid and High. Safari and physical phone coverage remain unavailable. See handoff/README.md for the remaining website step.

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

The final automated suite passes sixteen behavior/geometry/asset tests and fifteen Chrome browser tests. TypeScript and the production build pass. Screenshots were visually inspected at desktop and phone widths. Detailed evidence and limitations are in tasks/verification.md.

Actual model budget: 1,603,404 bytes, 29,604 triangles, 68 render meshes within 14 selectable groups. The optional viewer is about 149 KB gzipped. The initial page does not request it.

## Remaining checks

Real-device mobile performance, Safari, and a fresh online dependency install remain unverified. Independent manufacturing research and source/copy review were completed. These are recorded explicitly, not treated as passed.

Future site placement, translations, CV/contact destinations, deployment and a preview PR belong to the later integration phase. Publishing requires a separate user instruction.

## Site handoff decision

Recommend /guven#mirror immediately after HowIWork, which already contains the A3 tool card, and before SmeOffer. The neutral BrandLanding homepage remains unchanged. Detailed instructions and a ready-to-paste task prompt are in docs/INTEGRATE_BIRCANS.md. The current app also adopts the host palette/theme behavior and a framework-neutral model URL option. Actual host integration remains deferred as requested.

## Showcase corrections

Re-authored all module offsets and staged timing. Check all pairs at full explosion in Low, Mid and High, check exported geometry, and check that separated module envelopes never overlap again across 101 motion samples. Restrict public evidence to neutral sources. Add a native phone dialog and preserve inline scrolling. Prepare the React site patch inside the writable workspace, then verify desktop and 390px behavior in a local component test page. Applying the patch and checking the real Next.js site require a session in the website project.
