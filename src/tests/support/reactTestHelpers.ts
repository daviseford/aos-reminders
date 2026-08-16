import type { ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'

/**
 * The React 19 replacements for the test-only APIs the UI tests were written against.
 *
 * React 19 removed `ReactDOM.render`, `ReactDOM.unmountComponentAtNode`, and `Simulate` from
 * `react-dom/test-utils`. This module reimplements exactly the surface those tests used, so the test
 * bodies keep asserting the same things through the same calls and the migration stays reviewable.
 *
 * The long-term answer is `@testing-library/react`, which owns all of this properly. Adopting it
 * means rewriting how all ten files manage their container and query the DOM, which is a change to
 * the tests themselves rather than to what they cover — worth doing, but not inside a React upgrade.
 */

const roots = new Map<Element, Root>()

/**
 * `createRoot(...).render(...)` in place of the removed `ReactDOM.render`.
 *
 * Concurrent roots render asynchronously, so — as before — every call must sit inside `act()`, which
 * flushes the work before returning. The callers already do this.
 */
export const render = (element: ReactNode, container: Element): void => {
  let root = roots.get(container)
  if (!root) {
    root = createRoot(container)
    roots.set(container, root)
  }
  root.render(element)
}

/** `root.unmount()` in place of the removed `ReactDOM.unmountComponentAtNode`. */
export const unmountComponentAtNode = (container: Element): boolean => {
  const root = roots.get(container)
  if (!root) return false
  root.unmount()
  roots.delete(container)
  return true
}

/**
 * React tracks the last value it saw for each controlled field on the element itself, and skips
 * `onChange` when a native event arrives carrying a value it believes is already current. The tests
 * assign `field.value = '...'` directly, which updates that tracker — so a plain dispatched event
 * would be swallowed. Clearing the tracked value first restores the behaviour `Simulate` had, which
 * bypassed the tracker by dispatching straight into React's dispatcher.
 */
const invalidateValueTracker = (element: Element): void => {
  const tracker = (element as { _valueTracker?: { setValue: (value: string) => void } })._valueTracker
  tracker?.setValue('')
}

/**
 * React listens for `change` on selects, checkboxes, radios, and file inputs, and for `input` on
 * everything else that carries text.
 */
const changeEventFor = (element: Element): string => {
  const tag = element.tagName.toLowerCase()
  if (tag === 'select') return 'change'
  if (tag === 'input') {
    const type = (element as HTMLInputElement).type
    if (type === 'checkbox' || type === 'radio' || type === 'file') return 'change'
  }
  return 'input'
}

/**
 * The subset of `react-dom/test-utils`' `Simulate` these tests use, rebuilt on real DOM events.
 * React 19 delegates from the root container, so a bubbling native event reaches the same handlers.
 */
export const Simulate = {
  click: (element: Element): void => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  },

  change: (element: Element): void => {
    invalidateValueTracker(element)
    element.dispatchEvent(new Event(changeEventFor(element), { bubbles: true, cancelable: true }))
  },

  /*
   * Dispatched directly rather than by clicking the submit button: jsdom logs a "not implemented"
   * error when a real form submission reaches navigation, and React's own handler is what the
   * assertion is about.
   */
  submit: (element: Element): void => {
    element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  },

  drop: (element: Element, eventData: { dataTransfer: unknown }): void => {
    const event = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'dataTransfer', { value: eventData.dataTransfer })
    element.dispatchEvent(event)
  },
}
