// @vitest-environment jsdom

import PrivateRoute from 'components/page/privateRoute'
import Profile from 'components/routes/Profile'
import Subscribe from 'components/routes/Subscribe'
import { AppStatusProvider } from 'context/useAppStatus'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
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
  secondaryButton: 'btn btn-sm btn-outline-secondary',
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
    subscription.isCanceled = false
    subscription.isPending = false
    subscription.isSubscribed = false
    subscription.subscriptionError = null
    subscription.subscriptionLoading = false
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

  it('advertises the restored subscriber capabilities without retired format claims', async () => {
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
    expect(container.textContent).not.toContain(
      'Import current army lists from the AoS app, Listbot 4.0, and New Recruit.'
    )
    expect(container.textContent).toContain(
      'Save, load, rename, update, and delete AoS 4 armies across your devices.'
    )
    expect(container.textContent).toContain('Create read-only army links to share with your friends.')
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

  it('shows the already-subscribed screen instead of the plans for an active subscriber', async () => {
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

    /*
     * The screen is only reachable by arriving already subscribed — Stripe returns to `/` and gift
     * purchases to /profile — so it must not claim the visit just subscribed the user.
     */
    expect(container.textContent).toContain("You're already subscribed")
    expect(container.textContent).not.toContain('now subscribed')
    expect(container.textContent).not.toContain('Subscription Plans')
    // It used to bounce to the home page on a 1000ms timer instead of offering somewhere to go.
    expect(container.querySelector('a[href="/profile"]')).not.toBeNull()
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

  const renderProfile = async () => {
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
  }

  it('states the subscription status in words rather than by icon alone', async () => {
    await renderProfile()
    expect(container.textContent).toContain('Not subscribed')
    expect(container.textContent).toContain('You do not have an active subscription.')

    // Every icon on the card is decorative; the text beside it carries the value.
    const headerIcons = container.querySelectorAll('.card-header svg')
    expect(headerIcons.length).toBeGreaterThan(0)
    headerIcons.forEach(icon => expect(icon.getAttribute('aria-hidden')).toBe('true'))
  })

  it('does not report a settled status while the lookup is still in flight', async () => {
    subscription.subscriptionLoading = true

    await renderProfile()

    expect(container.textContent).toContain('Checking your subscription')
    expect(container.textContent).not.toContain('Not subscribed')
    expect(container.querySelector('[role="status"]')).not.toBeNull()
  })

  it('surfaces a failed subscription lookup instead of rendering it as not subscribed', async () => {
    subscription.subscriptionError = 'Subscription status is temporarily unavailable. Please try again.'

    await renderProfile()

    expect(container.textContent).toContain('temporarily unavailable')
    expect(container.textContent).not.toContain('Not subscribed')
    expect(container.textContent).not.toContain('You do not have an active subscription.')
    expect(container.querySelector('.alert-warning')).not.toBeNull()
  })

  it('offers a recovery path when the subscription lookup fails', async () => {
    subscription.subscriptionError = 'Subscription status is temporarily unavailable. Please try again.'

    await renderProfile()

    const retry = Array.from(container.querySelectorAll('button')).find(b => b.textContent === 'Check again')
    expect(retry).toBeDefined()

    subscription.getSubscription.mockClear()
    await act(async () => {
      retry?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })
    expect(subscription.getSubscription).toHaveBeenCalled()
  })

  it('keeps profile card titles at one heading level below the page title', async () => {
    await renderProfile()

    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelectorAll('h4')).toHaveLength(0)

    const cardTitles = Array.from(container.querySelectorAll('.card-header h2'))
    expect(cardTitles.length).toBeGreaterThan(0)
    cardTitles.forEach(title => expect(title.className).toContain('CardHeaderTitle'))

    // The email address is data, not document structure.
    const headings = Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => h.textContent ?? '')
    expect(headings.some(text => text.includes('general@example.com'))).toBe(false)
    expect(container.textContent).toContain('general@example.com')
  })

  it('never renders a profile card as a bare header', async () => {
    for (const state of [
      { isSubscribed: false, isActive: false },
      { isSubscribed: true, isActive: true },
      { isSubscribed: true, isActive: false },
      { isSubscribed: true, isActive: true, isCanceled: true },
    ]) {
      Object.assign(subscription, state)
      await renderProfile()

      container.querySelectorAll('.card').forEach(card => {
        const body = card.querySelector('.card-body')
        // A card is either header-plus-content or nothing; a header with an empty body reads as truncated.
        const hasContent =
          !!body?.textContent?.trim() || !!body?.querySelector('button, a, input, svg, video, img')
        expect({ card: card.querySelector('.card-header')?.textContent, hasContent }).toEqual({
          card: card.querySelector('.card-header')?.textContent,
          hasContent: true,
        })
      })

      act(() => {
        unmountComponentAtNode(container)
      })
    }
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
