/**
 * New Recruit corpus driver — paste into the browser console on a New Recruit list page.
 *
 * Automates the mechanical part of corpus capture: adding every unit a catalogue offers and
 * ticking every option each unit exposes. Building varied lists by hand does not scale to 28
 * armies × every unit × every enhancement, and that scale is the point — the importer's hardest
 * job is resolving names, so the corpus must contain every name the catalogue can emit.
 *
 * See CAPTURE.md for the surrounding procedure. This file is documentation-with-a-runtime: it is
 * never imported by application or test code.
 *
 * ## Why the DOM and not the app's model layer
 *
 * New Recruit is a Nuxt/Pinia app whose roster model is reachable
 * (`useNuxtApp().$pinia._s.get('lists').getCurrentList().army`), and reading it is the reliable
 * way to *enumerate* what exists. But writing through it does not stick: `selector.addInstance()`
 * and `instance.setAmount(1)` both return successfully while `getInstancesAmount()` stays 0 and
 * the export is unchanged — selection state is committed by the component layer, not the model.
 *
 * So: **read through the model, write through the DOM.** Both writes below are real user gestures.
 *
 *   1. Adding a unit  — click `[title="Create Unit"]` on a `.unit-wrap` row in a `.unitList`
 *                       (the left browser panel).
 *   2. Setting options — click the unit's name in the main panel to open the per-unit option
 *                        panel (`?view=<uid>`), then click its `input[type=checkbox]`.
 *
 * ## Legality is deliberately ignored
 *
 * `tickAllOptions` ticks *every* enabled checkbox it finds, so one hero carries many artefacts and
 * the army busts every points limit. That is intended: AoS Reminders never gates on game legality
 * (see README.md), and maximising options per list minimises the number of lists needed for full
 * coverage. Where New Recruit enforces exclusivity it simply refuses the extra clicks; use
 * `optionOffset` to reach those alternatives in a second list.
 *
 * ## Usage
 *
 *   await NRD.buildAll()                  // add every unit, then tick every option
 *   await NRD.buildAll({optionOffset: 1}) // second list: start exclusive groups one option later
 *   NRD.coverage()                        // what is in the list vs what the catalogue offers
 *
 * Then export .ros / .rosz / .json from the Export dialog and run
 * `yarn fixtures:new-recruit:ingest <list-name>`.
 */
;(() => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const app = () => window.useNuxtApp().$pinia._s.get('lists').getCurrentList()
  const armyOf = () => app().army
  const nameOf = node => {
    try {
      return node.getName?.() ?? node.name ?? '?'
    } catch {
      return '?'
    }
  }

  /** Rows the left browser panel is currently offering, keyed by display name. */
  const browserRows = () => {
    const rows = []
    for (const list of document.querySelectorAll('.unitList')) {
      for (const row of list.querySelectorAll('.unit-wrap')) {
        const name = row.querySelector('.name')?.textContent?.trim()
        const add = row.querySelector('[title="Create Unit"]')
        if (name && add) rows.push({ name, add })
      }
    }
    return rows
  }

  /**
   * Add every unit the browser panel offers, in batches.
   *
   * The panel re-renders after each click and the renderer can stall for seconds on large lists,
   * so this yields between batches and re-reads the DOM each round rather than caching nodes.
   * `seen` is keyed by name because a row's DOM node does not survive the re-render.
   */
  const addAllUnits = async ({ batchSize = 12, pause = 1500, skip = [] } = {}) => {
    const seen = new Set(skip)
    const added = []
    for (let round = 0; round < 200; round += 1) {
      const pending = browserRows().filter(row => !seen.has(row.name))
      if (pending.length === 0) break
      for (const row of pending.slice(0, batchSize)) {
        row.add.click()
        seen.add(row.name)
        added.push(row.name)
      }
      await sleep(pause)
    }
    return added
  }

  /** Units currently in the list, as the model sees them. */
  const listedUnits = () =>
    armyOf()
      .getUnits()
      .map(unit => ({ name: nameOf(unit), unit }))

  /**
   * Does this unit expose anything selectable?
   *
   * Read from the model to avoid opening a panel per unit: every unit has one selector group
   * named after itself (its models), so anything beyond that is a real option group.
   */
  const hasOptions = ({ unit, name }) =>
    (unit.selectors ?? []).some(group => !group.hidden && nameOf(group) !== name)

  /**
   * Rows of the main (right-hand) list panel, in document order.
   *
   * Rows carry no id attribute — only scoped-style markers — so the option panel is addressed
   * positionally. Order is stable for a given list, but re-read the rows every time: opening a
   * panel re-renders them and cached nodes go stale.
   */
  const mainRows = () => [...document.querySelectorAll('.unitRow')].filter(row => !row.closest('.unitList'))

  /** Open the per-unit option panel for the row at `index`. */
  const openPanel = async (index, { pause = 900 } = {}) => {
    const row = mainRows()[index]
    const clickable = row?.querySelector('.displayName, .name')
    if (!clickable) return null
    const label = clickable.textContent.trim().slice(0, 60)
    clickable.click()
    await sleep(pause)
    return label
  }

  /** The label text identifying a checkbox within its panel. */
  const boxLabel = box => (box.closest('label') ?? box.parentElement)?.textContent?.trim() ?? ''

  /**
   * Tick the options in the open panel, attempting each one exactly once.
   *
   * **Attempt-once is load-bearing, not an optimisation.** Many groups are mutually exclusive:
   * ticking a second battle formation silently unticks the first. A "loop until nothing is
   * unchecked" strategy therefore never converges on those groups — it oscillates between the
   * options forever, and because every click triggers a full roster recompute, the tab appears to
   * hang. Attempting each label once terminates, and leaves exclusive groups on their last
   * attempted option.
   *
   * Options also cascade (ticking "General" reveals Heroic Traits), so after each pass this
   * re-queries for labels it has not seen yet, up to `rounds` times.
   *
   * `offset` rotates the order, so a second list settles exclusive groups on a different option.
   */
  const tickAllOptions = async ({ offset = 0, rounds = 4, pause = 350, perClick = 110 } = {}) => {
    const attempted = new Set()
    let ticked = 0
    for (let round = 0; round < rounds; round += 1) {
      const boxes = [...document.querySelectorAll('input[type=checkbox], input[type=radio]')].filter(
        box => !box.disabled && !box.checked && !attempted.has(boxLabel(box))
      )
      if (boxes.length === 0) break
      const ordered = offset > 0 ? [...boxes.slice(offset), ...boxes.slice(0, offset)] : boxes
      for (const box of ordered) {
        const label = boxLabel(box)
        if (attempted.has(label)) continue
        attempted.add(label)
        if (box.disabled || box.checked || !box.isConnected) continue
        box.click()
        ticked += 1
        await sleep(perClick)
      }
      await sleep(pause)
    }
    return ticked
  }

  /**
   * Open every main-panel row in turn and tick its options.
   *
   * Walks by position rather than by unit, because that is how the panel is addressable — and it
   * means composition rows (Battle Formation, the lores, Battle Tactic Cards) get the same
   * treatment as units, which is where formation and lore choices actually come from.
   *
   * `from`/`limit` let a long list be worked in chunks across several calls, since the renderer
   * stalls on large lists and a single uninterrupted pass is likely to be cut short.
   */
  const optionPass = async ({ optionOffset = 0, pause = 900, from = 0, limit = Infinity } = {}) => {
    const report = []
    const total = mainRows().length
    const end = Math.min(total, from + limit)
    for (let index = from; index < end; index += 1) {
      const label = await openPanel(index, { pause })
      if (label === null) {
        report.push({ index, error: 'row missing' })
        continue
      }
      const ticked = await tickAllOptions({ offset: optionOffset })
      if (ticked > 0) report.push({ index, row: label, ticked })
    }
    return { total, from, to: end, changed: report }
  }

  /**
   * Coverage of the current list against the catalogue.
   *
   * `book.getUnits()` is every entry the catalogue can emit; `army.getUnits()` is what the list
   * holds. `missing` is the gap this capture leaves — carry it into the next list.
   */
  const coverage = () => {
    const catalogue = new Set(app().book.getUnits().map(nameOf))
    const inList = new Set(listedUnits().map(entry => entry.name))
    const missing = [...catalogue].filter(name => !inList.has(name)).sort()
    return {
      catalogue: catalogue.size,
      inList: inList.size,
      missing,
      coveragePct: Math.round((100 * [...catalogue].filter(n => inList.has(n)).length) / catalogue.size),
    }
  }

  const buildAll = async (options = {}) => {
    const added = await addAllUnits(options)
    const ticked = await optionPass(options)
    return { added: added.length, units: added, options: ticked, coverage: coverage() }
  }

  window.NRD = {
    addAllUnits,
    optionPass,
    tickAllOptions,
    openPanel,
    listedUnits,
    hasOptions,
    mainRows,
    coverage,
    buildAll,
    browserRows,
  }
  console.log('NRD ready: NRD.buildAll(), NRD.coverage()')
})()
