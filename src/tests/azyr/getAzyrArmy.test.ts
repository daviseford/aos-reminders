import { SeraphonFaction } from 'factions/seraphon'
import { SlaaneshFaction } from 'factions/slaanesh'
import { SlavesToDarknessFaction } from 'factions/slaves_to_darkness'
import { readFileSync } from 'fs'
import {
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  FLESH_EATER_COURTS,
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
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SONS_OF_BEHEMAT,
  STORMCAST_ETERNALS,
  TZEENTCH,
} from 'meta/factions'
import path from 'path'
import { handleAzyrPages } from 'utils/azyr/azyrPdf'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'
import { DEPRECATED_MALIGN_SORCERY } from 'utils/import/options'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/azyr/json/${filename}.json`), 'utf8'))
}

describe('getAzyrArmyFromPdf', () => {
  it('should correctly read 1632542322117-Azyr', () => {
    const fileTxt = getFile('1632542322117-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual('Godseekers Host')
  })

  it('should correctly read 1612043258621-Azyr', () => {
    const fileTxt = getFile('1612043258621-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.spells).toContain('Arcane Corrasion')
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
  })

  it('should correctly read Lumineth1', () => {
    const fileTxt = getFile('Lumineth1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LUMINETH_REALMLORDS)
  })

  it('should correctly read Lumineth2', () => {
    const fileTxt = getFile('Lumineth2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LUMINETH_REALMLORDS)
  })

  it('should correctly read 1600597087449-Azyr', () => {
    const fileTxt = getFile('1600597087449-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.spells).toContain('Etheral Blessings')
  })

  it('should correctly read 1601025074185-Azyr', () => {
    const fileTxt = getFile('1601025074185-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('should correctly read 1598131399395-Azyr', () => {
    const fileTxt = getFile('1598131399395-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.spells).toContain('Spectral Tether')
  })

  it('should correctly read 1594502256562-Azyr', () => {
    const fileTxt = getFile('1594502256562-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.mount_traits).toContain(
      'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)'
    )
  })

  it('should correctly read 1593305871564-Azyr', () => {
    const fileTxt = getFile('1593305871564-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
  })

  it('handles 1584593035311-Azyr', () => {
    const fileTxt = getFile('1584593035311-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
  })

  it('handles 1584593121651-Azyr', () => {
    const fileTxt = getFile('1584593121651-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Starborne)
  })

  it('handles 1585918489536-Azyr', () => {
    const fileTxt = getFile('1585918489536-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
  })

  it('handles 1585918507211-Azyr', () => {
    const fileTxt = getFile('1585918507211-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
  })

  it('handles 1582914528373-Azyr', () => {
    const fileTxt = getFile('1582914528373-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SlavesToDarknessFaction.subFactionKeyMap.Ravagers)
  })

  it('handles 1584088830450-Azyr', () => {
    const fileTxt = getFile('1584088830450-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.flavors).toContain('Ionrach')
  })

  it('handles 1584223772080-Azyr', () => {
    const fileTxt = getFile('1584223772080-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
  })

  it('handles 1584242711185-Azyr', () => {
    const fileTxt = getFile('1584242711185-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.units).toContain('The Eyes of the Nine')
  })

  it('handles KO15', () => {
    const fileTxt = getFile('KO15')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.mount_traits).toContain(
      'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)'
    )
  })

  it('handles Tzeentch5', () => {
    const fileTxt = getFile('Tzeentch5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(TZEENTCH)
  })

  it('handles Slaanesh4', () => {
    const fileTxt = getFile('Slaanesh4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    expect(res.subFactionName).toEqual(SlaaneshFaction.subFactionKeyMap['Godseekers Host'])
  })

  it('handles IDK4', () => {
    const fileTxt = getFile('IDK4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    expect(res.selections.flavors).toEqual(['Dhom-Hain'])
  })

  it('handles Tzeentch3', () => {
    const fileTxt = getFile('Tzeentch3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(TZEENTCH)
  })

  it('handles StD11', () => {
    const fileTxt = getFile('StD11')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
  })

  it('handles StD1', () => {
    const fileTxt = getFile('StD1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.selections.spells).toContain('Binding Damnation')
  })

  it('handles StD3', () => {
    const fileTxt = getFile('StD3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.subFactionName).toEqual(SlavesToDarknessFaction.subFactionKeyMap['Host of the Everchosen'])
    expect(res.selections.flavors).toEqual([])
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
      {
        severity: 'warn',
        text: 'Chainrasp Horde',
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
  })

  it('handles Gloomspite2', () => {
    const fileTxt = getFile('Gloomspite2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.battalions).toEqual([])
  })

  it('handles IDK3', () => {
    const fileTxt = getFile('IDK3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Fuethan'])
  })

  it('handles IDK2', () => {
    const fileTxt = getFile('IDK2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Fuethan'])
    expect(res.realmscape).toEqual('Ghur')
    expect(res.selections.command_traits).toEqual(['Born From Agony'])
    expect(res.selections.units).toEqual([
      'Volturnos, High King of the Deep',
      'Akhelian King',
      'Akhelian Morrsarr Guard',
      'Akhelian Ishlaen Guard',
      'Akhelian Allopexes',
    ])
  })

  it('handles OgorMawtribes1', () => {
    const fileTxt = getFile('OgorMawtribes1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('handles OgorMawtribes2', () => {
    const fileTxt = getFile('OgorMawtribes2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('handles OgorMawtribes3', () => {
    const fileTxt = getFile('OgorMawtribes3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.flavors).toEqual(['Boulderhead (Mawtribe)'])
    // expect(res.selections.artifacts).toEqual(['Brand of the Svard'])
    expect(res.selections.prayers).toEqual([
      'Pulverising Hailstorm',
      "Winter's Endurance",
      "Winter's Strength",
    ])
    expect(res.selections.mount_traits).toEqual(['Belligerent Charger', 'Fleshgreed'])
    expect(res.selections.units).toEqual([
      'Frostlord on Stonehorn',
      'Huskard on Thundertusk',
      'Stonehorn Beastriders',
      'Thundertusk Beastriders',
      'Mournfang Pack',
    ])
  })

  it('handles OgorMawtribes4', () => {
    const fileTxt = getFile('OgorMawtribes4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('handles OBR1', () => {
    const fileTxt = getFile('OBR1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
  })

  it('handles OBR2', () => {
    const fileTxt = getFile('OBR2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
  })

  it('handles OBR3', () => {
    const fileTxt = getFile('OBR3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
  })

  it('handles Nighthaunt2', () => {
    const fileTxt = getFile('Nighthaunt2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(NIGHTHAUNT)
  })

  it('handles Seraphon2', () => {
    const fileTxt = getFile('Seraphon2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SERAPHON)
  })

  it('handles Khorne5', () => {
    const fileTxt = getFile('Khorne5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
  })

  it('handles Khorne4', () => {
    const fileTxt = getFile('Khorne4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
  })

  it('handles Khorne2', () => {
    const fileTxt = getFile('Khorne2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
  })

  it('handles LoG2', () => {
    const fileTxt = getFile('LoG2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LEGION_OF_GRIEF)
  })

  it('handles FEC3', () => {
    const fileTxt = getFile('FEC3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
  })

  it('handles DoK2', () => {
    const fileTxt = getFile('DoK2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.subFactionName).toEqual('')
    expect(res.selections).toEqual({
      grand_strategies: [],
      mount_traits: [],
      incarnates: [],
      monstrous_rampages: [],
      prayers: ["Martyr's Sacrifice", 'Touch of Death'],
      flavors: ['The Kraith'],
      artifacts: [],
      battalions: [],
      battle_tactics: [],
      command_abilities: ['All-out Slaughter', 'Worship Through Bloodshed'],
      endless_spells: [],
      scenery: [],
      spells: ['Mindrazor', 'Black Horror of Ulgu'],
      command_traits: [],
      core_rules: [],
      triumphs: [],
      units: ['Hag Queen on Cauldron of Blood', 'Morathi-Khaine', 'Sisters of Slaughter', 'The Shadow Queen'],
    })
  })

  it('handles FEC2', () => {
    const fileTxt = getFile('FEC2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.selections).toEqual({
      grand_strategies: [],
      mount_traits: [],
      incarnates: [],
      monstrous_rampages: [],
      prayers: [],
      flavors: ['Gristlegore (Grand Court)'],
      artifacts: ['Ghurish Mawshard', 'The Grim Garland (Royal Treasury)'],
      battalions: [],
      battle_tactics: [],
      command_abilities: ['Feeding Frenzy', 'Call to War', 'Summon Men-at-arms'],
      endless_spells: ['Cadaverous Barricade', 'Aethervoid Pendulum'],
      scenery: [],
      spells: ['Monstrous Vigour', 'Blood Feast', 'Black Hunger'],
      command_traits: ['Savage Strike', 'The Feast Day (Delusion)'],
      core_rules: [],
      triumphs: [],
      units: ['Abhorrant Ghoul King', 'Royal Terrorgheist'],
    })
  })

  it('handles CoS1', () => {
    const fileTxt = getFile('CoS1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections).toEqual({
      grand_strategies: [],
      mount_traits: [],
      incarnates: [],
      monstrous_rampages: [],
      prayers: ['Rune of Unfaltering Aim', 'Rune Lore: Ancestral Shield', 'Rune Lore: Forgefire'],
      flavors: ['Greywater Fastness'],
      artifacts: [],
      battalions: [],
      battle_tactics: [],
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
      core_rules: [],
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

  it('handles Gloomspite3', () => {
    const fileTxt = getFile('Gloomspite3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.artifacts).toContain("Nibbla's 'Itty Ring")
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
      grand_strategies: [],
      mount_traits: [],
      prayers: [],
      incarnates: [],
      monstrous_rampages: [],
      flavors: ['Anvilgard'],
      artifacts: ['Venomfang Blade (Anvilgard)'],
      battalions: [],
      battle_tactics: [],
      command_abilities: ['Make an Example of the Weak (Anvilgard)'],
      endless_spells: [],
      scenery: [],
      spells: ['Sap Strength (Anvilgard, Har Kuron)', 'Amber Spear', 'Wildform (Ghur)'],
      command_traits: ['Blackfang Crimelord (Anvilgard)', 'Hidden Agents (Anvilgard Battle Trait)'],
      core_rules: [],
      triumphs: [],
      units: ['Battlemage on Griffon', 'Freeguild Handgunners', 'War Hydra'],
    })
  })

  it('handles Slaanesh1', () => {
    const fileTxt = getFile('Slaanesh1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAANESH)
    expect(res.allyFactionNames).toEqual([MERCENARY_COMPANIES])
  })

  it('handles Skryre1', () => {
    const fileTxt = getFile('Skryre1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SKAVEN)
    expect(res.selections.endless_spells).toEqual(['Bell of Doom'])
    expect(res.selections.units).toEqual([
      'Arch-Warlock',
      'Warlock Bombardier',
      'Doomwheel',
      'Warplock Jezzails',
      'Ratling Gun',
      'Stormfiends',
    ])
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
        text: "Azyr lists more than one unit as 'Lord-Arcanum'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text: "Azyr lists more than one unit as 'Lord-Celestant'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text: "Azyr lists more than one unit as 'Evocators'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text: "Azyr lists more than one unit as 'Prosecutors'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text: "Azyr lists more than one unit as 'Vanguard-Raptors'. Please check that we have imported the correct one.",
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
      `Blade of the Thirteen Dominions (Ulgu)`
    )
    expect(sample2).toBeTruthy()

    const sample3 = isPoorlySpacedMatch(
      'Bar ak-Thr yng, City of the Ancest ors',
      `Barak-Thryng, City of the Ancestors`
    )
    expect(sample3).toBeTruthy()
  })
})
