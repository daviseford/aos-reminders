import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { sortBy } from 'lodash'
import './army_builder.css'
import { TUnits, TArtifacts, TBattalions, TCommandTraits, IArmy } from 'types/army'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { SelectRealmscape } from './select_realmscape'
import { withSelectOne, withSelectMultiple } from 'utils/withSelect'
import { TDropdownOption, SelectMulti } from './select'
import { ISelections, IAllySelections } from 'types/selections'
import { ValueType } from 'react-select/lib/types'
import { realmscape, selections, factionNames, army } from 'ducks'
import { getArmy } from 'utils/getArmy'
import { TSupportedFaction } from 'meta/factions'

type TUpdateState = (selectValues: ValueType<TDropdownOption>[]) => void

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

export const ArmyBuilderComponent = (props: IArmyBuilderProps) => {
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
          <Card items={sortBy(army.Units, 'name')} values={units} type={'Unit'} setValues={handleUnits} />
          <Card items={army.Traits} type={'Trait'} values={traits} setValues={handleTraits} />
          <Card items={army.Artifacts} type={'Artifact'} values={artifacts} setValues={handleArtifacts} />
          <Card
            items={sortBy(army.Battalions, 'name')}
            values={battalions}
            type={'Battalion'}
            setValues={handleBattalions}
          />
          <SelectRealmscape setValue={handleRealmscape} items={RealmscapeFeatures.map(x => x.name)} />
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

interface ICardProps {
  values: string[]
  type: string
  items: TUnits | TBattalions | TArtifacts | TCommandTraits
  setValues: TUpdateState
}

const Card = (props: ICardProps) => {
  const { items, type, setValues, values } = props
  const selectItems = items.map(x => x.name)
  return (
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">Add {type}s</h4>
          <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
        </div>
      </div>
    </div>
  )
}

interface IAllyArmyBuilderProps {
  allyFactionName: TSupportedFaction | null
  selections: IAllySelections
  updateAllyUnits: (values: string[]) => void
  updateAllyArmy: (army: IArmy | null) => void
}

export const AllyArmyBuilderComponent = (props: IAllyArmyBuilderProps) => {
  const { allyFactionName, updateAllyUnits, selections, updateAllyArmy } = props
  const { units } = selections

  const allyArmy = useMemo(() => getArmy(allyFactionName), [allyFactionName])
  const handleUnits = withSelectMultiple(updateAllyUnits)

  useEffect(() => {
    updateAllyArmy(allyArmy)
  }, [allyArmy, updateAllyArmy])

  if (!allyArmy) return <></>

  return (
    <div className="container d-print-none">
      <div className="row border border-dark pb-3">
        <div className="col card-group mx-auto">
          <Card items={sortBy(allyArmy.Units, 'name')} values={units} type={'Allied Unit'} setValues={handleUnits} />
        </div>
      </div>
    </div>
  )
}

const mapAllyStateToProps = (state, ownProps) => ({
  ...ownProps,
  allyFactionName: factionNames.selectors.getAllyFactionName(state),
  selections: selections.selectors.getSelections(state),
})

export const AllyArmyBuilder = connect(
  mapAllyStateToProps,
  { updateAllyUnits: selections.actions.updateAllyUnits, updateAllyArmy: army.actions.updateAllyArmy }
)(AllyArmyBuilderComponent)
