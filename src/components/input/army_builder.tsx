import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import './army_builder.css'
import { CardMultiSelect, CardSingleSelect } from 'components/info/card'
import { withSelectOne, withSelectMultiple } from 'utils/withSelect'
import { getArmy } from 'utils/getArmy'
import { realmscape, selections, factionNames, army } from 'ducks'
import { RealmscapeFeatures } from 'army/generic'
import { IArmy } from 'types/army'
import { ISelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'
import { TRealms, SUPPORTED_REALMSCAPES } from 'types/realmscapes'
import { IStore } from 'types/store'

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
  updateCommands: (values: string[]) => void
  updateEndlessSpells: (values: string[]) => void
  updateScenery: (values: string[]) => void
  updateSpells: (values: string[]) => void
  updateTraits: (values: string[]) => void
  updateTriumphs: (values: string[]) => void
  updateUnits: (values: string[]) => void
}

const ArmyBuilderComponent: React.FC<IArmyBuilderProps> = props => {
  const { factionName, selections, updateArmy, realmscape, realmscape_feature } = props
  const {
    allegiances,
    artifacts,
    battalions,
    commands,
    endless_spells,
    scenery,
    spells,
    traits,
    triumphs,
    units,
  } = selections

  const army = useMemo(() => getArmy(factionName, realmscape), [factionName, realmscape]) as IArmy

  useEffect(() => {
    updateArmy(army)
  }, [army, updateArmy])

  const realmFeatureItems = useMemo(() => {
    const features = RealmscapeFeatures.map(x => x.name)
    return realmscape ? features.filter(f => f.includes(realmscape)) : features
  }, [realmscape])

  return (
    <div className="row d-print-none pb-1">
      <div className="col col-lg-10 col-xl-6 card-group mx-auto">
        <CardMultiSelect
          items={army.Units}
          setValues={withSelectMultiple(props.updateUnits)}
          title={'Units'}
          values={units}
        />
        <CardMultiSelect
          items={army.Traits}
          setValues={withSelectMultiple(props.updateTraits)}
          title={'Traits'}
          values={traits}
        />
        <CardMultiSelect
          items={army.Artifacts}
          setValues={withSelectMultiple(props.updateArtifacts)}
          title={'Artifacts'}
          values={artifacts}
        />
        <CardMultiSelect
          items={army.Battalions}
          setValues={withSelectMultiple(props.updateBattalions)}
          title={'Battalions'}
          values={battalions}
        />
        <CardMultiSelect
          items={army.Allegiances}
          setValues={withSelectMultiple(props.updateAllegiances)}
          title={'Allegiances'}
          values={allegiances}
        />
        <CardMultiSelect
          items={army.Spells}
          setValues={withSelectMultiple(props.updateSpells)}
          title={'Spells'}
          values={spells}
        />
        <CardMultiSelect
          items={army.EndlessSpells}
          setValues={withSelectMultiple(props.updateEndlessSpells)}
          title={'Endless Spells'}
          values={endless_spells}
        />
        <CardMultiSelect
          items={army.Scenery}
          setValues={withSelectMultiple(props.updateScenery)}
          title={'Scenery'}
          values={scenery}
        />
        <CardMultiSelect
          items={army.Commands}
          setValues={withSelectMultiple(props.updateCommands)}
          title={'Commands'}
          values={commands}
        />
        <CardMultiSelect
          items={army.Triumphs}
          setValues={withSelectMultiple(props.updateTriumphs)}
          title={'Triumphs'}
          values={triumphs}
        />
        <CardSingleSelect
          items={SUPPORTED_REALMSCAPES}
          setValue={withSelectOne(props.setRealmscape)}
          title={`Realmscape`}
          value={realmscape || null}
        />
        <CardSingleSelect
          items={realmFeatureItems}
          setValue={withSelectOne(props.setRealmscapeFeature)}
          title={`Realm Feature`}
          value={realmscape_feature || null}
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
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
  updateCommands: selections.actions.updateCommands,
  updateEndlessSpells: selections.actions.updateEndlessSpells,
  updateScenery: selections.actions.updateScenery,
  updateSpells: selections.actions.updateSpells,
  updateTraits: selections.actions.updateTraits,
  updateTriumphs: selections.actions.updateTriumphs,
  updateUnits: selections.actions.updateUnits,
}

export const ArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArmyBuilderComponent)
