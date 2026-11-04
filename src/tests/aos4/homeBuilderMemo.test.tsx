// @vitest-environment jsdom

import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import { createAos4ArmyDocument, serializeAos4ArmyDocument, type Aos4ArmyDocument } from '../../aos4/state'
import * as view from '../../aos4/view'
import Home from 'components/routes/Home'
// Loaded statically, as in keptRegimentHome.test.tsx: the corpus parse belongs in module evaluation.
import HomeCatalogBound from 'components/routes/HomeCatalogBound'
import { AppStatusProvider } from 'context/useAppStatus'
import { ArmyCollectionProvider } from 'context/useArmyCollection'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { MemoryRouter } from 'react-router'
import { createTestRoot, render } from 'tests/support/reactTestHelpers'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * The builder view model resolves the whole selection graph three times, so Home rebuilds it only
 * when something it reads changes: reminder-only edits (note keystrokes, hide, reorder) reuse it,
 * while every other document change still rebuilds it.
 */

vi.mock('@auth0/auth0-react', async () => {
  const { auth0DisabledMockValue } = await import('tests/support/homeTestMocks')
  const auth = auth0DisabledMockValue()
  return { useAuth0: () => auth }
})

vi.mock('../../api/subscriptionApi', async () => {
  const { subscriptionApiNotFoundMockValue } = await import('tests/support/homeTestMocks')
  return { SubscriptionApi: subscriptionApiNotFoundMockValue() }
})

vi.mock('virtual:pwa-register', async () => {
  const { pwaRegisterMockValue } = await import('tests/support/homeTestMocks')
  return pwaRegisterMockValue()
})

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return { ...actual, useNavigate: () => vi.fn() }
})

vi.mock('../../aos4/view', async () => {
  const actual = await vi.importActual<typeof import('../../aos4/view')>('../../aos4/view')
  return {
    ...actual,
    createAos4BuilderViewModel: vi.fn(actual.createAos4BuilderViewModel),
    createAos4ReminderViewModel: vi.fn(actual.createAos4ReminderViewModel),
  }
})

const builderCalls = () => vi.mocked(view.createAos4BuilderViewModel).mock.calls.length
const reminderCalls = () => vi.mocked(view.createAos4ReminderViewModel).mock.calls.length

const named = (kind: string, name: string) =>
  AOS4_CATALOG.entities.find(entity => entity.kind === kind && entity.name === name)!
const fyreslayers = named('faction', 'Fyreslayers')
const gotrek = named('content-group', 'Gotrek Gurnisson')
// Khazalite Holds has its own Lofnir Drothkeepers: take the one Fyreslayers offers.
const lofnirDrothkeepers = AOS4_CATALOG.entities.find(
  entity =>
    entity.name === 'Lofnir Drothkeepers' &&
    AOS4_CATALOG.relationships.some(
      relationship =>
        relationship.kind === 'offers' && relationship.from === fyreslayers.id && relationship.to === entity.id
    )
)!
const otherContextId = AOS4_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!.id

const fixtureDocument = (overrides: Partial<Aos4ArmyDocument> = {}) =>
  createAos4ArmyDocument({
    id: 'army:builder-memo',
    name: 'Builder Memo',
    rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
    explicitSelectionIds: [fyreslayers.id, gotrek.id],
    ...overrides,
  })

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

const Providers = ({ children }: { children: ReactNode }) => (
  <AppStatusProvider>
    <SubscriptionProvider>
      <ThemeProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </SubscriptionProvider>
  </AppStatusProvider>
)

describe('Home rebuilds the builder only when its inputs change', () => {
  let root: ReturnType<typeof createTestRoot>

  const settle = async () => {
    for (let round = 0; round < 3; round += 1) {
      await root.act(async () => {
        await flush()
      })
    }
  }

  beforeEach(({ signal }) => {
    root = createTestRoot(signal)
    Object.defineProperty(window, 'localStorage', { configurable: true, value: new MemoryStorage() })
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: new MemoryStorage() })
    window.localStorage.setItem(AOS4_ARMY_STORAGE_KEY, serializeAos4ArmyDocument(fixtureDocument()))
  })

  afterEach(() => root.cleanup())

  const openMenuItem = async (label: string) => {
    const toggle = root.container.querySelector<HTMLButtonElement>('[aria-label^="Options for "]')
    expect(toggle, 'no reminder options menu').not.toBeNull()
    await root.act(async () => {
      toggle!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    const item = Array.from(root.container.querySelectorAll<HTMLElement>('.dropdown-item')).find(
      candidate => candidate.textContent?.trim() === label
    )
    expect(item, `no "${label}" menu item`).not.toBeUndefined()
    await root.act(async () => {
      item!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    return toggle!.getAttribute('aria-label')!.replace('Options for ', '')
  }

  // One keystroke at a time, the way a browser delivers them: keydown, the value change, input, keyup.
  const typeInto = async (field: HTMLTextAreaElement, text: string) => {
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!
    for (const key of text) {
      await root.act(async () => {
        field.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
        setValue.call(field, field.value + key)
        field.dispatchEvent(new Event('input', { bubbles: true }))
        field.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
      })
    }
  }

  const renderHome = async () => {
    await root.act(async () => {
      render(
        <Providers>
          <Home />
        </Providers>,
        root.container
      )
    })
    await settle()
  }

  it('keeps the builder across note typing and hiding, with focus and every character intact', async () => {
    await renderHome()
    const builderBefore = builderCalls()
    const remindersBefore = reminderCalls()

    const reminderName = await openMenuItem('Add note')
    const field = root.container.querySelector<HTMLTextAreaElement>(
      `textarea[aria-label="Note for ${reminderName}"]`
    )!
    expect(field).not.toBeNull()
    field.focus()
    // No spaces: the document trims notes on every change, so a trailing space never survives a
    // keystroke (unchanged by this memo, base behaves the same).
    await typeInto(field, 'Charge-first!')

    expect(window.document.activeElement).toBe(field)
    expect(field.value).toBe('Charge-first!')
    expect(root.container.querySelector('.NoteText')?.textContent).toBe('Charge-first!')
    expect(
      Object.values(JSON.parse(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)!).reminderPreferences)
    ).toContainEqual(expect.objectContaining({ note: 'Charge-first!' }))

    await openMenuItem('Hide rule')
    const toggle = root.container.querySelector<HTMLButtonElement>(`[aria-label="Options for ${reminderName}"]`)!
    await root.act(async () => {
      toggle.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    expect(root.container.textContent).toContain('Show rule')

    // Reminders kept updating (one view model per keystroke and per hide); the builder did not.
    expect(reminderCalls() - remindersBefore).toBeGreaterThanOrEqual('Charge-first!'.length + 1)
    expect(builderCalls()).toBe(builderBefore)
  }, 30_000)

  it('rebuilds the builder when an Army of Renown is picked from the masthead', async () => {
    await renderHome()
    const before = builderCalls()

    const input = root.container.querySelector<HTMLInputElement>('input[aria-label="Army of Renown"]')!
    await root.act(async () => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }))
      await flush()
    })
    const option = Array.from(root.container.querySelectorAll('[role="option"]')).find(
      candidate => candidate.textContent?.trim() === 'Lofnir Drothkeepers'
    )!
    await root.act(async () => {
      option.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    await settle()

    expect(builderCalls()).toBeGreaterThan(before)
    expect(vi.mocked(view.createAos4BuilderViewModel).mock.lastCall?.[1].explicitSelectionIds).toContain(
      lofnirDrothkeepers.id
    )
  })

  describe('for every document change the shell can hand it', () => {
    let setDocument: Dispatch<SetStateAction<Aos4ArmyDocument>>

    const Harness = () => {
      const [document, setHarnessDocument] = useState(fixtureDocument)
      setDocument = setHarnessDocument
      return (
        <HomeCatalogBound
          document={document}
          factionId={fyreslayers.id as never}
          isGameMode={false}
          onBindingsChange={() => undefined}
          onDismissPendingShare={() => undefined}
          onDocumentChange={setHarnessDocument}
          onDocumentValidated={() => undefined}
          pendingShareId={undefined}
        />
      )
    }

    const change = async (next: (current: Aos4ArmyDocument) => Aos4ArmyDocument) => {
      const before = builderCalls()
      await root.act(async () => {
        setDocument(next)
      })
      await settle()
      return builderCalls() - before
    }

    beforeEach(async () => {
      await root.act(async () => {
        render(
          <Providers>
            <ArmyCollectionProvider>
              <Harness />
            </ArmyCollectionProvider>
          </Providers>,
          root.container
        )
      })
      await settle()
    })

    it('reuses the builder for reminder preferences and value-identical replacements', async () => {
      const reminderId = 'reminder:any' as never
      expect(
        await change(current =>
          createAos4ArmyDocument({ ...current, reminderPreferences: { [reminderId]: { note: 'n' } } })
        )
      ).toBe(0)
      expect(
        await change(current =>
          createAos4ArmyDocument({ ...current, reminderPreferences: { [reminderId]: { hidden: true } } })
        )
      ).toBe(0)
      // The shape reorderReminders writes.
      expect(
        await change(current =>
          createAos4ArmyDocument({ ...current, reminderPreferences: { [reminderId]: { order: 3 } } })
        )
      ).toBe(0)
      // A fresh document with fresh arrays but the same values, as every document build makes.
      expect(await change(current => createAos4ArmyDocument({ ...current }))).toBe(0)
    })

    it.each<[string, (current: Aos4ArmyDocument) => Aos4ArmyDocument]>([
      ['unpick', current => fixtureDocument({ ...current, explicitSelectionIds: [fyreslayers.id] })],
      ['rename', current => fixtureDocument({ ...current, name: 'Renamed' })],
      ['new army id', current => fixtureDocument({ ...current, id: 'army:replaced' })],
      ['rules context', current => fixtureDocument({ ...current, rulesContextId: otherContextId })],
      ['Legends', current => fixtureDocument({ ...current, allowsLegends: true })],
      ['historical', current => fixtureDocument({ ...current, allowsHistorical: true })],
      [
        'enhancement bearer',
        current => fixtureDocument({ ...current, enhancementBearers: { [gotrek.id]: fyreslayers.id } }),
      ],
      [
        'document replacement',
        () =>
          fixtureDocument({
            id: 'army:loaded',
            name: 'Loaded',
            explicitSelectionIds: [fyreslayers.id],
            reminderPreferences: {},
          }),
      ],
    ])('rebuilds the builder on %s', async (_label, next) => {
      expect(otherContextId).not.toBe(AOS4_DEFAULT_RULES_CONTEXT_ID)
      expect(await change(next)).toBeGreaterThan(0)
      const [, document] = vi.mocked(view.createAos4BuilderViewModel).mock.lastCall!
      const expected = next(fixtureDocument())
      expect({ ...document, reminderPreferences: {} }).toEqual({ ...expected, reminderPreferences: {} })
    })
  })
})
