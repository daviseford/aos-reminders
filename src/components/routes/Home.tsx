import { armyFactions, type CanonicalId } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_FACTION_ID } from '../../aos4/generated'
import type { PrintPageSize } from '../../aos4/print/presets'
import type { PrintPreset } from '../../aos4/print/types'
import {
  createDefaultAos4ArmyDocument,
  deriveAos4OverlayFlags,
  loadAos4ArmyDocument,
  saveAos4ArmyDocument,
} from '../../aos4/runtime'
import { resolveSelection } from '../../aos4/select'
import { createAos4ArmyDocument, setAos4ReminderPreference, type Aos4ArmyDocument } from '../../aos4/state'
import {
  createAos4BuilderViewModel,
  createAos4ReminderSourceLinkResolver,
  createAos4ReminderViewModel,
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
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { logFactionSelection, logGameModeChange, logPdfDownload } from 'utils/analytics'
import { consumePendingShareId } from 'utils/shareLink'

const ImportArmyModal = lazy(() => import('components/input/importArmy/importArmyModal'))
const PrintModal = lazy(() => import('components/print/printModal'))
const SavedArmiesModal = lazy(() => import('components/input/cloudArmies/savedArmiesModal'))
const ShareArmyModal = lazy(() => import('components/input/armySharing/shareArmyModal'))
const SharedArmyModal = lazy(() => import('components/input/armySharing/sharedArmyModal'))

const loadDocument = (): Aos4ArmyDocument => {
  try {
    return loadAos4ArmyDocument(window.localStorage, AOS4_CATALOG).document
  } catch {
    return createDefaultAos4ArmyDocument()
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
  const [document, setDocument] = useState(loadDocument)
  const [isGameMode, setIsGameMode] = useState(false)
  const [importModalIsOpen, setImportModalIsOpen] = useState(false)
  const [savedArmiesModalIsOpen, setSavedArmiesModalIsOpen] = useState(false)
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)
  const [pendingShareId, setPendingShareId] = useState(() => consumePendingShareId())
  const [printModalIsOpen, setPrintModalIsOpen] = useState(false)
  const savedArmiesAction = useSubscriberAction({
    onAuthorized: () => setSavedArmiesModalIsOpen(true),
    origin: 'SavedArmies',
  })
  const shareAction = useSubscriberAction({
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
  const reminders = useMemo(() => createAos4ReminderViewModel(AOS4_CATALOG, document), [document])
  const hiddenCount = reminders.filter(reminder => reminder.hidden).length
  const selectedFactionId = document.explicitSelectionIds.find(id =>
    factionById.has(id as CanonicalId<'faction'>)
  )
  const factionId = (selectedFactionId as CanonicalId<'faction'> | undefined) ?? AOS4_DEFAULT_FACTION_ID
  const factionName = factionById.get(factionId)?.name ?? 'Age of Sigmar 4'

  const handleDownloadPdf = async (
    presetId: PrintPreset['id'],
    pageSize: PrintPageSize,
    fileName: string
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
    const printDocument = createAos4PrintDocument(reminders, {
      armyName: document.name,
      factionName,
      warscrolls: builder.warscrolls,
    })
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

      <AppBanner />

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
              setDocument(nextDocument)
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
            onApply={setDocument}
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
            onApply={setDocument}
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
