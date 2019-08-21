import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import './reminders.css'
import { realmscape, factionNames, selections, army, visibility } from 'ducks'
import { processReminders } from 'utils/processReminders'
import { titleCase } from 'utils/titleCase'
import { VisibilityToggle } from 'components/info/visibilityToggle'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TAllyArmies } from 'types/army'
import { TTurnAction } from 'types/data'
import { ISelections, IAllySelections } from 'types/selections'
import { IStore } from 'types/store'

interface IRemindersProps {
  allyArmies: TAllyArmies
  allySelections: { [key: string]: IAllySelections }
  allyFactionNames: TSupportedFaction[]
  army: IArmy
  factionName: TSupportedFaction
  realmscape_feature: string
  selections: ISelections
}

const RemindersComponent = (props: IRemindersProps) => {
  const {
    allyArmies,
    allyFactionNames,
    allySelections,
    army,
    factionName,
    realmscape_feature,
    selections,
  } = props

  const reminders = useMemo(() => {
    const allyData = allyFactionNames.map(name => ({
      allyArmy: allyArmies[name],
      allySelections: allySelections[name],
    }))
    return processReminders(army, factionName, selections, realmscape_feature, allyData)
  }, [army, factionName, selections, realmscape_feature, allyArmies, allySelections, allyFactionNames])

  return (
    <div className="row mx-auto mt-3 d-flex justify-content-center">
      <div className="col col-sm-11 col-md-10 col-lg-10 col-xl-8">
        {Object.keys(reminders).map((key, i) => {
          return <Entry when={key} actions={reminders[key]} key={i} />
        })}
      </div>
    </div>
  )
}

interface IEntryProps {
  actions: TTurnAction[]
  addReminder: (value: string) => void
  deleteReminder: (value: string) => void
  getReminders: () => string[]
  when: string
}

const EntryComponent: React.FC<IEntryProps> = props => {
  const { when, actions, addReminder, deleteReminder, getReminders } = props

  const hidden = useMemo(() => {
    return getReminders().filter(name => name.includes(when))
  }, [getReminders, when])

  return (
    <div className={`row d-block PageBreak ${hidden.length === actions.length && `d-print-none`}`}>
      <div className="card border-dark my-3 mx-1">
        <div className="card-header text-center ReminderHeader">
          <h4 className="ReminderH4">{titleCase(when)}</h4>
        </div>
        <div className="card-body">
          {actions.map((action, i) => {
            const name = `${when}_${action.name}`
            const showEntry = () => deleteReminder(name)
            const hideEntry = () => addReminder(name)
            const isHidden = !!hidden.find(k => name === k)

            return (
              <ActionText
                {...action}
                isVisible={!isHidden}
                hideEntry={hideEntry}
                showEntry={showEntry}
                key={i}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const mapEntryStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  getReminders: visibility.selectors.getReminders,
})

const mapEntryDispatchToProps = {
  addReminder: visibility.actions.addReminder,
  deleteReminder: visibility.actions.deleteReminder,
}

export const Entry = connect(
  mapEntryStateToProps,
  mapEntryDispatchToProps
)(EntryComponent)

const getTitle = ({
  artifact,
  command_ability,
  command_trait,
  condition,
  endless_spell,
  name,
  scenery,
  spell,
  triumph,
}: TTurnAction): string => {
  const suffix = name === condition ? `` : `: ${condition}`
  if (artifact) return `Artifact${suffix}`
  if (command_ability) return `Command Ability${suffix}`
  if (command_trait) return `Command Trait${suffix}`
  if (endless_spell) return `Endless Spell${suffix}`
  if (scenery) return `Scenery${suffix}`
  if (spell) return `Spell${suffix}`
  if (triumph) return `Triumph${suffix}`
  return condition
}

interface IActionTextProps extends TTurnAction {
  hideEntry: () => void
  showEntry: () => void
  isVisible: boolean
}

const ActionText = (props: IActionTextProps) => {
  const { isVisible, desc, showEntry, hideEntry } = props

  const handleVisibility = e => {
    e.preventDefault()
    !isVisible ? showEntry() : hideEntry()
  }

  useEffect(() => {
    return () => {
      showEntry() // Remove this from the hidden array on unload
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className={`mb-2 ${!isVisible && `d-print-none`}`}>
      <div className="d-flex mb-1">
        <div className="flex-grow-1">
          <EntryTitle {...props} />
        </div>
        <div className="px-2 d-print-none">
          <VisibilityToggle isVisible={isVisible} setVisibility={handleVisibility} />
        </div>
      </div>

      {isVisible && <EntryDescription text={desc} />}
    </div>
  )
}

const EntryTitle = (props: IActionTextProps) => (
  <>
    <span className="text-muted font-weight-bold">{getTitle(props)} - </span>
    <b>
      {props.name && `${props.name}`}
      {props.tag && ` (${props.tag})`}
    </b>
  </>
)

const EntryDescription = (props: { text: string }) => {
  const splitText = props.text
    .split('\n')
    .map(t => t.trim())
    .filter(t => !!t)

  return (
    <>
      {splitText.map((text, i) => (
        <p className="EntryText" key={i}>
          {text}
        </p>
      ))}
    </>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  allyArmies: army.selectors.getAllyArmies(state),
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
  allySelections: selections.selectors.getAllySelections(state),
  army: army.selectors.getArmy(state),
  factionName: factionNames.selectors.getFactionName(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  selections: selections.selectors.getSelections(state),
})

export const Reminders = connect(
  mapStateToProps,
  null
)(RemindersComponent)
