// @vitest-environment jsdom

import SaveArmyModal from 'components/input/cloudArmies/saveArmyModal'
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
    isDark: false,
    theme: {
      bgColor: 'bg-white',
      cardBody: 'card-body',
      commitButton: 'btn btn-primary',
      destructiveButton: 'btn btn-danger',
      genericButton: 'btn btn-outline-dark',
      text: 'text-dark',
      textMuted: 'text-muted',
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

const queryButton = (container: HTMLElement, label: string) =>
  Array.from(container.querySelectorAll('button')).find(candidate => candidate.textContent?.trim() === label)

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
  const otherArmy = {
    id: 'cloud-2',
    createdAt: 1,
    updatedAt: 3,
    document: { ...currentDocument, name: 'Kruleboyz Tourney' },
  }

  const rows = () => Array.from(container.querySelectorAll<HTMLLIElement>('li.list-group-item'))

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

  const renderSavedArmies = (props: Partial<React.ComponentProps<typeof SavedArmiesModal>> = {}) => {
    const handlers = {
      closeModal: vi.fn(),
      onApply: vi.fn(),
      onDeleted: vi.fn(),
      onLinked: vi.fn(),
    }
    act(() => {
      render(<SavedArmiesModal isOpen {...handlers} {...props} />, container)
    })
    return handlers
  }

  it('confirms a load inside the row that raised it, and never prints a canonical id', () => {
    const { closeModal, onApply, onLinked } = renderSavedArmies()

    const [row] = rows()
    act(() => findButton(row, 'Load').click())

    /*
     * The structural guard, not a cosmetic one. The confirmation used to render after the whole
     * list, where with eight saved armies it landed hundreds of pixels below the visible modal and
     * "Load" appeared to do nothing at all.
     */
    const confirm = findButton(container, 'Load this army')
    expect(row.contains(confirm)).toBe(true)
    expect(row.textContent).toContain('Load Saved Stormhost?')
    expect(container.textContent).not.toContain('rules-context:')

    act(() => confirm.click())
    expect(onApply).toHaveBeenLastCalledWith(savedDocument)
    // The document travels with the link so the caller can record it as the saved baseline.
    expect(onLinked).toHaveBeenLastCalledWith('cloud-1', 'Saved Stormhost', savedDocument)
    expect(closeModal).toHaveBeenCalled()
  })

  it('offers no way to overwrite a saved army from the list', () => {
    renderSavedArmies()

    /*
     * Removed deliberately. It answered a question nobody asks — "overwrite that saved army with
     * this different one" — while being the only unrecoverable action in the modal. Updating the
     * army you are actually working on is the toolbar's Update Army, which now has a durable and
     * named target; overwriting a same-named army is offered by Save Army where it is unambiguous.
     */
    const [row] = rows()
    expect(queryButton(row, 'Replace with current')).toBeUndefined()
    expect(row.textContent).not.toContain('Replace')
    expect(collection.updateArmy).not.toHaveBeenCalled()
  })

  it('confirms a delete in place and names what is being deleted', async () => {
    const { onDeleted } = renderSavedArmies()

    const [row] = rows()
    act(() => findButton(row, 'Delete').click())
    expect(collection.deleteArmy).not.toHaveBeenCalled()
    expect(row.textContent).toContain('Delete Saved Stormhost?')

    await act(async () => {
      findButton(container, 'Delete this army').click()
      await Promise.resolve()
    })
    expect(collection.deleteArmy).toHaveBeenCalledWith('cloud-1')
    expect(onDeleted).toHaveBeenCalledWith('cloud-1')
  })

  it('renames through an explicit edit, and refuses a rename that changes nothing', async () => {
    renderSavedArmies()

    const [row] = rows()
    act(() => findButton(row, 'Rename').click())

    const input = container.querySelector<HTMLInputElement>('#army-name-cloud-1')!
    expect(input.value).toBe('Saved Stormhost')
    // Unchanged, so there is nothing to save — the previous version reported success for a no-op.
    expect(findButton(container, 'Save name').disabled).toBe(true)

    input.value = 'Grand Alliance Order'
    act(() => Simulate.change(input))
    expect(findButton(container, 'Save name').disabled).toBe(false)

    await act(async () => {
      Simulate.submit(container.querySelector('form')!)
      await Promise.resolve()
    })
    expect(collection.updateArmy).toHaveBeenCalledWith(
      'cloud-1',
      expect.objectContaining({ name: 'Grand Alliance Order' })
    )
  })

  it('keeps one decision open at a time across rows', () => {
    collection.armies = [remoteArmy, otherArmy]
    renderSavedArmies()

    const [first, second] = rows()
    act(() => findButton(first, 'Delete').click())
    expect(queryButton(container, 'Delete this army')).toBeTruthy()

    act(() => findButton(second, 'Load').click())
    expect(queryButton(container, 'Delete this army')).toBeUndefined()
    expect(second.contains(findButton(container, 'Load this army'))).toBe(true)
  })

  it('marks the army the on-screen document came from', () => {
    collection.armies = [remoteArmy, otherArmy]
    renderSavedArmies({ linkedCloudArmyId: 'cloud-2' })

    const [first, second] = rows()
    expect(first.textContent).not.toContain('On screen now')
    expect(second.textContent).toContain('On screen now')
  })

  it('offers no way to create an army from the list, and guides an empty account to the toolbar', () => {
    collection.armies = []
    renderSavedArmies()

    expect(container.querySelector('#saved-army-name')).toBeNull()
    expect(queryButton(container, 'Save new')).toBeUndefined()
    expect(container.textContent).toContain('No armies saved yet')
    expect(container.textContent).toContain('Save Army')
  })

  it('saves the current army from the dedicated Save Army dialog and links the result by name', async () => {
    const closeModal = vi.fn()
    const onSaved = vi.fn()
    collection.createArmy.mockResolvedValue({ ...remoteArmy, id: 'cloud-9' })
    act(() => {
      render(
        <SaveArmyModal closeModal={closeModal} currentDocument={currentDocument} isOpen onSaved={onSaved} />,
        container
      )
    })

    const nameInput = container.querySelector<HTMLInputElement>('#save-army-name')!
    nameInput.value = 'Tournament Army'
    act(() => Simulate.change(nameInput))
    // Submitting the form, because a phone keyboard's "Go" has to reach the same action as the button.
    await act(async () => {
      Simulate.submit(container.querySelector('form')!)
      await Promise.resolve()
    })

    expect(collection.createArmy).toHaveBeenCalledWith(expect.objectContaining({ name: 'Tournament Army' }))
    expect(onSaved).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Tournament Army' }),
      'cloud-9',
      'Tournament Army'
    )
    expect(closeModal).toHaveBeenCalled()
  })

  it('warns when the name is already taken and offers to overwrite that army instead', async () => {
    const onSaved = vi.fn()
    act(() => {
      render(
        <SaveArmyModal closeModal={vi.fn()} currentDocument={currentDocument} isOpen onSaved={onSaved} />,
        container
      )
    })

    expect(queryButton(container, 'Overwrite it instead')).toBeUndefined()

    const nameInput = container.querySelector<HTMLInputElement>('#save-army-name')!
    nameInput.value = 'Saved Stormhost'
    act(() => Simulate.change(nameInput))
    expect(container.textContent).toContain('You already have a saved army called')

    await act(async () => {
      findButton(container, 'Overwrite it instead').click()
      await Promise.resolve()
    })
    expect(collection.createArmy).not.toHaveBeenCalled()
    expect(collection.updateArmy).toHaveBeenCalledWith(
      'cloud-1',
      expect.objectContaining({ name: 'Saved Stormhost' })
    )
  })

  it('keeps the Save Army dialog open and shows the service error when saving fails', async () => {
    const closeModal = vi.fn()
    const onSaved = vi.fn()
    collection.createArmy.mockRejectedValue(new Error('Cloud armies are temporarily unavailable.'))
    act(() => {
      render(
        <SaveArmyModal closeModal={closeModal} currentDocument={currentDocument} isOpen onSaved={onSaved} />,
        container
      )
    })

    await act(async () => {
      findButton(container, 'Save').click()
      await Promise.resolve()
    })

    expect(onSaved).not.toHaveBeenCalled()
    expect(closeModal).not.toHaveBeenCalled()
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

  it('copies the share link from the field itself and from the icon beside it', async () => {
    const clipboard = { writeText: vi.fn().mockResolvedValue(undefined) }
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard })
    act(() => {
      render(<ShareArmyModal closeModal={vi.fn()} document={currentDocument} isOpen />, container)
    })
    await act(async () => {
      findButton(container, 'Create share link').click()
      await Promise.resolve()
      await Promise.resolve()
    })

    // Icon-only, so it is found by its accessible name rather than its text.
    const iconButton = container.querySelector<HTMLButtonElement>('button[aria-label="Copy share link"]')
    expect(iconButton).not.toBeNull()

    const field = container.querySelector<HTMLInputElement>('#share-army-url')!
    await act(async () => {
      Simulate.click(field)
      await Promise.resolve()
    })
    expect(clipboard.writeText).toHaveBeenCalledTimes(1)
    // The name follows the state, so the confirmation reaches a screen reader too.
    expect(iconButton!.getAttribute('aria-label')).toBe('Share link copied')

    await act(async () => {
      iconButton!.click()
      await Promise.resolve()
    })
    expect(clipboard.writeText).toHaveBeenCalledTimes(2)
    expect(clipboard.writeText).toHaveBeenLastCalledWith(
      'https://aosreminders.com/?army=abcdefghijklmnopqrstuvwx'
    )
    expect(container.textContent).toContain('Link copied to your clipboard.')
  })

  it('tells the player to copy by hand when the browser blocks the clipboard', async () => {
    const clipboard = { writeText: vi.fn().mockRejectedValue(new Error('denied')) }
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard })
    act(() => {
      render(<ShareArmyModal closeModal={vi.fn()} document={currentDocument} isOpen />, container)
    })
    await act(async () => {
      findButton(container, 'Create share link').click()
      await Promise.resolve()
      await Promise.resolve()
    })

    await act(async () => {
      findButton(container, 'Copy link').click()
      await Promise.resolve()
    })
    // The Clipboard API needs a secure context, which a venue's captive portal will not give.
    expect(container.textContent).toContain('copy it yourself')
    expect(container.textContent).not.toContain('Copied')
  })
})
