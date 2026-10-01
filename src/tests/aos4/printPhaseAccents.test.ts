// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { TURN_PHASES, type GameWindow } from '../../aos4/domain/game'
import {
  COMPACT_PRESET,
  STANDARD_PRESET,
  createAos4PrintDocument,
  createJsPdfMeasurer,
  planPrintLayout,
  renderPrintPlanToPdf,
  type PrintReminderInput,
} from '../../aos4/print'
import { PRINT_PHASE_ACCENTS, phaseAccentFor } from '../../aos4/print/phaseAccents'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { gameWindowKey } from '../../aos4/reminders/reminderIdentity'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel } from '../../aos4/view'

const hex = ([red, green, blue]: readonly [number, number, number]) =>
  `#${[red, green, blue].map(value => value.toString(16).padStart(2, '0')).join('')}`

const reminder = (id: string, window: GameWindow, label: string, words = 20): PrintReminderInput => ({
  id,
  name: `Rule ${id}`,
  windowKey: gameWindowKey(window),
  windowLabel: label,
  typeLabel: 'Active',
  effect: Array.from({ length: words }, (_, index) => `${id}${index}word`).join(' '),
  hidden: false,
})

const army = { armyName: 'Phase Army', factionName: 'Stormcast Eternals' }

/** jsPDF writes colours as `r g b rg` (fill) and `r g b RG` (stroke), each channel 0-1 to 2 places. */
const colourOperator = ([red, green, blue]: readonly [number, number, number], op: 'rg' | 'RG') =>
  `${[red, green, blue].map(value => (value / 255).toFixed(2)).join(' ')} ${op}`

describe('phaseAccentFor (#2052)', () => {
  it('pins each turn phase to the timing-bar colour in the official rules artwork', () => {
    expect(
      Object.fromEntries(Object.entries(PRINT_PHASE_ACCENTS).map(([phase, rgb]) => [phase, hex(rgb)]))
    ).toEqual({
      'start-of-turn': '#231f20',
      hero: '#a88d30',
      movement: '#808285',
      shooting: '#00526d',
      charge: '#ca6722',
      combat: '#8b0018',
      'end-of-turn': '#5d367d',
    })
  })

  it('gives every turn phase a distinct colour, keyed the way reminder sections are keyed', () => {
    const colours = TURN_PHASES.map(phase =>
      phaseAccentFor(gameWindowKey({ kind: 'turn-phase', phase: phase.id }))
    )

    colours.forEach(colour => expect(colour).toBeDefined())
    expect(new Set(colours.map(colour => hex(colour!))).size).toBe(TURN_PHASES.length)
  })

  it('leaves sections the rulebook does not colour consistently on the default accent', () => {
    const windows: GameWindow[] = [
      { kind: 'battle-start' },
      { kind: 'deployment' },
      { kind: 'battle-round-start', round: 2 },
      { kind: 'phase-independent' },
      { kind: 'battle-round-end' },
      { kind: 'battle-end' },
      { kind: 'reaction' },
      { kind: 'always' },
      { kind: 'unknown' },
    ]

    windows.forEach(window => expect(phaseAccentFor(gameWindowKey(window)), window.kind).toBeUndefined())
    expect(phaseAccentFor('turn-phase:not-a-phase')).toBeUndefined()
    expect(phaseAccentFor(undefined)).toBeUndefined()
  })
})

describe('phase accents in the print plan and PDF (#2052)', () => {
  const longHeroSection = () =>
    createAos4PrintDocument(
      [
        ...Array.from({ length: 40 }, (_, index) =>
          reminder(`h${index}`, { kind: 'turn-phase', phase: 'hero' }, 'Hero Phase', 60)
        ),
        reminder('p0', { kind: 'always' }, 'Passive'),
      ],
      army
    )

  it('tags every section heading line, including continuations, with its section key', () => {
    ;[STANDARD_PRESET, COMPACT_PRESET].forEach(preset => {
      const plan = planPrintLayout(longHeroSection(), preset, createJsPdfMeasurer())
      const headings = plan.lines.filter(line => line.role === 'sectionHeading')

      expect(
        headings.some(line => line.text.endsWith('(continued)')),
        preset.id
      ).toBe(true)
      headings.forEach(line => {
        expect(line.sectionKey, line.text).toBe(
          line.text.startsWith('Hero Phase') ? 'turn-phase:hero' : 'always'
        )
      })
      plan.lines
        .filter(line => line.role !== 'sectionHeading')
        .forEach(line => expect(line.sectionKey).toBeUndefined())
    })
  })

  it('draws a turn-phase heading in its phase colour and other headings in the teal accent', () => {
    const plan = planPrintLayout(longHeroSection(), STANDARD_PRESET, createJsPdfMeasurer())
    const pdf = renderPrintPlanToPdf(plan, { title: 'Phase Army' }).output()

    expect(pdf).toContain(colourOperator(PRINT_PHASE_ACCENTS.hero, 'rg'))
    expect(pdf).toContain(colourOperator(PRINT_PHASE_ACCENTS.hero, 'RG'))
    expect(pdf).toContain(colourOperator([28, 117, 149], 'RG'))
    expect(pdf).not.toContain(colourOperator(PRINT_PHASE_ACCENTS.movement, 'RG'))
  })

  it('colours the turn-phase sections of a real catalog army and nothing else', () => {
    const faction = AOS4_CATALOG.entities.find(
      entity => entity.kind === 'faction' && entity.name === 'Stormcast Eternals'
    )
    if (!faction) throw new Error('No Stormcast Eternals faction')
    const reminders = createAos4ReminderViewModel(
      AOS4_CATALOG,
      createAos4ArmyDocument({
        id: 'army:test-phase-accents',
        name: 'Phase Accents',
        rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        explicitSelectionIds: [faction.id] as never,
      })
    )
    const plan = planPrintLayout(
      createAos4PrintDocument(reminders, { armyName: 'Phase Accents', factionName: 'Stormcast Eternals' }),
      COMPACT_PRESET,
      createJsPdfMeasurer()
    )
    const headings = plan.lines.filter(line => line.role === 'sectionHeading')
    const accented = headings.filter(line => phaseAccentFor(line.sectionKey))

    expect(accented.length).toBeGreaterThanOrEqual(5)
    accented.forEach(line => expect(line.text).toMatch(/ Phase( \(continued\))?$/))
    headings
      .filter(line => !phaseAccentFor(line.sectionKey))
      .forEach(line => expect(line.sectionKey?.startsWith('turn-phase:'), line.text).toBe(false))
  })
})
