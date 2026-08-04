// @vitest-environment jsdom

import { ReminderTags } from 'components/info/reminders'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('context/useTheme', () => ({
  useTheme: () => ({ theme: { reminderTags: 'ReminderTags-Light' } }),
}))

describe('rendered reminder tags', () => {
  let container: HTMLDivElement

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

  it('keeps a cost tag focusable and toggles its explanation for keyboard and pointer input', () => {
    act(() => {
      render(
        <ReminderTags
          tags={[
            {
              label: '2 CP',
              tone: 'cost',
              description: 'Costs 2 command points to use.',
            },
          ]}
        />,
        container
      )
    })

    const button = container.querySelector('button')
    expect(button).toBeInstanceOf(HTMLButtonElement)
    expect(button?.type).toBe('button')
    expect(button?.tabIndex).toBe(0)
    expect(button?.getAttribute('aria-label')).toBe('2 CP. Costs 2 command points to use.')
    expect(button?.getAttribute('aria-expanded')).toBe('false')

    button?.focus()
    expect(document.activeElement).toBe(button)

    act(() => {
      button?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    })
    expect(button?.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('[role="note"]')?.textContent).toBe('Costs 2 command points to use.')

    act(() => {
      button?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }))
    })
    expect(button?.getAttribute('aria-expanded')).toBe('false')

    act(() => {
      button?.click()
    })
    expect(button?.getAttribute('aria-expanded')).toBe('true')
  })
})
