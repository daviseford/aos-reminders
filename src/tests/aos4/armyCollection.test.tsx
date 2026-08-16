// @vitest-environment jsdom

import { createDefaultAos4ArmyDocument } from '../../aos4/runtime'
import { ArmyCollectionProvider, useArmyCollection } from 'context/useArmyCollection'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  getAccessTokenSilently: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
  user: { sub: 'auth0|owner-1' } as { sub: string } | undefined,
}))

const armyApi = vi.hoisted(() => ({
  createArmy: vi.fn(),
  createShare: vi.fn(),
  deleteArmy: vi.fn(),
  isConfigured: true,
  listArmies: vi.fn(),
  updateArmy: vi.fn(),
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('../../api/armyApi', () => ({
  ArmyApi: armyApi,
  ArmyApiError: class ArmyApiError extends Error {
    status = 0
  },
}))

const currentDocument = createDefaultAos4ArmyDocument()
const remoteArmy = { id: 'cloud-1', createdAt: 1, updatedAt: 2, document: currentDocument }

const Probe = () => {
  const {
    armies,
    collectionError,
    collectionLoaded,
    createArmy,
    deleteArmy,
    ensureArmiesLoaded,
    refreshArmies,
    updateArmy,
  } = useArmyCollection()
  return (
    <div>
      <span data-testid="armies">{armies.map(army => army.id).join(',')}</span>
      <span data-testid="error">{collectionError}</span>
      <span data-testid="loaded">{String(collectionLoaded)}</span>
      <button onClick={() => void refreshArmies()}>Refresh</button>
      <button onClick={() => void createArmy({ ...currentDocument, name: 'Created' })}>Create</button>
      <button onClick={() => void updateArmy('cloud-1', { ...currentDocument, name: 'Updated' })}>
        Update
      </button>
      <button onClick={() => void deleteArmy('cloud-1')}>Delete</button>
      <button onClick={() => void ensureArmiesLoaded()}>Ensure</button>
    </div>
  )
}

describe('cloud army collection state', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    auth.getAccessTokenSilently.mockReset()
    auth.getAccessTokenSilently.mockResolvedValue('access-token')
    auth.isAuthenticated = true
    auth.isLoading = false
    auth.user = { sub: 'auth0|owner-1' }
    Object.values(armyApi).forEach(value => {
      if (typeof value === 'function' && 'mockReset' in value) value.mockReset()
    })
    armyApi.listArmies.mockResolvedValue([remoteArmy])
    armyApi.createArmy.mockResolvedValue({ ...remoteArmy, id: 'cloud-2' })
    armyApi.updateArmy.mockResolvedValue({
      ...remoteArmy,
      document: { ...currentDocument, name: 'Updated' },
    })
    armyApi.deleteArmy.mockResolvedValue(undefined)
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  const renderProbe = async () => {
    await act(async () => {
      render(
        <ArmyCollectionProvider>
          <Probe />
        </ArmyCollectionProvider>,
        container
      )
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  it('defers the owner collection until it is explicitly requested', async () => {
    await renderProbe()
    expect(auth.getAccessTokenSilently).not.toHaveBeenCalled()
    expect(armyApi.listArmies).not.toHaveBeenCalled()

    await act(async () => {
      container.querySelectorAll('button')[0].click()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(auth.getAccessTokenSilently).toHaveBeenCalledWith({
      authorizationParams: {
        audience: 'https://api.aosreminders.com',
        scope: 'openid profile email',
      },
    })
    expect(armyApi.listArmies).toHaveBeenCalledWith('access-token')
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-1')
  })

  it('updates collection state only after successful explicit mutations', async () => {
    await renderProbe()

    await act(async () => {
      container.querySelectorAll('button')[1].click()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-2')

    await act(async () => {
      container.querySelectorAll('button')[3].click()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-2')
  })

  it('leaves the local UI mounted and exposes a recoverable error on failure', async () => {
    armyApi.listArmies.mockRejectedValue(new Error('Network unavailable'))
    await renderProbe()

    await act(async () => {
      container.querySelectorAll('button')[0].click()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('Network unavailable')
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('')
  })

  /*
   * The Save Army modal refreshes when it opens, and its Save button is not gated on that refresh
   * finishing. So a list request that predates the save can resolve after it. If that stale list
   * wins, the created army disappears from state while the collection reports itself loaded, and
   * the reconciler in Home unlinks a record that exists — forking a duplicate on the next save.
   */
  it('discards a list response that a later mutation has already superseded', async () => {
    let resolveList: (armies: unknown[]) => void = () => undefined
    armyApi.listArmies.mockReturnValue(
      new Promise(resolve => {
        resolveList = resolve as (armies: unknown[]) => void
      })
    )
    await renderProbe()

    // The modal's on-open refresh starts and stays in flight.
    await act(async () => {
      container.querySelectorAll('button')[0].click()
      await Promise.resolve()
    })

    // The save completes while it is still pending.
    await act(async () => {
      container.querySelectorAll('button')[1].click()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-2')

    // The pre-save list lands last and must not resurrect the account as it was before the save.
    await act(async () => {
      resolveList([])
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-2')
    expect(container.querySelector('[data-testid="loaded"]')?.textContent).toBe('false')
  })

  it('spends only one ensureArmiesLoaded attempt even when the load fails', async () => {
    armyApi.listArmies.mockRejectedValue(new Error('Network unavailable'))
    await renderProbe()

    for (let attempt = 0; attempt < 3; attempt += 1) {
      await act(async () => {
        container.querySelectorAll('button')[4].click()
        await Promise.resolve()
        await Promise.resolve()
      })
    }

    expect(armyApi.listArmies).toHaveBeenCalledTimes(1)
    // A background load owes the player no message; only a refresh they asked for does.
    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('')
  })

  /*
   * The guard order in `ensureArmiesLoaded` puts the authentication check before the one-shot ref,
   * so a call made while Auth0 is still resolving must not spend the attempt. Without that order,
   * anyone signing in after mount loses load-time reconciliation for the whole session.
   */
  it('does not spend its attempt on a call made before authentication resolves', async () => {
    auth.isAuthenticated = false
    await renderProbe()

    await act(async () => {
      container.querySelectorAll('button')[4].click()
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(armyApi.listArmies).not.toHaveBeenCalled()

    // Auth0 settles while the same provider stays mounted, so its one-shot ref is not reset by a
    // remount -- the attempt must still be available.
    auth.isAuthenticated = true
    await renderProbe()

    await act(async () => {
      container.querySelectorAll('button')[4].click()
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(armyApi.listArmies).toHaveBeenCalledTimes(1)
    expect(container.querySelector('[data-testid="loaded"]')?.textContent).toBe('true')
  })
})
