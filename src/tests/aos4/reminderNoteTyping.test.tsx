// @vitest-environment jsdom

import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import { createAos4ArmyDocument, serializeAos4ArmyDocument } from '../../aos4/state'
import Home from 'components/routes/Home'
// Loaded statically, as in homeBuilderMemo.test.tsx: the corpus parse belongs in module evaluation.
import 'components/routes/HomeCatalogBound'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { type ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { createTestRoot, render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
 * #2105: the army stores notes trimmed, and the note box used to show that stored value, so a space
 * typed at the end vanished before the next key and "a b" typed key by key became "ab". The box now
 * keeps what the player typed; the stored form (trimmed, blank notes removed) is unchanged.
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

const named = (kind: string, name: string) =>
  AOS4_CATALOG.entities.find(entity => entity.kind === kind && entity.name === name)!

const fixtureDocument = () =>
  createAos4ArmyDocument({
    id: 'army:note-typing',
    name: 'Note Typing',
    rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
    explicitSelectionIds: [named('faction', 'Fyreslayers').id, named('content-group', 'Gotrek Gurnisson').id],
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

const storedNotes = () =>
  Object.values(
    JSON.parse(window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)!).reminderPreferences as Record<
      string,
      { note?: string }
    >
  ).flatMap(preference => (preference.note === undefined ? [] : [preference.note]))

describe('typing a reminder note (#2105)', () => {
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

  const firstReminderName = () =>
    root.container
      .querySelector<HTMLButtonElement>('[aria-label^="Options for "]')!
      .getAttribute('aria-label')!
      .replace('Options for ', '')

  const menuItems = async (reminderName: string) => {
    const toggle = root.container.querySelector<HTMLButtonElement>(
      `[aria-label="Options for ${reminderName}"]`
    )
    expect(toggle, 'no reminder options menu').not.toBeNull()
    await root.act(async () => {
      toggle!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    return Array.from(root.container.querySelectorAll<HTMLElement>('.dropdown-item')).map(
      item => item.textContent?.trim() ?? ''
    )
  }

  const chooseMenuItem = async (reminderName: string, label: string) => {
    expect(await menuItems(reminderName)).toContain(label)
    const item = Array.from(root.container.querySelectorAll<HTMLElement>('.dropdown-item')).find(
      candidate => candidate.textContent?.trim() === label
    )!
    await root.act(async () => {
      item.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
  }

  const noteField = (reminderName: string) =>
    root.container.querySelector<HTMLTextAreaElement>(`textarea[aria-label="Note for ${reminderName}"]`)!

  const setFieldValue = async (field: HTMLTextAreaElement, value: string) => {
    const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!
    await root.act(async () => {
      setValue.call(field, value)
      field.dispatchEvent(new Event('input', { bubbles: true }))
    })
  }

  // One keystroke at a time, each appended to whatever the box shows after the previous one.
  const typeInto = async (field: HTMLTextAreaElement, text: string) => {
    for (const key of text) {
      await root.act(async () => {
        field.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
      await setFieldValue(field, field.value + key)
      await root.act(async () => {
        field.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }))
      })
    }
  }

  const noteText = () => root.container.querySelector('.NoteText')?.textContent

  it('keeps a space typed key by key, and the saved note survives a reload', async () => {
    await renderHome()
    const reminderName = firstReminderName()
    await chooseMenuItem(reminderName, 'Add note')
    const field = noteField(reminderName)

    await typeInto(field, 'a ')
    // Mid-edit the box keeps the trailing space; the army stores the note trimmed, as before.
    expect(field.value).toBe('a ')
    expect(storedNotes()).toEqual(['a'])

    await typeInto(field, 'b')
    expect(field.value).toBe('a b')
    expect(noteText()).toBe('a b')
    expect(storedNotes()).toEqual(['a b'])

    await typeInto(field, ' charge first')
    expect(field.value).toBe('a b charge first')
    expect(storedNotes()).toEqual(['a b charge first'])

    // Reload: a fresh mount reads the army back from storage.
    await root.act(async () => {
      unmountComponentAtNode(root.container)
    })
    await renderHome()
    expect(noteText()).toBe('a b charge first')
    await chooseMenuItem(reminderName, 'Edit note')
    expect(noteField(reminderName).value).toBe('a b charge first')
  }, 30_000)

  it('removes a cleared or whitespace-only note, as before', async () => {
    await renderHome()
    const reminderName = firstReminderName()
    await chooseMenuItem(reminderName, 'Add note')
    const field = noteField(reminderName)

    await typeInto(field, 'x')
    expect(storedNotes()).toEqual(['x'])

    // Deleting the last character removes the note.
    await setFieldValue(field, '')
    expect(field.value).toBe('')
    expect(noteText()).toBeUndefined()
    expect(storedNotes()).toEqual([])
    expect(await menuItems(reminderName)).toContain('Add note')
    await root.act(async () => {
      root.container
        .querySelector<HTMLButtonElement>(`[aria-label="Options for ${reminderName}"]`)!
        .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    // Spaces alone stay in the box while typing but never become a note.
    await typeInto(field, '  ')
    expect(field.value).toBe('  ')
    expect(noteText()).toBeUndefined()
    expect(storedNotes()).toEqual([])

    // Words typed after the spaces keep the leading spaces in the box; the stored note is trimmed.
    await typeInto(field, 'go')
    expect(field.value).toBe('  go')
    expect(noteText()).toBe('go')
    expect(storedNotes()).toEqual(['go'])
  }, 30_000)
})
