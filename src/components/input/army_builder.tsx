import { CardMultiSelect, CardSingleSelect } from 'components/info/card'
import { armyActions, selectionActions } from 'ducks'
import { selectFactionName } from 'ducks/selectors'
import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGetArmy, useGetArmyBuilderCards } from 'utils/hooks/useGetArmy'
import useWindowSize from 'utils/hooks/useWindowSize'
import { withSelectMultiWithSideEffects, withSelectOne } from 'utils/withSelect'

const ArmyBuilder = () => {
  const factionName = useSelector(selectFactionName)
  const { isMobile } = useWindowSize()
  const army = useGetArmy(factionName)

  useEffect(() => {
    armyActions.updateArmy(army)
  }, [army])

  const rowClass = useMemo(() => `row d-print-none pb-1 ${isMobile ? `mx-1` : `pt-2 w-75`}`, [isMobile])
  const cards = useGetArmyBuilderCards(army)

  return (
    <div className="d-flex justify-content-center">
      <div className={rowClass}>
        {cards.map(card =>
          card.type === 'multi' ? (
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
            />
          ) : (
            <CardSingleSelect
              enableLog={true}
              items={card.items}
              key={card.title}
              label={factionName}
              mobileTitle={card.mobileTitle || null}
              setValue={withSelectOne(card.setValue)}
              title={card.title}
              value={card.value}
            />
          )
        )}
      </div>
    </div>
  )
}

export default ArmyBuilder
