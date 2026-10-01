// @vitest-environment jsdom

import AppBanner from 'components/info/banners/app_banner'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('utils/analytics', () => ({ logBannerClose: vi.fn(), logBannerView: vi.fn() }))

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

  it('says only that the latest September errata has been added (#2060)', () => {
    act(() => render(<AppBanner />, container))
    expect(container.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'The latest September errata has been added.'
    )
  })

  it('shows again to people who dismissed the previous rules note', () => {
    window.localStorage.setItem('aos-reminders:aos4:banner:2026-09-rules-update-4', 'hidden')
    act(() => render(<AppBanner />, container))
    expect(container.textContent).toContain('The latest September errata has been added.')
  })
})
