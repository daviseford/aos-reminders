// @vitest-environment jsdom

import { vi } from 'vitest'

/*
 * The page loads the changelog artifact with a dynamic import so the JSON stays out of the entry
 * chunk. The import is mocked the same way updateAvailable.test.tsx stubs virtual:pwa-register:
 * a hoisted control object the mocked module reads, so each test picks its own artifact.
 */
const artifact = vi.hoisted(() => ({
  current: null as unknown,
  fail: false,
}))

/*
 * A getter, because vi.resetModules() leaves the mock registry cached: the factory only runs once
 * per file, so per-test control has to live at property-access time. A throwing access surfaces to
 * the page exactly where a rejected chunk import would: in its load promise's catch.
 */
vi.mock('../../aos4/generated/changelog/changelog.json', () => ({
  get default() {
    if (artifact.fail) throw new Error('changelog artifact unavailable')
    return artifact.current
  },
}))

import Changelog from 'components/routes/Changelog'
import { AppStatusProvider } from 'context/useAppStatus'
import { act } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { ROUTES } from 'utils/env'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const theme = {
  bgColor: 'bg-light',
  card: 'card',
  cardBody: 'card-body',
  cardHeader: 'card-header',
  genericButton: 'btn btn-light',
  headerColor: 'header',
  secondaryButton: 'btn btn-sm btn-outline-secondary',
  text: 'text-dark',
  textMuted: 'text-muted',
}

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ isAuthenticated: false, isLoading: false }),
}))

vi.mock('components/page/navbar', () => ({
  default: () => <div>Site navigation</div>,
}))

vi.mock('components/page/contact', () => ({
  default: () => <div>Contact links</div>,
}))

vi.mock('context/useTheme', () => ({
  useTheme: () => ({
    isDark: false,
    isLight: true,
    setLightTheme: vi.fn(),
    theme,
    toggleTheme: vi.fn(),
  }),
}))

const BATTLESCROLL = {
  publicationId: 'publication:battlescroll-embergard',
  name: 'Battlescroll: Embergard',
  source: 'battlescroll',
  effectiveDate: '2026-07-17',
}

const CORE_FAQ = {
  publicationId: 'publication:faq-core-rules',
  name: 'FAQ: Core Rules',
  source: 'faq',
}

const populatedArtifact = {
  schemaVersion: 1,
  revision: 'embergard-2026-07',
  retainedEntryIds: ['embergard-2026-07'],
  retainedPublicationIds: [BATTLESCROLL.publicationId, CORE_FAQ.publicationId],
  publications: [BATTLESCROLL, CORE_FAQ],
  records: [
    {
      entityId: 'ability:champions-of-order',
      entityKind: 'ability',
      name: 'Champions of Order',
      changeKind: 'modified',
      attribution: { kind: 'publication', ...BATTLESCROLL },
      predicate: { kind: 'faction', factionId: 'faction:stormcast-eternals' },
      ownership: { factionIds: ['faction:stormcast-eternals'], contentGroupIds: [] },
      fields: [{ field: 'text.effect', previous: 'Add 1 to save rolls.', next: 'Add 1 to ward rolls.' }],
    },
    {
      entityId: 'ability:reckless-abandon',
      entityKind: 'ability',
      name: 'Reckless Abandon',
      changeKind: 'removed',
      attribution: { kind: 'publication', ...CORE_FAQ },
      predicate: { kind: 'faction', factionId: 'faction:blades-of-khorne' },
      ownership: { factionIds: ['faction:blades-of-khorne'], contentGroupIds: [] },
      removedFacts: { 'text.effect': 'This unit can run and still charge.' },
    },
  ],
  corrections: [
    {
      entityId: 'weapon:skullreaver-axe',
      entityKind: 'weapon',
      name: 'Skullreaver Axe',
      changeKind: 'modified',
      attribution: { kind: 'correction' },
      predicate: { kind: 'warscroll', warscrollId: 'warscroll:korghos-khul' },
      ownership: {
        factionIds: ['faction:blades-of-khorne'],
        warscrollId: 'warscroll:korghos-khul',
        contentGroupIds: [],
      },
      fields: [{ field: 'attacks', previous: '5', next: '6' }],
    },
  ],
}

const emptyArtifact = {
  schemaVersion: 1,
  revision: null,
  retainedEntryIds: [],
  retainedPublicationIds: [],
  publications: [],
  records: [],
  corrections: [],
}

describe('the /changelog route', () => {
  let container: HTMLDivElement

  /*
   * Vitest resolves even a mocked dynamic import through its async module loader, which takes more
   * than one microtask, so the page is pumped until it leaves its loading placeholder.
   */
  const settle = async () => {
    for (let pass = 0; pass < 50; pass += 1) {
      if (!container.textContent?.includes('Loading rules updates')) return
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    }
  }

  const mount = async (element: React.ReactNode = <Changelog />) => {
    await act(async () => {
      render(
        <AppStatusProvider>
          <MemoryRouter initialEntries={[ROUTES.CHANGELOG]}>{element}</MemoryRouter>
        </AppStatusProvider>,
        container
      )
      await Promise.resolve()
    })
    await settle()
  }

  beforeEach(() => {
    vi.resetModules()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    artifact.current = populatedArtifact
    artifact.fail = false
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
    vi.restoreAllMocks()
  })

  it('renders at the route path with entries grouped by publication and faction', async () => {
    await mount(
      <Routes>
        <Route path={ROUTES.CHANGELOG} element={<Changelog />} />
      </Routes>
    )

    expect(container.textContent).toContain('Rules Updates')

    // Each retained update is a section headed by its publication name and date.
    expect(container.textContent).toContain('Battlescroll: Embergard')
    expect(container.textContent).toContain('2026-07-17')
    expect(container.textContent).toContain('FAQ: Core Rules')

    // Records sit under their owning faction's display name, no catalog involved.
    expect(container.textContent).toContain('Stormcast Eternals')
    expect(container.textContent).toContain('Blades Of Khorne')

    // A modified record shows the old text and the new text.
    expect(container.textContent).toContain('Champions of Order')
    expect(container.textContent).toContain('Add 1 to save rolls.')
    expect(container.textContent).toContain('Add 1 to ward rolls.')

    // A removed record shows the text that was removed.
    expect(container.textContent).toContain('Reckless Abandon')
    expect(container.textContent).toContain('This unit can run and still charge.')

    // The newest publication's effective date anchors the data-currency line.
    expect(container.textContent).toContain('current through')
  })

  it('gives each publication section a stable anchor id for deep links', async () => {
    await mount()

    expect(container.querySelector('[id="publication:battlescroll-embergard"]')).not.toBeNull()
    expect(container.querySelector('[id="publication:faq-core-rules"]')).not.toBeNull()
  })

  it('renders corrections in their own labeled section, not under a publication', async () => {
    await mount()

    const correctionsHeading = Array.from(container.querySelectorAll('h2')).find(
      heading => heading.textContent === 'Corrections'
    )
    expect(correctionsHeading).toBeDefined()

    const correctionsCard = correctionsHeading?.closest('.card')
    expect(correctionsCard?.textContent).toContain('Skullreaver Axe')
    expect(correctionsCard?.textContent).toContain('5')
    expect(correctionsCard?.textContent).toContain('6')

    // The correction is not attributed to either publication's section.
    const battlescrollSection = container.querySelector('[id="publication:battlescroll-embergard"]')
    expect(battlescrollSection?.textContent).not.toContain('Skullreaver Axe')
  })

  it('renders a plain holding state for the empty artifact that ships today', async () => {
    artifact.current = emptyArtifact

    await mount()

    expect(container.textContent).toContain('No rules updates recorded yet')
    // No publication sections and no corrections heading exist to sit empty.
    expect(container.querySelector('[id^="publication:"]')).toBeNull()
    const headings = Array.from(container.querySelectorAll('h2')).map(h => h.textContent)
    expect(headings).not.toContain('Corrections')
  })

  it('offers a retry when the artifact import rejects, and recovers on retry', async () => {
    artifact.fail = true

    await mount()

    expect(container.textContent).toContain('could not be loaded')
    const retry = Array.from(container.querySelectorAll('button')).find(
      button => button.textContent === 'Try again'
    )
    expect(retry).toBeDefined()

    // The connection comes back: the same control re-runs the import and the page loads.
    artifact.fail = false
    vi.resetModules()
    await act(async () => {
      Simulate.click(retry as Element)
      await Promise.resolve()
    })
    await settle()

    expect(container.textContent).toContain('Battlescroll: Embergard')
  })

  it('carries the Powered by Wahapedia attribution', async () => {
    await mount()

    expect(container.textContent).toContain('Powered by Wahapedia')
    const attribution = Array.from(container.querySelectorAll('a')).find(anchor =>
      (anchor.getAttribute('href') ?? '').includes('wahapedia.ru')
    )
    expect(attribution).toBeDefined()
  })
})
