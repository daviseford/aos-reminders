import { readFileSync } from 'fs'
import { getAzyrPdfText, handleAzyrPages } from 'components/input/azyr/azyrPdf'

import BoCJSON from './fixtures/azyr/json/BoC.json'
import ChamonJSON from './fixtures/azyr/json/Chamon.json'
import ChaosJSON from './fixtures/azyr/json/Chaos.json'
import DeathJSON from './fixtures/azyr/json/Death.json'
import DestructionJSON from './fixtures/azyr/json/Destruction.json'
import DoKJSON from './fixtures/azyr/json/DoK.json'
import FECJSON from './fixtures/azyr/json/FEC.json'
import FyreslayersJSON from './fixtures/azyr/json/Fyreslayers.json'
import Ironjawz1JSON from './fixtures/azyr/json/Ironjawz1.json'
import KhorneJSON from './fixtures/azyr/json/Khorne.json'
import NighthauntJSON from './fixtures/azyr/json/Nighthaunt.json'
import LethisianJSON from './fixtures/azyr/json/Lethisian.json'
import KO1JSON from './fixtures/azyr/json/KO1.json'
import KO2JSON from './fixtures/azyr/json/KO2.json'
import LoGJSON from './fixtures/azyr/json/LoG.json'
import NagashJSON from './fixtures/azyr/json/Newgash.json'
import OrderJSON from './fixtures/azyr/json/Order.json'
import GHoNJSON from './fixtures/azyr/json/GHoN.json'
import GloomspiteJSON from './fixtures/azyr/json/Gloomspite.json'
import WanderersJSON from './fixtures/azyr/json/Wanderers.json'
import NoRealmJSON from './fixtures/azyr/json/NoRealmscape.json'
import Nurgle1JSON from './fixtures/azyr/json/Nurgle1.json'
import Nurgle2JSON from './fixtures/azyr/json/Nurgle_2.json'
import Nurgle3JSON from './fixtures/azyr/json/Nurgle3.json'
import SeraphonJSON from './fixtures/azyr/json/Seraphon.json'
import Skaven1JSON from './fixtures/azyr/json/Skaven1.json'
import SlaaneshMercsJSON from './fixtures/azyr/json/SlaaneshWithMercs.json'
import SylvanethJSON from './fixtures/azyr/json/Sylvaneth.json'
import Stormcast1JSON from './fixtures/azyr/json/Stormcast1.json'
import Stormcast2JSON from './fixtures/azyr/json/Stormcast2.json'
import Tzeentch1JSON from './fixtures/azyr/json/Tzeentch1.json'
import Tzeentch2JSON from './fixtures/azyr/json/Tzeentch2.json'

// TODO: Get this to work :(
// https://github.com/mozilla/pdf.js/issues/7612
xdescribe('getAzyrArmy', () => {
  it('does it', async () => {
    const pdfText = readFileSync(__dirname + '/fixtures/azyr/pdf/Cats.and.Judicators.2000.pdf').buffer
    const typedArray = new Uint8Array(pdfText as any)
    const res = await getAzyrPdfText(typedArray)
    console.log(res)
  }, 300000)
})

/**
 * Testing the Azyr import is a little wonky, because as of right now,
 * importing PDF's locally doesn't work in the local test environment
 *
 * The workaround is to `yarn start` and drop your PDF in the dropzone
 * Then copy the output that says "Copy me" into a JSON file
 *
 * Then test against that JSON below
 */
describe('handleAzyrPages', () => {
  it('handles a simple Seraphon army', () => {
    const res = handleAzyrPages(SeraphonJSON)
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

  it('handles a Chamon-only pdf', () => {
    const res = handleAzyrPages(ChamonJSON)
    expect(res).toEqual(['FACTION: Death', 'REALMSCAPE: CHAMON'])
  })

  it('handles a faction-only pdf', () => {
    const res = handleAzyrPages(NoRealmJSON)
    console.log(res)
    expect(res).toEqual(['FACTION: Death'])
  })

  it('handles a SCE matched play pdf', () => {
    const res = handleAzyrPages(Stormcast2JSON)
    expect(res).toEqual([
      'FACTION: Stormcast Eternals',
      'ALLEGIANCE: CELESTIAL WARBRINGERS',
      'REALMSCAPE: SHYISH',
      'UNIT: Celestant-Prime',
      'UNIT: Knight-Azyros',
      'UNIT: Lord-Castellant',
      'UNIT: Vandus Hammerhand',
      'UNIT: Judicators',
      'UNIT: Liberators',
      'UNIT: Celestar Ballista',
      'UNIT: Concussors',
      'UNIT: Desolators',
      "UNIT: Stormsire's Cursebreakers",
      'BATTALION: Aetherstrike Force',
    ])
  })

  it('handles a Wanderers pdf', () => {
    const res = handleAzyrPages(WanderersJSON)
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
      'BATTALION: Scenery Waystone Pathfinders',
      'SCENERY: Penumbral Engine',
    ])
  })

  it('handles a Nighthaunt pdf', () => {
    const res = handleAzyrPages(NighthauntJSON)
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

  it('handles a Lethisian pdf', () => {
    const res = handleAzyrPages(LethisianJSON)
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

  it('handles a Fyreslayers pdf', () => {
    const res = handleAzyrPages(FyreslayersJSON)
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

  it('handles a Destruction pdf', () => {
    const res = handleAzyrPages(DestructionJSON)
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

  it('handles a Death pdf', () => {
    const res = handleAzyrPages(DeathJSON)
    expect(res).toEqual([
      'FACTION: Death',
      'REALMSCAPE: GHYRAN',
      'UNIT: Arkhan the Black, Mortarch of Sacrament',
      'UNIT: Mannfred, Mortarch of Night',
      'UNIT: Nagash, Supreme Lord of the Undead',
      'UNIT: Necrotect',
      'UNIT: Mortarch of Blood',
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

  it('handles a Chaos pdf', () => {
    const res = handleAzyrPages(ChaosJSON)
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
      'UNIT: Skalok The Skull Host of Khorne',
      'UNIT: Wrath of Khorne Bloodthirster',
      'UNIT: Daemonettes',
      'UNIT: Gors',
      'UNIT: Kairic Acolytes',
      'UNIT: Pink Horrors of Tzeentch',
      'UNIT: Plaguebearers',
      'UNIT: Chimera',
      'UNIT: Hell Pit Abomination',
      'UNIT: Vorgaroth the Scarred & Skalok The Skull Host of Khorne',
      'UNIT: Plagueclaw',
      'UNIT: Warp Lightning Cannon',
      'UNIT: Warplock Jezzails',
      'UNIT: Brimstone Horrors of Tzeentch',
      'UNIT: Burning Chariots of Tzeentch',
      'UNIT: Warp-Grinder',
    ])
  })

  it('handles a Tzeentch pdf', () => {
    const res = handleAzyrPages(Tzeentch2JSON)
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

  it('handles another Nurgle pdf', () => {
    const res = handleAzyrPages(Nurgle3JSON)
    expect(res).toEqual([
      'FACTION: Nurgle',
      'UNIT: Archaon',
      'UNIT: Chaos Lord on Manticore',
      'UNIT: Nurgle Daemon Prince',
      'UNIT: Nurgle Great Unclean One',
      'UNIT: Poxbringer, Herald of Nurgle',
      'UNIT: Rotigus',
      'UNIT: Spoilpox Scrivener, Herald of Nurgle',
      'UNIT: The Glottkin',
      'UNIT: Verminlord Corruptor',
      'UNIT: Chaos Marauders',
      'UNIT: Nurgle Chaos Warriors',
      'UNIT: Nurgle Plaguebearers',
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

  it('handles a Gloomspite pdf', () => {
    const res = handleAzyrPages(GloomspiteJSON)
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

  it('handles an FEC pdf', () => {
    const res = handleAzyrPages(FECJSON)
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

  it('handles a DoK pdf', () => {
    const res = handleAzyrPages(DoKJSON)
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

  it('handles a Sylvaneth pdf', () => {
    const res = handleAzyrPages(SylvanethJSON)
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

  it('handles an Order pdf', () => {
    const res = handleAzyrPages(OrderJSON)
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
      'ENDLESS SPELL: Scenery Geminids of Uhl-Gysh',
      "ENDLESS SPELL: Scrapskuttle's Arachnacauldron",
      'SCENERY: Penumbral Engine',
    ])
  })

  it('handles a long KO pdf', () => {
    const res = handleAzyrPages(KO2JSON)
    expect(res).toEqual([
      'FACTION: Kharadron Overlords',
      'ALLEGIANCE: Bar ak-Nar, City of the First Sunrise',
      'Kharadron Code: Respect y our Commanders; Trust Aethermatics, Not Superstition; Thr ough Knowledge, Power; Without Our Ships, We Ar e Naught',
      'UNIT: Aether-Khemist',
      'COMMAND TRAIT: Champion of Pr ogr ess',
      'UNIT: Aetheric Navigator',
      'UNIT: Arkanaut Admiral',
      'ARTIFACT: Staff of Ocular Optimisation',
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

  it('handles a Beasts of Chaos pdf', () => {
    const res = handleAzyrPages(BoCJSON)
    expect(res).toEqual([
      'FACTION: Beasts of Chaos',
      'UNIT: Beastlord',
      'ARTIFACT: The Knowing Eye',
      'UNIT: Doombull',
      'COMMAND TRAIT: Rampant Juggernaut',
      'ARTIFACT: Black ened Armour of Chaos',
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

  it('handles a Grand Host of Nagash pdf', () => {
    const res = handleAzyrPages(GHoNJSON)
    expect(res).toEqual([
      'FACTION: Grand Host of Nagash',
      'UNIT: Nagash, Supreme Lord of the Undead',
      'SPELL: Amethystine Pinions',
      'UNIT: Arkhan the Black, Mortarch of Sacrament',
      'SPELL: Fading Vigour',
      'UNIT: Mannfred, Mortarch of Night',
      'SPELL: Decr epify',
      'UNIT: Neferata, Mortarch of Blood',
      'SPELL: Spirit Gale',
      'UNIT: Prince Vhordrai',
      'SPELL: Amar anthine Orb',
      'ALLY: Lady Olynder',
      'ALLY: Reikenor The Grimhailer',
      'ALLY: Varghulf Courtier',
      'ARTIFACT: Balefir e Lantern',
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

  it('handles a Khorne pdf', () => {
    const res = handleAzyrPages(KhorneJSON)
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

  it('handles a 9550pt Tzeentch pdf', () => {
    const res = handleAzyrPages(Tzeentch1JSON)
    expect(res).toEqual([
      'FACTION: Tzeentch',
      'REALMSCAPE: HYSH',
      'UNIT: Curseling, Eye of Tzeentch',
      'COMMAND TRAIT: Cult Demagogue',
      'ARTIFACT: Windthief Charm',
      'UNIT: Exalted Greater Daemon of Tzeentch',
      'ARTIFACT: Cursed Ichor',
      "SPELL: Tzeentch's Firestorm",
      'UNIT: Gaunt Summoner of Tzeentch',
      'ARTIFACT: Warpfire Blade',
      'SPELL: Fold Reality',
      'UNIT: Gaunt Summoner on Disc of Tzeentch',
      'ARTIFACT: Wick ed Shar d',
      'SPELL: Bolt of Tzeentch',
      'UNIT: Herald of Tzeentch',
      'ARTIFACT: Sash of the Ten Paradises',
      "SPELL: Tzeentch's Inferno",
      'UNIT: Kairos Fateweaver',
      'SPELL: Uncheck ed Mutation',
      'UNIT: Ogroid Thaumaturge',
      'ARTIFACT: Souldr aught',
      'UNIT: The Changeling',
      'SPELL: Treason of Tzeentch',
      'UNIT: Tzaangors',
      'UPGRADE: Icon Bearers',
      'WEAPON: Savage Gr eatblade',
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

  it('handles a Nurgle pdf', () => {
    const res = handleAzyrPages(Nurgle1JSON)
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

  it('handles a realistic Nurgle pdf', () => {
    const res = handleAzyrPages(Nurgle2JSON)
    expect(res).toEqual([
      'FACTION: Nurgle',
      'REALMSCAPE: SHYISH',
      'UNIT: The Glottkin',
      'SPELL: Rancid Visitations',
      'UNIT: Sorcerer',
      "COMMAND TRAIT: Grandfather's Blessing",
      'ARTIFACT: Mutter grub',
      'SPELL: Blades of Putr efaction',
      'UNIT: Great Bray-Shaman',
      'UNIT: Chaos Sorcerer Lord',
      'ARTIFACT: Goblet of Dr aining',
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

  it('handles a LoG pdf', () => {
    const res = handleAzyrPages(LoGJSON)
    expect(res).toEqual([
      'FACTION: Legion of Grief',
      'REALMSCAPE: ULGU',
      'UNIT: Lady Olynder',
      'SPELL: Shroud of Terror',
      'UNIT: Kurdoss Valentian',
      'UNIT: Knight of Shrouds',
      'UNIT: Dreadblade Harrow',
      'ARTIFACT: Blade of the Thir teen Dominions',
      'UNIT: Necromancer',
      'ARTIFACT: Dimensional Blade',
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
      'UPGRADE: Noise Mak er',
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

  it('handles a KO army', () => {
    const res = handleAzyrPages(KO1JSON)
    expect(res).toEqual([
      'FACTION: Kharadron Overlords',
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

  it('handles a large Ironjawz army', () => {
    const res = handleAzyrPages(Ironjawz1JSON)
    expect(res).toEqual([
      'FACTION: Ironjawz',
      'UNIT: Megaboss on Maw-krusha',
      'COMMAND TRAIT: Brutish Cunning',
      'ARTIFACT: The Golden Toof',
      'UNIT: Gordrakk, the Fist of Gork',
      'UNIT: Orruk Megaboss',
      'ARTIFACT: The Boss Sk ewer',
      'UNIT: Orruk Warchanter',
      'ARTIFACT: Armour of Gork',
      'UNIT: Orruk Weirdnob Shaman',
      "ARTIFACT: Metalrippa's Klaw",
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

  it('handles a Nagash army', () => {
    const res = handleAzyrPages(NagashJSON)
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

  it('handles Slaanesh + Mercenaries army', () => {
    const res = handleAzyrPages(SlaaneshMercsJSON)
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

  it('handles a generic Stormcast pdf', () => {
    const res = handleAzyrPages(Stormcast1JSON)
    expect(res).toEqual([
      'FACTION: Stormcast Eternals',
      'REALMSCAPE: GHUR',
      'UNIT: Lord-Arcanum',
      'COMMAND TRAIT: Staunch Defender',
      'ARTIFACT: Gryph-feather Charm',
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

  it('handles a Skaven army', () => {
    const res = handleAzyrPages(Skaven1JSON)
    expect(res).toEqual([
      'FACTION: Skaventide',
      'UNIT: Grey Seer',
      'COMMAND TRAIT: Master of Magic',
      'SPELL: Death Frenzy',
      'SPELL: Skitterleap',
      'UNIT: Warlock Bombardier',
      'ARTIFACT: Vigor dust Inject or',
      'SPELL: More-mor e-mor e Warp Power!',
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
