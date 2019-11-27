import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { realmscape, selections, army, selectors } from 'ducks'
import { getArmy } from 'utils/getArmy/getArmy'
import { componentWithSize } from 'utils/mapSizesToProps'
import { withSelectOne, withSelectMultiWithSideEffects } from 'utils/withSelect'
import { CardMultiSelect, CardSingleSelect } from 'components/info/card'
import { getArmyBuilderCards } from 'components/input/army_builder_cards'
import { RealmscapeFeatures } from 'army/generic'
import { TSupportedFaction } from 'meta/factions'
import { IArmy } from 'types/army'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { ISelections } from 'types/selections'
import { IStore } from 'types/store'

export interface IArmyBuilderProps {
  factionName: TSupportedFaction
  isMobile: boolean
  origin_realm: TOriginRealms
  realmscape_feature: string | null
  realmscape: TBattleRealms | null
  selections: ISelections
  addToSelections: (payload: { values: string[]; slice: string }) => void
  setOriginRealm: (value: string | null) => void
  setRealmscape: (value: string | null) => void
  setRealmscapeFeature: (value: string | null) => void
  updateAllegiances: (values: string[]) => void
  updateArmy: (army: IArmy) => void
  updateArtifacts: (values: string[]) => void
  updateBattalions: (values: string[]) => void
  updateCommands: (values: string[]) => void
  updateEndlessSpells: (values: string[]) => void
  updateScenery: (values: string[]) => void
  updateSpells: (values: string[]) => void
  updateTraits: (values: string[]) => void
  updateTriumphs: (values: string[]) => void
  updateUnits: (values: string[]) => void
}

const ArmyBuilderComponent: React.FC<IArmyBuilderProps> = props => {
  const { factionName, origin_realm, isMobile, updateArmy, realmscape } = props

  const army = useMemo(() => getArmy(factionName, origin_realm, realmscape), [
    factionName,
    origin_realm,
    realmscape,
  ]) as IArmy

  useEffect(() => {
    updateArmy(army)
  }, [army, updateArmy])

  const realmFeatureItems = useMemo(() => {
    const features = RealmscapeFeatures.map(x => x.name)
    return realmscape ? features.filter(f => f.includes(realmscape)) : features
  }, [realmscape])

  const rowClass = useMemo(() => `row d-print-none pb-1 ${isMobile ? `mx-1` : `pt-2 w-75`}`, [isMobile])
  const cards = useMemo(() => getArmyBuilderCards(army, props, realmFeatureItems), [
    army,
    props,
    realmFeatureItems,
  ])

  return (
    <div className="d-flex justify-content-center">
      <div className={rowClass}>
        {cards.map(card =>
          card.type === 'multi' ? (
            <CardMultiSelect
              items={card.items}
              setValues={withSelectMultiWithSideEffects(
                card.setValues,
                card.sideEffects,
                props.addToSelections
              )}
              title={card.title}
              values={card.values}
              key={card.title}
              mobileTitle={card.mobileTitle || null}
              enableLog={true}
            />
          ) : (
            <CardSingleSelect
              items={card.items}
              setValue={withSelectOne(card.setValue)}
              title={card.title}
              value={card.value}
              key={card.title}
              enableLog={true}
            />
          )
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  factionName: selectors.getFactionName(state),
  origin_realm: selectors.getOriginRealm(state),
  realmscape_feature: selectors.getRealmscapeFeature(state),
  realmscape: selectors.getRealmscape(state),
  selections: selectors.getSelections(state),
})

const mapDispatchToProps = {
  addToSelections: selections.actions.addToSelections,
  setOriginRealm: realmscape.actions.setOriginRealm,
  setRealmscape: realmscape.actions.setRealmscape,
  setRealmscapeFeature: realmscape.actions.setRealmscapeFeature,
  updateAllegiances: selections.actions.updateAllegiances,
  updateArmy: army.actions.updateArmy,
  updateArtifacts: selections.actions.updateArtifacts,
  updateBattalions: selections.actions.updateBattalions,
  updateCommands: selections.actions.updateCommands,
  updateEndlessSpells: selections.actions.updateEndlessSpells,
  updateScenery: selections.actions.updateScenery,
  updateSpells: selections.actions.updateSpells,
  updateTraits: selections.actions.updateTraits,
  updateTriumphs: selections.actions.updateTriumphs,
  updateUnits: selections.actions.updateUnits,
}

const ArmyBuilder = connect(mapStateToProps, mapDispatchToProps)(componentWithSize(ArmyBuilderComponent))

export default ArmyBuilder
