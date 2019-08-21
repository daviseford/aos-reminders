import React, { useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import './reminders.css'
import { realmscape, factionNames, selections, army, visibility } from 'ducks'
import { processReminders } from 'utils/processReminders'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TAllyArmies } from 'types/army'
import { ISelections, IAllySelections } from 'types/selections'
import { IStore } from 'types/store'
import { Reminder } from 'components/info/reminder'
import { without } from 'lodash'
import { titleCase } from 'utils/titleCase'

interface IRemindersProps {
  allyArmies: TAllyArmies
  allyFactionNames: TSupportedFaction[]
  allySelections: { [key: string]: IAllySelections }
  army: IArmy
  factionName: TSupportedFaction
  realmscape_feature: string
  selections: ISelections
  hideWhens: (values: string[]) => void
}

const RemindersComponent = (props: IRemindersProps) => {
  const {
    allyArmies,
    allyFactionNames,
    allySelections,
    army,
    factionName,
    hideWhens,
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

  const whens = useMemo(() => Object.keys(reminders), [reminders])

  const hideOtherWhens = useCallback(
    (title: string) => {
      const titles = whens.map(titleCase)
      const others = without(titles, title)
      return hideWhens(others)
    },
    [hideWhens, whens]
  )

  return (
    <div className="row mx-auto mt-3 d-flex justify-content-center">
      <div className="col col-sm-11 col-md-10 col-lg-10 col-xl-8">
        {whens.map((when, i) => {
          return <Reminder when={when} actions={reminders[when]} key={i} hideOthers={hideOtherWhens} />
        })}
      </div>
    </div>
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

const mapDispatchToProps = { hideWhens: visibility.actions.addWhens }

export const Reminders = connect(
  mapStateToProps,
  mapDispatchToProps
)(RemindersComponent)
