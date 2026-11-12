# Door mirror

Build a standalone interactive cost-engineering showcase here. The user will integrate it into their site later. Do not edit or deploy the existing site.

## Product contract

- Read `tasks/agreement.md` before changing interactions, geometry or copy. `src/parts.ts` owns part identity, level and captions.
- Author original generic geometry. Public copy, model markings and asset names must be free of vehicle/supplier brands, confidential information and company-linked savings figures. Cost ideas are qualitative.
- Use short English sentences with no em dashes or semicolons in visible copy. English is the initial standalone scope.
- Keep the poster and HTML parts explorer useful without WebGL. Import three.js and fetch the GLB only after explicit activation.
- Preserve the Low/Mid/High contract and exploded position when changing level. Auto-dimming is a state of the existing glass.

## Implementation

- Keep the viewer behind a small lifecycle API so it can be embedded later. Bundle dependencies and serve all runtime assets locally.
- Keep editable procedural model source and regenerate the GLB and poster together when geometry changes. Report actual asset size and triangles.
- Test meaningful behavior: level transitions, no-drift transforms, lazy-loading, selection, fallback and cleanup. Verify the built app in a browser and record unavailable hardware coverage honestly.
- Keep `tasks/plan.md` and `tasks/todo.md` current. Command definitions live in package.json.
- Work locally. Publishing, external uploads and production integration need a separate user instruction. Preserve user work and do not create commits unless requested.
