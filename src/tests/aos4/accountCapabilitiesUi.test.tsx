// @vitest-environment jsdom

import SavedArmiesModal from 'components/input/cloudArmies/savedArmiesModal'
import ShareArmyModal from 'components/input/armySharing/shareArmyModal'
import { createDefaultAos4ArmyDocument } from '../../aos4/runtime'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { Simulate } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const collection = vi.hoisted(() => ({
  armies: [] as unknown[],
  collectionError: null as string | null,
  collectionLoading: false,
  configured: true,
  createArmy: vi.fn(),
  createShare: vi.fn(),
  deleteArmy: vi.fn(),
  refreshArmies: vi.fn(),
  updateArmy: vi.fn(),
}))

vi.mock('context/useArmyCollection', () => ({
  useArmyCollection: () => collection,
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    theme: {
      bgColor: 'bg-white',
      cardBody: 'card-body',
      genericButton: 'btn btn-outline-dark',
      modalConfirmClass: 'btn btn-info',
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

const findButton = (container: HTMLElement, label: string): HTMLButtonElement => {
  const button = Array.from(container.querySelectorAll('button')).find(
    candidate => candidate.textContent?.trim() === label
  )
  if (!button) throw new Error(`Button "${label}" not found`)
  return button
}

describe('saved-army and sharing controls', () => {
  let container: HTMLDivElement
  const currentDocument = createDefaultAos4ArmyDocument()
  const savedDocument = { ...currentDocument, name: 'Saved Stormhost' }
  const remoteArmy = {
    id: 'cloud-1',
    createdAt: 1,
    updatedAt: 2,
    document: savedDocument,
  }

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    collection.armies = [remoteArmy]
    collection.collectionError = null
    collection.collectionLoading = false
    collection.configured = true
    collection.createArmy.mockReset()
    collection.createArmy.mockResolvedValue(remoteArmy)
    collection.createShare.mockReset()
    collection.createShare.mockResolvedValue({
      id: 'abcdefghijklmnopqrstuvwx',
      createdAt: 1,
      document: currentDocument,
      url: 'https://aosreminders.com/?army=abcdefghijklmnopqrstuvwx',
    })
    collection.deleteArmy.mockReset()
    collection.deleteArmy.mockResolvedValue(undefined)
    collection.refreshArmies.mockReset()
    collection.refreshArmies.mockResolvedValue(undefined)
    collection.updateArmy.mockReset()
    collection.updateArmy.mockResolvedValue(remoteArmy)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.restoreAllMocks()
  })

  it('saves explicitly, previews before load, and confirms delete', async () => {
    const closeModal = vi.fn()
    const onApply = vi.fn()
    act(() => {
      render(
        <SavedArmiesModal
          closeModal={closeModal}
          currentDocument={currentDocument}
          isOpen
          onApply={onApply}
        />,
        container
      )
    })

    const saveName = container.querySelector<HTMLInputElement>('#saved-army-name')!
    saveName.value = 'Tournament Army'
    act(() => Simulate.change(saveName))
    await act(async () => {
      findButton(container, 'Save new').click()
      await Promise.resolve()
    })
    expect(collection.createArmy).toHaveBeenCalledWith(expect.objectContaining({ name: 'Tournament Army' }))

    act(() => findButton(container, 'Load').click())
    expect(container.textContent).toContain('Replace the current army with Saved Stormhost?')
    act(() => findButton(container, 'Replace current army').click())
    expect(onApply).toHaveBeenLastCalledWith(savedDocument)

    act(() => findButton(container, 'Delete').click())
    await act(async () => {
      findButton(container, 'Confirm delete').click()
      await Promise.resolve()
    })
    expect(collection.deleteArmy).toHaveBeenCalledWith('cloud-1')
  })

  it('creates an opaque share link only after confirmation and copies it', async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) }
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard })
    act(() => {
      render(<ShareArmyModal closeModal={vi.fn()} document={currentDocument} isOpen />, container)
    })

    expect(collection.createShare).not.toHaveBeenCalled()
    await act(async () => {
      findButton(container, 'Create share link').click()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(collection.createShare).toHaveBeenCalledWith(currentDocument)
    expect(container.querySelector<HTMLInputElement>('#share-army-url')?.value).toContain('?army=')

    await act(async () => {
      findButton(container, 'Copy link').click()
      await Promise.resolve()
    })
    expect(clipboard.writeText).toHaveBeenCalledWith(
      'https://aosreminders.com/?army=abcdefghijklmnopqrstuvwx'
    )
    expect(container.textContent).toContain('Copied')
  })
})
