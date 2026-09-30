// @vitest-environment jsdom

import { vi } from 'vitest'

/*
 * `installingUpdate` reaches `applyWaitingUpdate` in bootstrap/registerServiceWorker, which imports
 * the plugin's `virtual:pwa-register`. That virtual module has no resolvable file on disk, so the
 * test runner cannot import it -- stub it the same way registerServiceWorker.test.ts does.
 */
const virtualRegisterSW = vi.hoisted(() => vi.fn(() => vi.fn(async () => undefined)))

vi.mock('virtual:pwa-register', () => ({ registerSW: virtualRegisterSW }))

const theme = vi.hoisted(() => ({ isDark: false }))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({ isDark: theme.isDark, theme: { text: theme.isDark ? 'text-light' : 'text-dark' } }),
}))

import { INSTALL_FALLBACK_RELOAD_MS, InstallingUpdate } from 'components/info/installingUpdate'
import { AppStatusProvider } from 'context/useAppStatus'
import { act } from 'react'
import Modal from 'react-modal'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('installing-update modal', () => {
  let container: HTMLDivElement
  let onApply: ReturnType<typeof vi.fn<() => void>>
  let reload: ReturnType<typeof vi.fn<() => void>>

  const mount = (isInstallSuppressed = () => false) => {
    act(() => {
      render(
        <AppStatusProvider>
          <InstallingUpdate isInstallSuppressed={isInstallSuppressed} onApply={onApply} reload={reload} />
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

  // react-modal portals into document.body, outside the render container.
  const dialog = () => document.querySelector<HTMLElement>('.ReactModal__Content')
  const overlay = () => document.querySelector<HTMLElement>('.ReactModal__Overlay')

  beforeEach(() => {
    vi.useFakeTimers()
    theme.isDark = false
    onApply = vi.fn<() => void>()
    reload = vi.fn<() => void>()
    container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)
    Modal.setAppElement(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.useRealTimers()
  })

  it('renders nothing and installs nothing until a new version is waiting', () => {
    mount()

    expect(dialog()).toBeNull()
    expect(onApply).not.toHaveBeenCalled()
  })

  it('opens and starts installing on its own the moment an update is announced', () => {
    mount()
    announceNewContent()

    // No click anywhere: the announcement alone opens the modal and requests activation.
    expect(dialog()).not.toBeNull()
    expect(dialog()!.textContent).toContain('Installing updates, one moment')
    expect(onApply).toHaveBeenCalledTimes(1)
    expect(reload).not.toHaveBeenCalled()
  })

  it('hears an update announced by another tab', async () => {
    mount()

    const otherTab = new BroadcastChannel('app-update')
    otherTab.postMessage('App has updated.')
    otherTab.close()
    // BroadcastChannel delivers on a later task, which fake timers do not drive.
    vi.useRealTimers()
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(dialog()).not.toBeNull()
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('sits out an announcement in a tab whose last install stalled', () => {
    mount(() => true)
    announceNewContent()
    act(() => {
      vi.advanceTimersByTime(INSTALL_FALLBACK_RELOAD_MS)
    })

    expect(dialog()).toBeNull()
    expect(onApply).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  it('reads the stall backoff from this tab session by default, and only inside its window', async () => {
    const { INSTALL_STALL_BACKOFF_MS } = await import('../../bootstrap/registerServiceWorker')
    const renderDefault = () => {
      act(() => {
        render(
          <AppStatusProvider>
            <InstallingUpdate onApply={onApply} reload={reload} />
          </AppStatusProvider>,
          container
        )
      })
    }

    window.sessionStorage.setItem('aos-reminders:pwa:install-stalled-at', String(Date.now()))
    renderDefault()
    announceNewContent()
    expect(dialog()).toBeNull()

    act(() => {
      unmountComponentAtNode(container)
    })
    vi.setSystemTime(Date.now() + INSTALL_STALL_BACKOFF_MS + 1)
    renderDefault()
    announceNewContent()
    expect(dialog()).not.toBeNull()

    window.sessionStorage.clear()
  })

  it('installs only once however many times the update is announced', () => {
    mount()
    announceNewContent()
    announceNewContent()
    announceNewContent()

    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('offers no control to close or postpone the install', () => {
    mount()
    announceNewContent()

    expect(dialog()!.querySelector('button, a, [role="button"]')).toBeNull()
    expect(document.querySelector('.btn-close')).toBeNull()
  })

  it('stays open through Escape and a click on the backdrop', () => {
    mount()
    announceNewContent()

    act(() => {
      dialog()!.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape', keyCode: 27 }))
    })
    act(() => {
      overlay()!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      Simulate.click(overlay()!)
    })

    expect(dialog()).not.toBeNull()
    expect(dialog()!.textContent).toContain('Installing updates, one moment')
  })

  it('reloads on its own if the install has not reloaded the page in time', () => {
    mount()
    announceNewContent()

    act(() => {
      vi.advanceTimersByTime(INSTALL_FALLBACK_RELOAD_MS - 1)
    })
    expect(reload).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('outlasts both of the registration controller activation windows', async () => {
    const { ACTIVATION_TIMEOUT_MS } = await import('../../bootstrap/registerServiceWorker')

    // The controller's own unconditional reload should land first; this is only the backstop.
    expect(INSTALL_FALLBACK_RELOAD_MS).toBeGreaterThan(ACTIVATION_TIMEOUT_MS * 2)
  })

  it('drops its fallback reload when it unmounts', () => {
    mount()
    announceNewContent()

    act(() => {
      unmountComponentAtNode(container)
    })
    act(() => {
      vi.advanceTimersByTime(INSTALL_FALLBACK_RELOAD_MS)
    })

    expect(reload).not.toHaveBeenCalled()
  })

  it('announces itself as an alert dialog for assistive technology', () => {
    mount()
    announceNewContent()

    // It appears without any user action, so it has to be announced rather than merely present.
    expect(dialog()!.getAttribute('role')).toBe('alertdialog')
    expect(dialog()!.getAttribute('aria-label')).toBe('Installing updates')
    expect(dialog()!.querySelector('[aria-busy="true"]')).not.toBeNull()
  })

  it('keeps itself off the printed reminder sheet', () => {
    mount()
    announceNewContent()

    expect(overlay()!.className).toContain('d-print-none')
  })

  it('uses the established modal surfaces in both themes', () => {
    mount()
    announceNewContent()
    expect(dialog()!.className).toContain('Modal-Light')
    expect(overlay()!.className).toContain('Modal-Overlay')

    act(() => {
      unmountComponentAtNode(container)
    })
    theme.isDark = true
    mount()
    announceNewContent()

    expect(dialog()!.className).toContain('Modal-Dark')
  })
})
