// @vitest-environment jsdom

import PrintModal from 'components/print/printModal'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: {
      commitButton: 'btn btn-primary',
      genericButton: 'btn btn-outline-dark',
      text: 'text-dark',
    },
  }),
}))

vi.mock('components/modals/generic/generic_modal', () => ({
  default: ({
    children,
    isOpen,
    isProcessing,
    label,
  }: React.PropsWithChildren<{ isOpen: boolean; isProcessing?: boolean; label: string }>) =>
    isOpen ? (
      <div aria-busy={isProcessing} aria-label={label} role="dialog">
        {children}
      </div>
    ) : null,
}))

const findButton = (container: HTMLElement, label: string): HTMLButtonElement => {
  const button = Array.from(container.querySelectorAll('button')).find(
    candidate => candidate.textContent?.trim() === label
  )
  if (!button) throw new Error(`Button "${label}" not found`)
  return button
}

describe('PDF download modal', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('waits for PDF creation before closing and disables repeat downloads', async () => {
    let resolveDownload: (() => void) | undefined
    const onDownloadPdf = vi.fn(
      () =>
        new Promise<void>(resolve => {
          resolveDownload = resolve
        })
    )
    const closeModal = vi.fn()
    act(() => {
      render(
        <PrintModal
          closeModal={closeModal}
          defaultFileName="Stormcast_Reminders"
          isOpen
          onDownloadPdf={onDownloadPdf}
        />,
        container
      )
    })

    await act(async () => {
      findButton(container, 'Download PDF').click()
      await Promise.resolve()
    })

    expect(onDownloadPdf).toHaveBeenCalledWith('compact', 'a4', 'Stormcast_Reminders', {
      includeSummary: true,
    })
    expect(findButton(container, 'Download PDF').disabled).toBe(true)
    expect(closeModal).not.toHaveBeenCalled()

    await act(async () => {
      resolveDownload?.()
      await Promise.resolve()
    })

    expect(closeModal).toHaveBeenCalledTimes(1)
  })

  /*
   * Cancel sits directly above Download PDF in the same full-width column — the modal is
   * shrink-to-fit, so they cannot share a row. With both outlined they read as equal weight, and
   * Cancel was the *redder* of the two (`modalDangerClass`, filled in dark theme).
   */
  it('fills the download and leaves cancel outlined', () => {
    act(() => {
      render(
        <PrintModal
          closeModal={vi.fn()}
          defaultFileName="Stormcast_Reminders"
          isOpen
          onDownloadPdf={vi.fn().mockResolvedValue(undefined)}
        />,
        container
      )
    })

    expect(findButton(container, 'Download PDF').className).toContain('btn-primary')
    expect(findButton(container, 'Cancel').className).toContain('btn-outline-dark')
    expect(findButton(container, 'Cancel').className).not.toContain('btn-danger')
  })

  it('passes includeSummary false when the army summary checkbox is unchecked', async () => {
    const onDownloadPdf = vi.fn().mockResolvedValue(undefined)
    act(() => {
      render(
        <PrintModal
          closeModal={vi.fn()}
          defaultFileName="Stormcast_Reminders"
          isOpen
          onDownloadPdf={onDownloadPdf}
        />,
        container
      )
    })

    const checkbox = container.querySelector<HTMLInputElement>('#printIncludeSummary')
    expect(checkbox?.checked).toBe(true)

    act(() => {
      checkbox?.click()
    })
    expect(checkbox?.checked).toBe(false)

    await act(async () => {
      findButton(container, 'Download PDF').click()
      await Promise.resolve()
    })

    expect(onDownloadPdf).toHaveBeenCalledWith('compact', 'a4', 'Stormcast_Reminders', {
      includeSummary: false,
    })
  })

  it('keeps the modal open and explains a failed PDF chunk load', async () => {
    const closeModal = vi.fn()
    act(() => {
      render(
        <PrintModal
          closeModal={closeModal}
          defaultFileName="Stormcast_Reminders"
          isOpen
          onDownloadPdf={vi.fn().mockRejectedValue(new Error('Chunk load failed'))}
        />,
        container
      )
    })

    await act(async () => {
      findButton(container, 'Download PDF').click()
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'The PDF could not be created. Please try again.'
    )
    expect(findButton(container, 'Download PDF').disabled).toBe(false)
    expect(closeModal).not.toHaveBeenCalled()
  })
})
