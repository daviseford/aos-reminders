// @vitest-environment jsdom

import AsyncSuccessButton from 'components/input/asyncSuccess/asyncSuccessButton'
import {
  ASYNC_SUCCESS_HOLD_MS,
  ASYNC_SUCCESS_REDUCED_HOLD_MS,
  useAsyncSuccess,
} from 'components/input/asyncSuccess/useAsyncSuccess'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockMatchMedia = (reduced: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      addEventListener: vi.fn(),
      matches: reduced,
      media: query,
      removeEventListener: vi.fn(),
    }),
  })
}

const Harness = ({ onSettled }: { onSettled: () => void }) => {
  const { succeeded, triggerSuccess } = useAsyncSuccess()
  return (
    <AsyncSuccessButton
      label="Commit"
      onClick={() => triggerSuccess(onSettled)}
      succeeded={succeeded}
      successAnnouncement="Done."
    />
  )
}

describe('async success confirmation', () => {
  let container: HTMLDivElement

  const button = () => container.querySelector<HTMLButtonElement>('button')!

  beforeEach(() => {
    vi.useFakeTimers()
    mockMatchMedia(false)
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.useRealTimers()
  })

  it('holds the success state before settling, and announces it accessibly', () => {
    const onSettled = vi.fn()
    act(() => {
      render(<Harness onSettled={onSettled} />, container)
    })

    act(() => {
      button().click()
    })

    expect(button().className).toContain('AsyncSuccessButton-Succeeded')
    // The label stays in the DOM (faded) so the button's footprint does not jump.
    expect(button().textContent).toBe('Commit')
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Done.')
    expect(onSettled).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(ASYNC_SUCCESS_HOLD_MS - 1)
    })
    expect(onSettled).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onSettled).toHaveBeenCalledTimes(1)
  })

  it('disables itself once succeeded, so a double-click cannot commit twice', () => {
    const onSettled = vi.fn()
    act(() => {
      render(<Harness onSettled={onSettled} />, container)
    })

    act(() => {
      button().click()
    })
    expect(button().disabled).toBe(true)

    act(() => {
      button().click()
      vi.advanceTimersByTime(ASYNC_SUCCESS_HOLD_MS)
    })
    expect(onSettled).toHaveBeenCalledTimes(1)
  })

  it('holds only briefly under prefers-reduced-motion, with the check pre-drawn', () => {
    mockMatchMedia(true)
    const onSettled = vi.fn()
    act(() => {
      render(<Harness onSettled={onSettled} />, container)
    })

    expect(container.querySelector<SVGPathElement>('path')!.style.strokeDashoffset).toBe('0')

    act(() => {
      button().click()
      vi.advanceTimersByTime(ASYNC_SUCCESS_REDUCED_HOLD_MS)
    })
    expect(onSettled).toHaveBeenCalledTimes(1)
  })

  it('draws the check with the stroke transition when motion is allowed', () => {
    act(() => {
      render(<Harness onSettled={vi.fn()} />, container)
    })
    expect(container.querySelector<SVGPathElement>('path')!.style.strokeDashoffset).toBe('1')

    act(() => {
      button().click()
    })
    expect(container.querySelector<SVGPathElement>('path')!.style.strokeDashoffset).toBe('0')
  })

  it('never settles after the component unmounts mid-hold', () => {
    const onSettled = vi.fn()
    act(() => {
      render(<Harness onSettled={onSettled} />, container)
    })
    act(() => {
      button().click()
    })

    act(() => {
      unmountComponentAtNode(container)
    })
    act(() => {
      vi.advanceTimersByTime(ASYNC_SUCCESS_HOLD_MS * 2)
    })
    expect(onSettled).not.toHaveBeenCalled()
  })
})
