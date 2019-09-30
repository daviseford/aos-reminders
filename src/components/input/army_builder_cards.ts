import { IArmyBuilderProps } from './army_builder'
import { IArmy } from 'types/army'
import { TEntry } from 'types/data'
import { SUPPORTED_REALMSCAPES } from 'types/realmscapes'
import { IWithSelectMultipleWithFunctionArrayPayload } from 'utils/withSelect'
import { getSideEffects } from './getSideEffects'

type TCardOrder = (army: IArmy, props: IArmyBuilderProps, realmFeatureItems: string[]) => (TMulti | TSingle)[]

export const getArmyBuilderCards: TCardOrder = (army, props, realmFeatureItems) => {
  const { selections } = props

  return [
    {
      items: army.Units,
      setValues: props.updateUnits,
      title: 'Units',
      values: selections.units,
      type: 'multi',
      sideEffects: getSideEffects(army.Units),
    },
    {
      items: army.Traits,
      setValues: props.updateTraits,
      title: 'Traits',
      values: selections.traits,
      type: 'multi',
      sideEffects: getSideEffects(army.Traits),
    },
    {
      items: army.Artifacts,
      setValues: props.updateArtifacts,
      title: 'Artifacts',
      values: selections.artifacts,
      type: 'multi',
      sideEffects: getSideEffects(army.Artifacts),
    },
    {
      items: army.Battalions,
      setValues: props.updateBattalions,
      title: 'Battalions',
      values: selections.battalions,
      type: 'multi',
      sideEffects: getSideEffects(army.Battalions),
    },
    {
      items: army.Allegiances,
      setValues: props.updateAllegiances,
      title: 'Allegiances',
      values: selections.allegiances,
      type: 'multi',
      sideEffects: getSideEffects(army.Allegiances),
    },
    {
      items: army.Spells,
      setValues: props.updateSpells,
      title: 'Spells',
      values: selections.spells,
      type: 'multi',
      sideEffects: getSideEffects(army.Spells),
    },
    {
      items: army.EndlessSpells,
      setValues: props.updateEndlessSpells,
      title: 'Endless Spells',
      values: selections.endless_spells,
      type: 'multi',
      sideEffects: {},
    },
    {
      items: army.Scenery,
      setValues: props.updateScenery,
      title: 'Scenery',
      values: selections.scenery,
      type: 'multi',
      sideEffects: getSideEffects(army.Scenery),
    },
    {
      items: army.Commands,
      setValues: props.updateCommands,
      title: 'Commands',
      values: selections.commands,
      type: 'multi',
      sideEffects: getSideEffects(army.Commands),
    },
    {
      items: army.Triumphs,
      setValues: props.updateTriumphs,
      title: 'Triumphs',
      values: selections.triumphs,
      type: 'multi',
      sideEffects: {},
    },
    {
      items: SUPPORTED_REALMSCAPES,
      setValue: props.setRealmscape,
      title: `Realmscape`,
      value: props.realmscape || null,
      type: 'single',
    },
    {
      items: realmFeatureItems,
      setValue: props.setRealmscapeFeature,
      title: `Realm Feature`,
      value: props.realmscape_feature || null,
      type: 'single',
    },
  ]
}

type TMulti = {
  items: TEntry[]
  setValues: (values: string[]) => void
  title: string
  type: 'multi'
  values: string[]
  sideEffects: IWithSelectMultipleWithFunctionArrayPayload
}

type TSingle = {
  items: string[]
  setValue: (value: string | null) => void
  title: string
  type: 'single'
  value: string | null
}
