import { handleAzyrPages } from 'utils/azyr/azyrPdf'

import BCR1 from './fixtures/azyr/json/BCR1.json'
import BoC1 from './fixtures/azyr/json/BoC1.json'
import BoC2 from './fixtures/azyr/json/BoC2.json'
import Bonesplitterz1 from './fixtures/azyr/json/Bonesplitterz1.json'
import Chamon from './fixtures/azyr/json/Chamon1.json'
import Chaos1 from './fixtures/azyr/json/Chaos1.json'
import Chaos2 from './fixtures/azyr/json/Chaos2.json'
import Death1 from './fixtures/azyr/json/Death1.json'
import Destruction1 from './fixtures/azyr/json/Destruction1.json'
import Destruction2 from './fixtures/azyr/json/Destruction2.json'
import Dispossessed1 from './fixtures/azyr/json/Dispossessed1.json'
import DoK1 from './fixtures/azyr/json/DoK1.json'
import FEC1 from './fixtures/azyr/json/FEC1.json'
import Fyreslayers1 from './fixtures/azyr/json/Fyreslayers1.json'
import Fyreslayers2 from './fixtures/azyr/json/Fyreslayers2.json'
import GHoN1 from './fixtures/azyr/json/GHoN1.json'
import GHoN2 from './fixtures/azyr/json/GHoN2.json'
import Gloomspite1 from './fixtures/azyr/json/Gloomspite1.json'
import IDK1 from './fixtures/azyr/json/IDK1.json'
import Ironjawz1 from './fixtures/azyr/json/Ironjawz1.json'
import Khorne1 from './fixtures/azyr/json/Khorne1.json'
import KO1 from './fixtures/azyr/json/KO1.json'
import KO2 from './fixtures/azyr/json/KO2.json'
import KO3 from './fixtures/azyr/json/KO3.json'
import KO4 from './fixtures/azyr/json/KO4.json'
import KO5 from './fixtures/azyr/json/KO5.json'
import Lethisian1 from './fixtures/azyr/json/Lethisian1.json'
import LoB1 from './fixtures/azyr/json/LoB1.json'
import LoG1 from './fixtures/azyr/json/LoG1.json'
import LoN1 from './fixtures/azyr/json/LoN1.json'
import LoS2 from './fixtures/azyr/json/LoS2.json'
import Nighthaunt1 from './fixtures/azyr/json/Nighthaunt1.json'
import NoRealm from './fixtures/azyr/json/NoRealmscape1.json'
import Nurgle1 from './fixtures/azyr/json/Nurgle1.json'
import Nurgle2 from './fixtures/azyr/json/Nurgle2.json'
import Nurgle3 from './fixtures/azyr/json/Nurgle3.json'
import Order1 from './fixtures/azyr/json/Order1.json'
import Seraphon1 from './fixtures/azyr/json/Seraphon1.json'
import Skaven1 from './fixtures/azyr/json/Skaven1.json'
import Skryre1 from './fixtures/azyr/json/Skryre1.json'
import Slaanesh1 from './fixtures/azyr/json/Slaanesh1.json'
import Slaanesh2 from './fixtures/azyr/json/Slaanesh2.json'
import Stormcast1 from './fixtures/azyr/json/Stormcast1.json'
import Stormcast2 from './fixtures/azyr/json/Stormcast2.json'
import Stormcast3 from './fixtures/azyr/json/Stormcast3.json'
import Sylvaneth1 from './fixtures/azyr/json/Sylvaneth1.json'
import Tzeentch1 from './fixtures/azyr/json/Tzeentch1.json'
import Tzeentch2 from './fixtures/azyr/json/Tzeentch2.json'
import Wanderers1 from './fixtures/azyr/json/Wanderers1.json'

// TODO: Get this to work :(
// https://github.com/mozilla/pdf.js/issues/7612
// xdescribe('getAzyrArmy', () => {
//   it('does it', async () => {
//     const pdfText = readFileSync(__dirname + '/fixtures/azyr/pdf/Cats.and.Judicators.2000.pdf').buffer
//     const typedArray = new Uint8Array(pdfText as any)
//     const res = await getAzyrPdfText(typedArray)
//     console.log(res)
//   }, 300000)
// })

/**
 * Testing the Azyr import is a little wonky, because as of right now,
 * importing's locally doesn't work in the local test environment
 *
 * The workaround is to `yarn start` and drop your in the dropzone
 * Then copy the output that says "Copy me" into a JSON file
 *
 * Then test against that JSON below
 */
describe('handleAzyrPages', () => {
  it('handles Seraphon1', () => {
    const res = handleAzyrPages(Seraphon1)
    expect(res).toEqual([
      'FACTION: Seraphon',
      'UNIT: Slann Starmaster',
      'UNIT: Engine of the Gods',
      'UNIT: Saurus Astrolith Bearer',
      'UNIT: Skink Priest',
      'UNIT: Saurus Warriors',
      'BATTALION: Fangs of Sotek',
      'BATTALION: Sunclaw Starhost',
    ])
  })

  it('handles Chamon-only', () => {
    const res = handleAzyrPages(Chamon)
    expect(res).toEqual(['FACTION: Death', 'REALMSCAPE: CHAMON'])
  })

  it('handles NoRealm', () => {
    const res = handleAzyrPages(NoRealm)
    expect(res).toEqual(['FACTION: Death'])
  })

  it('handles KO5', () => {
    const res = handleAzyrPages(KO5)
    expect(res).toEqual([
      'FACTION: Kharadron Overlords',
      'ALLEGIANCE: Barak-Mhornar, City of Shadow',
      "Kharadron Code: Seek New Prospects, Prosecute Wars With All Haste, Who Strikes First, Strikes Hardest, There's No Trading With Some People",
      'UNIT: Arkanaut Company',
    ])
  })

  it('handles KO4', () => {
    const res = handleAzyrPages(KO4)
    expect(res).toEqual([
      'FACTION: Kharadron Overlords',
      'ALLEGIANCE: Barak-Zilfin, The Windswept City',
      "Kharadron Code: Master The Skies, Don't Argue With The Wind, There's Always a Breeze If You Look For It, Without Our Ships, We Are Naught",
      'MERCENARY COMPANY: Tenebrous Court',
      'UNIT: Arkanaut Company',
      "UNIT: Thundrik's Profiteers",
    ])
  })

  it('handles Slaanesh2', () => {
    const res = handleAzyrPages(Slaanesh2)
    expect(res).toEqual([
      'FACTION: Slaanesh',
      'ALLEGIANCE: Pretenders Host',
      'UNIT: Keeper of Secrets',
      'ARTEFACT: The Crown of Dark Secrets',
      'COMMAND TRAIT: True Child of Slaanesh',
      'COMMAND TRAIT: Monarch of Lies',
      'SPELL: Hysterical Frenzy',
      'WEAPON: Living Whip',
      'ARTEFACT: Sceptre of Domination',
      'SPELL: Slothful Stupor',
      'WEAPON: Ritual Knife or Sinistrous Hand',
      'UNIT: The Contorted Epitome',
      'ARTEFACT: Sliverslash',
      'SPELL: Soulslice Shards',
      'UNIT: The Masque',
    ])
  })

  it('handles BCR1', () => {
    const res = handleAzyrPages(BCR1)
    expect(res).toEqual([
      'FACTION: Beastclaw Raiders',
      'UNIT: Frostlord on Stonehorn',
      'UNIT: Huskard on Thundertusk',
      'UNIT: Mournfang Pack',
      'UNIT: Thundertusk Beastriders',
      "BATTALION: Braggoth's Beast Hammer",
      'BATTALION: Svard Alfrostun',
      'ENDLESS SPELL: Aethervoid Pendulum',
    ])
  })

  it('handles Skryre1', () => {
    const res = handleAzyrPages(Skryre1)
    expect(res).toEqual([
      'FACTION: Clans Skryre',
      'UNIT: Arch-Warlock',
      'UNIT: Warlock Bombardier',
      'UNIT: Doomwheel',
      'UNIT: Warplock Jezzails',
      'UNIT: Ratling Gun',
      'UNIT: Stormfiends',
      'ENDLESS SPELL: Bell of Doom',
    ])
  })

  it('handles LoB1', () => {
    const res = handleAzyrPages(LoB1)
    expect(res).toEqual([
      'FACTION: Legion of Blood',
      'UNIT: Chainrasp Horde',
      'UNIT: Dire Wolves',
      'ALLY: Myrmourn Banshees',
      'BATTALION: Court of Nulahmia',
      'ENDLESS SPELL: Horrorghast',
      'SCENERY: Penumbral Engine',
    ])
  })

  it('handles LoS2', () => {
    const res = handleAzyrPages(LoS2)
    expect(res).toEqual([
      'FACTION: Legion of Sacrament',
      'UNIT: Neferata, Mortarch of Blood',
      'UNIT: Chainrasp Horde',
      'UNIT: Dire Wolves',
      'ALLY: Crypt Horrors',
      'BATTALION: Lords of Sacrament',
    ])
  })

  it('handles LoN1', () => {
    const res = handleAzyrPages(LoN1)
    expect(res).toEqual([
      'FACTION: Legion of Night',
      'REALMSCAPE: SHYISH',
      'UNIT: Arkhan the Black, Mortarch of Sacrament',
      'BATTALION: Nightfall Pack',
      'ENDLESS SPELL: Soulsnare Shackles',
    ])
  })

  it('handles Bonesplitterz1', () => {
    const res = handleAzyrPages(Bonesplitterz1)
    expect(res).toEqual([
      'FACTION: Bonesplitterz',
      "MERCENARY COMPANY: Skroug's Menagerie",
      'UNIT: Maniak Weirdnob',
      'UNIT: Savage Big Boss',
      'UNIT: Wardokk',
      'UNIT: Wurrgog Prophet',
      'UNIT: Savage Boarboys',
      'UNIT: Savage Orruk Arrowboys',
      'UNIT: Savage Orruk Morboys',
      'UNIT: Savage Orruks',
      'UNIT: Savage Big Stabbas',
      'BATTALION: Icebone Warclan',
    ])
  })

  it('handles IDK1', () => {
    const res = handleAzyrPages(IDK1)
    expect(res).toEqual([
      'FACTION: Idoneth Deepkin',
      "ALLEGIANCE: MOR'PHANN",
      'MERCENARY COMPANY: Order of the Blood-Drenched Rose',
      'UNIT: Akhelian King',
      'UNIT: Eidolon of Mathlann',
      'UNIT: Isharann Soulrender',
      'UNIT: Isharann Soulscryer',
      'UNIT: Namarti Thralls',
      'UNIT: Akhelian Leviadon',
      'UNIT: Akhelian Allopexes',
      'UNIT: Akhelian Ishlaen Guard',
      'UNIT: Akhelian Morrsarr Guard',
      'UNIT: Namarti Reavers',
      'BATTALION: Akhelian Corps',
      'BATTALION: Alliance of Wood and Sea',
      'BATTALION: Namarti Corps',
      'BATTALION: Phalanx',
      'BATTALION: Royal Council',
      'ENDLESS SPELL: Cadaverous Barricade',
      'ENDLESS SPELL: Everblaze Comet',
    ])
  })

  it('handles Dispossessed1', () => {
    const res = handleAzyrPages(Dispossessed1)
    expect(res).toEqual([
      'FACTION: Dispossessed',
      'REALMSCAPE: SHYISH',
      'UNIT: Warden King',
      'UNIT: Ironbreakers',
      'UNIT: Longbeards',
      'UNIT: Hammerers',
      'UNIT: Irondrakes',
      'BATTALION: Grudgebound War Throng',
    ])
  })

  it('handles Destruction2', () => {
    const res = handleAzyrPages(Destruction2)
    expect(res).toEqual([
      'FACTION: Destruction',
      'UNIT: Fungoid Cave-Shaman',
      'UNIT: Frostlord on Thundertusk',
      'UNIT: Huskard on Thundertusk',
      'UNIT: Orruk Megaboss',
      'UNIT: Shootas',
      'UNIT: Stabbas',
      'UNIT: Savage Orruks',
      'UNIT: Orruks',
      'UNIT: Ogors',
      'UNIT: Arachnarok Spider',
    ])
  })

  it('handles Stormcast3', () => {
    const res = handleAzyrPages(Stormcast3)
    expect(res).toEqual([
      'FACTION: Stormcast Eternals',
      'UNIT: Lord-Arcanum',
      'UNIT: Lord-Exorcist',
      'UNIT: Knight-Incantor',
      'UNIT: Drakesworn Templar',
      'UNIT: Judicators',
      'UNIT: Sequitors',
      'UNIT: Celestar Ballista',
      'BATTALION: Grand Convocation',
      'ENDLESS SPELL: Chronomantic Cogs',
      'ENDLESS SPELL: Dais Arcanum',
    ])
  })

  it('handles KO3', () => {
    const res = handleAzyrPages(KO3)
    expect(res).toEqual([
      'FACTION: Kharadron Overlords',
      'UNIT: Aether-Khemist',
      'UNIT: Aetheric Navigator',
      'UNIT: Arkanaut Admiral',
      'UNIT: Bjorgen Thundrik',
      'UNIT: Brokk Grungsson, Lord-Magnate of Barak-Nar',
      'UNIT: Endrinmaster',
      'UNIT: Arkanaut Company',
      'UNIT: Grundstok Gunhauler',
      'UNIT: Arkanaut Frigate',
      'UNIT: Arkanaut Ironclad',
      "UNIT: Thundrik's Profiteers",
      'UNIT: Skywardens',
      'UNIT: Grundstok Thunderers',
      'UNIT: Endrinriggers',
    ])
  })

  it('handles BoC2', () => {
    const res = handleAzyrPages(BoC2)
    expect(res).toEqual([
      'FACTION: Beasts of Chaos',
      'ALLEGIANCE: Allherd',
      'REALMSCAPE: HYSH',
      'UNIT: Great Bray-Shaman',
      'COMMAND TRAIT: Dominator',
      'ARTEFACT: Aether quartz Brooch',
      'SPELL: Tendrils of Atrophy',
      'UNIT: Beastlord',
      'ARTEFACT: Blade of the Desecrator',
      'UNIT: Bestigors',
      'UPGRADE: Brayhorn',
      'UPGRADE: Banner Bearer',
      'UNIT: Gors',
      'BATTALION: Desolating Beastherd',
      'UNIT: Ungor Raiders',
      'UNIT: Tuskgor Chariots',
      'ENDLESS SPELL: Wildfire Taurus',
      'ENDLESS SPELL: Doomblast Dirgehorn',
      'ENDLESS SPELL: Ravening Direflock',
      'ENDLESS SPELL: Malevolent Maelstrom',
    ])
  })

  it('handles Fyreslayers2', () => {
    const res = handleAzyrPages(Fyreslayers2)
    expect(res).toEqual([
      'FACTION: Fyreslayers',
      'ALLEGIANCE: Hermdar',
      'REALMSCAPE: AQSHY',
      'UNIT: Fjul-Grimnir',
      'UNIT: The Chosen Axes',
      'UNIT: Auric Runesmiter',
      'COMMAND TRAIT: Warrior Indominate',
      'ARTEFACT: Tyrant Slayer',
      'SPELL: Prayer of Ash',
      'MOUNT TRAIT: Fire-claw Adult',
      'UNIT: Vulkite Berzerkers',
      'UNIT: Auric Runeson',
      'UNIT: Doomseeker',
      'ENDLESS SPELL: Runic Fyrewall',
    ])
  })

  it('handles Stormcast2', () => {
    const res = handleAzyrPages(Stormcast2)
    expect(res).toEqual([
      'FACTION: Stormcast Eternals',
      'ALLEGIANCE: TEMPEST LORDS',
      'UNIT: Knight-Heraldor',
      'COMMAND TRAIT: Bonds of Noble Duty',
      "ARTEFACT: Patrician's Helm",
      'UNIT: Lord-Ordinator',
      'UNIT: Judicators',
      'UNIT: Liberators',
      'UNIT: Celestar Ballista',
      'ALLY: Organ Gun',
      'ALLY: Skinks',
      'UNIT: Evocators',
    ])
  })

  it('handles Wanderers1', () => {
    const res = handleAzyrPages(Wanderers1)
    expect(res).toEqual([
      'FACTION: Wanderers',
      'UNIT: Nomad Prince',
      'UNIT: Wayfinder',
      'UNIT: Waystrider',
      'UNIT: Waywatcher',
      'UNIT: Eternal Guard',
      'UNIT: Glade Guard',
      'UNIT: Sisters of the Thorn',
      'UNIT: Sisters of the Watch',
      'UNIT: Wild Riders',
      'UNIT: Wildwood Rangers',
      'BATTALION: Waystone Pathfinders',
      'SCENERY: Penumbral Engine',
    ])
  })

  it('handles Nighthaunt1', () => {
    const res = handleAzyrPages(Nighthaunt1)
    expect(res).toEqual([
      'FACTION: Nighthaunt',
      'UNIT: Dreadblade Harrow',
      'UNIT: Kurdoss Valentian',
      'UNIT: Reikenor The Grimhailer',
      'UNIT: Tomb Banshee',
      'UNIT: Chainrasp Horde',
      'UNIT: Grimghast Reapers',
      'UNIT: Hexwraiths',
      'UNIT: Spirit Hosts',
      'UNIT: Black Coach',
      'UNIT: Mourngul',
      'UNIT: Chainghasts',
      'UNIT: Legion Black Coach',
      'BATTALION: Execution Horde',
      'BATTALION: The Condemned',
      'ENDLESS SPELL: Aethervoid Pendulum',
    ])
  })

  it('handles Lethisian1', () => {
    const res = handleAzyrPages(Lethisian1)
    expect(res).toEqual([
      'FACTION: Lethisian',
      'UNIT: Arkanaut Admiral',
      'UNIT: Auric Runemaster',
      'UNIT: Brokk Grungsson, Lord-Magnate of Barak-Nar',
      'UNIT: Celestant-Prime',
      'UNIT: Drakesworn Templar',
      'UNIT: Fjul-Grimnir',
      'UNIT: Lord-Veritant',
      'UNIT: Arkanaut Company',
      'UNIT: Liberators',
      'UNIT: Namarti Thralls',
      'UNIT: Vulkite Berzerkers',
      'UNIT: Arkanaut Frigate',
      'UNIT: Celestar Ballista',
      'UNIT: Grundstok Gunhauler',
      'UNIT: Fulminators',
      "UNIT: Stormsire's Cursebreakers",
      'BATTALION: Anvils of the Heldenhammer Warrior Chamber',
      "BATTALION: Blacktalon's Shadowhammers",
      'BATTALION: Thunderwave Echelon',
      'BATTALION: Vanguard Angelos Conclave',
      'ENDLESS SPELL: Mesmerising Mirror',
    ])
  })

  it('handles Fyreslayers1', () => {
    const res = handleAzyrPages(Fyreslayers1)
    expect(res).toEqual([
      'FACTION: Fyreslayers',
      'ALLEGIANCE: Hermdar',
      'UNIT: Auric Runefather',
      'UNIT: Auric Runemaster',
      'UNIT: Auric Runesmiter',
      'UNIT: Auric Runeson',
      'UNIT: Fjul-Grimnir',
      'UNIT: Vulkite Berzerkers',
      'BATTALION: Grand Fyrd',
      'BATTALION: Lords of the Lodge',
      'ENDLESS SPELL: Chalice of Ushoran',
      'ENDLESS SPELL: Chronomantic Cogs',
      'ENDLESS SPELL: Molten Infernoth',
      'ENDLESS SPELL: Runic Fyrewall',
      'ENDLESS SPELL: Zharrgron Flame-spitter',
      'SCENERY: Penumbral Engine',
    ])
  })

  it('handles Destruction1', () => {
    const res = handleAzyrPages(Destruction1)
    expect(res).toEqual([
      'FACTION: Destruction',
      'UNIT: Frostlord on Stonehorn',
      'UNIT: Frostlord on Thundertusk',
      'UNIT: Fungoid Cave-Shaman',
      'UNIT: Gordrakk, the Fist of Gork',
      'UNIT: Megaboss on Maw-krusha',
      'UNIT: Skragrott, The Loonking',
      'UNIT: Webspinner Shaman',
      'UNIT: Wurrgog Prophet',
      'UNIT: Savage Orruks',
      'UNIT: Shootas',
      'UNIT: Stabbas',
      'UNIT: Aleguzzler Gargant',
      'UNIT: Arachnarok Spider',
      'UNIT: Dread Maw',
      'UNIT: Thundertusk Beastriders',
      'UNIT: Grot Scraplauncher',
      'UNIT: Ironblaster',
      'UNIT: Squig Gobba',
      "UNIT: Ironskull's Boyz",
      'UNIT: Maneaters',
      'UNIT: Orruk Gore-gruntas',
      "UNIT: Zarbag's Gitz",
      'ENDLESS SPELL: Vermintide',
    ])
  })

  it('handles Death1', () => {
    const res = handleAzyrPages(Death1)
    expect(res).toEqual([
      'FACTION: Death',
      'REALMSCAPE: GHYRAN',
      'UNIT: Arkhan the Black, Mortarch of Sacrament',
      'UNIT: Mannfred, Mortarch of Night',
      'UNIT: Nagash, Supreme Lord of the Undead',
      'UNIT: Necrotect',
      'UNIT: Neferata, Mortarch of Blood',
      'UNIT: The Briar Queen',
      'UNIT: Vampire Lord on Zombie Dragon',
      'UNIT: Chainrasp Horde',
      'UNIT: Crypt Ghouls',
      'UNIT: Dire Wolves',
      'UNIT: Skeletal Legionnaires',
      'UNIT: Skeleton Chariots',
      'UNIT: Skeleton Horsemen',
      'UNIT: Royal Terrorgheist',
      'UNIT: Screaming Skull Catapult',
      'UNIT: Black Knights',
      'UNIT: Bladegheist Revenants',
      'UNIT: Blood Knights',
      'UNIT: Corpse Cart',
      'UNIT: Crypt Flayers',
      'UNIT: Crypt Horrors',
      'UNIT: Glaivewraith Stalkers',
      'UNIT: Grave Guard',
      'UNIT: Grimghast Reapers',
      'UNIT: Hexwraiths',
      'UNIT: Myrmourn Banshees',
      'UNIT: Necropolis Knights',
      'UNIT: Spirit Hosts',
      'UNIT: The Sepulchral Guard',
      'UNIT: Thorns of the Briar Queen',
      'UNIT: Vargheists',
      'BATTALION: Castellans of the Crimson Keep',
      'BATTALION: Deathmarch',
      'ENDLESS SPELL: Aethervoid Pendulum',
    ])
  })

  it('handles Chaos1', () => {
    const res = handleAzyrPages(Chaos1)
    expect(res).toEqual([
      'FACTION: Chaos',
      "UNIT: Be'lakor, Chaos Daemon Prince",
      "UNIT: Bull Centaur Taur'ruk",
      'UNIT: Curseling, Eye of Tzeentch',
      'UNIT: Epidemius, Tallyman of Nurgle',
      'UNIT: Lord Skreech Verminking',
      'UNIT: Plague Priest',
      'UNIT: Poxbringer, Herald of Nurgle',
      'UNIT: Sloppity Bilepiper, Herald of Nurgle',
      'UNIT: Verminlord Warpseer',
      'UNIT: Viceleader',
      'UNIT: Vorgaroth the Scarred & Skalok The Skull Host of Khorne',
      'UNIT: Wrath of Khorne Bloodthirster',
      'UNIT: Daemonettes',
      'UNIT: Gors',
      'UNIT: Kairic Acolytes',
      'UNIT: Pink Horrors of Tzeentch',
      'UNIT: Plaguebearers',
      'UNIT: Chimera',
      'UNIT: Hell Pit Abomination',
      'UNIT: Plagueclaw',
      'UNIT: Warp Lightning Cannon',
      'UNIT: Warplock Jezzails',
      'UNIT: Brimstone Horrors of Tzeentch',
      'UNIT: Burning Chariots of Tzeentch',
      'UNIT: Warp-Grinder',
    ])
  })

  it('handles Tzeentch2', () => {
    const res = handleAzyrPages(Tzeentch2)
    expect(res).toEqual([
      'FACTION: Tzeentch',
      "MERCENARY COMPANY: Skroug's Menagerie",
      'UNIT: Gaunt Summoner of Tzeentch',
      'UNIT: Pink Horrors of Tzeentch',
      'UNIT: Burning Chariots of Tzeentch',
      'UNIT: Chaos Spawn',
      'BATTALION: Aether-eater Host',
      'BATTALION: Alter-kin Coven',
      "BATTALION: Overseer's Fate-twisters",
      "ENDLESS SPELL: Ravenak's Gnashing Jaws",
    ])
  })

  it('handles Nurgle3', () => {
    const res = handleAzyrPages(Nurgle3)
    expect(res).toEqual([
      'FACTION: Nurgle',
      'UNIT: Archaon',
      'UNIT: Chaos Lord on Manticore',
      'UNIT: Daemon Prince',
      'UNIT: Great Unclean One',
      'UNIT: Poxbringer, Herald of Nurgle',
      'UNIT: Rotigus',
      'UNIT: Spoilpox Scrivener, Herald of Nurgle',
      'UNIT: The Glottkin',
      'UNIT: Verminlord Corruptor',
      'UNIT: Chaos Marauders',
      'UNIT: Chaos Warriors',
      'UNIT: Plaguebearers',
      'UNIT: Putrid Blightkings',
      'UNIT: Plagueclaw',
      'UNIT: Plague Censer Bearers',
      'UNIT: Plague Drones',
      'UNIT: Plague Monks',
      'BATTALION: Blighted Warband',
      "BATTALION: Nurgle's Deluge",
      'ENDLESS SPELL: Emerald Lifeswarm',
    ])
  })

  it('handles Gloomspite1', () => {
    const res = handleAzyrPages(Gloomspite1)
    expect(res).toEqual([
      'FACTION: Gloomspite Gitz',
      'UNIT: Dankhold Troggboss',
      'UNIT: Fungoid Cave-Shaman',
      'UNIT: Loonboss',
      'UNIT: Skragrott, The Loonking',
      'UNIT: Troggoth Hag',
      'UNIT: Zarbag',
      'UNIT: Shootas',
      'UNIT: Stabbas',
      'UNIT: Arachnarok Spider',
      'UNIT: Colossal Squig',
      'UNIT: Mangler Squigs',
      'UNIT: Skitterstrand Arachnarok',
      'UNIT: Squig Gobba',
      'UNIT: Boingrot Bounderz',
      'UNIT: Fellwater Troggoths',
      'UNIT: Loonsmasha Fanatics',
      'UNIT: Rockgut Troggoths',
      'UNIT: Squig Herd',
      'UNIT: Squig Hoppers',
      'BATTALION: Squig Rider Stampede',
      'ENDLESS SPELL: Aethervoid Pendulum',
    ])
  })

  it('handles FEC1', () => {
    const res = handleAzyrPages(FEC1)
    expect(res).toEqual([
      'FACTION: Flesh-eater Courts',
      'ALLEGIANCE: Gristlegore',
      'MERCENARY COMPANY: The Gutstuffers',
      'UNIT: Abhorrant Ghoul King',
      'UNIT: Crypt Ghouls',
      'UNIT: Royal Terrorgheist',
      'UNIT: Royal Zombie Dragon',
      'UNIT: Crypt Flayers',
      'UNIT: Crypt Horrors',
      'BATTALION: Cannibal Court',
      "BATTALION: King's Ghouls",
    ])
  })

  it('handles DoK1', () => {
    const res = handleAzyrPages(DoK1)
    expect(res).toEqual([
      'FACTION: Daughters of Khaine',
      'ALLEGIANCE: Hagg Nar',
      'REALMSCAPE: SHYISH',
      'MERCENARY COMPANY: Order of the Blood-Drenched Rose',
      'UNIT: Bloodwrack Shrine',
      'UNIT: Morathi, High Oracle of Khaine',
      'UNIT: Sisters of Slaughter',
      'UNIT: Witch Aelves',
      'UNIT: Avatar of Khaine',
      'UNIT: Blood Stalkers',
      'BATTALION: War Coven of Morathi',
      'ENDLESS SPELL: Wheels of Excruciation',
    ])
  })

  it('handles Sylvaneth1', () => {
    const res = handleAzyrPages(Sylvaneth1)
    expect(res).toEqual([
      'FACTION: Sylvaneth',
      'ALLEGIANCE: Dreadwood',
      'UNIT: Alarielle the Everqueen',
      'UNIT: Branchwych',
      'UNIT: Treelord Ancient',
      'UNIT: Dryads',
      'UNIT: Spite-Revenants',
      'UNIT: Tree-Revenants',
      'UNIT: Kurnoth Hunters',
      'BATTALION: Wargrove',
      'ENDLESS SPELL: Balewind Vortex',
    ])
  })

  it('handles Order1', () => {
    const res = handleAzyrPages(Order1)
    expect(res).toEqual([
      'FACTION: Order',
      'REALMSCAPE: AQSHY',
      "MERCENARY COMPANY: Nimyard's Rough-Riders",
      'UNIT: Arch-Revenant',
      'UNIT: Lord-Arcanum',
      'UNIT: Morathi, High Oracle of Khaine',
      'UNIT: Slaughter Queen on Cauldron of Blood',
      'UNIT: Sisters of Slaughter',
      'UNIT: Vulkite Berzerkers',
      'UNIT: Witch Aelves',
      'UNIT: Razordons',
      "UNIT: Steelheart's Champions",
      "UNIT: Stormsire's Cursebreakers",
      'ENDLESS SPELL: Geminids of Uhl-Gysh',
      "ENDLESS SPELL: Scrapskuttle's Arachnacauldron",
      'SCENERY: Penumbral Engine',
    ])
  })

  it('handles KO2', () => {
    const res = handleAzyrPages(KO2)
    expect(res).toEqual([
      'FACTION: Kharadron Overlords',
      'ALLEGIANCE: Bar ak-Nar, City of the First Sunrise',
      'Kharadron Code: Respect y our Commanders; Trust Aethermatics, Not Superstition; Thr ough Knowledge, Power; Without Our Ships, We Ar e Naught',
      'UNIT: Aether-Khemist',
      'COMMAND TRAIT: Champion of Progress',
      'UNIT: Aetheric Navigator',
      'UNIT: Arkanaut Admiral',
      'ARTEFACT: Staff of Ocular Optimisation',
      'UNIT: Brokk Grungsson, Lord-Magnate of Barak-Nar',
      'ALLY: Lord-Arcanum',
      'ALLY: Knight-Incantor',
      'ALLY: Lord-Exorcist',
      'UNIT: Arkanaut Company',
      'UNIT: Grundstok Gunhauler',
      'UNIT: Arkanaut Frigate',
      'UNIT: Arkanaut Ironclad',
      'BATTALION: Aetherstrike Force',
      'BATTALION: Iron Sky Command',
      'BATTALION: Grand Armada',
      'BATTALION: Grundstok Escort Wing',
      'BATTALION: Iron Sky Squadron',
      'UNIT: Endrinriggers',
      'UNIT: Prosecutors',
      'WEAPON: Celestial Hammer(s)',
      'WEAPON: Grandhammer',
      'UNIT: Skywardens',
      "UNIT: Thundrik's Profiteers",
      'ALLY: Evocators',
      'ALLY: Gyrobombers',
      'ALLY: Gyrocopters',
      'ALLY: Hammerers',
      'ALLY: Ironbreakers',
      'ALLY: Irondrakes',
      'ALLY: Quarrellers',
      'ALLY: Thunderers',
      'UPGRADE: Standard Bearer',
      'UPGRADE: Drummers',
      "ALLY: Steelheart's Champions",
    ])
  })

  it('handles BoC1', () => {
    const res = handleAzyrPages(BoC1)
    expect(res).toEqual([
      'FACTION: Beasts of Chaos',
      'UNIT: Beastlord',
      'ARTEFACT: The Knowing Eye',
      'UNIT: Doombull',
      'COMMAND TRAIT: Rampant Juggernaut',
      'ARTEFACT: Blackened Armour of Chaos',
      'UNIT: Dragon Ogor Shaggoth',
      'SPELL: Sundering Blades',
      'UNIT: Great Bray-Shaman',
      'SPELL: Tendrils of Atrophy',
      'UNIT: Tzaangor Shaman',
      'SPELL: Titanic Fur',
      'ALLY: Sayl the Faithless',
      'ALLY: Theddra Skull-Scryer',
      'ALLY: Darkoath Warqueen',
      'UNIT: Bullgors',
      'UNIT: Gors',
      'UNIT: Ungors',
      'UNIT: Chaos Gargant',
      'UNIT: Chimera',
      'UNIT: Cygor',
      'UNIT: Ghorgon',
      'UNIT: Jabberslythe',
      'BATTALION: Brass Despoilers',
      'BATTALION: Depraved Drove',
      'BATTALION: Desolating Beastherd',
      'BATTALION: Hungering Warherd',
      'BATTALION: Marauding Brayherd',
      'BATTALION: Pestilent Throng',
      'BATTALION: Phantasmagoria of Fate',
      'BATTALION: Thunderscorn Stormherd',
      'UNIT: Bestigors',
      'UNIT: Centigors',
      'UNIT: Chaos Spawn',
      'UNIT: Chaos Warhounds',
      'UNIT: Cockatrice',
      'UNIT: Dragon Ogors',
      'UNIT: Razorgors',
      'UNIT: Tuskgor Chariots',
      'UNIT: Tzaangor Enlightened',
      'UNIT: Tzaangor Skyfires',
      'UNIT: Tzaangors',
      'UNIT: Ungor Raiders',
      'ALLY: Untamed Beasts',
      'ALLY: Godsworn Hunt',
      'ALLY: Furies',
    ])
  })

  it('handles GHoN1', () => {
    const res = handleAzyrPages(GHoN1)
    expect(res).toEqual([
      'FACTION: Grand Host of Nagash',
      'UNIT: Nagash, Supreme Lord of the Undead',
      'SPELL: Amethystine Pinions',
      'UNIT: Arkhan the Black, Mortarch of Sacrament',
      'SPELL: Fading Vigour',
      'UNIT: Mannfred, Mortarch of Night',
      'SPELL: Decrepify',
      'UNIT: Neferata, Mortarch of Blood',
      'SPELL: Spirit Gale',
      'UNIT: Prince Vhordrai',
      'SPELL: Amaranthine Orb',
      'ALLY: Lady Olynder',
      'ALLY: Reikenor The Grimhailer',
      'ALLY: Varghulf Courtier',
      'ARTEFACT: Balefire Lantern',
      'UNIT: Zombies',
      'UNIT: Skeleton Warriors',
      'UNIT: Morghast Harbingers',
      'UNIT: Morghast Archai',
      'UNIT: Grave Guard',
      'UNIT: Dire Wolves',
      'UNIT: Chainrasp Horde',
      'BATTALION: The First Cohort',
      'UNIT: Bat Swarms',
      'UNIT: Black Knights',
      'UNIT: Blood Knights',
      'UNIT: Corpse Cart',
      'UNIT: Fell Bats',
      'UNIT: Glaivewraith Stalkers',
      'UNIT: Grimghast Reapers',
      'UNIT: Hexwraiths',
      'UNIT: Legion Black Coach',
      'UNIT: Spirit Hosts',
      'UNIT: The Sepulchral Guard',
      'UNIT: Vargheists',
      'ALLY: Bladegheist Revenants',
      'ALLY: Chainghasts',
      'ALLY: Crypt Flayers',
      'ALLY: Crypt Horrors',
      'ALLY: Dreadscythe Harridans',
      'ALLY: Glaivewraith Stalkers',
      'ENDLESS SPELL: Horrorghast',
      'ENDLESS SPELL: Lauchon the Soulseeker',
      'ENDLESS SPELL: Soulscream Bridge',
      'ENDLESS SPELL: Soulsnare Shackles',
      'ENDLESS SPELL: Suffocating Gravetide',
      'ENDLESS SPELL: Vault of Souls',
    ])
  })

  it('handles Khorne1', () => {
    const res = handleAzyrPages(Khorne1)
    expect(res).toEqual([
      'FACTION: Khorne',
      'ALLEGIANCE: Skullfiend Tribe',
      'UNIT: Bloodsecrator',
      'UNIT: Bloodstoker',
      'UNIT: Bloodthirster',
      'UNIT: Aspiring Deathbringer',
      'UNIT: Herald of Khorne on Blood Throne',
      'UNIT: Mighty Lord of Khorne',
      'UNIT: Skullgrinder',
      'UNIT: Flesh Hounds',
      'UNIT: Blood Warriors',
      'UNIT: Bloodletters',
      'UNIT: Bloodreavers',
      'UNIT: Skull Cannons',
      'ALLY: Plagueclaw',
      'UNIT: Chaos War Mammoth',
      'UNIT: Soul Grinder',
      'UNIT: Mazarall the Butcher',
      'BATTALION: Blood Host',
      'BATTALION: Blood Hunt',
      'BATTALION: Blood Legion',
      'BATTALION: Bloodbound Warhorde',
      'BATTALION: Bloodforged',
      'BATTALION: Bloodmad Warband',
      'BATTALION: Bloodthunder Stampede',
      'BATTALION: Brass Despoilers',
      'BATTALION: Brass Stampede',
      'BATTALION: Charnel Host',
      'BATTALION: Dark Feast',
      'BATTALION: Gore Pilgrims',
      'BATTALION: Gorechosen',
      'BATTALION: Gorethunder Cohort',
      'BATTALION: Murderhost',
      'BATTALION: Red Headsmen',
      'BATTALION: Skullseeker Host',
      'BATTALION: Skulltake',
      'BATTALION: Slaughterborn',
      'BATTALION: Tyrants of Blood',
      'UNIT: Bestigors',
      'UNIT: Bloodcrushers',
      'UNIT: Bullgors',
      'UNIT: Centigors',
      'UNIT: Chaos Chariots',
      'UNIT: Chaos Chosen',
      'UNIT: Chaos Gorebeast Chariots',
      'UNIT: Chaos Knights',
      'UNIT: Chaos Marauder Horsemen',
      'UNIT: Chaos Spawn',
      'UNIT: Dragon Ogors',
      "UNIT: Garrek's Reavers",
      'UNIT: Karanak',
      'UNIT: Khorgoraths',
      "UNIT: Magore's Fiends",
      'UNIT: Mighty Skullcrushers',
      'UNIT: Riptooth',
      'UNIT: Skullreapers',
      'UNIT: Tuskgor Chariots',
      'UNIT: Wrathmongers',
      'ALLY: Tzaangor Enlightened',
      'ALLY: The Unmade',
      'ALLY: Beasts of Nurgle',
      'ALLY: Chaos Chariots',
      'ALLY: Chaos Gorebeast Chariots',
      'ALLY: Chaos Marauder Horsemen',
      'ALLY: Daemon Plague Toads of Nurgle',
      'ALLY: Furies',
      'ALLY: Khorgoraths',
      'ALLY: Nightmaw',
      'ALLY: Plague Monks',
      'ALLY: Pusgoyle Blightlords',
      'ENDLESS SPELL: Bleeding Icon',
      'ENDLESS SPELL: Hexgorger Skulls',
      'ENDLESS SPELL: Wrath-Axe',
    ])
  })

  it('handles Tzeentch1', () => {
    const res = handleAzyrPages(Tzeentch1)
    expect(res).toEqual([
      'FACTION: Tzeentch',
      'REALMSCAPE: HYSH',
      'UNIT: Curseling, Eye of Tzeentch',
      'COMMAND TRAIT: Cult Demagogue',
      'ARTEFACT: Windthief Charm',
      'UNIT: Exalted Greater Daemon of Tzeentch',
      'ARTEFACT: Cursed Ichor',
      "SPELL: Tzeentch's Firestorm",
      'UNIT: Gaunt Summoner of Tzeentch',
      'ARTEFACT: Warpfire Blade',
      'SPELL: Fold Reality',
      'UNIT: Gaunt Summoner on Disc of Tzeentch',
      'ARTEFACT: Wicked Shard',
      'SPELL: Bolt of Tzeentch',
      'UNIT: Herald of Tzeentch',
      'ARTEFACT: Sash of the Ten Paradises',
      "SPELL: Tzeentch's Inferno",
      'UNIT: Kairos Fateweaver',
      'SPELL: Uncheck ed Mutation',
      'UNIT: Ogroid Thaumaturge',
      'ARTEFACT: Souldraught',
      'UNIT: The Changeling',
      'SPELL: Treason of Tzeentch',
      'UNIT: Tzaangors',
      'UPGRADE: Icon Bearers',
      'WEAPON: Savage Greatblade',
      'UNIT: Pink Horrors of Tzeentch',
      'SPELL: Arcane Transformation',
      'UNIT: Kairic Acolytes',
      'UNIT: Chaos Warriors',
      'UPGRADE: Hornblower',
      'UNIT: Chaos Marauders',
      'UPGRADE: Brayhorn',
      'UPGRADE: Tzaangor Mutant',
      'WEAPON: Savage Blade(s)',
      'ALLY: Ungors',
      'ALLY: Gors',
      'UNIT: Mutalith Vortex Beast of Tzeentch',
      'UNIT: Gigantic Chaos Spawn',
      'ALLY: Chaos War Mammoth',
      'BATTALION: Aether-eater Host',
      'BATTALION: Alter-kin Coven',
      'BATTALION: Arcanite Cabal',
      'BATTALION: Arcanite Cult',
      'BATTALION: Changehost',
      'BATTALION: Cult of the Transient Form',
      'BATTALION: Multitudinous Host',
      'BATTALION: Omniscient Oracles',
      "BATTALION: Overseer's Fate-twisters",
      'BATTALION: Phantasmagoria of Fate',
      'BATTALION: Skyshoal Coven',
      'BATTALION: The Eternal Conflagration',
      'BATTALION: The Hosts Duplicitous',
      'BATTALION: The Pyrofane Cult',
      'BATTALION: Tzaangor Coven',
      'BATTALION: Warpflame Host',
      'BATTALION: Witchfyre Coven',
      'UNIT: Bestigors',
      'UNIT: Blue Horrors of Tzeentch',
      'UNIT: Brimstone Horrors of Tzeentch',
      'UNIT: Bullgors',
      'UNIT: Burning Chariots of Tzeentch',
      'UNIT: Centigors',
      'UNIT: Chaos Chariots',
      'UNIT: Chaos Chosen',
      'UNIT: Chaos Gorebeast Chariots',
      'UNIT: Chaos Knights',
      'UNIT: Chaos Marauder Horsemen',
      'UNIT: Chaos Spawn',
      'UNIT: Dragon Ogors',
      'UNIT: Exalted Flamers of Tzeentch',
      'UNIT: Eyes of the Nine',
      'UNIT: Flamers of Tzeentch',
      'UNIT: Screamers of Tzeentch',
      'UNIT: Tuskgor Chariots',
      'UNIT: Tzaangor Enlightened',
      'UNIT: Tzaangor Skyfires',
      'UNIT: Tzeentch Chaos Spawn',
      'UNIT: Ungor Raiders',
      'ALLY: Nightmaw',
      'ALLY: Skin Wolves',
      'ALLY: Razorgors',
      'ALLY: Varanguard',
    ])
  })

  it('handles Nurgle1', () => {
    const res = handleAzyrPages(Nurgle1)
    expect(res).toEqual([
      'FACTION: Nurgle',
      'UNIT: Bloab Rotspawned',
      'UNIT: Exalted Greater Daemon of Nurgle',
      'UNIT: Tamurkhan the Maggot Lord',
      'UNIT: The Glottkin',
      'UNIT: Orghotts Daemonspew',
      'ALLY: Bladebringer',
      'ALLY: Dragon Ogor Shaggoth',
      'ALLY: Beastlord',
      'UNIT: Chaos Marauders',
      'UNIT: Chaos Warriors',
      'UNIT: Plaguebearers',
      'UNIT: Putrid Blightkings',
      'UNIT: Plagueclaw',
      'ALLY: Skull Cannons',
      'BATTALION: Thricefold Befoulment',
      'BATTALION: The Munificent Wanderers',
      'BATTALION: The Blessed Sons',
      'BATTALION: Tallyband of Nurgle',
      'BATTALION: Plague Cyst',
      'BATTALION: Pestilent Throng',
      "BATTALION: Nurgle's Menagerie",
      'BATTALION: Blight Cyst',
      'BATTALION: Affliction Cyst',
      'UNIT: Beasts of Nurgle',
      'UNIT: Bestigors',
      'UNIT: Bile Troggoths',
      'UNIT: Bullgors',
      'UNIT: Centigors',
      'UNIT: Chaos Chariots',
      'UNIT: Chaos Chosen',
      'UNIT: Chaos Gorebeast Chariots',
      'UNIT: Chaos Knights',
      'UNIT: Chaos Marauder Horsemen',
      'UNIT: Chaos Spawn',
      'UNIT: Daemon Plague Toads of Nurgle',
      'UNIT: Daemon Pox Riders of Nurgle',
      'UNIT: Dragon Ogors',
      'UNIT: Nurglings',
      'UNIT: Plague Censer Bearers',
      'UNIT: Plague Drones',
      'UNIT: Plague Monks',
      'UNIT: Plague Ogors',
      'UNIT: Pusgoyle Blightlords',
      'UNIT: Tuskgor Chariots',
      'UNIT: Ungor Raiders',
      'ALLY: Corvus Cabal',
      'ALLY: Cypher Lords',
      'ALLY: Cockatrice',
      'ALLY: Iron Golems',
      'ALLY: Karanak',
      'ALLY: Skin Wolves',
      'ALLY: Splintered Fang',
      'ALLY: The Unmade',
      'ALLY: Untamed Beasts',
      'ENDLESS SPELL: Balewind Vortex',
    ])
  })

  it('handles Nurgle2', () => {
    const res = handleAzyrPages(Nurgle2)
    expect(res).toEqual([
      'FACTION: Nurgle',
      'REALMSCAPE: SHYISH',
      'UNIT: The Glottkin',
      'SPELL: Rancid Visitations',
      'UNIT: Sorcerer',
      "COMMAND TRAIT: Grandfather's Blessing",
      'ARTEFACT: Mutter grub',
      'SPELL: Blades of Putr efaction',
      'UNIT: Great Bray-Shaman',
      'UNIT: Chaos Sorcerer Lord',
      'ARTEFACT: Goblet of Draining',
      'UNIT: Ungors',
      'UNIT: Gors',
      'BATTALION: Pestilent Throng',
      'UNIT: Bestigors',
      'UPGRADE: Brayhorn',
      'UPGRADE: Banner Bearer',
      'UNIT: Ungor Raiders',
      'UNIT: Centigors',
    ])
  })

  it('handles LoG1', () => {
    const res = handleAzyrPages(LoG1)
    expect(res).toEqual([
      'FACTION: Legion of Grief',
      'REALMSCAPE: ULGU',
      'UNIT: Lady Olynder',
      'SPELL: Shroud of Terror',
      'UNIT: Kurdoss Valentian',
      'UNIT: Knight of Shrouds',
      'UNIT: Dreadblade Harrow',
      // Purposefully not fixing the below typo in order to test later
      'ARTEFACT: Blade of the Thir teen Dominions',
      'UNIT: Necromancer',
      'ARTEFACT: Dimensional Blade',
      'SPELL: Dread Withering',
      'UNIT: The Briar Queen',
      'UNIT: Arkhan the Black, Mortarch of Sacrament',
      'UNIT: Wight King',
      'UNIT: Chainrasp Horde',
      'UNIT: Dire Wolves',
      'UNIT: Skeleton Warriors',
      'UPGRADE: Hornblower',
      'UPGRADE: Standard Bearer',
      'UNIT: Zombies',
      'UPGRADE: Noise Maker',
      'UNIT: Black Coach',
      'UNIT: Mortis Engine',
      'UNIT: Black Knights',
      'UNIT: Bladegheist Revenants',
      'UNIT: Chainghasts',
      'UNIT: Corpse Cart',
      'UNIT: Dreadscythe Harridans',
      'UNIT: Glaivewraith Stalkers',
      'UNIT: Grave Guard',
      'UNIT: Grimghast Reapers',
      'UNIT: Hexwraiths',
      'UNIT: Legion Black Coach',
      'UNIT: Morghast Archai',
      'UNIT: Morghast Harbingers',
      'UNIT: Myrmourn Banshees',
      'UNIT: Spirit Hosts',
      'UNIT: The Sepulchral Guard',
      'UNIT: Thorns of the Briar Queen',
      'ENDLESS SPELL: Aethervoid Pendulum',
      'ENDLESS SPELL: Balewind Vortex',
      'ENDLESS SPELL: Bell of Doom',
      'ENDLESS SPELL: Cadaverous Barricade',
      'ENDLESS SPELL: Celestian Vortex',
      'ENDLESS SPELL: Chalice of Ushoran',
      'ENDLESS SPELL: Chronomantic Cogs',
      'ENDLESS SPELL: Corpsemare Stampede',
      'ENDLESS SPELL: Dais Arcanum',
      'ENDLESS SPELL: Doomblast Dirgehorn',
      'ENDLESS SPELL: Dreadful Visage',
      'ENDLESS SPELL: Emerald Lifeswarm',
      'ENDLESS SPELL: Everblaze Comet',
      'ENDLESS SPELL: Geminids of Uhl-Gysh',
      'ENDLESS SPELL: Gladewyrm',
      'ENDLESS SPELL: Horrorghast',
      'ENDLESS SPELL: Lauchon the Soulseeker',
      'ENDLESS SPELL: Malevolent Maelstrom',
      'ENDLESS SPELL: Malevolent Moon',
      'ENDLESS SPELL: Mesmerising Mirror',
      "ENDLESS SPELL: Mork's Mighty Mushroom",
      'ENDLESS SPELL: Mortalis Terminexus',
      'ENDLESS SPELL: Prismatic Palisade',
      'ENDLESS SPELL: Purple Sun of Shyish',
      'ENDLESS SPELL: Quicksilver Swords',
      "ENDLESS SPELL: Ravenak's Gnashing Jaws",
      'ENDLESS SPELL: Ravening Direflock',
      "ENDLESS SPELL: Scrapskuttle's Arachnacauldron",
      'ENDLESS SPELL: Scuttletide',
      'ENDLESS SPELL: Shards of Valagharr',
      'ENDLESS SPELL: Shyish Reaper',
      'ENDLESS SPELL: Soulscream Bridge',
      'ENDLESS SPELL: Soulsnare Shackles',
      'ENDLESS SPELL: Spiteswarm Hive',
      'ENDLESS SPELL: Suffocating Gravetide',
      'ENDLESS SPELL: The Burning Head',
      'ENDLESS SPELL: Umbral Spellportal',
      'ENDLESS SPELL: Vault of Souls',
      'ENDLESS SPELL: Vengeful Skullroot',
      'ENDLESS SPELL: Vermintide',
      'ENDLESS SPELL: Warp Lightning Vortex',
      'ENDLESS SPELL: Wheels of Excruciation',
      'ENDLESS SPELL: Wildfire Taurus',
    ])
  })

  it('handles Chaos2', () => {
    const res = handleAzyrPages(Chaos2)
    expect(res).toEqual([
      'FACTION: Chaos',
      'UNIT: Arch-Warlock',
      'UNIT: Aspiring Deathbringer',
      "UNIT: Be'lakor, Chaos Daemon Prince",
      "UNIT: Bull Centaur Taur'ruk",
      'UNIT: Curseling, Eye of Tzeentch',
      'UNIT: Epidemius, Tallyman of Nurgle',
      'UNIT: Exalted Hero of Chaos',
      'UNIT: Gaunt Summoner on Disc of Tzeentch',
      'UNIT: Great Bray-Shaman',
      'UNIT: Herald of Khorne on Blood Throne',
      'UNIT: Herald of Tzeentch',
      'UNIT: Infernal Enrapturess',
      'UNIT: Keeper of Secrets',
      'UNIT: Lord Skreech Verminking',
      'UNIT: Lord of Blights',
      'UNIT: Magister',
      'UNIT: Ogroid Thaumaturge',
      'UNIT: Plague Priest',
      'UNIT: Poxbringer, Herald of Nurgle',
      "UNIT: Shar'tor the Executioner",
      'UNIT: Skaarac the Bloodborn',
      'UNIT: Skarbrand',
      'UNIT: Slaughterpriest',
      'UNIT: Sloppity Bilepiper, Herald of Nurgle',
      'UNIT: Spoilpox Scrivener, Herald of Nurgle',
      "UNIT: Syll'Esske",
      'UNIT: Tamurkhan the Maggot Lord',
      'UNIT: The Changeling',
      'UNIT: Theddra Skull-Scryer',
      'UNIT: Verminlord Corruptor',
      'UNIT: Verminlord Warbringer',
      'UNIT: Vorgaroth the Scarred & Skalok The Skull Host of Khorne',
      'UNIT: Vortemis the All-seeing',
      'UNIT: Wrath of Khorne Bloodthirster',
      'UNIT: Blood Warriors',
      'UNIT: Chaos Marauders',
      'UNIT: Daemonettes',
      'UNIT: Gors',
      'UNIT: Pink Horrors of Tzeentch',
      'UNIT: Plaguebearers',
      'UNIT: Tzaangors',
      'UNIT: Deathshrieker Rocket Launcher',
      'UNIT: Dreadquake Mortar',
      'UNIT: Plagueclaw',
      'UNIT: Skull Cannons',
      'UNIT: Warp Lightning Cannon',
      'UNIT: Warplock Jezzails',
      'UNIT: Beasts of Nurgle',
      'UNIT: Chaos Gorebeast Chariots',
      'UNIT: Chaos Spawn',
      'UNIT: Doom-Flayer',
      'UNIT: Exalted Flamers of Tzeentch',
      'UNIT: Fiends',
      'UNIT: Flamers of Tzeentch',
      'UNIT: Forsaken',
      'UNIT: Furies',
      "UNIT: Garrek's Reavers",
      'UNIT: Gutter Runners',
      'UNIT: Hellstriders',
      'UNIT: Infernal Guard Fireglaives',
      'UNIT: Iron Golems',
      'UNIT: Karanak',
      "UNIT: K'daai Fireborn",
      'UNIT: Mighty Skullcrushers',
      'UNIT: Plague Monks',
      'UNIT: Screamers of Tzeentch',
      'UNIT: Skullreapers',
      "UNIT: Spiteclaw's Swarm",
      'UNIT: Tuskgor Chariots',
      'UNIT: Tzaangor Enlightened',
      'UNIT: Tzaangor Skyfires',
      'UNIT: Tzeentch Chaos Spawn',
      'UNIT: Ungor Raiders',
      'UNIT: Untamed Beasts',
      'UNIT: Varanguard',
      'UNIT: Warp-Grinder',
      'UNIT: Warpfire Thrower',
      'ENDLESS SPELL: Aethervoid Pendulum',
      'ENDLESS SPELL: Balewind Vortex',
      'ENDLESS SPELL: Bell of Doom',
      'ENDLESS SPELL: Celestian Vortex',
      'ENDLESS SPELL: Doomblast Dirgehorn',
      'ENDLESS SPELL: Horrorghast',
      'ENDLESS SPELL: Lauchon the Soulseeker',
      'ENDLESS SPELL: Malevolent Maelstrom',
      'ENDLESS SPELL: Mesmerising Mirror',
      'ENDLESS SPELL: Ravening Direflock',
      "ENDLESS SPELL: Scrapskuttle's Arachnacauldron",
      'ENDLESS SPELL: Scuttletide',
      'ENDLESS SPELL: Shards of Valagharr',
      'ENDLESS SPELL: Suffocating Gravetide',
      'ENDLESS SPELL: The Burning Head',
      'ENDLESS SPELL: Umbral Spellportal',
      'ENDLESS SPELL: Vault of Souls',
      'ENDLESS SPELL: Wheels of Excruciation',
      'SCENERY: Penumbral Engine',
    ])
  })

  it('handles KO1 army', () => {
    const res = handleAzyrPages(KO1)
    expect(res).toEqual([
      'FACTION: Kharadron Overlords',
      // The below typo is left in place to test against later
      'ALLEGIANCE: Bar ak-Thr yng, City of the Ancest ors',
      'Kharadron Code: Settle The Grudges; Trust To Your Guns; Honour The Gods, Just In Case; These Ar e Just Guidelines',
      'UNIT: Aether-Khemist',
      'UNIT: Aetheric Navigator',
      'UNIT: Arkanaut Admiral',
      'UNIT: Bjorgen Thundrik',
      'UNIT: Brokk Grungsson, Lord-Magnate of Barak-Nar',
      'UNIT: Endrinmaster',
      'UNIT: Arkanaut Company',
      'UNIT: Grundstok Gunhauler',
      'UNIT: Arkanaut Frigate',
      'UNIT: Arkanaut Ironclad',
      "UNIT: Thundrik's Profiteers",
      'UNIT: Skywardens',
      'UNIT: Grundstok Thunderers',
      'UNIT: Endrinriggers',
    ])
  })

  it('handles Ironjawz1', () => {
    const res = handleAzyrPages(Ironjawz1)
    expect(res).toEqual([
      'FACTION: Ironjawz',
      'UNIT: Megaboss on Maw-krusha',
      'COMMAND TRAIT: Brutish Cunning',
      'ARTEFACT: The Golden Toof',
      'UNIT: Gordrakk, the Fist of Gork',
      'UNIT: Orruk Megaboss',
      'ARTEFACT: The Boss Skewer',
      'UNIT: Orruk Warchanter',
      'ARTEFACT: Armour of Gork',
      'UNIT: Orruk Weirdnob Shaman',
      "ARTEFACT: Metalrippa's Klaw",
      "SPELL: Da Blazin' Eyes",
      'UNIT: Orruk Ardboys',
      'UNIT: Orruk Brutes',
      'UNIT: Orruk Gore-gruntas',
      'BATTALION: Ardfist',
      'BATTALION: Bloodtoofs',
      'BATTALION: Brawl',
      'BATTALION: Brutefist',
      'BATTALION: Gorefist',
      'BATTALION: Ironfist',
      'BATTALION: Ironsunz',
      'BATTALION: Weirdfist',
      'ALLY: Boingrot Bounderz',
      'ALLY: Dankhold Troggoths',
      'ALLY: Sneaky Snufflers',
      'ALLY: Squig Herd',
    ])
  })

  it('handles GHoN2', () => {
    const res = handleAzyrPages(GHoN2)
    expect(res).toEqual([
      'FACTION: Grand Host of Nagash',
      'REALMSCAPE: SHYISH',
      'UNIT: Necromancer',
      'UNIT: Nagash, Supreme Lord of the Undead',
      'UNIT: Grave Guard',
      'UPGRADE: Standard Bearer',
      'UPGRADE: Hornblower',
      'UNIT: Chainrasp Horde',
      'ENDLESS SPELL: Umbral Spellportal',
      'ENDLESS SPELL: Purple Sun of Shyish',
    ])
  })

  it('handles Slaanesh1', () => {
    const res = handleAzyrPages(Slaanesh1)
    expect(res).toEqual([
      'FACTION: Slaanesh',
      'ALLEGIANCE: Invaders Host',
      'MERCENARY COMPANY: The Sons of the Lichemaster',
      'UNIT: Shalaxi Helbane',
      'SPELL: Pavane of Slaanesh',
      'UNIT: Keeper of Secrets',
      'ALLY: Necromancer',
      'UNIT: Chaos Marauders',
      'UNIT: Chaos Warriors',
      'UNIT: Daemonettes',
      'UNIT: Hellstriders',
      'ALLY: Skeleton Warriors',
      'UNIT: Chaos Marauder Horsemen',
      'ALLY: Corpse Cart',
      'UNIT: Seekers',
      'ENDLESS SPELL: Mesmerising Mirror',
    ])
  })

  it('handles Stormcast1', () => {
    const res = handleAzyrPages(Stormcast1)
    expect(res).toEqual([
      'FACTION: Stormcast Eternals',
      'REALMSCAPE: GHUR',
      'UNIT: Lord-Arcanum',
      'COMMAND TRAIT: Staunch Defender',
      'ARTEFACT: Gryph-feather Charm',
      'SPELL: Celestial Blades',
      'MOUNT TRAIT: Pride Leader',
      'UNIT: Knight-Incantor',
      'SPELL: Stormcaller',
      'SPELL: Lightning Blast',
      'UNIT: Knight-Heraldor',
      'UNIT: Liberators',
      'WEAPON: Grandhammer',
      'WEAPON: Grandblade',
      'UNIT: Judicators',
      'WEAPON: Skybolt Bow',
      'WEAPON: Shockbolt Bow',
      'UNIT: Evocators',
      'SPELL: Terrifying Aspect',
      'UNIT: Vanguard-Palladors',
      'WEAPON: Starstrike Javelin',
      'WEAPON: Boltstorm Pistol',
      'ENDLESS SPELL: Everblaze Comet',
    ])
  })

  it('handles Skaven1', () => {
    const res = handleAzyrPages(Skaven1)
    expect(res).toEqual([
      'FACTION: Skaventide',
      'UNIT: Grey Seer',
      'COMMAND TRAIT: Master of Magic',
      'SPELL: Death Frenzy',
      'SPELL: Skitterleap',
      'UNIT: Warlock Bombardier',
      // Typo left in place to test against later
      'ARTEFACT: Vigor dust Inject or',
      'SPELL: More-more-more Warp Power!',
      'UNIT: Clanrats',
      'UPGRADE: Clawleader',
      'UPGRADE: Clanr at Standard Bearer',
      'UPGRADE: Clanr at Bell-ringer',
      'UNIT: Warplock Jezzails',
      'UNIT: Plague Monks',
      'UPGRADE: Bringer-of-the-Word',
      'UPGRADE: Standard Bearers',
      'UPGRADE: Plague Harbingers',
      'UNIT: Skryre Acolytes',
    ])
  })
})
