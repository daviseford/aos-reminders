import { CardMultiSelect, CardSingleSelect } from 'components/info/card'
import { armyActions, selectionActions } from 'ducks'
import { selectFactionName } from 'ducks/selectors'
import React, { Fragment, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TOriginRealms } from 'types/realmscapes'
import { useGetArmy, useGetArmyBuilderCards } from 'utils/hooks/useGetArmy'
import useWindowSize from 'utils/hooks/useWindowSize'
import { withSelectMultiWithSideEffects, withSelectOne } from 'utils/withSelect'

const ArmyBuilder = () => {
  const dispatch = useDispatch()
  const factionName = useSelector(selectFactionName)
  const { isMobile } = useWindowSize()
  const army = useGetArmy(factionName)

  useEffect(() => {
    dispatch(armyActions.updateArmy(army))
  }, [army, dispatch])

  const rowClass = useMemo(() => `row d-print-none pb-1 ${isMobile ? `mx-1` : `pt-2 w-75`}`, [isMobile])
  const cards = useGetArmyBuilderCards(army)

  return (
    <div className="d-flex justify-content-center">
      <div className={rowClass}>
        {cards.map(card => {
          return (
            <Fragment key={card.title}>
              {card.type === 'multi' && card.setValues && (
                <CardMultiSelect
                  enableLog={true}
                  items={card.items}
                  key={card.title}
                  label={factionName}
                  mobileTitle={card.mobileTitle || null}
                  setValues={withSelectMultiWithSideEffects(
                    card.setValues,
                    card.sideEffects,
                    selectionActions.addToSelections,
                    factionName
                  )}
                  title={card.title}
                  values={card.values}
                  selectionCount={0}
                />
              )}
              {card.type === 'single' && card.setValue && (
                <CardSingleSelect
                  enableLog={true}
                  items={card.items}
                  key={card.title}
                  label={factionName}
                  mobileTitle={card.mobileTitle || null}
                  setValue={withSelectOne(value => dispatch(card.setValue(value as TOriginRealms | null)))}
                  title={card.title}
                  value={card.value}
                  selectionCount={0}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ArmyBuilder
