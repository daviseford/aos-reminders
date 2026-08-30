// @vitest-environment jsdom

import Home from 'components/routes/Home'
/*
 * Home's catalog-bound half is behind `lazy()`, and resolving it means parsing the whole rules
 * corpus — seconds, not a flush. Loading it statically here puts that cost in module evaluation
 * where no per-test timeout applies, so the awaits below are about React and not about JSON.
 */
import 'components/routes/HomeCatalogBound'
import type { ContentGroup, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY } from '../../aos4/runtime'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocumentStructure,
  serializeAos4ArmyDocument,
} from '../../aos4/state'
import { AppStatusProvider } from 'context/useAppStatus'
import { ThemeProvider } from 'context/useTheme'
import { SubscriptionProvider } from 'context/useSubscription'
import React from 'react'
import { render, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { act } from 'react'
import { MemoryStorage } from 'tests/support/memoryStorage'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  getAccessTokenSilently: vi.fn(),
  loginWithPopup: vi.fn(),
  logout: vi.fn(),
  user: undefined as { email: string } | undefined,
}))
const getSubscription = vi.hoisted(() => vi.fn())

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => auth,
}))

/*
 * Home's banner slot renders the update prompt, which reaches `applyWaitingUpdate` in
 * bootstrap/registerServiceWorker and through it the plugin's `virtual:pwa-register`. That virtual
 * module has no resolvable file on disk, so the test runner cannot import it — stub it the same way
 * homePresentation.test.tsx does.
 */
vi.mock('virtual:pwa-register', async () => {
  const { pwaRegisterMockValue } = await import('tests/support/homeTestMocks')
  return pwaRegisterMockValue()
})

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: {
    cancelSubscription: vi.fn(),
    getSubscription,
    updateTheme: vi.fn(),
  },
}))

/**
 * The builder's "carried by" picker, end to end (#1992): a hand-built army assigns a hero to its
 * artefact pick through a labeled select in the enhancement's own card, the assignment lands in the
 * persisted document's `enhancementBearers` — the field imports populate (#1989) — the reminder tag
 * announces the bearer, and clearing the select removes the entry again.
 */
describe('builder carried-by picker UI (#1992)', () => {
  const currentStandardContextId = AOS4_CATALOG.rulesContexts.find(
    context => context.mode === 'standard' && context.status === 'current'
  )?.id

  const entityByName = (kind: 'faction' | 'warscroll' | 'content-group', name: string) => {
    // Seasonal enhancement tables share their battletome counterparts' names (#1979); the
    // current-standard entity is the one a plain hand-built pick lands on.
    const candidates = AOS4_CATALOG.entities.filter(
      candidate => candidate.kind === kind && candidate.name === name
    )
    const entity =
      candidates.find(
        candidate => currentStandardContextId && candidate.rulesContextIds.includes(currentStandardContextId)
      ) ?? candidates[0]
    if (!entity) throw new Error(`No ${kind} named ${name} in the catalog`)
    return entity as Faction | Warscroll | ContentGroup
  }

  const STORMCAST = entityByName('faction', 'Stormcast Eternals')
  const KNIGHT_QUESTOR = entityByName('warscroll', 'Knight-Questor')
  const LIBERATORS = entityByName('warscroll', 'Liberators')
  const ARTEFACT_GROUP = entityByName('content-group', 'Artefacts of the Tempest')

  let container: HTMLDivElement
  let storage: MemoryStorage

  const flush = () => new Promise(resolve => setTimeout(resolve, 0))

  const renderHome = async () => {
    await act(async () => {
      render(
        <AppStatusProvider>
          <SubscriptionProvider>
            <ThemeProvider>
              <MemoryRouter>
                <Home />
              </MemoryRouter>
            </ThemeProvider>
          </SubscriptionProvider>
        </AppStatusProvider>,
        container
      )
      await flush()
    })
    await act(async () => {
      await flush()
    })
  }

  const storedDocument = () =>
    deserializeAos4ArmyDocumentStructure(storage.getItem(AOS4_ARMY_STORAGE_KEY) ?? '').document

  const bearerInput = () =>
    container.querySelector<HTMLInputElement>(`input[id="aos4-bearer-${ARTEFACT_GROUP.id}"]`)

  const openBearerMenu = async () => {
    const input = bearerInput()
    expect(input).not.toBeNull()
    await act(async () => {
      input!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
      )
      await flush()
    })
  }

  beforeEach(async () => {
    auth.isAuthenticated = false
    auth.isLoading = false
    auth.user = undefined
    auth.getAccessTokenSilently.mockReset()
    getSubscription.mockReset()
    getSubscription.mockRejectedValue({ status: 404 })
    storage = new MemoryStorage()
    storage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          id: 'army:bearer-picker-ui',
          name: 'Bearer Picker UI Test',
          rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
          explicitSelectionIds: [STORMCAST.id, KNIGHT_QUESTOR.id, LIBERATORS.id, ARTEFACT_GROUP.id],
          reminderPreferences: {},
        })
      )
    )
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage })
    container = document.createElement('div')
    document.body.appendChild(container)

    await renderHome()
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('labels the picker with the enhancement it assigns and offers only the army HERO warscrolls', async () => {
    const label = container.querySelector(`label[for="aos4-bearer-${ARTEFACT_GROUP.id}"]`)
    expect(label).not.toBeNull()
    expect(label?.textContent).toBe('Carried by — Artefacts of the Tempest')

    await openBearerMenu()

    const offered = Array.from(container.querySelectorAll('[role="option"]')).map(option =>
      option.textContent?.trim()
    )
    expect(offered).toContain('Knight-Questor')
    expect(offered).not.toContain('Liberators')
  })

  it('assigns a bearer into the stored document, tags the reminder, and clears back to army-wide', async () => {
    await openBearerMenu()
    const option = Array.from(container.querySelectorAll('[role="option"]')).find(
      candidate => candidate.textContent?.trim() === 'Knight-Questor'
    )
    expect(option).not.toBeUndefined()
    await act(async () => {
      option!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      await flush()
    })

    expect(storedDocument()?.enhancementBearers).toEqual({
      [ARTEFACT_GROUP.id]: KNIGHT_QUESTOR.id,
    })
    // The reminder tag reads the same field imports populate, so it renders identically (#1989).
    expect(
      container.querySelector('[aria-label*="Carried by your Knight-Questor. Only that unit uses it."]')
    ).not.toBeNull()

    // react-select's clear control is the "no bearer / army-wide" choice; it fires on mousedown.
    // With a value set the control renders two indicators — clear first, then the dropdown arrow —
    // and emotion labels both `indicatorContainer`.
    const indicators = bearerInput()!.closest('.mt-2')!.querySelectorAll('[class*="indicatorContainer"]')
    expect(indicators.length).toBe(2)
    const clear = indicators[0]
    await act(async () => {
      clear!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
      await flush()
    })

    expect(storedDocument()?.enhancementBearers).toBeUndefined()
    expect(
      container.querySelector('[aria-label*="Carried by your Knight-Questor. Only that unit uses it."]')
    ).toBeNull()
  })
})
