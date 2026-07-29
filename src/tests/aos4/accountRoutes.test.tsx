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
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 })
    vi.restoreAllMocks()
  })

  it('advertises only the subscriber benefit that is currently available', async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })

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
    expect(container.textContent).toContain('Spare your eyes! Turn on dark mode!')
    expect(container.textContent).toContain('Subscription Plans')
    expect(container.textContent).toContain('Dark Mode')
    expect(container.querySelector('[src="/img/dark_mode1.mp4"]')).not.toBeNull()

    const staleClaims = [
      'Import lists from the new Warhammer App!',
      'Write, edit, and save notes!',
      'Share army lists with your friends!',
      'Save, load, update, and delete your army lists',
      'offline!',
      'Azyr',
      'Warscroll Builder',
      'Battlescribe',
      'Coming soon:',
      'Add custom reminders',
      'Attach PDF/HTML lists',
    ]

    staleClaims.forEach(claim => expect(container.textContent).not.toContain(claim))
    expect(container.querySelector('[src="/img/import_demo.mp4"]')).toBeNull()
    expect(container.querySelector('[src="/img/save_load_demo.mp4"]')).toBeNull()
  })

  it('does not leave an empty examples section on desktop', async () => {
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

    expect(container.textContent).toContain('Spare your eyes! Turn on dark mode!')
    expect(container.querySelector('[src="/img/dark_mode1.mp4"]')).toBeNull()
  })

  it('preserves the active-subscriber redirect screen', async () => {
    subscription.isSubscribed = true
    subscription.isActive = true

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

    expect(container.textContent).toContain('You are now subscribed :) Thanks!')
    expect(container.textContent).not.toContain('Subscription Plans')
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
