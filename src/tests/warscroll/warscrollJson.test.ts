import { OrrukWarclansFaction } from 'factions/orruk_warclans'
import { readFileSync } from 'fs'
import {
  BEASTS_OF_CHAOS,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GREENSKINZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGION_OF_THE_FIRST_PRINCE,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  ORRUK_WARCLANS,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  TZEENTCH,
} from 'meta/factions'
import path from 'path'
import { RealmscapesEnum } from 'types/realmscapes'
import { DEPRECATED_AOS_3, DEPRECATED_MALIGN_SORCERY } from 'utils/import/options'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/warscroll/json/${filename}.json`), 'utf8'))
}

describe('getWarscrollArmyFromJson', () => {
  it('should correctly read 1640472888490-Warscroll_Builder', () => {
    const parsedText = getFile('1640472888490-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain('Thunderquake (Slayers)')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1640813052545-Warscroll_Builder', () => {
    const parsedText = getFile('1640813052545-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Exalted Greater Demon of Tzeentch')
  })

  it('should correctly read 1639251960341-Warscroll_Builder', () => {
    const parsedText = getFile('1639251960341-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Dracothian Guard Fulminators')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1639742595022-Warscroll_Builder', () => {
    const parsedText = getFile('1639742595022-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Celestant-Prime')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1639830310424-Warscroll_Builder', () => {
    const parsedText = getFile('1639830310424-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1636494719233-Warscroll_Builder', () => {
    const parsedText = getFile('1636494719233-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain("Mannok Da Kunnin'")
    expect(res.selections.units).toContain("Da Kunnin' Krew")
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1635285549882-Warscroll_Builder', () => {
    const parsedText = getFile('1635285549882-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Voice of Da Great Green God')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1633013898450-Warscroll_Builder', () => {
    const parsedText = getFile('1633013898450-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Krondys')
  })

  it('should correctly read 1633110120610-Warscroll_Builder', () => {
    const parsedText = getFile('1633110120610-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Gobsprakk')
  })

  it('should correctly read 1633180523625-Warscroll_Builder', () => {
    const parsedText = getFile('1633180523625-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Amulet of Silvered Sigmarite')
  })

  it('should correctly read 1633446211037-Warscroll_Builder', () => {
    const parsedText = getFile('1633446211037-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Yndrasta')
  })

  it('should correctly read 1633448352023-Warscroll_Builder', () => {
    const parsedText = getFile('1633448352023-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Hedkrakka, Gob of Gork')
    expect(res.selections.units).toContain("Hedkrakka's Madmob")
  })

  it('should correctly read 1632218334853-Warscroll_Builder', () => {
    const parsedText = getFile('1632218334853-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Bastian Carthalos')
  })

  it('should correctly read 1632227524917-Warscroll_Builder', () => {
    const parsedText = getFile('1632227524917-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Tzaangor Enlightened')
  })

  it('should correctly read 1631830675004-Warscroll_Builder', () => {
    const parsedText = getFile('1631830675004-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Kragnos')
  })

  it('should correctly read 1632141762265-Warscroll_Builder', () => {
    const parsedText = getFile('1632141762265-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual('Kruleboyz')
    expect(res.selections.flavors).toContain('Big Yellers')
    expect(res.selections.grand_strategies).toContain('In and Out, Ladz')
  })

  it('should correctly read 1626464166387-Warscroll_Builder', () => {
    const parsedText = getFile('1626464166387-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // They don't have the Ravagers subfaction selected
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Cloak of the Relentless Conqueror',
      },
    ])
  })

  it('should correctly read 1626464255789-Warscroll_Builder', () => {
    const parsedText = getFile('1626464255789-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // expect(res.selections.artifacts).toContain('Cloak of the Relentless Conqueror')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Cloak of the Relentless Conqueror',
      },
    ])
  })

  it('should correctly read 1626008505895-Warscroll_Builder', () => {
    const parsedText = getFile('1626008505895-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Kurnoth Hunters')
  })

  it('should correctly read 1626014331173-Warscroll_Builder', () => {
    const parsedText = getFile('1626014331173-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Bastiladon')
  })

  it('should correctly read 1626087512372-Warscroll_Builder', () => {
    const parsedText = getFile('1626087512372-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.subFactionName).toEqual('Host of the Everchosen')
  })

  it('should correctly read 1626105120863-Warscroll_Builder', () => {
    const parsedText = getFile('1626105120863-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(LEGION_OF_THE_FIRST_PRINCE)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Mark of Khorne',
      },
    ])
  })

  it('should correctly read 1626134104361-Warscroll_Builder', () => {
    const parsedText = getFile('1626134104361-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain("Be'Lakor")
  })

  it('should correctly read 1626145186513-Warscroll_Builder', () => {
    const parsedText = getFile('1626145186513-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.prayers).toContain('Heal')
  })

  it('should correctly read 1626147878336-Warscroll_Builder', () => {
    const parsedText = getFile('1626147878336-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Rotbringer Sorcerer')
  })

  it('should correctly read 1625846409659-Warscroll_Builder', () => {
    const parsedText = getFile('1625846409659-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.triumphs).toContain('Inspired')
    expect(res.selections.triumphs).toContain('Bloodthirsty')
  })

  it('should correctly read 1625851245173-Warscroll_Builder', () => {
    const parsedText = getFile('1625851245173-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Kurnoth Hunters')
  })

  it('should correctly read 1625930081642-Warscroll_Builder', () => {
    const parsedText = getFile('1625930081642-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Yndrasta')
  })

  it('should correctly read 1625930557439-Warscroll_Builder', () => {
    const parsedText = getFile('1625930557439-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Sevireth, Lord of the Seventh Wind')
  })

  it('should correctly read 1605279569874-Warscroll_Builder', () => {
    const parsedText = getFile('1605279569874-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'The Choir of Torments',
      },
      {
        severity: 'warn',
        text: 'Thrill-seeker',
      },
    ])
  })

  it('should correctly read 1610861933877-Warscroll_Builder', () => {
    const parsedText = getFile('1610861933877-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Abhorrant Ghoul King on Royal Terrorgheist')
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_MALIGN_SORCERY,
        severity: 'deprecation-warn',
        text: 'Ethereal Amulet',
      },
    ])
  })

  it('should correctly read 1611179135350-Warscroll_Builder', () => {
    const parsedText = getFile('1611179135350-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    //expect(res.selections.command_traits).toContain('Fateseeker (Big Name)')
    expect(res.selections.command_traits).toContain('Killer Reputation')
  })

  it('should correctly read 1611179341633-Warscroll_Builder', () => {
    const parsedText = getFile('1611179341633-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Arcane Corrasion')
  })

  it('should correctly read 1612355735036-Warscroll_Builder', () => {
    const parsedText = getFile('1612355735036-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toContain('Faultless Blades')
    expect(res.subFactionName).toEqual('Pretenders Host')
  })

  it('should correctly read 1612918099089-Warscroll_Builder', () => {
    const parsedText = getFile('1612918099089-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Bonegrinder Mega-Gargant')
  })

  it('should correctly read 1614371993867-Warscroll_Builder', () => {
    const parsedText = getFile('1614371993867-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toContain('Dhom-Hain')
  })

  it('should correctly read 1598074473619-Warscroll_Builder', () => {
    const parsedText = getFile('1598074473619-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('A Scholar and an Arkanaut')
    expect(res.selections.command_traits).toContain('FOOTNOTE: Without Our Ships, We Are Naught')
  })

  it('should correctly read 1597625107867-Warscroll_Builder', () => {
    const parsedText = getFile('1597625107867-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Seawarden on Foot')
  })

  it('should correctly read 1592754653939-Warscroll_Builder', () => {
    const parsedText = getFile('1592754653939-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Killer Reputation')
    // expect(res.selections.command_traits).toContain('Fateseeker (Big Name)')
  })

  it('should correctly read 1596572409302-Warscroll_Builder', () => {
    const parsedText = getFile('1596572409302-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Collar of Contempt')
  })

  it('should correctly read 1597231391899-Warscroll_Builder', () => {
    const parsedText = getFile('1597231391899-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Varanguard')
  })

  it('should correctly read 1592663232380-Warscroll_Builder', () => {
    const parsedText = getFile('1592663232380-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Skull-helm of Khorne')
  })

  it('should correctly read 1592831552808-Warscroll_Builder', () => {
    const parsedText = getFile('1592831552808-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    //expect(res.selections.command_traits).toContain('Fateseeker (Big Name)')
    expect(res.selections.command_traits).toContain('Killer Reputation')
    // expect(res.selections.command_traits).toContain('Longstrider (Big Name)')
  })

  it('should correctly read 1593886752516-Warscroll_Builder', () => {
    const parsedText = getFile('1593886752516-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Bound Balewind Vortex',
      },
    ])
  })

  it('should correctly read 1593895699238-Warscroll_Builder', () => {
    const parsedText = getFile('1593895699238-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Far-Ranger')
    expect(res.selections.units).toContain('Slayers')
  })

  it('should work with 1588368330846-Warscroll_Builder', () => {
    const parsedText = getFile('1588368330846-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
  })

  it('should work with 1589375182953-Warscroll_Builder', () => {
    const parsedText = getFile('1589375182953-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain("Foe's Bane")
  })

  it('should work with 1589874682978-Warscroll_Builder', () => {
    const parsedText = getFile('1589874682978-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Aether-Khemist')
  })

  it('should work with Vast Intellect - Celestial Apotheosis (trait/spell)', () => {
    const parsedText = getFile('1585065423836-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Celestial Apotheosis')
    expect(res.selections.command_traits).toContain('Vast Intellect')
  })

  it('should work with Fusil of Conflagration', () => {
    const parsedText = getFile('1585867355154-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Fusil of Conflagration')
  })

  it('should work with Hrothgorn', () => {
    const parsedText = getFile('1581874796290-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Hrothgorn')
    expect(res.selections.units).toContain("Hrothgorn's Mantrappers")
  })

  it('should work with Morathi, High Oracle of Khaine (pre-Broken Realms)', () => {
    const parsedText = getFile('1582028528350-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // @ts-expect-error
    expect(res.allySelections[DAUGHTERS_OF_KHAINE].units).toContain('Morathi-Khaine')
  })

  it('should work with Fecund Rituculturalists', () => {
    const parsedText = getFile('1582292305596-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Blades of Putrefaction')
  })

  /* it('should work with Brand of the Split Daemon', () => {
    const parsedText = getFile('1582816094064-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Brand of the Split Daemon')
  }) */

  it("should work with A'rgath the King of Blades", () => {
    const parsedText = getFile('1582909138740-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain("A'rgath, the King of Blades")
  })

  it('should work with The Eyes of the Nine', () => {
    const parsedText = getFile('1584407465731-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('The Eyes of the Nine')
    expect(res.selections.units).toContain('Great Bray-Shaman')
  })

  it('should work with Secret-eater', () => {
    const parsedText = getFile('1581426257666-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Secret-eater')
  })

  it('should work with Legion of Chaos Ascendant (now Legion of the First Prince)', () => {
    const parsedText = getFile('1581436593161-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(LEGION_OF_THE_FIRST_PRINCE)
  })

  it('should work with Fecula Flyblown and The Wurmspat', () => {
    const parsedText = getFile('1581503416759-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Fecula Flyblown')
    expect(res.selections.units).toContain('The Wurmspat')
  })

  it('should work with Sky Port: None', () => {
    const parsedText = getFile('1580985291764-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toEqual([])
  })

  it('should work with Vial of Pure Blood', () => {
    const parsedText = getFile('1581111836908-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Vial of Pure Blood')
  })

  it('should work with any endless spell (KO)', () => {
    const parsedText = getFile('1579105159803-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.endless_spells).toContain('Darkfire Daemonrift')
  })

  it('should work with Greenskinz', () => {
    const parsedText = getFile('1578518862312-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(GREENSKINZ)
  })

  it('should work with The Blood-forged Armour', () => {
    const parsedText = getFile('1578730417865-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('The Blood-forged Armour')
  })

  it('should work with Vitriolic Spray (Anvilgard)', () => {
    const parsedText = getFile('1577866703167-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Vitriolic Spray (Anvilgard, Har Kuron)')
  })

  it('should work with Amethyst Glow/Dread Withering trait/spell', () => {
    const parsedText = getFile('1577088536258-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Amethyst Glow')
    expect(res.selections.spells).toContain('Dread Withering')
  })

  it('should work with Darkling Covens', () => {
    const parsedText = getFile('1577400907052-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // We convert Darkling Covens to Cities of Sigmar
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
  })

  it('should work with legacy High Elf warscrolls', () => {
    const parsedText = getFile('1577741192555-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Highborn Repeater Bolt Thrower')
    expect(res.selections.units).toContain('Highborn Archers')
    expect(res.selections.units).toContain('Loremaster')
  })

  it('should work with The Fleshform Raiment (Noble Heirlooms)', () => {
    const parsedText = getFile('1576858425499-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('The Fleshform Raiment (Noble Heirlooms)')
  })

  it('should work with Guardian of Souls and Chaos allegiance', () => {
    const parsedText = getFile('1574504452431-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CHAOS_GRAND_ALLIANCE)
    // Guardian of Souls is a DEATH unit...
    expect(res.errors).toEqual([{ severity: 'warn', text: 'Guardian of Souls' }])
  })

  /* it('should work with Chaos Hellcannon', () => {
    const parsedText = getFile('1574545285739-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CHAOS_GRAND_ALLIANCE)
    expect(res.selections.units).toEqual([
      'Chaos Lord on Daemonic Mount',
      'Gaunt Summoner of Tzeentch',
      'Chaos Chosen',
      'Chaos Warriors',
      'Varanguard',
      'Tuskgor Chariots',
      'Hellcannon',
    ])
  }) */

  it('should work with Warcry scrolls', () => {
    const parsedText = getFile('1574613461286-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.selections.units).toEqual([
      'Archaon the Everchosen',
      'Darkoath Warqueen',
      'Chaos Sorcerer Lord on Manticore',
      'Varanguard',
      'Untamed Beasts',
      'Cypher Lords',
      'Iron Golems',
    ])
  })

  it('should (not) work with The Wraith Fleet', () => {
    const parsedText = getFile('1576230943609-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'error',
        text: 'The Wraith Fleet are not supported.',
      },
    ])
  })

  it('should work with Master of Defense', () => {
    const parsedText = getFile('1576328165962-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Master of Defence (Order)')
  })

  it('should work with Berzerker Lord', () => {
    const parsedText = getFile('1576328837058-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Berserker Lord')
  })

  it('should work with Slaves to Darkness Chaos Spawn', () => {
    const parsedText = getFile('1576493074441-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Chaos Spawn')
  })

  it('should work with Slaves to Darkness Daemon Prince', () => {
    const parsedText = getFile('1576502239768-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Daemon Prince')
  })

  it('should work with Warcry scrolls 1', () => {
    const parsedText = getFile('1574613528170-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1576047037925-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
  })

  it('should work with Corvus Cabal', () => {
    const parsedText = getFile('1576093463575-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.allySelections[SLAVES_TO_DARKNESS]).toEqual({
      battalions: [],
      units: ['Corvus Cabal'],
    })
  })

  it('should work with Dabblings in Sorcery (Anvilgard Battle Trait)', () => {
    const parsedText = getFile('1576513040341-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.command_traits).toContain('Dabblings in Sorcery (Anvilgard Battle Trait)')
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1574686232621-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.origin_realm).toEqual(RealmscapesEnum.GHUR)
  })

  it('should work with The Brazen Rune', () => {
    const parsedText = getFile('1576533398655-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('The Brazen Rune')
  })

  it('should work with OBR 1', () => {
    const parsedText = getFile('1575078564630-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.origin_realm).toEqual('Aqshy')
  })

  it('should work with Nurgle and a Skaven battalion', () => {
    const parsedText = getFile('1575286599238-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.origin_realm).toEqual('Hysh')
  })

  it('should work with OBR 2', () => {
    const parsedText = getFile('1574746733739-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.origin_realm).toEqual(null)
  })

  it('should work with One with Fire and Ice trait/spell', () => {
    const parsedText = getFile('1574356951165-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.command_traits).toContain('One with Fire and Ice (The Phoenicium)')
    expect(res.selections.spells).toContain('Golden Mist (The Phoenicium)')
  })

  it('should work with OBR 3', () => {
    const parsedText = getFile('1574207831990-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
  })

  it('should work with random Death artifacts/traits', () => {
    const parsedText = getFile('1573865086310-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(DEATH_GRAND_ALLIANCE)
  })

  it('should work with Orruk great shaman', () => {
    const parsedText = getFile('1573836740544-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'])
    expect(res.selections.units).toContain('Orruk Great Shaman')
  })
  it('should work with Fyreslayers', () => {
    const parsedText = getFile('1573446762118-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with Fyreslayers 2', () => {
    const parsedText = getFile('1573484994551-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with Great-Bray Shaman', () => {
    const parsedText = getFile('1573340651447-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BEASTS_OF_CHAOS)
  })

  it('should work with Beastclaw Raiders (legacy, recognize as Ogor Mawtribes)', () => {
    const parsedText = getFile('1573387764362-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('should work with Lore of the Phoenix', () => {
    const parsedText = getFile('1573254186379-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
  })
  it('should work with Ogor Mawtribes 2', () => {
    const parsedText = getFile('1573208101434-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('should work with Arch-Sorcerer', () => {
    const parsedText = getFile('1573145524404-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.selections.command_traits).toEqual(['Arch-sorcerer'])
  })

  it('should work with Ogor Mawtribes 3', () => {
    const parsedText = getFile('1573020637936-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('should work with Ogor Mawtribes 4', () => {
    const parsedText = getFile('1573045302823-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('should work with OBR 4', () => {
    const parsedText = getFile('1572884424770-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
  })

  it('should work with Vokmortian', () => {
    const parsedText = getFile('1572873152220-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
  })

  it('should work with Druid of the Everspring', () => {
    const parsedText = getFile('1572871747455-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.command_traits).toContain('Druid of the Everspring (Living City)')
  })

  it('should work with Ogor Gluttons', () => {
    const parsedText = getFile('1572868206060-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.units).toContain('Ogor Gluttons')
  })

  it('should work with CoS', () => {
    const parsedText = getFile('1572858808157-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
  })

  it('should work with FEC', () => {
    const parsedText = getFile('1572735282204-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
  })

  it('should work with Enrapturing Circlet', () => {
    const parsedText = getFile('1572660547365-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.selections.artifacts).toContain('Enrapturing Circlet')
  })

  it('should work with Dark Wizardry', () => {
    const parsedText = getFile('1572497009675-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.selections.command_traits).toContain('Dark Wizardry (Royalty)')
  })

  it('should work with Blade of Endless Bloodshed', () => {
    const parsedText = getFile('1571896391287-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('Blade of Endless Bloodshed')
  })

  it('should work with Destroyer of Foes', () => {
    const parsedText = getFile('1572123301755-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with legacy Order units', () => {
    const parsedText = getFile('1572245593799-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(res.selections.units).toContain('Swordmasters')
  })

  it('should work with allied endless spells', () => {
    const parsedText = getFile('1571327027143-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.endless_spells).toContain('Everblaze Comet')
  })

  it('should work with Grundstock Thunderers', () => {
    const parsedText = getFile('1571347470427-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.units).toContain('Grundstok Thunderers')
  })

  it('should work with Horribly Resilient typo', () => {
    const parsedText = getFile('1571263525536-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
  })

  it('should work with Anointed on Frostheart Phoenix', () => {
    const parsedText = getFile('1571285206236-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.units).toContain('Anointed on Frostheart Phoenix')
  })

  it('should work with Firebelly', () => {
    const parsedText = getFile('1571287948786-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(DESTRUCTION_GRAND_ALLIANCE)
    expect(res.selections.units).toContain('Firebelly')
  })

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571220408099-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.spells).toContain('Vitriolic Spray (Anvilgard, Har Kuron)')
    expect(res.selections.command_traits).toContain('Secretive Warlock (Anvilgard)')
    expect(res.selections.units).toContain('Knight-Azyros')
    expect(res.selections.units).toContain('Prosecutors with Celestial Hammers')
  })

  it('should work with Cities of Sigmar and allies 1', () => {
    const parsedText = getFile('1571233444845-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
  })

  it('should work with FEC Command Traits', () => {
    const parsedText = getFile('1571084621521-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.selections.command_traits).toEqual(['The Feast Day (Delusion)', 'Dark Acolyte (Nobility)'])
    expect(res.unknownSelections).toEqual([])
  })

  it('should work with The Grand Fyrd of Furios Peak', () => {
    const parsedText = getFile('1571131908806-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should figure out allies from context clues', () => {
    const parsedText = getFile('1571040089053-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: CITIES_OF_SIGMAR,
      subFactionName: '',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: ['Greywater Fastness'],
        artifacts: ['Runic Munitions (Greywater Fastness)'],
        battalions: [],
        command_abilities: ['Salvo Fire'],
        endless_spells: [],
        incarnates: [],
        monstrous_rampages: [],
        scenery: [],
        grand_strategies: [],
        mount_traits: [],
        prayers: ['Rune of Unfaltering Aim', 'Rune Lore: Ancestral Shield', 'Rune Lore: Forgefire'],
        spells: ['Choking Fumes (Greywater Fastness)', 'Transmutation of Lead (Chamon)'],
        command_traits: ['Ghoul Mere Ranger (Greywater Fastness)'],
        core_rules: [],
        triumphs: [],
        units: [
          'Runelord',
          'Irondrakes',
          'Gyrobombers',
          'Battlemage (Chamon)',
          'Liberators',
          'Cogsmith',
          'Freeguild Guard',
          'Helblaster Volley Gun',
        ],
      },
      unknownSelections: [],
    })
  })
})
