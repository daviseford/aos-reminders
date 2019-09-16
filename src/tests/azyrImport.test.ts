import { readFileSync } from 'fs'
import { getAzyrPdfText, handleAzyrPages } from 'components/input/azyr/azyrPdf'

import SeraphonJSON from './fixtures/azyr/json/Seraphon.json'
import ChamonJSON from './fixtures/azyr/json/Chamon.json'
import NagashJSON from './fixtures/azyr/json/Newgash.json'
import NoRealmJSON from './fixtures/azyr/json/NoRealmscape.json'
import SlaaneshMercsJSON from './fixtures/azyr/json/SlaaneshWithMercs.json'
import Stormcast1JSON from './fixtures/azyr/json/Stormcast1.json'
import Skaven1JSON from './fixtures/azyr/json/Skaven1.json'
import Ironjawz1JSON from './fixtures/azyr/json/Ironjawz1.json'
import KO1JSON from './fixtures/azyr/json/KO1.json'

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

  it('handles a KO army', () => {
    const res = handleAzyrPages(KO1JSON)
    console.log(res)
    expect(res).toEqual([
      'FACTION: Khar adr on Ov erlor ds',
      'ALLEGIANCE: Bar ak-Thr yng City of the Ancest ors',
      'Khar adron Code: Settle The Grudges; Trust To Your Guns; Honour The Gods',
      'Just In Case; These Ar e Just Guidelines',
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
      'Mark: Slaanesh',
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
