// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

const virtualRegisterSW = vi.hoisted(() => vi.fn(() => vi.fn(async () => undefined)))

vi.mock('virtual:pwa-register', () => ({ registerSW: virtualRegisterSW }))

import {
  createServiceWorkerRegistrationController,
  shouldDisableServiceWorkerRegistration,
  type RegisterSWOptions,
} from '../bootstrap/registerServiceWorker'
import { SERVICE_WORKER_ROLLBACK_DISABLED_STORAGE_KEY } from '../bootstrap/serviceWorkerProtocol'

interface RegistrationHarness {
  callbacks: RegisterSWOptions
  reload: ReturnType<typeof vi.fn>
  registration: ServiceWorkerRegistration
  runPoll: () => Promise<void>
}

const createHarness = (registrationState: 'missing' | 'installing' | 'settled') => {
  let callbacks: RegisterSWOptions | undefined
  let poll: (() => Promise<void>) | undefined
  const reload = vi.fn()
  const updateServiceWorker = vi.fn(async () => undefined)
  const registration = {
    installing: registrationState === 'installing' ? {} : null,
    update: vi.fn(async () => undefined),
  } as unknown as ServiceWorkerRegistration

  createServiceWorkerRegistrationController({
    register: options => {
      callbacks = options
      return updateServiceWorker
    },
    reload,
    setPollInterval: callback => {
      poll = callback
      return 1
    },
  })

  callbacks!.onRegisteredSW?.(
    '/service-worker.js',
    registrationState === 'missing' ? undefined : registration
  )

  return {
    callbacks: callbacks!,
    reload,
    registration,
    runPoll: async () => {
      await poll?.()
    },
  } satisfies RegistrationHarness
}

describe('service-worker registration controller', () => {
  it('reloads every controlled tab when the plugin reports the update activated', () => {
    const firstTab = createHarness('settled')
    const secondTab = createHarness('settled')

    firstTab.callbacks.onNeedReload?.()
    secondTab.callbacks.onNeedReload?.()

    expect(firstTab.reload).toHaveBeenCalledTimes(1)
    expect(secondTab.reload).toHaveBeenCalledTimes(1)
  })

  it('reloads at most once per tab no matter how often the event fires', () => {
    const tab = createHarness('settled')

    tab.callbacks.onNeedReload?.()
    tab.callbacks.onNeedReload?.()

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
