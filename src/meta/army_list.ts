import { CHAOS, DEATH, DESTRUCTION, ORDER, TGrandAlliances } from './alliances'
import {
  BEASTCLAW_RAIDERS,
  BEASTS_OF_CHAOS,
  BONESPLITTERZ,
  CHAOS_GRAND_ALLIANCE,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DISPOSSESSED,
  EVERCHOSEN,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GRAND_HOST_OF_NAGASH,
  GUTBUSTERS,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGION_OF_BLOOD,
  LEGION_OF_NIGHT,
  LEGION_OF_SACRAMENT,
  LEGIONS_OF_AZGORH,
  LEGIONS_OF_GRIEF,
  LETHISIAN_DEFENDERS,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  NURGLE,
  ORDER_GRAND_ALLIANCE,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SOULBLIGHT,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TAMURKHANS_HORDE,
  TSupportedFaction,
  TZEENTCH,
  WANDERERS,
} from './factions'
import { IInitialArmy } from 'types/army'

const ArmyList: TArmyList = {
  [BEASTCLAW_RAIDERS]: {
    dir: 'beastclaw_raiders',
    GrandAlliance: DESTRUCTION,
  },
  [BEASTS_OF_CHAOS]: {
    dir: 'beasts_of_chaos',
    GrandAlliance: CHAOS,
  },
  [BONESPLITTERZ]: {
    dir: 'bonesplitterz',
    GrandAlliance: DESTRUCTION,
  },
  [CHAOS_GRAND_ALLIANCE]: {
    dir: 'grand_alliances/chaos',
    GrandAlliance: CHAOS,
  },
  [DAUGHTERS_OF_KHAINE]: {
    dir: 'daughters_of_khaine',
    GrandAlliance: ORDER,
  },
  [DEATH_GRAND_ALLIANCE]: {
    dir: 'grand_alliances/death',
    GrandAlliance: DEATH,
  },
  [DESTRUCTION_GRAND_ALLIANCE]: {
    dir: 'grand_alliances/destruction',
    GrandAlliance: DESTRUCTION,
  },
  [DISPOSSESSED]: {
    dir: 'dispossessed',
    GrandAlliance: ORDER,
  },
  [EVERCHOSEN]: {
    dir: 'everchosen',
    GrandAlliance: CHAOS,
  },
  [FLESH_EATER_COURTS]: {
    dir: 'flesh_eater_courts',
    GrandAlliance: DEATH,
  },
  [FYRESLAYERS]: {
    dir: 'fyreslayers',
    GrandAlliance: ORDER,
  },
  [GLOOMSPITE_GITZ]: {
    dir: 'gloomspite',
    GrandAlliance: DESTRUCTION,
  },
  [GRAND_HOST_OF_NAGASH]: {
    dir: 'grand_host_of_nagash',
    GrandAlliance: DEATH,
  },
  [GUTBUSTERS]: {
    dir: 'gutbusters',
    GrandAlliance: DESTRUCTION,
  },
  [IDONETH_DEEPKIN]: {
    dir: 'idoneth',
    GrandAlliance: ORDER,
  },
  [IRONJAWZ]: {
    dir: 'ironjawz',
    GrandAlliance: DESTRUCTION,
  },
  [KHARADRON_OVERLORDS]: {
    dir: 'kharadron_overlords',
    GrandAlliance: ORDER,
  },
  [KHORNE]: {
    dir: 'khorne',
    GrandAlliance: CHAOS,
  },
  [LEGION_OF_BLOOD]: {
    dir: 'legion_of_blood',
    GrandAlliance: DEATH,
  },
  [LEGION_OF_NIGHT]: {
    dir: 'legion_of_night',
    GrandAlliance: DEATH,
  },
  [LEGION_OF_SACRAMENT]: {
    dir: 'legion_of_sacrament',
    GrandAlliance: DEATH,
  },
  [LEGIONS_OF_AZGORH]: {
    dir: 'legions_of_azgorh',
    GrandAlliance: CHAOS,
  },
  [LEGIONS_OF_GRIEF]: {
    dir: 'legions_of_grief',
    GrandAlliance: DEATH,
  },
  [LETHISIAN_DEFENDERS]: {
    dir: 'lethisian_army',
    GrandAlliance: ORDER,
  },
  [MERCENARY_COMPANIES]: {
    dir: 'mercenary_companies',
    GrandAlliance: ORDER,
    //TODO: Add allyOnly tag
  },
  [NIGHTHAUNT]: {
    dir: 'nighthaunt',
    GrandAlliance: DEATH,
  },
  [NURGLE]: {
    dir: 'nurgle',
    GrandAlliance: CHAOS,
  },
  [ORDER_GRAND_ALLIANCE]: {
    dir: 'grand_alliances/order',
    GrandAlliance: ORDER,
  },
  [OSSIARCH_BONEREAPERS]: {
    dir: 'ossiarch_bonereapers',
    GrandAlliance: DEATH,
  },
  [SERAPHON]: {
    dir: 'seraphon',
    GrandAlliance: ORDER,
  },
  [SKAVEN]: {
    dir: 'skaven',
    GrandAlliance: CHAOS,
  },
  [SLAANESH]: {
    dir: 'slaanesh',
    GrandAlliance: CHAOS,
  },
  [SLAVES_TO_DARKNESS]: {
    dir: 'slaves_to_darkness',
    GrandAlliance: CHAOS,
  },
  [SOULBLIGHT]: {
    dir: 'soulblight',
    GrandAlliance: DEATH,
  },
  [STORMCAST_ETERNALS]: {
    dir: 'stormcast_eternals',
    GrandAlliance: ORDER,
  },
  [SYLVANETH]: {
    dir: 'sylvaneth',
    GrandAlliance: ORDER,
  },
  [TAMURKHANS_HORDE]: {
    dir: 'tamurkhans_horde',
    GrandAlliance: CHAOS,
  },
  [TZEENTCH]: {
    dir: 'tzeentch',
    GrandAlliance: CHAOS,
  },
  [WANDERERS]: {
    dir: 'wanderers',
    GrandAlliance: ORDER,
  },
}

interface IGetArmyReturn extends IArmyListEntry {
  Army: IInitialArmy
  factionName: TSupportedFaction
}

type TGetArmyList = (factionName: TSupportedFaction) => Promise<IGetArmyReturn>

export const getArmyList: TGetArmyList = async factionName => {
  const { default: Army } = await import(`army/${ArmyList[factionName].dir}`)
  return { ...ArmyList[factionName], factionName, Army }
}

export const getArmiesInfo = () => {
  return Object.keys(ArmyList).reduce(
    (a, k) => {
      a[k] = { GrandAlliance: ArmyList[k].GrandAlliance }
      return a
    },
    {} as { [key in TSupportedFaction]: { GrandAlliance: TGrandAlliances } }
  )
}

type TArmyList = { readonly [factionName in TSupportedFaction]: IArmyListEntry }

interface IArmyListEntry {
  readonly dir: string
  readonly GrandAlliance: TGrandAlliances
}
