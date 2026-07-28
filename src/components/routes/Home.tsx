import type { CanonicalId, SourceArtifact } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { createDefaultAos4ArmyDocument, loadAos4ArmyDocument, saveAos4ArmyDocument } from '../../aos4/runtime'
import { createAos4ArmyDocument, setAos4ReminderPreference, type Aos4ArmyDocument } from '../../aos4/state'
import {
  createAos4BuilderViewModel,
  createAos4ReminderViewModel,
  type Aos4ReminderViewModel,
} from '../../aos4/view'
import Reminders, { type ReminderSourceLink } from 'components/info/reminders'
import ArmyBuilder from 'components/input/army_builder'
import Toolbar from 'components/input/toolbar/toolbar'
import Footer from 'components/page/footer'
import { Header } from 'components/page/homeHeader'
import { useEffect, useMemo, useState } from 'react'

const loadDocument = (): Aos4ArmyDocument => {
  try {
    return loadAos4ArmyDocument(window.localStorage, AOS4_CATALOG).document
  } catch {
    return createDefaultAos4ArmyDocument()
  }
}

const sourceArtifactByRecordId = new Map(
  AOS4_CATALOG.sourceRecords.flatMap(record => {
    const artifact = AOS4_CATALOG.sourceArtifacts.find(candidate => candidate.id === record.artifactId)
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

const factionName = AOS4_CATALOG.entities.find(entity => entity.kind === 'faction')?.name ?? 'Age of Sigmar 4'

const Home = () => {
  const [document, setDocument] = useState(loadDocument)
  const [isGameMode, setIsGameMode] = useState(false)
  const builder = useMemo(() => createAos4BuilderViewModel(AOS4_CATALOG, document), [document])
  const reminders = useMemo(() => createAos4ReminderViewModel(AOS4_CATALOG, document), [document])
  const hiddenCount = reminders.filter(reminder => reminder.hidden).length

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
    const factionIds = AOS4_CATALOG.entities
      .filter(entity => entity.kind === 'faction')
      .map(entity => entity.id)
    setDocument(current =>
      createAos4ArmyDocument({
        ...current,
        explicitSelectionIds: factionIds,
        reminderPreferences: {},
      })
    )
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
      <Header
        armyName={document.name}
        factionName={factionName}
        isGameMode={isGameMode}
        onToggleGameMode={() => setIsGameMode(current => !current)}
      />

      {!isGameMode && <ArmyBuilder builder={builder} onSetGroupSelections={setSelections} />}

      {!isGameMode && (
        <Toolbar
          hiddenCount={hiddenCount}
          onClearArmy={clearArmy}
          onPrint={() => window.print()}
          onResetArmy={() => setDocument(createDefaultAos4ArmyDocument())}
          onShowAll={showAll}
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
    </div>
  )
}

export default Home
