# Integrate the mirror into bircans.com

For the corrections to the existing website integration, use [the prepared website patch](../handoff/README.md). It includes phone full-screen mode, neutral evidence, selection styling and header-safe evidence scrolling. The renderer now exposes `setFullscreen(active)` to enable pinch zoom inside the phone dialog and restore page scrolling outside it.

## Recommended location

Use **`https://www.bircans.com/guven#mirror`**, immediately after **How I work**, including its existing A3 Cost Reduction card, and before the SME offer.

This puts an interactive example next to the professional method and practical tool it demonstrates. Keep the existing career facts, results and primary contact flow. The mirror is an illustrative engineering study, not an additional measured career result.

The current site checkout renders the neutral `BrandLanding` on `/`, `/tr` and `/nl`. Keep those pages unchanged. A full engineering viewer would change that page's purpose. The hobby projects disclosure is also a weaker placement for this professional example.

Do not add a new homepage card or profile link as part of this integration. If the owner later changes the homepage's purpose, treat that as a separate design decision.

## What exists today

- Source: `https://github.com/guventech/door-mirror`.
- Local source checkout: `C:\Users\guven\projects\door-mirror`.
- Inspected host checkout: `C:\Users\guven\projects\site`, repository `guventech/site`.
- This document is an implementation handoff. The host repository has only been read, not edited.
- Use the revised source containing this document, the staged bracket motion and `ViewerOptions`. Commit/push the current source changes before copying from GitHub. The initial published commit does not contain these integration changes.

The standalone app runs with `npm install`, `npm run dev`, `npm test` and `npm run build`. It is not an npm widget package. Do not copy the whole Vite app into the website or embed it in an iframe. Reuse the renderer and data in a small native React component.

## Confirm the host before editing

Read the destination repository's `AGENTS.md` and bundled, version-matched Next.js docs. Inspect its current Git status and preserve unrelated changes. Recheck the paths below because the host can change independently.

The inspected implementation has:

| Purpose                         | Existing host file                                  |
| ------------------------------- | --------------------------------------------------- |
| Guven section composition       | `src/components/HomePage.tsx`                       |
| Professional method and A3 card | `src/components/HowIWork.tsx`                       |
| English profile route           | `src/app/guven/page.tsx`                            |
| Shared locale profile route     | `src/app/guven/[locale]/page.tsx`                   |
| Dictionary type                 | `src/lib/i18n/types.ts`                             |
| Dictionaries                    | `src/lib/i18n/dictionaries/en.ts`, `tr.ts`, `nl.ts` |
| Theme and style tokens          | `src/app/globals.css`                               |
| Existing theme controls         | `src/components/ThemeScript.tsx`, `ThemeToggle.tsx` |
| Fonts                           | `src/app/layout.tsx`                                |
| CV and contact destinations     | `dict.profile.cvPath` and `#contact`                |
| Security headers                | `next.config.ts`                                    |

The live search cache returned an older homepage, so the recommendation is grounded in the inspected source rather than assuming the cached page matches today's deployment. Check the actual preview during implementation.

## Copy the reusable pieces

Create a focused directory such as `src/components/mirror/` in the host.

| Source in door-mirror           | Destination in site                      | Required adaptation                                                                                                                   |
| ------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/viewer.ts`                 | `src/components/mirror/viewer.ts`        | Keep the lifecycle API. Change `./parts.ts` to the host's extensionless `./parts` import if required by its TypeScript configuration. |
| `src/parts.ts`                  | `src/components/mirror/parts.ts`         | Keep stable IDs, levels, visibility helpers and the complete `positionAt` implementation. Move displayed copy into host dictionaries. |
| `src/evidence.ts`               | `src/components/mirror/evidence.ts`      | Retain source URLs and the distinction between guidance, product offerings and published designs. Localize displayed labels.          |
| `public/mirror/mirror.glb`      | `public/guven/mirror/mirror.glb`         | Copy the current asset with its node extras intact.                                                                                   |
| `public/mirror/poster.png`      | `public/guven/mirror/poster.png`         | Use the matching poster. Keep the first view static.                                                                                  |
| `public/mirror/model-info.json` | `public/guven/mirror/model-info.json`    | Keep the asset audit alongside the model. It need not be fetched at runtime.                                                          |
| `public/licenses/three.txt`     | `public/guven/mirror/licenses/three.txt` | Preserve the runtime library notice in distributed assets.                                                                            |

Add the compatible `three` runtime dependency and `@types/three` development dependency through the host's package manager. The source project currently uses `three` 0.180.0 and type declarations 0.186.0. If the host already has three.js, verify its version and addon APIs before choosing a version. Generate the destination lockfile through its package manager, not by copying this project's lockfile or node_modules.

Do not copy these into the host:

- `src/main.ts`, `src/template.ts` or `src/theme.ts`. They own the standalone page and global event wiring.
- `index.html`, the Vite package manifest, the publication script or the standalone navigation/footer.
- Global `:root`, `html`, `body`, `button`, `h1` or anchor rules from the standalone CSS.
- Research documents as runtime imports or a remote GLB URL.

Keep the procedural model source in this repository as the authoring source. Regenerate and deliberately update the exported host assets when the model changes. Do not require Blender or Node-side modelling packages in the website runtime.

## Build the host component

Create `src/components/mirror/MirrorTeardown.tsx` with `"use client"` for interaction, plus narrowly scoped CSS only where host utility classes are insufficient. Let the parent page retain its Server Component role.

Use a poster, a `Load 3D viewer` button and the HTML parts list as the initial state. The only runtime renderer import belongs inside the explicit activation handler:

```ts
const { createViewer } = await import("./viewer");
const instance = await createViewer(
  canvasHost,
  { select: onPartSelected, fail: onViewerFailure },
  {
    modelUrl: "/guven/mirror/mirror.glb",
    canvasLabel: copy.canvasLabel,
  },
);
```

This is the renderer call shape, not a complete component. The wrapper must implement the state, refs, callbacks and controls listed below. The renderer no longer depends on Vite's `import.meta.env`.

- Hold the viewer instance in a ref. Dispose it on unmount. If an async load finishes after unmount, dispose that returned instance immediately.
- Apply the latest selected level, explode value and part after the load resolves. Avoid stale React closure values when a visitor changes the specification during loading.
- Catch activation failures and retain the poster and HTML explorer. Reset the ref on context loss so retry can create a fresh viewer.
- Keep specification, part selection and the cost card in React state. Do not paste the standalone `innerHTML` page into the host DOM.
- Render the Low/Mid/High buttons, explode range, stop/reverse animation, reset and limited zoom controls. Keep vertical mobile scrolling and the renderer's touch-action behavior.
- Use the `parts` registry's stable IDs for scene selection and localized labels for display. Hidden options cannot be raycast. Selecting an inactive list entry switches to its required specification.
- Retain function, conditional cost idea, required checks and expandable primary evidence for each insight. On High, glass also explains that dimming needs a different optical/electrical construction.
- Keep keyboard selection through the parts list, visible focus, a close button, Esc close, useful focus restoration and reduced-motion behavior.
- Keep all renderer lifecycle details: on-demand drawing, visibility pausing, pixel-ratio cap and cleanup. These are already implemented in `viewer.ts`.

The public API is `setLevel(level)`, `explode(amount)`, `select(id)`, `reset()`, `zoom(factor)` and `dispose()`. Explosion is in the range zero to one.

### Important: retain the staged bracket motion

The initial straight sideways motion cut the bracket through the housing. The corrected GLB has `explodePath` and `explodeFinish` extras. The complete `positionAt` helper and `viewer.ts` consume them together.

The optical stack moves first. The base then moves through the front opening before moving sideways. The gasket follows that lift before separating farther to the side. Do not reduce this back to `rest + finalOffset * amount`, strip the extras in an asset optimizer, or mix the new renderer with an older model.

This is an explanatory exploded view, not a validated service disassembly sequence.

## Insert it into the professional page

In `HomePage.tsx`, use this order:

```tsx
<Hero dict={dict} compact />
<SelectedResults dict={dict} />
<HowIWork dict={dict} />
<MirrorTeardown copy={dict.mirror} cvHref={dict.profile.cvPath} />
<SmeOffer copy={smeOffer[locale]} />
```

Add a new section with `id="mirror"`, `className="section-pad scroll-mt-20"` and a `container-site` inner wrapper. Use an `h2` with the host's `heading-section` class. Do not add a second page-level `h1` or repeat this project's standalone hero, logo, top navigation or explanatory footer.

Recommended heading: **Cost teardown: door mirror**.

Recommended introduction: **A generic mirror assembly. Explore its parts and the design choices I would check for lower cost and easier repair.**

Add localized CV and contact links using `dict.profile.cvPath` and `#contact`. Do not create a new contact form or invent new destinations.

The example assumes all locale dictionaries have a typed `mirror` entry. If shipping English first, gate the entire section with `locale === "en"` and keep untranslated copy out of `/guven/tr` and `/guven/nl`. Record that deliberate temporary scope. Prefer completing all three dictionaries before exposing all three routes.

## Match the existing visual system

The standalone preview now uses the site's palette and theme convention as a reference. The embedded component must inherit the host's actual tokens and fonts, not redeclare them.

| Role                    | Host token               | Current dark | Current light |
| ----------------------- | ------------------------ | ------------ | ------------- |
| Page                    | `--color-paper`          | `#0e1012`    | `#f7f5f1`     |
| Card                    | `--color-paper-elevated` | `#16191c`    | `#ffffff`     |
| Inset surface           | `--color-paper-sunken`   | `#0a0b0d`    | `#efece5`     |
| Main text               | `--color-ink`            | `#f2efe9`    | `#16181b`     |
| Secondary text          | `--color-ink-soft`       | `#b3b0a8`    | `#4a4f56`     |
| Metadata                | `--color-muted`          | `#a8a49c`    | `#5f646b`     |
| Border                  | `--color-line`           | `#2a2e33`    | `#ddd8ce`     |
| Main action / selection | `--color-accent`         | `#6cc0d2`    | `#0f4c5c`     |

- Use `--color-accent-soft`, `--color-accent-hover` and `--color-on-accent` for selected controls and insight surfaces. Keep labels as well as colors on specification badges.
- Use the existing `surface-card`, `focus-ring`, `btn-text`, `body-copy` and `meta-copy` patterns where appropriate.
- Match `--radius-card` (currently 1.25rem), `--container` (70rem), `--gutter` and `--section-y` rather than imposing the standalone page's max width and padding.
- Use the host's Source Serif 4 display type and Geist body/UI fonts through its existing font variables and utility classes. Do not add external font requests.
- Follow `html.light` and the existing `gb-theme` preference. Reuse the site's theme controls. Do not add another global theme listener or toggle in the widget.
- Use engineering teal for this professional study. Keep the maker/vermilion sub-brand for its existing hobby context.
- Keep the scene background neutral and theme-aware. Preserve material contrast and do not recolor mirror parts to communicate a specification state by color alone.
- On phones put controls and details below the canvas in normal flow. Use a modest canvas height, readable type and touch targets of at least 44px. Avoid a long empty desktop canvas next to the entire parts list.

Use a CSS Module or a `.mirror-teardown` namespace for widget-specific rules. The existing standalone CSS demonstrates visual states, but global selectors make it unsuitable for direct import into the profile.

## Security and loading

Keep the host's existing CSP in `next.config.ts`. Bundled local imports and a same-origin GLB do not require a CDN, a remote model host or a broader connect policy. Keep anti-framing headers. No iframe is needed.

Do not import three.js at the top of the React wrapper, prefetch the GLB, start WebGL on intersection, or load a remote decoder. A below-fold poster can use the host image component without high-priority loading.

All evidence remains ordinary outbound links with `rel="noopener noreferrer"` when opening a new tab. Source sites are not fetched by the widget. Keep company names and company-linked savings out of displayed showcase text.

## Acceptance checks in the other repo

1. Read destination scripts, then run its tests, lint and build. At inspection these are `npm test`, `npm run lint` and `npm run build`.
2. Check the real profile in light and dark themes at desktop, 390px and 320px. Check the surrounding sections, not just an isolated widget.
3. Verify zero GLB/viewer requests and no canvas before clicking Load 3D viewer, including after scrolling to the section.
4. Load the viewer. Verify rotate, zoom, each level, option selection, card close/Esc, reverse/stop, failure/retry and reduced motion.
5. Sweep the explode range. Check that the bracket lifts clear before lateral motion and stays separate from the housing in the final pose. Confirm rest pose after reversal and that changing level preserves the explode amount.
6. Verify all fifteen insights and evidence links, including the High glass explanation. Retain the conditional nature of cost ideas and the manufacturing validation limits.
7. Check `#mirror`, existing CV/contact targets and keyboard navigation. Run accessibility checks with a detail card and evidence expanded.
8. Check `/guven`, `/guven/tr`, `/guven/nl`, `/guven/help` and existing privacy routes. Confirm `/`, `/tr`, `/nl` and `/sevgihan` variants are unchanged.
9. Inspect browser network and console for same-origin assets and CSP errors. Verify resource cleanup and offscreen pausing.
10. Check Safari and a real phone where available. Report emulation separately from hardware results.
11. Open a focused PR with a Vercel preview under the destination repository's workflow. Do not merge or deploy production without the owner's instruction.

## Prompt to paste into the other repo

> Integrate the revised generic mirror study from `guventech/door-mirror` into this website. Read the source project's `docs/INTEGRATE_BIRCANS.md` and this repository's AGENTS.md first. Use the source revision that includes the staged bracket motion and framework-neutral ViewerOptions. Add a native React section at `/guven#mirror`, after HowIWork and before SmeOffer. Reuse the renderer, part registry, evidence and same-origin assets. Match the existing theme tokens, Source Serif 4 / Geist typography, section spacing and controls. Preserve click-only loading, accessibility, conditional insights and the corrected explode path. Do not import the standalone global page, inject its HTML or add an iframe. Keep the neutral homepage and Sevgihan pages unchanged. Reuse existing CV/contact targets. Complete translations or explicitly gate the initial section to English. Verify the profile end to end and provide a preview PR. Do not deploy production or merge without my instruction.
