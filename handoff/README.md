# Website fixes ready to apply

The website checkout at `C:\Users\guven\projects\site` is outside this session's writable workspace. It has not been edited or deployed. This folder contains the website patch, a matching browser regression test and a local application script.

## Apply in the website project

Open a Codex session in `C:\Users\guven\projects\site` and give it this task:

> Apply the prepared door mirror fixes from `C:\Users\guven\projects\door-mirror\handoff`. Read this repo's AGENTS.md first. Review site-showcase.patch, run apply-site-fixes.ps1 and preserve unrelated work. Keep the neutral homepage unchanged. Run tests, lint and build, then run the mirror and site-showcase browser tests at desktop and 390px. Inspect the real /guven page, including the header, project cards and full-screen phone viewer. Show a preview before any production deployment. Do not commit or deploy unless I ask.

The script can also be run from your normal PowerShell terminal:

```powershell
& C:\Users\guven\projects\door-mirror\handoff\apply-site-fixes.ps1
cd C:\Users\guven\projects\site
npm test
npm run lint
npm run build
npx playwright test e2e/mirror.spec.ts e2e/site-showcase.spec.ts --project=chromium
```

The browser configuration starts the production app on port 3100. Use the installed browser configuration in that repository. Run its WebKit project too if the browser is installed.

The script checks the text patch before writing and refuses to replace locally edited mirror assets. If the patch no longer matches, review the changes in the website project. Do not force it. The script does not commit, push or deploy.

## Included changes

- Each module has a separate bounding box at full explosion. The cover and glass move first, followed by the heater, adjuster, motor, lights, camera, housing, base and gasket. Wiring and fasteners separate early to expose the inner parts.
- The gasket moves sideways before lifting so it does not cross back through the base. These are display motions. They are not a validated repair procedure.
- Only the existing patent and public road-safety references remain. Parts without a neutral reference still show their explanation and limits.
- The assembly warning is two sentences. The canvas label, English career sentence and school name also lose their semicolon or em dash.
- Selected rows alone get the selection background. Hover underlines the row text. Keyboard focus has a clear outline.
- The personal project cards are shown directly. An empty projects array cannot leave a heading behind.
- The theme button gains a visible Theme label on the Guven profile. Its accessible action label remains. The shared component's default appearance is unchanged for the neutral homepage.
- Opening evidence scrolls its summary clear of the site header or the phone dialog header.
- On phones, Load 3D viewer opens a native full-screen dialog. It has a sticky Close viewer button, background scroll locking, native focus containment, Escape handling, page-position restoration and an Open full screen button for reopening. The same canvas stays mounted when the website dialog closes.
- Pinch zoom and free rotation are enabled inside the phone dialog. Inline views retain normal page scrolling. Zoom buttons remain available.

## What was checked here

The shared model and standalone app were tested in Chrome. The exact patched React mirror components were also built in an isolated local test page using the website's compiled styles, a fixed header and a simple image adapter. Desktop and 390px tests check the module views in three angles for Low, Mid and High, one-row selection, neutral evidence, header clearance, dialog close, Escape, reopening and console errors. The patched mirror components and all three mirror dictionaries pass TypeScript checking.

This local test page is not the full Next.js app. The full website tests, lint, build, real header composition, production page, Safari and physical phones still need verification in the website project. There is no claim that these fixes are live.
