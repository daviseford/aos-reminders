# Phase 2 Baseline (U1)

Measurement evidence for `docs/plans/2026-07-28-003-refactor-phase2-frontend-modernization-plan.md`.
Captured 2026-07-28 on `phase2-modernization` at `0fe58bb0`, Node v25 local / Node 20 CI, clean
`yarn install --frozen-lockfile`.

## Bundle baseline (`yarn build`, production)

| Chunk | Size | Gzip |
|---|---:|---:|
| `assets/Home-*.js` | 12,298.11 kB | 1,313.36 kB |
| `assets/index-*.js` (main) | 583.33 kB | 202.48 kB |
| `assets/index-*.css` | 160.52 kB | 25.13 kB |
| `assets/Profile-*.js` | 81.12 kB | 26.24 kB |
| `assets/generic_modal-*.js` | 26.05 kB | 8.48 kB |
| remaining route/util chunks (13) | < 12 kB each | — |

The Home chunk is dominated by generated AoS 4 catalog modules. Catalog splitting is deferred
(plan KTD4); U9's conservative chunking is measured against this table.

## Dead-package verification (R15)

Method: removed `redux`, `react-redux`, `@reduxjs/toolkit`, `redux-persist`, `react-dropzone`,
and `@types/react-redux` from `package.json`, reinstalled, ran the full gate.

Result: `yarn lint` clean, `yarn build` clean, `yarn test --run` **320 passed / 2 failed — the
identical 2 failures reproduce on the pristine base** (see "Pre-existing red" below). No failure
is attributable to the removals. **Verdict: all six packages are removable.**

## Pre-existing red on the base branch

`src/tests/aos4/catalogIntegrity.test.ts` fails on `phase2-modernization`/`aos4-migration` head
independent of any Phase 2 change: `consumedSourceRecords` 18,269 vs pinned 17,448; accepted
sources 122 vs pinned 104. This tracks in-flight certification-plan corpus work. Phase 2 units
must not "fix" these pins; the certification workstream owns them. Until the base is green, Phase
2 gate runs compare against this known-red set (2 failures in that one file, everything else
green).

## Resolved upgrade targets (npm registry, 2026-07-28)

| Package | Installed | Current | Plan note |
|---|---|---|---|
| react / react-dom | 17.0.2 | 19.2.8 | R5 target confirmed |
| @types/react | 17.0.43 | 19.2.17 | |
| react-router(-dom) | 5.3.0 (dom) | **8.3.0** | **Drift: plan said 7.** v8 is current; migration guides cover 5→6→7→8. U4 pins the major at execution start; KTD7's "one hop" rationale unchanged |
| @hello-pangea/dnd | — | 18.0.1 | React 19 supported |
| bootstrap | 4.6.0 | 5.3.8 | KTD1 target confirmed |
| vite | ^5.3.6 | 8.1.5 | KTD5 stands: target the mature 7.x line, not 8/Rolldown |
| vitest | ^2.0.2 | 4.1.10 | pair with the chosen Vite at execution |
| @vitejs/plugin-react-swc | ^3.7.0 | 4.3.2 | |
| typescript | ~5.3.3 | **7.0.2** | **Drift: plan said "current 5.x".** 7.x is the new native-compiler line; recommend the last stable pre-native line (5.9.x/6.x) under the same conservatism as KTD5, decided at U2 |
| sass | 1.32.13 | 1.102.0 | modern-API capable |
| jspdf | 1.5.3 | 4.2.1 | KTD3 target confirmed |
| @auth0/auth0-react | 2.2.4 | 2.22.0 | same major — low risk |
| react-select | 5.2.2 | 5.10.2 | same major |
| react-modal | 3.16.1 | 3.16.3 | same major |
| react-switch | 6.0.0 | 7.1.0 | major bump — check changelog at U3 |
| react-icons | 4.8.0 | 5.7.0 | major bump — icon path changes possible |
| react-copy-to-clipboard | 5.1.0 | 5.1.1 | |
| react-ga4 | 2.1.0 | 3.0.1 | major bump — API check at U3 |
| luxon | 2.5.2 | 3.7.2 | major bump — mostly types |
| eslint | ^9.7.0 | 10.8.0 | flat config already in place |
| typescript-eslint | ^7.16.0 | 8.65.0 | |

## Polyfill reachability (R4 / KTD8)

`npx browserslist ">0.2%, not dead, not op_mini all"` resolves to 37 browsers; the oldest are
Chrome 103/109, Firefox 121, iOS Safari 26.5-era, Android UC 15.5 — **every resolved browser
supports ES2020** (optional chaining, nullish coalescing, `String.prototype.matchAll`,
`Promise.allSettled`). The wholesale `core-js/stable` import and the `string.prototype.matchall`
package are removable when `target` rises to es2020 (U2). `core-js` is imported only in
`src/main.tsx`.

## Live-site screenshot set (continuity anchor for U3/U6/U7/U9)

Captured from `https://aosreminders.com` 2026-07-28 via agent-browser, full-page (not
viewport-cropped), stored in `docs/data/phase2-baseline/`:

| Route | Desktop (1280 wide) | Mobile (390 wide) |
|---|---|---|
| `/` Home | 1265×3436 | 375×2146 |
| `/faq` | 1265×924 | 375×1472 |
| `/subscribe` | 1280×2303 | 390×3498 |
| `/join` | 1280×800 | 390×844 |
| `/redeem` | 1280×800 | 390×844 |

Join and Redeem equal the viewport because those pages are shorter than one screen, and both were
captured in their **paramless empty state** (no gift or invite token). A parameterized capture is
needed if U6 touches those flows' populated states.

Not captured: `Profile` — it requires an authenticated session, and it is the most account-shell-
dense route in the app. Capture it against a logged-in browser before U6's comparison rather than
treating this set as complete.

### What these screenshots can and cannot anchor

**The live site is the AoS 3 application, and it is explicitly retired.** Home carries a banner
reading *"AoS Reminders will **not** be updated to AoS 4th Edition. This website is no longer
actively maintained."*, and the content beneath it is AoS 3 throughout: Greatfrays, Battalions,
Monstrous Rampages, Command Traits, Artifacts, Prayers, Spells, Battle Tactics, Endless Spells,
Incarnates, Triumphs, plus `Download`/`Import List` actions for importers the cutover removed. The
Subscribe page likewise still advertises Azyr, Warscroll Builder, Battlescribe, and Warhammer App
imports.

So this set anchors **chrome, not content**:

- **Anchors (a delta here is a defect):** dark-blue masthead and nav, `Subscribe`/`FAQ`/`Log in`
  affordances, page typography and heading scale, edit/play toggle, faction selector, the teal
  card header treatment and card geometry, button styling, footer block (PayPal, disclaimer,
  social icons, version line), and responsive breakpoint behavior at both widths.
- **Does not anchor (a delta here is expected):** every content group name and card, reminder
  text, selection lists, the retirement banner (absent in AoS 4), and any copy naming AoS 3
  importers or features.

This split is what `AGENTS.md` means by "the expected exceptions are data-driven"; it is recorded
here so U6's comparison does not chase phantom deltas across the whole card grid.

### Pre-existing rendering issues (do not attribute to Phase 2)

`desktop-subscribe` shows a horizontal scrollbar at 1280px — the live site overflows horizontally
on that route today. Any Bootstrap 5 comparison should treat this as the starting condition, not a
regression introduced by U6.
