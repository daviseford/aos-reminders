import type { CanonicalId, SourceArtifact } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { createDefaultAos4ArmyDocument, loadAos4ArmyDocument, saveAos4ArmyDocument } from '../../aos4/runtime'
import { createAos4ArmyDocument, setAos4ReminderPreference, type Aos4ArmyDocument } from '../../aos4/state'
import { createAos4BuilderViewModel, createAos4ReminderViewModel } from '../../aos4/view'
import { useTheme } from '../../context/useTheme'
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
  if (artifact.publisher === 'games-workshop') return 'Official'
  if (artifact.publisher === 'wahapedia') return 'Wahapedia'
  return 'Source'
}

const selectableKinds = new Set(['content-group', 'warscroll'])

const Home = () => {
  const { isDark, theme, toggleTheme } = useTheme()
  const [document, setDocument] = useState(loadDocument)
  const [focusMode, setFocusMode] = useState(false)
  const builder = useMemo(() => createAos4BuilderViewModel(AOS4_CATALOG, document), [document])
  const reminders = useMemo(() => createAos4ReminderViewModel(AOS4_CATALOG, document), [document])
  const visibleReminders = reminders.filter(reminder => !reminder.hidden)
  const reminderGroups = Array.from(
    visibleReminders.reduce((groups, reminder) => {
      const current = groups.get(reminder.windowKey) ?? {
        label: reminder.windowLabel,
        reminders: [],
      }
      current.reminders.push(reminder)
      groups.set(reminder.windowKey, current)
      return groups
    }, new Map<string, { label: string; reminders: typeof reminders }>())
  )

  useEffect(() => {
    try {
      saveAos4ArmyDocument(window.localStorage, document)
    } catch {
      // Browser storage can be unavailable in privacy modes. The in-memory document remains usable.
    }
  }, [document])

  const updateDocument = (changes: Partial<Aos4ArmyDocument>) => {
    setDocument(current => createAos4ArmyDocument({ ...current, ...changes }))
  }

  const toggleSelection = (id: CanonicalId) => {
    setDocument(current => {
      const selected = new Set(current.explicitSelectionIds)
      selected.has(id) ? selected.delete(id) : selected.add(id)
      return createAos4ArmyDocument({
        ...current,
        explicitSelectionIds: Array.from(selected),
      })
    })
  }

  const resetPreview = () => setDocument(createDefaultAos4ArmyDocument())

  return (
    <div className={`aos4-shell ${isDark ? 'aos4-shell--dark' : ''} ${theme.bgColor}`}>
      <header className="aos4-hero d-print-none">
        <div className="aos4-hero__inner">
          <div>
            <span className="aos4-kicker">AoS 4 migration workbench</span>
            <h1>Build less. Remember more.</h1>
            <p>
              This branch now runs exclusively on the new Age of Sigmar 4 domain model. The current catalog is
              a deliberately small, source-traceable Stormcast Eternals proof while the full dataset is
              reviewed.
            </p>
          </div>
          <div className="aos4-hero__actions">
            <button className="aos4-button aos4-button--quiet" type="button" onClick={toggleTheme}>
              {isDark ? 'Light theme' : 'Dark theme'}
            </button>
            <button
              className="aos4-button aos4-button--quiet"
              type="button"
              onClick={() => setFocusMode(current => !current)}
            >
              {focusMode ? 'Edit army' : 'Focus mode'}
            </button>
            <button className="aos4-button" type="button" onClick={() => window.print()}>
              Print reminders
            </button>
          </div>
        </div>
      </header>

      <main className={`aos4-layout ${focusMode ? 'aos4-layout--focus' : ''}`}>
        {!focusMode && (
          <aside className="aos4-builder d-print-none" aria-label="Army selections">
            <div className="aos4-section-heading">
              <div>
                <span className="aos4-eyebrow">Representative army</span>
                <h2>Configure the proof</h2>
              </div>
              <button className="aos4-text-button" type="button" onClick={resetPreview}>
                Reset
              </button>
            </div>

            <label className="aos4-field">
              <span>Army name</span>
              <input
                value={document.name}
                onChange={event => updateDocument({ name: event.target.value || 'Untitled AoS 4 army' })}
              />
            </label>

            <div className="aos4-stats" aria-label="Army summary">
              <div>
                <strong>{builder.warscrolls.length}</strong>
                <span>Warscrolls</span>
              </div>
              <div>
                <strong>{visibleReminders.length}</strong>
                <span>Reminders</span>
              </div>
              <div>
                <strong>
                  {builder.warscrolls.reduce((sum, unit) => sum + (unit.profile?.points ?? 0), 0)}
                </strong>
                <span>Points</span>
              </div>
            </div>

            <fieldset className="aos4-choices">
              <legend>Content selections</legend>
              {builder.options
                .filter(option => selectableKinds.has(option.kind))
                .map(option => (
                  <label key={option.id} className="aos4-choice">
                    <input
                      type="checkbox"
                      checked={option.selected}
                      disabled={!option.available && !option.selected}
                      onChange={() => toggleSelection(option.id)}
                    />
                    <span>
                      <strong>{option.name}</strong>
                      <small>{option.groupType?.replaceAll('-', ' ') ?? option.kind}</small>
                    </span>
                  </label>
                ))}
            </fieldset>

            <div className="aos4-warscrolls">
              <h3>Selected warscrolls</h3>
              {builder.warscrolls.map(warscroll => (
                <article key={warscroll.id} className="aos4-warscroll">
                  <div className="aos4-warscroll__title">
                    <strong>{warscroll.name}</strong>
                    {warscroll.profile && <span>{warscroll.profile.points} pts</span>}
                  </div>
                  <dl>
                    <div>
                      <dt>Move</dt>
                      <dd>{warscroll.characteristics.move}</dd>
                    </div>
                    <div>
                      <dt>Save</dt>
                      <dd>{warscroll.characteristics.save}</dd>
                    </div>
                    <div>
                      <dt>Health</dt>
                      <dd>{warscroll.characteristics.health}</dd>
                    </div>
                    <div>
                      <dt>Control</dt>
                      <dd>{warscroll.characteristics.control}</dd>
                    </div>
                  </dl>
                  {warscroll.profile && (
                    <small>
                      {warscroll.profile.unitSize} models · {warscroll.profile.baseSizes.join(', ')} bases
                    </small>
                  )}
                </article>
              ))}
            </div>
          </aside>
        )}

        <section className="aos4-reminders" aria-label="Reminders">
          <div className="aos4-reminders__intro">
            <div>
              <span className="aos4-eyebrow">Phase-ordered reminders</span>
              <h2>{document.name}</h2>
            </div>
            <div className="aos4-reminders__meta">
              <span>{AOS4_CATALOG.rulesContexts[0]?.name}</span>
              <span>{visibleReminders.length} visible</span>
            </div>
          </div>

          {reminderGroups.map(([windowKey, group]) => (
            <section key={windowKey} className="aos4-window">
              <div className="aos4-window__heading">
                <span>{group.label}</span>
                <small>{group.reminders.length}</small>
              </div>
              <div className="aos4-window__cards">
                {group.reminders.map(reminder => {
                  const sources = Array.from(
                    new Map(
                      reminder.sourceRecordIds.flatMap(id => {
                        const artifact = sourceArtifactByRecordId.get(id)
                        return artifact ? [[artifact.id, artifact] as const] : []
                      })
                    ).values()
                  )
                  return (
                    <article key={reminder.id} className="aos4-reminder">
                      <div className="aos4-reminder__header">
                        <div>
                          <span className="aos4-reminder__type">{reminder.typeLabel}</span>
                          <h3>{reminder.name}</h3>
                        </div>
                        <button
                          className="aos4-text-button d-print-none"
                          type="button"
                          onClick={() =>
                            setDocument(current =>
                              setAos4ReminderPreference(current, reminder.id, { hidden: true })
                            )
                          }
                        >
                          Hide
                        </button>
                      </div>
                      {reminder.reactionTrigger && (
                        <p className="aos4-rule-line">
                          <strong>Trigger</strong>
                          {reminder.reactionTrigger}
                        </p>
                      )}
                      {reminder.declare && (
                        <p className="aos4-rule-line">
                          <strong>Declare</strong>
                          {reminder.declare}
                        </p>
                      )}
                      <p className="aos4-rule-line">
                        <strong>Effect</strong>
                        {reminder.effect}
                      </p>
                      {!focusMode && (
                        <label className="aos4-note d-print-none">
                          <span>Table note</span>
                          <input
                            placeholder="Add a short note…"
                            value={reminder.note ?? ''}
                            onChange={event =>
                              setDocument(current =>
                                setAos4ReminderPreference(current, reminder.id, {
                                  note: event.target.value,
                                })
                              )
                            }
                          />
                        </label>
                      )}
                      <div className="aos4-sources">
                        {sources.map(source =>
                          source.sourceUrl.startsWith('http') ? (
                            <a
                              key={source.id}
                              href={source.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={source.publisher === 'games-workshop' ? 'is-official' : ''}
                            >
                              {sourceLabel(source)}
                            </a>
                          ) : (
                            <span key={source.id}>{sourceLabel(source)}</span>
                          )
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}

          {reminders.some(reminder => reminder.hidden) && (
            <div className="aos4-hidden d-print-none">
              <strong>{reminders.filter(reminder => reminder.hidden).length} hidden reminders</strong>
              <button
                type="button"
                className="aos4-text-button"
                onClick={() =>
                  setDocument(current =>
                    createAos4ArmyDocument({
                      ...current,
                      reminderPreferences: Object.fromEntries(
                        Object.entries(current.reminderPreferences).map(([id, preference]) => [
                          id,
                          { ...preference, hidden: false },
                        ])
                      ),
                    })
                  )
                }
              >
                Show all
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="aos4-footer d-print-none">
        <p>
          Unofficial fan-made tool. Games Workshop documents are authoritative; Wahapedia is used as a
          secondary, attributable dataset.
        </p>
        <div>
          <a href="https://www.warhammer-community.com/en-gb/downloads/warhammer-age-of-sigmar/">
            Official downloads
          </a>
          <a href="https://wahapedia.ru/aos4/the-rules/data-export/">Wahapedia data export</a>
          <a href="https://github.com/daviseford/aos-reminders">GitHub</a>
        </div>
      </footer>
    </div>
  )
}

export default Home
