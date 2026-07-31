// @vitest-environment jsdom

import { UpdateAvailable } from 'components/info/updateAvailable'
import { AppStatusProvider } from 'context/useAppStatus'
import { act } from 'react'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const DISMISS_DURATION_MS = 60 * 60 * 1000

describe('update-available banner', () => {
  let container: HTMLDivElement
  let onApply: ReturnType<typeof vi.fn>

  const mount = () => {
    act(() => {
      render(
        <AppStatusProvider>
          <UpdateAvailable onApply={onApply} />
        </AppStatusProvider>,
        container
      )
    })
  }

  /** The real signal path: the registration dispatches this window event on a waiting worker. */
  const announceNewContent = () => {
    act(() => {
      window.dispatchEvent(new Event('hasNewContent'))
    })
  }

  const banner = () => container.querySelector('[role="alert"]')
  const reloadButton = () =>
    Array.from(container.querySelectorAll('button')).find(b => b.textContent?.includes('Reload'))
  const dismissButton = () => container.querySelector<HTMLButtonElement>('.btn-close')

  beforeEach(() => {
    vi.useFakeTimers()
    onApply = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.useRealTimers()
  })

  it('renders nothing until a new version is waiting', () => {
    mount()

    expect(banner()).toBeNull()
    expect(container.textContent).toBe('')
  })

  it('offers a reload and a dismiss once a new version is announced', () => {
    mount()
    announceNewContent()

    expect(banner()).not.toBeNull()
    expect(reloadButton()).toBeDefined()
    expect(dismissButton()).not.toBeNull()
    expect(container.textContent).toContain('A new version of AoS Reminders is available.')
  })

  it('applies the waiting update exactly once, however many times it is activated', () => {
    mount()
    announceNewContent()

    act(() => Simulate.click(reloadButton()!))
    act(() => Simulate.click(reloadButton()!))
    act(() => Simulate.click(reloadButton()!))

    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('puts the reload control into a disabled in-progress state once activated', () => {
    mount()
    announceNewContent()
    expect(reloadButton()!.disabled).toBe(false)

    act(() => Simulate.click(reloadButton()!))

    expect(reloadButton()!.disabled).toBe(true)
    expect(reloadButton()!.textContent).toContain('Reloading')
    expect(dismissButton()!.disabled).toBe(true)
  })

  it('hides on dismiss without applying the update', () => {
    mount()
    announceNewContent()

    act(() => Simulate.click(dismissButton()!))

    expect(banner()).toBeNull()
    expect(onApply).not.toHaveBeenCalled()
  })

  it('persists nothing on dismiss, so a later build still prompts', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    mount()
    announceNewContent()

    act(() => Simulate.click(dismissButton()!))

    expect(setItem).not.toHaveBeenCalled()
    setItem.mockRestore()
  })

  it('brings the banner back after the dismissal window elapses', () => {
    mount()
    announceNewContent()
    act(() => Simulate.click(dismissButton()!))
    expect(banner()).toBeNull()

    act(() => {
      vi.advanceTimersByTime(DISMISS_DURATION_MS)
    })

    expect(banner()).not.toBeNull()
  })

  it('announces itself and names both controls for assistive technology', () => {
    mount()
    announceNewContent()

    // It appears without any user action, so it has to be announced rather than merely present.
    expect(banner()!.getAttribute('role')).toBe('alert')
    expect(dismissButton()!.getAttribute('aria-label')).toBe('Dismiss update notification')
    expect(reloadButton()!.textContent?.trim()).toBeTruthy()
  })

  it('keeps itself off the printed reminder sheet', () => {
    mount()
    announceNewContent()

    expect(banner()!.className).toContain('d-print-none')
  })

  it('keeps the dismiss control above the minimum hit box', () => {
    mount()
    announceNewContent()

    // Without flex-shrink-0 the banner text squeezes the close button under the WCAG 2.5.8 floor.
    expect(dismissButton()!.className).toContain('flex-shrink-0')
  })
})
