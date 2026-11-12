# Teardown review fixes for the website

Source review: `Downloads/door-mirror-teardown-review.md` (12 Nov 2026).
Standalone copy, badges, provenance, HTML part notes and insight accuracy are updated in this repo. The website still needs a separate apply step.

## Decisions already taken

- Keep **Low / Mid / High** as the level names. Do not rename Low to Base. The product contract uses Low/Mid/High.
- Badge vocabulary now matches the toggle: `In Low spec`, `Added at Mid`, `Added at High`.
- Inactive label: `Not in this spec`.
- For TR/NL pages that still lack the teardown: prefer an EN-only note with a link to `/guven#teardown` until full translation is ready.
- CV CTA replacement, menu entry, meta description, privacy URLs and hreflang remain website-page work.

## English UI strings to apply in `src/lib/i18n/mirror-en.ts`

Replace the `ui` object fields with:

```ts
intro: "A generic exterior mirror. Take it apart to explore the decisions behind a lower-cost design.",
limits: "Illustrative study, not validated. This is a generic model I built myself. It is not based on any manufacturer's or supplier's drawings, parts or cost data. The exploded view explains the assembly. It is not a validated service sequence.",
specification: "Specification level",
levels: { Low: "Low", Mid: "Mid", High: "High" },
badges: { Low: "In Low spec", Mid: "Added at Mid", High: "Added at High" },
partCount: "parts in this specification",
partTotal: "across all levels",
live: "Live 3D",
static: "Preview image",
posterAlt: "Assembled generic door mirror with its glass, housing and mounting base",
staticHint: "Load the 3D model to rotate it, or pick a part below to read about it.",
optionsHint: "Selecting an optional part switches the model to the specification level that includes it.",
inactive: "Not in this spec",
empty: "Select a part to see what it does, one cost idea (with its conditions), and what I would still need to check.",
dimming: "Added at High: auto-dimming.",
```

Also sync every `parts` caption from `door-mirror/src/parts.ts` into the English, Turkish and Dutch mirror dictionaries. The standalone file is the source of truth.

## Component tweak in `MirrorTeardown.tsx`

Change the counter line so it is tier-aware and shows the total:

```tsx
<p className="meta-copy text-muted">
  {activeParts(level).length} {ui.partCount} · {parts.length} {ui.partTotal} · {status === "live" ? ui.live : ui.static}
</p>
```

Add `id="teardown"` on the section root. Add a menu entry only if the host page menu is being edited in the same change.

## TR / NL short-term note

Until the teardown is translated, add a short note on TR and NL profile pages:

> The interactive teardown is currently available in English.

Link it to `/guven#teardown`.

## Out of scope for the door-mirror repo

- Syncing general TR/NL CV and experience copy with EN (P1-5)
- CV cache-busting constant (P2-9)
- Practical tools heading hierarchy (P2-8)
- Closing CTA change from CV to pilot offer (P3-1)
- Meta/social image for the teardown (P3-2)
- Privacy URL and hreflang checks (P3-3, P3-4)
- Corolla savings confidentiality decision (section 7)
- Live browser, Safari and phone QA (section 6)

## Apply reminder

Do not edit the website from this workspace. Open a session in `C:\Users\guven\projects\site`, apply `site-showcase.patch` if still needed, then apply the copy changes above. Show a preview before any production deployment.
