import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { CardMultiSelect, CardSingleSelect } from 'components/info/card'
import { getArmyBuilderCards } from './army_builder_cards'
import {
  withSelectOne,
  withSelectMultiple,
  withSelectMultipleWithFunctionArray,
  IWithSelectMultipleWithFunctionArrayPayload,
} from 'utils/withSelect'
import { getArmy } from 'utils/getArmy/getArmy'
import { componentWithSize } from 'utils/mapSizesToProps'
import { realmscape, selections, army, selectors } from 'ducks'
import { TSupportedFaction } from 'meta/factions'
import { RealmscapeFeatures } from 'army/generic'
import { IArmy, TArtifacts, TBattalions, TCommands, TSpells, TTraits } from 'types/army'
import { ISelections } from 'types/selections'
import { TRealms } from 'types/realmscapes'
import { IStore } from 'types/store'
import { TEntry } from 'types/data'

export interface IArmyBuilderProps {
  factionName: TSupportedFaction
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
  isMobile: boolean
  addToSelections: (payload: { values: string[]; type: string }) => void
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
  const { factionName, isMobile, updateArmy, realmscape } = props

  const army = useMemo(() => getArmy(factionName, realmscape), [factionName, realmscape]) as IArmy

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

  const findOtherItems = (items: TEntry[], type: string) => {
    // okay, we need to check getCollections to see if
    // anything associated with this card should be populated

    // updateAllegicnes
    // Here is the new list of allegiances ['Hermdar']
    // Please update the redux store with these values

    // Hey dude, let me see your card items

    // And if any of those card items are not of this type 'Allegiances'

    // e.g. one of the effects is an artifact
    // we need to fire off an event to Redux saying "hey, update the Artifact store"

    // const Collection = {
    //   artifacts: [] as string[],
    // battalions: [] as string[],
    // commands: [] as string[],
    // spells: [] as string[],
    // traits: [] as string[],
    // }

    if (type === 'Allegiances') {
      const Collection = items.reduce(
        (a, item) => {
          a[item.name] = {}
          item.effects.forEach(effect => {
            // if (effect.spell) {
            //   IDK.push(() => props.updateSpells([effect.name]))
            // } else
            if (effect.artifact) {
              const obj = a[item.name].artifacts || {}
              const vals = obj.values || []
              obj.values = vals.concat(effect.name)
              obj.updateFn = props.addToSelections
              a[item.name].artifacts = { ...obj }
            }
            //  else if (effect.command_trait) {
            //   addToCollection(effect, Collection.Traits)
            // } else if (effect.command_ability) {
            //   addToCollection(effect, Collection.Commands)
            // }
          })
          return a
        },
        {} as IWithSelectMultipleWithFunctionArrayPayload
      )

      debugger

      return Collection
    }

    return {}
  }

  return (
    <div className="d-flex justify-content-center">
      <div className={rowClass}>
        {cards.map(card => {
          if (card.type === 'multi') {
            const otherItems = findOtherItems(card.items, card.title)

            return (
              <CardMultiSelect
                items={card.items}
                setValues={withSelectMultipleWithFunctionArray(card.setValues, otherItems)}
                title={card.title}
                values={card.values}
                key={card.title}
              />
            )
          } else {
            return (
              <CardSingleSelect
                items={card.items}
                setValue={withSelectOne(card.setValue)}
                title={card.title}
                value={card.value}
                key={card.title}
              />
            )
          }
        })}
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  realmscape: selectors.getRealmscape(state),
  realmscape_feature: selectors.getRealmscapeFeature(state),
  selections: selectors.getSelections(state),
  factionName: selectors.getFactionName(state),
})

const mapDispatchToProps = {
  addToSelections: selections.actions.addToSelections,
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

const ArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(componentWithSize(ArmyBuilderComponent))

export default ArmyBuilder
