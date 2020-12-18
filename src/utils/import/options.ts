import { LegionsOfNagashFaction } from 'factions/legions_of_nagash'
import { NurgleFaction } from 'factions/nurgle'
import { OrrukWarclansFaction } from 'factions/orruk_warclans'
import { SlavesToDarknessFaction } from 'factions/slaves_to_darkness'
import {
  BEASTS_OF_CHAOS,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GREENSKINZ,
  IDONETH_DEEPKIN,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_NAGASH,
  LEGION_OF_AZGORH,
  LEGION_OF_CHAOS_ASCENDANT,
  LEGION_OF_GRIEF,
  LETHISIAN_DEFENDERS,
  LUMINETH_REALMLORDS,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  ORRUK_WARCLANS,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVENTIDE,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SONS_OF_BEHEMAT,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TOMB_KINGS,
  TSupportedFaction,
  TZEENTCH,
  WANDERERS,
} from 'meta/factions'
import { AZYR, BATTLESCRIBE, TImportParsers, UNKNOWN, WARSCROLL_BUILDER } from 'types/import'

// Add common typos here
// Warscroll Builder on the left - AoS Reminders on the right
const warscrollTypoMap: Record<string, string> = {
  'Anointed of Asuryan on Flamespyre Phoenix': 'Anointed on Flamespyre Phoenix',
  'Anointed of Asuryan on Frostheart Phoenix': 'Anointed on Frostheart Phoenix',
  'Arch Sorcerer': 'Arch-Sorcerer',
  'Archmage Teclis and Celennar, Spirit of Hysh': 'Archmage Teclis',
  'Armor of Silvered Sigmarite': 'Armour of Silvered Sigmarite',
  'Aventis Firestrike Magister of Hammerhal': 'Aventis Firestrike',
  'Berzerker Lord': 'Berserker Lord',
  'Blade of All Frost': 'Blade of All-Frost',
  'Blade of the All-Frost': 'Blade of All-Frost',
  'Blue Horrors of Tzeentch': 'Horrors of Tzeentch',
  'Bound The Burning Head': 'Bound Burning Head',
  'Bracers of Ember-iron': 'Bracers of Ember Iron',
  'Brand of the Spirit Daemon': 'Brand of the Split Daemon',
  'Brimstone Horrors of Tzeentch': 'Horrors of Tzeentch',
  'Brute Fist': 'BruteFist',
  'Bursting with Power': "Burstin' with Power",
  'Chaos Gorebeast Chariots': 'Gorebeast Chariots',
  'Dabbling in Sorcery': 'Dabblings in Sorcery (Anvilgard Battle Trait)',
  'Dark Wizardy': 'Dark Wizardry (Royalty)',
  'Devoted Desciples': 'Devoted Disciples',
  'Eternal Conflaguration': 'Eternal Conflagration',
  'Ethereal Blessing': 'Etheral Blessings',
  'Evocators on Dracolines': 'Evocators on Celestial Dracolines',
  'Exalted Deathbringer with Impaling Spear': 'Exalted Deathbringer',
  'Explosize Charge': 'Explosive Charge',
  'Extend Astomatrix': 'Extend Astromatrix',
  'Eyes of the Nine': 'The Eyes of the Nine',
  'Fusil of Conflaguration': 'Fusil of Conflagration',
  'Gatebreaker Mega-Gargant': 'Gatebreaker',
  'Great Bray Shaman of Slaanesh': 'Great Bray-Shaman',
  'Great Bray Shaman of Tzeentch': 'Great Bray-Shaman',
  'Great Bray Shaman': 'Great Bray-Shaman',
  'Great-Bray Shaman': 'Great Bray-Shaman',
  'Gristlegore Royal Terrorgheist': 'Royal Terrorgheist',
  'Gristlegore Royal Zombie Dragon': 'Royal Zombie Dragon',
  'Grot Scraplauncher': 'Gnoblar Scraplauncher',
  'Guardian of Souls with Nightmare Lantern': 'Guardian of Souls',
  'Hammers of Aurgury': 'Hammers of Augury',
  'Horn of Consort': 'Horn of the Consort',
  'Horrible Resilient': 'Horribly Resilient',
  'Inescapable Doom': 'Inescapeable Doom',
  'Katakros, Mortarch of the Necropolis': 'Katakros',
  'Khorghos Khul': 'Korghos Khul',
  'Knights of the Empty Throne Varanguard': 'Varanguard',
  'Kraken-eater Mega-Gargant': 'Kraken-eater',
  'Lighntning Blast': 'Lightning Blast',
  'Lunestone Talisman': 'Loonstone Talisman',
  'Lynus Ghalmorian on Gryph-Charger': 'Lynus Ghalmorian on Gryph Charger',
  'Magestic Horror': 'Majestic Horror',
  'Mannfred Mortarch of Night': 'Mannfred, Mortarch of Night',
  'Master of Defense': 'Master of Defence',
  'Men At Arms': 'Men-at-Arms',
  'Morathi High Oracle of Khaine': 'Morathi-Khaine',
  'Morathi, High Oracle of Khaine': 'Morathi-Khaine',
  'Morathi, The Shadow Queen': 'The Shadow Queen',
  'Orruk Gore Gruntas': 'Orruk Gore-gruntas',
  'Pink Horrors of Tzeentch': 'Horrors of Tzeentch',
  'Secret Eater': 'Secret-eater',
  'Slaves to Darkness Chaos Spawn': 'Chaos Spawn',
  'Slaves to Darkness Daemon Prince': 'Daemon Prince',
  'Spider Rider Skittermob': 'Spider Rider Skitterswarm',
  'Strength of Goodhood': 'Strength of Godhood',
  'Terrorghiest Mantle': 'Terrorgheist Mantle',
  'The Blade of Endless Bloodshed': 'Blade of Endless Bloodshed',
  'The Gorechosen': 'Gorechosen',
  'The Grand Fyrd of Furious Peak': 'The Grand Fyrd of Furios Peak',
  'The Skull-helm of Khorne': 'Skull-helm of Khorne',
  'Tzaangor Enlightened on Disc': 'Tzaangor Enlightened',
  'Vial of the Pure Blood': 'Vial of Pure Blood',
  'Vitrolic Spray': 'Vitriolic Spray',
  'Vokmortian, Master of the Bone-tithe': 'Vokmortian',
  'Vulturnos, High King of the Deep': 'Volturnos, High King of the Deep',
  'Warpfire Thrower Weapon Team': 'Warpfire Thrower',
  'Warrior Indomniate': 'Warrior Indominate',
  'Warstomper Mega-Gargant': 'Warstomper',
  'Windshief Charm': 'Windthief Charm',
  "Mastro Vivetti's Maginificent Macroscope": "Mastro Vivetti's Magnificent Macroscope",
  Ogors: 'Ogor Gluttons',
  Razordons: 'Razordon Hunting Pack',
}

// Azyr on the left - AoS Reminders on the right
const azyrTypoMap: Record<string, string> = {
  'Bursting with Power': "Burstin' with Power",
  'Chaos Gorebeast Chariots': 'Gorebeast Chariots',
  'DHOM-HAIN': 'Dhom Hain (Enclave)',
  'Druid of the Everspring Circle': 'Druid of the Everspring',
  'Greywater Artillery Battery': 'Greywater Artillery Company',
  'Iggrind-Kaz Surge-injection Endrin Mk  IV': 'Iggrind-Kaz Surge-injection Endrin Mk. IV',
  'Keen Clawed': 'Keen-clawed',
  'Madcap Shamans': 'Madcap Shaman',
  'Morathi, High Oracle of Khaine': 'Morathi-Khaine',
  'Morathi, The Shadow Queen': 'The Shadow Queen',
  'Ogors Gluttons': 'Ogor Gluttons',
  'Slaves to Darkness Chaos Spawn': 'Chaos Spawn',
  'Slaves to Darkness Daemon Prince': 'Daemon Prince',
  'The Skyborne Slayers': 'Skyborne Slayers',
}

// Battlescribe on the left - AoS Reminders on the right
const battlescribeTypoMap: Record<string, string> = {
  'Abhorrant Ghoul King on Terrorgheist': 'Abhorrant Ghoul King on Royal Terrorgheist',
  'Aspiring Deathbringer with Goreaxe and Skullhammer': 'Aspiring Deathbringer',
  'Aventis Firestrike, Magister of Hammerhal': 'Aventis Firestrike',
  'Bladebringer on Exalted Seeker Chariot': 'Bladebringer, Herald on Exalted Chariot',
  'Bladebringer on Hellflayer': 'Bladebringer, Herald on Hellflayer',
  'Blood River Chalice': 'Blood-river Chalice',
  'Boingrot Bounders': 'Boingrot Bounderz',
  'Bracers of Ember-iron': 'Bracers of Ember Iron',
  'Celestant-Prime, Hammer of Sigmar': 'Celestant-Prime',
  'Chaos Gorebeast Chariot': 'Gorebeast Chariots',
  'Chaos Gorebeast Chariots': 'Gorebeast Chariots',
  'Chronomatic Cogs': 'Chronomantic Cogs',
  'Cloying Sea Mists': 'Cloying Seas Mists',
  'Corpse Cart with Unholy Lodestone': 'Corpse Cart w/ Unholy Lodestone',
  'DHOM-HAIN': 'Dhom Hain',
  'Epicurean Raiders': 'Epicurean Revellers',
  'Ethereal Blessing': 'Etheral Blessings',
  'Exalted Deathbringer with Impaling Spear': 'Exalted Deathbringer',
  'Exalted Seeker Chariot': 'Seeker Chariots',
  'Furies (of Khorne)': 'Furies',
  'Geminids of Uhl-Gyish': 'Geminids of Uhl-Gysh',
  'Gigantic Chaos Spawn (of Khorne)': 'Gigantic Chaos Spawn',
  'Gravitic Redirection': 'Gravitic Reduction',
  'Guardian of Souls with Mortality Glass': 'Guardian of Souls w/ Mortality Glass',
  'Guardian of Souls with Nightmare Lantern': 'Guardian of Souls',
  'Helblaster Volly Gun': 'Helblaster Volley Gun',
  'Hellflayers of Slaanesh': 'Hellflayer',
  'Helm of Obsidian': 'Helm of Obsidia',
  'Horticulux Slimux': 'Horticulous Slimux',
  'Incandescent Rectices': 'Incandescent Rectrices',
  'Katakros, Mortarch of the Necropolis': 'Orpheon Katakros',
  'Light of Dracothian': 'Light of Dracothion',
  'Mazrall the Butcher, Daemon Prince of Khorne': 'Mazarall the Butcher',
  'Mazrall the Butcher': 'Mazarall the Butcher',
  'Miniaturized Aethermatic Repulsion Field': 'Miniaturised Aethermatic Repulsion Field',
  'Moon-bitter Squigalanche': 'Moon-Biter Squigalanche',
  'Morathi, High Oracle of Khaine': 'Morathi-Khaine',
  'Morathi, The Shadow Queen': 'The Shadow Queen',
  'Mortek Shied-corps': 'Mortek Shield-Corps',
  'Prosecutor with Celestial Hammers': 'Prosecutors with Celestial Hammers',
  'Prosecutor with Stormcall Javelins': 'Prosecutors with Stormcall Javelins',
  'Reiknor the Grimhailer': 'Reikenor the Grimhailer',
  'Savage Orruks Arrowboys': 'Savage Orruk Arrowboys',
  'Shasdow Warrior': 'Shadow Warriors',
  'Skink Handler': 'Razordon Hunting Pack',
  'Slaves to Darkness Chaos Spawn': 'Chaos Spawn',
  'Slaves to Darkness Daemon Prince': 'Daemon Prince',
  'Sneaky Shufflers': 'Sneaky Snufflers',
  'Staff of Occular Optimisation': 'Staff of Ocular Optimisation',
  'Staff of Ocular Optimization': 'Staff of Ocular Optimisation',
  'Stallarch Lords': 'Stalliarch Lords',
  'The Beguilling Gem': 'Beguiling Gem (Chaos)',
  'The Blade of Endless Bloodshed': 'Blade of Endless Bloodshed',
  'Tzaangor Enlightened on Discs of Tzeentch': 'Tzaangor Enlightened',
  'Vanguard-Raptor with Hurricane Crossbow': 'Vanguard-Raptors with Hurricane Crossbows',
  'Vanguard-Raptor with Longstrike Crossbow': 'Vanguard-Raptors with Longstrike Crossbows',
  'Vokmortian, Master of the Bone-tithe': 'Vokmortian',
  'Vulkite Bezerkers': 'Vulkite Berzerkers',
  'Warp Lighting Storm': 'Warp Lightning Storm',
  'Warrgog Prophet': 'Wurrgog Prophet',
  'Zharrgron Flame Splitter': 'Zharrgron Flame-spitter',
  "Dracothian's Tail": "Dracothion's Tail",
  "Gattleson's Endless Repeater": "Gattlesson's Endless Repeater (AETHERMATIC WEAPON)",
  "Ironskull'z Boyz": "Ironskull's Boyz",
  "Might 'Eadbutt": "Mighty 'Eadbutt",
  Asylumticae: 'Asylumaticae',
  BRIOMIDAR: 'Briomdar (Enclave)',
  Kroxigors: 'Kroxigor',
  Protector: 'Protectors',
  Voxaxe: 'Vosaxe',
}

/**
 * This is where we store unknown values that are expected and inconsequential
 * Such as weapon options for units
 * And we shouldn't bother searching for them in the error checking process
 */
export const ignoredUnknownSelections = [
  'Aethermatic Volley Cannon',
  'Aethermatic Volley Guns',
  'Aethershot Rifles',
  'Ancestral War-axe',
  'Arc Hammer',
  'Axe',
  'Banner Bearer',
  'Barbed Whips and Blade Bucklers',
  'Barbed Whips and Sacrificial Knives',
  'Blood Vulture',
  'Boltstorm Pistol',
  'Boss Gore-hacka and Choppa',
  'Brayhorn',
  'Bringer-of-the-Word',
  'Broadaxes',
  'Celestial Hammer(s)',
  'Chaos Hand',
  'Clanr at Bell-ringer',
  'Clanr at Standard Bearer',
  'Clanrat Bell-ringer',
  'Clanrat Standard Bearer',
  'Clawleader',
  'Clubs',
  'Culling Clubs or Prey Hackers with Iron Fists',
  'Cursed Flail',
  'Cursed Lance',
  'Doom Knight',
  'Dread Falchions',
  'Drill Cannons',
  'Drummers',
  'Ensor celled',
  'Ensorcelled',
  'Grandblade',
  'Grandblades',
  'Grandhammer',
  'Grandhammers',
  'Greatblades',
  'Halberds and Shields',
  'Handaxes & Slingshields',
  'Harpoon Launcher',
  'Heavy Sky Cannon',
  'Hornblower',
  'Icon Bearers',
  'Light Skyhooks',
  'Meteoric Javelins & Star Bucklers',
  'Meteoric Standard',
  'Nadirite Blade and Shield',
  'Noise Maker',
  'Ogor Mawtribes Battleline (Beastclaw Raiders General)',
  'Pair of Brute Choppas',
  'Pairs of Clubs or Blades',
  'Pairs of Handaxes',
  'Pig-iron Choppas',
  'Plague Harbingers',
  'Poleaxes',
  'Runic Iron',
  'Savage Blade(s)',
  'Savage Greatblade',
  'Scythes',
  'Shield & Lance',
  'Shockbolt Bow',
  'Sky Cannon',
  'Skybolt Bow',
  'Spirit Swords',
  'Standard Bearer',
  'Standard Bearers',
  'Starstrike Javelin',
  'Sword',
  'Swords',
  'Tenderiser',
  'Tzaangor Mutant',
  'Vicious Blade & Wicked Cutlass',
  'Warblade & Shield',
  'Warhammer & Shield',
  'Witch Rod',
]

// Azyr helper
export const factionToFlavorMap = {
  'Clans Eshin': 'Masters of Murder (Eshin)',
  'Clans Moulder': 'Prized Creations (Moulder)',
  'Clans Pestilens': 'Echoes of the Great Plagues (Pestilens)',
  'Clans Skryre': 'Warpstone Sparks (Skryre)',
  'Clans Verminus': 'Mighty Warlords (Verminus)',
}

// If a certain trait maps to a specific unit type, put it here
export const importUnitOptionMap = {
  'Balefire Brazier': 'Corpse Cart w/ Balefire Brazier',
  'Celestial Hammer(s)': 'Prosecutors with Celestial Hammers',
  'Living Whip': 'Keeper of Secrets w/ Living Whip',
  'Ritual Knife or Sinistrous Hand': 'Keeper of Secrets w/ Ritual Knife',
  'Ritual Knife': 'Keeper of Secrets w/ Ritual Knife',
  'Shining Aegis': 'Keeper of Secrets w/ Shining Aegis',
  'Sinistrous Hand': 'Keeper of Secrets w/ Sinistrous Hand',
  'Stormcall Javelins': 'Prosecutors with Stormcall Javelins',
  'Unholy Lodestone': 'Corpse Cart w/ Unholy Lodestone',
}

export const importFactionNameMap: Record<
  string,
  { factionName: TSupportedFaction; subFactionName?: string }
> = {
  'Beastclaw Raiders': { factionName: OGOR_MAWTRIBES },
  'Beasts of Chaos': { factionName: BEASTS_OF_CHAOS },
  'Big Waaagh!': {
    factionName: ORRUK_WARCLANS,
    subFactionName: OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'],
  },
  'Blades of Khorne': { factionName: KHORNE },
  'Cities of Sigmar': { factionName: CITIES_OF_SIGMAR },
  'Clans Eshin': { factionName: SKAVENTIDE },
  'Clans Moulder': { factionName: SKAVENTIDE },
  'Clans Pestilens': { factionName: SKAVENTIDE },
  'Clans Skryre': { factionName: SKAVENTIDE },
  'Clans Verminus': { factionName: SKAVENTIDE },
  'Darkling Covens': { factionName: CITIES_OF_SIGMAR },
  'Daughters of Khaine': { factionName: DAUGHTERS_OF_KHAINE },
  'Disciples of Tzeentch': { factionName: TZEENTCH },
  'Fist of the Everchosen': {
    factionName: SLAVES_TO_DARKNESS,
    subFactionName: SlavesToDarknessFaction.subFactionKeyMap['Host of the Everchosen'],
  },
  'Flesh Eater Courts': { factionName: FLESH_EATER_COURTS },
  'Flesh-eater Courts': { factionName: FLESH_EATER_COURTS },
  'Flesh-Eater Courts': { factionName: FLESH_EATER_COURTS },
  'Gitmob Grots': { factionName: GLOOMSPITE_GITZ },
  'Gloomspite Gitz': { factionName: GLOOMSPITE_GITZ },
  'Grand Host of Nagash': {
    factionName: LEGIONS_OF_NAGASH,
    subFactionName: LegionsOfNagashFaction.subFactionKeyMap['Grand Host of Nagash'],
  },
  'Greyfyrd Lodge': { factionName: MERCENARY_COMPANIES },
  'Grugg Brothers': { factionName: MERCENARY_COMPANIES },
  'Hedonites of Slaanesh': { factionName: SLAANESH },
  'Idoneth Deepkin': { factionName: IDONETH_DEEPKIN },
  'Kharadron Overlords': { factionName: KHARADRON_OVERLORDS },
  'Legion of Azgorh': { factionName: LEGION_OF_AZGORH },
  'Legion of Blood': {
    factionName: LEGIONS_OF_NAGASH,
    subFactionName: LegionsOfNagashFaction.subFactionKeyMap['Legion of Blood'],
  },
  'Legion of Chaos Ascendant': { factionName: LEGION_OF_CHAOS_ASCENDANT },
  'Legion of Grief': { factionName: LEGION_OF_GRIEF },
  'Legion of Night': {
    factionName: LEGIONS_OF_NAGASH,
    subFactionName: LegionsOfNagashFaction.subFactionKeyMap['Legion of Night'],
  },
  'Legion of Sacrament': {
    factionName: LEGIONS_OF_NAGASH,
    subFactionName: LegionsOfNagashFaction.subFactionKeyMap['Legion of Sacrament'],
  },
  'Lethisian Defenders': { factionName: LETHISIAN_DEFENDERS },
  'Lumineth Realm Lords': { factionName: LUMINETH_REALMLORDS },
  'Lumineth Realm-lords': { factionName: LUMINETH_REALMLORDS },
  'Maggotkin of Nurgle': { factionName: NURGLE },
  'Mercenaries: Greyfyrd Lodge': { factionName: MERCENARY_COMPANIES },
  'Mercenaries: Grugg Brothers': { factionName: MERCENARY_COMPANIES },
  'Mercenaries: Order of the Blood-Drenched Rose': { factionName: MERCENARY_COMPANIES },
  'Mercenaries: Rampagers': { factionName: MERCENARY_COMPANIES },
  'Mercenaries: Sons of the Lichemaster': { factionName: MERCENARY_COMPANIES },
  'Mercenaries: Tenebrous Court': { factionName: MERCENARY_COMPANIES },
  'Mercenaries: The Blacksmoke Battery': { factionName: MERCENARY_COMPANIES },
  'Mercenaries: The Gutstuffers': { factionName: MERCENARY_COMPANIES },
  'Moonclan Grots': { factionName: GLOOMSPITE_GITZ },
  'Ogor Mawtribes': { factionName: OGOR_MAWTRIBES },
  'Order of the Blood-Drenched Rose': { factionName: MERCENARY_COMPANIES },
  'Orruk Warclans': { factionName: ORRUK_WARCLANS },
  'Ossiarch Bonereapers': { factionName: OSSIARCH_BONEREAPERS },
  'Slaves to Darkness': { factionName: SLAVES_TO_DARKNESS },
  'Sons of Behemat': { factionName: SONS_OF_BEHEMAT },
  'Sons Of Behemat': { factionName: SONS_OF_BEHEMAT },
  'Sons of the Lichemaster': { factionName: MERCENARY_COMPANIES },
  'Spiderfang Grots': { factionName: GLOOMSPITE_GITZ },
  'Stormcast Eternals': { factionName: STORMCAST_ETERNALS },
  'Swifthawk Agents': { factionName: ORDER_GRAND_ALLIANCE },
  'Tenebrous Court': { factionName: MERCENARY_COMPANIES },
  'The Blacksmoke Battery': { factionName: MERCENARY_COMPANIES },
  'The Gutstuffers': { factionName: MERCENARY_COMPANIES },
  'Tomb Kings (Compendium)': { factionName: TOMB_KINGS },
  'Tomb Kings': { factionName: TOMB_KINGS },
  "Mercenaries: Nimyard's Rough-Riders": { factionName: MERCENARY_COMPANIES },
  "Mercenaries: Skroug's Menagerie": { factionName: MERCENARY_COMPANIES },
  "Nimyard's Rough-Riders": { factionName: MERCENARY_COMPANIES },
  "Skroug's Menagerie": { factionName: MERCENARY_COMPANIES },
  "Tamurkhan's Horde": {
    factionName: NURGLE,
    subFactionName: NurgleFaction.subFactionKeyMap["Tamurkhan's Horde"],
  },
  Bonesplitterz: {
    factionName: ORRUK_WARCLANS,
    subFactionName: OrrukWarclansFaction.subFactionKeyMap.Bonesplitterz,
  },
  Brayherd: { factionName: BEASTS_OF_CHAOS },
  Chaos: { factionName: CHAOS_GRAND_ALLIANCE },
  Death: { factionName: DEATH_GRAND_ALLIANCE },
  Destruction: { factionName: DESTRUCTION_GRAND_ALLIANCE },
  Dispossessed: { factionName: DISPOSSESSED },
  Everchosen: {
    factionName: SLAVES_TO_DARKNESS,
    subFactionName: SlavesToDarknessFaction.subFactionKeyMap['Host of the Everchosen'],
  },
  Fyreslayers: { factionName: FYRESLAYERS },
  Greenskinz: { factionName: GREENSKINZ },
  Gutbusters: { factionName: OGOR_MAWTRIBES },
  Ironjawz: { factionName: ORRUK_WARCLANS, subFactionName: OrrukWarclansFaction.subFactionKeyMap.Ironjawz },
  Khorne: { factionName: KHORNE },
  Lethisian: { factionName: LETHISIAN_DEFENDERS },
  Lumineth: { factionName: LUMINETH_REALMLORDS },
  Nighthaunt: { factionName: NIGHTHAUNT },
  Nurgle: { factionName: NURGLE },
  Order: { factionName: ORDER_GRAND_ALLIANCE },
  Rampagers: { factionName: MERCENARY_COMPANIES },
  Seraphon: { factionName: SERAPHON },
  Skaventide: { factionName: SKAVENTIDE },
  Slaanesh: { factionName: SLAANESH },
  Soulblight: { factionName: LEGIONS_OF_NAGASH },
  Sylvaneth: { factionName: SYLVANETH },
  Thunderscorn: { factionName: BEASTS_OF_CHAOS },
  Tzeentch: { factionName: TZEENTCH },
  Wanderers: { factionName: WANDERERS },
  Warherds: { factionName: BEASTS_OF_CHAOS },
}

// A map to help the user when Azyr uses the same name for multiple warscrolls
// eg 'Lord-Arcanum on Celestial Dracoline' is one of a number of units just called 'Lord-Arcanum'
// AoS Reminders on the left - Azyr on the right
// Note that the AoS Reminders version is what it *does* import as. This can be the same as
// the Azyr string, which just means there is a unit exactly called what Azyr lists multiple
// units as, or it can be different, meaning multiple units from Azyr map to one in AoS Reminders
// by a partial match.
const azyrAmbiguousNamesMap = {
  'Abhorrant Ghoul King': 'Abhorrant Ghoul King',
  'Arachnarok Spider with Flinger': 'Arachnarok Spider',
  'Auric Runefather': 'Auric Runefather',
  'Auric Runesmiter': 'Auric Runesmiter',
  'Auric Runeson': 'Auric Runeson',
  'Bladebringer, Herald on Exalted Chariot': 'Bladebringer',
  'Bloodthirster of Insensate Rage': 'Bloodthirster',
  'Chaos Lord': 'Chaos Lord',
  'Corpse Cart w/ Balefire Brazier': 'Corpse Cart',
  'Eidolon of Mathlann, Aspect of the Sea': 'Eidolon of Mathlann',
  'Grey Seer': 'Grey Seer',
  'Herald of Tzeentch': 'Herald of Tzeentch',
  'Knight of Shrouds': 'Knight of Shrouds',
  'Lord-Arcanum': 'Lord-Arcanum',
  'Lord-Celestant': 'Lord-Celestant',
  'Plague Priest': 'Plague Priest',
  'Prosecutors with Celestial Hammers': 'Prosecutors',
  'Prosecutors with Stormcall Javelins': 'Prosecutors',
  'Saurus Scar-Veteran on Carnosaur': 'Saurus Scar-Veteran',
  'Vanguard-Raptors with Hurricane Crossbows': 'Vanguard-Raptors',
  'Wight King with Baleful Tomb Blade': 'Wight King',
  Evocators: 'Evocators',
  Loonboss: 'Loonboss',
}

type TParserOptions = {
  [key in TImportParsers]: {
    ambiguousNamesMap: Record<string, string>
    checkPoorSpacing: boolean
    fileReadError: string
    typoMap: Record<string, string>
  }
}

export const parserOptions: TParserOptions = {
  [WARSCROLL_BUILDER]: {
    ambiguousNamesMap: {},
    checkPoorSpacing: false,
    fileReadError: `There was a problem reading this file. Please try re-downloading it from ${WARSCROLL_BUILDER}.`,
    typoMap: warscrollTypoMap,
  },
  [AZYR]: {
    ambiguousNamesMap: azyrAmbiguousNamesMap,
    checkPoorSpacing: true,
    fileReadError: `There was a problem reading this file.`,
    typoMap: azyrTypoMap,
  },
  [BATTLESCRIBE]: {
    ambiguousNamesMap: {},
    checkPoorSpacing: false,
    fileReadError: `There was a problem reading this file.`,
    typoMap: battlescribeTypoMap,
  },
  [UNKNOWN]: {
    ambiguousNamesMap: {},
    checkPoorSpacing: false,
    fileReadError: `This file format is not recognized.`,
    typoMap: {},
  },
}
