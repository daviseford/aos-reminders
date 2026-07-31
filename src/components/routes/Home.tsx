import { armyFactions, type CanonicalId, type SourceArtifact } from '../../aos4/domain'
import { AOS4_CATALOG, AOS4_DEFAULT_FACTION_ID } from '../../aos4/generated'
import type { PrintPageSize } from '../../aos4/print/presets'
import type { PrintPreset } from '../../aos4/print/types'
import {
  createDefaultAos4ArmyDocument,
  loadAos4ArmyDocument,
  saveAos4ArmyDocument,
  setAos4OverlayFlag,
  type Aos4OverlayFlag,
} from '../../aos4/runtime'
import { createAos4ArmyDocument, setAos4ReminderPreference, type Aos4ArmyDocument } from '../../aos4/state'
import {
  createAos4BuilderViewModel,
  createAos4ReminderViewModel,
  type Aos4ReminderViewModel,
} from '../../aos4/view'
import AppBanner from 'components/info/banners/app_banner'
import Reminders, { REMINDERS_ANCHOR_ID, type ReminderSourceLink } from 'components/info/reminders'
import ArmyBuilder from 'components/input/army_builder'
import { useSubscriberAction } from 'components/input/importArmy/subscriberAction'
import Toolbar from 'components/input/toolbar/toolbar'
import Footer from 'components/page/footer'
import { Header } from 'components/page/homeHeader'
import { ArmyCollectionProvider } from 'context/useArmyCollection'
import { useTheme } from 'context/useTheme'
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

const sourceArtifactById = new Map(AOS4_CATALOG.sourceArtifacts.map(artifact => [artifact.id, artifact]))
const sourceArtifactByRecordId = new Map(
  AOS4_CATALOG.sourceRecords.flatMap(record => {
    const artifact = sourceArtifactById.get(record.artifactId)
    return artifact ? [[String(record.id), artifact] as const] : []
  })
)

const sourceLabel = (artifact: SourceArtifact): string => {
  if (artifact.publisher === 'games-workshop') return artifact.title || 'Games Workshop'
  if (artifact.publisher === 'wahapedia') return artifact.title || 'Wahapedia'
  return artifact.title || 'Source'
}

const reminderSources = (reminder: Aos4ReminderViewModel): ReminderSourceLink[] =>
  Array.from(
    new Map(
      reminder.sourceRecordIds.flatMap(id => {
        const artifact = sourceArtifactByRecordId.get(id)
        if (!artifact) return []
        return [
          [
            artifact.id,
            {
              id: artifact.id,
              label: sourceLabel(artifact),
              ...(artifact.sourceUrl.startsWith('http') ? { href: artifact.sourceUrl } : {}),
              official: artifact.publisher === 'games-workshop',
            },
          ] as const,
        ]
      })
    ).values()
  )

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

type OverlayTogglesProps = {
  document: Aos4ArmyDocument
  onToggle: (flag: Aos4OverlayFlag, enabled: boolean) => void
}

const OverlayToggles = ({ document, onToggle }: OverlayTogglesProps) => {
  const { theme } = useTheme()
  return (
    <div className="container-fluid d-flex justify-content-center flex-wrap gap-4 pt-3">
      <div className="form-check form-switch">
        <input
          checked={Boolean(document.allowsLegends)}
          className="form-check-input"
          id="toggle-allows-legends"
          onChange={event => onToggle('allowsLegends', event.target.checked)}
          role="switch"
          type="checkbox"
        />
        <label className={`form-check-label ${theme.text}`} htmlFor="toggle-allows-legends">
          Include Legends units
        </label>
      </div>
      <div className="form-check form-switch">
        <input
          checked={Boolean(document.allowsHistorical)}
          className="form-check-input"
          id="toggle-allows-historical"
          onChange={event => onToggle('allowsHistorical', event.target.checked)}
          role="switch"
          type="checkbox"
        />
        <label className={`form-check-label ${theme.text}`} htmlFor="toggle-allows-historical">
          Include Scourge of Ghyran (2025-26)
        </label>
      </div>
    </div>
  )
}

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
      return createAos4ArmyDocument({
        ...current,
        explicitSelectionIds: [...current.explicitSelectionIds.filter(id => !group.has(id)), ...selectedIds],
      })
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

  const handleOverlayToggle = (flag: Aos4OverlayFlag, enabled: boolean) => {
    setDocument(current => setAos4OverlayFlag(AOS4_CATALOG, current, flag, enabled))
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
        armyName={document.name}
        factionId={factionId}
        factions={factions}
        isGameMode={isGameMode}
        onFactionChange={selectFaction}
        onToggleGameMode={toggleGameMode}
      />

      <AppBanner />

      {!isGameMode && <OverlayToggles document={document} onToggle={handleOverlayToggle} />}

      {!isGameMode && <ArmyBuilder builder={builder} onSetGroupSelections={setSelections} />}

      {!isGameMode && (
        <Toolbar
          hiddenCount={hiddenCount}
          onClearArmy={clearArmy}
          onDownloadPdf={() => setPrintModalIsOpen(true)}
          onImportArmy={() => setImportModalIsOpen(true)}
          onOpenSavedArmies={savedArmiesAction.run}
          onResetArmy={() => setDocument(createDefaultAos4ArmyDocument())}
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
