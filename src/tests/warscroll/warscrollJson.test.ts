import { readFileSync } from 'fs'
import path from 'path'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'
import {
  BEASTS_OF_CHAOS,
  BIG_WAAAGH,
  BONESPLITTERZ,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GREENSKINZ,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGION_OF_CHAOS_ASCENDANT,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TZEENTCH,
} from 'meta/factions'
import { AQSHY, HYSH, GHUR, ULGU } from 'types/realmscapes'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/warscroll/json/${filename}.json`), 'utf8'))
}

describe('getWarscrollArmyFromJson', () => {
  it('should correctly read 1592754653939-Warscroll_Builder', () => {
    const parsedText = getFile('1592754653939-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.traits).toContain('Killer Reputation')
    expect(res.selections.traits).toContain('Fateseeker (Big Name)')
    expect(res.errors).toEqual([])
  })

  // TODO
  xit('should correctly read 1594377130100-Warscroll_Builder', () => {
    const parsedText = getFile('1594377130100-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  // TODO
  xit('should correctly read 1594377962081-Warscroll_Builder', () => {
    const parsedText = getFile('1594377962081-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1596572409302-Warscroll_Builder', () => {
    const parsedText = getFile('1596572409302-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Collar of Contempt')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1596744633061-Warscroll_Builder', () => {
    const parsedText = getFile('1596744633061-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Ethereal Amulet',
      },
    ])
  })

  // TODO: https://github.com/daviseford/aos-reminders/issues/993
  xit('should correctly read 1596798763772-Warscroll_Builder', () => {
    const parsedText = getFile('1596798763772-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  // TODO: Add Swifthawk Agents as a faction or allegiance
  // https://github.com/daviseford/aos-reminders/issues/992
  xit('should correctly read 1597072426756-Warscroll_Builder', () => {
    const parsedText = getFile('1597072426756-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  // TODO: https://github.com/daviseford/aos-reminders/issues/993
  xit('should correctly read 1597072523138-Warscroll_Builder', () => {
    const parsedText = getFile('1597072523138-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  // TODO: Add Swifthawk Agents as a faction or allegiance
  // https://github.com/daviseford/aos-reminders/issues/992
  xit('should correctly read 1597072550016-Warscroll_Builder', () => {
    const parsedText = getFile('1597072550016-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1597231391899-Warscroll_Builder', () => {
    const parsedText = getFile('1597231391899-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Varanguard')
    expect(res.errors).toEqual([])
  })

  // TODO: https://github.com/daviseford/aos-reminders/issues/993
  xit('should correctly read 1592412384855-Warscroll_Builder', () => {
    const parsedText = getFile('1592412384855-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Seawarden on Foot',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Highborn Spearmen',
      // },
    ])
  })

  it('should correctly read 1592663232380-Warscroll_Builder', () => {
    const parsedText = getFile('1592663232380-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Skull-helm of Khorne')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1592831552808-Warscroll_Builder', () => {
    const parsedText = getFile('1592831552808-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.traits).toContain('Longstrider (Big Name)')
    expect(res.errors).toEqual([])
  })

  // TODO: https://github.com/daviseford/aos-reminders/issues/993
  xit('should correctly read 1593336693320-Warscroll_Builder', () => {
    const parsedText = getFile('1593336693320-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Bretonnian Lord',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Noble Champion',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Knights of the Realm',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Men At Arms',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Peasant Bowmen',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Pegasus Knights',
      // },
    ])
  })

  it('should correctly read 1593886752516-Warscroll_Builder', () => {
    const parsedText = getFile('1593886752516-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1593895699238-Warscroll_Builder', () => {
    const parsedText = getFile('1593895699238-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Far-Ranger',
      },
      {
        severity: 'warn',
        text: 'Slayers',
      },
    ])
  })

  it('should correctly read 1594282007060-Warscroll_Builder', () => {
    const parsedText = getFile('1594282007060-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594377996514-Warscroll_Builder', () => {
    const parsedText = getFile('1594377996514-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Tyrant Slayer',
      },
      {
        severity: 'warn',
        text: 'Warrior Indominate',
      },
    ])
  })

  it('should correctly read 1594797695246-Warscroll_Builder', () => {
    const parsedText = getFile('1594797695246-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594810379753-Warscroll_Builder', () => {
    const parsedText = getFile('1594810379753-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594936358979-Warscroll_Builder', () => {
    const parsedText = getFile('1594936358979-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aetherquartz Brooch',
      },
    ])
  })

  it('should correctly read 1594973407574-Warscroll_Builder', () => {
    const parsedText = getFile('1594973407574-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595035398538-Warscroll_Builder', () => {
    const parsedText = getFile('1595035398538-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595338408952-Warscroll_Builder', () => {
    const parsedText = getFile('1595338408952-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595404143054-Warscroll_Builder', () => {
    const parsedText = getFile('1595404143054-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595589808444-Warscroll_Builder', () => {
    const parsedText = getFile('1595589808444-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595637879055-Warscroll_Builder', () => {
    const parsedText = getFile('1595637879055-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Ribcracker')
    expect(res.selections.traits).toContain('Fateseeker (Big Name)')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1596201912597-Warscroll_Builder', () => {
    const parsedText = getFile('1596201912597-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1596201937582-Warscroll_Builder', () => {
    const parsedText = getFile('1596201937582-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with 1591871273929-Warscroll_Builder', () => {
    const parsedText = getFile('1591871273929-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.traits).toContain('Inescapeable Doom (Knights of the Empty Throne)')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aetherquartz Brooch',
      },
    ])
  })

  it('should work with 1592153855214-Warscroll_Builder', () => {
    const parsedText = getFile('1592153855214-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain('Bloodwrack Sisterhood')
    expect(res.errors).toEqual([])
  })

  it('should work with 1592258767793-Warscroll_Builder', () => {
    const parsedText = getFile('1592258767793-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.traits).toContain('Khemist Supreme')
    expect(res.errors).toEqual([])
  })

  it('should work with 1588368330846-Warscroll_Builder', () => {
    const parsedText = getFile('1588368330846-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([])
  })

  it('should work with 1589375182953-Warscroll_Builder', () => {
    const parsedText = getFile('1589375182953-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain("Foe's Bane")
    expect(res.errors).toEqual([])
  })

  it('should work with 1589874682978-Warscroll_Builder', () => {
    const parsedText = getFile('1589874682978-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Apprentice Runesmith')
    expect(res.errors).toEqual([])
  })

  it('should work with Aventis Firestrike Magister of Hammerhal', () => {
    const parsedText = getFile('1587746522659-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Aventis Firestrike')
    expect(res.errors).toEqual([])
  })

  // TODO Legacy Death composition
  xit('should work with Legacy Death composition', () => {
    const parsedText = getFile('1587313852365-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  // TODO: Legacy High Elf units
  xit('should work with Legacy High Elf units', () => {
    const parsedText = getFile('1586991704763-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'High Warden',
      },
      {
        severity: 'warn',
        text: 'Dragonlord',
      },
      {
        severity: 'warn',
        text: 'Spireguard',
      },
    ])
  })

  it('should work with Celestar Ballista', () => {
    const parsedText = getFile('1586795945854-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // The Ballista is under the Battalion section for some reason
    expect(res.selections.units).toContain('Celestar Ballista')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aetherquartz Brooch',
      },
    ])
  })

  // TODO
  xit('should work with legacy Bretonnian units', () => {
    const parsedText = getFile('1585029831842-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'King on Hippogryph',
      },
      {
        severity: 'warn',
        text: 'Damsel',
      },
      {
        severity: 'warn',
        text: 'Bretonnian Lord',
      },
      {
        severity: 'warn',
        text: 'Knights of the Realm',
      },
      {
        severity: 'warn',
        text: 'Knights Errant',
      },
      {
        severity: 'warn',
        text: 'Men At Arms',
      },
      {
        severity: 'warn',
        text: 'Peasant Bowmen',
      },
      {
        severity: 'warn',
        text: 'Grail Knights',
      },
      {
        severity: 'warn',
        text: 'Field Trebuchet',
      },
    ])
  })

  it('should work with Vast Intellect - Celestial Apotheosis (trait/spell)', () => {
    const parsedText = getFile('1585065423836-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Celestial Apotheosis')
    expect(res.selections.traits).toContain('Vast Intellect')
    expect(res.errors).toEqual([])
  })

  it('should work with Fusil of Conflagration', () => {
    const parsedText = getFile('1585867355154-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Fusil of Conflagration')
    expect(res.errors).toEqual([])
  })

  it('should work with Hrothgorn', () => {
    const parsedText = getFile('1581874796290-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Hrothgorn')
    expect(res.selections.units).toContain("Hrothgorn's Mantrappers")
    expect(res.errors).toEqual([])
  })

  it('should work with Morathi, High Oracle of Khaine', () => {
    const parsedText = getFile('1582028528350-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // @ts-ignore
    expect(res.allySelections[DAUGHTERS_OF_KHAINE].units).toContain('Morathi, High Oracle of Khaine')
    expect(res.errors).toEqual([])
  })

  it('should work with Fecund Rituculturalists', () => {
    const parsedText = getFile('1582292305596-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain('Fecund Rituculturalists')
    expect(res.errors).toEqual([])
  })

  it('should work with Brand of the Split Daemon', () => {
    const parsedText = getFile('1582816094064-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Brand of the Split Daemon')
    expect(res.errors).toEqual([])
  })

  it("should work with A'rgath the King of Blades", () => {
    const parsedText = getFile('1582909138740-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain("A'rgath, the King of Blades")
    expect(res.errors).toEqual([])
  })

  it('should work with Bracers of Ember Iron', () => {
    const parsedText = getFile('1583265530142-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Bracers of Ember Iron')
    expect(res.errors).toEqual([])
  })

  it('should work with Flask of Daemonblood and Varanguard', () => {
    const parsedText = getFile('1583954971824-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Flask of Daemonblood (Knights of the Empty Throne)')
    expect(res.selections.units).toContain('Varanguard')
    expect(res.errors).toEqual([])
  })

  it('should work with Warpfire Thrower', () => {
    const parsedText = getFile('1583957769353-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Warpfire Thrower')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Skaven Warlord',
      },
      {
        severity: 'warn',
        text: 'Poisoned Wind Mortar Weapon Team',
      },
    ])
  })

  it('should work with The Eyes of the Nine', () => {
    const parsedText = getFile('1584407465731-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('The Eyes of the Nine')
    expect(res.selections.units).toContain('Great Bray-Shaman')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Hydroxskin Cloak',
      },
      {
        severity: 'warn',
        text: 'Gildenbane',
      },
    ])
  })

  it('should work with a new Seraphon list', () => {
    const parsedText = getFile('1584466193437-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should not include ARTILLERY markup', () => {
    const parsedText = getFile('1584488352657-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Secret-eater', () => {
    const parsedText = getFile('1581426257666-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Secret-eater')
    expect(res.errors).toEqual([])
  })

  it('should work with Legion of Chaos Ascendant', () => {
    const parsedText = getFile('1581436593161-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(LEGION_OF_CHAOS_ASCENDANT)
    expect(res.errors).toEqual([])
  })

  it('should work with Fecula Flyblown and The Wurmspat', () => {
    const parsedText = getFile('1581503416759-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Fecula Flyblown')
    expect(res.selections.units).toContain('The Wurmspat')
    expect(res.errors).toEqual([])
  })

  it('should work with Warp Lightning Vortex', () => {
    const parsedText = getFile('1580248993240-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Staff of Ocular Optimisation',
      },
      {
        severity: 'warn',
        text: 'Warp Lightning Vortex',
      },
    ])
  })

  it('should work with Indomitable Will', () => {
    const parsedText = getFile('1580490187686-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Indomitable Will',
      },
    ])
  })

  it('should work with Sky Port: None', () => {
    const parsedText = getFile('1580985291764-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.allegiances).toEqual([])
    expect(res.errors).toEqual([])
  })

  it('should work with Vial of Pure Blood', () => {
    const parsedText = getFile('1581111836908-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Vial of Pure Blood')
    expect(res.errors).toEqual([])
  })

  it('should work with Spider Rider Skittermob', () => {
    const parsedText = getFile('1581135844634-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // Converted to Skitterswarm
    // expect(res.selections.battalions).toContain('Spider Rider Skitterswarm')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Sword of Judgement',
      },
    ])
  })

  it('should work with "undefined x" entry (2/10/20 hotfix)', () => {
    const parsedText = getFile('1581363713665-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with any endless spell (KO)', () => {
    const parsedText = getFile('1579105159803-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.endless_spells).toContain('Darkfire Daemonrift (Slaves)')
    expect(res.errors).toEqual([])
  })

  it('should not work with The Choir of Torments battalion (not in current book)', () => {
    const parsedText = getFile('1578184338167-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'The Choir of Torments',
      },
    ])
  })

  it("should not work with Everwinter's Master trait (not in current book)", () => {
    const parsedText = getFile('1578192442310-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Everwinter's Master",
      },
    ])
  })

  it('should work with Greenskinz', () => {
    const parsedText = getFile('1578518862312-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(GREENSKINZ)
    expect(res.errors).toEqual([])
  })

  it('should not work with Stormcast/Nighthaunt mix', () => {
    const parsedText = getFile('1578691480138-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Sword of Judgement',
      },
      {
        severity: 'warn',
        text: 'Knight of Shrouds on Ethereal Steed',
      },
      {
        severity: 'warn',
        text: 'Bladegheist Revenants',
      },
    ])
  })

  it('should work with The Blood-forged Armour', () => {
    const parsedText = getFile('1578730417865-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('The Blood-forged Armour')
    expect(res.errors).toEqual([])
  })

  it('should work with Vitriolic Spray (Anvilgard)', () => {
    const parsedText = getFile('1577866703167-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Vitriolic Spray (Anvilgard)')
    expect(res.errors).toEqual([])
  })

  it('should work with Amethyst Glow/Dread Withering trait/spell', () => {
    const parsedText = getFile('1577088536258-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.traits).toContain('Amethyst Glow')
    expect(res.selections.spells).toContain('Dread Withering')
    expect(res.errors).toEqual([])
  })

  it('should work with legacy Wood Elf warscrolls', () => {
    const parsedText = getFile('1577400809137-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Darkling Covens', () => {
    const parsedText = getFile('1577400907052-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // We convert Darkling Covens to Cities of Sigmar
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.errors).toEqual([])
  })

  it('should work with legacy High Elf warscrolls', () => {
    const parsedText = getFile('1577741192555-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Highborn Repeater Bolt Thrower')
    expect(res.selections.units).toContain('Highborn Archers')
    expect(res.selections.units).toContain('Loremaster')
    expect(res.errors).toEqual([])
  })

  it('should work with The Fleshform Raiment (Noble Heirlooms)', () => {
    const parsedText = getFile('1576858425499-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('The Fleshform Raiment (Noble Heirlooms)')
    expect(res.errors).toEqual([])
  })

  it('should work with Guardian of Souls and Chaos allegiance', () => {
    const parsedText = getFile('1574504452431-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CHAOS_GRAND_ALLIANCE)
    // Guardian of Souls is a DEATH unit...
    expect(res.errors).toEqual([{ severity: 'warn', text: 'Guardian of Souls' }])
  })

  it('should work with Chaos Hellcannon', () => {
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
    expect(res.errors).toEqual([])
  })

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
    expect(res.errors).toEqual([])
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
    expect(res.selections.traits).toContain('Master of Defence (Order)')
    expect(res.errors).toEqual([])
  })

  it('should work with Berzerker Lord', () => {
    const parsedText = getFile('1576328837058-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.traits).toContain('Berserker Lord (Mortal)')
    expect(res.errors).toEqual([])
  })

  it('should work with 3*formatting', () => {
    const parsedText = getFile('1576364961328-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with The Gorechosen', () => {
    const parsedText = getFile('1576418593609-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain('Gorechosen')
    expect(res.errors).toEqual([])
  })

  it('should work with Lord of Chaos', () => {
    const parsedText = getFile('1576448761220-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Lord of Chaos', // Deprecated post-dec2019
      },
    ])
  })

  it('should work with Slaves to Darkness Chaos Spawn', () => {
    const parsedText = getFile('1576493074441-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Chaos Spawn')
    expect(res.errors).toEqual([])
  })

  it('should work with Slaves to Darkness Daemon Prince ', () => {
    const parsedText = getFile('1576502239768-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Daemon Prince')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aetherquartz Brooch',
      },
    ])
  })

  it('should work with Warcry scrolls', () => {
    const parsedText = getFile('1574613528170-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1576047037925-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Corvus Cabal', () => {
    const parsedText = getFile('1576093463575-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.allySelections[SLAVES_TO_DARKNESS]).toEqual({
      battalions: [],
      units: ['Corvus Cabal'],
    })
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Blessing of Tzeentch',
      },
    ])
  })

  it('should work with Hailstorm Battery (SCE battalion)', () => {
    const parsedText = getFile('1574638101530-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.allySelections).toEqual({
      [STORMCAST_ETERNALS]: {
        battalions: ['Hailstorm Battery'],
        units: [],
      },
    })
    expect(res.origin_realm).toEqual(null)
    expect(res.errors).toEqual([])
  })

  it('should work with Dabblings in Sorcery (Anvilgard Battle Trait)', () => {
    const parsedText = getFile('1576513040341-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.traits).toContain('Dabblings in Sorcery (Anvilgard Battle Trait)')
    expect(res.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1574686232621-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.origin_realm).toEqual(GHUR)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Gryph-feather Charm',
      },
      {
        severity: 'warn',
        text: 'Blade of Carving',
      },
    ])
  })

  it('should work with The Brazen Rune', () => {
    const parsedText = getFile('1576533398655-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('The Brazen Rune')
    expect(res.errors).toEqual([])
  })

  it('should work with The Dolorous Guard and The Forgotten Scions', () => {
    const parsedText = getFile('1576527400569-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.origin_realm).toEqual(HYSH)
    expect(res.selections.battalions).toEqual(['The Forgotten Scions', 'The Dolorous Guard', 'The Condemned'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aetherquartz Brooch',
      },
    ])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1575078564630-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.origin_realm).toEqual(AQSHY)
    expect(res.errors).toEqual([])
  })

  it('should work with Mark of Chaos and Scroll of Dark Unravelling', () => {
    const parsedText = getFile('1576681454336-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.origin_realm).toEqual(ULGU)

    expect(res.selections).toEqual({
      allegiances: ['Cabalists'],
      artifacts: ['Scroll of Dark Unravelling (Cabalists)', 'Soul Feeder (Cabalists)'],
      battalions: ['Godswrath Warband'],
      commands: ['Spurred by the Gods'],
      endless_spells: ['Eightfold Doom-Sigil (Slaves)'],
      scenery: [],
      spells: [
        'Binding Damnation (Slaves)',
        'Ruinous Vigour (Slaves)',
        'Whispers of Chaos (Slaves)',
        'Mask of Darkness (Slaves)',
        'Crippling Ruin',
        'Winds of Chaos',
        'Daemonic Power',
        'Favour of the Ruinous Powers',
      ],
      traits: ['Mighty Ritualist (Cabalists)', 'All for One (Cabalists)'],
      triumphs: [],
      units: [
        'Chaos Lord',
        'Chaos Sorcerer Lord on Manticore',
        'Chaos Sorcerer Lord',
        'Chaos Warriors',
        'Chaos Marauders',
        'Chaos Chosen',
        'Untamed Beasts',
        'Chaos Warshrine',
      ],
    })

    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Spellmirror',
      },
    ])
  })

  it('should work with Nurgle and a Skaven battalion', () => {
    const parsedText = getFile('1575286599238-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.allySelections).toEqual({
      [SKAVEN]: { battalions: ['Congregation of Filth'], units: [] },
    })
    expect(res.origin_realm).toEqual(HYSH)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aetherquartz Brooch',
      },
    ])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1574746733739-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.origin_realm).toEqual(null)
    expect(res.errors).toEqual([])
  })

  it('should work with Vokmortians Retinue', () => {
    const parsedText = getFile('1573791319612-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.selections.battalions).toContain("Vokmortian's Retinue")
    expect(res.errors).toEqual([])
  })

  it('should work with Vokmortians Retinue', () => {
    const parsedText = getFile('1574249013027-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.selections.battalions).toContain("Vokmortian's Retinue")
    expect(res.errors).toEqual([])
  })

  it('should work with One with Fire and Ice trait/spell', () => {
    const parsedText = getFile('1574356951165-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.traits).toContain('One with Fire and Ice (The Phoenicium)')
    expect(res.selections.spells).toContain('Golden Mist (The Phoenicium)')
    expect(res.errors).toEqual([])
  })

  it('should work with Ironjawz', () => {
    const parsedText = getFile('1574391649028-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(IRONJAWZ)
    expect(res.selections.allegiances).toContain('Ironsunz')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Anraheir's Claw",
      },
    ])
  })
  it('should work with OBR', () => {
    const parsedText = getFile('1574207831990-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('should work with random Death artifacts/traits', () => {
    const parsedText = getFile('1573865086310-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(DEATH_GRAND_ALLIANCE)
    // I am not sure what these are tbh
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Masque of Horror',
      },
      {
        severity: 'warn',
        text: 'Inspirational',
      },
    ])
  })

  it('should work with Orruk great shaman', () => {
    const parsedText = getFile('1573836740544-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.units).toContain('Orruk Great Shaman')
    expect(res.errors).toEqual([])
  })
  it('should work with Fyreslayers', () => {
    const parsedText = getFile('1573446762118-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers', () => {
    const parsedText = getFile('1573484994551-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Great-Bray Shaman', () => {
    const parsedText = getFile('1573340651447-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BEASTS_OF_CHAOS)
    expect(res.errors).toEqual([])
  })

  it('should work with Beastclaw Raiders (legacy, recognize as Ogor Mawtribes)', () => {
    const parsedText = getFile('1573387764362-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([{ severity: 'warn', text: 'Massive Bulk' }])
  })

  it('should work with Vosaxe', () => {
    const parsedText = getFile('1573252116567-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.artifacts).toContain('Vosaxe')
    expect(res.errors).toEqual([])
  })

  it('should work with Lore of the Phoenix', () => {
    const parsedText = getFile('1573254186379-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Ghyrstrike',
      },
    ])
  })
  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1573208101434-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('should work with Arch-Sorcerer', () => {
    const parsedText = getFile('1573145524404-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.selections.traits).toEqual(['Arch-sorcerer'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Souldraught',
      },
      {
        severity: 'warn',
        text: 'Cult of the Transient Form',
      },
    ])
  })

  it('should work with Big Rukk', () => {
    const parsedText = getFile('1573144291799-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BONESPLITTERZ)
    expect(res.selections.battalions).toEqual(['Big Rukk', 'Brutal Rukk', 'Kop Rukk', 'Teef Rukk'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Thermalrider Cloak',
      },
    ])
  })

  it('should work with Armour of Silvered Sigmarite (pt 2)', () => {
    const parsedText = getFile('1573174872898-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.artifacts).toContain('Armour of Silvered Sigmarite')
    expect(res.errors).toEqual([])
  })

  it('should work with Armour of Silvered Sigmarite (pt 1)', () => {
    const parsedText = getFile('1573172812429-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.artifacts).toEqual(['Strife-ender', 'Armour of Silvered Sigmarite'])
    expect(res.selections.battalions).toEqual(['Cleansing Phalanx'])
    expect(res.selections.traits).toEqual(['Staunch Defender', 'Lithe-Limbed'])
    expect(res.selections.spells).toEqual([
      'Azyrite Halo',
      'Translocation',
      'Celestial Blades',
      'Terrifying Aspect',
      'Healing Light',
      'Empower',
    ])
    expect(res.selections.units).toEqual([
      'Lord-Celestant',
      'Lord-Relictor',
      'Lord-Arcanum on Gryph-Charger',
      'Judicators',
      'Sequitors',
      'Evocators',
      'Evocators on Celestial Dracolines',
      'Prosecutors with Celestial Hammers',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with SCE', () => {
    const parsedText = getFile('1573142427791-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.errors).toEqual([])
  })

  it("should work with Burstin' with Power", () => {
    const parsedText = getFile('1573012088615-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.traits).toContain("Burstin' with Power (Ironjawz)")
    expect(res.errors).toEqual([])
  })

  it("should work with Burstin' with Power", () => {
    const parsedText = getFile('1573018890027-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.traits).toContain("Burstin' with Power (Ironjawz)")
    expect(res.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1573020637936-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1573045302823-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('should work with Mirrorshield', () => {
    const parsedText = getFile('1572905242205-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.artifacts).toContain('Mirrorshield')
    expect(res.errors).toEqual([])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1572884424770-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Vokmortian', () => {
    const parsedText = getFile('1572873152220-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Druid of the Everspring', () => {
    const parsedText = getFile('1572871747455-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.traits).toContain('Druid of the Everspring (Living City)')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Wand of Restoration',
      },
    ])
  })

  it('should work with Ogor Gluttons', () => {
    const parsedText = getFile('1572868206060-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.units).toContain('Ogor Gluttons')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Ethereal Amulet',
      },
    ])
  })

  it('should work with CoS', () => {
    const parsedText = getFile('1572858808157-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Wand of Restoration',
      },
    ])
  })

  it('should work with FEC', () => {
    const parsedText = getFile('1572735282204-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.errors).toEqual([])
  })

  it('should work with Enrapturing Circlet', () => {
    const parsedText = getFile('1572660547365-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.selections.artifacts).toContain('Enrapturing Circlet (Godseekers)')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Gryph-feather Charm',
      },
    ])
  })

  it('should work with Flaypelt Cloak', () => {
    const parsedText = getFile('1572694928061-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(res.errors).toEqual([])
  })

  it('should work with Flaypelt Cloak (part 2)', () => {
    const parsedText = getFile('1572695046339-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(res.errors).toEqual([])
  })

  it('should work with Warpcog Convocation', () => {
    const parsedText = getFile('1571895994578-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.selections.battalions).toEqual([
      'Warpcog Convocation',
      'Arkhspark Voltik (Enginecoven)',
      'Rattlegauge Warplock (Enginecoven)',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Dark Wizardry', () => {
    const parsedText = getFile('1572497009675-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.selections.traits).toContain('Dark Wizardry (Royalty)')
    expect(res.errors).toEqual([])
  })

  it('should work with Blade of Endless Bloodshed', () => {
    const parsedText = getFile('1571896391287-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([])
  })

  it('should work with Windthief Charm (deprecated as of 2020)', () => {
    const parsedText = getFile('1572003972006-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Windthief Charm',
      },
    ])
  })

  it('should work with Hammers of Augury', () => {
    const parsedText = getFile('1572043447588-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.errors).toEqual([])
  })

  it('should work with Destroyer of Foes', () => {
    const parsedText = getFile('1572123301755-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Bonesplitterz spells', () => {
    const parsedText = getFile('1572206506395-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BONESPLITTERZ)
    expect(res.errors).toEqual([])
  })

  it('should work with legacy Order units', () => {
    const parsedText = getFile('1572245593799-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Swordmasters',
      },
      {
        severity: 'warn',
        text: 'Spireguard',
      },
      {
        severity: 'warn',
        text: 'High Warden',
      },
    ])
  })

  it('should work with allied endless spells', () => {
    const parsedText = getFile('1571327027143-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.endless_spells).toContain('Everblaze Comet')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Ignax's Scales",
      },
      {
        severity: 'warn',
        text: 'Razordons',
      },
    ])
  })

  it('should work with Horn of the Consort', () => {
    const parsedText = getFile('1571520651334-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SYLVANETH)
    expect(res.errors).toEqual([])
    expect(res.selections.artifacts).toEqual(['Horn of the Consort'])
  })

  it('should work with Ironjawz allied with Gloomspite Gitz', () => {
    const parsedText = getFile('1571425644480-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(IRONJAWZ)
    expect(res.selections.artifacts).toEqual(["Metalrippa's Klaw"])
    expect(res.allyFactionNames).toEqual([BONESPLITTERZ, GLOOMSPITE_GITZ])
    expect(res.allySelections).toEqual({
      BONESPLITTERZ: { battalions: [], units: ['Wurrgog Prophet'] },
      GLOOMSPITE_GITZ: { battalions: [], units: ['Fungoid Cave-Shaman'] },
    })
    expect(res.selections.units).toEqual([
      'Megaboss on Maw-Krusha',
      'Orruk Megaboss',
      'Orruk Warchanter',
      'Orruk Ardboys',
      'Orruk Brutes',
      'Orruk Gore-gruntas',
    ])
    expect(res.selections.endless_spells).toContain('Scuttletide')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Thermalrider Cloak',
      },
    ])
  })

  it('should work with Bonesplitterz', () => {
    const parsedText = getFile('1571329765256-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BONESPLITTERZ)
    expect(res.errors).toEqual([])
  })

  it('should work with Grundstock Thunderers', () => {
    const parsedText = getFile('1571347470427-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.units).toContain('Grundstok Thunderers')
    expect(res.errors).toEqual([])
  })

  it('should work with Horribly Resilient typo', () => {
    const parsedText = getFile('1571263525536-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.errors).toEqual([])
  })

  it('should work with Anointed on Frostheart Phoenix', () => {
    const parsedText = getFile('1571285206236-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.units).toContain('Anointed on Frostheart Phoenix')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Ignax's Scales",
      },
    ])
  })

  it('should work with Firebelly', () => {
    const parsedText = getFile('1571287948786-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(DESTRUCTION_GRAND_ALLIANCE)
    expect(res.selections.units).toContain('Firebelly')
    expect(res.errors).toEqual([])
  })

  it("should work with Bonesplitterz Burnin' Tattooz", () => {
    const parsedText = getFile('1571240331862-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BONESPLITTERZ)
    expect(res.selections.allegiances).toEqual(['Drakkfoot Clan'])
    expect(res.selections.artifacts).toEqual(["Burnin' Tattooz"])
    expect(res.errors).toEqual([])
  })

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571220408099-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.spells).toContain('Vitriolic Spray (Anvilgard)')
    expect(res.selections.traits).toContain('Secretive Warlock (Anvilgard)')
    expect(res.selections.units).toContain('Knight-Azyros')
    expect(res.selections.units).toContain('Prosecutors with Celestial Hammers')
    expect(res.errors).toEqual([])
  })

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571233444845-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.errors).toEqual([])
  })

  it('should work with FEC Command Traits', () => {
    const parsedText = getFile('1571084621521-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.selections.traits).toEqual(['The Feast Day (Delusion)', 'Dark Acolyte (Nobility)'])
    expect(res.errors).toEqual([])
    expect(res.unknownSelections).toEqual([])
  })

  it('should work with The Grand Fyrd of Furios Peak', () => {
    const parsedText = getFile('1571131908806-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
    expect(res.selections.battalions).toEqual([
      'Forge Brethren',
      'Lords of Vostarg',
      'Lords of the Lodge',
      'The Grand Fyrd of Furios Peak',
      'Vostarg Forge Brethren',
      'Vostarg Warrior Kinband',
      'Warrior Kinband',
    ])
  })

  xit('should work with Voltik', () => {
    const parsedText = getFile('1571158898802-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.errors).toEqual([])
  })

  it('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571165179317-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.units).toContain('Orruk Warboss')
    expect(res.errors).toEqual([])
  })

  it('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571171962804-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.units).toContain('Orruk Warboss')
    expect(res.errors).toEqual([])
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
      factionName: 'CITIES_OF_SIGMAR',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Greywater Fastness'],
        artifacts: ['Runic Munitions (Greywater Fastness)'],
        battalions: [],
        commands: ['Salvo Fire'],
        endless_spells: [],
        scenery: [],
        spells: [
          'Choking Fumes (Greywater Fastness)',
          'Rune Lore',
          'Rune Lore: Ancestral Shield',
          'Rune Lore: Forge Fire',
          'Transmutation of Lead (Chamon)',
        ],
        traits: ['Ghoul Mere Ranger (Greywater Fastness)'],
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
