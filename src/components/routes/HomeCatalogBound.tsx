import type { CanonicalId } from '../../aos4/domain'
import { AOS4_CATALOG, loadAos4SourceData } from '../../aos4/generated'
import type { PrintDocumentOptions } from '../../aos4/print/document'
import type { PrintPageSize } from '../../aos4/print/presets'
import type { PrintPreset } from '../../aos4/print/types'
import {
  createDefaultAos4ArmyDocument,
  deriveAos4OverlayFlags,
  loadAos4ArmyDocument,
} from '../../aos4/runtime'
import { resolveSelection } from '../../aos4/select'
import {
  createAos4ArmyDocument,
  serializeAos4ArmyDocument,
  setAos4ReminderPreference,
  type Aos4ArmyDocument,
} from '../../aos4/state'
import {
  createAos4BuilderViewModel,
  createAos4ReminderSourceLinkResolver,
  createAos4ReminderViewModel,
  migrateAos4ReminderPreferences,
  type Aos4ReminderViewModel,
} from '../../aos4/view'
import Reminders, { type ReminderSourceLink } from 'components/info/reminders'
import ArmyBuilder from 'components/input/army_builder'
import { useSubscriberAction } from 'components/input/importArmy/subscriberAction'
import Toolbar from 'components/input/toolbar/toolbar'
import { messageForError, useArmyCollection } from 'context/useArmyCollection'
import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { logPdfDownload } from 'utils/analytics'
import { clearCloudArmyLink, readCloudArmyLink, writeCloudArmyLink } from 'utils/cloudArmyLink'

/*
 * Everything on Home shaped `f(catalog, …)`. Home itself is the catalog-free shell that loads this
 * behind `lazy()`, so the rules corpus is off the route chunk's static import graph and off the
 * first-paint path.
 *
 * The document, the faction, the game mode, and the incoming share id all belong to the shell,
 * which paints the masthead from them before this half exists; they arrive here as props. What
 * travels the other way is the Armies of Renown slot and the cloud-army unlink — what the shell's
 * own masthead needs and only the catalog can produce — published upward as one object.
 */

const ImportArmyModal = lazy(() => import('components/input/importArmy/importArmyModal'))
const PrintModal = lazy(() => import('components/print/printModal'))
const ClearArmyModal = lazy(() => import('components/modals/generic/generic_destructive_modal'))
const SaveArmyModal = lazy(() => import('components/input/cloudArmies/saveArmyModal'))
const SavedArmiesModal = lazy(() => import('components/input/cloudArmies/savedArmiesModal'))
const ShareArmyModal = lazy(() => import('components/input/armySharing/shareArmyModal'))
const SharedArmyModal = lazy(() => import('components/input/armySharing/sharedArmyModal'))

const loadDocument = (): { document: Aos4ArmyDocument; unchangedFromStorage: boolean } => {
  try {
    const result = loadAos4ArmyDocument(window.localStorage, AOS4_CATALOG)
    return {
      document: result.document,
      /*
       * The common case, named so the shell does not have to serialize two documents to detect it:
       * the same stored bytes the shell already parsed structurally, canonicalized the same way,
       * with nothing pruned and no context complaint — value-identical to what is on screen.
       */
      unchangedFromStorage: result.source === 'storage' && result.diagnostics.length === 0,
    }
  } catch {
    return { document: createDefaultAos4ArmyDocument(), unchangedFromStorage: false }
  }
}

/*
 * Every modal on this screen is its own lazy chunk, and each fails on its own terms. Without this
 * boundary, a modal chunk that could not be fetched — a tab one deploy behind asking for a retired
 * asset — threw past the modal's `Suspense` to `CatalogBoundary`, which unmounted a fully working
 * army, announced "Your army could not be loaded", and disabled the faction selector for good. The
 * army was fine; only the modal was missing, and that is all the failure is allowed to mean now.
 *
 * Mounted only while its modal is open, so closing discards the caught state and the next open
 * starts clean. `lazy()` retains a rejected import for the life of the module, so the honest way
 * back is the reload the alert names.
 */
class ModalBoundary extends Component<{ children: ReactNode; onFailed: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onFailed()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

const MODAL_CHUNK_ERROR = 'That window could not be opened. Reload the page and try again.'

/*
 * Warscroll-ability records deep-link to their unit's own Wahapedia page rather than the
 * faction-wide warscrolls index they were read from (issue #1860). The resolver owns that URL
 * derivation; see src/aos4/view/sourceLinks.ts.
 *
 * The records themselves ship in their own chunk, fetched the first time a player opens a source
 * menu. Both `loadAos4SourceData` and the resolver are built once and shared from then on, so the
 * hundredth menu costs a map lookup.
 */
let resolveSourceLinks: ReturnType<typeof createAos4ReminderSourceLinkResolver> | undefined
const reminderSources = (reminder: Aos4ReminderViewModel): Promise<ReminderSourceLink[]> =>
  loadAos4SourceData().then(sources => {
    resolveSourceLinks ??= createAos4ReminderSourceLinkResolver(sources)
    return resolveSourceLinks(reminder)
  })

/*
 * Every decoded faction can name itself, but only the ones that field units are offered. A stored
 * document naming a faction that is no longer on offer keeps its own name and leaves the selector
 * empty, the same way one from another rules context already does.
 */
const factionById = new Map(
  AOS4_CATALOG.entities.flatMap(entity => (entity.kind === 'faction' ? [[entity.id, entity] as const] : []))
)

const toFileName = (name: string) => `${name.trim().split(/\s+/).join('_') || 'AoS'}_Reminders`

const sameArmiesOfRenown = (
  left: Aos4CatalogBoundBindings['armiesOfRenown'],
  right: Aos4CatalogBoundBindings['armiesOfRenown']
) =>
  left.length === right.length &&
  left.every((army, index) => {
    const other = right[index]
    return army.label === other.label && army.value === other.value && army.overlay === other.overlay
  })

/**
 * What the shell's masthead needs from this half. `armiesOfRenown` is derived from
 * `builder.options` and the change handler resolves a selection against the catalog, so neither can
 * be computed in a shell that has no catalog; `unlinkCloudArmy` is here because the toolbar state
 * it clears is here. They publish as one object so a change costs the shell a single render.
 */
export interface Aos4CatalogBoundBindings {
  armiesOfRenown: Array<{
    label: string
    value: CanonicalId
    overlay?: 'legends' | 'historical'
  }>
  armyOfRenownId: CanonicalId | null
  onArmyOfRenownChange: (armyOfRenownId: CanonicalId | null) => void
  unlinkCloudArmy: () => void
}

interface HomeCatalogBoundProps {
  document: Aos4ArmyDocument
  factionId: CanonicalId<'faction'>
  isGameMode: boolean
  onBindingsChange: (bindings: Aos4CatalogBoundBindings | undefined) => void
  onDismissPendingShare: () => void
  onDocumentChange: Dispatch<SetStateAction<Aos4ArmyDocument>>
  onDocumentValidated: (document: Aos4ArmyDocument, unchangedFromStorage: boolean) => void
  pendingShareId: string | undefined
}

const HomeCatalogBound = ({
  document,
  factionId,
  isGameMode,
  onBindingsChange,
  onDismissPendingShare,
  onDocumentChange: setDocument,
  onDocumentValidated,
  pendingShareId,
}: HomeCatalogBoundProps) => {
  const { armies, collectionLoaded, ensureArmiesLoaded, updateArmy } = useArmyCollection()
  const [importModalIsOpen, setImportModalIsOpen] = useState(false)
  const [savedArmiesModalIsOpen, setSavedArmiesModalIsOpen] = useState(false)
  const [saveArmyModalIsOpen, setSaveArmyModalIsOpen] = useState(false)
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)
  const [clearArmyModalIsOpen, setClearArmyModalIsOpen] = useState(false)
  const [printModalIsOpen, setPrintModalIsOpen] = useState(false)
  const [modalLoadError, setModalLoadError] = useState<string>()
  /*
   * Which cloud army the current document is a copy of, if any. It links through the save/load
   * flows and unlinks when the document stops being that army (clear, faction switch, import,
   * incoming share, remote delete). It decides whether the toolbar offers one-click Update Army
   * alongside Save As, or a single Save Army.
   *
   * Persisted, because the document it describes is. Holding it in memory alone meant every reload
   * — a service-worker update, a backgrounded tab, a phone reclaiming the page — silently dropped
   * back to Save Army, and the next save forked a duplicate of the army the player thought they
   * were updating. See utils/cloudArmyLink.
   */
  const [cloudArmyLink, setCloudArmyLink] = useState(readCloudArmyLink)
  const cloudArmyId = cloudArmyLink?.id
  const cloudArmyName = cloudArmyLink?.name
  /*
   * Whether the army on screen has moved away from the copy on the account. Update Army is offered
   * only when it has something to write — the same absent-rather-than-disabled rule Show Hidden
   * follows. A link stored before signatures existed has none, and reports changed: offering a save
   * that may be unnecessary is the safe side of that guess.
   */
  const cloudArmyHasChanges =
    Boolean(cloudArmyId) && serializeAos4ArmyDocument(document) !== cloudArmyLink?.savedSignature
  const [updateArmyStatus, setUpdateArmyStatus] = useState<'idle' | 'updating' | 'updated'>('idle')
  const [updateArmyError, setUpdateArmyError] = useState<string>()
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
  const saveArmyAction = useSubscriberAction({
    featureName: 'Save Army',
    onAuthorized: () => setSaveArmyModalIsOpen(true),
    origin: 'SaveArmy',
  })
  /*
   * Called at every point the local document becomes a copy of a cloud army — loaded, saved, saved
   * as, or updated — and records what that copy looked like, so the toolbar can tell later whether
   * it has moved.
   */
  const linkCloudArmy = (id: string, name: string, savedDocument: Aos4ArmyDocument) => {
    const link = { id, name, savedSignature: serializeAos4ArmyDocument(savedDocument) }
    setCloudArmyLink(link)
    writeCloudArmyLink(link)
    setUpdateArmyError(undefined)
  }
  const updateCloudArmy = async () => {
    if (!cloudArmyId || !cloudArmyName) return
    setUpdateArmyStatus('updating')
    setUpdateArmyError(undefined)
    try {
      await updateArmy(cloudArmyId, document)
      // The army on screen is now what the account holds, so it becomes the new baseline.
      linkCloudArmy(cloudArmyId, cloudArmyName, document)
      setUpdateArmyStatus('updated')
    } catch (error) {
      setUpdateArmyStatus('idle')
      setUpdateArmyError(messageForError(error))
    }
  }
  const updateArmyAction = useSubscriberAction({
    featureName: 'Update Army',
    onAuthorized: () => void updateCloudArmy(),
    origin: 'UpdateArmy',
  })
  // Stable, because the shell holds on to it: a faction picked in the masthead has to unlink the
  // cloud army, and the masthead is above this component.
  const unlinkCloudArmy = useCallback(() => {
    setCloudArmyLink(undefined)
    clearCloudArmyLink()
    setUpdateArmyError(undefined)
  }, [])

  useEffect(() => {
    if (updateArmyStatus !== 'updated') return
    const timer = window.setTimeout(() => setUpdateArmyStatus('idle'), 2500)
    return () => window.clearTimeout(timer)
  }, [updateArmyStatus])

  /*
   * Nothing else on this screen needs the collection, and it is deliberately not fetched on mount,
   * so a link restored from storage would sit unreconciled until the player happened to open a
   * modal — offering Update Army against a record deleted on another device, and failing with
   * "Army not found." every time it was pressed. The link is the one thing here that has a question
   * only the account can answer, so it is the one thing that asks (issue #1965).
   */
  useEffect(() => {
    if (!cloudArmyId) return
    void ensureArmiesLoaded()
  }, [cloudArmyId, ensureArmiesLoaded])

  /*
   * A link restored from storage can name an army deleted on another device. Reconciled only
   * against a collection that actually loaded — an empty list is also what a failed fetch and an
   * unfetched one look like, and unlinking on that would undo the persistence this exists to
   * provide. `collectionLoaded` separates those from an account that genuinely holds no armies,
   * which is exactly the state left behind when the linked record was the last one deleted.
   */
  useEffect(() => {
    if (!cloudArmyId || !collectionLoaded) return
    const linked = armies.find(army => army.id === cloudArmyId)
    if (!linked) {
      setCloudArmyLink(undefined)
      clearCloudArmyLink()
      // The banner names a write to this record. Once the record is gone the banner is about
      // nothing, and it has no dismiss of its own.
      setUpdateArmyError(undefined)
      return
    }
    // A rename in My Armies must reach the label the toolbar shows for the same record. The
    // signature is left alone: renaming the saved army does not change the army on screen.
    if (linked.document.name === cloudArmyName) return
    setCloudArmyLink(current => {
      if (!current) return current
      const link = { ...current, name: linked.document.name }
      writeCloudArmyLink(link)
      return link
    })
  }, [armies, cloudArmyId, cloudArmyName, collectionLoaded])

  /*
   * The catalog's own answer to what storage held, run once on mount. The shell painted from a
   * document deserialized without a catalog — no rules-context check, no pruning of selections a
   * battletome rewrite has retired — so this is the first point at which either can happen. The
   * shell decides whether to take it: a faction the player picked while waiting is newer than
   * anything storage holds.
   */
  useEffect(() => {
    const { document: validated, unchangedFromStorage } = loadDocument()
    onDocumentValidated(validated, unchangedFromStorage)
  }, [onDocumentValidated])

  const builder = useMemo(() => createAos4BuilderViewModel(AOS4_CATALOG, document), [document])
  const reminders = useMemo(() => createAos4ReminderViewModel(AOS4_CATALOG, document), [document])
  const hiddenCount = reminders.filter(reminder => reminder.hidden).length
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
    const printDocument = createAos4PrintDocument(
      reminders,
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

  /*
   * A rules update that moves an ability's timing moves its reminder occurrence ID, stranding any
   * hidden/note/order preference keyed on the old one. The migration is idempotent and returns the
   * same document instance when nothing is stranded, so riding setDocument here persists a remap
   * through the save effect above without ever looping.
   */
  useEffect(() => {
    const occurrences = reminders.map(reminder => ({
      id: reminder.id,
      abilityIds: reminder.projected.abilityIds,
    }))
    setDocument(current => migrateAos4ReminderPreferences(current, occurrences))
  }, [reminders])

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

  const clearArmy = () => {
    unlinkCloudArmy()
    setDocument(current =>
      createAos4ArmyDocument({
        ...current,
        explicitSelectionIds: [factionId],
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

  const selectArmyOfRenown = useCallback(
    (nextId: CanonicalId | null) => {
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
    },
    [armiesOfRenown, setDocument]
  )

  /*
   * A layout effect rather than an effect, because this also fires on every faction switch: an
   * effect would let the browser paint the outgoing faction's Armies of Renown once — or its row
   * disappearing a frame late — before the new list reached the masthead.
   */
  const publishedBindings = useRef<Aos4CatalogBoundBindings | undefined>(undefined)
  useLayoutEffect(() => {
    /*
     * Publish by value, not by identity. The list is rebuilt — a fresh array — for every document
     * change, so publishing unconditionally cost the shell (and this whole half under it, which is
     * not memoized) a synchronous extra render pass per keystroke commit, hide, and reorder.
     * Skipping leaves the shell holding the previous change handler, which closed over a
     * value-identical list, so nothing observable is withheld.
     */
    const previous = publishedBindings.current
    if (
      previous &&
      previous.armyOfRenownId === armyOfRenownId &&
      previous.unlinkCloudArmy === unlinkCloudArmy &&
      sameArmiesOfRenown(previous.armiesOfRenown, armiesOfRenown)
    ) {
      return
    }
    const bindings = {
      armiesOfRenown,
      armyOfRenownId,
      onArmyOfRenownChange: selectArmyOfRenown,
      unlinkCloudArmy,
    }
    publishedBindings.current = bindings
    onBindingsChange(bindings)
  }, [armiesOfRenown, armyOfRenownId, onBindingsChange, selectArmyOfRenown, unlinkCloudArmy])

  /*
   * Withdraw them on the way out. Publishing upward means the shell holds handlers and a list that
   * only make sense while this component is mounted, and a component behind an error boundary can
   * stop being mounted after it has already published — a render that throws here leaves the shell
   * still offering a live Army of Renown select over a region showing `OfflineArmy`, and a skip link
   * pointing at an `#aos4-reminders` that no longer exists.
   *
   * A separate mount/unmount effect, and not a cleanup on the layout effect above, deliberately.
   * That one re-runs on every faction switch, so its cleanup would blank the bindings and flash the
   * shell's reserved "Loading..." placeholder back into the masthead each time — reintroducing the
   * layout shift the reservation exists to prevent. This one depends on a setter the shell keeps
   * stable, so it runs exactly twice in a mount's life.
   */
  useEffect(() => () => onBindingsChange(undefined), [onBindingsChange])

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
    <>
      {!isGameMode && <ArmyBuilder builder={builder} onSetGroupSelections={setSelections} />}

      {!isGameMode && (
        <Toolbar
          cloudArmyLinked={Boolean(cloudArmyId)}
          {...(cloudArmyName ? { cloudArmyName } : {})}
          cloudArmyHasChanges={cloudArmyHasChanges}
          hiddenCount={hiddenCount}
          onClearArmy={() => setClearArmyModalIsOpen(true)}
          onDownloadPdf={() => setPrintModalIsOpen(true)}
          onImportArmy={() => setImportModalIsOpen(true)}
          onOpenSavedArmies={savedArmiesAction.run}
          onSaveArmy={saveArmyAction.run}
          onShareArmy={shareAction.run}
          onShowAll={showAll}
          onUpdateArmy={updateArmyAction.run}
          subscriberActionDisabled={savedArmiesAction.disabled || shareAction.disabled}
          updateArmyStatus={updateArmyStatus}
        />
      )}

      {!isGameMode && updateArmyError && (
        <div className="container d-print-none">
          <div className="alert alert-danger" role="alert">
            {updateArmyError}
          </div>
        </div>
      )}

      {modalLoadError && (
        <div className="container d-print-none">
          <div className="alert alert-warning" role="alert">
            {modalLoadError}
          </div>
        </div>
      )}

      <Reminders
        getSources={reminderSources}
        isGameMode={isGameMode}
        onHide={toggleReminder}
        onNote={setReminderNote}
        onReorder={reorderReminders}
        reminders={reminders}
      />

      {printModalIsOpen && (
        <ModalBoundary
          onFailed={() => {
            setPrintModalIsOpen(false)
            setModalLoadError(MODAL_CHUNK_ERROR)
          }}
        >
          <Suspense fallback={null}>
            <PrintModal
              closeModal={() => setPrintModalIsOpen(false)}
              defaultFileName={toFileName(document.name)}
              isOpen={printModalIsOpen}
              onDownloadPdf={handleDownloadPdf}
            />
          </Suspense>
        </ModalBoundary>
      )}

      {importModalIsOpen && (
        <ModalBoundary
          onFailed={() => {
            setImportModalIsOpen(false)
            setModalLoadError(MODAL_CHUNK_ERROR)
          }}
        >
          <Suspense fallback={null}>
            <ImportArmyModal
              closeModal={() => setImportModalIsOpen(false)}
              isOpen={importModalIsOpen}
              onApply={nextDocument => {
                unlinkCloudArmy()
                setDocument(nextDocument)
                setImportModalIsOpen(false)
              }}
            />
          </Suspense>
        </ModalBoundary>
      )}

      {savedArmiesModalIsOpen && (
        <ModalBoundary
          onFailed={() => {
            setSavedArmiesModalIsOpen(false)
            setModalLoadError(MODAL_CHUNK_ERROR)
          }}
        >
          <Suspense fallback={null}>
            <SavedArmiesModal
              closeModal={() => setSavedArmiesModalIsOpen(false)}
              isOpen={savedArmiesModalIsOpen}
              {...(cloudArmyId ? { linkedCloudArmyId: cloudArmyId } : {})}
              onApply={setDocument}
              onDeleted={deletedId => {
                if (deletedId === cloudArmyId) unlinkCloudArmy()
              }}
              onLinked={linkCloudArmy}
            />
          </Suspense>
        </ModalBoundary>
      )}

      {saveArmyModalIsOpen && (
        <ModalBoundary
          onFailed={() => {
            setSaveArmyModalIsOpen(false)
            setModalLoadError(MODAL_CHUNK_ERROR)
          }}
        >
          <Suspense fallback={null}>
            <SaveArmyModal
              closeModal={() => setSaveArmyModalIsOpen(false)}
              currentDocument={document}
              isOpen={saveArmyModalIsOpen}
              onSaved={(savedDocument, savedCloudArmyId, savedName) => {
                setDocument(savedDocument)
                linkCloudArmy(savedCloudArmyId, savedName, savedDocument)
              }}
            />
          </Suspense>
        </ModalBoundary>
      )}

      {shareModalIsOpen && (
        <ModalBoundary
          onFailed={() => {
            setShareModalIsOpen(false)
            setModalLoadError(MODAL_CHUNK_ERROR)
          }}
        >
          <Suspense fallback={null}>
            <ShareArmyModal
              closeModal={() => setShareModalIsOpen(false)}
              document={document}
              isOpen={shareModalIsOpen}
            />
          </Suspense>
        </ModalBoundary>
      )}

      {pendingShareId && (
        /*
         * The one failure handler here that must not close what it guards: dismissing the share
         * clears the sessionStorage id, and losing the chunk is not the player declining. The id
         * stays put, so the reload the alert asks for finds the share and offers it again.
         */
        <ModalBoundary onFailed={() => setModalLoadError(MODAL_CHUNK_ERROR)}>
          <Suspense fallback={null}>
            <SharedArmyModal
              closeModal={onDismissPendingShare}
              isOpen
              onApply={nextDocument => {
                unlinkCloudArmy()
                setDocument(nextDocument)
              }}
              shareId={pendingShareId}
            />
          </Suspense>
        </ModalBoundary>
      )}

      {/*
       * Clear Army fired on one tap and took the notes, hidden flags and ordering with it — the
       * only content on this screen the player wrote themselves, and the only one with no copy
       * anywhere else. It is the one action here that earns an interruption.
       */}
      {clearArmyModalIsOpen && (
        <ModalBoundary
          onFailed={() => {
            setClearArmyModalIsOpen(false)
            setModalLoadError(MODAL_CHUNK_ERROR)
          }}
        >
          <Suspense fallback={null}>
            <ClearArmyModal
              bodyText="This empties the builder and discards the notes, hidden reminders, and ordering you set for this army. Armies saved to your account are not affected."
              closeModal={() => setClearArmyModalIsOpen(false)}
              confirmText="Clear army"
              denyText="Keep it"
              headerText="Clear this army?"
              isOpen={clearArmyModalIsOpen}
              onConfirm={clearArmy}
            />
          </Suspense>
        </ModalBoundary>
      )}
    </>
  )
}

export default HomeCatalogBound
