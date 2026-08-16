// @vitest-environment jsdom

import GenericModal from 'components/modals/generic/generic_modal'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const theme = vi.hoisted(() => ({ isDark: false }))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({ isDark: theme.isDark, theme: { text: 'text-dark' } }),
}))

/*
 * The account modals mock GenericModal away, which is exactly why its processing state could ship
 * blanking the whole dialog. These assertions are about the real component.
 */
describe('generic modal processing state', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    theme.isDark = false
    container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  const renderModal = (isProcessing: boolean) => {
    act(() => {
      render(
        <GenericModal closeModal={vi.fn()} isOpen isProcessing={isProcessing} label="Test Modal">
          <button type="button">Saved army action</button>
          <div className="alert alert-danger">Something went wrong</div>
        </GenericModal>,
        container
      )
    })
    return document.querySelector<HTMLElement>('.ModalContent')!
  }

  it('keeps the content mounted and visible while a request is in flight', () => {
    const content = renderModal(true)

    /*
     * The regression this guards: the body used to be wrapped in `hidden`, which display:none's the
     * subtree. The list, the headings and any live alert vanished mid-save, and because the focused
     * control went with them the browser dropped focus to <body> and nothing put it back.
     */
    expect(document.querySelector('[hidden]')).toBeNull()
    expect(content.textContent).toContain('Saved army action')
    expect(content.textContent).toContain('Something went wrong')
    expect(content.getAttribute('aria-busy')).toBe('true')
    expect(content.querySelector('.ModalContent-Busy')).not.toBeNull()
    expect(content.querySelector('.ModalContent-Spinner')).not.toBeNull()
  })

  it('reports the busy state to assistive technology through a live region', () => {
    const content = renderModal(true)
    const status = content.querySelector('[role="status"]')

    expect(status).not.toBeNull()
    expect(status!.textContent).toContain('Loading')
  })

  it('leaves no busy affordance behind once the request settles', () => {
    const content = renderModal(false)

    expect(content.getAttribute('aria-busy')).toBe('false')
    expect(content.querySelector('.ModalContent-Busy')).toBeNull()
    expect(content.querySelector('.ModalContent-Spinner')).toBeNull()
  })

  it('keeps the modal on its own themed surface rather than going transparent', () => {
    renderModal(true)
    expect(document.querySelector('.Modal-Light')).not.toBeNull()
    expect(document.querySelector('.Modal-Transparent')).toBeNull()
  })

  it('draws the spinner for the active theme, so it is never dark-on-dark', () => {
    // `isDark` was declared on the spinner and never passed, so it rendered `text-dark` in both
    // themes — 1.53:1 against the composited scrim.
    renderModal(true)
    expect(document.querySelector('.ModalContent-Spinner .text-dark')).not.toBeNull()

    act(() => {
      unmountComponentAtNode(container)
    })
    theme.isDark = true
    renderModal(true)
    expect(document.querySelector('.ModalContent-Spinner .text-dark')).toBeNull()
  })
})
