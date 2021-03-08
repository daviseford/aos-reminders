import { OrrukWarclansFaction } from 'factions/orruk_warclans'
import { SeraphonFaction } from 'factions/seraphon'
import { SlaaneshFaction } from 'factions/slaanesh'
import { SlavesToDarknessFaction } from 'factions/slaves_to_darkness'
import { readFileSync } from 'fs'
import {
  BEASTS_OF_CHAOS,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGION_OF_GRIEF,
  LUMINETH_REALMLORDS,
  MEGA_GARGANT_MERCENARIES,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  OGOR_MAWTRIBES,
  ORRUK_WARCLANS,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVENTIDE,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SONS_OF_BEHEMAT,
  STORMCAST_ETERNALS,
  TZEENTCH,
} from 'meta/factions'
import path from 'path'
import { AQSHY, ULGU } from 'types/realmscapes'
import { handleAzyrPages } from 'utils/azyr/azyrPdf'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'
import { DEPRECATED_MALIGN_SORCERY } from 'utils/import/options'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/azyr/json/${filename}.json`), 'utf8'))
}

describe('getAzyrArmyFromPdf', () => {
  it('should correctly read 1605202169324-Azyr', () => {
    const fileTxt = getFile('1605202169324-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        reason: 'the artifacts from Malign Sorcery are no longer matched play legal',
        severity: 'deprecation-warn',
        text: 'Greenglade Flask',
      },
      {
        reason: 'the artifacts from Malign Sorcery are no longer matched play legal',
        severity: 'deprecation-warn',
        text: 'Wand of Restoration',
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Arcanum'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Evocators'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('should correctly read 1607146040635-Azyr', () => {
    const fileTxt = getFile('1607146040635-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        reason: 'the artifacts from Malign Sorcery are no longer matched play legal',
        severity: 'deprecation-warn',
        text: 'Ethereal Amulet',
      },
    ])
  })

  it.skip('should correctly read 1609264723788-Azyr', () => {
    const fileTxt = getFile('1609264723788-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // The Vortex Beast in AoSR doesn't have "of Tzeentch"
    expect(res.selections.units).toContain('Mutalith Vortex Beast')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1609674285585-Azyr', () => {
    const fileTxt = getFile('1609674285585-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Dragon Warriors',
      },
    ])
  })

  it.skip('should correctly read 1610818091807-Azyr', () => {
    const fileTxt = getFile('1610818091807-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // This is listed as a Battle Trait in Azyr, but it's an artifact in AoSR
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: "Skiffer's Salve",
      // },
    ])
  })

  it.skip('should correctly read 1610913689394-Azyr', () => {
    const fileTxt = getFile('1610913689394-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // This is listed as a Battle Trait in Azyr, but it's an artifact in AoSR
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Synesthalcum',
      // },
    ])
  })

  it('should correctly read 1612002378427-Azyr', () => {
    const fileTxt = getFile('1612002378427-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        reason: 'the artifacts from Malign Sorcery are no longer matched play legal',
        severity: 'deprecation-warn',
        text: 'Magmaforged Blade',
      },
    ])
  })

  it('should correctly read 1612043258621-Azyr', () => {
    const fileTxt = getFile('1612043258621-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.spells).toContain('Arcane Corrosion')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1612638799836-Azyr', () => {
    const fileTxt = getFile('1612638799836-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // This is listed as a Battle Trait in Azyr, but it's an artifact in AoSR
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Witch-mist',
      // },
    ])
  })

  it.skip('should correctly read 1612648168665-Azyr', () => {
    const fileTxt = getFile('1612648168665-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // These are command traits in AoSR, but Azyr lists them as Mount Traits
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Acidic Blood',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Jutting Bones',
      // },
    ])
  })

  it('should correctly read 1612839793461-Azyr', () => {
    const fileTxt = getFile('1612839793461-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        reason: 'the artifacts from Malign Sorcery are no longer matched play legal',
        severity: 'deprecation-warn',
        text: 'Sepulchral Plate',
      },
    ])
  })

  it('should correctly read 1612918861529-Azyr', () => {
    const fileTxt = getFile('1612918861529-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        reason: 'the artifacts from Malign Sorcery are no longer matched play legal',
        severity: 'deprecation-warn',
        text: 'Hydroxskin Cloak',
      },
    ])
  })

  it('should correctly read 1613405722187-Azyr', () => {
    const fileTxt = getFile('1613405722187-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  // TODO: Add Dimensional Blade
  // https://github.com/daviseford/aos-reminders/issues/1055
  it.skip('should correctly read 1602264690883-Azyr', () => {
    const fileTxt = getFile('1602264690883-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read SoB1', () => {
    const fileTxt = getFile('SoB1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SONS_OF_BEHEMAT)
    expect(res.allyFactionNames).toEqual([MEGA_GARGANT_MERCENARIES])
    expect(res.allySelections).toEqual({
      [MEGA_GARGANT_MERCENARIES]: { battalions: [], units: ['One-Eyed Grunnock - Warstomper'] },
    })
    expect(res.errors).toEqual([])
  })

  it('should correctly read SoB2', () => {
    const fileTxt = getFile('SoB2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SONS_OF_BEHEMAT)
    expect(res.allyFactionNames).toContain(MEGA_GARGANT_MERCENARIES)
    expect(res.allySelections).toEqual({
      [GLOOMSPITE_GITZ]: { battalions: [], units: ['Fungoid Cave-Shaman'] },
      [MEGA_GARGANT_MERCENARIES]: { battalions: [], units: ['Big Drogg Fort-Kicka - Gatebreaker'] },
    })
    expect(res.errors).toEqual([])
  })

  it('should correctly read SoB3', () => {
    const fileTxt = getFile('SoB3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SONS_OF_BEHEMAT)
    expect(res.allyFactionNames).toContain(GLOOMSPITE_GITZ)
    expect(res.allyFactionNames).toContain(MEGA_GARGANT_MERCENARIES)
    expect(res.selections).toEqual({
      mount_traits: [],
      prayers: [],
      flavors: [],
      artifacts: [
        'The Great Wrecka (Breaker Tribe)',
        'Kingslaughter Cowl (Breaker Tribe)',
        "Wallopin' Tentacle (Taker Tribe)",
        'Net of the Beast-reaver (Taker Tribe)',
        'Jaws of the Mogalodon (Taker Tribe)',
        'Mantle of the Destroyer (Stomper Tribe)',
      ],
      battalions: [],
      command_abilities: [],
      endless_spells: [],
      scenery: [],
      spells: [],
      command_traits: ['Extremely Bitter (Breaker Tribe)'],
      triumphs: [],
      units: ['Gatebreaker', 'Kraken-Eater', 'Warstomper', 'Mancrusher Gargants'],
    })
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Hypersnare Seeds',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Arboreal Stave',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should correctly read ScarVeteran (issue #1037)', () => {
    const fileTxt = getFile('ScarVeteran')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('should correctly read Lumineth1', () => {
    const fileTxt = getFile('Lumineth1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LUMINETH_REALMLORDS)
    expect(res.errors).toEqual([])
  })

  it('should correctly read Lumineth2', () => {
    const fileTxt = getFile('Lumineth2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LUMINETH_REALMLORDS)
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1600502246657-Azyr', () => {
    const fileTxt = getFile('1600502246657-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Bound Quicksilver Swords',
      // },
    ])
  })

  it('should correctly read 1600596804816-Azyr', () => {
    const fileTxt = getFile('1600596804816-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1600596819595-Azyr', () => {
    const fileTxt = getFile('1600596819595-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1600596837969-Azyr', () => {
    const fileTxt = getFile('1600596837969-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1600597087449-Azyr', () => {
    const fileTxt = getFile('1600597087449-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.spells).toContain('Etheral Blessings')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1600597169631-Azyr', () => {
    const fileTxt = getFile('1600597169631-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1601025074185-Azyr', () => {
    const fileTxt = getFile('1601025074185-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Argent Armour',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should correctly read 1601035119838-Azyr', () => {
    const fileTxt = getFile('1601035119838-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1601035209320-Azyr', () => {
    const fileTxt = getFile('1601035209320-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1601035227410-Azyr', () => {
    const fileTxt = getFile('1601035227410-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1598131399395-Azyr', () => {
    const fileTxt = getFile('1598131399395-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.spells).toContain('Spectral Tether')
    expect(res.errors).toEqual([])
  })

  // TODO:
  it.skip('should correctly read 1599301249796-Azyr', () => {
    const fileTxt = getFile('1599301249796-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      // {
      //    "severity": "warn",
      //    "text": "Blade of Symmetry",
      //  },
    ])
  })

  it('should correctly read 1594502256562-Azyr', () => {
    const fileTxt = getFile('1594502256562-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.mount_traits).toContain(
      'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)'
    )
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1592750625890-Azyr', () => {
    const fileTxt = getFile('1592750625890-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SKAVENTIDE)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Grey Seer'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('should correctly read 1593305871564-Azyr', () => {
    const fileTxt = getFile('1593305871564-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1593305883532-Azyr', () => {
    const fileTxt = getFile('1593305883532-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1593305922349-Azyr', () => {
    const fileTxt = getFile('1593305922349-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1593307774554-Azyr', () => {
    const fileTxt = getFile('1593307774554-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1593694727624-Azyr', () => {
    const fileTxt = getFile('1593694727624-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Swift Death',
      // },
      // {
      //   severity: 'ally-warn',
      //   text:
      //     'Allied Necromancer can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Legion Of Grief. Please add this unit manually.',
      // },
      // {
      //   severity: 'ally-warn',
      //   text:
      //     'Allied Dire Wolves can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Legion Of Grief. Please add this unit manually.',
      // },
      // {
      //   severity: 'ally-warn',
      //   text:
      //     'Allied Skeleton Warriors can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Legion Of Grief. Please add this unit manually.',
      // },
      // {
      //   severity: 'ally-warn',
      //   text:
      //     'Allied Black Knights can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Legion Of Grief. Please add this unit manually.',
      // },
    ])
  })

  it('should correctly read 1594846214316-Azyr', () => {
    const fileTxt = getFile('1594846214316-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'])
    expect(res.selections.prayers).toEqual(["Get 'Em Beat", 'Killa Beat'])
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Ethereal Amulet',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should correctly read 1595065135337-Azyr', () => {
    const fileTxt = getFile('1595065135337-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595065148866-Azyr', () => {
    const fileTxt = getFile('1595065148866-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595065157890-Azyr', () => {
    const fileTxt = getFile('1595065157890-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1595065176255-Azyr', () => {
    const fileTxt = getFile('1595065176255-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1586650197871-Azyr', () => {
    const fileTxt = getFile('1586650197871-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.selections.endless_spells).toContain('Bound Burning Head')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles 1584593035311-Azyr', () => {
    const fileTxt = getFile('1584593035311-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1584593121651-Azyr', () => {
    const fileTxt = getFile('1584593121651-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Starborne)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1584757344425-Azyr', () => {
    const fileTxt = getFile('1584757344425-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1585918489536-Azyr', () => {
    const fileTxt = getFile('1585918489536-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1585918507211-Azyr', () => {
    const fileTxt = getFile('1585918507211-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Seraphon5', () => {
    const fileTxt = getFile('Seraphon5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SERAPHON)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.selections.flavors).toContain('Thunder Lizard')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1582094113733-Azyr', () => {
    const fileTxt = getFile('1582094113733-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.battalions).toContain('Dragonlord Host')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Doppelganger Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles 1582914528373-Azyr', () => {
    const fileTxt = getFile('1582914528373-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SlavesToDarknessFaction.subFactionKeyMap.Ravagers)
    expect(res.errors).toEqual([])
  })

  it('handles 1583001514847-Azyr', () => {
    const fileTxt = getFile('1583001514847-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1583363189608-Azyr', () => {
    const fileTxt = getFile('1583363189608-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.artifacts).toContain("A'rgath, the King of Blades")
    expect(res.selections.flavors).toContain('The Baleful Lords')
    expect(res.selections.command_traits).toContain('Rage Unchained')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1584088830450-Azyr', () => {
    const fileTxt = getFile('1584088830450-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.flavors).toContain('Ionrach')
    expect(res.selections.command_traits).toContain('Emissary of the Deep Places')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Argent Armour',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Eidolon of Mathlann'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1584173198145-Azyr', () => {
    const fileTxt = getFile('1584173198145-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1584173207896-Azyr', () => {
    const fileTxt = getFile('1584173207896-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1584223772080-Azyr', () => {
    const fileTxt = getFile('1584223772080-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1584242711185-Azyr', () => {
    const fileTxt = getFile('1584242711185-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.units).toContain('The Eyes of the Nine')
    expect(res.errors).toEqual([])
  })

  it('handles 1584271452754-Azyr', () => {
    const fileTxt = getFile('1584271452754-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Bound Emerald Lifeswarm',
      },
      {
        severity: 'warn',
        text: 'Bound Purple Sun of Shyish',
      },
    ])
  })

  it('handles KO9', () => {
    const fileTxt = getFile('KO9')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.flavors).toContain('Barak-Urbaz, The Market City (Skyport)')
    expect(res.selections.mount_traits).toContain('Breath of Morgrim')
    expect(res.errors).toEqual([])
  })

  it('handles KO10', () => {
    const fileTxt = getFile('KO10')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO11', () => {
    const fileTxt = getFile('KO11')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO12', () => {
    const fileTxt = getFile('KO12')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Auric Runefather'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles KO13', () => {
    const fileTxt = getFile('KO13')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO14', () => {
    const fileTxt = getFile('KO14')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO15', () => {
    const fileTxt = getFile('KO15')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.mount_traits).toContain(
      'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)'
    )
    expect(res.errors).toEqual([])
  })

  it('handles KO16', () => {
    const fileTxt = getFile('KO16')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text:
          'Allied Warden King can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Ironbreakers can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
    ])
  })

  it('handles KO17', () => {
    const fileTxt = getFile('KO17')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles Nurgle4', () => {
    const fileTxt = getFile('Nurgle4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles Tzeentch5', () => {
    const fileTxt = getFile('Tzeentch5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([])
  })

  it.skip('handles Tzeentch4', () => {
    const fileTxt = getFile('Tzeentch4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    // TODO: This is double-selecting the Keeper of Secrets, which should only come from Slaanesh
    expect(res).toEqual({
      allyFactionNames: [SLAANESH],
      allySelections: {
        [SLAANESH]: { battalions: [], units: ['Keeper of Secrets w/ Ritual Knife'] },
      },
      allyUnits: ['Keeper of Secrets'],
      errors: [],
      factionName: 'TZEENTCH',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      subFactionName: '',
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: ['Guild of Summoners'],
        artifacts: ['Brimstone Familiar'],
        battalions: [],
        command_abilities: ['Will of the Arcane Lords'],
        endless_spells: [
          'Purple Sun of Shyish',
          'Realmscourge Rupture',
          'Prismatic Palisade',
          'Suffocating Gravetide',
          'Balewind Vortex',
          'Aethervoid Pendulum',
          'Soulsnare Shackles',
        ],
        scenery: [],
        spells: [
          'Glimpse the Future',
          'Arcane Suggestion',
          'Shield of Fate',
          "Tzeentch's Firestorm",
          'Infernal Flames',
          'Gestalt Sorcery',
        ],
        command_traits: ['Prophet of the Ostensible'],
        triumphs: [],
        units: ['Gaunt Summoner of Tzeentch', 'Kairic Acolytes'],
      },
      unknownSelections: [],
    })

    expect(res.errors).toEqual([])
  })

  it('handles Slaanesh4', () => {
    const fileTxt = getFile('Slaanesh4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    expect(res.subFactionName).toEqual(SlaaneshFaction.subFactionKeyMap['Godseekers Host'])
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Sash of the Ten Paradises',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: "Guardian's Coronet",
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
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bladebringer'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles IDK4', () => {
    const fileTxt = getFile('IDK4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    expect(res.selections.flavors).toEqual(['Dhom Hain'])
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Blade of Symmetry',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Eidolon of Mathlann'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Khorne6', () => {
    const fileTxt = getFile('Khorne6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain("A'rgath, the King of Blades")
    expect(res.selections.command_traits).toEqual(['Berserker Lord'])
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Tzeentch3', () => {
    const fileTxt = getFile('Tzeentch3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([])
  })

  it('handles Stormcast7', () => {
    const fileTxt = getFile('Stormcast7')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.battalions).toContain('Skyborne Slayers')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Celestant'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD11', () => {
    const fileTxt = getFile('StD11')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD1', () => {
    const fileTxt = getFile('StD1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.selections.spells).toContain('Binding Damnation')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles BigWaaagh3', () => {
    const fileTxt = getFile('BigWaaagh3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.prayers).toContain("Get 'Em Beat")
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles deprecated KO8', () => {
    const fileTxt = getFile('KO8')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // These are classified as Mount Traits instead of artifacts
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Gattlesson's Endless Repeater",
      },
      {
        severity: 'warn',
        text: 'Hammer of Aethermatic Might',
      },
      {
        severity: 'warn',
        text: 'Sledgeshock Hammer',
      },
      {
        severity: 'warn',
        text: 'These Are Just Guidelines',
      },
      {
        severity: 'warn',
        text: 'Incredible Self-healing Hull',
      },
    ])
  })

  it('handles Seraphon3', () => {
    const fileTxt = getFile('Seraphon3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Coronal Shield',
      },
      {
        severity: 'warn',
        text: 'Claws of Glor y',
      },
    ])
  })

  it('handles Seraphon4', () => {
    const fileTxt = getFile('Seraphon4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Claws of Glor y',
      },
    ])
  })

  it('handles Slaanesh3', () => {
    const fileTxt = getFile('Slaanesh3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Thermalrider Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Thrill-seek er',
      },
      {
        severity: 'warn',
        text: 'Song of Secr ets',
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bladebringer'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD8', () => {
    const fileTxt = getFile('StD8')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })
  it('handles StD9', () => {
    const fileTxt = getFile('StD9')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })
  it('handles StD10', () => {
    const fileTxt = getFile('StD10')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // Warpfire Dragon is a Destruction unit
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Blade of Symmetry',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Warpfire Dragon',
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD2', () => {
    const fileTxt = getFile('StD2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD3', () => {
    const fileTxt = getFile('StD3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.subFactionName).toEqual(SlavesToDarknessFaction.subFactionKeyMap['Host of the Everchosen'])
    expect(res.selections.flavors).toEqual([])
    expect(res.errors).toEqual([])
  })

  it('handles StD4', () => {
    const fileTxt = getFile('StD4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text:
          'Allied Rotigus can belong to Legion Of Chaos Ascendant or Nurgle. Please add this unit manually.',
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD5', () => {
    const fileTxt = getFile('StD5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
        },
      ],
      factionName: SLAVES_TO_DARKNESS,
      subFactionName: 'Host of the Everchosen',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: [],
        artifacts: [],
        battalions: [],
        command_abilities: ['Dark Prophecy', 'All-seeing Dominion', 'By My Will', 'Spurred by the Gods'],
        endless_spells: [],
        scenery: [],
        spells: [],
        command_traits: [],
        triumphs: [],
        units: [
          'Archaon the Everchosen',
          'Chaos Lord',
          'Chaos Warriors',
          'Chaos Knights',
          'Varanguard',
          'Furies',
          'Untamed Beasts',
        ],
      },
      unknownSelections: ['Aspiring Champion'],
    })
  })

  it('handles StD6', () => {
    const fileTxt = getFile('StD6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.subFactionName).toEqual(SlavesToDarknessFaction.subFactionKeyMap.Cabalists)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD7', () => {
    const fileTxt = getFile('StD7')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SLAVES_TO_DARKNESS,
      subFactionName: SlavesToDarknessFaction.subFactionKeyMap['Host of the Everchosen'],
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: [],
        artifacts: [],
        battalions: [],
        command_abilities: ['Dark Prophecy', 'All-seeing Dominion', 'By My Will'],
        endless_spells: ['Eightfold Doom-Sigil'],
        scenery: [],
        spells: ['Whispers of Chaos'],
        command_traits: [],
        triumphs: [],
        units: ['Archaon the Everchosen', 'Varanguard'],
      },
      unknownSelections: [],
    })
  })

  it('handles deprecated KO7', () => {
    const fileTxt = getFile('KO7')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Thermalrider Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Hammer of Aethermatic Might',
      },
    ])
  })

  it('handles Ironjawz3', () => {
    const fileTxt = getFile('Ironjawz3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap.Ironjawz)
    expect(res.selections.command_traits).toContain("Burstin' with Power")
    expect(res.errors).toEqual([])
  })

  it('handles Ironjawz2', () => {
    const fileTxt = getFile('Ironjawz2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap.Ironjawz)
    expect(res.selections.spells).toContain('Brain-bursta')
    expect(res.errors).toEqual([])
  })

  it('handles LoG3', () => {
    const fileTxt = getFile('LoG3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LEGION_OF_GRIEF)
    expect(res.selections.command_traits).toContain('Amethyst Glow')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles BCR3 (legacy, recognize as Ogor Mawtribes)', () => {
    const fileTxt = getFile('BCR3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES) // BCR are not supported anymore, switch to Ogor Mawtribes
    expect(res.errors).toEqual([
      { severity: 'warn', text: "Braggoth's Beast Hammer" }, // no longer exists
      { severity: 'warn', text: 'Svard Alfrostun' }, // no longer exists
    ])
  })

  it('handles BCR2 (legacy, recognize as Ogor Mawtribes)', () => {
    const fileTxt = getFile('BCR2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES) // BCR are not supported anymore, switch to Ogor Mawtribes
    expect(res.errors).toEqual([])
  })

  it('handles BCR1 (legacy, recognize as Ogor Mawtribes)', () => {
    const fileTxt = getFile('BCR1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES) // BCR are not supported anymore, switch to Ogor Mawtribes
    expect(res.errors).toEqual([
      { severity: 'warn', text: "Braggoth's Beast Hammer" }, // no longer exists
      { severity: 'warn', text: 'Svard Alfrostun' }, // no longer exists
    ])
  })

  it('handles CoS5', () => {
    const fileTxt = getFile('CoS5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.command_traits).toContain('Druid of the Everspring (Living City)')
    expect(res.errors).toEqual([])
  })

  it('handles Gloomspite2', () => {
    const fileTxt = getFile('Gloomspite2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.battalions).toEqual(['Spider Rider Skitterswarm', 'Skitterstrand Nest'])
    expect(res.errors).toEqual([])
  })

  it('handles IDK3', () => {
    const fileTxt = getFile('IDK3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Fuethan'])
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles IDK2', () => {
    const fileTxt = getFile('IDK2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Fuethan'])
    expect(res.realmscape).toEqual('Ghur')
    expect(res.selections.artifacts).toEqual([])
    expect(res.selections.command_traits).toEqual(['Born From Agony'])
    expect(res.selections.units).toEqual([
      'Volturnos, High King of the Deep',
      'Akhelian King',
      'Akhelian Morrsarr Guard',
      'Akhelian Ishlaen Guard',
      'Akhelian Allopexes',
    ])
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles OgorMawtribes1', () => {
    const fileTxt = getFile('OgorMawtribes1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('handles OgorMawtribes2', () => {
    const fileTxt = getFile('OgorMawtribes2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('handles OgorMawtribes3', () => {
    const fileTxt = getFile('OgorMawtribes3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.flavors).toEqual(['Boulderhead (Mawtribe)'])
    expect(res.selections.artifacts).toEqual(['Brand of the Svard'])
    expect(res.selections.prayers).toEqual(['Pulverising Hailstorm'])
    expect(res.selections.mount_traits).toEqual(['Belligerent Charger', 'Fleshgreed'])
    expect(res.selections.command_traits).toEqual(['Lord of Beasts'])
    expect(res.selections.units).toEqual([
      'Frostlord on Stonehorn',
      'Huskard on Thundertusk',
      'Stonehorn Beastriders',
      'Thundertusk Beastriders',
      'Mournfang Pack',
    ])
    expect(res.errors).toEqual([])
  })

  it('handles OgorMawtribes4', () => {
    const fileTxt = getFile('OgorMawtribes4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('handles OBR1', () => {
    const fileTxt = getFile('OBR1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('handles OBR2', () => {
    const fileTxt = getFile('OBR2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('handles OBR3', () => {
    const fileTxt = getFile('OBR3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('handles Stormcast6', () => {
    const fileTxt = getFile('Stormcast6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Hydroxskin Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Arcanum'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Celestant'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Nighthaunt2', () => {
    const fileTxt = getFile('Nighthaunt2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Knight of Shrouds'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles BigWaaagh2', () => {
    const fileTxt = getFile('BigWaaagh2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'])
    expect(res.errors).toEqual([])
  })

  it('handles Seraphon2', () => {
    const fileTxt = getFile('Seraphon2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.artifacts).toEqual([])
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: "Anraheirs's Claw",
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: "Dracothion's Tail",
      },
      {
        severity: 'warn',
        text: 'Meteoric Convocation',
      },
      {
        severity: 'warn',
        text: 'Salamanders',
      },
      {
        severity: 'warn',
        text: 'Skink Handlers',
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Saurus Scar-Veteran'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Khorne5', () => {
    const fileTxt = getFile('Khorne5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([])
  })

  it('handles Khorne4', () => {
    const fileTxt = getFile('Khorne4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Khorne3', () => {
    const fileTxt = getFile('Khorne3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('The Brazen Rune')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: "Ignax's Scales",
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles Khorne2', () => {
    const fileTxt = getFile('Khorne2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles LoG2', () => {
    const fileTxt = getFile('LoG2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LEGION_OF_GRIEF)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('handles FEC3', () => {
    const fileTxt = getFile('FEC3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Abhorrant Ghoul King'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Bonesplitterz2', () => {
    const fileTxt = getFile('Bonesplitterz2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap.Bonesplitterz)
    expect(res.errors).toEqual([])
    expect(res.selections.flavors).toEqual(['Icebone Clan'])
    expect(res.selections.battalions).toEqual(["Kunnin' Rukk"])
    expect(res.selections.artifacts).toEqual(["Mork's Boney Bitz", 'Kattanak Pelt'])
  })

  it('handles DoK2', () => {
    const fileTxt = getFile('DoK2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.subFactionName).toEqual('')
    expect(res.selections).toEqual({
      mount_traits: [],
      prayers: ["Martyr's Sacrifice", 'Rune of Khaine', 'Touch of Death', 'Wrath of Khaine'],
      flavors: ['The Kraith'],
      artifacts: ['Crimson Shard', 'Venom of Nagendra'],
      battalions: [],
      command_abilities: ['Inspired by Carnage', 'Worship Through Bloodshed'],
      endless_spells: [],
      scenery: [],
      spells: ['Mindrazor', 'Black Horror of Ulgu'],
      command_traits: ['Bathe in Their Blood'],
      triumphs: [],
      units: ['Hag Queen on Cauldron of Blood', 'Morathi-Khaine', 'Sisters of Slaughter', 'The Shadow Queen'],
    })
  })

  it('handles FEC2', () => {
    const fileTxt = getFile('FEC2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Abhorrant Ghoul King'. Please check that we have imported the correct one.",
        },
      ],
      factionName: 'FLESH_EATER_COURTS',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      subFactionName: '',
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: ['Gristlegore (Grand Court)'],
        artifacts: ['Ghurish Mawshard', 'The Grim Garland (Royal Treasury)'],
        battalions: ['Royal Menagerie'],
        command_abilities: ['Feeding Frenzy', 'Call to War', 'Summon Men-at-arms'],
        endless_spells: ['Cadaverous Barricade', 'Aethervoid Pendulum'],
        scenery: [],
        spells: ['Monstrous Vigour', 'Blood Feast', 'Black Hunger'],
        command_traits: ['Savage Strike', 'The Feast Day (Delusion)'],
        triumphs: [],
        units: ['Abhorrant Ghoul King', 'Royal Terrorgheist'],
      },
      unknownSelections: [],
    })
  })

  it('handles CoS1', () => {
    const fileTxt = getFile('CoS1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections).toEqual({
      mount_traits: [],
      prayers: ['Rune Lore', 'Rune Lore: Ancestral Shield', 'Rune Lore: Forge Fire'],
      flavors: ['Greywater Fastness'],
      artifacts: [],
      battalions: ['Greywater Artillery Company'],
      command_abilities: ['Salvo Fire', 'Target Sighted'],
      endless_spells: [],
      scenery: [],
      spells: [
        'Descending Ash Cloud (Greywater Fastness)',
        'Choking Fumes (Greywater Fastness)',
        'Chain Lightning (Azyr)',
        'Fireball (Aqshy)',
        'Mystifying Miasma (Ulgu)',
        'Pall of Doom (Shyish)',
        "Pha's Protection (Hysh)",
        'Shield of Thorns (Ghyran)',
        'Transmutation of Lead (Chamon)',
        'Wildform (Ghur)',
      ],
      command_traits: ['Drillmaster (Greywater Fastness)'],
      triumphs: [],
      units: [
        'Battlemage',
        'Cogsmith',
        'Runelord',
        'Freeguild Guard',
        'Freeguild Handgunners',
        'Steam Tank with Commander',
        'Helblaster Volley Gun',
        'Dark Riders',
        'Freeguild Greatswords',
      ],
    })
  })

  it('handles CoS2', () => {
    const fileTxt = getFile('CoS2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections).toEqual({
      mount_traits: [],
      prayers: ['Rune Lore'],
      flavors: ['Greywater Fastness'],
      artifacts: [
        "Mastro Vivetti's Magnificent Macroscope (Greywater Fastness)",
        'Steam-piston Plate Mail (Greywater Fastness)',
      ],
      battalions: [
        'Aetherguard Windrunners',
        'Greywater Artillery Company',
        'Hammerhalian Lancers',
        'Phoenix Flight',
        'Viridian Pathfinders',
        'Whitefire Retinue',
      ],
      command_abilities: [
        'Rousing Battle Cry',
        'Lord of the Deepwood Host',
        'Salvo Fire',
        'Hold the Line',
        'Command Underlings',
        'Inspire Hatred',
        'Target Sighted',
      ],
      endless_spells: ['Prismatic Palisade'],
      scenery: [],
      spells: [
        'Eroding Blast (Greywater Fastness)',
        'Wings of Fire (Hammerhal)',
        'Cindercloud (Hammerhal)',
        'Twin-Tailed Comet (Hammerhal)',
        'Lifesurge (The Living City)',
        'Cage of Thorns (The Living City)',
        'Ironoak Skin (The Living City)',
        'Descending Ash Cloud (Greywater Fastness)',
        'Choking Fumes (Greywater Fastness)',
        'Amber Tide (The Phoenicium)',
        'Phoenix Cry (The Phoenicium)',
        'Golden Mist (The Phoenicium)',
        'Sap Strength (Anvilgard, Har Kuron)',
        'Shadow Daggers (Anvilgard, Har Kuron)',
        'Vitriolic Spray (Anvilgard, Har Kuron)',
        'Roaming Wildfire (Hallowheart)',
        'Sear Wounds (Hallowheart)',
        'Elemental Cyclone (Hallowheart)',
        'Warding Brand (Hallowheart)',
        'Crystal Aegis (Hallowheart)',
        'Ignite Weapons (Hallowheart)',
        "Aura of Glory (Tempest's Eye)",
        "Strike of Eagles (Tempest's Eye)",
        "Celestial Visions (Tempest's Eye)",
        'The Withering (Har Kuron)',
        'Steed of Shadows (Har Kuron)',
        'Pit of Shadows (Har Kuron)',
        'Wildform (Ghur)',
        'Chain Lightning (Azyr)',
        'Fireball (Aqshy)',
        'Mystifying Miasma (Ulgu)',
        'Pall of Doom (Shyish)',
        "Pha's Protection (Hysh)",
        'Transmutation of Lead (Chamon)',
        'Shield of Thorns (Ghyran)',
        'Amber Spear',
        'Comet of Casandora',
        'Burning Gaze',
        'Word of Pain',
        'Bladewind',
        'Armour of Thorns',
      ],
      command_traits: ['Seat on the Council (Greywater Fastness)'],
      triumphs: [],
      units: [
        'Freeguild General',
        'Freeguild General on Griffon',
        'Knight-Azyros',
        'Luminark of Hysh with White Battlemage',
        'Sorceress on Black Dragon',
        'Steam Tank with Commander',
        'Freeguild Handgunners',
        'Ironbreakers',
        'War Hydra',
        'Celestar Ballista',
        'Helblaster Volley Gun',
        'Helstorm Rocket Battery',
        'Cogsmith',
        'Demigryph Knights',
        'Nomad Prince',
        'Wildwood Rangers',
      ],
    })
  })

  it('handles Gloomspite3', () => {
    const fileTxt = getFile('Gloomspite3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.artifacts).toContain("Nibbla's 'Itty Ring")
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Loonboss'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles CoS3', () => {
    const fileTxt = getFile('CoS3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.units).toEqual(['Battlemage', 'Freeguild General', 'Dreadspears'])
    expect(res.selections.command_traits).toEqual(['Aggressive General (Hammerhal)'])
  })

  it('handles CoS4', () => {
    const fileTxt = getFile('CoS4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections).toEqual({
      mount_traits: [],
      prayers: [],
      flavors: ['Anvilgard'],
      artifacts: ['Venomfang Blade (Anvilgard)'],
      battalions: [],
      command_abilities: ['Make an Example of the Weak (Anvilgard)'],
      endless_spells: [],
      scenery: [],
      spells: ['Sap Strength (Anvilgard, Har Kuron)', 'Amber Spear', 'Wildform (Ghur)'],
      command_traits: ['Blackfang Crimelord (Anvilgard)', 'Hidden Agents (Anvilgard Battle Trait)'],
      triumphs: [],
      units: ['Battlemage on Griffon', 'Freeguild Handgunners', 'War Hydra'],
    })
  })

  it('handle deprecated KO6', () => {
    const fileTxt = getFile('KO6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aethershock Earbuster',
      },
    ])
  })

  it('handles deprecated KO5', () => {
    const fileTxt = getFile('KO5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.command_traits).toEqual([
      'AMENDMENT: Prosecute Wars With All Haste',
      'ARTYCLE: Seek New Prospects',
      'FOOTNOTE: Who Strikes First, Strikes Hardest',
      "FOOTNOTE: There's No Trading With Some People",
      'Opportunistic Privateers',
    ])
    expect(res.errors).toEqual([])
  })

  it('handles deprecated KO4', () => {
    const fileTxt = getFile('KO4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.command_traits).toEqual([
      'ARTYCLE: Master the Skies',
      "AMENDMENT: Don't Argue With the Wind",
      "FOOTNOTE: There's Always a Breeze if You Look for it",
      'FOOTNOTE: Without Our Ships, We Are Naught',
      'Master Commander',
    ])
    expect(res.errors).toEqual([])
  })

  it('handles Stormcast4', () => {
    const fileTxt = getFile('Stormcast4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.mount_traits).toEqual(['Keen-clawed', 'Lithe-Limbed'])
  })

  it('handles Slaanesh1', () => {
    const fileTxt = getFile('Slaanesh1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAANESH)
    expect(res.allyFactionNames).toEqual([MERCENARY_COMPANIES])
  })

  it('handles Slaanesh2', () => {
    const fileTxt = getFile('Slaanesh2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAANESH)
    expect(res.subFactionName).toEqual(SlaaneshFaction.subFactionKeyMap['Pretenders Host'])
    expect(res.selections).toEqual({
      mount_traits: [],
      prayers: [],
      flavors: [],
      artifacts: ['The Crown of Dark Secrets', 'Sceptre of Domination', 'Sliverslash'],
      battalions: [],
      command_abilities: ['Excess of Violence'],
      endless_spells: [],
      scenery: [],
      spells: [
        'Hysterical Frenzy',
        'Slothful Stupor',
        'Soulslice Shards',
        'Cacophonic Choir',
        'Overwhelming Acquiescence',
      ],
      command_traits: ['Monarch of Lies'],
      triumphs: [],
      units: [
        'Keeper of Secrets w/ Living Whip',
        'The Contorted Epitome',
        'The Masque',
        'Keeper of Secrets w/ Ritual Knife',
      ],
    })
  })

  it('handles Skryre1', () => {
    const fileTxt = getFile('Skryre1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SKAVENTIDE)
    expect(res.selections.flavors).toContain('Warpstone Sparks (Skryre)')
    expect(res.selections.endless_spells).toEqual(['Bell of Doom (Skaven)'])
    expect(res.selections.units).toEqual([
      'Arch-Warlock',
      'Warlock Bombardier',
      'Doomwheel',
      'Warplock Jezzails',
      'Ratling Gun',
      'Stormfiends',
    ])
  })

  it('handles Seraphon1', () => {
    const fileTxt = getFile('Seraphon1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'Fangs of Sotek',
        },
      ],
      factionName: SERAPHON,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      subFactionName: '',
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: [],
        artifacts: [],
        battalions: ['Sunclaw Starhost'],
        command_abilities: ['Gift from the Heavens', 'Herald of the Old Ones'],
        endless_spells: [],
        scenery: [],
        spells: ["Comet's Call"],
        command_traits: [],
        triumphs: [],
        units: [
          'Slann Starmaster',
          'Engine of the Gods',
          'Saurus Astrolith Bearer',
          'Skink Priest',
          'Saurus Warriors',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles deprecated KO1', () => {
    const fileTxt = getFile('KO1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'These Are Just Guidelines',
        },
      ],
      factionName: KHARADRON_OVERLORDS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      subFactionName: '',
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: ['Barak-Thryng, City of the Ancestors (Skyport)'],
        artifacts: ['Grudgehammer'],
        battalions: [],
        command_abilities: [
          'Master of the Skies',
          'On My Mark, Fire!',
          'Repel Boarders!',
          'Up And At Them!',
          'First Rule of Grungsson',
          'By Grungni, I Have My Eye On You!',
        ],
        endless_spells: [],
        scenery: [],
        spells: [],
        command_traits: [
          'ARTYCLE: Settle the Grudges',
          'AMENDMENT: Trust to Your Guns',
          'FOOTNOTE: Honour the Gods, Just in Case',
          'Supremely Stubborn',
          'ARTYCLE: Chronicle of Grudges',
          'AMENDMENT: Take Help Where You Can Get It',
        ],
        triumphs: [],
        units: [
          'Aether-Khemist',
          'Aetheric Navigator',
          'Arkanaut Admiral',
          'Bjorgen Thundrik',
          'Brokk Grungsson, Lord-Magnate of Barak-Nar',
          'Endrinmaster with Dirigible Suit',
          'Arkanaut Company',
          'Grundstok Gunhauler',
          'Arkanaut Frigate',
          'Arkanaut Ironclad',
          "Thundrik's Profiteers",
          'Skywardens',
          'Grundstok Thunderers',
          'Endrinriggers',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles Skaven1', () => {
    const fileTxt = getFile('Skaven1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Grey Seer'. Please check that we have imported the correct one.",
        },
      ],
      factionName: SKAVENTIDE,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      subFactionName: '',
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: ['Skilled Manipulators (Masterclan)', 'Warpstone Sparks (Skryre)'],
        artifacts: ['Vigordust Injector (Skryre)'],
        battalions: [],
        command_abilities: [],
        endless_spells: [],
        scenery: [],
        spells: ['Death Frenzy', 'Skitterleap', 'More-more-more Warp Power!', 'Wither', 'Warp Lightning'],
        command_traits: ['Master of Magic (Masterclan)'],
        triumphs: [],
        units: [
          'Grey Seer',
          'Warlock Bombardier',
          'Clanrats',
          'Warplock Jezzails',
          'Plague Monks',
          'Skryre Acolytes',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles Fyreslayers2', () => {
    const fileTxt = getFile('Fyreslayers2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Auric Runesmiter'. Please check that we have imported the correct one.",
        },
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Auric Runeson'. Please check that we have imported the correct one.",
        },
      ],
      factionName: FYRESLAYERS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: AQSHY,
      subFactionName: '',
      selections: {
        mount_traits: ['Fire-claw Adult'],
        prayers: ['Prayer of Ash', 'Runic Empowerment'],
        flavors: ['Hermdar (Lodge)'],
        artifacts: ['Tyrant Slayer'],
        battalions: [],
        command_abilities: ['Skull-breakers and Oath-takers', 'Honour Our Oaths', 'Dauntless Assault'],
        endless_spells: ['Runic Fyrewall'],
        scenery: [],
        spells: [],
        command_traits: ['Warrior Indominate'],
        triumphs: [],
        units: [
          'Fjul-Grimnir',
          'The Chosen Axes',
          'Auric Runesmiter',
          'Vulkite Berzerkers',
          'Auric Runeson',
          'Doomseeker',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles BoC1', () => {
    const fileTxt = getFile('BoC1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: ['SLAVES_TO_DARKNESS'],
      allySelections: {
        SLAVES_TO_DARKNESS: {
          battalions: [],
          units: [
            'Sayl the Faithless',
            'Theddra Skull-Scryer',
            'Darkoath Warqueen',
            'Untamed Beasts',
            'Godsworn Hunt',
            'Furies',
          ],
        },
      },
      allyUnits: [
        'Sayl the Faithless',
        'Theddra Skull-Scryer',
        'Darkoath Warqueen',
        'Untamed Beasts',
        'Godsworn Hunt',
        'Furies',
      ],
      errors: [],
      factionName: BEASTS_OF_CHAOS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      subFactionName: '',
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: [],
        artifacts: ['The Knowing Eye (Brayherds)', 'Blackened Armour of Chaos (Warherds)'],
        battalions: [
          'Brass Despoilers',
          'Depraved Drove',
          'Desolating Beastherd',
          'Hungering Warherd',
          'Marauding Brayherd',
          'Pestilent Throng',
          'Phantasmagoria of Fate',
          'Thunderscorn Stormherd',
        ],
        command_abilities: ["Slaughterer's Call", 'Grisly Trophy'],
        endless_spells: [],
        scenery: [],
        spells: [
          'Sundering Blades (Thunderscorn Wizard)',
          'Tendrils of Atrophy (Brayherd Wizard)',
          'Titanic Fury (Brayherd Wizard)',
          'Devolve',
          'Summon Lightning',
          'Boon of Mutation',
        ],
        command_traits: ['Rampant Juggernaut (Warherd)'],
        triumphs: [],
        units: [
          'Beastlord',
          'Doombull',
          'Dragon Ogor Shaggoth',
          'Great Bray-Shaman',
          'Tzaangor Shaman',
          'Bullgors',
          'Gors',
          'Ungors',
          'Chaos Gargant',
          'Chimera',
          'Cygor',
          'Ghorgon',
          'Jabberslythe',
          'Bestigors',
          'Centigors',
          'Chaos Spawn',
          'Chaos Warhounds',
          'Cockatrice',
          'Dragon Ogors',
          'Razorgors',
          'Tuskgor Chariots',
          'Tzaangor Enlightened',
          'Tzaangor Skyfires',
          'Tzaangors',
          'Ungor Raiders',
        ],
      },
      unknownSelections: [],
    })
  })

  it('warns about ambiguous selections', () => {
    const fileTxt = getFile('Stormcast5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.units).toEqual([
      'Lord-Arcanum',
      'Lord-Celestant',
      'Evocators',
      'Prosecutors with Celestial Hammers',
      'Vanguard-Raptors with Hurricane Crossbows',
    ])
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Arcanum'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Celestant'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Evocators'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Prosecutors'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Vanguard-Raptors'. Please check that we have imported the correct one.",
      },
    ])
  })
})

describe('isPoorlySpacedMatch', () => {
  it('handles stuff', () => {
    const sample1 = isPoorlySpacedMatch('Vigor dust Inject or', 'Vigordust Injector (Skryre)')
    expect(sample1).toBeTruthy()

    const sample2 = isPoorlySpacedMatch(
      'Blade of the Thir teen Dominions',
      `Blade of the Thirteen Dominions (${ULGU})`
    )
    expect(sample2).toBeTruthy()

    const sample3 = isPoorlySpacedMatch(
      'Bar ak-Thr yng, City of the Ancest ors',
      `Barak-Thryng, City of the Ancestors`
    )
    expect(sample3).toBeTruthy()
  })
})
