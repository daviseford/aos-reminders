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
  const { armies, collectionError, createArmy, deleteArmy, updateArmy } = useArmyCollection()
  return (
    <div>
      <span data-testid="armies">{armies.map(army => army.id).join(',')}</span>
      <span data-testid="error">{collectionError}</span>
      <button onClick={() => void createArmy({ ...currentDocument, name: 'Created' })}>Create</button>
      <button onClick={() => void updateArmy('cloud-1', { ...currentDocument, name: 'Updated' })}>
        Update
      </button>
      <button onClick={() => void deleteArmy('cloud-1')}>Delete</button>
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

  it('loads the verified owner collection with an audience-scoped token', async () => {
    await renderProbe()
    expect(auth.getAccessTokenSilently).toHaveBeenCalledWith({
      authorizationParams: {
        audience: 'https://api.aosreminders.com',
        scope: 'openid profile email',
      },
    })
    expect(armyApi.listArmies).toHaveBeenCalledWith('auth0|owner-1', 'access-token')
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-1')
  })

  it('updates collection state only after successful explicit mutations', async () => {
    await renderProbe()

    await act(async () => {
      container.querySelectorAll('button')[0].click()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-2,cloud-1')

    await act(async () => {
      container.querySelectorAll('button')[2].click()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('cloud-2')
  })

  it('leaves the local UI mounted and exposes a recoverable error on failure', async () => {
    armyApi.listArmies.mockRejectedValue(new Error('Network unavailable'))
    await renderProbe()
    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('Network unavailable')
    expect(container.querySelector('[data-testid="armies"]')?.textContent).toBe('')
  })
})
