import { LegionsOfNagashFaction } from 'factions/legions_of_nagash'
import { OrrukWarclansFaction } from 'factions/orruk_warclans'
import { SeraphonFaction } from 'factions/seraphon'
import { SlaaneshFaction } from 'factions/slaanesh'
import { readFileSync } from 'fs'
import {
  BEASTS_OF_CHAOS,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  KHORNE,
  LEGIONS_OF_NAGASH,
  LEGION_OF_GRIEF,
  LUMINETH_REALMLORDS,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  ORRUK_WARCLANS,
  SERAPHON,
  SKAVENTIDE,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TOMB_KINGS,
  TZEENTCH,
  WANDERERS,
} from 'meta/factions'
import path from 'path'
import { HYSH } from 'types/realmscapes'
import { getBattlescribeArmy } from 'utils/battlescribe/getBattlescribeArmy'
import { DEPRECATED_MALIGN_SORCERY, DEPRECATED_PROFILE } from 'utils/import/options'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/battlescribe/html/${filename}.html`), 'utf8')
}

describe('getBattlescribeArmy', () => {
  it('should not work with The Choir of Torments battalion (not in current book)', () => {
    const parsedText = getFile('1601345187171-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'The Choir of Torment',
      },
    ])
  })

  it('should correctly read 1601408881720-Battlescribe', () => {
    const parsedText = getFile('1601408881720-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Fungoid Cloud',
      },
      {
        severity: 'warn',
        text: 'Mesmerise',
      },
      {
        severity: 'warn',
        text: 'Gobbapalooza',
      },
    ])
  })

  it('should correctly read 1601411067591-Battlescribe', () => {
    const parsedText = getFile('1601411067591-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1602294536060-Battlescribe', () => {
    const parsedText = getFile('1602294536060-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1602294559289-Battlescribe', () => {
    const parsedText = getFile('1602294559289-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(LUMINETH_REALMLORDS)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1602790654401-Battlescribe', () => {
    const parsedText = getFile('1602790654401-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.artifacts).toContain('Bracers of Ember Iron')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1603428388643-Battlescribe', () => {
    const parsedText = getFile('1603428388643-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1603737835449-Battlescribe', () => {
    const parsedText = getFile('1603737835449-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Moon-Biter Squigalanche')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1600111513593-Battlescribe', () => {
    const parsedText = getFile('1600111513593-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toEqual([])
    expect(res.selections.flavors).not.toContain('Flesh-Eater Courts')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1600327940544-Battlescribe', () => {
    const parsedText = getFile('1600327940544-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1600480417737-Battlescribe', () => {
    const parsedText = getFile('1600480417737-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(TZEENTCH)
    // TODO:
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: '5 - Fold Reality',
      },
      {
        severity: 'warn',
        text: 'Umbral Spellportal',
      },
    ])
  })

  it('should correctly read 1600607745153-Battlescribe', () => {
    const parsedText = getFile('1600607745153-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.subFactionName).toEqual(SlaaneshFaction.subFactionKeyMap['Godseekers Host'])
    expect(res.selections.units).toContain('Seeker Chariots')
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1601219377000-Battlescribe', () => {
    const parsedText = getFile('1601219377000-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Allherd',
      },
      {
        severity: 'warn',
        text: 'Blade of the Desecrator',
      },
      {
        severity: 'warn',
        text: 'Devolve',
      },
      {
        severity: 'warn',
        text: 'Tendrils of Atrophy',
      },
      {
        severity: 'warn',
        text: 'Great Bray-shaman',
      },
    ])
  })

  it('should correctly read 1598041271936-Battlescribe', () => {
    const parsedText = getFile('1598041271936-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Rattlegauge Warplock (Enginecoven)')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1598085201630-Battlescribe', () => {
    const parsedText = getFile('1598085201630-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Legion of Sacrament'])
    expect(res.selections.artifacts).toContain('Asylumaticae')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Spectral Lure',
      },
    ])
  })

  it('should correctly read 1599083520842-Battlescribe', () => {
    const parsedText = getFile('1599083520842-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('Blade of Endless Bloodshed')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1599497906274-Battlescribe', () => {
    const parsedText = getFile('1599497906274-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Dark Feast')
    expect(res.selections.battalions).toContain('Tyrants of Blood')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: '- Bloodfuelled Prayers',
      },
    ])
  })

  // TODO
  it.skip('should correctly read 1599538605528-Battlescribe', () => {
    const parsedText = getFile('1599538605528-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Spirit Gale',
      },
      {
        severity: 'warn',
        text: 'Vampire Lord (Flying Horror)',
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Vampire Lord can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Soulblight. Please add this unit manually.',
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Vampire Lord on Zombie Dragon can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Soulblight. Please add this unit manually.',
      },
    ])
  })

  it('should correctly read 1597441117251-Battlescribe', () => {
    const parsedText = getFile('1597441117251-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.spells).toContain('Nikkit! Nikkit!')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1596870118915-Battlescribe', () => {
    const parsedText = getFile('1596870118915-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.scenery).toContain('Charnel Throne')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1593279607055-Battlescribe', () => {
    const parsedText = getFile('1593279607055-Battlescribe')
    const res = getBattlescribeArmy(parsedText)

    expect(res.selections.spells).toContain('Nikkit! Nikkit!')
    expect(res.selections.spells).toContain('Hag Curse')
    expect(res.selections.units).toContain('Troggoth Hag')
    expect(res.selections.endless_spells).toContain("Scrapskuttle's Arachnacauldron")
    expect(res.errors).toEqual([])
  })

  it.skip('should correctly read 1593863449094-Battlescribe', () => {
    const parsedText = getFile('1593863449094-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Courts of Delusion',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Ethereal Amulet',
      // },
    ])
  })

  it.skip('should correctly read 1594226326192-Battlescribe', () => {
    const parsedText = getFile('1594226326192-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Allherd',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Blade of the Desecrator',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Devolve',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Great Bray-shaman',
      // },
    ])
  })

  it.skip('should correctly read 1594366095025-Battlescribe', () => {
    const parsedText = getFile('1594366095025-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Vile Transference',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Vampire Lord (Mounted on Nightmare)',
      // },
      // {
      //   severity: 'ally-warn',
      //   text:
      //     'Allied Vampire Lord can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Soulblight. Please add this unit manually.',
      // },
      // {
      //   severity: 'ally-warn',
      //   text:
      //     'Allied Vampire Lord on Zombie Dragon can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Soulblight. Please add this unit manually.',
      // },
    ])
  })

  it.skip('should correctly read 1595426828729-Battlescribe', () => {
    const parsedText = getFile('1595426828729-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Lifebane',
      // },
    ])
  })

  it('should correctly read 1595627477984-Battlescribe', () => {
    const parsedText = getFile('1595627477984-Battlescribe')
    const res = getBattlescribeArmy(parsedText)

    expect(res.selections.units).toContain('Duke Crakmarrow')
    expect(res.selections.units).toContain('The Grymwatch')
    expect(res.errors).toEqual([])
  })

  it('should work with 1590913977244-Battlescribe', () => {
    const parsedText = getFile('1590913977244-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Orpheon Katakros')
    expect(res.errors).toEqual([])
  })

  it('should work with 1588693593835-Battlescribe', () => {
    const parsedText = getFile('1588693593835-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Kroxigor')
    expect(res.errors).toEqual([])
  })

  // TODO
  it.skip('should work with 1588929444550-Battlescribe', () => {
    const parsedText = getFile('1588929444550-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap.Soulblight)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Ethereal Amulet',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with 1589444286540-Battlescribe', () => {
    const parsedText = getFile('1589444286540-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Eternal Temple-host')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with 1589575638626-Battlescribe', () => {
    const parsedText = getFile('1589575638626-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Stalliarch Lords')
    expect(res.errors).toEqual([])
  })

  it('should work with 1589673659590-Battlescribe', () => {
    const parsedText = getFile('1589673659590-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with 1590190604257-Battlescribe', () => {
    const parsedText = getFile('1590190604257-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Sunclaw Starhost')
    expect(res.selections.units).not.toContain('Sunclaw Starhost')
    expect(res.errors).toEqual([])
  })

  it('should work with 1590365910617-Battlescribe', () => {
    const parsedText = getFile('1590365910617-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Drowned Men')
    expect(res.errors).toEqual([])
  })

  it('should work with 1587178498419-Battlescribe', () => {
    const parsedText = getFile('1587178498419-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Hermdar (Lodge)')
    expect(res.errors).toEqual([])
  })

  it('should work with 1586535165728-Battlescribe', () => {
    const parsedText = getFile('1586535165728-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Rockjaws',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with 1586790008426-Battlescribe', () => {
    const parsedText = getFile('1586790008426-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Aspiring Deathbringer')
    expect(res.errors).toEqual([])
  })

  it('should work with 1585935571602-Battlescribe', () => {
    const parsedText = getFile('1585935571602-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    // Skink Handler -> Razordon Hunting Pack
    expect(res.selections.units).toContain('Razordon Hunting Pack')
    expect(res.errors).toEqual([])
  })

  it.skip('should work with 1586036421684-Battlescribe', () => {
    const parsedText = getFile('1586036421684-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    // expect(res.selections.endless_spells).toContain("Ravenak's Gnashing Jaws")
    // Technically, this should be a "Bound Ravenak's Gnashing Jaws"
    // But we're matching too aggressively on the "Bound" prefix so I'm leaving this alone for now
    expect(res.selections.endless_spells).toContain("Bound Ravenak's Gnashing Jaws")
    expect(res.selections.units).toContain('Razordon Hunting Pack')
    expect(res.errors).toEqual([])
  })

  it.skip('should work with 1586096394855-Battlescribe', () => {
    const parsedText = getFile('1586096394855-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Starborne)
    expect(res.selections.flavors).toContain('Fangs of Sotek')
    expect(res.selections.battalions).toContain('Shadowstrike Starhost')
    expect(res.errors).toEqual([])
  })

  it('should work with 1586243528222-Battlescribe', () => {
    const parsedText = getFile('1586243528222-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toEqual([])
    expect(res.errors).toEqual([])
  })

  it.skip('should work with 1585479992182-Battlescribe', () => {
    const parsedText = getFile('1585479992182-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced)
    expect(res.selections.flavors).toContain('Thunder Lizard')
    expect(res.selections.units).toContain('Razordon Hunting Pack')
    expect(res.errors).toEqual([])
  })

  it('should work with 1585870135227-Battlescribe', () => {
    const parsedText = getFile('1585870135227-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Thunder Lizard')
    expect(res.selections.battalions).toContain('Shadowstrike Temple-host')
    expect(res.selections.battalions).toContain('Thunderquake Temple-host')
    expect(res.selections.scenery).toContain('Realmshaper Engine')
    expect(res.selections.units).toContain('Razordon Hunting Pack')
    expect(res.errors).toEqual([])
  })

  it('should work with Gloomspite5', () => {
    const parsedText = getFile('Gloomspite5')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Khorne7', () => {
    const parsedText = getFile('Khorne7')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Nighthaunt6', () => {
    const parsedText = getFile('Nighthaunt6')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Beguile',
      },
    ])
  })

  it('should work with Nurgle4', () => {
    const parsedText = getFile('Nurgle4')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Soul Feeder',
      },
      {
        severity: 'warn',
        text: 'Cabalists',
      },
    ])
  })

  it('should work with Slaanesh5', () => {
    const parsedText = getFile('Slaanesh5')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Hellstriders with Claw-spears')
    expect(res.selections.units).toContain('Bladebringer, Herald on Exalted Chariot')
    expect(res.selections.scenery).toContain('Fane of Slaanesh')
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text:
          'Allied Chaos Lord on Manticore can belong to Khorne or Nurgle or Slaves To Darkness. Please add this unit manually.',
      },
    ])
  })

  it('should work with StD5', () => {
    const parsedText = getFile('StD5')
    const res = getBattlescribeArmy(parsedText)
    // Fractal Mindstorm is a deprecated spell from the old Tzeentch book
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Ethereal Amulet',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Fractal Mindstorm',
      },
    ])
  })

  it('should work with StD6', () => {
    const parsedText = getFile('StD6')
    const res = getBattlescribeArmy(parsedText)
    // Fractal Mindstorm is a deprecated spell from the old Tzeentch book
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Fractal Mindstorm',
      },
    ])
  })

  it('should work with Tzeentch4', () => {
    const parsedText = getFile('Tzeentch4')
    const res = getBattlescribeArmy(parsedText)
    // Fractal Mindstorm is a deprecated spell from the old Tzeentch book
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Sword of Judgement',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Fractal Mindstorm',
      },
      {
        severity: 'warn',
        text: 'Stolen Sting',
      },
    ])
  })

  it('should work with LoG1', () => {
    const parsedText = getFile('LoG1')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(LEGION_OF_GRIEF)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Spectral Lure',
      },
      {
        severity: 'warn',
        text: 'Overwhelming Dread',
      },
      {
        severity: 'warn',
        text: "Vanhel's Danse Macabre",
      },
    ])
  })

  it('should work with OBR1', () => {
    const parsedText = getFile('OBR1')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Vokmortian')
    expect(res.errors).toEqual([])
  })

  it('should work with OBR2', () => {
    const parsedText = getFile('OBR2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.selections.scenery).toContain('Bone-tithe Nexus')
    expect(res.selections.flavors).toContain('Petrifex Elite')
    expect(res.errors).toEqual([])
  })

  it('should work with OBR3', () => {
    const parsedText = getFile('OBR3')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with OBR4', () => {
    const parsedText = getFile('OBR4')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with StD4', () => {
    const parsedText = getFile('StD4')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Stormcast7', () => {
    const parsedText = getFile('Stormcast7')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.errors).toEqual([])
  })

  it('should work with Tzeentch3', () => {
    const parsedText = getFile('Tzeentch3')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Fireblast',
      },
      {
        severity: 'warn',
        text: 'Gaunt Summoner & Chaos Familiars',
      },
    ])
  })

  it('should work with BigWaaagh4', () => {
    const parsedText = getFile('BigWaaagh4')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.spells).toContain('Fireball!')
    expect(res.errors).toEqual([])
  })
  it('should work with LoG1 2', () => {
    const parsedText = getFile('LoG1')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Spectral Lure',
      },
      {
        severity: 'warn',
        text: 'Overwhelming Dread',
      },
      {
        severity: 'warn',
        text: "Vanhel's Danse Macabre",
      },
    ])
  })

  it('should work with Soulblight2', () => {
    const parsedText = getFile('Soulblight2')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Beguile',
      },
    ])
  })
  it('should work with StD3', () => {
    const parsedText = getFile('StD3')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })
  it('should work with Stormcast3', () => {
    const parsedText = getFile('Stormcast3')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with Tzeentch2', () => {
    const parsedText = getFile('Tzeentch2')
    const res = getBattlescribeArmy(parsedText)
    // I don't think this is a valid spell in AOS 2.0
    // Only found it in the old books
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Fractal Mindstorm',
      },
      {
        severity: 'warn',
        text: 'Pink Horrors of Tzeentch',
      },
    ])
  })

  it('should work with CoS1', () => {
    const parsedText = getFile('CoS1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.flavors).toEqual([
      'Greywater Fastness',
      'Anvilgard',
      'Hallowheart',
      'Hammerhal',
      'The Living City',
      'The Phoenicium',
      "Tempest's Eye",
    ])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Forgefire',
      },
      {
        severity: 'warn',
        text: '"I thought duardin were made of sterner stuff!"',
      },
      {
        severity: 'warn',
        text: "'Put your back into it, beardling!'",
      },
      {
        severity: 'warn',
        text: "'Too much damned magic flying about these days!'",
      },
      {
        severity: 'warn',
        text: 'Rune of Unfaltering Aim',
      },
    ])
  })

  it('should work with Nighthaunt3', () => {
    const parsedText = getFile('Nighthaunt3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([{ severity: 'warn', text: 'Beguile' }])
  })

  it('should work with Stormcast6', () => {
    const parsedText = getFile('Stormcast6')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it.skip('should work with StD2', () => {
    const parsedText = getFile('StD2')
    const res = getBattlescribeArmy(parsedText)
    // TODO fix this, just not in the mood right now
    expect(res.errors).toEqual([
      // {
      //   severity: 'warn',
      //   text: 'Mark of the All-favoured',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Bronzed Flesh',
      // },
      // {
      //   severity: 'warn',
      //   text: 'Favour of Khorne (Khorne)',
      // },
    ])
  })

  it('should work with Khorne6', () => {
    const parsedText = getFile('Khorne6')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with Khorne5', () => {
    const parsedText = getFile('Khorne5')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should work with TombKings1', () => {
    const parsedText = getFile('TombKings1')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(TOMB_KINGS)
    expect(res.selections.units).toContain('Sepulchral Stalkers')
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Incantation of the Desert Wind - ROLL D6',
      },
    ])
  })

  it('should work with Sylvaneth3', () => {
    const parsedText = getFile('Sylvaneth3')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(SYLVANETH)
    expect(res.errors).toEqual([])
  })

  it('should work with Gloomspite4', () => {
    const parsedText = getFile('Gloomspite4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.scenery).toEqual(['Bad Moon Loonshrine'])
    expect(res.errors).toEqual([])
  })

  it('should work with Nighthaunt5', () => {
    const parsedText = getFile('Nighthaunt5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.selections.spells).toContain('Howling Vortex')
    expect(res.errors).toEqual([])
  })

  it('should work with Nighthaunt2', () => {
    const parsedText = getFile('Nighthaunt2')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([])
  })

  it('should work with Ironjawz1', () => {
    const parsedText = getFile('Ironjawz1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap.Ironjawz)
    expect(res.selections.flavors).toEqual(['Da Choppas'])
    expect(res.errors).toEqual([])
  })

  it('should work with Mawtribes3', () => {
    const parsedText = getFile('Mawtribes3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.scenery).toEqual(['Great Mawpot'])
    expect(res.errors).toEqual([])
  })

  it('should work with Mawtribes2', () => {
    const parsedText = getFile('Mawtribes2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.scenery).toEqual(['Great Mawpot'])
    expect(res.errors).toEqual([])
  })

  it('should work with Mawtribes1', () => {
    const parsedText = getFile('Mawtribes1')
    const res = getBattlescribeArmy(parsedText)

    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: OGOR_MAWTRIBES,
      subFactionName: '',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: ['Bloodgullet (Mawtribe)'],
        artifacts: ['Wizardflesh Apron', 'Splatter-cleaver'],
        battalions: ['Goremand'],
        command_abilities: ['Bloodbath', 'Bellowing Voice'],
        endless_spells: [],
        scenery: [],
        spells: [
          'Arcane Bolt',
          'Fleshcrave Curse',
          'Mystic Shield',
          'Voracious Maw',
          'Blood Feast',
          'Rockchomper',
        ],
        command_traits: ["'Nice Drop of the Red Stuff!'"],
        triumphs: [],
        units: [
          'Butcher',
          'Frostlord on Stonehorn',
          'Frost Sabres',
          'Gnoblars',
          'Leadbelchers',
          'Ogor Gluttons',
          'Slaughtermaster',
          'Ironguts',
        ],
      },
      unknownSelections: [],
    })
  })

  it('should work with IDK5', () => {
    const parsedText = getFile('IDK5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.artifacts).toContain('Ankusha Spur')
    expect(res.errors).toEqual([])
  })

  it('should work with IDK4', () => {
    const parsedText = getFile('IDK4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Fuethan'])
    // These are Sylvaneth spells
    expect(res.errors).toEqual([
      { severity: 'warn', text: 'Awakening the Wood' },
      { severity: 'warn', text: 'Unleash Spites' },
      { severity: 'warn', text: 'Verdant Blessing' },
    ])
  })

  it('should work with Nurgle1', () => {
    const parsedText = getFile('Nurgle1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.origin_realm).toEqual('Ulgu')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Miasmatic Blade',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Wristbands of Illusion',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: "Betrayer's Crown",
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Blade of the Thirteen Dominions',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Doppelganger Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Favour of Nurgle (Nurgle)',
      },
      {
        severity: 'warn',
        text: 'Wind of Chaos',
      },
      {
        severity: 'warn',
        text: 'Kayzk the Befouled',
      },
    ])
  })

  it('should work with Ironjawz2', () => {
    const parsedText = getFile('Ironjawz2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap.Ironjawz)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers4', () => {
    const parsedText = getFile('Fyreslayers4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers8', () => {
    const parsedText = getFile('Fyreslayers8')
    const res = getBattlescribeArmy(parsedText)

    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Thermalrider Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Summon Starlight',
      },
    ])
  })

  it('should work with Fyreslayers3', () => {
    const parsedText = getFile('Fyreslayers3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.artifacts).toContain('Vosaxe')
    expect(res.errors).toEqual([])
  })

  it('should work with Nurgle3', () => {
    const parsedText = getFile('Nurgle3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.errors).toEqual([])
  })

  it('should work with Gloomspite3', () => {
    const parsedText = getFile('Gloomspite3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Gryph-feather Charm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with Nighthaunt4', () => {
    const parsedText = getFile('Nighthaunt4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers7', () => {
    const parsedText = getFile('Fyreslayers7')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers6', () => {
    const parsedText = getFile('Fyreslayers6')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers5', () => {
    const parsedText = getFile('Fyreslayers5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Slaanesh4', () => {
    const parsedText = getFile('Slaanesh4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.selections.artifacts).toContain('Beguiling Gem (Chaos)')
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text:
          'Allied Chaos Lord on Manticore can belong to Khorne or Nurgle or Slaves To Darkness. Please add this unit manually.',
      },
    ])
  })

  it('should work with Slaanesh3', () => {
    const parsedText = getFile('Slaanesh3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.origin_realm).toEqual('Ulgu')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Doppelganger Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Sword of Judgement',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Chaos Lord on Manticore can belong to Khorne or Nurgle or Slaves To Darkness. Please add this unit manually.',
      },
    ])
  })

  it('should work with Nurgle2', () => {
    const parsedText = getFile('Nurgle2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.errors).toEqual([])
  })

  it('should work with BigWaaagh3', () => {
    const parsedText = getFile('BigWaaagh3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'])
    expect(res.selections.flavors).toEqual([])
    expect(res.selections.spells).toContain('Fireball!')
    expect(res.errors).toEqual([])
  })

  it('should work with BigWaaagh1', () => {
    const parsedText = getFile('BigWaaagh1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'])
    expect(res.selections.flavors).toEqual([])
    expect(res.selections.spells).toContain('Fireball!')
    expect(res.errors).toEqual([])
  })

  it('should work with DoK2', () => {
    const parsedText = getFile('DoK2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections.spells).toEqual(['Arcane Bolt', 'Mystic Shield', 'Black Horror of Ulgu'])
    expect(res.selections.flavors).toEqual(['Hagg Nar', 'Draichi Ganeth', 'The Kraith', 'Khailebron'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Arnzipal's Black Horror",
      },
    ])
  })

  it('should work with Fyreslayers2', () => {
    const parsedText = getFile('Fyreslayers2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.flavors).toEqual([
      'Greyfyrd (Lodge)',
      'Lofnir (Lodge)',
      'Vostarg (Lodge)',
      'Hermdar (Lodge)',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Stormcast5', () => {
    const parsedText = getFile('Stormcast5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Aetherquartz Brooch',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with Stormcast4', () => {
    const parsedText = getFile('Stormcast4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.command_abilities).toEqual([
      'Heroes of Another Age',
      'Cut off the Head',
      'Righteous Hatred',
      'Astral Conjunction',
      'Holy Crusaders',
      'Soul of the Stormhost',
      'No Mercy',
      'Rousing Oratory',
    ])
    expect(res.selections.flavors).toEqual([
      'Anvils of the Heldenhammer (Stormhost)',
      'Astral Templars (Stormhost)',
      'Celestial Vindicators (Stormhost)',
      'Celestial Warbringers (Stormhost)',
      'Hallowed Knights (Stormhost)',
      'Hammers of Sigmar (Stormhost)',
      'Knights Excelsior (Stormhost)',
      'Tempest Lords (Stormhost)',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Slaanesh2', () => {
    const parsedText = getFile('Slaanesh2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.subFactionName).toEqual(SlaaneshFaction.subFactionKeyMap['Invaders Host'])
    // expect(res.selections.flavors).toEqual(['Invaders Host', 'Godseekers Host', 'Pretenders Host']) // How should we handle this?
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Godseekers Host',
      },
      {
        severity: 'warn',
        text: 'Pretenders Host',
      },
    ])
  })

  it('should work with Khorne3', () => {
    const parsedText = getFile('Khorne3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.flavors).toEqual([
      'The Bloodlords',
      'Reapers of Vengeance',
      'The Skullfiend Tribe',
      'The Goretide',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Stormcast1', () => {
    const parsedText = getFile('Stormcast1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.flavors).toEqual(['Anvils of the Heldenhammer (Stormhost)'])
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Drakeforged Plate',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Blade of Carving',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Shardfist Pelt',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: "Beastcaller's Bones",
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      { text: "Blacktalon's Shadowhammers", reason: DEPRECATED_PROFILE, severity: 'deprecation-warn' },
    ])
  })

  it('should work with Gloomspite2', () => {
    const parsedText = getFile('Gloomspite2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.command_abilities).toEqual(['Instinctive Leader'])
    expect(res.selections.spells).toEqual([
      'Arcane Bolt',
      'Mystic Shield',
      'Spore Maws',
      'The Great Green Spite',
    ])
    expect(res.selections.units).toEqual([
      'Dankhold Troggboss',
      'Fungoid Cave-Shaman',
      'Fellwater Troggoths',
      'Rockgut Troggoths',
      'Stabbas',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Seraphon1', () => {
    const parsedText = getFile('Seraphon1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Meteoric Convocation',
      },
      {
        severity: 'warn',
        text: 'Summon Starlight',
      },
      {
        severity: 'warn',
        text: 'Light of the Heavens',
      },
    ])
  })

  it('should work with Wanderers1', () => {
    const parsedText = getFile('Wanderers1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(WANDERERS)
    expect(res.errors).toEqual([])
  })

  it('should work with Tzeentch1', () => {
    const parsedText = getFile('Tzeentch1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Jade Diadem',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'The Sunderblade',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Jadewound Thorn',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Ghyrropian Gauntlets',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Souldraught',
      },
      {
        severity: 'deprecation-warn',
        text: 'Entangling Blade',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Blade of Hammerhal Ghyra',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Verdant Mantle',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Wand of Restoration',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: 'Boon of Mutation',
      },
    ])
  })

  it('should work with StD1', () => {
    const parsedText = getFile('StD1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Wind of Chaos', // Pre-December 2019 battletome
      },
    ])
  })

  it('should work with Soulblight1', () => {
    const parsedText = getFile('Soulblight1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap.Soulblight)
    expect(res.errors).toEqual([])
  })

  it('should work with Sylvaneth1', () => {
    const parsedText = getFile('Sylvaneth1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SYLVANETH)
    expect(res.selections.artifacts).toEqual([
      'Briar Sheath',
      'Greenwood Gladius',
      'Lifewreath',
      'The Vesperal Gem',
      "Autumn's Ire",
      'Crown of Fell Bowers',
      'Glamourweave',
      'Lashvines',
      'Wychwood Glaive',
    ])
    expect(res.selections.scenery).toEqual(['Awakened Wyldwood', 'Penumbral Engine'])
    expect(res.selections.battalions).toEqual(['Lords of the Clan'])
    expect(res.selections.command_abilities).toEqual(['Heed the Spirit-song', 'Call to Battle'])
    expect(res.selections.endless_spells).toEqual(['Horrorghast', "Ravenak's Gnashing Jaws"])
    expect(res.errors).toEqual([])
    // The two below values come from the Battalion
    expect(res.selections.units).toContain('Treelord')
    expect(res.selections.units).toContain('Treelord Ancient')
  })

  it('should work with Nighthaunt1', () => {
    const parsedText = getFile('Nighthaunt1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([])
  })

  it('should work with LoS1', () => {
    const parsedText = getFile('LoS1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Legion of Sacrament'])
    expect(res.allySelections).toEqual({
      [NIGHTHAUNT]: {
        battalions: ['Shroudguard'],
        units: [],
      },
    })
    expect(res.errors).toEqual([])
  })

  it('should work with GHoN1', () => {
    const parsedText = getFile('GHoN1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Grand Host of Nagash'])
    // @ts-ignore
    expect(res.allySelections[NIGHTHAUNT].battalions).toEqual(['Shrieker Host'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'COURT OF NULAHMIA',
      },
      {
        severity: 'warn',
        text: 'Temporal Translocation',
      },
    ])
  })

  it('should work with Stormcast2', () => {
    const parsedText = getFile('Stormcast2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.realmscape).toEqual(HYSH)
    expect(res.selections.flavors).toEqual([
      'Hammers of Sigmar (Stormhost)',
      'Astral Templars (Stormhost)',
      'Celestial Vindicators (Stormhost)',
      'Tempest Lords (Stormhost)',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with GHoN3', () => {
    const parsedText = getFile('GHoN3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Grand Host of Nagash'])
    expect(res.selections.units).toContain('Corpse Cart w/ Unholy Lodestone')
    expect(res.origin_realm).toEqual('Ghyran')
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Ghyrstrike',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with LoB1', () => {
    const parsedText = getFile('LoB1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Legion of Blood'])
    expect(res.allySelections[NIGHTHAUNT]).toEqual({
      battalions: ['Nighthaunt Procession'],
      units: [],
    })
    expect(res.origin_realm).toEqual(null)
    expect(res.errors).toEqual([])
  })

  it('should work with BoC', () => {
    const parsedText = getFile('BoC1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(BEASTS_OF_CHAOS)
    expect(res.origin_realm).toEqual('Aqshy')
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'deprecation-warn',
          text: "Ignax's Scales",
          reason: DEPRECATED_MALIGN_SORCERY,
        },
        {
          severity: 'deprecation-warn',
          text: 'Ruby Ring',
          reason: DEPRECATED_MALIGN_SORCERY,
        },
        {
          severity: 'deprecation-warn',
          text: 'Crown of Flames',
          reason: DEPRECATED_MALIGN_SORCERY,
        },
        {
          severity: 'deprecation-warn',
          text: 'Magmaforged Blade',
          reason: DEPRECATED_MALIGN_SORCERY,
        },
        {
          severity: 'deprecation-warn',
          text: 'Onyx Blade',
          reason: DEPRECATED_MALIGN_SORCERY,
        },
        {
          severity: 'deprecation-warn',
          text: 'Smouldering Helm',
          reason: DEPRECATED_MALIGN_SORCERY,
        },
      ],
      realmscape_feature: null,
      realmscape: 'Ghyran',
      unknownSelections: [],
      factionName: BEASTS_OF_CHAOS,
      subFactionName: '',
      origin_realm: 'Aqshy',
      selections: {
        mount_traits: [],
        prayers: [],
        flavors: [],
        artifacts: [
          'Bleating Gnarlstaff (Brayherds)',
          'Glyph-etched Talisman (Warherds)',
          'Thunderstrike Lodestone (Thunderscorn)',
          'Volcanic Axe (Brayherds)',
        ],
        battalions: ['Depraved Drove', 'Marauding Brayherd'],
        command_abilities: ['Grisly Trophy', "Slaughterer's Call"],
        endless_spells: [
          'Balewind Vortex',
          'Lauchon the Soulseeker',
          "Ravenak's Gnashing Jaws",
          'Soulscream Bridge',
        ],
        scenery: ['Herdstone', 'Penumbral Engine'],
        spells: [
          'Arcane Bolt',
          'Mystic Shield',
          'Summon Lightning',
          'Thunderwave (Thunderscorn Wizard)',
          'Devolve',
          'Vicious Stranglethorns (Brayherd Wizard)',
          'Boon of Mutation',
        ],
        command_traits: [],
        triumphs: [],
        units: [
          'Beastlord',
          'Doombull',
          'Dragon Ogor Shaggoth',
          'Great Bray-Shaman',
          'Tzaangor Shaman',
          'Chaos Gargant',
          'Cygor',
          'Gors',
          'Ungors',
          'Centigors',
          'Dragon Ogors',
          'Razorgors',
          'Tzaangor Enlightened',
          'Tzaangors',
        ],
      },
    })
  })

  it('should work with FEC', () => {
    const parsedText = getFile('FEC1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.realmscape).toEqual('Chamon')
    expect(res.selections.scenery).toEqual(['Charnel Throne', 'Penumbral Engine'])
    expect(res.selections.flavors).toEqual(['Gristlegore (Grand Court)'])
    expect(res.selections.artifacts).toEqual([
      'The Grim Garland (Royal Treasury)',
      'The Dermal Robe (Royal Treasury)',
      'Carrion Wand (Noble Heirlooms)',
      'Blood-river Chalice (Royal Treasury)',
      'Ghurish Mawshard',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Dok1', () => {
    const parsedText = getFile('Dok1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections).toEqual({
      mount_traits: [],
      prayers: [
        'Rune of Khaine',
        'Touch of Death',
        'Wrath of Khaine',
        'Covenant of the Iron Heart',
        'Dance of Doom',
        'Catechism of Murder',
      ],
      flavors: ['Hagg Nar'],
      artifacts: [
        'Rune of Ulgu',
        'Thousand and One Dark Blessings',
        'Cursed Blade',
        'The Mirror Glaive',
        'Crone Blade',
        'Khainite Pendant',
      ],
      battalions: ['Cauldron Guard', 'Shadowhammer Compact', 'Temple Nest'],
      command_abilities: ['Orgy of Slaughter', 'Worship Through Bloodshed'],
      endless_spells: ['Emerald Lifeswarm', 'Quicksilver Swords', 'Soulsnare Shackles'],
      scenery: [],
      spells: [
        'Arcane Bolt',
        'Enfeebling Foe',
        'Mystic Shield',
        'The Withering',
        'Doomfire',
        'Black Horror of Ulgu',
      ],
      command_traits: ['Devoted Disciples'],
      triumphs: [],
      units: [
        'Bloodwrack Medusa',
        'Bloodwrack Shrine',
        'Hag Queen',
        'Hag Queen on Cauldron of Blood',
        'Morathi-Khaine',
        'The Shadow Queen',
        'Slaughter Queen',
        'Slaughter Queen on Cauldron of Blood',
        'Avatar of Khaine',
        'Sisters of Slaughter',
        'Witch Aelves',
        'Blood Sisters',
        'Blood Stalkers',
        'Doomfire Warlocks',
        'Khinerai Heartrenders',
        'Khinerai Lifetakers',
        'Judicators',
        'Protectors',
        'Liberators',
      ],
    })
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: "Ignax's Scales",
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Ruby Ring',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Purefire Brazier',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Thermalrider Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Smouldering Helm',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'deprecation-warn',
        text: 'Magmadroth Blood Vials',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
      {
        severity: 'warn',
        text: "Arnzipal's Black Horror",
      },
    ])
  })

  it('should work with Skaven2', () => {
    const parsedText = getFile('Skaven2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SKAVENTIDE)
    expect(res.errors).toEqual([])
  })

  it('should work with Skaven3', () => {
    const parsedText = getFile('Skaven3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SKAVENTIDE)
    expect(res.errors).toEqual([])
  })

  it('should work with Khorne4', () => {
    const parsedText = getFile('Khorne4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([
      {
        severity: 'deprecation-warn',
        text: 'Thermalrider Cloak',
        reason: DEPRECATED_MALIGN_SORCERY,
      },
    ])
  })

  it('should work with BigWaaagh2', () => {
    const parsedText = getFile('BigWaaagh2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap['Big Waaagh'])
    expect(res.selections.spells).toContain("Mighty 'Eadbutt")
    expect(res.selections.spells).toContain('Fireball!')
    expect(res.errors).toEqual([])
  })

  it('should work with GHoN2', () => {
    const parsedText = getFile('GHoN2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Grand Host of Nagash'])
    expect(res.errors).toEqual([
      { severity: 'warn', text: 'Beacon of Nagashizzar' },
      {
        severity: 'warn',
        text: 'Spectral Lure',
      },
    ])
  })

  it('should work with Fyreslayers', () => {
    const parsedText = getFile('Fyreslayers1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.origin_realm).toEqual(null)
    expect(res.selections.flavors).toEqual(['Hermdar (Lodge)'])
    expect(res.selections.scenery).toEqual(['Magmic Battleforge'])
    expect(res.errors).toEqual([])
  })

  it.skip('should work with Khorne2', () => {
    const parsedText = getFile('Khorne2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.scenery).toEqual(['Herdstone'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Allherd', // BoC Allegiance
      },
    ])
  })

  it('should work with IDK3', () => {
    const parsedText = getFile('IDK3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Dhom Hain', 'Nautilar', "Mor'phann", 'Fuethan', 'Briomdar'])
    expect(res.errors).toEqual([])
  })

  it('should work with Bonesplitterz1', () => {
    const parsedText = getFile('Bonesplitterz1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual(OrrukWarclansFaction.subFactionKeyMap.Bonesplitterz)
    // This is characterized as a Super Battalion by Battlescribe (old version, pre Big Waaagh)
    expect(res.errors).toEqual([{ text: 'Icebone Warclan', severity: 'warn' }])
  })

  it('should work with Gloomspite1', () => {
    const parsedText = getFile('Gloomspite1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.spells).toContain('Speed of the Spider God')
    expect(res.selections.spells).toContain('Venom of the Spider God')
    expect(res.selections.spells).toContain('Night Shroud')
    expect(res.errors).toEqual([])
  })

  it('should work with IDK1', () => {
    const parsedText = getFile('IDK1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.errors).toEqual([
      { text: 'Awakening the Wood', severity: 'warn' },
      { text: 'Unleash Spites', severity: 'warn' },
      { text: 'Verdant Blessing', severity: 'warn' },
    ])
  })

  it('should work with Khorne1', () => {
    const parsedText = getFile('Khorne1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.origin_realm).toEqual('Ghur')
    expect(res.selections.scenery).toContain('Skull Altar')
    expect(res.allySelections).toEqual({
      SLAVES_TO_DARKNESS: { battalions: [], units: ['Furies'] },
      CHAOS_GRAND_ALLIANCE: { battalions: [], units: ['Gigantic Chaos Spawn'] },
    })
    expect(res.selections.units).toEqual([
      'Bloodmaster, Herald of Khorne',
      'Bloodstoker',
      'Bloodthirster of Insensate Rage',
      'Exalted Greater Daemon of Khorne',
      'Skaarac the Bloodborn',
      'Skarr Bloodwrath',
      'Vorgaroth the Scarred & Skalok the Skull Host of Khorne',
      'Wrath of Khorne Bloodthirster',
      'Mazarall the Butcher',
      'Skull Cannons',
      'Bloodletters',
      'Gorebeast Chariots',
      "Garrek's Reavers",
      'Khorgoraths',
      'Skullgrinder',
      'Wrathmongers',
      'Exalted Deathbringer',
      'Skullreapers',
      'Blood Warriors',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Sylvaneth2', () => {
    const parsedText = getFile('Sylvaneth2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SYLVANETH)
    expect(res.selections.flavors).toEqual(['Winterleaf (Glade)'])
    expect(res.selections.artifacts).toEqual(['Frozen Kernel', 'Spiritsong Stave'])
    expect(res.selections.battalions).toEqual(['Outcasts'])
    expect(res.selections.command_abilities).toEqual([
      'Branch Blizzard',
      'Call to Battle',
      'Heed the Spirit-song',
    ])
    expect(res.selections.scenery).toEqual(['Awakened Wyldwood'])
    expect(res.selections.spells).toEqual([
      'Arcane Bolt',
      'Mystic Shield',
      'Roused to Wrath',
      'Verdant Blessing',
      'Primal Terror',
      'Awakening the Wood',
    ])
    expect(res.selections.units).toEqual([
      'Arch-Revenant',
      'Branchwraith',
      'Drycha Hamadreth',
      'Treelord Ancient',
      'Kurnoth Hunters',
      'Spite-Revenants',
    ])
    expect(res.errors).toEqual([])
  })
})
