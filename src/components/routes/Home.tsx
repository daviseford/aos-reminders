import { LoadingArmy, OfflineArmy } from 'components/helpers/suspenseFallbacks'
import AppBanner from 'components/info/banners/app_banner'
import { REMINDERS_ANCHOR_ID } from 'components/info/remindersAnchor'
import Footer from 'components/page/footer'
import { Header } from 'components/page/homeHeader'
import type { Aos4CatalogBoundBindings } from 'components/routes/HomeCatalogBound'
import { ArmyCollectionProvider } from 'context/useArmyCollection'
import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { logFactionSelection, logGameModeChange } from 'utils/analytics'
import { clearCloudArmyLink } from 'utils/cloudArmyLink'
import { clearPendingShareId, readPendingShareId } from 'utils/shareLink'
import type { CanonicalId, RulesContextId } from '../../aos4/domain'
import defaultsJson from '../../aos4/generated/corpus/defaults.json'
import { AOS4_FACTION_INDEX } from '../../aos4/generated/corpus/factionIndex'
import {
  AOS4_ARMY_STORAGE_KEY,
  createDefaultAos4ArmyDocument,
  saveAos4ArmyDocument,
} from '../../aos4/runtime'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocumentStructure,
  type Aos4ArmyDocument,
} from '../../aos4/state'

/*
 * Home is the catalog-free shell. Everything shaped `f(catalog, …)` — the builder, the toolbar, the
 * reminders, and the modals — sits in the child behind this boundary, so nothing in the route
 * chunk's static import graph reaches the rules corpus.
 *
 * The masthead is here rather than there because it is the whole point: it needs to name the
 * stored army and offer the faction selector without waiting for the corpus. Naming 28 factions
 * needs a 5 KB generated index, not 13 MB of rules, so the state the masthead reads — the
 * document, the faction, the game mode — lives here and travels down to the child as props. While
 * the corpus is on the wire the splash overlay covers the masthead, so what this buys is a first
 * commit that is already complete when the overlay lifts, not a half-painted page to wait in.
 */
const HomeCatalogBound = lazy(() => import('components/routes/HomeCatalogBound'))

/*
 * The default faction comes from the generated defaults file rather than the generated barrel that
 * also exports it: the barrel re-exports the whole corpus.
 */
const defaults = defaultsJson as unknown as {
  defaultFactionId: CanonicalId<'faction'>
  rulesContextId: RulesContextId
}

const factionIndexById = new Map(AOS4_FACTION_INDEX.factions.map(faction => [faction.id, faction] as const))

const DEFAULT_RULES_CONTEXT_INDEX = AOS4_FACTION_INDEX.rulesContextIds.indexOf(defaults.rulesContextId)

/*
 * Every decoded faction can name itself, but only the ones that field units are offered. `playable`
 * is `armyFactions`' rule, decided when the index is generated because the rule needs the
 * relationship graph. A stored document naming a faction that is no longer on offer keeps its own
 * name and leaves the selector empty, the same way one from another rules context already does.
 */
const selectableFactions = AOS4_FACTION_INDEX.factions.filter(faction => faction.playable)

// Stable identities, so the shell's own re-renders do not hand `Header` a new array or a new
// handler on every pass while the child is still loading.
const NO_ARMIES_OF_RENOWN: Aos4CatalogBoundBindings['armiesOfRenown'] = []
const noop = () => {}

/*
 * The stored army, read with the structural deserializer: the shell has no catalog to check ids
 * against, and does not need one to put a name in the masthead. The catalog-bound child runs the
 * validated load on mount and that result wins — see `handleDocumentValidated`.
 *
 * Deliberately not `loadAos4ArmyDocument`, which writes the default back when storage is empty. The
 * shell does not write until the child's load has landed.
 */
const loadStructuralDocument = (): Aos4ArmyDocument => {
  try {
    const serialized = window.localStorage.getItem(AOS4_ARMY_STORAGE_KEY)
    const restored = serialized ? deserializeAos4ArmyDocumentStructure(serialized).document : undefined
    return restored ?? createDefaultAos4ArmyDocument()
  } catch {
    // Browser storage can be unavailable in privacy modes. The default army is still buildable.
    return createDefaultAos4ArmyDocument()
  }
}

/*
 * The masthead, mode switch, faction select, builder cards, and the toolbar buttons all sit between
 * the top of the document and the reminders, so reaching the content by keyboard means tabbing past
 * roughly a dozen controls. The link targets the reminders rather than <main>, because <main> wraps
 * the routed tree from the navbar down and skipping to it would move nothing.
 *
 * Rendered only once the catalog-bound half is on screen: `#aos4-reminders` does not exist until it
 * mounts, and a skip link pointing at nothing moves focus nowhere.
 */
const SkipToReminders = () => (
  /*
   * A light chip in both themes rather than a theme slot. The link reveals itself over the masthead,
   * and the masthead is dark in each theme — Deep Harbour Teal in light, Midnight Slate in dark — so
   * `theme.bgColor` would paint it Midnight Slate on Midnight Slate and hide it exactly when a
   * keyboard user needs to see it.
   */
  <a
    className="SkipLink visually-hidden-focusable bg-light text-dark d-print-none"
    href={`#${REMINDERS_ANCHOR_ID}`}
  >
    Skip to reminders
  </a>
)

/*
 * The one class component here, because React exposes error boundaries only as
 * `getDerivedStateFromError`/`componentDidCatch` and has no hook form of either.
 *
 * It exists because the split changes what a failed catalog looks like. Before it, a catalog that
 * would not load took Home down with it and the router's own fallback said so. Behind `lazy()`, a
 * chunk that fails to fetch — a dropped connection mid-load, a deploy that retired the asset the
 * open tab is still asking for — would leave chrome that looks complete and silently never produce
 * a reminder. The failure goes back where the builder and reminders belong instead.
 */
class CatalogBoundary extends Component<{ children: ReactNode; onFailed: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  /*
   * The failure has to leave this subtree. Catching it here and rendering `OfflineArmy` covers the
   * region, but the shell above still owns a masthead that was drawn for a *pending* catalog — the
   * splash is up, the faction selector's picks nothing can honour. Without this the two halves
   * disagree forever: one says it failed, the other says it is still coming.
   *
   * `componentDidCatch` rather than `getDerivedStateFromError`, because the latter runs during
   * render and may not commit; telling the parent from there would report a failure React might
   * still retry.
   */
  componentDidCatch() {
    this.props.onFailed()
  }

  render() {
    return this.state.failed ? <OfflineArmy /> : this.props.children
  }
}

const Home = () => {
  /*
   * The army document lives in the shell so the masthead can name the stored army and offer the
   * faction selector without waiting for the corpus. Everything that reads it *against* the
   * catalog stays in the child and receives it as a prop.
   */
  const [armyDocument, setArmyDocument] = useState(loadStructuralDocument)
  const [documentValidated, setDocumentValidated] = useState(false)
  const [isGameMode, setIsGameMode] = useState(false)
  /*
   * Read here, once, and deliberately *without* clearing: the shell is the only component that
   * cannot remount under this route, so it is the right place to hold the id, but it is also the
   * half that cannot open a share. Removing the key at shell mount destroyed the share whenever the
   * child never arrived — the id was gone from session storage and the modal that consumes it had
   * never existed, so even a reload had nothing to recover. The key is cleared only in
   * `dismissPendingShare`, which the share modal calls when the player applies or declines the
   * share: the child mounting is not enough, because the modal is its own lazy chunk and can still
   * fail to arrive after the child has.
   */
  const [pendingShareId, setPendingShareId] = useState(readPendingShareId)
  /*
   * The upward half of the split: what the masthead needs that only the catalog can answer.
   * `armiesOfRenown` comes from `builder.options`, the change handler runs `resolveSelection`, and
   * the cloud-army unlink owns state the toolbar reads, so none of the three can live here. Absent
   * means the child has not mounted yet, which is also what holds the splash up and withholds the
   * skip link below.
   */
  const [catalogBound, setCatalogBound] = useState<Aos4CatalogBoundBindings>()
  /*
   * The other terminal state, published upward by the boundary. Absent bindings alone cannot tell
   * "not yet" from "never": both look like `undefined`, and the splash is a promise that the
   * catalog is still on its way. Once this is set the shell stops making that promise.
   */
  const [catalogFailed, setCatalogFailed] = useState(false)
  // Stable, because `CatalogBoundary` holds it as a prop and must not be re-created into a boundary
  // that has already caught.
  const handleCatalogFailed = useCallback(() => setCatalogFailed(true), [])

  /*
   * The document's rules context, as the index the generated rows address contexts by. `-1` for a
   * context the corpus no longer carries, which reads as "in nothing" everywhere below — the same
   * answer an unrecognized id gave before.
   */
  const rulesContextIndex = useMemo(
    () => AOS4_FACTION_INDEX.rulesContextIds.indexOf(armyDocument.rulesContextId),
    [armyDocument.rulesContextId]
  )

  /*
   * The selector's context, with one fallback the raw index must not have: a stored context the
   * corpus no longer carries would filter the options down to nothing — an empty selector for the
   * whole chunk wait, and a permanently empty disabled one if the chunk then failed. The
   * catalog-bound load resets such a document to the default context anyway, so the selector offers
   * the default context's factions rather than a promise of nothing.
   */
  const factionRulesContextIndex = rulesContextIndex === -1 ? DEFAULT_RULES_CONTEXT_INDEX : rulesContextIndex
  const factions = useMemo(
    () =>
      selectableFactions
        .filter(faction => faction.rulesContextIndexes.includes(factionRulesContextIndex))
        .map(faction => ({ label: faction.name, value: faction.id }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [factionRulesContextIndex]
  )
  /*
   * `Aos4ArmyDocument` stores selections, not a faction: the faction is whichever selection carries
   * the `faction:` prefix (see aos4/domain/identity). The ids are stored sorted, so this picks the
   * same one the catalog-bound lookup it replaces used to.
   */
  const selectedFactionId = armyDocument.explicitSelectionIds.find(id => id.startsWith('faction:'))
  const factionId = (selectedFactionId as CanonicalId<'faction'> | undefined) ?? defaults.defaultFactionId

  /*
   * Before the child exists there is no in-memory link to drop, only the persisted one; once it has
   * mounted, its own unlink owns both that and the toolbar state built on it. Exactly one of the
   * two runs, so a faction switch unlinks once either way.
   */
  const unlinkCloudArmy = catalogBound?.unlinkCloudArmy ?? clearCloudArmyLink

  const selectFaction = (nextFactionId: CanonicalId<'faction'>) => {
    const nextFaction = factionIndexById.get(nextFactionId)
    logFactionSelection(nextFactionId, nextFaction?.name ?? 'Unknown faction')
    unlinkCloudArmy()
    setArmyDocument(current =>
      createAos4ArmyDocument({
        ...current,
        name: nextFaction?.name ?? current.name,
        // A pick made from the fallback list above is a pick in the default context; carrying the
        // retired context id forward would pair it with a faction that was never offered there.
        rulesContextId: rulesContextIndex === -1 ? defaults.rulesContextId : current.rulesContextId,
        explicitSelectionIds: [nextFactionId],
        reminderPreferences: {},
      })
    )
  }

  const toggleGameMode = () => {
    const nextMode = !isGameMode
    setIsGameMode(nextMode)
    logGameModeChange(nextMode)
  }

  /*
   * The child's catalog-validated load is authoritative, full stop: the splash covers the screen
   * until it lands, so the document cannot have been touched in the meantime. When the stored
   * bytes round-tripped clean, the instance on screen is already value-identical to the validated
   * one, and keeping it saves rebuilding the builder and every reminder view model for no visible
   * change.
   */
  const handleDocumentValidated = useCallback(
    (validated: Aos4ArmyDocument, unchangedFromStorage: boolean) => {
      if (!unchangedFromStorage) setArmyDocument(validated)
      setDocumentValidated(true)
    },
    []
  )

  /*
   * The one place the sessionStorage key is removed. The share modal calls this when the player
   * applies or declines the share — the first moment something has genuinely taken responsibility
   * for the id. Clearing any earlier (the child mounting used to do it) races the modal's own lazy
   * chunk: a fetch that failed after the clear left the id nowhere, and the URL param is long gone.
   */
  const dismissPendingShare = useCallback(() => {
    clearPendingShareId()
    setPendingShareId(undefined)
  }, [])

  /*
   * Suppressed until the child's validated load has landed. The document the shell starts from was
   * read without a catalog, so writing it back would put selections the catalog has since retired
   * over the stored copy — pruned a moment later, but only after the unpruned version had already
   * replaced what was on disk.
   *
   * A failed catalog therefore never writes at all, and that is deliberate. `loadAos4ArmyDocument`
   * used to persist the default document for a first-run player and now runs only in the child, so
   * the case this gives up is: storage empty, chunk unfetchable, nothing saved. Nothing is lost by
   * it. `createDefaultAos4ArmyDocument` is a constant — same id, same faction, same context every
   * time — so the next load that succeeds recreates the identical document, and the only edit that
   * could have made this player's copy differ from that constant is a faction change, which the
   * masthead stops offering once `catalogFailed` is set. Writing here would trade that nothing for
   * something real: the shell's structural read cannot tell a live selection from a retired one, so
   * a returning player whose chunk failed would have their unpruned document written back over the
   * stored one with no catalog-validated pass ever coming to repair it.
   */
  useEffect(() => {
    if (!documentValidated) return
    try {
      saveAos4ArmyDocument(window.localStorage, armyDocument)
    } catch {
      // Browser storage can be unavailable in privacy modes. The in-memory document remains usable.
    }
  }, [armyDocument, documentValidated])

  return (
    <ArmyCollectionProvider>
      <div>
        {/*
         * One region for the whole handoff, mounted for the shell's entire life and only ever
         * updated. It used to live inside `LoadingArmy`, which is unmounted at exactly the moment
         * worth announcing: a live region that disappears announces nothing, and one created with
         * its text already in it is announced unreliably. So the announcements a player actually
         * needs — that the wait ended, and how — were the two this never made.
         */}
        <span role="status" className="visually-hidden">
          {catalogFailed
            ? 'Your army could not be loaded'
            : catalogBound
              ? 'Your army is ready'
              : 'Loading your army'}
        </span>

        {catalogBound && <SkipToReminders />}

        {/*
         * The splash is an overlay held by the shell, not the Suspense fallback, because the two
         * lift at different moments: the fallback goes away when the chunk arrives, but the child's
         * bindings land one commit later — and with them the masthead's real Army of Renown row.
         * Holding the overlay until `catalogBound` (or the boundary's failure) makes the reveal a
         * single commit: splash, then the finished screen. While it is up it covers the masthead
         * too, so the faction selector cannot be used mid-load the way the split used to allow;
         * that is the trade the full-screen splash asks for, and the document is still written
         * only after validation either way.
         */}
        {!catalogBound && !catalogFailed && <LoadingArmy />}

        <Header
          armiesOfRenown={catalogBound?.armiesOfRenown ?? NO_ARMIES_OF_RENOWN}
          armyName={armyDocument.name}
          armyOfRenownId={catalogBound?.armyOfRenownId ?? null}
          catalogUnavailable={catalogFailed}
          factionId={factionId}
          factions={factions}
          isGameMode={isGameMode}
          onArmyOfRenownChange={catalogBound?.onArmyOfRenownChange ?? noop}
          onFactionChange={selectFaction}
          onToggleGameMode={toggleGameMode}
        />

        <AppBanner />

        <CatalogBoundary onFailed={handleCatalogFailed}>
          {/*
           * No fallback of its own: the splash overlay above covers the whole wait, and a second
           * stand-in here would only flash in the gap between the chunk landing and the bindings
           * commit that lifts the overlay.
           */}
          <Suspense fallback={null}>
            <HomeCatalogBound
              document={armyDocument}
              factionId={factionId}
              isGameMode={isGameMode}
              onBindingsChange={setCatalogBound}
              onDismissPendingShare={dismissPendingShare}
              onDocumentChange={setArmyDocument}
              onDocumentValidated={handleDocumentValidated}
              pendingShareId={pendingShareId}
            />
          </Suspense>
        </CatalogBoundary>

        <Footer />
      </div>
    </ArmyCollectionProvider>
  )
}

export default Home
