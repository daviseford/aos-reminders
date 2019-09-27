import React, { useMemo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { componentWithSize } from 'utils/mapSizesToProps'
import { processReminders } from 'utils/processReminders'
import { titleCase } from 'utils/textUtils'
import { visibility, selectors } from 'ducks'
import { Reminder } from 'components/info/reminder'
import { IArmy, TAllyArmies, ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'

interface IRemindersProps extends ICurrentArmy {
  allyArmies: TAllyArmies
  army: IArmy
  hiddenReminders: string[]
  hideWhens: (values: string[]) => void
  isMobile: boolean
  showWhen: (value: string) => void
  visibleWhens: string[]
}

const RemindersComponent = (props: IRemindersProps) => {
  const { allyArmies, army, hideWhens, isMobile, showWhen, visibleWhens, ...currentArmy } = props

  const reminders = useMemo(() => {
    return processReminders(
      army,
      currentArmy.factionName,
      currentArmy.selections,
      currentArmy.realmscape_feature,
      currentArmy.allyFactionNames,
      allyArmies,
      currentArmy.allySelections
    )
  }, [army, allyArmies, currentArmy])

  const whens = useMemo(() => Object.keys(reminders), [reminders])
  const titles = useMemo(() => whens.map(titleCase), [whens])

  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    setFirstLoad(true)
  }, [currentArmy.factionName])

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
      <div className="col col-sm-11 col-md-10 col-lg-10 col-xl-8 ReminderContainer">
        {whens.map((when, i) => {
          return (
            <Reminder
              isMobile={isMobile}
              when={when}
              actions={reminders[when]}
              key={`${when}_${i}`}
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
  ...selectors.getCurrentArmy(state),
  allyArmies: selectors.getAllyArmies(state),
  army: selectors.getArmy(state),
  hiddenReminders: selectors.getReminders(state),
  visibleWhens: selectors.getWhen(state),
})

const mapDispatchToProps = {
  hideWhens: visibility.actions.deleteWhens,
  showWhen: visibility.actions.addWhen,
}

const Reminders = connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithSize(RemindersComponent))

export default Reminders
