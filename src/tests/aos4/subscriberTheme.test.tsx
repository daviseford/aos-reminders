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
})
