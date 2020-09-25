import { Reminder } from 'components/info/reminder'
import { useAppStatus } from 'context/useAppStatus'
import { selectors, visibilityActions } from 'ducks'
import { without } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TTurnWhen } from 'types/phases'
import useGetReminders from 'utils/hooks/useGetReminders'
import useWindowSize from 'utils/hooks/useWindowSize'
import { getVisibleReminders } from 'utils/reminderUtils'
import { reorderReminders } from 'utils/reorder'
import { titleCase } from 'utils/textUtils'

const { deleteWhens: hideWhens, addWhen: showWhen } = visibilityActions

const Reminders = () => {
  const dispatch = useDispatch()

  const currentArmy = useSelector(selectors.selectCurrentArmy)
  const hiddenReminders = useSelector(selectors.selectReminders)
  const visibleWhens = useSelector(selectors.selectWhen)

  const { isMobile } = useWindowSize()
  const { isGameMode } = useAppStatus()

  let reminders = useGetReminders()

  if (isGameMode) reminders = reorderReminders(getVisibleReminders(reminders, hiddenReminders))

  const whens = useMemo(() => Object.keys(reminders) as TTurnWhen[], [reminders])
  const titles = useMemo(() => whens.map(titleCase), [whens])

  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    setFirstLoad(true)
  }, [currentArmy.factionName])

  useEffect(() => {
    // Remove orphaned phases
    // (phases where the rules have been removed via army_builder)
    const orphans = without(visibleWhens, ...titles)
    if (orphans.length) dispatch(hideWhens(orphans))

    // If we're on mobile AND it's our first load of a new army AND
    // we have no phases displayed AND there are phases that could be displayed
    if (isMobile && firstLoad && !visibleWhens.length && titles.length) {
      setFirstLoad(false)
      dispatch(showWhen(titles[0])) // Show the first phase
    }
  }, [isGameMode, isMobile, firstLoad, visibleWhens, titles, dispatch])

  return (
    <div className={`row mx-auto ${isGameMode ? `mt-0` : `mt-3`} d-flex justify-content-center`}>
      <div className="col col-sm-11 col-md-10 col-lg-10 col-xl-8 ReminderContainer">
        {whens.map((when, i) => {
          return <Reminder isMobile={isMobile} when={when} actions={reminders[when]} key={when} />
        })}
      </div>
    </div>
  )
}

export default Reminders
