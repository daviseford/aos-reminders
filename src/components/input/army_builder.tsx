import { CardMultiSelect, CardSingleSelect } from 'components/info/card'
import { armyActions, selectors } from 'ducks'
import React, { Fragment, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TOriginRealms } from 'types/realmscapes'
import useGetArmy from 'utils/hooks/useGetArmy'
import useGetArmyBuilderCards from 'utils/hooks/useGetArmyBuilderCards'
import useWindowSize from 'utils/hooks/useWindowSize'
import { withSelectMultiWithSideEffects, withSelectOne } from 'utils/withSelect'

const ArmyBuilder = () => {
  const dispatch = useDispatch()
  const { factionName, subFactionName } = useSelector(selectors.selectFactionNameSlice)
  const { isMobile } = useWindowSize()

  const army = useGetArmy(factionName, subFactionName)

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
                  setValues={withSelectMultiWithSideEffects(card.setValues, card.sideEffects, factionName)}
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
