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

import GenericModal from 'components/modals/generic/generic_modal'
import {
  INSTALL_FALLBACK_RELOAD_MS,
  INSTALLING_UPDATE_Z_INDEX,
  InstallingUpdate,
} from 'components/info/installingUpdate'
import { AppStatusProvider } from 'context/useAppStatus'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act, type ReactNode } from 'react'
import Modal from 'react-modal'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('installing-update modal', () => {
  let container: HTMLDivElement
  let onApply: ReturnType<typeof vi.fn<() => void>>
  let reload: ReturnType<typeof vi.fn<() => void>>

  const mount = ({
    isEnabled = true,
    stallBackoffRemainingMs = () => 0,
    after = null,
  }: { isEnabled?: boolean; stallBackoffRemainingMs?: () => number; after?: ReactNode } = {}) => {
    act(() => {
      render(
        <AppStatusProvider>
          <InstallingUpdate
            isEnabled={isEnabled}
            onApply={onApply}
            reload={reload}
            stallBackoffRemainingMs={stallBackoffRemainingMs}
          />
          {after}
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
    /*
     * BroadcastChannel delivers on a later task, which fake timers do not drive. Poll rather than
     * sleep a fixed interval: under a loaded full-suite run delivery can take longer than any single
     * short wait, and a fixed sleep would make this test the flaky one.
     */
    vi.useRealTimers()
    const deadline = Date.now() + 5_000
    while (!dialog() && Date.now() < deadline) {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })
    }

    expect(dialog()).not.toBeNull()
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  /*
   * The backoff after a stalled install ends inside this page, not on the next load: a long-lived PWA
   * tab gets no fresh update event for a worker that is already waiting.
   */
  it('waits out a stall backoff in this page and then installs on its own', () => {
    mount({ stallBackoffRemainingMs: () => 60_000 })
    announceNewContent()

    act(() => {
      vi.advanceTimersByTime(59_999)
    })
    expect(dialog()).toBeNull()
    expect(onApply).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(dialog()).not.toBeNull()
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('opens when an announcement arrives after the backoff has already ended', () => {
    mount({ stallBackoffRemainingMs: () => 1_000 })
    act(() => {
      vi.advanceTimersByTime(1_000)
    })

    announceNewContent()

    expect(dialog()).not.toBeNull()
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('drops its backoff timer when it unmounts', () => {
    mount({ stallBackoffRemainingMs: () => 1_000 })
    announceNewContent()
    act(() => {
      unmountComponentAtNode(container)
    })

    act(() => {
      vi.advanceTimersByTime(1_000 + INSTALL_FALLBACK_RELOAD_MS)
    })

    expect(onApply).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  it('reads the stall backoff from this tab session by default', async () => {
    const { INSTALL_STALL_BACKOFF_MS } = await import('../../bootstrap/registerServiceWorker')
    window.sessionStorage.setItem('aos-reminders:pwa:install-stalled-at', String(Date.now() - 1_000))
    act(() => {
      render(
        <AppStatusProvider>
          <InstallingUpdate isEnabled onApply={onApply} reload={reload} />
        </AppStatusProvider>,
        container
      )
    })
    announceNewContent()
    expect(dialog()).toBeNull()

    act(() => {
      vi.advanceTimersByTime(INSTALL_STALL_BACKOFF_MS - 1_000)
    })

    expect(dialog()).not.toBeNull()
    window.sessionStorage.clear()
  })

  /*
   * A tab carrying the rollback marker is being handed an emergency rollback. Another tab's update
   * announcement must not cover it or reload it.
   */
  it('never opens or reloads in a tab with no registration, such as one under rollback', () => {
    mount({ isEnabled: false })
    announceNewContent()
    act(() => {
      vi.advanceTimersByTime(INSTALL_FALLBACK_RELOAD_MS * 2)
    })

    expect(dialog()).toBeNull()
    expect(onApply).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  /*
   * The regression: this modal mounts with the app, so react-modal appended its portal to <body>
   * before any modal the player opens later. With equal stacking, DOM order decides, and the later
   * Save/Import/Print/Share/checkout overlay painted over the install.
   */
  it('stacks above a modal that was opened before the update arrived', () => {
    mount({
      after: (
        <GenericModal closeModal={vi.fn()} isOpen label="Save Army">
          Half-typed name
        </GenericModal>
      ),
    })
    announceNewContent()

    const overlays = Array.from(document.querySelectorAll<HTMLElement>('.ReactModal__Overlay'))
    const update = overlays.find(node => node.querySelector('[role="alertdialog"]'))!
    const other = overlays.find(node => node !== update)!
    // Modelling the real order: the update's portal really is the earlier one in the document.
    expect(update.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    const zIndexOf = (node: HTMLElement) => Number(getComputedStyle(node).zIndex) || 0
    expect(zIndexOf(update)).toBe(INSTALLING_UPDATE_Z_INDEX)
    expect(zIndexOf(update)).toBeGreaterThan(zIndexOf(other))
    expect(document.body.textContent).toContain('Half-typed name')
  })

  /*
   * jsdom does not load the stylesheet, so read it: anything the app pins with a z-index -- the
   * loading splash at 1050 today -- must stay under the install. Bootstrap's highest layer (toasts,
   * 1090) is checked too, since dropdowns and tooltips come from it rather than from index.scss.
   */
  it('sits above every z-index the app stylesheet and Bootstrap define', () => {
    const stylesheet = readFileSync(resolve(process.cwd(), 'src/css/index.scss'), 'utf8')
    const pinned = Array.from(stylesheet.matchAll(/z-index:\s*(\d+)/g), match => Number(match[1]))
    expect(pinned).toContain(1050)

    expect(INSTALLING_UPDATE_Z_INDEX).toBeGreaterThan(Math.max(...pinned, 1090))
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
