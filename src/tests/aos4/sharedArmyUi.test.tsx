// @vitest-environment jsdom

import SharedArmyModal from 'components/input/armySharing/sharedArmyModal'
import { createDefaultAos4ArmyDocument } from '../../aos4/runtime'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const armyApi = vi.hoisted(() => ({
  getShare: vi.fn(),
}))

vi.mock('../../api/armyApi', () => ({
  ArmyApi: armyApi,
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: {
      modalDangerClass: 'btn btn-danger',
      modalSuccessClass: 'btn btn-success',
      text: 'text-dark',
    },
  }),
}))

vi.mock('components/modals/generic/generic_modal', () => ({
  default: ({ children, isOpen, label }: React.PropsWithChildren<{ isOpen: boolean; label: string }>) =>
    isOpen ? (
      <div aria-label={label} role="dialog">
        {children}
      </div>
    ) : null,
}))

describe('shared army preview', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    armyApi.getShare.mockReset()
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('previews a public share and loads it under a fresh local identity', async () => {
    const sharedDocument = {
      ...createDefaultAos4ArmyDocument(),
      id: 'army:remote-owner-id',
      name: 'Shared Stormhost',
    }
    armyApi.getShare.mockResolvedValue({
      id: 'abcdefghijklmnopqrstuvwx',
      createdAt: 1,
      document: sharedDocument,
    })
    const closeModal = vi.fn()
    const onApply = vi.fn()

    await act(async () => {
      render(
        <SharedArmyModal
          closeModal={closeModal}
          createDocumentId={() => 'army:fresh-local-id'}
          isOpen
          onApply={onApply}
          shareId="abcdefghijklmnopqrstuvwx"
        />,
        container
      )
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(armyApi.getShare).toHaveBeenCalledWith('abcdefghijklmnopqrstuvwx')
    expect(container.textContent).toContain('Shared Stormhost')
    expect(onApply).not.toHaveBeenCalled()

    act(() => {
      const button = Array.from(container.querySelectorAll('button')).find(
        candidate => candidate.textContent?.trim() === 'Load a copy'
      )
      button?.click()
    })

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'army:fresh-local-id',
        name: 'Shared Stormhost',
      })
    )
    expect(closeModal).toHaveBeenCalledTimes(1)
  })
})
