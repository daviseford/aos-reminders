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

const ArmyBuilderComponent = (props: IArmyBuilderProps) => {
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

  // Might want to useCallback these guys
  const handleAllegiances = withSelectMultiple(props.updateAllegiances)
  const handleArtifacts = withSelectMultiple(props.updateArtifacts)
  const handleBattalions = withSelectMultiple(props.updateBattalions)
  const handleCommands = withSelectMultiple(props.updateCommands)
  const handleEndlessSpells = withSelectMultiple(props.updateEndlessSpells)
  const handleRealmscape = withSelectOne(props.setRealmscape)
  const handleRealmscapeFeature = withSelectOne(props.setRealmscapeFeature)
  const handleScenery = withSelectMultiple(props.updateScenery)
  const handleSpells = withSelectMultiple(props.updateSpells)
  const handleTraits = withSelectMultiple(props.updateTraits)
  const handleTriumphs = withSelectMultiple(props.updateTriumphs)
  const handleUnits = withSelectMultiple(props.updateUnits)

  const realmFeatureItems = useMemo(() => {
    const features = RealmscapeFeatures.map(x => x.name)
    return realmscape ? features.filter(f => f.includes(realmscape)) : features
  }, [realmscape])

  return (
    <div className="container">
      <div className="row d-print-none pb-3">
        <div className="col card-group mx-auto">
          <CardMultiSelect items={army.Units} values={units} title={'Units'} setValues={handleUnits} />
          <CardMultiSelect items={army.Traits} title={'Traits'} values={traits} setValues={handleTraits} />
          <CardMultiSelect
            items={army.Artifacts}
            title={'Artifacts'}
            values={artifacts}
            setValues={handleArtifacts}
          />
          <CardMultiSelect
            items={army.Battalions}
            values={battalions}
            title={'Battalions'}
            setValues={handleBattalions}
          />
          <CardMultiSelect
            items={army.Allegiances}
            values={allegiances}
            title={'Allegiances'}
            setValues={handleAllegiances}
          />
          <CardMultiSelect items={army.Spells} values={spells} title={'Spells'} setValues={handleSpells} />
          <CardMultiSelect
            items={army.EndlessSpells}
            values={endless_spells}
            title={'Endless Spells'}
            setValues={handleEndlessSpells}
          />
          <CardMultiSelect
            items={army.Scenery}
            values={scenery}
            title={'Scenery'}
            setValues={handleScenery}
          />
          <CardMultiSelect
            items={army.Commands}
            values={commands}
            title={'Commands'}
            setValues={handleCommands}
          />
          <CardMultiSelect
            items={army.Triumphs}
            values={triumphs}
            title={'Triumphs'}
            setValues={handleTriumphs}
          />
          <CardSingleSelect
            value={realmscape || null}
            title={`Realmscape`}
            setValue={handleRealmscape}
            items={SUPPORTED_REALMSCAPES}
          />
          <CardSingleSelect
            value={realmscape_feature || null}
            title={`Realm Feature`}
            setValue={handleRealmscapeFeature}
            items={realmFeatureItems}
          />
        </div>
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
