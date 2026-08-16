// @vitest-environment jsdom

import Toolbar from 'components/input/toolbar/toolbar'
import { act } from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('context/useTheme', () => ({
  useTheme: () => ({ theme: { genericButtonBlock: 'btn btn-block btn-outline-dark' } }),
}))

const findButton = (container: HTMLElement, label: string): HTMLButtonElement | undefined =>
  Array.from(container.querySelectorAll('button')).find(candidate => candidate.textContent?.trim() === label)

describe('toolbar save controls', () => {
  let container: HTMLDivElement

  const baseProps = {
    cloudArmyLinked: false,
    hiddenCount: 0,
    onClearArmy: vi.fn(),
    onDownloadPdf: vi.fn(),
    onImportArmy: vi.fn(),
    onOpenSavedArmies: vi.fn(),
    onSaveArmy: vi.fn(),
    onShareArmy: vi.fn(),
    onShowAll: vi.fn(),
    onUpdateArmy: vi.fn(),
    updateArmyStatus: 'idle' as const,
  }

  beforeEach(() => {
    baseProps.onSaveArmy.mockReset()
    baseProps.onUpdateArmy.mockReset()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('offers a single Save Army button while the army is not linked to a cloud army', () => {
    act(() => {
      render(<Toolbar {...baseProps} />, container)
    })

    expect(findButton(container, 'Save Army')).not.toBeUndefined()
    expect(findButton(container, 'Update Army')).toBeUndefined()
    expect(findButton(container, 'Save As')).toBeUndefined()

    act(() => findButton(container, 'Save Army')!.click())
    expect(baseProps.onSaveArmy).toHaveBeenCalledTimes(1)
  })

  it('splits saving into Update Army and Save As once the army mirrors a cloud army', () => {
    act(() => {
      render(<Toolbar {...baseProps} cloudArmyLinked />, container)
    })

    expect(findButton(container, 'Save Army')).toBeUndefined()
    expect(findButton(container, 'Save As')).not.toBeUndefined()

    act(() => findButton(container, 'Update Army')!.click())
    expect(baseProps.onUpdateArmy).toHaveBeenCalledTimes(1)

    act(() => findButton(container, 'Save As')!.click())
    expect(baseProps.onSaveArmy).toHaveBeenCalledTimes(1)
  })

  it('reports update progress and completion on the Update Army button itself', () => {
    act(() => {
      render(<Toolbar {...baseProps} cloudArmyLinked updateArmyStatus="updating" />, container)
    })
    expect(findButton(container, 'Updating…')?.disabled).toBe(true)

    act(() => {
      render(<Toolbar {...baseProps} cloudArmyLinked updateArmyStatus="updated" />, container)
    })
    expect(findButton(container, 'Updated')?.disabled).toBe(false)
  })
})
