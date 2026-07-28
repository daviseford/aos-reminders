// @vitest-environment jsdom

import { ThemeProvider, useTheme } from 'context/useTheme'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
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

vi.mock('context/useSubscription', () => ({
  useSubscription: () => account,
}))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: subscriptionApi,
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

    act(() => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.textContent).toBe('Light')
    expect(window.localStorage.getItem('theme')).toBe('light')
    expect(subscriptionApi.updateTheme).toHaveBeenCalledWith({
      id: 'account-1',
      theme: 'light',
      userName: 'general@example.com',
    })
  })
})
