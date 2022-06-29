import { LegionsOfNagashFaction } from 'factions/legions_of_nagash'
import { SlaaneshFaction } from 'factions/slaanesh'
import { readFileSync } from 'fs'
import {
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  KHORNE,
  LEGIONS_OF_NAGASH,
  LEGION_OF_GRIEF,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TOMB_KINGS,
  TZEENTCH,
  WANDERERS,
} from 'meta/factions'
import path from 'path'
import { getBattlescribeArmy } from 'utils/battlescribe/getBattlescribeArmy'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/battlescribe/html/${filename}.html`), 'utf8')
}

describe('getBattlescribeArmy', () => {
  it('should correctly read 1635561437647-Battlescribe', () => {
    const parsedText = getFile('1635561437647-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Kragnos')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1636299801967-Battlescribe', () => {
    const parsedText = getFile('1636299801967-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.errors).toEqual([])
    expect(res.selections.battalions).toContain('Bosses of the Stomp (Magnificent)')
    expect(res.selections.battalions).toContain('Footsloggas (Swift)')
    expect(res.selections.units).toContain('Warstomper')
  })

  it('should correctly read 1633693443120-Battlescribe', () => {
    const parsedText = getFile('1633693443120-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Redemption Brotherhood')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1634226266243-Battlescribe', () => {
    const parsedText = getFile('1634226266243-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.spells).toContain('Living Fissure')
  })

  it('should correctly read 1634323032896-Battlescribe', () => {
    const parsedText = getFile('1634323032896-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Bastian Carthalos')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1634417062945-Battlescribe', () => {
    const parsedText = getFile('1634417062945-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.artifacts).toContain('Fang of Dracothion')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1634676056787-Battlescribe', () => {
    const parsedText = getFile('1634676056787-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.artifacts).toContain('Girdle of the Realm-racer')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1635034418636-Battlescribe', () => {
    const parsedText = getFile('1635034418636-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain("Grashrak's Despoilers")
  })

  it('should correctly read 1635131301976-Battlescribe', () => {
    const parsedText = getFile('1635131301976-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Kruleboyz Finga')
    expect(res.selections.units).toContain('Gobsprakk')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632263631817-Battlescribe', () => {
    const parsedText = getFile('1632263631817-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Kurnoth Hunters')
  })

  it('should correctly read 1632323054450-Battlescribe', () => {
    const parsedText = getFile('1632323054450-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Ellania and Ellathor, Eclipsian Warsages')
  })

  it('should correctly read 1632394710991-Battlescribe', () => {
    const parsedText = getFile('1632394710991-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('The Eternal Conflagration')
  })

  it('should correctly read 1632426492475-Battlescribe', () => {
    const parsedText = getFile('1632426492475-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Kurnoth Hunters')
  })

  it('should correctly read 1632980812991-Battlescribe', () => {
    const parsedText = getFile('1632980812991-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Swampcalla Shaman and Pot-grot')
  })

  it('should correctly read 1633164617906-Battlescribe', () => {
    const parsedText = getFile('1633164617906-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Zaitrec')
    expect(res.selections.scenery).toContain('Shrine Luminor')
  })

  it('should correctly read 1626314280092-Battlescribe', () => {
    const parsedText = getFile('1626314280092-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.scenery).toContain('Feculent Gnarlmaw')
  })

  it('should correctly read 1626363752964-Battlescribe', () => {
    const parsedText = getFile('1626363752964-Battlescribe')
    const res = getBattlescribeArmy(parsedText)

    expect(res.selections.units).toContain('Gatebreaker')
    expect(res.selections.units).toContain('Kraken-Eater')
    expect(res.selections.units).toContain('Mancrusher Gargant')
  })

  it('should correctly read 1626386947765-Battlescribe', () => {
    const parsedText = getFile('1626386947765-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Guild of Summoners')
  })

  it('should correctly read 1626388412216-Battlescribe', () => {
    const parsedText = getFile('1626388412216-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Corpse Cart w/ Balefire Brazier')
  })

  it('should correctly read 1626447368607-Battlescribe', () => {
    const parsedText = getFile('1626447368607-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.endless_spells).toContain('Heart of Fury')
  })

  it('should correctly read 1625939634457-Battlescribe', () => {
    const parsedText = getFile('1625939634457-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.battalions).toContain('Warlord')
    expect(res.selections.battalions).toContain('Battle Regiment')
    expect(res.selections.triumphs).toContain('Inspired')
    expect(res.selections.grand_strategies).toContain('Prized Sorcery')
  })

  it('should correctly read 1625951571355-Battlescribe', () => {
    const parsedText = getFile('1625951571355-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.spells).toContain('Arcane Corrasion')
  })

  it('should correctly read 1626123378890-Battlescribe', () => {
    const parsedText = getFile('1626123378890-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Vindictors')
  })

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

  it('should correctly read 1600111513593-Battlescribe', () => {
    const parsedText = getFile('1600111513593-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toEqual([])
    expect(res.selections.flavors).not.toContain('Flesh-Eater Courts')
  })

  it('should correctly read 1600480417737-Battlescribe', () => {
    const parsedText = getFile('1600480417737-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(TZEENTCH)
  })

  it('should correctly read 1600607745153-Battlescribe', () => {
    const parsedText = getFile('1600607745153-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.subFactionName).toEqual(SlaaneshFaction.subFactionKeyMap['Godseekers Host'])
    expect(res.selections.units).toContain('Seeker Chariots')
  })

  it('should correctly read 1598085201630-Battlescribe', () => {
    const parsedText = getFile('1598085201630-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Legion of Sacrament'])
    expect(res.selections.artifacts).toContain('Asylumaticae')
  })

  it('should correctly read 1599083520842-Battlescribe', () => {
    const parsedText = getFile('1599083520842-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('Blade of Endless Bloodshed')
  })

  it('should correctly read 1597441117251-Battlescribe', () => {
    const parsedText = getFile('1597441117251-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.spells).toContain('Nikkit! Nikkit!')
  })

  it('should correctly read 1596870118915-Battlescribe', () => {
    const parsedText = getFile('1596870118915-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.scenery).toContain('Charnel Throne')
  })

  it('should correctly read 1593279607055-Battlescribe', () => {
    const parsedText = getFile('1593279607055-Battlescribe')
    const res = getBattlescribeArmy(parsedText)

    expect(res.selections.spells).toContain('Nikkit! Nikkit!')
    expect(res.selections.spells).toContain('Hag Curse')
    expect(res.selections.units).toContain('Troggoth Hag')
    expect(res.selections.endless_spells).toContain("Scrapskuttle's Arachnacauldron")
  })

  it('should correctly read 1595627477984-Battlescribe', () => {
    const parsedText = getFile('1595627477984-Battlescribe')
    const res = getBattlescribeArmy(parsedText)

    expect(res.selections.units).toContain('Duke Crakmarrow')
    expect(res.selections.units).toContain('The Grymwatch')
  })

  it('should work with 1590913977244-Battlescribe', () => {
    const parsedText = getFile('1590913977244-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Orpheon Katakros')
  })

  it('should work with 1588693593835-Battlescribe', () => {
    const parsedText = getFile('1588693593835-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Kroxigor')
  })

  it('should work with 1589575638626-Battlescribe', () => {
    const parsedText = getFile('1589575638626-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Stalliarch Lords')
  })

  it('should work with 1590190604257-Battlescribe', () => {
    const parsedText = getFile('1590190604257-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    // expect(res.selections.battalions).toContain('Sunclaw Starhost')
    expect(res.selections.units).not.toContain('Sunclaw Starhost')
  })

  it('should work with 1590365910617-Battlescribe', () => {
    const parsedText = getFile('1590365910617-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Drowned Men')
  })

  it('should work with 1587178498419-Battlescribe', () => {
    const parsedText = getFile('1587178498419-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Hermdar')
  })

  it('should work with 1586790008426-Battlescribe', () => {
    const parsedText = getFile('1586790008426-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Aspiring Deathbringer')
  })

  it('should work with 1585935571602-Battlescribe', () => {
    const parsedText = getFile('1585935571602-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    // Skink Handler -> Razordon Hunting Pack
    expect(res.selections.units).toContain('Razordon Hunting Pack')
  })

  it('should work with 1586243528222-Battlescribe', () => {
    const parsedText = getFile('1586243528222-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toEqual([])
  })

  it('should work with 1585870135227-Battlescribe', () => {
    const parsedText = getFile('1585870135227-Battlescribe')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.flavors).toContain('Thunder Lizard')
    expect(res.selections.scenery).toContain('Realmshaper Engine')
    expect(res.selections.units).toContain('Razordon Hunting Pack')
  })

  it('should work with Slaanesh5', () => {
    const parsedText = getFile('Slaanesh5')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Hellstriders with Claw-spears')
    expect(res.selections.units).toContain('Bladebringer, Herald on Exalted Chariot')
    expect(res.selections.scenery).toContain('Fane of Slaanesh')
  })

  it('should work with LoG1', () => {
    const parsedText = getFile('LoG1')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(LEGION_OF_GRIEF)
  })

  it('should work with OBR1', () => {
    const parsedText = getFile('OBR1')
    const res = getBattlescribeArmy(parsedText)
    expect(res.selections.units).toContain('Vokmortian')
  })

  it('should work with OBR2', () => {
    const parsedText = getFile('OBR2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.selections.scenery).toContain('Bone-tithe Nexus')
    expect(res.selections.flavors).toContain('Petrifex Elite')
  })

  it('should work with Stormcast7', () => {
    const parsedText = getFile('Stormcast7')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
  })

  it('should work with CoS1', () => {
    const parsedText = getFile('CoS1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.prayers).toContain('Rune of Unfaltering Aim')
    expect(res.selections.prayers).toContain('Rune Lore: Forgefire')
    expect(res.selections.flavors).toEqual([
      'Greywater Fastness',
      'Anvilgard',
      'Hallowheart',
      'Hammerhal',
      'The Living City',
      'The Phoenicium',
      "Tempest's Eye",
    ])
  })

  it('should work with TombKings1', () => {
    const parsedText = getFile('TombKings1')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(TOMB_KINGS)
    expect(res.selections.units).toContain('Sepulchral Stalkers')
  })

  it('should work with Sylvaneth3', () => {
    const parsedText = getFile('Sylvaneth3')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(SYLVANETH)
  })

  it('should work with Gloomspite4', () => {
    const parsedText = getFile('Gloomspite4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.scenery).toEqual(['Bad Moon Loonshrine'])
  })

  it('should work with Nighthaunt5', () => {
    const parsedText = getFile('Nighthaunt5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.selections.spells).toContain('Howling Vortex')
  })

  it('should work with Nighthaunt2', () => {
    const parsedText = getFile('Nighthaunt2')
    const res = getBattlescribeArmy(parsedText)
    expect(res.factionName).toEqual(NIGHTHAUNT)
  })

  it('should work with Mawtribes3', () => {
    const parsedText = getFile('Mawtribes3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.scenery).toEqual(['Great Mawpot'])
  })

  it('should work with Mawtribes2', () => {
    const parsedText = getFile('Mawtribes2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.scenery).toEqual(['Great Mawpot'])
  })

  it('should work with IDK5', () => {
    const parsedText = getFile('IDK5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.artifacts).toContain('Ankusha Spur')
  })

  it('should work with IDK4', () => {
    const parsedText = getFile('IDK4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Fuethan'])
  })

  it('should work with Nurgle1', () => {
    const parsedText = getFile('Nurgle1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.origin_realm).toEqual('Ulgu')
  })

  it('should work with Fyreslayers4', () => {
    const parsedText = getFile('Fyreslayers4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with Fyreslayers3', () => {
    const parsedText = getFile('Fyreslayers3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with Nurgle3', () => {
    const parsedText = getFile('Nurgle3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NURGLE)
  })

  it('should work with Gloomspite3', () => {
    const parsedText = getFile('Gloomspite3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
  })

  it('should work with Nighthaunt4', () => {
    const parsedText = getFile('Nighthaunt4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
  })

  it('should work with Fyreslayers7', () => {
    const parsedText = getFile('Fyreslayers7')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with Fyreslayers6', () => {
    const parsedText = getFile('Fyreslayers6')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with Fyreslayers5', () => {
    const parsedText = getFile('Fyreslayers5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
  })

  it('should work with Slaanesh4', () => {
    const parsedText = getFile('Slaanesh4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.selections.artifacts).toContain('Beguiling Gem (Chaos)')
  })

  it('should work with Slaanesh3', () => {
    const parsedText = getFile('Slaanesh3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.origin_realm).toEqual('Ulgu')
  })

  it('should work with Nurgle2', () => {
    const parsedText = getFile('Nurgle2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NURGLE)
  })

  it('should work with DoK2', () => {
    const parsedText = getFile('DoK2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections.spells).toEqual(['Arcane Bolt', 'Mystic Shield', 'Black Horror of Ulgu'])
    expect(res.selections.flavors).toEqual(['Hagg Nar', 'Draichi Ganeth', 'The Kraith', 'Khailebron'])
  })

  it('should work with Fyreslayers2', () => {
    const parsedText = getFile('Fyreslayers2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.flavors).toEqual(['Greyfyrd', 'Lofnir', 'Vostarg', 'Hermdar'])
  })

  it('should work with Stormcast5', () => {
    const parsedText = getFile('Stormcast5')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
  })

  it('should work with Slaanesh2', () => {
    const parsedText = getFile('Slaanesh2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.subFactionName).toEqual(SlaaneshFaction.subFactionKeyMap['Invaders Host'])
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
  })

  it('should work with Stormcast1', () => {
    const parsedText = getFile('Stormcast1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.flavors).toEqual(['Anvils of the Heldenhammer'])
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
  })

  it('should work with Seraphon1', () => {
    const parsedText = getFile('Seraphon1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
  })

  it('should work with Wanderers1', () => {
    const parsedText = getFile('Wanderers1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(WANDERERS)
  })

  it('should work with Tzeentch1', () => {
    const parsedText = getFile('Tzeentch1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
  })

  it('should work with StD1', () => {
    const parsedText = getFile('StD1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
  })

  it('should work with Soulblight1', () => {
    const parsedText = getFile('Soulblight1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap.Soulblight)
  })

  it('should work with Nighthaunt1', () => {
    const parsedText = getFile('Nighthaunt1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
  })

  it('should work with LoS1', () => {
    const parsedText = getFile('LoS1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Legion of Sacrament'])
  })

  it('should work with GHoN1', () => {
    const parsedText = getFile('GHoN1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Grand Host of Nagash'])
  })

  it('should work with Stormcast2', () => {
    const parsedText = getFile('Stormcast2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.realmscape).toEqual('Hysh')
    expect(res.selections.flavors).toEqual([
      'Hammers of Sigmar',
      'Astral Templars',
      'Celestial Vindicators',
      'Tempest Lords',
    ])
  })

  it('should work with GHoN3', () => {
    const parsedText = getFile('GHoN3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Grand Host of Nagash'])
    expect(res.selections.units).toContain('Corpse Cart w/ Unholy Lodestone')
    expect(res.origin_realm).toEqual('Ghyran')
  })

  it('should work with LoB1', () => {
    const parsedText = getFile('LoB1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Legion of Blood'])
    expect(res.origin_realm).toEqual(null)
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
  })

  it('should work with Skaven2', () => {
    const parsedText = getFile('Skaven2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
  })

  it('should work with Skaven3', () => {
    const parsedText = getFile('Skaven3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
  })

  it('should work with Khorne4', () => {
    const parsedText = getFile('Khorne4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
  })

  it('should work with GHoN2', () => {
    const parsedText = getFile('GHoN2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGIONS_OF_NAGASH)
    expect(res.subFactionName).toEqual(LegionsOfNagashFaction.subFactionKeyMap['Grand Host of Nagash'])
  })

  it('should work with Fyreslayers', () => {
    const parsedText = getFile('Fyreslayers1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.origin_realm).toEqual(null)
    expect(res.selections.flavors).toEqual(['Hermdar'])
    expect(res.selections.scenery).toEqual(['Magmic Battleforge'])
  })

  it('should work with IDK3', () => {
    const parsedText = getFile('IDK3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.flavors).toEqual(['Dhom-Hain', 'Nautilar', "Mor'phann", 'Fuethan', 'Briomdar'])
  })

  it('should work with Gloomspite1', () => {
    const parsedText = getFile('Gloomspite1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.spells).toContain('Speed of the Spider God')
    expect(res.selections.spells).toContain('Venom of the Spider God')
    expect(res.selections.spells).toContain('Night Shroud')
  })

  it('should work with IDK1', () => {
    const parsedText = getFile('IDK1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
  })

  it('should work with Khorne1', () => {
    const parsedText = getFile('Khorne1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.origin_realm).toEqual('Ghur')
    expect(res.selections.scenery).toContain('Skull Altar')
    expect(res.allySelections).toEqual({
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
    ])
  })
})
