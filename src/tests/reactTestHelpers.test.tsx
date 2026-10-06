// @vitest-environment jsdom

import { createTestRoot, render } from 'tests/support/reactTestHelpers'
import { beforeAll, describe, expect, it, vi } from 'vitest'

/*
 * A timed-out test keeps running into the tests after it (#2076). These replay that interleaving
 * with two roots, aborting the first one's signal by hand where vitest would on a timeout.
 */
describe('a test root that outlives its timeout', () => {
  beforeAll(() => {
    ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  })

  it('closes its still-open act before the next test renders', async () => {
    const consoleError = vi.spyOn(console, 'error')
    const timedOut = new AbortController()
    const first = createTestRoot(timedOut.signal)
    let release = () => {}
    // Inside an act() when the time runs out, as a slow Home render is.
    const abandoned = first.act(async () => {
      render(<p>first</p>, first.container)
      await new Promise<void>(resolve => {
        release = resolve
      })
    })
    timedOut.abort(new Error('Test timed out'))
    // The abandoned act settles on its own a little later, as the real one does once its flush lands.
    setTimeout(() => release(), 20)
    await first.cleanup()

    const next = createTestRoot(new AbortController().signal)
    await next.act(() => {
      render(<p>next</p>, next.container)
    })

    // With the first act still open, this one would nest inside it and never flush: an empty screen.
    expect(next.container.textContent).toBe('next')
    await abandoned
    await next.cleanup()
    // React's own report of the same fault, which leaves every later act() in the file unflushed.
    expect(consoleError.mock.calls.flat().join(' ')).not.toContain('overlapping act() calls')
    consoleError.mockRestore()
  })

  it('refuses the next step once its test has timed out', async () => {
    const timedOut = new AbortController()
    const first = createTestRoot(timedOut.signal)
    await first.act(() => {
      render(<p>first</p>, first.container)
    })

    timedOut.abort(new Error('Test timed out'))
    const nextStep = vi.fn()

    await expect(first.act(nextStep)).rejects.toThrow('Test timed out')
    expect(nextStep).not.toHaveBeenCalled()
    await first.cleanup()
    expect(first.container.isConnected).toBe(false)
  })
})
