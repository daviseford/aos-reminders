// @vitest-environment jsdom

import ImportArmyModal from 'components/input/importArmy/importArmyModal'
import { useSubscriberAction } from 'components/input/importArmy/subscriberAction'
import { render, unmountComponentAtNode } from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import { MemoryRouter, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
}))
const subscription = vi.hoisted(() => ({
  isActive: false,
  subscriptionLoading: false,
}))
const login = vi.hoisted(() => vi.fn())

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

vi.mock('context/useSubscription', () => ({
  useSubscription: () => subscription,
}))

vi.mock('utils/hooks/useLogin', () => ({
  default: () => ({ isLoggingIn: false, login }),
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    theme: {
      bgColor: 'bg-white',
      dropzone: 'dropzone',
      genericButton: 'btn btn-outline-dark',
      modalConfirmClass: 'btn btn-outline-dark',
      modalDangerClass: 'btn btn-outline-danger',
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

const officialRoster = (unit = 'Annihilators', includeContext = true) => `Thunderhost 1000/1000 pts
Stormcast Eternals
Thunderhead Host
${includeContext ? "General's Handbook 2026-27" : ''}

REGIMENTS
Gardus Steel Soul (160)
${unit} (160)

Created with Warhammer Age of Sigmar: The App
App: 1.20.0 | Data: 345`

const rosterXml = `<?xml version="1.0" encoding="UTF-8"?>
<roster id="r1" name="Uploaded Stormhost" battleScribeVersion="2.03"
  gameSystemName="Age of Sigmar 4.0" xmlns="http://www.battlescribe.net/schema/rosterSchema">
  <forces>
    <force id="f1" name="General's Handbook 2026-27" catalogueName="Stormcast Eternals">
      <forces>
        <force id="f2" name="Regiment" catalogueName="Stormcast Eternals">
          <selections>
            <selection id="u1" name="Annihilators" number="1" type="unit" />
          </selections>
        </force>
      </forces>
    </force>
  </forces>
</roster>`

const findButton = (container: HTMLElement, label: string): HTMLButtonElement => {
  const button = Array.from(container.querySelectorAll('button')).find(
    candidate => candidate.textContent?.trim() === label
  )
  if (!button) throw new Error(`Button "${label}" not found`)
  return button
}

const SubscriberHarness = ({ onAuthorized }: { onAuthorized: () => void }) => {
  const action = useSubscriberAction({ onAuthorized, origin: 'ImportArmyTest' })
  return (
    <button disabled={action.disabled} onClick={action.run} type="button">
      Subscriber action
    </button>
  )
}

describe('subscriber import action', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    auth.isAuthenticated = false
    auth.isLoading = false
    subscription.isActive = false
    subscription.subscriptionLoading = false
    login.mockReset()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('opens login for signed-out users, Subscribe for inactive users, and the action for subscribers', () => {
    const onAuthorized = vi.fn()
    const renderHarness = () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <SubscriberHarness onAuthorized={onAuthorized} />
          <Route path="/subscribe">Subscribe destination</Route>
        </MemoryRouter>,
        container
      )

    act(() => {
      renderHarness()
    })
    act(() => {
      Simulate.click(container.querySelector('button')!)
    })
    expect(login).toHaveBeenCalledTimes(1)
    expect(onAuthorized).not.toHaveBeenCalled()

    auth.isAuthenticated = true
    act(() => {
      renderHarness()
    })
    act(() => {
      Simulate.click(container.querySelector('button')!)
    })
    expect(container.textContent).toContain('Subscribe destination')
    expect(onAuthorized).not.toHaveBeenCalled()

    act(() => {
      unmountComponentAtNode(container)
    })
    subscription.isActive = true
    act(() => {
      renderHarness()
    })
    act(() => {
      Simulate.click(container.querySelector('button')!)
    })
    expect(onAuthorized).toHaveBeenCalledTimes(1)
  })
})

describe('AoS 4 import modal', () => {
  let container: HTMLDivElement
  let onApply: ReturnType<typeof vi.fn>
  let closeModal: ReturnType<typeof vi.fn>

  const renderModal = () => {
    render(
      <ImportArmyModal
        closeModal={closeModal}
        createDocumentId={() => 'army:import-ui-test'}
        isOpen
        onApply={onApply}
      />,
      container
    )
  }

  const pasteAndPreview = (text: string) => {
    const textarea = container.querySelector('textarea')!
    textarea.value = text
    act(() => {
      Simulate.change(textarea)
    })
    act(() => {
      Simulate.click(findButton(container, 'Preview import'))
    })
  }

  beforeEach(() => {
    onApply = vi.fn()
    closeModal = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    act(() => {
      renderModal()
    })
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('previews and atomically applies a supported pasted roster with a fresh local document', () => {
    pasteAndPreview(officialRoster())

    expect(container.textContent).toContain('Warhammer Age of Sigmar app')
    expect(container.textContent).toContain('Stormcast Eternals')
    expect(container.textContent).toContain('Thunderhead Host')
    const apply = findButton(container, 'Import Army')
    expect(apply.disabled).toBe(false)

    act(() => {
      Simulate.click(apply)
    })

    expect(onApply).toHaveBeenCalledTimes(1)
    expect(onApply.mock.calls[0][0]).toMatchObject({
      id: 'army:import-ui-test',
      name: 'Thunderhost',
      reminderPreferences: {},
    })
    expect(onApply.mock.calls[0][0].explicitSelectionIds.length).toBeGreaterThan(1)
  })

  /**
   * A name we cannot place is shown and skipped, not treated as a dead end. The player came from a
   * builder where the unit exists, so the useful outcome is the rest of the army plus a note about
   * what was dropped.
   */
  it('stays confirmable when a selection cannot be placed, and names it', () => {
    pasteAndPreview(officialRoster('Annihilators', false))

    expect(container.textContent).toContain('No rules context was declared')
    expect(findButton(container, 'Import Army').disabled).toBe(false)

    pasteAndPreview(officialRoster('Definitely Unknown Unit'))

    expect(container.textContent).toContain('Definitely Unknown Unit')
    expect(findButton(container, 'Import Army').disabled).toBe(false)

    act(() => {
      Simulate.click(findButton(container, 'Import Army'))
    })
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('previews a native .ros upload locally', async () => {
    act(() => {
      Simulate.click(findButton(container, 'Upload .ros/.rosz'))
    })
    const file = new File([rosterXml], 'stormhost.ros', { type: 'application/xml' })
    Object.defineProperty(file, 'arrayBuffer', {
      value: async () => new TextEncoder().encode(rosterXml).buffer,
    })
    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    Object.defineProperty(input, 'files', { configurable: true, value: [file] })

    await act(async () => {
      Simulate.change(input)
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(container.textContent).toContain('New Recruit roster file')
    expect(container.textContent).toContain('Uploaded Stormhost')
    expect(findButton(container, 'Import Army').disabled).toBe(false)
  })

  it('cancels without applying or persisting the raw roster', () => {
    pasteAndPreview(officialRoster())
    act(() => {
      Simulate.click(findButton(container, 'Cancel'))
    })

    expect(closeModal).toHaveBeenCalledTimes(1)
    expect(onApply).not.toHaveBeenCalled()
  })
})
