// @vitest-environment jsdom

import { SubscriptionProvider, useSubscription } from 'context/useSubscription'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  isAuthenticated: true,
  isLoading: false,
  user: { email: 'general@example.com' } as { email: string } | undefined,
}))

const subscriptionApi = vi.hoisted(() => ({
  cancelSubscription: vi.fn(),
  getSubscription: vi.fn(),
}))

const token = vi.hoisted(() => ({
  get: vi.fn(),
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: subscriptionApi,
}))

vi.mock('utils/authToken', () => ({
  useApiAccessToken: () => token.get,
}))

const Probe = () => {
  const {
    cancelSubscription,
    getSubscription,
    isActive,
    isNotSubscribed,
    subscriptionError,
    subscriptionLoading,
  } = useSubscription()

  return (
    <div>
      <span data-testid="status">
        {subscriptionLoading ? 'loading' : isActive ? 'active' : isNotSubscribed ? 'none' : 'unknown'}
      </span>
      <span data-testid="error">{subscriptionError}</span>
      <button type="button" onClick={() => void cancelSubscription()}>
        Cancel
      </button>
      <button type="button" onClick={() => void getSubscription()}>
        Retry
      </button>
    </div>
  )
}

describe('subscription account state', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    auth.isAuthenticated = true
    auth.isLoading = false
    auth.user = { email: 'general@example.com' }
    subscriptionApi.cancelSubscription.mockReset()
    subscriptionApi.cancelSubscription.mockResolvedValue({})
    subscriptionApi.getSubscription.mockReset()
    token.get.mockReset()
    token.get.mockResolvedValue('audience-token')
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.restoreAllMocks()
  })

  const renderProbe = async () => {
    await act(async () => {
      render(
        <SubscriptionProvider>
          <Probe />
        </SubscriptionProvider>,
        container
      )
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  it('loads the authenticated user subscription and exposes active account state', async () => {
    subscriptionApi.getSubscription.mockResolvedValue({
      body: {
        active: true,
        subscribed: true,
      },
    })

    await renderProbe()

    expect(token.get).toHaveBeenCalled()
    expect(subscriptionApi.getSubscription).toHaveBeenCalledWith('audience-token')
    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('active')
    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('')
  })

  it('does not load subscription state for a signed-out session with stale user data', async () => {
    auth.isAuthenticated = false

    await renderProbe()

    expect(token.get).not.toHaveBeenCalled()
    expect(subscriptionApi.getSubscription).not.toHaveBeenCalled()
    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('none')
    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('')
  })

  it('keeps transport failures distinct from an inactive subscription and allows a retry', async () => {
    subscriptionApi.getSubscription.mockRejectedValueOnce({ status: 503 }).mockResolvedValueOnce({
      body: {
        active: true,
        subscribed: true,
      },
    })

    await renderProbe()

    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('unknown')
    expect(container.querySelector('[data-testid="error"]')?.textContent).toContain('temporarily unavailable')

    await act(async () => {
      const retry = Array.from(container.querySelectorAll('button')).find(
        button => button.textContent === 'Retry'
      )
      retry?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(subscriptionApi.getSubscription).toHaveBeenCalledTimes(2)
    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('active')
  })

  it('treats an unknown account as inactive rather than an outage', async () => {
    subscriptionApi.getSubscription.mockRejectedValue({ status: 404 })

    await renderProbe()

    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('none')
    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('')
  })

  it('keeps a silent-token failure distinct from an inactive account', async () => {
    token.get.mockRejectedValue(new Error('login required'))

    await renderProbe()

    expect(subscriptionApi.getSubscription).not.toHaveBeenCalled()
    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('unknown')
    expect(container.querySelector('[data-testid="error"]')?.textContent).toContain('temporarily unavailable')
  })

  it('cancels a Stripe subscription and refreshes its server state', async () => {
    const subscription = {
      active: true,
      createdBy: 'stripe',
      subscribed: true,
    }
    subscriptionApi.getSubscription.mockResolvedValue({ body: subscription })

    await renderProbe()
    await act(async () => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(subscriptionApi.cancelSubscription).toHaveBeenCalledWith('audience-token')
    expect(subscriptionApi.getSubscription).toHaveBeenCalledTimes(2)
  })
})
