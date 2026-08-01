// @vitest-environment node

import { describe, expect, it, vi } from 'vitest'

const virtualRegisterSW = vi.hoisted(() => vi.fn(() => vi.fn(async () => undefined)))

vi.mock('virtual:pwa-register', () => ({ registerSW: virtualRegisterSW }))

import {
  createServiceWorkerRegistrationController,
  type RegisterSWOptions,
} from '../bootstrap/registerServiceWorker'

interface RegistrationHarness {
  applyWaitingUpdate: () => void
  callbacks: RegisterSWOptions
  reload: ReturnType<typeof vi.fn>
  registration: ServiceWorkerRegistration
  runPoll: () => Promise<void>
  updateServiceWorker: ReturnType<typeof vi.fn>
}

const createHarness = (registrationState: 'missing' | 'installing' | 'waiting' | 'settled') => {
  let callbacks: RegisterSWOptions | undefined
  let poll: (() => Promise<void>) | undefined
  const reload = vi.fn()
  const updateServiceWorker = vi.fn(async () => undefined)
  const registration = {
    installing: registrationState === 'installing' ? {} : null,
    waiting: registrationState === 'waiting' ? {} : null,
    update: vi.fn(async () => undefined),
  } as unknown as ServiceWorkerRegistration

  const applyWaitingUpdate = createServiceWorkerRegistrationController({
    announceNewContent: vi.fn(),
    register: options => {
      callbacks = options
      return updateServiceWorker
    },
    reload,
    setPollInterval: callback => {
      poll = callback
      return 1
    },
  }).applyWaitingUpdate

  callbacks!.onRegisteredSW?.(
    '/service-worker.js',
    registrationState === 'missing' ? undefined : registration
  )

  return {
    applyWaitingUpdate,
    callbacks: callbacks!,
    reload,
    registration,
    runPoll: async () => {
      await poll?.()
    },
    updateServiceWorker,
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
    const firstTab = createHarness('waiting')
    const secondTab = createHarness('waiting')

    firstTab.applyWaitingUpdate()
    expect(firstTab.updateServiceWorker).toHaveBeenCalledTimes(1)

    // vite-plugin-pwa raises this callback in each tab from the update worker's controlling event.
    firstTab.callbacks.onNeedReload?.()
    secondTab.callbacks.onNeedReload?.()

    expect(firstTab.reload).toHaveBeenCalledTimes(1)
    expect(secondTab.reload).toHaveBeenCalledTimes(1)
  })

  it('reloads a stale second-tab banner immediately once no worker is waiting', () => {
    const secondTab = createHarness('settled')

    secondTab.applyWaitingUpdate()

    expect(secondTab.reload).toHaveBeenCalledTimes(1)
    expect(secondTab.updateServiceWorker).not.toHaveBeenCalled()
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
