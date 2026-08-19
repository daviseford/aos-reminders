import { LoadingArmy, OfflineArmy } from 'components/helpers/suspenseFallbacks'
import AppBanner from 'components/info/banners/app_banner'
import { REMINDERS_ANCHOR_ID } from 'components/info/remindersAnchor'
import Footer from 'components/page/footer'
import { Header } from 'components/page/homeHeader'
import type { Aos4CatalogBoundBindings } from 'components/routes/HomeCatalogBound'
import { ArmyCollectionProvider } from 'context/useArmyCollection'
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { logFactionSelection, logGameModeChange } from 'utils/analytics'
import { clearCloudArmyLink } from 'utils/cloudArmyLink'
import { consumePendingShareId } from 'utils/shareLink'
import type { CanonicalId } from '../../aos4/domain'
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
  serializeAos4ArmyDocument,
  type Aos4ArmyDocument,
} from '../../aos4/state'

/*
 * Home is the catalog-free shell. Everything shaped `f(catalog, …)` — the builder, the toolbar, the
 * reminders, and the modals — sits in the child behind this boundary, so nothing in the route
 * chunk's static import graph reaches the rules corpus.
 *
 * The masthead is here rather than there because it is the whole point: a player opening the app
 * gets the navbar, the mode switch, and a faction selector carrying the real army names while the
 * corpus is still on the wire. Naming 28 factions needs a 5 KB generated index, not 13 MB of
 * rules, so the state the masthead reads — the document, the faction, the game mode — lives here
 * and travels down to the child as props.
 */
const HomeCatalogBound = lazy(() => import('components/routes/HomeCatalogBound'))

/*
 * The default faction comes from the generated defaults file rather than the generated barrel that
 * also exports it: the barrel re-exports the whole corpus.
 */
const defaults = defaultsJson as unknown as { defaultFactionId: CanonicalId<'faction'> }

const factionIndexById = new Map(AOS4_FACTION_INDEX.factions.map(faction => [faction.id, faction] as const))

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
class CatalogBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? <OfflineArmy /> : this.props.children
  }
}

const Home = () => {
  /*
   * The army document lives in the shell so the masthead can name the stored army on first paint,
   * and so a faction picked before the corpus lands is held rather than dropped (R5). Everything
   * that reads it *against* the catalog stays in the child and receives it as a prop.
   */
  const [armyDocument, setArmyDocument] = useState(loadStructuralDocument)
  /*
   * The instance the shell started from, kept so `handleDocumentValidated` can tell an untouched
   * document — which the child's validated load may replace outright — from one the player has
   * already changed, which it must not.
   */
  const structuralDocument = useRef(armyDocument)
  const [documentValidated, setDocumentValidated] = useState(false)
  const [isGameMode, setIsGameMode] = useState(false)
  /*
   * Consumed here, once. `consumePendingShareId` removes the sessionStorage key as it reads it, so
   * holding it in a component that can remount — and a lazily-loaded child behind Suspense and an
   * error boundary is exactly that — would drop an incoming share on the first remount.
   */
  const [pendingShareId, setPendingShareId] = useState(consumePendingShareId)
  /*
   * The upward half of the split: what the masthead needs that only the catalog can answer.
   * `armiesOfRenown` comes from `builder.options`, the change handler runs `resolveSelection`, and
   * the cloud-army unlink owns state the toolbar reads, so none of the three can live here. Absent
   * means the child has not mounted yet, which is also what drives the reserved Army of Renown slot
   * and the skip link below.
   */
  const [catalogBound, setCatalogBound] = useState<Aos4CatalogBoundBindings>()

  /*
   * The document's rules context, as the index the generated rows address contexts by. `-1` for a
   * context the corpus no longer carries, which reads as "in nothing" everywhere below — the same
   * answer an unrecognized id gave before, and the safe one for the reservation in particular.
   */
  const rulesContextIndex = useMemo(
    () => AOS4_FACTION_INDEX.rulesContextIds.indexOf(armyDocument.rulesContextId),
    [armyDocument.rulesContextId]
  )

  const factions = useMemo(
    () =>
      selectableFactions
        .filter(faction => faction.rulesContextIndexes.includes(rulesContextIndex))
        .map(faction => ({ label: faction.name, value: faction.id }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [rulesContextIndex]
  )
  /*
   * `Aos4ArmyDocument` stores selections, not a faction: the faction is whichever selection carries
   * the `faction:` prefix (see aos4/domain/identity). The ids are stored sorted, so this picks the
   * same one the catalog-bound lookup it replaces used to.
   */
  const selectedFactionId = armyDocument.explicitSelectionIds.find(id => id.startsWith('faction:'))
  const factionId = (selectedFactionId as CanonicalId<'faction'> | undefined) ?? defaults.defaultFactionId
  const faction = factionIndexById.get(factionId)

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
   * R3. The child's catalog-validated load is authoritative — but only over a document the player
   * has not touched. A faction picked during the wait is newer than anything storage holds, and the
   * shell has not written it there yet, so taking the stored answer would silently undo the pick.
   */
  const handleDocumentValidated = useCallback((validated: Aos4ArmyDocument) => {
    setArmyDocument(current => {
      if (current !== structuralDocument.current) return current
      // The same army, freshly deserialized: swapping the instance would rebuild the builder and
      // every reminder view model to land on what is already on screen.
      return serializeAos4ArmyDocument(current) === serializeAos4ArmyDocument(validated) ? current : validated
    })
    setDocumentValidated(true)
  }, [])

  const dismissPendingShare = useCallback(() => setPendingShareId(undefined), [])

  /*
   * Suppressed until the child's validated load has landed. The document the shell starts from was
   * read without a catalog, so writing it back would put selections the catalog has since retired
   * over the stored copy — pruned a moment later, but only after the unpruned version had already
   * replaced what was on disk.
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
        {catalogBound && <SkipToReminders />}

        <Header
          armiesOfRenown={catalogBound?.armiesOfRenown ?? NO_ARMIES_OF_RENOWN}
          armyName={armyDocument.name}
          armyOfRenownId={catalogBound?.armyOfRenownId ?? null}
          factionId={factionId}
          factions={factions}
          isGameMode={isGameMode}
          onArmyOfRenownChange={catalogBound?.onArmyOfRenownChange ?? noop}
          onFactionChange={selectFaction}
          onToggleGameMode={toggleGameMode}
          /*
           * Only while the catalog has yet to answer, and only for the document's own rules
           * context: the same faction offers four Armies of Renown in matched play and none in
           * Spearhead or Legends, so a context-blind reservation would put a row on a Spearhead
           * document that the arriving child then removes — a shift in the direction reserving is
           * meant to prevent. Once the catalog has answered, its list is the truth.
           */
          reserveArmyOfRenownSlot={
            !catalogBound && Boolean(faction?.armiesOfRenownContextIndexes.includes(rulesContextIndex))
          }
        />

        <AppBanner />

        <CatalogBoundary>
          <Suspense fallback={<LoadingArmy />}>
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
