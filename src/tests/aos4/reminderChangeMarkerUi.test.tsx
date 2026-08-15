// @vitest-environment jsdom

import { act } from 'react'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const logClick = vi.hoisted(() => vi.fn())

vi.mock('utils/analytics', () => ({ logClick }))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: {
      bgColor: 'bg',
      cardBody: 'card-body',
      cardHeader: 'card-header',
      noteBorder: 'note-border',
      reminderHr: 'ReminderHr',
      reminderTags: 'ReminderTags-Light',
      text: 'text',
      textMuted: 'text-muted',
    },
  }),
}))

import {
  REPRESENTATIVE_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
  REPRESENTATIVE_IDS,
} from '../../aos4/generated'
import { createAos4ArmyDocument, type Aos4ArmyDocument } from '../../aos4/state'
import {
  createAos4ReminderViewModel,
  type Aos4ReminderChange,
  type Aos4ReminderViewModel,
} from '../../aos4/view'
import Reminders from 'components/info/reminders'

const IDS = REPRESENTATIVE_IDS

const PUBLICATION_NAME = 'Battlescroll: First Blood'

const stalwartChange: Aos4ReminderChange = {
  publicationName: PUBLICATION_NAME,
  fields: [{ field: 'text.effect', previous: 'Add 1 to save rolls.', next: 'Add 1 to ward rolls.' }],
}

const makeDocument = (reminderPreferences: Aos4ArmyDocument['reminderPreferences'] = {}): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:marker-ui',
    name: 'Marker UI Stormcast',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: [...REPRESENTATIVE_EXPLICIT_SELECTION_IDS],
    reminderPreferences,
  })

const decoratedReminders = (document: Aos4ArmyDocument): Aos4ReminderViewModel[] =>
  createAos4ReminderViewModel(REPRESENTATIVE_CATALOG, document, {
    changesByAbilityId: new Map([[IDS.abilities.stalwartDefenders as string, stalwartChange]]),
  })

describe('reminder changed markers (rendered)', () => {
  let container: HTMLDivElement

  const mount = (reminders: Aos4ReminderViewModel[], isGameMode = false) => {
    act(() => {
      render(
        <Reminders
          getSources={() => []}
          isGameMode={isGameMode}
          onHide={() => undefined}
          onNote={() => undefined}
          onReorder={() => undefined}
          reminders={reminders}
        />,
        container
      )
    })
  }

  const markers = () => container.querySelectorAll<HTMLButtonElement>('.ReminderTag--changed')

  beforeEach(() => {
    logClick.mockClear()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('AE1: shows an accessible marker whose expansion reveals the old and new text', () => {
    mount(decoratedReminders(makeDocument()))

    expect(markers()).toHaveLength(1)
    const marker = markers()[0]

    // The marker rides the tag primitives: a native button carrying the ReminderTag class whose
    // ::after overlay supplies the 24px WCAG 2.5.8 hit-box floor and native keyboard operability.
    expect(marker).toBeInstanceOf(HTMLButtonElement)
    expect(marker.type).toBe('button')
    expect(marker.classList.contains('ReminderTag')).toBe(true)
    expect(marker.textContent).toBe('Updated')
    expect(marker.getAttribute('aria-label')).toContain('Updated')
    expect(marker.getAttribute('aria-label')).toContain(PUBLICATION_NAME)
    expect(marker.getAttribute('aria-expanded')).toBe('false')

    act(() => {
      Simulate.click(marker)
    })

    expect(marker.getAttribute('aria-expanded')).toBe('true')
    const note = container.querySelector('[role="note"]')
    expect(note?.textContent).toContain(PUBLICATION_NAME)
    expect(note?.querySelector('del')?.textContent).toBe('Add 1 to save rolls.')
    expect(note?.textContent).toContain('Add 1 to ward rolls.')
  })

  it('logs one bounded ui_interaction per expansion and none on collapse', () => {
    mount(decoratedReminders(makeDocument()))
    const marker = markers()[0]

    act(() => {
      Simulate.click(marker)
    })
    expect(logClick).toHaveBeenCalledTimes(1)
    expect(logClick).toHaveBeenCalledWith('changelog_marker_expand')

    act(() => {
      Simulate.click(marker)
    })
    expect(logClick).toHaveBeenCalledTimes(1)
  })

  it('marks only the changed reminder, leaving every other tag button unaffected', () => {
    const reminders = decoratedReminders(makeDocument())
    expect(reminders.filter(reminder => reminder.change).map(reminder => reminder.name)).toEqual([
      'Stalwart Defenders',
    ])
    mount(reminders)
    expect(markers()).toHaveLength(1)
  })

  it('keeps the marker on a hidden reminder in edit mode', () => {
    const base = decoratedReminders(makeDocument())
    const stalwart = base.find(reminder => reminder.name === 'Stalwart Defenders')!
    const hidden = decoratedReminders(makeDocument({ [stalwart.id]: { hidden: true } }))
    expect(hidden.find(reminder => reminder.id === stalwart.id)?.hidden).toBe(true)

    mount(hidden, false)

    expect(markers()).toHaveLength(1)
  })

  it('still renders markers on visible reminders in game mode', () => {
    mount(decoratedReminders(makeDocument()), true)

    expect(markers()).toHaveLength(1)
  })
})
