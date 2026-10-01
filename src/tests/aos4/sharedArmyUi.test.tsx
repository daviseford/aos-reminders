// @vitest-environment jsdom

import SharedArmyModal from 'components/input/armySharing/sharedArmyModal'
import { ArmyApiError, ArmyRequiresUpdateError } from '../../api/armyApi'
import type { RulesContextId } from '../../aos4/domain'
import { createDefaultAos4ArmyDocument } from '../../aos4/runtime'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const armyApi = vi.hoisted(() => ({
  getShare: vi.fn(),
}))

vi.mock('../../api/armyApi', async () => {
  const actual = await vi.importActual<typeof import('../../api/armyApi')>('../../api/armyApi')
  return {
    ArmyApi: armyApi,
    ArmyApiError: actual.ArmyApiError,
    ArmyRequiresUpdateError: actual.ArmyRequiresUpdateError,
  }
})

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

  /*
   * Import is how most rosters arrive and share is its sibling, so the two say the same things in
   * the same words. This preview used to read "Rules context" and a raw "Selections" count taken
   * straight off `explicitSelectionIds.length` — an internal field name, and a number that counts
   * the faction and battle formation alongside the units.
   */
  it('describes the share in the words the import preview uses', async () => {
    armyApi.getShare.mockResolvedValue({
      id: 'abcdefghijklmnopqrstuvwx',
      createdAt: 1,
      document: { ...createDefaultAos4ArmyDocument(), name: 'Shared Stormhost' },
    })

    await act(async () => {
      render(
        <SharedArmyModal closeModal={vi.fn()} isOpen onApply={vi.fn()} shareId="abcdefghijklmnopqrstuvwx" />,
        container
      )
      await Promise.resolve()
      await Promise.resolve()
    })

    const labels = Array.from(container.querySelectorAll('dt')).map(term => term.textContent)
    expect(labels).toEqual(['Faction', 'Units', 'Ruleset'])
    expect(container.textContent).not.toContain('Selections')
    expect(container.textContent).not.toContain('Rules context')
  })

  /*
   * "Load a copy" replaces the army on screen and is the only control here that commits; "Keep
   * current army" is the reversible way out. The pair used to render `modalSuccessClass` beside
   * `modalDangerClass` — green-or-outline-green against red — so the escape was the loudest control
   * in the modal in dark theme, and the commit changed weight between themes.
   */
  it('gives the commit the only fill and leaves the way out reversible', async () => {
    armyApi.getShare.mockResolvedValue({
      id: 'abcdefghijklmnopqrstuvwx',
      createdAt: 1,
      document: { ...createDefaultAos4ArmyDocument(), name: 'Shared Stormhost' },
    })

    await act(async () => {
      render(
        <SharedArmyModal closeModal={vi.fn()} isOpen onApply={vi.fn()} shareId="abcdefghijklmnopqrstuvwx" />,
        container
      )
      await Promise.resolve()
      await Promise.resolve()
    })

    const byLabel = (label: string) =>
      Array.from(container.querySelectorAll('button')).find(
        candidate => candidate.textContent?.trim() === label
      )

    expect(byLabel('Load a copy')?.className).toContain('btn-primary')
    expect(byLabel('Keep current army')?.className).toContain('btn-outline-dark')
    expect(byLabel('Keep current army')?.className).not.toContain('btn-danger')
  })
  const renderShare = async () => {
    const closeModal = vi.fn()
    const onApply = vi.fn()
    await act(async () => {
      render(
        <SharedArmyModal
          closeModal={closeModal}
          isOpen
          onApply={onApply}
          shareId="abcdefghijklmnopqrstuvwx"
        />,
        container
      )
      await Promise.resolve()
      await Promise.resolve()
    })
    const loadButton = Array.from(container.querySelectorAll('button')).find(
      candidate => candidate.textContent?.trim() === 'Load a copy'
    )
    return { closeModal, loadButton, onApply }
  }

  /*
   * A share saved by a newer release (#2055) is not broken, and neither is the link: the fix is an
   * update. A generic red failure told the player nothing they could act on.
   */
  it('asks for an update, not a generic failure, when the share uses rules this version lacks', async () => {
    armyApi.getShare.mockRejectedValue(
      new ArmyRequiresUpdateError(
        'unused',
        'rules-context:90000000-0000-4000-8000-00000000ffff' as RulesContextId
      )
    )

    const { closeModal, loadButton, onApply } = await renderShare()

    const alert = container.querySelector('[role="alert"]')
    expect(alert?.className).toContain('alert-warning')
    expect(alert?.textContent).toContain('need a newer version of AoS Reminders')
    // Conditional, because a rolled-back deploy has no newer version for a refresh to install.
    expect(alert?.textContent).toContain('if an update is available')
    expect(container.querySelector('.alert-danger')).toBeNull()
    expect(loadButton?.disabled).toBe(true)
    // Nothing dismissed the share, so the id survives for the refresh to reopen it.
    expect(closeModal).not.toHaveBeenCalled()
    expect(onApply).not.toHaveBeenCalled()
  })

  it('still shows the service error for any other failure', async () => {
    armyApi.getShare.mockRejectedValue(
      new ArmyApiError('The service returned an incompatible army document.', 502)
    )

    const { loadButton } = await renderShare()

    const alert = container.querySelector('[role="alert"]')
    expect(alert?.className).toContain('alert-danger')
    expect(alert?.textContent).toBe('The service returned an incompatible army document.')
    expect(container.textContent).not.toContain('newer version')
    expect(loadButton?.disabled).toBe(true)
  })
})
