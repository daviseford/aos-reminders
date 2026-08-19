// @vitest-environment jsdom

import type { Aos4ReminderViewModel } from '../../aos4/view'
import Reminders, { type ReminderSourceLink } from 'components/info/reminders'
import { act } from 'react'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: {
      cardBody: 'CardBody',
      noteBorder: 'NoteBorder',
      reminderHr: 'ReminderHr',
      reminderTags: 'ReminderTags',
      text: 'Text',
      textMuted: 'TextMuted',
    },
  }),
}))

vi.mock('utils/hooks/useIsMobile', () => ({ useIsMobile: () => false }))

/**
 * Source resolution is deferred to the first menu open (KTD5): the sources artifact is its own
 * chunk, and a rendered army must not pay for citations nobody asked to see. These cases pin the
 * deferral itself, the announced loading state that stands in while the chunk is in flight, and the
 * offline state that lets the next open try again.
 */

const reminder = (id: string): Aos4ReminderViewModel =>
  ({
    id,
    name: `Ability ${id}`,
    windowKey: 'turn-phase:combat',
    windowLabel: 'Combat Phase',
    typeLabel: 'Active',
    tags: [],
    accessibleLabel: `Ability ${id}`,
    effect: 'Do the thing.',
    hidden: false,
    sourceRecordIndexes: [1],
  }) as unknown as Aos4ReminderViewModel

const link = (id: string, official = false): ReminderSourceLink => ({
  id,
  label: `Source ${id}`,
  href: `https://example.test/${id}`,
  official,
})

describe('reminder source menu', () => {
  let container: HTMLDivElement

  const renderReminders = (
    getSources: (reminder: Aos4ReminderViewModel) => Promise<ReminderSourceLink[]>,
    reminders: Aos4ReminderViewModel[]
  ) => {
    act(() => {
      render(
        <Reminders
          getSources={getSources}
          isGameMode={false}
          onHide={() => {}}
          onNote={() => {}}
          onReorder={() => {}}
          reminders={reminders}
        />,
        container
      )
    })
  }

  const toggles = (): HTMLElement[] => Array.from(container.querySelectorAll('.ReminderMenuToggle'))

  const openMenu = (index = 0) => {
    act(() => {
      Simulate.click(toggles()[index])
    })
  }

  const loadingStatus = () => container.querySelector('.dropdown-menu [role="status"]')
  const itemTexts = () =>
    Array.from(container.querySelectorAll('.dropdown-item-text')).map(node => node.textContent)
  // `target="_blank"` separates the source links from the menu's own actions, which react-bootstrap
  // also renders as `a.dropdown-item`.
  const sourceHrefs = () =>
    Array.from(container.querySelectorAll('.dropdown-menu a.dropdown-item[target="_blank"]')).map(node =>
      node.getAttribute('href')
    )

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('never resolves sources while an army merely renders', () => {
    const getSources = vi.fn(async () => [link('a')])
    renderReminders(
      getSources,
      Array.from({ length: 12 }, (unused, index) => reminder(`reminder:${index}`))
    )

    expect(toggles()).toHaveLength(12)
    expect(getSources).not.toHaveBeenCalled()
    expect(loadingStatus()).toBeNull()
  })

  it('announces a loading state on open and replaces it with the links', async () => {
    let resolveSources: (links: ReminderSourceLink[]) => void = () => {}
    const getSources = vi.fn(
      () =>
        new Promise<ReminderSourceLink[]>(resolve => {
          resolveSources = resolve
        })
    )
    renderReminders(getSources, [reminder('reminder:one')])

    openMenu()
    expect(getSources).toHaveBeenCalledTimes(1)
    expect(loadingStatus()?.textContent).toBe('Loading sources')
    expect(loadingStatus()?.className).toContain('spinner-border-sm')

    await act(async () => {
      resolveSources([link('a', true), link('b')])
    })

    expect(loadingStatus()).toBeNull()
    expect(sourceHrefs()).toEqual(['https://example.test/a', 'https://example.test/b'])
    expect(container.querySelector('.dropdown-header')?.textContent).toBe('Sources:')
  })

  it('resolves once per menu, and each menu independently', async () => {
    const getSources = vi.fn(async (target: Aos4ReminderViewModel) => [link(target.id)])
    renderReminders(getSources, [reminder('reminder:one'), reminder('reminder:two')])

    await act(async () => {
      Simulate.click(toggles()[0])
    })
    expect(getSources).toHaveBeenCalledTimes(1)

    // Closing and reopening a menu that already has its links asks for nothing more.
    await act(async () => {
      Simulate.click(toggles()[0])
    })
    await act(async () => {
      Simulate.click(toggles()[0])
    })
    expect(getSources).toHaveBeenCalledTimes(1)

    await act(async () => {
      Simulate.click(toggles()[1])
    })
    expect(getSources).toHaveBeenCalledTimes(2)
  })

  it('says so when the chunk cannot be fetched, and retries on the next open', async () => {
    const getSources = vi
      .fn<(target: Aos4ReminderViewModel) => Promise<ReminderSourceLink[]>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce([link('a')])
    renderReminders(getSources, [reminder('reminder:one')])

    await act(async () => {
      Simulate.click(toggles()[0])
    })
    expect(itemTexts()).toEqual(['Sources unavailable offline'])
    expect(sourceHrefs()).toEqual([])

    // Closing, then opening again: the failure is not cached, so the menu tries once more.
    await act(async () => {
      Simulate.click(toggles()[0])
    })
    await act(async () => {
      Simulate.click(toggles()[0])
    })
    expect(getSources).toHaveBeenCalledTimes(2)
    expect(sourceHrefs()).toEqual(['https://example.test/a'])
    expect(itemTexts()).toEqual([])
  })
})
