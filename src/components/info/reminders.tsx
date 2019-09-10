import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { componentWithSize } from 'utils/mapSizesToProps'
import { processReminders } from 'utils/processReminders'
import { titleCase } from 'utils/textUtils'
import { realmscape, factionNames, selections, army, visibility } from 'ducks'
import { Reminder } from 'components/info/reminder'
import { TSupportedFaction } from 'meta/factions'
import { IArmy, TAllyArmies } from 'types/army'
import { ISelections, IAllySelections } from 'types/selections'
import { IStore } from 'types/store'

interface IRemindersProps {
  allyArmies: TAllyArmies
  allyFactionNames: TSupportedFaction[]
  allySelections: { [key: string]: IAllySelections }
  army: IArmy
  factionName: TSupportedFaction
  hideWhens: (values: string[]) => void
  isMobile: boolean
  realmscape_feature: string
  selections: ISelections
  showWhen: (value: string) => void
  visibleWhens: string[]
}

const RemindersComponent = (props: IRemindersProps) => {
  const {
    allyArmies,
    allyFactionNames,
    allySelections,
    army,
    factionName,
    hideWhens,
    isMobile,
    realmscape_feature,
    selections,
    showWhen,
    visibleWhens,
  } = props

  const reminders = useMemo(() => {
    return processReminders(
      army,
      factionName,
      selections,
      realmscape_feature,
      allyFactionNames,
      allyArmies,
      allySelections
    )
  }, [army, factionName, selections, realmscape_feature, allyArmies, allySelections, allyFactionNames])

  const whens = useMemo(() => Object.keys(reminders), [reminders])
  const titles = useMemo(() => whens.map(titleCase), [whens])

  const hideOtherWhens = useCallback(
    (title: string) => {
      const others = without(titles, title)
      return hideWhens(others)
    },
    [hideWhens, titles]
  )

  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    setFirstLoad(true)
  }, [factionName])

  useEffect(() => {
    // Remove orphaned phases
    // (phases where the rules have been removed via army_builder)
    const orphans = without(visibleWhens, ...titles)
    if (orphans.length) hideWhens(orphans)

    // If we're on mobile AND it's our first load of a new army AND
    // we have no phases displayed AND there are phases that could be displayed
    if (isMobile && firstLoad && !visibleWhens.length && titles.length) {
      setFirstLoad(false)
      showWhen(titles[0]) // Show the first phase
    }
  }, [isMobile, firstLoad, visibleWhens, titles, showWhen, hideWhens])

  return (
    <div className="row mx-auto mt-3 d-flex justify-content-center">
      <div className="col col-sm-11 col-md-10 col-lg-10 col-xl-8">
        {whens.map((when, i) => {
          return (
            <Reminder
              isMobile={isMobile}
              when={when}
              actions={reminders[when]}
              key={i}
              hideOthers={hideOtherWhens}
              idx={i}
            />
          )
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
  visibleWhens: visibility.selectors.getWhen(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  selections: selections.selectors.getSelections(state),
})

const mapDispatchToProps = {
  hideWhens: visibility.actions.deleteWhens,
  showWhen: visibility.actions.addWhen,
}

export const Reminders = connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithSize(RemindersComponent))
