// @vitest-environment jsdom

import { SubscriptionProvider, useSubscription } from 'context/useSubscription'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  isLoading: false,
  user: { email: 'general@example.com' } as { email: string } | undefined,
}))

const subscriptionApi = vi.hoisted(() => ({
  cancelSubscription: vi.fn(),
  getSubscription: vi.fn(),
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: subscriptionApi,
}))

const Probe = () => {
  const {
    cancelSubscription,
    getSubscription,
    isActive,
    isNotSubscribed,
    subscription,
    subscriptionError,
    subscriptionLoading,
  } = useSubscription()

  return (
    <div>
      <span data-testid="status">
        {subscriptionLoading ? 'loading' : isActive ? 'active' : isNotSubscribed ? 'none' : 'unknown'}
      </span>
      <span data-testid="error">{subscriptionError}</span>
      <span data-testid="user">{subscription.userName}</span>
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
    auth.isLoading = false
    auth.user = { email: 'general@example.com' }
    subscriptionApi.cancelSubscription.mockReset()
    subscriptionApi.cancelSubscription.mockResolvedValue({})
    subscriptionApi.getSubscription.mockReset()
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
        id: 'account-1',
        subscribed: true,
        subscriptionId: 'subscription-1',
        userName: 'general@example.com',
      },
    })

    await renderProbe()

    expect(subscriptionApi.getSubscription).toHaveBeenCalledWith('general@example.com')
    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('active')
    expect(container.querySelector('[data-testid="user"]')?.textContent).toBe('general@example.com')
    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('')
  })

  it('keeps transport failures distinct from an inactive subscription and allows a retry', async () => {
    subscriptionApi.getSubscription.mockRejectedValueOnce({ status: 503 }).mockResolvedValueOnce({
      body: {
        active: true,
        id: 'account-1',
        subscribed: true,
        userName: 'general@example.com',
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

  it('treats the legacy no-subscription response as an inactive account rather than an outage', async () => {
    subscriptionApi.getSubscription.mockRejectedValue({ status: 501 })

    await renderProbe()

    expect(container.querySelector('[data-testid="status"]')?.textContent).toBe('none')
    expect(container.querySelector('[data-testid="error"]')?.textContent).toBe('')
  })

  it('cancels a Stripe subscription and refreshes its server state', async () => {
    const subscription = {
      active: true,
      createdBy: 'stripe',
      id: 'account-1',
      subscribed: true,
      subscriptionId: 'subscription-1',
      userName: 'general@example.com',
    }
    subscriptionApi.getSubscription.mockResolvedValue({ body: subscription })

    await renderProbe()
    await act(async () => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(subscriptionApi.cancelSubscription).toHaveBeenCalledWith({
      subscriptionId: 'subscription-1',
      userName: 'general@example.com',
    })
    expect(subscriptionApi.getSubscription).toHaveBeenCalledTimes(2)
  })
})
