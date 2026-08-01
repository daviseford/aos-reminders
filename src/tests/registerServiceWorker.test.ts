// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

const virtualRegisterSW = vi.hoisted(() => vi.fn(() => vi.fn(async () => undefined)))

vi.mock('virtual:pwa-register', () => ({ registerSW: virtualRegisterSW }))

import {
  createServiceWorkerRegistrationController,
  shouldDisableServiceWorkerRegistration,
  type RegisterSWOptions,
} from '../bootstrap/registerServiceWorker'
import {
  SERVICE_WORKER_ACTIVATION_MESSAGE,
  SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY,
} from '../bootstrap/serviceWorkerProtocol'

interface RegistrationHarness {
  applyWaitingUpdate: () => void
  callbacks: RegisterSWOptions
  controllerChanged: () => void
  reload: ReturnType<typeof vi.fn>
  registration: ServiceWorkerRegistration
  runPoll: () => Promise<void>
  waitingWorker: { postMessage: ReturnType<typeof vi.fn> }
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
  let poll: (() => Promise<void>) | undefined
  const reload = vi.fn()
  const updateServiceWorker = vi.fn(async () => undefined)
  const waitingWorker = { postMessage: vi.fn() }
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
    markUpdateAccepted: () => {
      acceptance.accepted = true
    },
    register: options => {
      callbacks = options
      return updateServiceWorker
    },
    reload,
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
})
