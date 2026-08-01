// @vitest-environment jsdom

import { ThemeProvider, useTheme } from 'context/useTheme'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const account = vi.hoisted(() => ({
  isActive: true,
  subscription: {
    id: 'account-1',
    subscribed: true,
    theme: 'dark' as const,
    userName: 'general@example.com',
  },
}))

const subscriptionApi = vi.hoisted(() => ({
  updateTheme: vi.fn(),
}))

const token = vi.hoisted(() => ({
  get: vi.fn(),
}))

vi.mock('context/useSubscription', () => ({
  useSubscription: () => account,
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: subscriptionApi,
}))

vi.mock('utils/authToken', () => ({
  useApiAccessToken: () => token.get,
}))

const Probe = () => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button type="button" onClick={toggleTheme}>
      {isDark ? 'Dark' : 'Light'}
    </button>
  )
}

describe('subscriber theme continuity', () => {
  let container: HTMLDivElement
  let storedTheme: string | null

  beforeEach(() => {
    storedTheme = null
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        clear: vi.fn(() => {
          storedTheme = null
        }),
        getItem: vi.fn(() => storedTheme),
        key: vi.fn(() => null),
        length: 0,
        removeItem: vi.fn(() => {
          storedTheme = null
        }),
        setItem: vi.fn((_key: string, value: string) => {
          storedTheme = value
        }),
      } satisfies Storage,
    })
    subscriptionApi.updateTheme.mockReset()
    subscriptionApi.updateTheme.mockResolvedValue({})
    token.get.mockReset()
    token.get.mockResolvedValue('audience-token')
    container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.restoreAllMocks()
  })

  it('loads the account theme and persists subscriber changes locally and remotely', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>,
        container
      )
      await Promise.resolve()
    })

    expect(container.textContent).toBe('Dark')
    expect(window.localStorage.getItem('theme')).toBe('dark')

    await act(async () => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })

    expect(container.textContent).toBe('Light')
    expect(window.localStorage.getItem('theme')).toBe('light')
    expect(subscriptionApi.updateTheme).toHaveBeenCalledWith({ theme: 'light' }, 'audience-token')
  })

  /*
   * The canvas behind the document takes its colour from <body>, not from `#root`, so a theme that
   * only paints `#root` leaves white in the overscroll area. The previous background has to come off
   * as well as the new one going on, or a toggle back to light leaves both classes fighting.
   */
  it('paints the current theme onto <body> and clears the previous one', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>,
        container
      )
      await Promise.resolve()
    })

    expect(document.body.classList.contains('bg-themeDarkBlueSecondary')).toBe(true)
    expect(document.body.classList.contains('bg-white')).toBe(false)

    await act(async () => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })

    expect(document.body.classList.contains('bg-white')).toBe(true)
    expect(document.body.classList.contains('bg-themeDarkBlueSecondary')).toBe(false)
  })

  /* react-modal parks `ReactModal__Body--open` on <body>; a theme change must not sweep it off. */
  it('leaves unrelated body classes alone', async () => {
    document.body.classList.add('ReactModal__Body--open')

    await act(async () => {
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>,
        container
      )
      await Promise.resolve()
    })

    await act(async () => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })

    expect(document.body.classList.contains('ReactModal__Body--open')).toBe(true)
    document.body.classList.remove('ReactModal__Body--open')
  })
})
