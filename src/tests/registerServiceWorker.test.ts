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
  applyWaitingUpdate: () => void
  callbacks: RegisterSWOptions
  controllerChanged: () => void
  reload: ReturnType<typeof vi.fn>
  registration: ServiceWorkerRegistration
  runActivationTimeout: () => void
  runPoll: () => Promise<void>
  waitingWorker: WaitingWorkerStub
}

interface SharedAcceptance {
  accepted: boolean
}

const createHarness = (
  registrationState: 'missing' | 'installing' | 'waiting' | 'settled',
  acceptance: SharedAcceptance = { accepted: false }
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

  const applyWaitingUpdate = createServiceWorkerRegistrationController({
    announceNewContent: vi.fn(),
    listenForControllerChange: callback => {
      controllerChanged = callback
    },
    listenForWorkerStateChange: (_worker, callback) => {
      workerStateChanged.push(callback)
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
    applyWaitingUpdate,
    callbacks: callbacks!,
    controllerChanged,
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
  it('does not reload either tab before a waiting update is explicitly accepted', () => {
    const firstTab = createHarness('waiting')
    const secondTab = createHarness('waiting')

    firstTab.callbacks.onNeedRefresh?.()
    secondTab.callbacks.onNeedRefresh?.()

    expect(firstTab.reload).not.toHaveBeenCalled()
    expect(secondTab.reload).not.toHaveBeenCalled()
  })

  it('reloads every controlled tab after one tab accepts and the worker takes control', () => {
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

  it('reloads a tab opened after acceptance when the accepted worker takes control', () => {
    const acceptance = { accepted: false }
    const acceptingTab = createHarness('waiting', acceptance)
    acceptingTab.applyWaitingUpdate()

    const lateTab = createHarness('settled', acceptance)
    lateTab.controllerChanged()

    expect(lateTab.reload).toHaveBeenCalledTimes(1)
  })

  it('does not reload for an unrelated controller change without update acceptance', () => {
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

  it('reloads a stale second-tab banner immediately once no worker is waiting', () => {
    const secondTab = createHarness('settled')

    secondTab.applyWaitingUpdate()

    expect(secondTab.reload).toHaveBeenCalledTimes(1)
    expect(secondTab.waitingWorker.postMessage).not.toHaveBeenCalled()
  })

  /*
   * `announceNewContent` broadcasts to every tab on the origin, and `register()` does not resolve
   * until the window `load` event, so a tab can be showing the prompt with no registration of its
   * own. Doing nothing here left the control reading "Reloading..." with no path out.
   */
  it('reloads rather than stalling when the accepting tab has no registration', () => {
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
