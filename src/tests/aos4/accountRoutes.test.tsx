// @vitest-environment jsdom

import PrivateRoute from 'components/page/privateRoute'
import Profile from 'components/routes/Profile'
import Subscribe from 'components/routes/Subscribe'
import { AppStatusProvider } from 'context/useAppStatus'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  isAuthenticated: true,
  isLoading: false,
  user: { email: 'general@example.com' },
  withAuthenticationRequired: vi.fn((component: unknown) => component),
}))

const subscription = vi.hoisted(() => ({
  cancelSubscription: vi.fn(),
  createdByPaypal: false,
  createdByStripe: true,
  getSubscription: vi.fn(),
  hasActiveGrant: false,
  hasExpiredGrant: false,
  isActive: false,
  isCanceled: false,
  isGifted: false,
  isNotSubscribed: true,
  isPending: false,
  isSubscribed: false,
  subscription: {
    id: '',
    subscribed: false,
    userName: '',
  },
  subscriptionError: null as string | null,
  subscriptionLoading: false,
}))

const theme = {
  bgColor: 'bg-light',
  card: 'card',
  cardBody: 'card-body',
  genericButton: 'btn btn-light',
  headerColor: 'header',
  modalConfirmClass: 'btn btn-primary',
  modalDangerClass: 'btn btn-danger',
  profileCardHeader: 'card-header',
  text: 'text-dark',
}

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
  withAuthenticationRequired: auth.withAuthenticationRequired,
}))

vi.mock('components/page/navbar', () => ({
  default: () => <div>Account navigation</div>,
}))

vi.mock('components/page/contact', () => ({
  default: () => <div>Contact links</div>,
}))

vi.mock('components/payment/giftSubscriptions', () => ({
  GiftSubscriptions: () => <div>Gift subscriptions</div>,
}))

vi.mock('components/payment/pricingPlans', () => ({
  PricingPlans: () => <div>Subscription Plans</div>,
}))

vi.mock('context/useSubscription', () => ({
  useSubscription: () => subscription,
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    isLight: true,
    setLightTheme: vi.fn(),
    theme,
    toggleTheme: vi.fn(),
  }),
}))

describe('established account routes', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    auth.withAuthenticationRequired.mockClear()
    subscription.getSubscription.mockReset()
    subscription.isActive = false
    subscription.isSubscribed = false
    subscription.subscriptionError = null
    subscription.subscriptionError = null
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

  it('preserves the established subscription page content and pricing placement', async () => {
    await act(async () => {
      render(
        <AppStatusProvider>
          <MemoryRouter>
            <Subscribe />
          </MemoryRouter>
        </AppStatusProvider>,
        container
      )
      await Promise.resolve()
    })

    expect(container.textContent).toContain('Support AoS Reminders')
    expect(container.textContent).toContain('What do you get when you subscribe?')
    expect(container.textContent).toContain('Import lists from the new Warhammer App!')
    expect(container.textContent).toContain('Subscription Plans')
    expect(container.textContent).toContain('Importing Warscroll Builder/Azyr files')
  })

  it('preserves the established profile cards and subscription controls', async () => {
    await act(async () => {
      render(
        <AppStatusProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </AppStatusProvider>,
        container
      )
      await Promise.resolve()
    })

    expect(container.textContent).toContain('Your Profile')
    expect(container.textContent).toContain('Visual Theme: Light')
    expect(container.textContent).toContain('Subscription Status:')
    expect(container.textContent).toContain('User Email:')
    expect(container.textContent).toContain('Contact Us')
    expect(container.textContent).toContain('Gift subscriptions')
  })

  it('keeps Profile behind the Auth0 protected-route wrapper', () => {
    act(() => {
      render(
        <AppStatusProvider>
          <MemoryRouter initialEntries={['/profile']}>
            <PrivateRoute path="/profile" component={Profile} />
          </MemoryRouter>
        </AppStatusProvider>,
        container
      )
    })

    expect(auth.withAuthenticationRequired).toHaveBeenCalledWith(Profile)
    expect(container.textContent).toContain('Your Profile')
  })
})
