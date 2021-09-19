import { OrrukWarclansFaction } from 'factions/orruk_warclans'
import { SlavesToDarknessFaction } from 'factions/slaves_to_darkness'
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
  SYLVANETH,
  TZEENTCH,
} from 'meta/factions'
import path from 'path'
import { AQSHY, GHUR, HYSH, ULGU } from 'types/realmscapes'
import { DEPRECATED_AOS_3, DEPRECATED_FIRESTORM, DEPRECATED_MALIGN_SORCERY } from 'utils/import/options'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/warscroll/json/${filename}.json`), 'utf8'))
}

describe('getWarscrollArmyFromJson', () => {
  it('should correctly read 1626346073420-Warscroll_Builder', () => {
    const parsedText = getFile('1626346073420-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Devoted Disciple')
    expect(res.errors).toEqual([])
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

  it('should correctly read 1625940517777-Warscroll_Builder', () => {
    const parsedText = getFile('1625940517777-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625940546002-Warscroll_Builder', () => {
    const parsedText = getFile('1625940546002-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625955999727-Warscroll_Builder', () => {
    const parsedText = getFile('1625955999727-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625959186400-Warscroll_Builder', () => {
    const parsedText = getFile('1625959186400-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625959227368-Warscroll_Builder', () => {
    const parsedText = getFile('1625959227368-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625987154925-Warscroll_Builder', () => {
    const parsedText = getFile('1625987154925-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625987159983-Warscroll_Builder', () => {
    const parsedText = getFile('1625987159983-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626000307958-Warscroll_Builder', () => {
    const parsedText = getFile('1626000307958-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626008505895-Warscroll_Builder', () => {
    const parsedText = getFile('1626008505895-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Kurnoth Hunters')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626011545797-Warscroll_Builder', () => {
    const parsedText = getFile('1626011545797-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626014331173-Warscroll_Builder', () => {
    const parsedText = getFile('1626014331173-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Bastiladon')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626048977064-Warscroll_Builder', () => {
    const parsedText = getFile('1626048977064-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626085857336-Warscroll_Builder', () => {
    const parsedText = getFile('1626085857336-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626085936430-Warscroll_Builder', () => {
    const parsedText = getFile('1626085936430-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626087512372-Warscroll_Builder', () => {
    const parsedText = getFile('1626087512372-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.subFactionName).toEqual('Host of the Everchosen')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626094513986-Warscroll_Builder', () => {
    const parsedText = getFile('1626094513986-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626098005165-Warscroll_Builder', () => {
    const parsedText = getFile('1626098005165-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
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

  it('should correctly read 1626106760914-Warscroll_Builder', () => {
    const parsedText = getFile('1626106760914-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626106853426-Warscroll_Builder', () => {
    const parsedText = getFile('1626106853426-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626115430499-Warscroll_Builder', () => {
    const parsedText = getFile('1626115430499-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626134104361-Warscroll_Builder', () => {
    const parsedText = getFile('1626134104361-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain("Be'Lakor")
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626145186513-Warscroll_Builder', () => {
    const parsedText = getFile('1626145186513-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.prayers).toContain('Heal')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626147878336-Warscroll_Builder', () => {
    const parsedText = getFile('1626147878336-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Rotbringers Sorcerer')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1626178634864-Warscroll_Builder', () => {
    const parsedText = getFile('1626178634864-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625844607093-Warscroll_Builder', () => {
    const parsedText = getFile('1625844607093-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625844635418-Warscroll_Builder', () => {
    const parsedText = getFile('1625844635418-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625845279897-Warscroll_Builder', () => {
    const parsedText = getFile('1625845279897-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625846409659-Warscroll_Builder', () => {
    const parsedText = getFile('1625846409659-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.triumphs).toContain('Inspired')
    expect(res.selections.triumphs).toContain('Bloodthirsty')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625846428194-Warscroll_Builder', () => {
    const parsedText = getFile('1625846428194-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625851245173-Warscroll_Builder', () => {
    const parsedText = getFile('1625851245173-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Kurnoth Hunters')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625851335004-Warscroll_Builder', () => {
    const parsedText = getFile('1625851335004-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625851523116-Warscroll_Builder', () => {
    const parsedText = getFile('1625851523116-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625851988340-Warscroll_Builder', () => {
    const parsedText = getFile('1625851988340-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625864114017-Warscroll_Builder', () => {
    const parsedText = getFile('1625864114017-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625865367782-Warscroll_Builder', () => {
    const parsedText = getFile('1625865367782-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625865392803-Warscroll_Builder', () => {
    const parsedText = getFile('1625865392803-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625925859167-Warscroll_Builder', () => {
    const parsedText = getFile('1625925859167-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625930081642-Warscroll_Builder', () => {
    const parsedText = getFile('1625930081642-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Yndrasta')
  })

  it('should correctly read 1625930451658-Warscroll_Builder', () => {
    const parsedText = getFile('1625930451658-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625930557439-Warscroll_Builder', () => {
    const parsedText = getFile('1625930557439-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Sevireth, Lord of the Seventh Wind')
    expect(res.selections.command_traits).toContain('Astute Commander')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1625938307579-Warscroll_Builder', () => {
    const parsedText = getFile('1625938307579-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
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

  it('should correctly read 1609436742680-Warscroll_Builder', () => {
    const parsedText = getFile('1609436742680-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Krakenskin Sandals (Taker Tribe)')
    expect(res.selections.command_traits).toContain('Very Acquisitive (Taker Tribe)')
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Plate of Perfect Protection',
      },
    ])
  })

  it('should correctly read 1609964689867-Warscroll_Builder', () => {
    const parsedText = getFile('1609964689867-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1610444042739-Warscroll_Builder', () => {
    const parsedText = getFile('1610444042739-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain('Eternal Starhost')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1610462880937-Warscroll_Builder', () => {
    const parsedText = getFile('1610462880937-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Crypt Flayers')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1610573654069-Warscroll_Builder', () => {
    const parsedText = getFile('1610573654069-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Exalted Greater Daemon of Tzeentch',
      // },
      // {
      //   severity: 'ally-warn',
      //   text:
      //     'Allied Exalted Greater Daemon of Khorne can belong to Khorne or Legion Of The First Prince. Please add this unit manually.',
      // },
    ])
  })

  it('should correctly read 1610791095057-Warscroll_Builder', () => {
    const parsedText = getFile('1610791095057-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
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
    expect(res.selections.command_traits).toContain('Fateseeker (Big Name)')
    expect(res.selections.command_traits).toContain('Killer Reputation')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1611179341633-Warscroll_Builder', () => {
    const parsedText = getFile('1611179341633-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Arcane Corrasion')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1611357604340-Warscroll_Builder', () => {
    const parsedText = getFile('1611357604340-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Helm of the Oppressor')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1611426566620-Warscroll_Builder', () => {
    const parsedText = getFile('1611426566620-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1611504169641-Warscroll_Builder', () => {
    const parsedText = getFile('1611504169641-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Pit of Shades')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1611878116918-Warscroll_Builder', () => {
    const parsedText = getFile('1611878116918-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toContain('Anvils of the Heldenhammer (Stormhost)')
    expect(res.errors).toEqual([
      // {
      //   severity: 'error',
      //   text: 'Anvils of the Heldenhammer (Stormhost) are not supported.',
      // },
    ])
  })

  it.skip('should correctly read 1611923664785-Warscroll_Builder', () => {
    const parsedText = getFile('1611923664785-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.prayers).toContain('Catechism of Murder')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1612060591166-Warscroll_Builder', () => {
    const parsedText = getFile('1612060591166-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain('Firelance Starhost')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1612355735036-Warscroll_Builder', () => {
    const parsedText = getFile('1612355735036-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toContain('Faultless Blades')
    expect(res.subFactionName).toEqual('Pretenders Host')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1612659925132-Warscroll_Builder', () => {
    const parsedText = getFile('1612659925132-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1612732479281-Warscroll_Builder', () => {
    const parsedText = getFile('1612732479281-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain("Gresh's Iron Reapers")
    expect(res.selections.command_traits).toContain('Profane Oratory')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1612918099089-Warscroll_Builder', () => {
    const parsedText = getFile('1612918099089-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Bonegrinder Mega-Gargant')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1614280120985-Warscroll_Builder', () => {
    const parsedText = getFile('1614280120985-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Host of the Everchosen (Sixth Circle)',
      // },
    ])
  })

  it('should correctly read 1614288189630-Warscroll_Builder', () => {
    const parsedText = getFile('1614288189630-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Shepard of Idiotic Destruction')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1614371993867-Warscroll_Builder', () => {
    const parsedText = getFile('1614371993867-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toContain('Dhom Hain')
    expect(res.errors).toEqual([])
  })

  // TODO: This test passes using parsed json, but I'm not sure this json is what the parser would now produce from the same pdf
  it('should correctly read 1601977490829-Warscroll_Builder', () => {
    const parsedText = getFile('1601977490829-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: "Stoneklaw's Gutstompas",
        reason: DEPRECATED_FIRESTORM,
      },
    ])
  })

  it('should correctly read 1603703587229-Warscroll_Builder', () => {
    const parsedText = getFile('1603703587229-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(SONS_OF_BEHEMAT)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1598074473619-Warscroll_Builder', () => {
    const parsedText = getFile('1598074473619-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('A Scholar and an Arkanaut')
    expect(res.selections.command_traits).toContain('FOOTNOTE: Without Our Ships, We Are Naught')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1598435486730-Warscroll_Builder', () => {
    const parsedText = getFile('1598435486730-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1598862151248-Warscroll_Builder', () => {
    const parsedText = getFile('1598862151248-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  // TODO: Whenever this warscroll is added to Azyr
  it.skip('should correctly read 1599246202410-Warscroll_Builder', () => {
    const parsedText = getFile('1599246202410-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      // {
      //   "severity": "warn",
      //   "text": "Doom Diver Catapult",
      // },
    ])
  })

  it('should correctly read 1597625107867-Warscroll_Builder', () => {
    const parsedText = getFile('1597625107867-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Seawarden on Foot')
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Gravesand Brooch',
      },
    ])
  })

  it('should correctly read 1597360547744-Warscroll_Builder', () => {
    const parsedText = getFile('1597360547744-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1597400263289-Warscroll_Builder', () => {
    const parsedText = getFile('1597400263289-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1592754653939-Warscroll_Builder', () => {
    const parsedText = getFile('1592754653939-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Killer Reputation')
    expect(res.selections.command_traits).toContain('Fateseeker (Big Name)')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594377130100-Warscroll_Builder', () => {
    const parsedText = getFile('1594377130100-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Tyrant Slayer')
    expect(res.selections.command_traits).toContain('Warrior Indominate')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1596572409302-Warscroll_Builder', () => {
    const parsedText = getFile('1596572409302-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('Collar of Contempt')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1596798763772-Warscroll_Builder', () => {
    const parsedText = getFile('1596798763772-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1597072426756-Warscroll_Builder', () => {
    const parsedText = getFile('1597072426756-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1597072523138-Warscroll_Builder', () => {
    const parsedText = getFile('1597072523138-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1597072550016-Warscroll_Builder', () => {
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

  it('should correctly read 1592412384855-Warscroll_Builder', () => {
    const parsedText = getFile('1592412384855-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
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
    expect(res.selections.command_traits).toContain('Fateseeker (Big Name)')
    expect(res.selections.command_traits).toContain('Killer Reputation')
    expect(res.selections.command_traits).toContain('Longstrider (Big Name)')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1593336693320-Warscroll_Builder', () => {
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
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594282007060-Warscroll_Builder', () => {
    const parsedText = getFile('1594282007060-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594377996514-Warscroll_Builder', () => {
    const parsedText = getFile('1594377996514-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Warrior Indominate')
    expect(res.selections.artifacts).toContain('Tyrant Slayer')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594797695246-Warscroll_Builder', () => {
    const parsedText = getFile('1594797695246-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1594936358979-Warscroll_Builder', () => {
    const parsedText = getFile('1594936358979-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
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
    expect(res.selections.command_traits).toContain('Fateseeker (Big Name)')
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Balewind Vortex',
      },
    ])
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
    expect(res.selections.command_traits).toContain('Inescapeable Doom')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'ally-warn',
        text: 'Allied Ungor Raiders can belong to Beasts Of Chaos or Nurgle or Slaanesh or Tzeentch. Please add this unit manually.',
      },
    ])
  })

  it('should work with 1592258767793-Warscroll_Builder', () => {
    const parsedText = getFile('1592258767793-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Khemist Supreme')
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
    expect(res.selections.units).toContain('Aether-Khemist')
    expect(res.errors).toEqual([])
  })

  // TODO Legacy Death composition
  it.skip('should work with Legacy Death composition', () => {
    const parsedText = getFile('1587313852365-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Legacy High Elf units', () => {
    const parsedText = getFile('1586991704763-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Vast Intellect - Celestial Apotheosis (trait/spell)', () => {
    const parsedText = getFile('1585065423836-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Celestial Apotheosis')
    expect(res.selections.command_traits).toContain('Vast Intellect')
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

  it('should work with Morathi, High Oracle of Khaine (pre-Broken Realms)', () => {
    const parsedText = getFile('1582028528350-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    // @ts-ignore
    expect(res.allySelections[DAUGHTERS_OF_KHAINE].units).toContain('Morathi-Khaine')
    expect(res.errors).toEqual([])
  })

  it('should work with Fecund Rituculturalists', () => {
    const parsedText = getFile('1582292305596-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.battalions).toContain('Fecund Rituculturalists')
    expect(res.selections.spells).toContain('Blades of Putrefaction')
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Balewind Vortex',
      },
    ])
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
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text: 'Allied Varanguard can belong to Nurgle or Slaanesh or Slaves To Darkness or Tzeentch. Please add this unit manually.',
      },
      {
        severity: 'ally-warn',
        text: 'Allied Chaos Knights can belong to Nurgle or Slaanesh or Slaves To Darkness or Tzeentch. Please add this unit manually.',
      },
    ])
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
    expect(res.selections.artifacts).toContain('Flask of Daemonblood')
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
        severity: 'deprecation-warn',
        text: 'Hydroxskin Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        reason: DEPRECATED_MALIGN_SORCERY,
        severity: 'deprecation-warn',
        text: 'Gildenbane',
      },
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Balewind Vortex',
      },
    ])
  })

  it('should work with a new Seraphon list', () => {
    const parsedText = getFile('1584466193437-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Bound Balewind Vortex',
      },
    ])
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

  it('should work with Legion of Chaos Ascendant (now Legion of the First Prince)', () => {
    const parsedText = getFile('1581436593161-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(LEGION_OF_THE_FIRST_PRINCE)
    expect(res.errors).toEqual([{ text: 'Legion of the First Prince', severity: 'warn' }])
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
    expect(res.selections.artifacts).toContain('Staff of Ocular Optimisation')
    expect(res.errors).toEqual([
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
    expect(res.selections.flavors).toEqual([])
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
        severity: 'deprecation-warn',
        text: 'Sword of Judgement',
        reason: DEPRECATED_MALIGN_SORCERY,
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
    expect(res.selections.endless_spells).toContain('Darkfire Daemonrift')
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
      {
        severity: 'warn',
        text: 'True Child of Slaanesh (Pretenders Host Second Command Trait)',
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

  it('should work with The Blood-forged Armour', () => {
    const parsedText = getFile('1578730417865-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.artifacts).toContain('The Blood-forged Armour')
    expect(res.errors).toEqual([])
  })

  it('should work with Vitriolic Spray (Anvilgard)', () => {
    const parsedText = getFile('1577866703167-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.spells).toContain('Vitriolic Spray (Anvilgard, Har Kuron)')
    expect(res.errors).toEqual([])
  })

  it('should work with Amethyst Glow/Dread Withering trait/spell', () => {
    const parsedText = getFile('1577088536258-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Amethyst Glow')
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
    expect(res.selections.command_traits).toContain('Master of Defence (Order)')
    expect(res.errors).toEqual([])
  })

  it('should work with Berzerker Lord', () => {
    const parsedText = getFile('1576328837058-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.command_traits).toContain('Berserker Lord')
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
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Balewind Vortex',
      },
    ])
  })

  it('should work with Slaves to Darkness Daemon Prince', () => {
    const parsedText = getFile('1576502239768-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.units).toContain('Daemon Prince')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'ally-warn',
        text: 'Allied Kairos Fateweaver can belong to Legion Of The First Prince or Tzeentch. Please add this unit manually.',
      },
    ])
  })

  it('should work with Warcry scrolls 1', () => {
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
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Balewind Vortex',
      },
    ])
  })

  it('should work with Dabblings in Sorcery (Anvilgard Battle Trait)', () => {
    const parsedText = getFile('1576513040341-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.command_traits).toContain('Dabblings in Sorcery (Anvilgard Battle Trait)')
    expect(res.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1574686232621-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.origin_realm).toEqual(GHUR)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Blade of Carving',
        reason: DEPRECATED_MALIGN_SORCERY,
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
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with OBR 1', () => {
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
    expect(res.subFactionName).toEqual(SlavesToDarknessFaction.subFactionKeyMap.Cabalists)
    expect(res.origin_realm).toEqual(ULGU)

    expect(res.selections).toEqual({
      flavors: [],
      grand_strategies: [],
      mount_traits: [],
      prayers: ['Favour of the Ruinous Powers'],
      artifacts: ['Scroll of Dark Unravelling'],
      battalions: ['Godswrath Warband'],
      command_abilities: ['Spurred by the Gods'],
      core_rules: [],
      endless_spells: ['Eightfold Doom-Sigil'],
      scenery: [],
      spells: [
        'Binding Damnation',
        'Ruinous Vigour',
        'Whispers of Chaos',
        'Mask of Darkness',
        'Crippling Ruin',
        'Winds of Chaos',
        'Daemonic Power',
      ],
      command_traits: ['Mighty Ritualist'],
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
        severity: 'deprecation-warn',
        text: 'Spellmirror',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with Nurgle and a Skaven battalion', () => {
    const parsedText = getFile('1575286599238-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.allySelections).toEqual({
      [SKAVENTIDE]: { battalions: ['Congregation of Filth'], units: [] },
    })
    expect(res.origin_realm).toEqual(HYSH)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with OBR 2', () => {
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

  it('should work with Vokmortians Retinue 2', () => {
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
    expect(res.selections.command_traits).toContain('One with Fire and Ice (The Phoenicium)')
    expect(res.selections.spells).toContain('Golden Mist (The Phoenicium)')
    expect(res.errors).toEqual([])
  })

  it('should work with OBR 3', () => {
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
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'])
    expect(res.selections.units).toContain('Orruk Great Shaman')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Gorefist',
      },
    ])
  })
  it('should work with Fyreslayers', () => {
    const parsedText = getFile('1573446762118-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers 2', () => {
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
        severity: 'deprecation-warn',
        text: 'Ghyrstrike',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })
  it('should work with Ogor Mawtribes 2', () => {
    const parsedText = getFile('1573208101434-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('should work with Arch-Sorcerer', () => {
    const parsedText = getFile('1573145524404-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.selections.command_traits).toEqual(['Arch-sorcerer'])
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

  it('should work with Ogor Mawtribes 3', () => {
    const parsedText = getFile('1573020637936-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes 4', () => {
    const parsedText = getFile('1573045302823-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('should work with OBR 4', () => {
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
    expect(res.selections.command_traits).toContain('Druid of the Everspring (Living City)')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Wand of Restoration',
        reason: DEPRECATED_MALIGN_SORCERY,
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
        severity: 'deprecation-warn',
        text: 'Ethereal Amulet',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with CoS', () => {
    const parsedText = getFile('1572858808157-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Wand of Restoration',
        reason: DEPRECATED_MALIGN_SORCERY,
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
    expect(res.selections.artifacts).toContain('Enrapturing Circlet')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Thrill-seeker',
      },
      {
        severity: 'warn',
        text: 'Song of Secrets',
      },
    ])
  })

  it('should work with Flaypelt Cloak', () => {
    const parsedText = getFile('1572694928061-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVENTIDE)
    expect(res.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(res.errors).toEqual([])
  })

  it('should work with Flaypelt Cloak (part 2)', () => {
    const parsedText = getFile('1572695046339-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVENTIDE)
    expect(res.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(res.errors).toEqual([])
  })

  it('should work with Warpcog Convocation', () => {
    const parsedText = getFile('1571895994578-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVENTIDE)
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
    expect(res.selections.command_traits).toContain('Dark Wizardry (Royalty)')
    expect(res.errors).toEqual([])
  })

  it('should work with Blade of Endless Bloodshed', () => {
    const parsedText = getFile('1571896391287-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('Blade of Endless Bloodshed')
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
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Balewind Vortex',
      },
      {
        severity: 'ally-warn',
        text: 'Allied Great Bray-Shaman can belong to Beasts Of Chaos or Nurgle or Slaanesh. Please add this unit manually.',
      },
    ])
  })

  it('should work with Destroyer of Foes', () => {
    const parsedText = getFile('1572123301755-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with legacy Order units', () => {
    const parsedText = getFile('1572245593799-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(res.selections.units).toContain('Swordmasters')
    expect(res.errors).toEqual([])
  })

  it('should work with allied endless spells', () => {
    const parsedText = getFile('1571327027143-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.endless_spells).toContain('Everblaze Comet')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: "Ignax's Scales",
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Balewind Vortex',
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
        severity: 'deprecation-warn',
        text: "Ignax's Scales",
        reason: DEPRECATED_MALIGN_SORCERY,
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

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571220408099-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.spells).toContain('Vitriolic Spray (Anvilgard, Har Kuron)')
    expect(res.selections.command_traits).toContain('Secretive Warlock (Anvilgard)')
    expect(res.selections.units).toContain('Knight-Azyros')
    expect(res.selections.units).toContain('Prosecutors with Celestial Hammers')
    expect(res.errors).toEqual([])
  })

  it('should work with Cities of Sigmar and allies 1', () => {
    const parsedText = getFile('1571233444845-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.errors).toEqual([])
  })

  it('should work with FEC Command Traits', () => {
    const parsedText = getFile('1571084621521-Warscroll_Builder')
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.selections.command_traits).toEqual(['The Feast Day (Delusion)', 'Dark Acolyte (Nobility)'])
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
