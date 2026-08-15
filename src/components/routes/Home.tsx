import {
  computeAos4PublicationImpacts,
  findAos4ExplainingRemovedRecord,
  resolveAos4ChangelogStampStatus,
  type Aos4PublishedChangelog,
} from '../../aos4/changelog'
import { armyFactions, type CanonicalId } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_FACTION_ID } from '../../aos4/generated'
import type { PrintDocumentOptions } from '../../aos4/print/document'
import type { PrintPageSize } from '../../aos4/print/presets'
import type { PrintPreset } from '../../aos4/print/types'
import {
  createDefaultAos4ArmyDocument,
  deriveAos4OverlayFlags,
  loadAos4ArmyDocument,
  saveAos4ArmyDocument,
} from '../../aos4/runtime'
import { resolveSelection } from '../../aos4/select'
import {
  advanceAos4ChangelogStamp,
  catchUpAos4Changelog,
  createAos4ArmyDocument,
  recordAos4RemovedSelection,
  setAos4ReminderPreference,
  type Aos4ArmyDocument,
} from '../../aos4/state'
import {
  aos4ReminderChangesByAbilityId,
  createAos4BuilderViewModel,
  createAos4ReminderSourceLinkResolver,
  createAos4ReminderViewModel,
  migrateAos4ReminderPreferences,
  withAos4ReminderChanges,
  type Aos4ReminderViewModel,
} from '../../aos4/view'
import AppBanner from 'components/info/banners/app_banner'
import Reminders, { REMINDERS_ANCHOR_ID } from 'components/info/reminders'
import ArmyBuilder from 'components/input/army_builder'
import { useSubscriberAction } from 'components/input/importArmy/subscriberAction'
import Toolbar from 'components/input/toolbar/toolbar'
import Footer from 'components/page/footer'
import { Header } from 'components/page/homeHeader'
import { ArmyCollectionProvider } from 'context/useArmyCollection'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { logFactionSelection, logGameModeChange, logPdfDownload } from 'utils/analytics'
import { consumePendingShareId } from 'utils/shareLink'

const ImportArmyModal = lazy(() => import('components/input/importArmy/importArmyModal'))
const PrintModal = lazy(() => import('components/print/printModal'))
const SavedArmiesModal = lazy(() => import('components/input/cloudArmies/savedArmiesModal'))
const ShareArmyModal = lazy(() => import('components/input/armySharing/shareArmyModal'))
const SharedArmyModal = lazy(() => import('components/input/armySharing/sharedArmyModal'))

interface LoadedArmyDocument {
  document: Aos4ArmyDocument
  /** Selection IDs the deserializer filtered because the catalog no longer carries them. */
  missingSelectionIds: string[]
}

const loadDocument = (): LoadedArmyDocument => {
  try {
    const { document, diagnostics } = loadAos4ArmyDocument(window.localStorage, AOS4_CATALOG)
    return {
      document,
      missingSelectionIds: diagnostics.flatMap(diagnostic =>
        diagnostic.code === 'missing-selection' && diagnostic.subject ? [diagnostic.subject] : []
      ),
    }
  } catch {
    return { document: createDefaultAos4ArmyDocument(), missingSelectionIds: [] }
  }
}

/*
 * Warscroll-ability records deep-link to their unit's own Wahapedia page rather than the
 * faction-wide warscrolls index they were read from (issue #1860). The resolver owns that URL
 * derivation; see src/aos4/view/sourceLinks.ts.
 */
const reminderSources = createAos4ReminderSourceLinkResolver(AOS4_CATALOG)

/*
 * Every decoded faction can name itself, but only the ones that field units are offered. A stored
 * document naming a faction that is no longer on offer keeps its own name and leaves the selector
 * empty, the same way one from another rules context already does.
 */
const factionById = new Map(
  AOS4_CATALOG.entities.flatMap(entity => (entity.kind === 'faction' ? [[entity.id, entity] as const] : []))
)
const selectableFactions = armyFactions(AOS4_CATALOG)

const toFileName = (name: string) => `${name.trim().split(/\s+/).join('_') || 'AoS'}_Reminders`

/*
 * The masthead, mode switch, faction select, builder cards, and the seven toolbar buttons all sit
 * between the top of the document and the reminders, so reaching the content by keyboard means
 * tabbing past roughly a dozen controls. The link targets the reminders rather than <main>, because
 * <main> wraps the routed tree from the navbar down and skipping to it would move nothing.
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

const HomeContent = () => {
  const [initialLoad] = useState(loadDocument)
  const [document, setDocument] = useState(initialLoad.document)
  /*
   * Load-time missing-selection diagnostics belong to the document the load produced, and to it
   * alone. They wait here until the changelog artifact resolves, are consumed exactly once, and
   * are discarded by every explicit document replacement (import, share, cloud load, clear army,
   * faction select) — so removal records are never written to a replacement army, and a record the
   * user acknowledged is never re-recorded by a later re-run of the bookkeeping effect.
   */
  const pendingMissingSelectionIdsRef = useRef(initialLoad.missingSelectionIds)
  const [changelogArtifact, setChangelogArtifact] = useState<Aos4PublishedChangelog>()
  const [isGameMode, setIsGameMode] = useState(false)
  const [importModalIsOpen, setImportModalIsOpen] = useState(false)
  const [savedArmiesModalIsOpen, setSavedArmiesModalIsOpen] = useState(false)
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)
  const [pendingShareId, setPendingShareId] = useState(() => consumePendingShareId())
  const [printModalIsOpen, setPrintModalIsOpen] = useState(false)
  const savedArmiesAction = useSubscriberAction({
    featureName: 'My Armies',
    onAuthorized: () => setSavedArmiesModalIsOpen(true),
    origin: 'SavedArmies',
  })
  const shareAction = useSubscriberAction({
    featureName: 'Share Army',
    onAuthorized: () => setShareModalIsOpen(true),
    origin: 'ShareArmy',
  })
  const factions = useMemo(
    () =>
      selectableFactions
        .filter(faction => faction.rulesContextIds.includes(document.rulesContextId))
        .map(faction => ({ label: faction.name, value: faction.id }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [document.rulesContextId]
  )
  const builder = useMemo(() => createAos4BuilderViewModel(AOS4_CATALOG, document), [document])
  /*
   * Undecorated view models: what the print export and the projection-derived ID lists consume.
   * The changed markers are layered on separately below, because deriving them needs the projected
   * ability IDs this list defines — decorating in one pass would be circular.
   */
  const baseReminders = useMemo(() => createAos4ReminderViewModel(AOS4_CATALOG, document), [document])
  /*
   * The projected ability IDs are memoized on a cheap string signature rather than baseReminders,
   * so unrelated document edits (notes, hidden, order) keep the same array reference while the
   * projection's contents are unchanged.
   */
  const projectedAbilityIdsSignature = useMemo(
    () =>
      Array.from(new Set(baseReminders.flatMap(reminder => reminder.projected.abilityIds)))
        .sort()
        .join('\n'),
    [baseReminders]
  )
  const projectedAbilityIds = useMemo(
    () => (projectedAbilityIdsSignature ? projectedAbilityIdsSignature.split('\n') : []),
    [projectedAbilityIdsSignature]
  )
  const hiddenAbilityIds = useMemo(
    () =>
      Array.from(
        new Set(
          baseReminders.filter(reminder => reminder.hidden).flatMap(reminder => reminder.projected.abilityIds)
        )
      ).sort(),
    [baseReminders]
  )
  /*
   * The impacts are computed once here and shared by the reminder markers and the banner. The memo
   * reads the current document through a ref while keying on string signatures of the two document
   * fields the computation actually reads (explicit selections and changelog state), so note,
   * hidden, and order edits keep the previous impacts array.
   */
  const documentRef = useRef(document)
  documentRef.current = document
  const explicitSelectionsSignature = document.explicitSelectionIds.join('\n')
  const changelogStateSignature = JSON.stringify(document.changelog ?? null)
  const publicationImpacts = useMemo(
    () =>
      changelogArtifact
        ? computeAos4PublicationImpacts(changelogArtifact, {
            document: documentRef.current,
            projectedAbilityIds,
          })
        : undefined,
    [changelogArtifact, changelogStateSignature, explicitSelectionsSignature, projectedAbilityIds]
  )
  const reminderChanges = useMemo(
    () => (publicationImpacts ? aos4ReminderChangesByAbilityId(publicationImpacts) : undefined),
    [publicationImpacts]
  )
  const reminders = useMemo(
    () => withAos4ReminderChanges(baseReminders, reminderChanges),
    [baseReminders, reminderChanges]
  )
  // Memoized so AppBanner is not handed a fresh prop object literal on every render.
  const changelogBannerProps = useMemo(
    () => ({
      artifact: changelogArtifact,
      document,
      hiddenAbilityIds,
      impacts: publicationImpacts,
      isGameMode,
      projectedAbilityIds,
      setDocument,
    }),
    [changelogArtifact, document, hiddenAbilityIds, isGameMode, projectedAbilityIds, publicationImpacts]
  )
  const hiddenCount = reminders.filter(reminder => reminder.hidden).length
  const selectedFactionId = document.explicitSelectionIds.find(id =>
    factionById.has(id as CanonicalId<'faction'>)
  )
  const factionId = (selectedFactionId as CanonicalId<'faction'> | undefined) ?? AOS4_DEFAULT_FACTION_ID
  const factionName = factionById.get(factionId)?.name ?? 'Age of Sigmar 4'

  const handleDownloadPdf = async (
    presetId: PrintPreset['id'],
    pageSize: PrintPageSize,
    fileName: string,
    options: PrintDocumentOptions
  ) => {
    const {
      COMPACT_PRESET,
      STANDARD_PRESET,
      createAos4PrintDocument,
      createJsPdfMeasurer,
      planPrintLayout,
      renderPrintPlanToPdf,
      withPageSize,
    } = await import('../../aos4/print')
    // Undecorated: a printed sheet must not carry the transient rules-update markers.
    const printDocument = createAos4PrintDocument(
      baseReminders,
      {
        armyName: document.name,
        factionName,
        warscrolls: builder.warscrolls,
      },
      options
    )
    const selectedPreset = presetId === 'compact' ? COMPACT_PRESET : STANDARD_PRESET
    const preset = withPageSize(selectedPreset, pageSize)
    const plan = planPrintLayout(printDocument, preset, createJsPdfMeasurer())
    renderPrintPlanToPdf(plan, { title: printDocument.title }).save(`${fileName}.pdf`)
    logPdfDownload(presetId, pageSize)
  }

  useEffect(() => {
    try {
      saveAos4ArmyDocument(window.localStorage, document)
    } catch {
      // Browser storage can be unavailable in privacy modes. The in-memory document remains usable.
    }
  }, [document])

  /*
   * A rules update that moves an ability's timing moves its reminder occurrence ID, stranding any
   * hidden/note/order preference keyed on the old one. The migration is idempotent and returns the
   * same document instance when nothing is stranded, so riding setDocument here persists a remap
   * through the save effect above without ever looping.
   */
  useEffect(() => {
    const occurrences = baseReminders.map(reminder => ({
      id: reminder.id,
      abilityIds: reminder.projected.abilityIds,
    }))
    setDocument(current => migrateAos4ReminderPreferences(current, occurrences))
  }, [baseReminders])

  /*
   * The changelog artifact arrives by dynamic import so its bytes stay out of the entry chunk, and
   * it fails open: a rejected import means no banner and no bookkeeping, never a broken screen.
   */
  useEffect(() => {
    let cancelled = false
    import('../../aos4/generated/changelog/changelog.json')
      .then(module => {
        // The JSON import infers plain-string literal types; the ledger owns the real branded shape.
        if (!cancelled) setChangelogArtifact(module.default as unknown as Aos4PublishedChangelog)
      })
      .catch(error => {
        if (import.meta.env.DEV) console.warn('AoS4 changelog artifact failed to load', error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /*
   * Changelog bookkeeping rides the normal setDocument path, so it persists through the save
   * effect above. Three idempotent steps: removal records for selections the load path filtered
   * (consumed from the pending ref exactly once, and only for the document that produced them),
   * the silent rollout catch-up for documents that predate the changelog (stamp AND acknowledge,
   * so nothing skipped today resurfaces as news later), and the advance that clears the stamp
   * once nothing affecting this army remains unacknowledged. A stamp the artifact has no memory
   * of is left alone: the behind banner owns that catch-up path.
   */
  useEffect(() => {
    const artifact = changelogArtifact
    if (!artifact || artifact.revision === null) return
    const revision = artifact.revision
    const missingSelectionIds = pendingMissingSelectionIdsRef.current
    pendingMissingSelectionIdsRef.current = []
    setDocument(current => {
      let next = current
      missingSelectionIds.forEach(selectionId => {
        const explanation = findAos4ExplainingRemovedRecord(artifact.records, selectionId)
        const publicationId =
          explanation?.attribution.kind === 'publication' ? explanation.attribution.publicationId : undefined
        // A record whose publication was already acknowledged must stay cleared: re-recording it
        // here would resurrect it with no acknowledgement path left to clear it again.
        if (publicationId && (current.changelog?.acknowledgedPublicationIds ?? []).includes(publicationId)) {
          return
        }
        next = recordAos4RemovedSelection(next, {
          selectionId,
          detectedAtRevision: revision,
          ...(publicationId ? { publicationId } : {}),
        })
      })
      const stamp = next.changelog?.lastSeenRevision
      if (!stamp) {
        return catchUpAos4Changelog(next, {
          revision,
          retainedPublicationIds: artifact.retainedPublicationIds,
        })
      }
      if (resolveAos4ChangelogStampStatus(artifact, stamp).kind === 'unknown') return next
      const impacts = computeAos4PublicationImpacts(artifact, { document: next, projectedAbilityIds })
      return advanceAos4ChangelogStamp(next, {
        currentRevision: revision,
        retainedPublicationIds: artifact.retainedPublicationIds,
        affectingPublicationIds: impacts
          .filter(impact => impact.total > 0)
          .map(impact => impact.publication.publicationId),
      })
    })
  }, [changelogArtifact, initialLoad, projectedAbilityIds])

  const setSelections = (groupIds: CanonicalId[], selectedIds: CanonicalId[]) => {
    setDocument(current => {
      const group = new Set(groupIds)
      return deriveAos4OverlayFlags(
        AOS4_CATALOG,
        createAos4ArmyDocument({
          ...current,
          explicitSelectionIds: [
            ...current.explicitSelectionIds.filter(id => !group.has(id)),
            ...selectedIds,
          ],
        })
      )
    })
  }

  /*
   * Every explicit document replacement flows through here (or clears the ref itself), so pending
   * load-time diagnostics can never be written onto an army that did not produce them.
   */
  const replaceDocument = (nextDocument: Aos4ArmyDocument) => {
    pendingMissingSelectionIdsRef.current = []
    setDocument(nextDocument)
  }

  const clearArmy = () => {
    pendingMissingSelectionIdsRef.current = []
    setDocument(current =>
      createAos4ArmyDocument({
        ...current,
        explicitSelectionIds: [factionId],
        reminderPreferences: {},
      })
    )
  }

  const selectFaction = (nextFactionId: CanonicalId<'faction'>) => {
    const faction = factionById.get(nextFactionId)
    logFactionSelection(nextFactionId, faction?.name ?? 'Unknown faction')
    pendingMissingSelectionIdsRef.current = []
    setDocument(current =>
      createAos4ArmyDocument({
        ...current,
        name: faction?.name ?? current.name,
        explicitSelectionIds: [nextFactionId],
        reminderPreferences: {},
      })
    )
  }

  // The faction's Armies of Renown, offered as the top-level choice under the faction selector.
  // Picking one replaces the faction's regular rules, so switching drops explicit selections the
  // new army no longer offers (the established sub-faction switch behavior). Legends armies
  // (the White Dwarf Armies of Renown) stay offered under their own group header, like every
  // other dropdown's overlay content; picking one derives the document's Legends flag.
  const armiesOfRenown = useMemo(
    () =>
      builder.options
        .filter(option => option.groupType === 'army-of-renown')
        .map(option => ({
          label: option.name,
          value: option.id,
          ...(option.overlay ? { overlay: option.overlay } : {}),
        })),
    [builder]
  )
  const armyOfRenownId =
    document.explicitSelectionIds.find(id => armiesOfRenown.some(option => option.value === id)) ?? null

  const selectArmyOfRenown = (nextId: CanonicalId | null) => {
    setDocument(current => {
      const rootIds = new Set(armiesOfRenown.map(option => option.value))
      const withoutRoots = current.explicitSelectionIds.filter(id => !rootIds.has(id))
      const nextExplicit = nextId ? [...withoutRoots, nextId] : withoutRoots
      const probe = resolveSelection(AOS4_CATALOG, {
        explicitIds: nextExplicit,
        rulesContextId: current.rulesContextId,
        allowsLegends: true,
        allowsHistorical: true,
      })
      const stillOffered = new Set(probe.availableIds)
      return deriveAos4OverlayFlags(
        AOS4_CATALOG,
        createAos4ArmyDocument({
          ...current,
          explicitSelectionIds: nextExplicit.filter(
            id => id === nextId || factionById.has(id as CanonicalId<'faction'>) || stillOffered.has(id)
          ),
        })
      )
    })
  }

  const toggleGameMode = () => {
    const nextMode = !isGameMode
    setIsGameMode(nextMode)
    logGameModeChange(nextMode)
  }

  const showAll = () => {
    setDocument(current =>
      createAos4ArmyDocument({
        ...current,
        reminderPreferences: Object.fromEntries(
          Object.entries(current.reminderPreferences).flatMap(([id, preference]) => {
            if (!preference) return []
            return [[id, { ...preference, hidden: false }]]
          })
        ),
      })
    )
  }

  const toggleReminder = (reminder: Aos4ReminderViewModel) => {
    setDocument(current =>
      setAos4ReminderPreference(current, reminder.id, {
        hidden: !reminder.hidden,
      })
    )
  }

  const setReminderNote = (reminder: Aos4ReminderViewModel, note: string) => {
    setDocument(current =>
      setAos4ReminderPreference(current, reminder.id, {
        note,
      })
    )
  }

  const reorderReminders = (ordered: Aos4ReminderViewModel[]) => {
    setDocument(current =>
      createAos4ArmyDocument({
        ...current,
        reminderPreferences: ordered.reduce(
          (preferences, reminder, order) => ({
            ...preferences,
            [reminder.id]: {
              ...preferences[reminder.id],
              order,
            },
          }),
          current.reminderPreferences
        ),
      })
    )
  }

  return (
    <div>
      <SkipToReminders />

      <Header
        armiesOfRenown={armiesOfRenown}
        armyName={document.name}
        armyOfRenownId={armyOfRenownId}
        factionId={factionId}
        factions={factions}
        isGameMode={isGameMode}
        onArmyOfRenownChange={selectArmyOfRenown}
        onFactionChange={selectFaction}
        onToggleGameMode={toggleGameMode}
      />

      <AppBanner changelog={changelogBannerProps} />

      {!isGameMode && <ArmyBuilder builder={builder} onSetGroupSelections={setSelections} />}

      {!isGameMode && (
        <Toolbar
          hiddenCount={hiddenCount}
          onClearArmy={clearArmy}
          onDownloadPdf={() => setPrintModalIsOpen(true)}
          onImportArmy={() => setImportModalIsOpen(true)}
          onOpenSavedArmies={savedArmiesAction.run}
          onShareArmy={shareAction.run}
          onShowAll={showAll}
          subscriberActionDisabled={savedArmiesAction.disabled || shareAction.disabled}
        />
      )}

      <Reminders
        getSources={reminderSources}
        isGameMode={isGameMode}
        onHide={toggleReminder}
        onNote={setReminderNote}
        onReorder={reorderReminders}
        reminders={reminders}
      />

      <Footer />

      {printModalIsOpen && (
        <Suspense fallback={null}>
          <PrintModal
            closeModal={() => setPrintModalIsOpen(false)}
            defaultFileName={toFileName(document.name)}
            isOpen={printModalIsOpen}
            onDownloadPdf={handleDownloadPdf}
          />
        </Suspense>
      )}

      {importModalIsOpen && (
        <Suspense fallback={null}>
          <ImportArmyModal
            closeModal={() => setImportModalIsOpen(false)}
            isOpen={importModalIsOpen}
            onApply={nextDocument => {
              replaceDocument(nextDocument)
              setImportModalIsOpen(false)
            }}
          />
        </Suspense>
      )}

      {savedArmiesModalIsOpen && (
        <Suspense fallback={null}>
          <SavedArmiesModal
            closeModal={() => setSavedArmiesModalIsOpen(false)}
            currentDocument={document}
            isOpen={savedArmiesModalIsOpen}
            onApply={replaceDocument}
          />
        </Suspense>
      )}

      {shareModalIsOpen && (
        <Suspense fallback={null}>
          <ShareArmyModal
            closeModal={() => setShareModalIsOpen(false)}
            document={document}
            isOpen={shareModalIsOpen}
          />
        </Suspense>
      )}

      {pendingShareId && (
        <Suspense fallback={null}>
          <SharedArmyModal
            closeModal={() => setPendingShareId(undefined)}
            isOpen
            onApply={replaceDocument}
            shareId={pendingShareId}
          />
        </Suspense>
      )}
    </div>
  )
}

const Home = () => (
  <ArmyCollectionProvider>
    <HomeContent />
  </ArmyCollectionProvider>
)

export default Home
