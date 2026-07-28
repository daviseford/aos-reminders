// @vitest-environment jsdom

import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { ThemeProvider } from 'context/useTheme'
import { SubscriptionProvider } from 'context/useSubscription'
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    isLoading: false,
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
  }),
}))

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

describe('AoS 4 home presentation', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
    container = document.createElement('div')
    document.body.appendChild(container)

    act(() => {
      render(
        <AppStatusProvider>
          <SubscriptionProvider>
            <ThemeProvider>
              <MemoryRouter>
                <Home />
              </MemoryRouter>
            </ThemeProvider>
          </SubscriptionProvider>
        </AppStatusProvider>,
        container
      )
    })
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('preserves the established header, builder-card, toolbar, and reminder-card presentation', () => {
    expect(container.querySelector('.jumbotron.jumbotron-fluid')).not.toBeNull()
    expect(container.querySelector('.bg-themeDarkBluePrimary')).not.toBeNull()
    expect(container.querySelector('[role="switch"]')).not.toBeNull()
    expect(container.querySelector('.card-header.bg-themeLightBlue')).not.toBeNull()
    expect(container.querySelector('.ReminderContainer')).not.toBeNull()
    expect(container.querySelector('.ReminderCardBody')).not.toBeNull()
    expect(container.textContent).toContain('Age of Sigmar Reminders')
    expect(container.textContent).toContain('Edit')
    expect(container.textContent).toContain('Play')
    expect(container.textContent).toContain('Clear Army')
    // `master` shipped a Download PDF toolbar button, not a browser-print one.
    expect(container.textContent).toContain('Download PDF')
    expect(container.textContent).toContain('Subscribe')
    expect(container.textContent).toContain('FAQ')
    expect(container.textContent).toContain('Log in')
  })

  it('does not render the migration-workbench reskin', () => {
    expect(container.querySelector('.aos4-hero')).toBeNull()
    expect(container.querySelector('.aos4-layout')).toBeNull()
    expect(container.querySelector('.aos4-reminder')).toBeNull()
    expect(container.textContent).not.toContain('AoS 4 migration workbench')
    expect(container.textContent).not.toContain('Build less. Remember more.')
  })
})
