// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://preview.example.test/subscribe"}

import { PaypalPostSubscribeModal } from 'components/modals/paypal_post_subscribe_modal'
import PaypalButton from 'components/payment/paypal/paypalButton'
import { PaypalProvider } from 'context/usePaypal'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * The PayPal SDK's own callbacks are where its errors surface. These tests drive the button,
 * provider, and confirmation modal through a fake SDK and check which callbacks reach the
 * component's error handlers — and, as importantly, which do not.
 */

interface FakeButtonsOptions {
  onCancel?: (data: unknown) => unknown
  onError?: (error: unknown) => unknown
}

const sdk = vi.hoisted(() => ({
  options: null as FakeButtonsOptions | null,
  render: vi.fn(),
}))

const subscription = vi.hoisted(() => ({
  getSubscription: vi.fn(),
  isActive: false,
  subscriptionLoading: false,
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ isAuthenticated: true, user: { email: 'buyer@example.com' } }),
}))

vi.mock('utils/hooks/useLogin', () => ({
  default: () => ({ login: vi.fn() }),
}))

vi.mock('context/useSubscription', () => ({
  useSubscription: () => subscription,
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({ isDark: false, theme: { genericButton: '', text: '' } }),
}))

vi.mock('components/modals/generic/generic_modal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('components/page/contact', () => ({ default: () => null }))

vi.mock('react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}))

describe('PayPal checkout error callbacks', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    vi.clearAllMocks()
    sdk.options = null
    sdk.render.mockResolvedValue(undefined)
    subscription.isActive = false
    subscription.subscriptionLoading = false
    window.paypal = {
      Buttons: (options: FakeButtonsOptions) => {
        sdk.options = options
        return { close: () => Promise.resolve(), render: sdk.render }
      },
    } as unknown as Window['paypal']
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete (window as { paypal?: unknown }).paypal
  })

  // One tick per render: the modal counts attempts in state, which a single long jump would skip.
  const pollFor = async (seconds: number) => {
    for (let tick = 0; tick < seconds; tick += 1) {
      await act(async () => {
        vi.advanceTimersByTime(1000)
      })
    }
  }

  const renderButton = async (handlers: {
    onCancel?: () => void
    onError?: () => void
    onRenderError?: () => void
  }) => {
    await act(async () => {
      render(
        <PaypalProvider>
          <PaypalButton planId="P-PLAN" planTitle="1 Month" {...handlers} />
        </PaypalProvider>,
        container
      )
    })
  }

  it('routes an SDK error to onError without passing the error on, and a cancel only to onCancel', async () => {
    const onCancel = vi.fn()
    const onError = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    await renderButton({ onCancel, onError })

    expect(sdk.options?.onError).toEqual(expect.any(Function))

    sdk.options!.onCancel!({ orderID: 'order-id' })
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onError).not.toHaveBeenCalled()

    sdk.options!.onError!(new Error('buyer@example.com could not be charged'))
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith()
  })

  it('reports a button that fails to render', async () => {
    const onRenderError = vi.fn()
    sdk.render.mockRejectedValue(new Error('render failed'))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await renderButton({ onRenderError })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(onRenderError).toHaveBeenCalledTimes(1)
    expect(onRenderError).toHaveBeenCalledWith()
  })

  it('reports an SDK script that fails to load, once', async () => {
    delete (window as { paypal?: unknown }).paypal
    const onLoadError = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    await act(async () => {
      render(<PaypalProvider onLoadError={onLoadError} />, container)
    })

    const script = document.body.querySelector<HTMLScriptElement>('script[src*="paypal.com/sdk/js"]')
    expect(script).not.toBeNull()
    await act(async () => {
      script!.dispatchEvent(new Event('error'))
    })

    expect(onLoadError).toHaveBeenCalledTimes(1)
    script!.remove()
  })

  /*
   * The modal polls for the activation PayPal's webhook triggers. Giving up is reported once, and a
   * subscription that does turn active is never reported at all.
   */
  it('reports an unconfirmed activation once when the modal stops waiting', async () => {
    vi.useFakeTimers()
    const onConfirmationTimeout = vi.fn()
    const retryGrant = vi.fn().mockResolvedValue(undefined)

    await act(async () => {
      render(
        <PaypalPostSubscribeModal
          modalIsOpen
          closeModal={vi.fn()}
          onConfirmationTimeout={onConfirmationTimeout}
          retryGrant={retryGrant}
        />,
        container
      )
    })

    await pollFor(90)
    expect(onConfirmationTimeout).not.toHaveBeenCalled()

    await pollFor(1)
    expect(onConfirmationTimeout).toHaveBeenCalledTimes(1)
    expect(container.textContent).toContain('Still waiting on PayPal')

    await pollFor(60)
    expect(onConfirmationTimeout).toHaveBeenCalledTimes(1)
  })

  it('does not report an activation that is confirmed', async () => {
    vi.useFakeTimers()
    subscription.isActive = true
    const onConfirmationTimeout = vi.fn()
    const closeModal = vi.fn()

    await act(async () => {
      render(
        <PaypalPostSubscribeModal
          modalIsOpen
          closeModal={closeModal}
          onConfirmationTimeout={onConfirmationTimeout}
        />,
        container
      )
    })
    await pollFor(120)

    expect(closeModal).toHaveBeenCalled()
    expect(onConfirmationTimeout).not.toHaveBeenCalled()
  })
})
