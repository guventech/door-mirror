# Verification record

## Verification of the showcase fixes

On 12 November 2026, `npm test` passed 21 unit/geometry/asset checks, TypeScript, the production build and 17 Chrome browser checks. The final exported GLB has no module bounding-box intersections at 100% explosion in Low, Mid or High. Sampled motion checks prevent separated boxes from crossing back through each other. These checks do not certify physical service extraction.

The local website test page passed at 1440px and 390px. It captures three angles in every specification, checks Housing followed by Side camera, checks neutral evidence hosts and evidence summary clearance, and reports no page or console errors. Desktop and phone High screenshots and phone expanded evidence were visually inspected. The test page uses the patched React components and compiled website styles with a simulated fixed header. It is not the full Next.js application. Its temporary build wrapper remains under tmp and is excluded from the standalone suite. The reusable browser assertions are delivered in handoff/site-showcase.spec.ts. The normal standalone suite contains 15 browser tests. The last combined run passed those 15 tests plus the two local website tests without skips.

Current GLB size is 1,604,736 bytes with 29,604 triangles and 68 meshes. The poster was refreshed from the browser render of this asset. The optional viewer is 591.84 KB raw and 149.35 KB gzip. The normal build emits its existing bundle-size advisory.

The prepared patch and application instructions are in handoff/. The destination website and homepage were not edited or deployed. Full website build, lint, real profile composition, Safari and physical phones remain unverified. Earlier verification entries below describe prior milestones.

12 November 2026. Windows, Node.js 24.22.2. Browser suite uses the installed Chrome in headless mode against the production build.

## Passed

- npm test: sixteen behavior/geometry/asset tests, TypeScript and production build, fifteen browser tests.
- npm ls --all --depth=1: exits successfully with runtime and development dependencies resolved. Missing optional preprocessors/devtools are unused.
- First paint and scroll/specification/part exploration produce no viewer-chunk or GLB request and create no canvas.
- Explicit activation loads the actual GLB from the same origin with no browser page/console errors in the normal flow.
- Cumulative levels, selected option activation, incompatible-selection closing and High glass copy behave correctly.
- Canvas raycasting selects the glass. Rotation drags do not select a part.
- Explosion can stop midway and reverse. Rest transforms are deterministic and do not accumulate drift.
- Failed model requests, missing WebGL and lost rendering context preserve the poster and parts explorer. Retry recovers where applicable.
- Reduced motion moves directly between endpoints.
- Offscreen controls produce no WebGL draw calls. Drawing resumes when the stage returns to view.
- Phone-width layout has no horizontal overflow at 390 px or 320 px. Canvas touch-action preserves vertical pan and pinch.
- Axe WCAG A/AA scans pass at desktop width and phone width with a part card open. This does not substitute for assistive-technology testing.
- Desktop static, assembled, exploded and phone-width screenshots were inspected for composition and legibility.
- Public part ideas contain no numeric savings, em dashes or semicolons. New runtime sources contain no researched vehicle/supplier names or company-linked figures.
- GLB has all 14 named groups and authored offsets. Auto-dimming is a material state, not a second mirror. No remote images, decoders or texture files are required.

## Asset measurements

- GLB: 1,603,404 bytes.
- Triangles: 29,604.
- Selectable groups: 14, plus auto-dimming as the fifteenth logical entry.
- Render meshes: 68.
- Optional viewer bundle: approximately 591.6 KB raw / 149.2 KB gzip. Vite emits an advisory size warning. Network checks confirm this chunk loads only on explicit activation.
- Runtime licence notices are included under public/licenses/.

## Limits

Safari, real phone hardware and manual screen-reader use were not available for this verification. An independent agent completed manufacturing research and reviewed the geometry explanations and evidence. A fresh online npm install was not exercised. Dependencies were bootstrapped from existing local packages and cached archives because package downloads were restricted. npm generated the lockfile from the installed tree.

The original site-integration checks are intentionally deferred: this project is standalone and no other site was modified. There is no remote repository, published preview, production deployment or merge.

## Manufacturing correction verification

The reported empty interior was reproduced by raycasting: the original single-sided, zero-thickness housing had no inward-facing wall. Added regression checks for inner/exterior visibility, finite thickness, finite vertex data, cored posts attached to the floor, the two-terminal heater path, the glass carrier and whole-assembly camera/signal sight lines.

The independent manufacturing review caught an initially hidden signal lens and imprecise carrier evidence. The signal was relocated to an outward-facing side aperture. Its exposure is now checked against the glass, carrier and shell, not just against its own module. The carrier reference now documents the heater/glass/backing-plate stack. The upper cap wording and camera setup reference were corrected.

All fifteen insights separate function, conditional cost proposal, pending checks and primary evidence. Browser tests visit every insight, inspect evidence links, and run accessibility checks with expanded evidence. Front and rear housing renders were visually checked. The matching poster was regenerated from the actual GLB.

Geometry remains an illustrative mesh. Physical producibility, constant wall thickness, mould release, tolerances, sealing, strength, thermal behavior and optical performance are not certified by these checks.

## GitHub publication environment

The user explicitly authorized a public guventech/door-mirror repository, commit, push and return to main. The connected GitHub app authenticates as guventech, but its tools do not create repositories. CLI requests are rejected by the session's loopback proxy, and git add fails with Permission denied on .git/index.lock. Browser automation is unavailable. These are session restrictions, not a need for another browser login.

A syntax-checked scripts/publish-github.ps1 is ready for the user's normal terminal. It stages and commits the reviewed project, creates main, creates the public repository, pushes and reports remote/local state. It does not disable security controls, change the proxy, force-push or publish an unrelated repository. At this verification point it has not been executed, and no push is claimed.

## Follow-up: bracket motion and integration readiness

The previous final base offset overlapped the housing envelope. The reproduced failing test now passes with staged motion. The optical stack reaches its separated pose first, then the base lifts in front of the open housing before moving sideways. Forty-one progress samples assert that any lateral bracket movement stays in front of the housing envelope. This is an explanatory motion, not a physical service-disassembly certification.

The standalone preview now follows the inspected site's engineering-teal light/dark tokens and gb-theme preference. Dark/light accessibility and preference persistence have browser coverage. The renderer accepts explicit modelUrl and canvasLabel options and no longer contains import.meta.env. The Vite shell supplies its own base URL.

The integration handoff was checked against the local guventech/site source: HomePage.tsx, HowIWork.tsx, locale routing/dictionaries, globals.css, theme components, fonts, existing CV/contact targets and next.config.ts CSP. Only reads were performed in that repository. Its pre-existing untracked files were left alone. No profile component has been integrated or deployed.

The owner completed the original publication, verified at 0cc971e. New motion/theme/integration changes remain local until separately committed and pushed. Use the updated local source for the handoff or publish the update before copying it from GitHub.

Final follow-up check: npm test passed all 16 unit/geometry/asset checks and all 15 Chrome browser checks. The front/rear drag screenshot assertion was intermittent during investigation. The final clean run passed after explicit canvas hover and frame synchronization, with debug instrumentation removed. Safari, real phone hardware and the destination integration remain unverified. Matching poster and housing images were refreshed from this run.
