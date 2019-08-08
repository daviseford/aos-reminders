import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { CardComponent } from 'components/info/card'
import { SelectRealmscapeComponent } from 'components/input/select_realmscape'
import { withSelectOne, withSelectMultiple } from 'utils/withSelect'
import { getArmy } from 'utils/getArmy'
import { realmscape, selections, factionNames, army } from 'ducks'
import { IArmy, TSpells, TEndlessSpells, TAllegiances } from 'types/army'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { ISelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { TRealms, SUPPORTED_REALMSCAPES } from 'types/realmscapes'
import { IEntry } from 'types/data'

interface IArmyBuilderProps {
  factionName: TSupportedFaction
  realmscape_feature: string | null
  realmscape: TRealms | null
  selections: ISelections
  setRealmscape: (value: string | null) => void
  setRealmscapeFeature: (value: string | null) => void
  updateAllegiances: (values: string[]) => void
  updateArmy: (army: IArmy) => void
  updateArtifacts: (values: string[]) => void
  updateBattalions: (values: string[]) => void
  updateEndlessSpells: (values: string[]) => void
  updateSpells: (values: string[]) => void
  updateTraits: (values: string[]) => void
  updateUnits: (values: string[]) => void
}

const ArmyBuilderComponent = (props: IArmyBuilderProps) => {
  const { factionName, selections, updateArmy, realmscape, realmscape_feature } = props
  const { allegiances, artifacts, battalions, endless_spells, spells, traits, units } = selections

  const army = useMemo(() => getArmy(factionName, realmscape), [factionName, realmscape]) as IArmy

  useEffect(() => {
    updateArmy(army)
  }, [army, updateArmy])

  // Might want to useCallback these guys
  const handleAllegiances = withSelectMultiple(props.updateAllegiances)
  const handleArtifacts = withSelectMultiple(props.updateArtifacts)
  const handleBattalions = withSelectMultiple(props.updateBattalions)
  const handleEndlessSpells = withSelectMultiple(props.updateEndlessSpells)
  const handleRealmscape = withSelectOne(props.setRealmscape)
  const handleRealmscapeFeature = withSelectOne(props.setRealmscapeFeature)
  const handleSpells = withSelectMultiple(props.updateSpells)
  const handleTraits = withSelectMultiple(props.updateTraits)
  const handleUnits = withSelectMultiple(props.updateUnits)

  const unitItems = useMemo(() => sortBy(army.Units, 'name'), [army.Units])
  const battalionItems = useMemo(() => sortBy(army.Battalions, 'name'), [army.Battalions])
  const realmFeatureItems = useMemo(() => {
    let features = RealmscapeFeatures.map(x => x.name)
    return realmscape ? features.filter(f => f.includes(realmscape)) : features
  }, [realmscape])

  return (
    <div className="container">
      <div className="row d-print-none pb-3">
        <div className="col card-group mx-auto">
          <CardComponent items={unitItems} values={units} type={'Unit'} setValues={handleUnits} />
          <CardComponent items={army.Traits} type={'Trait'} values={traits} setValues={handleTraits} />
          <CardComponent
            items={army.Artifacts}
            type={'Artifact'}
            values={artifacts}
            setValues={handleArtifacts}
          />
          <CardComponent
            items={battalionItems}
            values={battalions}
            type={'Battalion'}
            setValues={handleBattalions}
          />
          <CardComponent
            items={army.Allegiances as TAllegiances}
            values={allegiances}
            type={'Allegiance'}
            setValues={handleAllegiances}
          />
          <CardComponent items={army.Spells} values={spells} type={'Spell'} setValues={handleSpells} />
          <CardComponent
            items={army.EndlessSpells}
            values={endless_spells}
            type={'Endless Spell'}
            setValues={handleEndlessSpells}
          />
          <SelectRealmscapeComponent
            value={realmscape || null}
            title={`Realmscape`}
            setValue={handleRealmscape}
            items={SUPPORTED_REALMSCAPES}
          />
          <SelectRealmscapeComponent
            value={realmscape_feature || null}
            title={`Realmscape Feature`}
            setValue={handleRealmscapeFeature}
            items={realmFeatureItems}
          />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  realmscape: realmscape.selectors.getRealmscape(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  selections: selections.selectors.getSelections(state),
  factionName: factionNames.selectors.getFactionName(state),
})

const mapDispatchToProps = {
  setRealmscape: realmscape.actions.setRealmscape,
  setRealmscapeFeature: realmscape.actions.setRealmscapeFeature,
  updateAllegiances: selections.actions.updateAllegiances,
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
