// @vitest-environment jsdom

import { vi } from 'vitest'

/*
 * `updateAvailable` reaches `applyWaitingUpdate` in bootstrap/registerServiceWorker, which imports
 * the plugin's `virtual:pwa-register`. That virtual module has no resolvable file on disk, so the
 * test runner cannot import it -- stub it the same way registerServiceWorker.test.ts does.
 */
const virtualRegisterSW = vi.hoisted(() => vi.fn(() => vi.fn(async () => undefined)))

vi.mock('virtual:pwa-register', () => ({ registerSW: virtualRegisterSW }))

import { APPLY_TIMEOUT_MS, DISMISS_DURATION_MS, UpdateAvailable } from 'components/info/updateAvailable'
import { AppStatusProvider } from 'context/useAppStatus'
import { act, type ReactNode } from 'react'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('update-available banner', () => {
  let container: HTMLDivElement
  let onApply: ReturnType<typeof vi.fn<() => void>>

  const mount = (fallback?: ReactNode) => {
    act(() => {
      render(
        <AppStatusProvider>
          <UpdateAvailable fallback={fallback} onApply={onApply} />
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
    onApply = vi.fn<() => void>()
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

  it('applies the waiting update exactly once on a fast double-tap', () => {
    mount()
    announceNewContent()

    /*
     * Both clicks inside one act(): React has not committed `disabled` yet, so the second one
     * genuinely reaches the handler and the re-entrancy guard is what stops it. Clicking in separate
     * act() calls would only prove the disabled attribute works — that version stays green with the
     * guard deleted.
     */
    act(() => {
      const button = reloadButton()!
      Simulate.click(button)
      Simulate.click(button)
    })

    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('ignores further activation once the control is disabled', () => {
    mount()
    announceNewContent()

    act(() => Simulate.click(reloadButton()!))
    act(() => Simulate.click(reloadButton()!))

    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('re-enables the control when the reload never arrives', () => {
    mount()
    announceNewContent()
    act(() => Simulate.click(reloadButton()!))
    expect(reloadButton()!.disabled).toBe(true)

    // applyWaitingUpdate is a no-op when no worker is actually waiting, so no reload ever comes.
    act(() => {
      vi.advanceTimersByTime(APPLY_TIMEOUT_MS)
    })

    expect(reloadButton()!.disabled).toBe(false)
  })

  it('puts the reload control into a disabled in-progress state once activated', () => {
    mount()
    announceNewContent()
    expect(reloadButton()!.disabled).toBe(false)

    act(() => Simulate.click(reloadButton()!))

    expect(reloadButton()!.disabled).toBe(true)
    expect(reloadButton()!.textContent).toContain('Reloading')
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

  it('brings the banner back only once the dismissal window has fully elapsed', () => {
    expect(DISMISS_DURATION_MS).toBe(60 * 60 * 1000)

    mount()
    announceNewContent()
    act(() => Simulate.click(dismissButton()!))
    expect(banner()).toBeNull()

    // Asserting the near edge too: without it a dismissal collapsed to a second would still pass,
    // and a banner that returns immediately is worse than one that never returns.
    act(() => {
      vi.advanceTimersByTime(DISMISS_DURATION_MS - 1)
    })
    expect(banner()).toBeNull()

    act(() => {
      vi.advanceTimersByTime(1)
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

  /*
   * The home screen has one banner slot under its masthead. Handing the slot's usual occupant in as
   * a fallback is what lets the prompt take that slot over instead of stacking a second alert above
   * the masthead.
   */
  it('takes over the host slot only while an update is being offered', () => {
    mount(<p>slot occupant</p>)
    expect(container.textContent).toBe('slot occupant')

    announceNewContent()

    expect(container.textContent).toContain('A new version of AoS Reminders is available.')
    expect(container.textContent).not.toContain('slot occupant')
  })

  it('hands the host slot back when the prompt is dismissed', () => {
    mount(<p>slot occupant</p>)
    announceNewContent()

    act(() => Simulate.click(dismissButton()!))

    expect(container.textContent).toBe('slot occupant')
  })

  it('keeps the dismiss control above the minimum hit box', () => {
    mount()
    announceNewContent()

    // Without flex-shrink-0 the banner text squeezes the close button under the WCAG 2.5.8 floor.
    expect(dismissButton()!.className).toContain('flex-shrink-0')
  })
})
