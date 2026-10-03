// @vitest-environment jsdom

import { protectedRoute } from 'components/page/privateRoute'
import Profile from 'components/routes/Profile'
import Subscribe from 'components/routes/Subscribe'
import { AppStatusProvider } from 'context/useAppStatus'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
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
  subscriptionNeedsLogin: false,
}))

const login = vi.hoisted(() => ({
  login: vi.fn(),
}))

const theme = {
  alertActionButton: 'btn btn-sm btn-outline-dark',
  bgColor: 'bg-light',
  card: 'card',
  cardBody: 'card-body',
  commitButton: 'btn btn-primary',
  destructiveButton: 'btn btn-danger',
  genericButton: 'btn btn-light',
  headerColor: 'header',
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

vi.mock('utils/hooks/useLogin', () => ({
  default: () => ({ isLoggingIn: false, login: login.login, popupIsClosed: false }),
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
    subscription.subscriptionNeedsLogin = false
    login.login.mockReset()
    login.login.mockResolvedValue(undefined)
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

    expect(container.textContent).toContain('Subscribe to AoS Reminders')
    // Leads with what the subscription does; the support appeal is a closing note, not the offer.
    // The one-person fact leads the page, above the fold, ahead of the value proposition.
    const onePerson = container.textContent?.indexOf('AoS Reminders is built and run by one person') ?? -1
    const valueProp =
      container.textContent?.indexOf('In free mode, your army is saved locally in your browser') ?? -1
    expect(onePerson).toBeGreaterThan(-1)
    expect(valueProp).toBeGreaterThan(onePerson)
    expect(container.textContent).not.toContain('Your army is saved in this browser, and only this browser')
    expect(container.textContent).not.toContain(
      'Import current army lists from the AoS app, Listbot 4.0, and New Recruit.'
    )
    expect(container.textContent).toContain(
      'save, load, rename, update, and delete your AoS 4 armies, on every device you sign in on.'
    )
    expect(container.textContent).toContain(
      'send a link a friend can open to take their own copy of your list.'
    )
    // PricingPlans is stubbed here; the plan cards themselves are covered by pricingPlans.test.tsx.
    expect(container.textContent).toContain('Subscription Plans')

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

  /*
   * The retired demo videos stay gone, and the #1761 reel replaces them under the feature list, so it
   * reads before the plans and the closing block still lands directly under them.
   */
  it('shows the demo reel before the plans, and closes straight after the plans', async () => {
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

    expect(container.querySelector('[src="/img/dark_mode1.mp4"]')).toBeNull()

    const videos = container.querySelectorAll('video')
    expect(videos).toHaveLength(1)
    const video = videos[0]
    expect(video.querySelector('source')?.getAttribute('src')).toBe('/img/subscribe-demo-2026-10.mp4')
    expect(video.querySelector('source')?.getAttribute('type')).toBe('video/mp4')
    expect(video.getAttribute('poster')).toBe('/img/subscribe-demo-2026-10-poster.jpg')
    // Nothing but the poster loads until the visitor presses play, and nothing moves on its own.
    expect(video.getAttribute('preload')).toBe('none')
    expect(video.hasAttribute('controls')).toBe(true)
    expect(video.hasAttribute('autoplay')).toBe(false)
    expect(video.hasAttribute('loop')).toBe(false)
    // The 16:9 box is reserved before the poster arrives, so the plans do not jump down.
    expect(video.getAttribute('width')).toBe('1920')
    expect(video.getAttribute('height')).toBe('1080')
    expect(video.getAttribute('aria-label')).toBe('AoS Reminders demo video')
    const description = container.querySelector(`#${video.getAttribute('aria-describedby')}`)
    expect(description?.textContent).toContain('saving an army to the cloud, sharing it with a friend')

    const reel = container.textContent?.indexOf('A 33-second tour with no sound') ?? -1

    // The subscribe-language update (#2058) moved the free-and-stays-free note up beside the
    // subscriber features, so it now reads before the plans, and the gift pointer is what closes
    // the page directly under them.
    const freeNote = container.textContent?.indexOf('Everything else is free, and stays free') ?? -1
    const plans = container.textContent?.indexOf('Subscription Plans') ?? -1
    const closing = container.textContent?.indexOf('You can buy gift subscriptions for friends') ?? -1
    expect(freeNote).toBeGreaterThan(-1)
    expect(reel).toBeGreaterThan(freeNote)
    expect(plans).toBeGreaterThan(reel)
    expect(closing).toBeGreaterThan(plans)

    /*
     * The same update removed the closing paragraph's price ceiling and army count. PRODUCT.md
     * treats stale copy on a paid surface as a blocking defect, and those were the two factual
     * claims this test pinned to their sources of truth, so their return must come with new pins.
     */
    expect(container.textContent).not.toContain('No plan costs more than')
    expect(container.textContent).not.toContain("armies' reminders free for everyone")
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

  const expiredSignIn = 'Your sign-in has expired. Please log in again to check your subscription.'

  const clickButton = async (label: string) => {
    const button = Array.from(container.querySelectorAll('button')).find(b => b.textContent === label)
    expect(button).toBeDefined()
    await act(async () => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })
  }

  it('offers a fresh login, not a retry, when the sign-in can no longer be renewed', async () => {
    subscription.subscriptionError = expiredSignIn
    subscription.subscriptionNeedsLogin = true

    await renderProfile()
    subscription.getSubscription.mockClear()

    expect(container.textContent).toContain('Your sign-in has expired')
    expect(container.textContent).not.toContain('temporarily unavailable')
    expect(Array.from(container.querySelectorAll('button')).map(b => b.textContent)).not.toContain(
      'Check again'
    )

    await clickButton('Log in again')

    expect(login.login).toHaveBeenCalledTimes(1)
    expect(subscription.getSubscription).toHaveBeenCalledTimes(1)
  })

  it('leaves the login prompt in place when the login popup is closed', async () => {
    subscription.subscriptionError = expiredSignIn
    subscription.subscriptionNeedsLogin = true
    login.login.mockRejectedValue(new Error('Popup closed'))

    await renderProfile()
    subscription.getSubscription.mockClear()
    await clickButton('Log in again')

    expect(login.login).toHaveBeenCalledTimes(1)
    expect(subscription.getSubscription).not.toHaveBeenCalled()
    expect(container.textContent).toContain('Your sign-in has expired')
  })

  it('starts only one login while the popup is open, however often the button is clicked', async () => {
    subscription.subscriptionError = expiredSignIn
    subscription.subscriptionNeedsLogin = true
    let finishLogin: () => void = () => undefined
    login.login.mockImplementation(() => new Promise<void>(resolve => (finishLogin = resolve)))

    await renderProfile()
    subscription.getSubscription.mockClear()

    const button = Array.from(container.querySelectorAll('button')).find(
      b => b.textContent === 'Log in again'
    )
    await act(async () => {
      // Two clicks inside one render, before the disabled state can land, then one more after it.
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })
    expect(button?.hasAttribute('disabled')).toBe(true)
    await clickButton('Log in again')

    expect(login.login).toHaveBeenCalledTimes(1)

    await act(async () => {
      finishLogin()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(subscription.getSubscription).toHaveBeenCalledTimes(1)
    expect(button?.hasAttribute('disabled')).toBe(false)
  })

  it('withholds the plans and offers a fresh login on Subscribe when the sign-in has expired', async () => {
    subscription.subscriptionError = expiredSignIn
    subscription.subscriptionNeedsLogin = true

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
    subscription.getSubscription.mockClear()

    expect(container.textContent).toContain('Your sign-in has expired')
    expect(container.textContent).not.toContain('Subscription Plans')

    await clickButton('Log in again')

    expect(login.login).toHaveBeenCalledTimes(1)
    expect(subscription.getSubscription).toHaveBeenCalledTimes(1)
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
    const ProtectedProfile = protectedRoute(Profile)

    act(() => {
      render(
        <AppStatusProvider>
          <MemoryRouter initialEntries={['/profile']}>
            <Routes>
              <Route path="/profile" element={<ProtectedProfile />} />
            </Routes>
          </MemoryRouter>
        </AppStatusProvider>,
        container
      )
    })

    expect(auth.withAuthenticationRequired).toHaveBeenCalledWith(Profile)
    expect(container.textContent).toContain('Your Profile')
  })
})
