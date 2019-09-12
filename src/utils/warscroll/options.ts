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
  TZEENTCH,
  WANDERERS,
} from 'meta/factions'

// TODO: Share with Warscroll Builder author
// Add common typos here
// Warscroll Builder on the left - AoS Reminders on the right
export const warscrollTypoMap = {
  'Chaos Chariots': 'Chaos Chariot',
  'Chaos Gorebeast Chariots': 'Gorebeast Chariot',
  'Evocators on Dracolines': 'Evocators on Celestial Dracolines',
  'Lighntning Blast': 'Lightning Blast',
  'Devoted Desciples': 'Devoted Disciples',
}

// If a certain trait maps to a specific unit type, put it here
export const warscrollUnitOptionMap = {
  'Ark of Sotek': 'Bastiladon w/ Ark of Sotek',
  'Cloak of Feathers': 'Skink Priest w/ Cloak of Feathers',
  'Living Whip': 'Keeper of Secrets w/ Living Whip',
  'Priestly Trappings': 'Skink Priest w/ Priestly Trappings',
  'Ritual Knife': 'Keeper of Secrets w/ Ritual Knife',
  'Shining Aegis': 'Keeper of Secrets w/ Shining Aegis',
  'Sinistrous Hand': 'Keeper of Secrets w/ Sinistrous Hand',
  'Skystreak Bow': 'Stegadon w/ Skystreak Bow',
  'Solar Engine': 'Bastiladon w/ Solar Engine',
  'Sunfire Throwers': 'Stegadon w/ Sunfire Throwers',
}

export const warscrollFactionNameMap = {
  'Beastclaw Raiders': BEASTCLAW_RAIDERS,
  'Beasts of Chaos': BEASTS_OF_CHAOS,
  'Blades of Khorne': KHORNE,
  'Daughters of Khaine': DAUGHTERS_OF_KHAINE,
  'Disciples of Tzeentch': TZEENTCH,
  'Flesh Eater Courts': FLESH_EATER_COURTS,
  'Gloomspite Gitz': GLOOMSPITE_GITZ,
  'Grand Host of Nagash': GRAND_HOST_OF_NAGASH,
  'Hedonites of Slaanesh': SLAANESH,
  'Idoneth Deepkin': IDONETH_DEEPKIN,
  'Kharadron Overlords': KHARADRON_OVERLORDS,
  'Legion of Azgorh': LEGIONS_OF_AZGORH,
  'Legion of Blood': LEGION_OF_BLOOD,
  'Legion of Grief': LEGIONS_OF_GRIEF,
  'Legion of Night': LEGION_OF_NIGHT,
  'Legion of Sacrament': LEGION_OF_SACRAMENT,
  'Lethisian Defenders': LETHISIAN_DEFENDERS,
  'Maggotkin of Nurgle': NURGLE,
  'Mercenaries: Greyfyrd Lodge': MERCENARY_COMPANIES,
  'Mercenaries: Grugg Brothers': MERCENARY_COMPANIES,
  'Mercenaries: Order of the Blood-Drenched Rose': MERCENARY_COMPANIES,
  'Mercenaries: Rampagers': MERCENARY_COMPANIES,
  'Mercenaries: Sons of the Lichemaster': MERCENARY_COMPANIES,
  'Mercenaries: Tenebrous Court': MERCENARY_COMPANIES,
  'Mercenaries: The Blacksmoke Battery': MERCENARY_COMPANIES,
  'Mercenaries: The Gutstuffers': MERCENARY_COMPANIES,
  'Ossiarch Bonereapers': OSSIARCH_BONEREAPERS,
  'Slaves to Darkness': SLAVES_TO_DARKNESS,
  'Stormcast Eternals': STORMCAST_ETERNALS,
  "Mercenaries: Nimyard's Rough-Riders": MERCENARY_COMPANIES,
  "Mercenaries: Skroug's Menagerie": MERCENARY_COMPANIES,
  "Tamurkhan's Horde": TAMURKHANS_HORDE,
  Bonesplitterz: BONESPLITTERZ,
  Chaos: CHAOS_GRAND_ALLIANCE,
  Death: DEATH_GRAND_ALLIANCE,
  Destruction: DESTRUCTION_GRAND_ALLIANCE,
  Dispossessed: DISPOSSESSED,
  Everchosen: EVERCHOSEN,
  Fyreslayers: FYRESLAYERS,
  Gutbusters: GUTBUSTERS,
  Ironjawz: IRONJAWZ,
  Khorne: KHORNE,
  Nighthaunt: NIGHTHAUNT,
  Nurgle: NURGLE,
  Order: ORDER_GRAND_ALLIANCE,
  Seraphon: SERAPHON,
  Skaventide: SKAVEN,
  Slaanesh: SLAANESH,
  Soulblight: SOULBLIGHT,
  Sylvaneth: SYLVANETH,
  Tzeentch: TZEENTCH,
  Wanderers: WANDERERS,
}
