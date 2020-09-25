import { RealmscapeFeatures } from 'army/generic'
import { realmscapeActions, selectionActions } from 'ducks'
import { getSelections, selectFactionName, selectRealmscapeSlice } from 'ducks/selectors'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { IArmy } from 'types/army'
import { TEntry } from 'types/data'
import { SUPPORTED_BATTLE_REALMS, SUPPORTED_ORIGIN_REALMS } from 'types/realmscapes'
import { getArmy } from 'utils/getArmy/getArmy'
import { getSideEffects } from 'utils/getSideEffects'
import { IWithSelectMultipleWithSideEffectsPayload } from 'utils/withSelect'

export const useGetArmyBuilderCards = (army: IArmy) => {
  const { origin_realm, realmscape, realmscape_feature } = useSelector(selectRealmscapeSlice)
  const selections = useSelector(getSelections)

  const realmFeatureItems = useMemo(() => {
    const features = RealmscapeFeatures.map(x => x.name)
    return realmscape ? features.filter(f => f.includes(realmscape)) : features
  }, [realmscape])

  const value: (TMulti | TSingle)[] = useMemo(() => {
    return [
      {
        items: army.Units,
        setValues: selectionActions.updateUnits,
        title: 'Units',
        values: selections.units,
        type: 'multi',
        sideEffects: getSideEffects(army.Units),
      },
      {
        items: army.Traits,
        setValues: selectionActions.updateTraits,
        title: 'Traits',
        values: selections.traits,
        type: 'multi',
        sideEffects: getSideEffects(army.Traits),
      },
      {
        items: army.Artifacts,
        setValues: selectionActions.updateArtifacts,
        title: 'Artifacts',
        values: selections.artifacts,
        type: 'multi',
        sideEffects: {},
      },
      {
        items: army.Battalions,
        setValues: selectionActions.updateBattalions,
        title: 'Battalions',
        values: selections.battalions,
        type: 'multi',
        sideEffects: getSideEffects(army.Battalions),
      },
      {
        items: army.Allegiances,
        setValues: selectionActions.updateAllegiances,
        title: army.AllegianceType || 'Allegiances',
        values: selections.allegiances,
        type: 'multi',
        sideEffects: getSideEffects(army.Allegiances),
      },
      {
        items: army.Spells,
        setValues: selectionActions.updateSpells,
        title: 'Spells',
        values: selections.spells,
        type: 'multi',
        sideEffects: {},
      },
      {
        items: army.EndlessSpells,
        setValues: selectionActions.updateEndlessSpells,
        title: 'Endless Spells',
        values: selections.endless_spells,
        type: 'multi',
        sideEffects: {},
      },
      {
        items: army.Scenery,
        setValues: selectionActions.updateScenery,
        title: 'Scenery',
        values: selections.scenery,
        type: 'multi',
        sideEffects: {},
      },
      {
        items: army.Commands,
        setValues: selectionActions.updateCommands,
        title: 'Commands',
        values: selections.commands,
        type: 'multi',
        sideEffects: {},
      },
      {
        items: army.Triumphs,
        setValues: selectionActions.updateTriumphs,
        title: 'Triumphs',
        values: selections.triumphs,
        type: 'multi',
        sideEffects: {},
      },
      {
        items: SUPPORTED_ORIGIN_REALMS,
        setValue: realmscapeActions.setOriginRealm,
        title: `Realm of Origin`,
        mobileTitle: `Origin Realm`,
        value: origin_realm || null,
        type: 'single',
      },
      {
        items: SUPPORTED_BATTLE_REALMS,
        setValue: realmscapeActions.setRealmscape,
        title: `Realm of Battle`,
        mobileTitle: `Battle Realm`,
        value: realmscape || null,
        type: 'single',
      },
      {
        items: realmFeatureItems,
        setValue: realmscapeActions.setRealmscapeFeature,
        title: `Realm Feature`,
        value: realmscape_feature || null,
        type: 'single',
      },
    ]
  }, [army, origin_realm, realmFeatureItems, realmscape, realmscape_feature, selections])

  return value
}

type TMulti = {
  items: TEntry[]
  mobileTitle?: string
  setValues: (values: string[]) => void
  sideEffects: IWithSelectMultipleWithSideEffectsPayload
  title: string
  type: 'multi'
  values: string[]
}

type TSingle = {
  items: string[]
  mobileTitle?: string
  setValue: (value: string | null) => void
  title: string
  type: 'single'
  value: string | null
}

export const useGetArmy = () => {
  const factionName = useSelector(selectFactionName)
  const { origin_realm, realmscape } = useSelector(selectRealmscapeSlice)

  const army = useMemo(() => getArmy(factionName, origin_realm, realmscape), [
    factionName,
    origin_realm,
    realmscape,
  ])

  return army as IArmy
}
