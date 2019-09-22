import { IArmyBuilderProps } from './army_builder'
import { IArmy } from 'types/army'
import { TEntry } from 'types/data'
import { SUPPORTED_REALMSCAPES } from 'types/realmscapes'

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
    },
    {
      items: army.Traits,
      setValues: props.updateTraits,
      title: 'Traits',
      values: selections.traits,
      type: 'multi',
    },
    {
      items: army.Artifacts,
      setValues: props.updateArtifacts,
      title: 'Artifacts',
      values: selections.artifacts,
      type: 'multi',
    },
    {
      items: army.Battalions,
      setValues: props.updateBattalions,
      title: 'Battalions',
      values: selections.battalions,
      type: 'multi',
    },
    {
      items: army.Allegiances,
      setValues: props.updateAllegiances,
      title: 'Allegiances',
      values: selections.allegiances,
      type: 'multi',
    },
    {
      items: army.Spells,
      setValues: props.updateSpells,
      title: 'Spells',
      values: selections.spells,
      type: 'multi',
    },
    {
      items: army.EndlessSpells,
      setValues: props.updateEndlessSpells,
      title: 'Endless Spells',
      values: selections.endless_spells,
      type: 'multi',
    },
    {
      items: army.Scenery,
      setValues: props.updateScenery,
      title: 'Scenery',
      values: selections.scenery,
      type: 'multi',
    },
    {
      items: army.Commands,
      setValues: props.updateCommands,
      title: 'Commands',
      values: selections.commands,
      type: 'multi',
    },
    {
      items: army.Triumphs,
      setValues: props.updateTriumphs,
      title: 'Triumphs',
      values: selections.triumphs,
      type: 'multi',
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
}

type TSingle = {
  items: string[]
  setValue: (value: string | null) => void
  title: string
  type: 'single'
  value: string | null
}
