// @vitest-environment jsdom

import { vi } from 'vitest'

/*
 * Home loads the changelog artifact with a dynamic import so the JSON stays out of the entry
 * chunk. The import is mocked the same way changelogRoute.test.tsx does: a hoisted control object
 * the mocked module reads through a getter, so each test picks its own artifact and a throwing
 * access surfaces exactly where a rejected chunk import would. The getter runs on every access,
 * which is what lets one cached mock serve every test — never call `vi.resetModules()` here: the
 * statically imported Home tree is not re-evaluated by it anyway, and forcing vitest 4's module
 * runner to re-fetch the mocked JSON per test races its fetch phase under CI contention, which
 * intermittently resolved the real artifact instead of this mock (vitest-dev/vitest#8815).
 * `reads` counts getter accesses so absence assertions can wait for proof Home consumed the
 * artifact instead of guessing at timing.
 */
const artifactControl = vi.hoisted(() => ({
  current: null as unknown,
  fail: false,
  reads: 0,
}))

vi.mock('../../aos4/generated/changelog/changelog.json', () => ({
  get default() {
    artifactControl.reads += 1
    if (artifactControl.fail) throw new Error('changelog artifact unavailable')
    return artifactControl.current
  },
}))

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
 * module has no resolvable file on disk, so the test runner cannot import it.
 */
vi.mock('virtual:pwa-register', () => ({ registerSW: vi.fn(() => vi.fn(async () => undefined)) }))

vi.mock('../../api/subscriptionApi', () => ({
  SubscriptionApi: {
    cancelSubscription: vi.fn(),
    getSubscription,
    updateTheme: vi.fn(),
  },
}))

import type { Aos4PublishedChangelog } from '../../aos4/changelog'
import {
  computeAos4PublicationImpacts,
  evaluateAos4ChangePredicate,
  findAos4ExplainingRemovedRecord,
  isAos4ChangelogStampBehind,
  resolveAos4ChangelogStampStatus,
  totalAos4ChangelogImpact,
  unacknowledgedAos4PublicationIds,
} from '../../aos4/changelog'
import {
  REPRESENTATIVE_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS,
  REPRESENTATIVE_IDS,
} from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY, createDefaultAos4ArmyDocument } from '../../aos4/runtime'
import {
  catchUpAos4Changelog,
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  serializeAos4ArmyDocument,
  type Aos4ArmyDocument,
  type Aos4ChangelogState,
} from '../../aos4/state'
import { ChangelogBanner } from 'components/info/banners/changelog_banner'
import Home from 'components/routes/Home'
import { AppStatusProvider } from 'context/useAppStatus'
import { SubscriptionProvider } from 'context/useSubscription'
import { ThemeProvider } from 'context/useTheme'
import { act, useState } from 'react'
import { MemoryRouter } from 'react-router'
import { render, Simulate, unmountComponentAtNode } from 'tests/support/reactTestHelpers'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const IDS = REPRESENTATIVE_IDS

const REV_0 = 'acceptance-2026-05'
const REV_1 = 'acceptance-2026-07'
const REV_CHURN = 'acceptance-2026-07-churn'
const REV_2 = 'acceptance-2026-08'
const REV_3 = 'acceptance-2026-09'

const P1 = {
  publicationId: 'publication:battlescroll-first-blood',
  name: 'Battlescroll: First Blood',
  source: 'battlescroll',
  effectiveDate: '2026-08-01',
}

const P2 = {
  publicationId: 'publication:faq-core-rules',
  name: 'FAQ: Core Rules',
  source: 'faq',
}

const DEAD_WARSCROLL = 'warscroll:90000000-0000-4000-8000-0000000000ff'

const modifiedStalwart = {
  entityId: IDS.abilities.stalwartDefenders,
  entityKind: 'ability',
  name: 'Stalwart Defenders',
  changeKind: 'modified',
  attribution: { kind: 'publication', ...P1 },
  predicate: { kind: 'warscroll', warscrollId: IDS.warscrolls.liberators },
  ownership: { factionIds: [IDS.faction], warscrollId: IDS.warscrolls.liberators, contentGroupIds: [] },
  fields: [{ field: 'text.effect', previous: 'Add 1 to save rolls.', next: 'Add 1 to ward rolls.' }],
}

const addedAbility = {
  entityId: 'ability:90000000-0000-4000-8000-000000000001',
  entityKind: 'ability',
  name: 'Stormy Arrival',
  changeKind: 'added',
  attribution: { kind: 'publication', ...P1 },
  predicate: { kind: 'faction', factionId: IDS.faction },
  ownership: { factionIds: [IDS.faction], contentGroupIds: [] },
  addedFacts: { 'text.effect': 'Arrive from the storm.' },
}

const removedChariot = {
  entityId: DEAD_WARSCROLL,
  entityKind: 'warscroll',
  name: 'Celestial Chariots',
  changeKind: 'removed',
  attribution: { kind: 'publication', ...P1 },
  predicate: { kind: 'warscroll', warscrollId: DEAD_WARSCROLL },
  ownership: { factionIds: [IDS.faction], warscrollId: DEAD_WARSCROLL, contentGroupIds: [] },
  removedFacts: {
    name: 'Celestial Chariots',
    'text.effect': 'This unit flies.',
    availability: ['includes:warscroll:ab235210-cb06-59b2-908d-a718aa06c7bc'],
  },
}

const liberatorsPoints = {
  entityId: IDS.battleProfiles.liberators,
  entityKind: 'battle-profile',
  name: 'Liberators',
  changeKind: 'modified',
  attribution: { kind: 'publication', ...P2 },
  predicate: { kind: 'warscroll', warscrollId: IDS.warscrolls.liberators },
  ownership: { factionIds: [IDS.faction], warscrollId: IDS.warscrolls.liberators, contentGroupIds: [] },
  fields: [{ field: 'points', previous: 140, next: 160 }],
}

/*
 * `knownEntryIds` is the artifact's full acceptance memory, oldest first, all dispositions —
 * REV_CHURN is a churn-only acceptance that no rules-driven retention window ever carries. REV_0
 * is deliberately absent: it simulates a stamp the ledger has no memory of, the only state the
 * generic behind banner is for.
 */
const makeArtifact = (records: unknown[], overrides: Record<string, unknown> = {}): Aos4PublishedChangelog =>
  ({
    schemaVersion: 1,
    revision: REV_2,
    knownEntryIds: [REV_1, REV_CHURN, REV_2],
    retainedEntryIds: [REV_2, REV_1],
    retainedPublicationIds: [P1.publicationId, P2.publicationId],
    publications: [P1, P2],
    records,
    corrections: [],
    ...overrides,
  }) as unknown as Aos4PublishedChangelog

const makeDocument = (changelog?: Aos4ChangelogState): Aos4ArmyDocument =>
  createAos4ArmyDocument({
    id: 'army:changelog-banner',
    name: 'Banner Stormcast',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: [...REPRESENTATIVE_EXPLICIT_SELECTION_IDS],
    ...(changelog ? { changelog } : {}),
  })

const armyInput = (document: Aos4ArmyDocument, projectedAbilityIds: string[] = []) => ({
  document,
  projectedAbilityIds,
})

describe('changelog army matching', () => {
  const selections = [...REPRESENTATIVE_EXPLICIT_SELECTION_IDS] as string[]

  it('matches the universal predicate against every army', () => {
    expect(evaluateAos4ChangePredicate('universal', selections)).toBe(true)
    expect(evaluateAos4ChangePredicate('universal', [])).toBe(true)
  })

  it('matches a faction predicate only when the document selected that faction', () => {
    expect(evaluateAos4ChangePredicate({ kind: 'faction', factionId: IDS.faction }, selections)).toBe(true)
    expect(
      evaluateAos4ChangePredicate(
        { kind: 'faction', factionId: 'faction:90000000-0000-4000-8000-000000000002' as never },
        selections
      )
    ).toBe(false)
  })

  it('matches a warscroll predicate only when the warscroll is explicitly selected', () => {
    expect(
      evaluateAos4ChangePredicate({ kind: 'warscroll', warscrollId: IDS.warscrolls.liberators }, selections)
    ).toBe(true)
    expect(
      evaluateAos4ChangePredicate({ kind: 'warscroll', warscrollId: DEAD_WARSCROLL as never }, selections)
    ).toBe(false)
  })

  it('matches a content-group predicate by explicit pick or by faction auto-grant', () => {
    const explicit = {
      kind: 'content-group' as const,
      contentGroupId: IDS.groups.loreOfTheStorm,
      autoGrantedByFactionIds: [],
    }
    expect(evaluateAos4ChangePredicate(explicit, selections)).toBe(true)

    const autoGranted = {
      kind: 'content-group' as const,
      contentGroupId: 'content-group:90000000-0000-4000-8000-000000000003' as never,
      autoGrantedByFactionIds: [IDS.faction],
    }
    expect(evaluateAos4ChangePredicate(autoGranted, selections)).toBe(true)

    const neither = {
      kind: 'content-group' as const,
      contentGroupId: 'content-group:90000000-0000-4000-8000-000000000003' as never,
      autoGrantedByFactionIds: [],
    }
    expect(evaluateAos4ChangePredicate(neither, selections)).toBe(false)
  })

  it('never counts added records as in-army impact', () => {
    const impacts = computeAos4PublicationImpacts(
      makeArtifact([addedAbility]),
      armyInput(makeDocument(), [addedAbility.entityId])
    )
    expect(totalAos4ChangelogImpact(impacts)).toBe(0)
  })

  it('counts a modified ability only when the army actually projects it', () => {
    const artifact = makeArtifact([modifiedStalwart])
    const projected = computeAos4PublicationImpacts(
      artifact,
      armyInput(makeDocument(), [IDS.abilities.stalwartDefenders])
    )
    expect(totalAos4ChangelogImpact(projected)).toBe(1)
    expect(projected.find(impact => impact.publication.publicationId === P1.publicationId)?.total).toBe(1)

    const notProjected = computeAos4PublicationImpacts(artifact, armyInput(makeDocument(), []))
    expect(totalAos4ChangelogImpact(notProjected)).toBe(0)
  })

  it('counts points-only battle-profile changes on selected warscrolls as non-reminder impact', () => {
    const impacts = computeAos4PublicationImpacts(makeArtifact([liberatorsPoints]), armyInput(makeDocument()))
    const faq = impacts.find(impact => impact.publication.publicationId === P2.publicationId)
    expect(faq?.profileChanges).toHaveLength(1)
    expect(faq?.reminderChanges).toHaveLength(0)
    expect(faq?.total).toBe(1)
  })

  it('applies a removed record through the document removal record when the selection is gone', () => {
    const document = makeDocument({
      lastSeenRevision: REV_1,
      removedSelections: [
        { selectionId: DEAD_WARSCROLL, detectedAtRevision: REV_2, publicationId: P1.publicationId },
      ],
    })
    const impacts = computeAos4PublicationImpacts(makeArtifact([removedChariot]), armyInput(document))
    const battlescroll = impacts.find(impact => impact.publication.publicationId === P1.publicationId)
    expect(battlescroll?.removals).toHaveLength(1)
    expect(battlescroll?.total).toBe(1)
  })

  it('counts a removed record matched directly by predicate, with no document removal record involved', () => {
    // The warscroll itself stays selected; only one of its abilities was removed, so no selection
    // ever went missing and the document carries no removedSelections at all.
    const removedAbility = {
      entityId: 'ability:90000000-0000-4000-8000-0000000000bb',
      entityKind: 'ability',
      name: 'Stalwart Banner',
      changeKind: 'removed',
      attribution: { kind: 'publication', ...P1 },
      predicate: { kind: 'warscroll', warscrollId: IDS.warscrolls.liberators },
      ownership: { factionIds: [IDS.faction], warscrollId: IDS.warscrolls.liberators, contentGroupIds: [] },
      removedFacts: { 'text.effect': 'Add 1 to hit rolls.' },
    }
    const impacts = computeAos4PublicationImpacts(makeArtifact([removedAbility]), armyInput(makeDocument()))
    const battlescroll = impacts.find(impact => impact.publication.publicationId === P1.publicationId)
    expect(battlescroll?.removals).toHaveLength(1)
    expect(battlescroll?.unexplainedRemovedSelections).toHaveLength(0)
    expect(battlescroll?.total).toBe(1)
  })

  it('reports unacknowledged retained publications for a document', () => {
    const artifact = makeArtifact([])
    expect(unacknowledgedAos4PublicationIds(artifact, makeDocument())).toEqual([
      P1.publicationId,
      P2.publicationId,
    ])
    const acknowledged = makeDocument({ acknowledgedPublicationIds: [P1.publicationId] })
    expect(unacknowledgedAos4PublicationIds(artifact, acknowledged)).toEqual([P2.publicationId])
  })

  it('treats only a stamp the artifact has no memory of as behind', () => {
    const artifact = makeArtifact([])
    expect(isAos4ChangelogStampBehind(artifact, makeDocument({ lastSeenRevision: REV_0 }))).toBe(true)
    expect(isAos4ChangelogStampBehind(artifact, makeDocument({ lastSeenRevision: REV_1 }))).toBe(false)
    // Known churn-only acceptance: never the generic behind path, even though it is not retained.
    expect(isAos4ChangelogStampBehind(artifact, makeDocument({ lastSeenRevision: REV_CHURN }))).toBe(false)
    expect(isAos4ChangelogStampBehind(artifact, makeDocument({ lastSeenRevision: REV_2 }))).toBe(false)
    expect(isAos4ChangelogStampBehind(artifact, makeDocument())).toBe(false)
  })

  it('resolves a stamp to current, known with pending retained entries, or unknown', () => {
    const artifact = makeArtifact([])
    expect(resolveAos4ChangelogStampStatus(artifact, REV_2)).toEqual({ kind: 'current' })
    expect(resolveAos4ChangelogStampStatus(artifact, REV_CHURN)).toEqual({
      kind: 'known',
      pendingRetainedEntryIds: [REV_2],
    })
    expect(resolveAos4ChangelogStampStatus(artifact, REV_1)).toEqual({
      kind: 'known',
      pendingRetainedEntryIds: [REV_2],
    })
    expect(resolveAos4ChangelogStampStatus(artifact, REV_0)).toEqual({ kind: 'unknown' })
  })

  it('finds the removed record explaining a filtered selection, by entity or owning warscroll', () => {
    const removedChariotAbility = {
      ...removedChariot,
      entityId: 'ability:90000000-0000-4000-8000-0000000000aa',
      entityKind: 'ability',
      name: 'Celestial Charge',
    }
    const byEntity = makeArtifact([modifiedStalwart, removedChariot]).records
    expect(findAos4ExplainingRemovedRecord(byEntity, DEAD_WARSCROLL)).toMatchObject({
      changeKind: 'removed',
      name: 'Celestial Chariots',
    })

    const byOwnership = makeArtifact([removedChariotAbility]).records
    expect(findAos4ExplainingRemovedRecord(byOwnership, DEAD_WARSCROLL)).toMatchObject({
      name: 'Celestial Charge',
    })

    // Modified records never explain a removal, and unrelated ids find nothing.
    const noRemovals = makeArtifact([modifiedStalwart]).records
    expect(findAos4ExplainingRemovedRecord(noRemovals, DEAD_WARSCROLL)).toBeUndefined()
    expect(findAos4ExplainingRemovedRecord(byEntity, IDS.warscrolls.liberators)).toBeUndefined()
  })
})

/*
 * The harness owns the document exactly like Home does: setDocument feeds back into the banner's
 * props, so acknowledgements and stamps are observable on `latest.document` and can round-trip
 * through the serializer to simulate a reload.
 */
const latest: { document: Aos4ArmyDocument | null } = { document: null }

interface HarnessProps {
  artifact?: Aos4PublishedChangelog
  hiddenAbilityIds?: string[]
  initialDocument: Aos4ArmyDocument
  isGameMode?: boolean
  projectedAbilityIds?: string[]
}

const Harness = ({
  artifact,
  hiddenAbilityIds = [],
  initialDocument,
  isGameMode = false,
  projectedAbilityIds = [],
}: HarnessProps) => {
  const [document, setDocument] = useState(initialDocument)
  latest.document = document
  // Home owns the impact computation and hands the banner the result; the harness does the same.
  const impacts = artifact
    ? computeAos4PublicationImpacts(artifact, { document, projectedAbilityIds })
    : undefined
  return (
    <MemoryRouter>
      <ChangelogBanner
        artifact={artifact}
        document={document}
        fallback={<p>welcome fallback</p>}
        hiddenAbilityIds={hiddenAbilityIds}
        impacts={impacts}
        isGameMode={isGameMode}
        projectedAbilityIds={projectedAbilityIds}
        setDocument={setDocument}
      />
    </MemoryRouter>
  )
}

describe('the in-army changelog banner', () => {
  let container: HTMLDivElement

  const mount = (props: HarnessProps) => {
    act(() => {
      render(<Harness {...props} />, container)
    })
  }

  const banner = () => container.querySelector('[role="alert"]')
  const detailsToggle = () =>
    Array.from(container.querySelectorAll('button')).find(button =>
      button.textContent?.includes('Show details')
    )
  const expandDetails = () => {
    const toggle = detailsToggle()
    expect(toggle).toBeDefined()
    act(() => Simulate.click(toggle!))
  }
  const dismissButtonFor = (publicationName: string) =>
    container.querySelector<HTMLButtonElement>(`[aria-label="Dismiss ${publicationName}"]`)

  beforeEach(() => {
    latest.document = null
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('AE1: names the publication and the count when a projected ability was modified', () => {
    mount({
      artifact: makeArtifact([modifiedStalwart]),
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain(P1.name)
    expect(container.textContent).toContain('1 change')
    expect(container.textContent).not.toContain('welcome fallback')
  })

  it('AE2: yields the slot when the update touches nothing the army projects', () => {
    mount({
      artifact: makeArtifact([modifiedStalwart]),
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
      projectedAbilityIds: [],
    })

    expect(banner()).toBeNull()
    expect(container.textContent).toBe('welcome fallback')
  })

  it('AE3: ignores added-only records for the army faction', () => {
    mount({
      artifact: makeArtifact([addedAbility]),
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
      projectedAbilityIds: [addedAbility.entityId],
    })

    expect(banner()).toBeNull()
    expect(container.textContent).toBe('welcome fallback')
  })

  it('AE4: falls back to generic wording for a document removal no artifact record explains', () => {
    mount({
      // No removed record in the artifact at all, so nothing can explain the document's removal.
      artifact: makeArtifact([]),
      initialDocument: makeDocument({
        lastSeenRevision: REV_1,
        removedSelections: [
          { selectionId: DEAD_WARSCROLL, detectedAtRevision: REV_2, publicationId: P1.publicationId },
        ],
      }),
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain('1 change')

    expandDetails()

    expect(container.textContent).toContain('A unit or option this army had selected is no longer available.')
  })

  it('AE5: counts a removal and shows the removed text in the per-publication detail', () => {
    mount({
      artifact: makeArtifact([removedChariot]),
      initialDocument: makeDocument({
        lastSeenRevision: REV_1,
        removedSelections: [
          { selectionId: DEAD_WARSCROLL, detectedAtRevision: REV_2, publicationId: P1.publicationId },
        ],
      }),
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain('1 change')

    expandDetails()

    expect(container.textContent).toContain('Celestial Chariots')
    expect(container.textContent).toContain('This unit flies.')
    expect(container.textContent).toContain('Removed')

    // Internal facts never render in the detail: no canonical ids, no redundant name row.
    expect(container.textContent).not.toContain('availability')
    expect(container.textContent).not.toContain('includes:warscroll:')
    expect(container.textContent).not.toContain('name:')
  })

  it('rolls two retained publications into one banner and keeps a dismissal across reload', () => {
    const artifact = makeArtifact([modifiedStalwart, liberatorsPoints])
    mount({
      artifact,
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
    })

    expect(container.querySelectorAll('[role="alert"]')).toHaveLength(1)
    expect(container.textContent).toContain('2 rules updates')
    expect(container.textContent).toContain('2 changes')

    expandDetails()
    expect(container.textContent).toContain(P1.name)
    expect(container.textContent).toContain(P2.name)

    act(() => Simulate.click(dismissButtonFor(P1.name)!))

    // Simulated reload: the document round-trips through the serializer, as Home's save path does.
    const serialized = serializeAos4ArmyDocument(latest.document!)
    const restored = deserializeAos4ArmyDocument(serialized, REPRESENTATIVE_CATALOG)
    expect(restored.diagnostics).toEqual([])
    expect(restored.document?.changelog?.acknowledgedPublicationIds).toEqual([P1.publicationId])
    // P2 still blocks the stamp from advancing.
    expect(restored.document?.changelog?.lastSeenRevision).toBe(REV_1)

    act(() => {
      unmountComponentAtNode(container)
    })
    mount({
      artifact,
      initialDocument: restored.document!,
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain(P2.name)
    expect(container.textContent).not.toContain(P1.name)

    // Dismissing the last affecting publication advances the stamp and hands the slot back.
    expandDetails()
    act(() => Simulate.click(dismissButtonFor(P2.name)!))
    expect(banner()).toBeNull()
    expect(latest.document?.changelog?.lastSeenRevision).toBe(REV_2)
  })

  it('counts a points-only change and flags it as a non-reminder impact in the detail', () => {
    mount({
      artifact: makeArtifact([liberatorsPoints]),
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain('1 change')

    expandDetails()

    expect(container.textContent).toContain('Liberators')
    expect(container.textContent).toContain('Unit profile')
    expect(container.textContent).toContain('140')
    expect(container.textContent).toContain('160')
  })

  it('labels hidden-but-changed reminders in the detail', () => {
    mount({
      artifact: makeArtifact([modifiedStalwart]),
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
      hiddenAbilityIds: [IDS.abilities.stalwartDefenders],
    })

    expandDetails()

    expect(container.textContent).toContain('Stalwart Defenders')
    expect(container.textContent).toContain('hidden')
  })

  it('renders nothing beyond the fallback in game mode', () => {
    mount({
      artifact: makeArtifact([modifiedStalwart]),
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
      isGameMode: true,
    })

    expect(banner()).toBeNull()
    expect(container.textContent).toBe('welcome fallback')
  })

  it('yields the slot when no artifact loaded (fail-open)', () => {
    mount({
      artifact: undefined,
      initialDocument: makeDocument({ lastSeenRevision: REV_1 }),
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
    })

    expect(banner()).toBeNull()
    expect(container.textContent).toBe('welcome fallback')
  })

  it('shows the generic behind banner for a stamp outside the retained window', () => {
    const initialDocument = makeDocument({ lastSeenRevision: REV_0 })
    mount({
      artifact: makeArtifact([]),
      initialDocument,
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain('last reviewed several updates ago')
    const link = container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/changelog')

    // Session-only dismissal: the slot is handed back and the document is untouched.
    act(() => Simulate.click(container.querySelector('.btn-close')!))
    expect(banner()).toBeNull()
    expect(container.textContent).toBe('welcome fallback')
    expect(serializeAos4ArmyDocument(latest.document!)).toBe(serializeAos4ArmyDocument(initialDocument))

    // A later publication (a new artifact, a new session) still surfaces the banner.
    act(() => {
      unmountComponentAtNode(container)
    })
    mount({
      artifact: makeArtifact([], {
        revision: REV_3,
        knownEntryIds: [REV_1, REV_CHURN, REV_2, REV_3],
        retainedEntryIds: [REV_3, REV_2],
      }),
      initialDocument,
    })
    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain('last reviewed several updates ago')
  })

  it('rolls up only the still-unacknowledged publications for a churn-only stamp, never behind', () => {
    // The army was stamped while a churn-only acceptance was newest; a rules-driven acceptance
    // (REV_2) has landed since. The artifact still knows the churn entry, so the roll-up applies —
    // and it names only the publication the army has not acknowledged, not the pre-stamp one.
    mount({
      artifact: makeArtifact([modifiedStalwart, liberatorsPoints]),
      initialDocument: makeDocument({
        lastSeenRevision: REV_CHURN,
        acknowledgedPublicationIds: [P1.publicationId],
      }),
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).not.toContain('last reviewed several updates ago')
    expect(container.textContent).toContain(P2.name)
    expect(container.textContent).not.toContain(P1.name)
  })

  it('banners only the genuinely new publication at the acceptance after a catch-up', () => {
    const P3 = {
      publicationId: 'publication:battlescroll-second-wind',
      name: 'Battlescroll: Second Wind',
      source: 'battlescroll',
    }
    const newerStalwart = {
      ...modifiedStalwart,
      attribution: { kind: 'publication', ...P3 },
      fields: [{ field: 'text.effect', previous: 'Add 1 to ward rolls.', next: 'Add 2 to ward rolls.' }],
    }
    // The document went through a catch-up (rollout or behind-link) against the current artifact...
    const caughtUp = catchUpAos4Changelog(makeDocument(), {
      revision: REV_2,
      retainedPublicationIds: [P1.publicationId, P2.publicationId],
    })

    // ...then a new acceptance lands. Only its publication may banner: the ones the catch-up
    // acknowledged stay suppressed instead of resurfacing as news.
    mount({
      artifact: makeArtifact([modifiedStalwart, liberatorsPoints, newerStalwart], {
        revision: REV_3,
        knownEntryIds: [REV_1, REV_CHURN, REV_2, REV_3],
        retainedEntryIds: [REV_3, REV_2, REV_1],
        retainedPublicationIds: [P3.publicationId, P1.publicationId, P2.publicationId],
        publications: [P3, P1, P2],
      }),
      initialDocument: caughtUp,
      projectedAbilityIds: [IDS.abilities.stalwartDefenders],
    })

    expect(banner()).not.toBeNull()
    expect(container.textContent).toContain(P3.name)
    expect(container.textContent).not.toContain(P1.name)
    expect(container.textContent).not.toContain(P2.name)
  })

  it('catches the army up when the behind banner link is followed', () => {
    mount({
      artifact: makeArtifact([removedChariot]),
      initialDocument: makeDocument({
        lastSeenRevision: REV_0,
        removedSelections: [
          { selectionId: DEAD_WARSCROLL, detectedAtRevision: REV_1, publicationId: P1.publicationId },
          { selectionId: 'warscroll:90000000-0000-4000-8000-0000000000ee', detectedAtRevision: REV_0 },
        ],
      }),
    })

    const link = container.querySelector('a')
    expect(link).not.toBeNull()
    act(() => Simulate.click(link!))

    // One step: stamp advanced, every retained publication acknowledged, removal records cleared —
    // so nothing suppressed behind the generic banner resurfaces at the next acceptance.
    expect(latest.document?.changelog?.lastSeenRevision).toBe(REV_2)
    expect(latest.document?.changelog?.acknowledgedPublicationIds).toEqual([
      P1.publicationId,
      P2.publicationId,
    ])
    expect(latest.document?.changelog?.removedSelections).toBeUndefined()
    expect(banner()).toBeNull()
  })
})

/*
 * Home-level wiring: the artifact arrives by dynamic import, rollout stamping and removal-record
 * writing ride Home's setDocument, and a rejected import fails open. localStorage being unavailable
 * is deliberately NOT covered here: dismissal state lives in the army document, not browser
 * storage, so this banner has no localStorage of its own to lose.
 */
class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

describe('Home changelog wiring', () => {
  let container: HTMLDivElement

  /*
   * The mocked dynamic import still travels the async module loader, which takes more than one
   * microtask. The bound is a wall-clock deadline on an observable condition rather than a fixed
   * pass count: under parallel-worker CPU contention the module fetch can outlast any fixed
   * number of timer ticks (this is what turned these tests red on CI while green locally).
   */
  const settle = async (until: () => boolean) => {
    const deadline = Date.now() + 5000
    while (!until() && Date.now() < deadline) {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    }
  }

  // A short unconditional drain for the microtasks that follow a settled condition.
  const pump = async () => {
    for (let pass = 0; pass < 10; pass += 1) {
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
    }
  }

  const mountHome = async () => {
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
      await Promise.resolve()
    })
  }

  const renderHome = async (until: () => boolean) => {
    await mountHome()
    await settle(until)
  }

  const storedDocument = () => {
    const serialized = window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)
    expect(serialized).not.toBeNull()
    return JSON.parse(serialized!)
  }

  // A non-throwing reader for settle predicates, safe before the first document write lands.
  const storedChangelog = (): Aos4ChangelogState | undefined => {
    const serialized = window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)
    return serialized ? JSON.parse(serialized).changelog : undefined
  }

  beforeEach(() => {
    auth.isAuthenticated = false
    auth.user = undefined
    getSubscription.mockReset()
    getSubscription.mockRejectedValue({ status: 404 })
    artifactControl.current = makeArtifact([removedChariot])
    artifactControl.fail = false
    artifactControl.reads = 0
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: new MemoryStorage(),
    })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container)
    })
    container.remove()
  })

  it('catches a fresh document up to the current revision without showing a banner (rollout)', async () => {
    await renderHome(() => storedChangelog()?.lastSeenRevision !== undefined)

    expect(storedDocument().changelog?.lastSeenRevision).toBe(REV_2)
    // The rollout acknowledges every retained publication alongside the stamp: the updates it
    // silently skips must not resurface as "new" at the next acceptance.
    expect(storedDocument().changelog?.acknowledgedPublicationIds).toEqual([
      P1.publicationId,
      P2.publicationId,
    ])
    expect(container.textContent).not.toContain('rules update')
    expect(container.textContent).toContain('Welcome back!')
  })

  it('fails open when the artifact import rejects: no banner, no stamp, no crash', async () => {
    artifactControl.fail = true

    // Settle on the mock access itself: the absence assertions below are only meaningful once
    // Home has provably consumed (and been thrown) the artifact, not merely not-yet loaded it.
    await renderHome(() => artifactControl.reads > 0)
    await pump()

    expect(container.textContent).toContain('Welcome back!')
    expect(storedDocument().changelog).toBeUndefined()
  })

  it('writes an attributed removal record when the load path filtered a missing selection', async () => {
    const seeded = createDefaultAos4ArmyDocument()
    window.localStorage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          ...seeded,
          explicitSelectionIds: [...seeded.explicitSelectionIds, DEAD_WARSCROLL as never],
          changelog: { lastSeenRevision: REV_1 },
        })
      )
    )

    await renderHome(() => storedChangelog()?.removedSelections !== undefined)

    expect(storedDocument().changelog?.removedSelections).toEqual([
      {
        selectionId: DEAD_WARSCROLL,
        detectedAtRevision: REV_2,
        publicationId: P1.publicationId,
      },
    ])
    // The removal blocks the stamp and surfaces the publication in the banner.
    expect(storedDocument().changelog?.lastSeenRevision).toBe(REV_1)
    expect(container.textContent).toContain(P1.name)
  })

  it('does not resurrect a removal record whose publication was already acknowledged', async () => {
    // The user saw the removal and dismissed P1 in an earlier session, which cleared the record.
    // The dead selection id rides the stored document into this load (a cloud sync or an old
    // client can reintroduce it), so the load re-detects it; the bookkeeping must not write the
    // record back, or it would be resurrected with no acknowledgement path left to clear it.
    const seeded = createDefaultAos4ArmyDocument()
    window.localStorage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          ...seeded,
          explicitSelectionIds: [...seeded.explicitSelectionIds, DEAD_WARSCROLL as never],
          changelog: { lastSeenRevision: REV_1, acknowledgedPublicationIds: [P1.publicationId] },
        })
      )
    )

    // The advance to the current revision is the positive signal that the bookkeeping effect ran.
    await renderHome(() => storedChangelog()?.lastSeenRevision === REV_2)

    expect(storedDocument().changelog?.removedSelections).toBeUndefined()
    expect(container.textContent).not.toContain(P1.name)
    // Nothing unacknowledged affects the army any more, so the stamp advances.
    expect(storedDocument().changelog?.lastSeenRevision).toBe(REV_2)
  })

  const clickClearArmy = () => {
    const clearButton = Array.from(container.querySelectorAll('button')).find(button =>
      button.textContent?.includes('Clear Army')
    )
    expect(clearButton).toBeDefined()
    act(() => Simulate.click(clearButton!))
  }

  it('writes no removal records to an army the user replaced (either side of the artifact race)', async () => {
    const seeded = createDefaultAos4ArmyDocument()
    window.localStorage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          ...seeded,
          explicitSelectionIds: [...seeded.explicitSelectionIds, DEAD_WARSCROLL as never],
          changelog: { lastSeenRevision: REV_1 },
        })
      )
    )

    // Mount without pumping the async module loader, biasing toward the replace-before-artifact
    // ordering. The cached mock can still land first, and both orderings must converge: pending
    // load-time diagnostics are dropped on replacement, and a record already written to the
    // replaced document is discarded by the clear-army scrub.
    await mountHome()
    clickClearArmy()

    // Once Home has provably consumed the artifact, the bookkeeping has had its input; a short
    // drain then flushes its writes. Post-click, no ordering can leave a record behind.
    await settle(() => artifactControl.reads > 0)
    await pump()

    // The load-time diagnostics belonged to the replaced document; the replacement stays clean.
    expect(storedDocument().changelog?.removedSelections).toBeUndefined()
  })

  it('discards a removal record already written when the user then clears the army', async () => {
    const seeded = createDefaultAos4ArmyDocument()
    window.localStorage.setItem(
      AOS4_ARMY_STORAGE_KEY,
      serializeAos4ArmyDocument(
        createAos4ArmyDocument({
          ...seeded,
          explicitSelectionIds: [...seeded.explicitSelectionIds, DEAD_WARSCROLL as never],
          changelog: { lastSeenRevision: REV_1 },
        })
      )
    )

    // Deterministic ordering: let the artifact land and the bookkeeping write the record first.
    await renderHome(() => storedChangelog()?.removedSelections !== undefined)
    expect(storedDocument().changelog?.removedSelections).toHaveLength(1)

    clickClearArmy()
    await pump()

    // The record described the replaced selection list and goes with it; the stamp is the user's
    // seen-state and survives.
    expect(storedDocument().changelog?.removedSelections).toBeUndefined()
    expect(storedDocument().changelog?.lastSeenRevision).toBeDefined()
  })
})
