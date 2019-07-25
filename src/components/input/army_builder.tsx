import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { CardComponent } from 'components/info/card'
import { SelectRealmscapeComponent } from 'components/input/select_realmscape'
import { withSelectOne, withSelectMultiple } from 'utils/withSelect'
import { getArmy } from 'utils/getArmy'
import { realmscape, selections, factionNames, army } from 'ducks'
import { IArmy } from 'types/army'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { ISelections } from 'types/selections'
import { TSupportedFaction } from 'meta/factions'

interface IArmyBuilderProps {
  factionName: TSupportedFaction
  realmscape: string
  selections: ISelections
  setRealmscape: (value: string) => void
  updateArtifacts: (values: string[]) => void
  updateBattalions: (values: string[]) => void
  updateTraits: (values: string[]) => void
  updateUnits: (values: string[]) => void
  updateArmy: (army: IArmy) => void
}

const ArmyBuilderComponent = (props: IArmyBuilderProps) => {
  const {
    factionName,
    selections,
    setRealmscape,
    updateArmy,
    updateArtifacts,
    updateBattalions,
    updateTraits,
    updateUnits,
  } = props
  const { units, traits, artifacts, battalions } = selections

  const army = useMemo(() => getArmy(factionName), [factionName]) as IArmy

  useEffect(() => {
    updateArmy(army)
  }, [army, updateArmy])

  // Might want to useCallback these guys
  const handleRealmscape = withSelectOne(setRealmscape)
  const handleArtifacts = withSelectMultiple(updateArtifacts)
  const handleBattalions = withSelectMultiple(updateBattalions)
  const handleTraits = withSelectMultiple(updateTraits)
  const handleUnits = withSelectMultiple(updateUnits)

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
  setRealmscape: realmscape.actions.setRealmscape,
  updateArtifacts: selections.actions.updateArtifacts,
  updateBattalions: selections.actions.updateBattalions,
  updateTraits: selections.actions.updateTraits,
  updateUnits: selections.actions.updateUnits,
  updateArmy: army.actions.updateArmy,
}

export const ArmyBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArmyBuilderComponent)
