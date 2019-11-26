import { IWithSelectMultipleWithSideEffectsPayload } from 'utils/withSelect'
import { IArmyBuilderProps } from 'components/input/army_builder'
import { getSideEffects } from 'components/input/getSideEffects'
import { IArmy } from 'types/army'
import { TEntry } from 'types/data'
import { SUPPORTED_BATTLE_REALMS, SUPPORTED_ORIGIN_REALMS } from 'types/realmscapes'

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
      sideEffects: {},
    },
    {
      items: army.Artifacts,
      setValues: props.updateArtifacts,
      title: 'Artifacts',
      values: selections.artifacts,
      type: 'multi',
      sideEffects: {},
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
      title: army.AllegianceType || 'Allegiances',
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
      sideEffects: {},
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
      sideEffects: {},
    },
    {
      items: army.Commands,
      setValues: props.updateCommands,
      title: 'Commands',
      values: selections.commands,
      type: 'multi',
      sideEffects: {},
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
      items: SUPPORTED_ORIGIN_REALMS,
      setValue: props.setOriginRealm,
      title: `Realm of Origin`,
      value: props.origin_realm || null,
      type: 'single',
    },
    {
      items: SUPPORTED_BATTLE_REALMS,
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
  sideEffects: IWithSelectMultipleWithSideEffectsPayload
}

type TSingle = {
  items: string[]
  setValue: (value: string | null) => void
  title: string
  type: 'single'
  value: string | null
}
