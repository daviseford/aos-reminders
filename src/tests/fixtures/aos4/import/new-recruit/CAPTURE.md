# Capturing New Recruit lists — the repeatable procedure

How to produce one fixture triple (`.ros` + `.rosz` + `.json`) per army in
[New Recruit](https://www.newrecruit.eu/), verified against the corpus invariants and ingested
with one command. Written from a walkthrough performed 2026-07-29; UI details drift, so trust the
shape of the flow over pixel-exact details.

No account is required: lists are stored in the browser (localStorage) and every export is
client-side. A logged-in session only adds the `Link` (share URL) export, which is nice-to-have
provenance, not a requirement.

## The loop, per army

### 1. Create the list

1. Open <https://www.newrecruit.eu/app/MyLists>.
2. In the game-system dropdown (top of the sidebar), select **Age of Sigmar 4.0**.
3. Click **Create List**. In the dialog:
   - **Faction** — pick the army. A *second* dropdown appears after selection (catalogue
     variant); leave it at its default unless the capture targets a variant.
   - **List Name** — **use the fixture id** (`sce-001-minimal`). The exported files are named
     after the list, so this makes ingestion automatic.
   - **Cost Limits** — `2000` for a standard list; whatever the shape calls for otherwise.
   - **Force** — the rules context. `✦ General's Handbook 2026-27` is the current default;
     GHB 2024-25 / 2025-26 and the Path to Glory contexts are in the same dropdown.
4. Click **Create List**. The editor opens at `/app/Lists/<local-id>`.

### 2. Build it

- Click **Add Regiments and Auxiliary** → in the dialog, **+** next to **Regiment** (the same
  dialog offers **Auxiliary Units** and **Regiments of Renown**). The regiment appears as its own
  force panel with a **Regimental Leader** slot.
- The left sidebar switches to the regiment's unit browser, grouped by role (**HERO**,
  **INFANTRY**, …) with a search box at the bottom. **+** on a row adds the unit; heroes added
  first fill the leader slot. Added units appear in the main panel, where their row exposes
  options (wargear, general, enhancements) and per-row view / duplicate / delete controls —
  duplicate is the quick way to capture the duplicate-units shape.
- Army-wide picks (Battle Formation, spell/prayer/manifestation lores, battle tactic cards,
  faction terrain, Allow Legends) are in the sidebar's **Configuration** / **Army Composition**
  sections.
- A **minimal per-army capture** is: one regiment, one leader hero, one non-hero unit. That is
  enough to exercise faction detection and name resolution for the army; richer shapes
  (reinforcement, enhancements, seasonal variants, illegal compositions — see the strategy doc's
  coverage matrix) are layered onto *additional* lists, not crammed into this one.
- Do **not** avoid warning icons. Over-points, missing general, undersize units — those lists are
  wanted (`--illegal`); legality is deliberately not our concern.

There is no save button — every change persists immediately.

### 3. Export all three formats

1. Click **Export** (top right) → the **Export List** dialog offers
   `Text · Pretty · Templates · .rosz · .ros · json · Link`.
2. Click **.ros**, then **.rosz**, then **json**. The dialog stays open between clicks; each
   downloads `<list name>.<ext>` to the browser's download directory.
3. (`Link` requires a logged-in, synced list. When available, record it via `--share-url`.)

### 4. Ingest

```sh
yarn fixtures:new-recruit:ingest sce-001-minimal
```

The command refuses to write anything unless the triple passes the corpus invariants
(`.rosz` byte-identical to `.ros`, `.json` an exact transliteration, no personal fields), then
creates `lists/<id>/`, computes the `meta.json` composition counts from the roster, and
regenerates `manifest.json`. Options: `--from <dir>` if downloads land elsewhere, `--id` when the
list name isn't the fixture id, `--illegal "Illegal Units,Undersize Unit"` for deliberately
illegal lists, `--description`, `--shapes`, `--share-url`, `--force`.

Then finish by hand — the two judgment calls a script can't make:

1. Edit `meta.json`: replace `shapes: ["needs-classification"]` with the real coverage shapes
   (reuse vocabulary from `manifest.json` → `coverage`) and write a description.
2. `yarn vitest run src/tests/aos4/importFixtures.test.ts`

## The army work-list

Every faction New Recruit offers for AoS 4.0 (Create List → Faction, captured 2026-07-29), with
the slug used in fixture ids. One `<slug>-001-minimal` per faction is the baseline corpus; the
two `[LEGENDS]` factions and Regiments of Renown are themselves coverage shapes.

| Faction (exact display name)   | Slug  |
| ------------------------------ | ----- |
| Beasts of Chaos [LEGENDS]      | `boc` |
| Blades of Khorne               | `bok` |
| Bonesplitterz [LEGENDS]        | `bsz` |
| Cities of Sigmar               | `cos` |
| Daughters of Khaine            | `dok` |
| Disciples of Tzeentch          | `dot` |
| Flesh-eater Courts             | `fec` |
| Fyreslayers                    | `fs`  |
| Gloomspite Gitz                | `gg`  |
| Hedonites of Slaanesh          | `hos` |
| Helsmiths of Hashut            | `hh`  |
| Idoneth Deepkin                | `idk` |
| Ironjawz                       | `ij`  |
| Kharadron Overlords            | `ko`  |
| Kruleboyz                      | `kb`  |
| Lumineth Realm-lords           | `lrl` |
| Maggotkin of Nurgle            | `mon` |
| Nighthaunt                     | `nh`  |
| Ogor Mawtribes                 | `om`  |
| Ossiarch Bonereapers           | `obr` |
| Seraphon                       | `ser` |
| Skaven                         | `skv` |
| Slaves to Darkness             | `std` |
| Sons of Behemat                | `sob` |
| Soulblight Gravelords          | `sbg` |
| Stormcast Eternals             | `sce` |
| Sylvaneth                      | `syl` |
| ۞ Regiments of Renown          | `ror` |

Force contexts available in the same dialog: `✦ General's Handbook 2026-27` (default),
`General's Handbook 2025-26`, `General's Handbook 2024-25`, `Path to Glory: Blighted Wilds`,
`Path to Glory: Ravaged Coast`, `Path to Glory: Ascension`,
`Path to Glory: Freeform [UNOFFICIAL]`.

## Coverage captures: every unit in an army

The per-army baseline above is one small list. For **catalogue coverage** — every unit name the
importer might have to resolve — use [`driver.js`](./driver.js): paste it into the browser console
on the list page and run `await NRD.buildAll()`. `sce-002-units-a` was produced this way and holds
all 90 Stormcast entries.

The technique that makes this cheap: add units to an **Auxiliary Units** force rather than a
Regiment. Regiments constrain what may be taken; auxiliaries do not, so a single list can hold the
entire catalogue. The result is wildly illegal (90 units, 15,750 pts, no general) and that is
fine — see "Game legality is not checked" in the README.

Rules of thumb for coverage lists:

- One list per army holds every **unit**. Split into `-002`/`-003` only if the app struggles.
- **Mutually exclusive** picks (battle formation, each lore) can only hold one value per list, so
  they need one extra list per alternative, or `NRD.buildAll({optionOffset: n})` to settle them on
  a different option.
- `NRD.coverage()` reports catalogue size, what the list holds, and exactly what is missing.

## Notes for browser automation (Claude in Chrome)

Five findings from automating this; all are encoded in `driver.js`, and ignoring any of them
silently produces an empty or partial capture.

1. **Read through the app's model, write through the DOM.** The Pinia roster model is reachable
   (`useNuxtApp().$pinia._s.get('lists').getCurrentList()`) and is the reliable way to *enumerate*
   the catalogue (`book.getUnits()`) and the list (`army.getUnits()`). But writes through it do
   not stick: `selector.addInstance()` and `instance.setAmount(1)` both return successfully while
   `getInstancesAmount()` stays 0 and the export is unchanged. Only real DOM gestures commit.
2. **Add the Auxiliary force through the dialog**, not `addForceInstance()`. A model-created force
   accepts unit additions and renders correctly, then vanishes on reload along with everything
   added to it — a whole 90-unit build was lost this way.
3. **Attempt each option once.** Many option groups are mutually exclusive: ticking a second
   battle formation unticks the first. "Tick until nothing is unchecked" therefore never
   converges — it oscillates forever, and since every click recomputes the roster, the tab looks
   hung.
4. **A backgrounded tab throttles `setTimeout` to ~1s.** Long chains of short sleeps stretch from
   seconds to minutes. Keep the tab visible for option passes, or expect them to crawl.
5. **Wait for the save, then verify by reloading before exporting.** Saving is asynchronous and
   debounced; navigating away too early discards the build. Reload and re-check
   `army.getUnits().length` before opening the Export dialog.
6. **Pick the faction dropdown with the most options.** Once the account holds lists, MyLists
   grows a *faction filter* `<select>` that also contains faction names, and "the first select
   containing this faction" then silently matches the filter instead of the dialog. The dialog's
   dropdown is the one listing all 28 factions. A whole army was captured under the wrong faction
   before this was caught, so **verify `book.getName()` immediately after creating a list**, before
   adding anything.
7. **Export buttons need real mouse events.** A synthetic `element.click()` on the `.imgBt` in
   `.exports` returns cleanly and does nothing; the handlers respond to genuine pointer events.
   Locate the button in the DOM and derive its screen position (divide `getBoundingClientRect()`
   by `window.innerWidth / 1568`), then click that coordinate — position-independent, and no
   screenshot required. The same applies to the Auxiliary "+" in the force dialog.
8. **Chrome blocks bulk automatic downloads.** After roughly fifteen files, downloads from
   newrecruit.eu stop landing silently — clicks still register, no error appears anywhere on the
   page. Each list is three files, so this trips after about five armies. Grant the site's
   "Automatic downloads" permission (address-bar icon) before a long capture run, and **verify
   files actually arrived after each army** rather than trusting the click.
9. **Export all three formats in one burst, and re-export all three if any is missing.** New
   Recruit regenerates *derived* ids every time it serialises a roster: the `Illegal Units`
   category (`entryId="(Illegal Units)"`) came out as `id="vs97vii"` in a `.ros` and `id="skdssgm"`
   in a `.rosz` taken two minutes later from the same unmodified list. The files were otherwise
   byte-for-byte identical, same length. Mixing formats from different export moments therefore
   breaks invariant 1 — which is exactly how this was found. Never top up a partial capture with a
   single re-exported format; take the set again.

Only one async job at a time: an abandoned in-page loop kept adding units to whatever list was
open, producing duplicated Army Composition rows in a list built later. If a driver job may still
be running, reload the page before starting the next one.

The build-and-export loop is otherwise straightforward to automate against a normal session:

- **Give the app settle time.** The editor re-renders heavily after every click — the renderer
  can be unresponsive for several seconds (screenshots time out). Wait 2–5 s after each action
  and retry once before assuming failure.
- **Re-resolve element refs after any dialog change.** Selecting a faction re-renders the Create
  List dialog and invalidates previously read element references.
- **The export dialog stays open** across the three format clicks — open it once, click
  `.ros` / `.rosz` / `json`, close.
- **Name the list its fixture id** and the downloads need no renaming; verify all three files
  exist in the download directory before moving on (the third click occasionally needs a retry).
- **Type into fields, don't set them programmatically.** Setting the Cost Limits input via a
  DOM-level value write showed `2000` in the dialog but exported `costLimit value="0"` — the app
  only persists values it sees typed (input events). Verify `pointsLimit` in the ingest output.
- Then run the ingest command per list. Building the list is the human-judgment part; capture and
  ingest are the mechanical parts.
