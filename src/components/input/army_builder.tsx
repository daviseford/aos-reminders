import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { CardComponent } from 'components/info/card'
import { SelectRealmscapeComponent } from 'components/input/select_realmscape'
import { withSelectOne, withSelectMultiple } from 'utils/withSelect'
import { getArmy } from 'utils/getArmy'
import { realmscape, selections, factionNames, army } from 'ducks'
import { IArmy, TSpells, TEndlessSpells } from 'types/army'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { ISelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { TRealms } from 'types/realmscapes'

interface IArmyBuilderProps {
  factionName: TSupportedFaction
  realmscape: TRealms | null
  selections: ISelections
  setRealmscapeFeature: (value: string | null) => void
  updateArmy: (army: IArmy) => void
  updateArtifacts: (values: string[]) => void
  updateBattalions: (values: string[]) => void
  updateEndlessSpells: (values: string[]) => void
  updateSpells: (values: string[]) => void
  updateTraits: (values: string[]) => void
  updateUnits: (values: string[]) => void
}

const ArmyBuilderComponent = (props: IArmyBuilderProps) => {
  const { factionName, selections, updateArmy, realmscape } = props
  const { artifacts, battalions, endless_spells, spells, traits, units } = selections

  const army = useMemo(() => getArmy(factionName, realmscape), [factionName, realmscape]) as IArmy

  useEffect(() => {
    updateArmy(army)
  }, [army, updateArmy])

  // Might want to useCallback these guys
  const handleArtifacts = withSelectMultiple(props.updateArtifacts)
  const handleBattalions = withSelectMultiple(props.updateBattalions)
  const handleEndlessSpells = withSelectMultiple(props.updateEndlessSpells)
  const handleRealmscape = withSelectOne(props.setRealmscapeFeature)
  const handleSpells = withSelectMultiple(props.updateSpells)
  const handleTraits = withSelectMultiple(props.updateTraits)
  const handleUnits = withSelectMultiple(props.updateUnits)

  return (
    <div className="container">
      <div className="row d-print-none pb-3">
        <div className="col card-group mx-auto">
          <CardComponent items={sortBy(army.Units, 'name')} values={units} type={'Unit'} setValues={handleUnits} />
          <CardComponent items={army.Traits} type={'Trait'} values={traits} setValues={handleTraits} />
          <CardComponent items={army.Artifacts} type={'Artifact'} values={artifacts} setValues={handleArtifacts} />
          <CardComponent
            items={sortBy(army.Battalions, 'name')}
            values={battalions}
            type={'Battalion'}
            setValues={handleBattalions}
          />

          <CardComponent items={army.Spells as TSpells} values={spells} type={'Spell'} setValues={handleSpells} />

          <CardComponent
            items={army.EndlessSpells as TEndlessSpells}
            values={endless_spells}
            type={'Endless Spell'}
            setValues={handleEndlessSpells}
          />
          <SelectRealmscapeComponent setValue={handleRealmscape} items={RealmscapeFeatures.map(x => x.name)} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  realmscape: realmscape.selectors.getRealmscape(state),
  selections: selections.selectors.getSelections(state),
  factionName: factionNames.selectors.getFactionName(state),
})

const mapDispatchToProps = {
  setRealmscapeFeature: realmscape.actions.setRealmscapeFeature,
  updateArmy: army.actions.updateArmy,
  updateArtifacts: selections.actions.updateArtifacts,
  updateBattalions: selections.actions.updateBattalions,
  updateEndlessSpells: selections.actions.updateEndlessSpells,
  updateSpells: selections.actions.updateSpells,
  updateTraits: selections.actions.updateTraits,
  updateUnits: selections.actions.updateUnits,
}

export const ArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArmyBuilderComponent)
