// @vitest-environment jsdom

import AppBanner from 'components/info/banners/app_banner'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('utils/analytics', () => ({ logBannerClose: vi.fn(), logBannerView: vi.fn() }))

const NOVEMBER_COPY =
  'The November rules update is in. Warscrolls and army rules across many factions now include the latest errata and fixes. If anything looks wrong, please let us know.'
const storageKey = (name: string) => `aos-reminders:aos4:banner:${name}`

describe('AppBanner rules-update note', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
    window.localStorage.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  const bannerText = () => container.querySelector('[role="alert"]')?.textContent?.replace(/\s+/g, ' ').trim()

  it('shows the owner-approved November copy (#1757)', () => {
    act(() => render(<AppBanner />, container))
    expect(bannerText()).toBe(NOVEMBER_COPY)
  })

  it('shows again to people who dismissed the previous September rules note', () => {
    window.localStorage.setItem(storageKey('2026-09-rules-update-5'), 'hidden')
    act(() => render(<AppBanner />, container))
    expect(bannerText()).toBe(NOVEMBER_COPY)
  })

  it('stays dismissed after closing it once', () => {
    act(() => render(<AppBanner />, container))
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Close notification"]')!.click())
    expect(container.querySelector('[role="alert"]')).toBeNull()
    expect(window.localStorage.getItem(storageKey('2026-11-rules-update-1'))).toBe('hidden')

    act(() => unmountComponentAtNode(container))
    act(() => render(<AppBanner />, container))
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })
})
