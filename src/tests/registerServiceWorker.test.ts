// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

const virtualRegisterSW = vi.hoisted(() => vi.fn(() => vi.fn(async () => undefined)))

vi.mock('virtual:pwa-register', () => ({ registerSW: virtualRegisterSW }))

import {
  ACTIVATION_TIMEOUT_MS,
  createServiceWorkerRegistrationController,
  shouldDisableServiceWorkerRegistration,
  type RegisterSWOptions,
} from '../bootstrap/registerServiceWorker'
import {
  SERVICE_WORKER_ACTIVATION_MESSAGE,
  SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY,
} from '../bootstrap/serviceWorkerProtocol'

interface WaitingWorkerStub {
  activate: () => void
  postMessage: ReturnType<typeof vi.fn>
  state: ServiceWorkerState
}

interface RegistrationHarness {
  announceNewContent: ReturnType<typeof vi.fn>
  applyWaitingUpdate: () => void
  callbacks: RegisterSWOptions
  controllerChanged: () => void
  pendingActivationTimeouts: () => number
  reload: ReturnType<typeof vi.fn>
  registration: ServiceWorkerRegistration
  runActivationTimeout: () => void
  runPoll: () => Promise<void>
  waitingWorker: WaitingWorkerStub
}

interface SharedAcceptance {
  accepted: boolean
}

/** Per-tab session state: survives this tab's reload, never reaches another tab. */
interface TabSession {
  stalled: boolean
}

const createHarness = (
  registrationState: 'missing' | 'installing' | 'waiting' | 'settled',
  acceptance: SharedAcceptance = { accepted: false },
  session: TabSession = { stalled: false }
) => {
  let callbacks: RegisterSWOptions | undefined
  let controllerChanged = () => {}
  const activationTimeouts: Array<{ callback: () => void; delayMs: number }> = []
  let poll: (() => Promise<void>) | undefined
  const reload = vi.fn()
  const updateServiceWorker = vi.fn(async () => undefined)
  const workerStateChanged: Array<() => void> = []
  const waitingWorker: WaitingWorkerStub = {
    /** Drives the worker's own lifecycle, which is a reload signal independent of any claim. */
    activate: () => {
      waitingWorker.state = 'activated'
      workerStateChanged.forEach(callback => callback())
    },
    postMessage: vi.fn(),
    state: 'installed',
  }
  const registration = {
    installing: registrationState === 'installing' ? {} : null,
    waiting: registrationState === 'waiting' ? waitingWorker : null,
    update: vi.fn(async () => undefined),
  } as unknown as ServiceWorkerRegistration

  const announceNewContent = vi.fn()
  const applyWaitingUpdate = createServiceWorkerRegistrationController({
    announceNewContent,
    clearInstallStalled: () => {
      session.stalled = false
    },
    listenForControllerChange: callback => {
      controllerChanged = callback
    },
    listenForWorkerStateChange: (_worker, callback) => {
      workerStateChanged.push(callback)
    },
    markInstallStalled: () => {
      session.stalled = true
    },
    markUpdateAccepted: () => {
      acceptance.accepted = true
    },
    register: options => {
      callbacks = options
      return updateServiceWorker
    },
    reload,
    setActivationTimeout: (callback, delayMs) => {
      activationTimeouts.push({ callback, delayMs })
      return 2
    },
    setPollInterval: callback => {
      poll = callback
      return 1
    },
    wasUpdateAccepted: () => acceptance.accepted,
  }).applyWaitingUpdate

  callbacks!.onRegisteredSW?.(
    '/service-worker.js',
    registrationState === 'missing' ? undefined : registration
  )

  return {
    announceNewContent,
    applyWaitingUpdate,
    callbacks: callbacks!,
    controllerChanged,
    pendingActivationTimeouts: () => activationTimeouts.length,
    reload,
    registration,
    /** Runs the next pending deadline, asserting the controller scheduled it at the stated window. */
    runActivationTimeout: () => {
      const next = activationTimeouts.shift()
      expect(next?.delayMs).toBe(ACTIVATION_TIMEOUT_MS)
      next?.callback()
    },
    runPoll: async () => {
      await poll?.()
    },
    waitingWorker,
  } satisfies RegistrationHarness
}

describe('service-worker registration controller', () => {
  /*
   * Detection only announces. The "Installing updates" modal requests activation from its own effect
   * once it has rendered (#2046), so no tab reloads before it has shown why.
   */
  it('announces a waiting update to every tab without reloading any of them yet', () => {
    const firstTab = createHarness('waiting')
    const secondTab = createHarness('waiting')

    firstTab.callbacks.onNeedRefresh?.()
    secondTab.callbacks.onNeedRefresh?.()

    expect(firstTab.announceNewContent).toHaveBeenCalledTimes(1)
    expect(secondTab.announceNewContent).toHaveBeenCalledTimes(1)
    expect(firstTab.reload).not.toHaveBeenCalled()
    expect(secondTab.reload).not.toHaveBeenCalled()
  })

  /*
   * Every open tab now installs on its own announcement, so every tab posts to the one shared waiting
   * worker. The generated handler only calls skipWaiting(), so the second post is harmless; what
   * matters is that each tab reloads exactly once when the worker takes over.
   */
  it('reloads each tab exactly once when every open tab installs at the same time', () => {
    const acceptance = { accepted: false }
    const firstTab = createHarness('waiting', acceptance)
    const secondTab = createHarness('waiting', acceptance)

    firstTab.applyWaitingUpdate()
    secondTab.applyWaitingUpdate()
    firstTab.controllerChanged()
    secondTab.controllerChanged()
    firstTab.waitingWorker.activate()
    secondTab.waitingWorker.activate()

    expect(firstTab.waitingWorker.postMessage).toHaveBeenCalledTimes(1)
    expect(secondTab.waitingWorker.postMessage).toHaveBeenCalledTimes(1)
    expect(firstTab.reload).toHaveBeenCalledTimes(1)
    expect(secondTab.reload).toHaveBeenCalledTimes(1)
  })

  it('does not stack a second install when one tab asks twice', () => {
    const tab = createHarness('waiting')

    tab.applyWaitingUpdate()
    tab.applyWaitingUpdate()
    expect(tab.waitingWorker.postMessage).toHaveBeenCalledTimes(1)

    // One retry and one unconditional reload, not two of each.
    tab.runActivationTimeout()
    expect(tab.waitingWorker.postMessage).toHaveBeenCalledTimes(2)
    tab.runActivationTimeout()
    expect(tab.reload).toHaveBeenCalledTimes(1)
    expect(tab.pendingActivationTimeouts()).toBe(0)
  })

  it('reloads every controlled tab after one tab installs and the worker takes control', () => {
    const acceptance = { accepted: false }
    const firstTab = createHarness('waiting', acceptance)
    const secondTab = createHarness('waiting', acceptance)

    firstTab.applyWaitingUpdate()
    expect(firstTab.waitingWorker.postMessage).toHaveBeenCalledWith({
      type: SERVICE_WORKER_ACTIVATION_MESSAGE,
    })

    firstTab.controllerChanged()
    secondTab.controllerChanged()

    expect(firstTab.reload).toHaveBeenCalledTimes(1)
    expect(secondTab.reload).toHaveBeenCalledTimes(1)
  })

  it('reloads a tab opened after an install began when the worker takes control', () => {
    const acceptance = { accepted: false }
    const acceptingTab = createHarness('waiting', acceptance)
    acceptingTab.applyWaitingUpdate()

    const lateTab = createHarness('settled', acceptance)
    lateTab.controllerChanged()

    expect(lateTab.reload).toHaveBeenCalledTimes(1)
  })

  it('does not reload for an unrelated controller change when no install is under way', () => {
    const tab = createHarness('settled')

    tab.controllerChanged()

    expect(tab.reload).not.toHaveBeenCalled()
  })

  it('reloads at most once when plugin and native controller events both fire', () => {
    const acceptance = { accepted: false }
    const tab = createHarness('waiting', acceptance)
    tab.applyWaitingUpdate()

    tab.callbacks.onNeedReload?.()
    tab.controllerChanged()

    expect(tab.reload).toHaveBeenCalledTimes(1)
  })

  it('reloads a second tab immediately once another tab has already activated the worker', () => {
    const secondTab = createHarness('settled')

    secondTab.applyWaitingUpdate()

    expect(secondTab.reload).toHaveBeenCalledTimes(1)
    expect(secondTab.waitingWorker.postMessage).not.toHaveBeenCalled()
  })

  /*
   * `announceNewContent` broadcasts to every tab on the origin, and `register()` does not resolve
   * until the window `load` event, so a tab can be showing the prompt with no registration of its
   * own. Doing nothing here would leave the "Installing updates" modal with no path out.
   */
  it('reloads rather than stalling when the installing tab has no registration', () => {
    const tab = createHarness('missing')

    tab.applyWaitingUpdate()

    expect(tab.reload).toHaveBeenCalledTimes(1)
    expect(tab.waitingWorker.postMessage).not.toHaveBeenCalled()
  })

  /*
   * The production failure of 2026-08-04: the message went to a worker that had been waiting for
   * thirteen minutes, and no controller change ever came back. A waiting worker that idle has been
   * terminated, so the first message had to cold-start it; the retry reaches a warm one.
   */
  it('asks a second time when the first activation message goes unanswered', () => {
    const tab = createHarness('waiting')

    tab.applyWaitingUpdate()
    expect(tab.waitingWorker.postMessage).toHaveBeenCalledTimes(1)

    tab.runActivationTimeout()

    expect(tab.waitingWorker.postMessage).toHaveBeenCalledTimes(2)
    expect(tab.waitingWorker.postMessage).toHaveBeenLastCalledWith({
      type: SERVICE_WORKER_ACTIVATION_MESSAGE,
    })
    expect(tab.reload).not.toHaveBeenCalled()
  })

  it('reloads without the update once both activation windows have closed', () => {
    const tab = createHarness('waiting')

    tab.applyWaitingUpdate()
    tab.runActivationTimeout()
    expect(tab.reload).not.toHaveBeenCalled()

    tab.runActivationTimeout()

    expect(tab.reload).toHaveBeenCalledTimes(1)
  })

  /*
   * A stalled install reloads onto the old build, where the same waiting worker is found again. Left
   * alone that is a reload loop; the tab records the stall so the modal can wait out a backoff.
   */
  it('records a stall when the last deadline passes with the worker still installed', () => {
    const session = { stalled: false }
    const stalledTab = createHarness('waiting', { accepted: false }, session)

    stalledTab.applyWaitingUpdate()
    stalledTab.runActivationTimeout()
    stalledTab.runActivationTimeout()
    expect(stalledTab.reload).toHaveBeenCalledTimes(1)
    expect(session.stalled).toBe(true)

    // The same tab after its reload, worker still waiting: the stall survives, and the update is
    // still announced -- the modal owns the backoff and opens once it ends.
    const reloadedTab = createHarness('waiting', { accepted: false }, session)
    expect(session.stalled).toBe(true)
    reloadedTab.callbacks.onNeedRefresh?.()
    expect(reloadedTab.announceNewContent).toHaveBeenCalledTimes(1)
  })

  it('records no stall when the install took control before the last deadline', () => {
    const session = { stalled: false }
    const tab = createHarness('waiting', { accepted: false }, session)

    tab.applyWaitingUpdate()
    tab.controllerChanged()
    tab.runActivationTimeout()
    tab.runActivationTimeout()

    expect(session.stalled).toBe(false)
  })

  it('records no stall when the worker was no longer waiting at the last deadline', () => {
    const session = { stalled: false }
    const tab = createHarness('waiting', { accepted: false }, session)

    tab.applyWaitingUpdate()
    tab.runActivationTimeout()
    ;(tab.registration as { waiting: unknown }).waiting = null
    tab.runActivationTimeout()

    expect(tab.reload).toHaveBeenCalledTimes(1)
    expect(session.stalled).toBe(false)
  })

  /*
   * The race: the worker has activated, but its statechange/controllerchange and the registration's
   * own `waiting -> null` update are still queued when the deadline runs. A worker that has left
   * `installed` is a success in flight, not a stall.
   */
  it.each(['activating', 'activated'] as const)(
    'records no stall when the deadline runs with the worker already %s but its events still queued',
    state => {
      const session = { stalled: false }
      const tab = createHarness('waiting', { accepted: false }, session)

      tab.applyWaitingUpdate()
      tab.runActivationTimeout()
      tab.waitingWorker.state = state
      tab.runActivationTimeout()

      expect(tab.reload).toHaveBeenCalledTimes(1)
      expect(session.stalled).toBe(false)
    }
  )

  it('clears a recorded stall once a load finds nothing waiting', () => {
    const session = { stalled: true }

    createHarness('settled', { accepted: false }, session)

    expect(session.stalled).toBe(false)
  })

  /*
   * `controllerchange` only fires if the claim reaches this client. The worker reporting its own
   * activation is a second, independent signal that the accepted build is live.
   */
  it('reloads when the accepted worker activates without claiming this tab', () => {
    const tab = createHarness('waiting')

    tab.applyWaitingUpdate()
    tab.waitingWorker.activate()

    expect(tab.reload).toHaveBeenCalledTimes(1)
  })

  it('does not reload a second time when a deadline passes after the worker took control', () => {
    const tab = createHarness('waiting')

    tab.applyWaitingUpdate()
    tab.controllerChanged()
    tab.runActivationTimeout()
    tab.runActivationTimeout()

    expect(tab.reload).toHaveBeenCalledTimes(1)
  })

  it('does not create a polling interval without a registration', async () => {
    const tab = createHarness('missing')

    await tab.runPoll()

    expect(tab.registration.update).not.toHaveBeenCalled()
  })

  it('skips an update poll while a worker is installing', async () => {
    const tab = createHarness('installing')

    await tab.runPoll()

    expect(tab.registration.update).not.toHaveBeenCalled()
  })

  it('absorbs a rejected update poll so a later interval can retry', async () => {
    const tab = createHarness('settled')
    vi.mocked(tab.registration.update).mockRejectedValueOnce(new Error('offline'))

    await expect(tab.runPoll()).resolves.toBeUndefined()
    expect(tab.registration.update).toHaveBeenCalledTimes(1)

    await expect(tab.runPoll()).resolves.toBeUndefined()
    expect(tab.registration.update).toHaveBeenCalledTimes(2)
  })
})

describe('rollback registration guard', () => {
  const createSessionStorage = () => {
    const values = new Map<string, string>()
    return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }
  }

  it('persists the rollback query marker for the rest of the tab session', () => {
    const sessionStorage = createSessionStorage()

    expect(
      shouldDisableServiceWorkerRegistration({
        search: '?aos-reminders-rollback=1',
        sessionStorage,
      })
    ).toBe(true)
    expect(sessionStorage.getItem(SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY)).toBe('1')
    expect(shouldDisableServiceWorkerRegistration({ search: '', sessionStorage })).toBe(true)
  })

  it('does not disable normal service-worker registration', () => {
    expect(
      shouldDisableServiceWorkerRegistration({ search: '', sessionStorage: createSessionStorage() })
    ).toBe(false)
  })

  it('keeps rollback registration disabled when reading session storage is denied', () => {
    const sessionStorage = {
      getItem: () => {
        throw new Error('storage denied')
      },
      setItem: vi.fn(),
    }

    expect(
      shouldDisableServiceWorkerRegistration({
        search: '?aos-reminders-rollback=1',
        sessionStorage,
      })
    ).toBe(true)
  })

  it('keeps rollback registration disabled when writing session storage is denied', () => {
    const sessionStorage = {
      getItem: vi.fn(() => null),
      setItem: () => {
        throw new Error('storage denied')
      },
    }

    expect(
      shouldDisableServiceWorkerRegistration({
        search: '?aos-reminders-rollback=1',
        sessionStorage,
      })
    ).toBe(true)
  })

  it('keeps normal registration enabled when reading session storage is denied', () => {
    const sessionStorage = {
      getItem: () => {
        throw new Error('storage denied')
      },
      setItem: vi.fn(),
    }

    expect(shouldDisableServiceWorkerRegistration({ search: '', sessionStorage })).toBe(false)
    expect(sessionStorage.setItem).not.toHaveBeenCalled()
  })
})
