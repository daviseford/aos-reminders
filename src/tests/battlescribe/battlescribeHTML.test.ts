import { readFileSync } from 'fs'
import path from 'path'
import {
  BEASTS_OF_CHAOS,
  BIG_WAAAGH,
  BONESPLITTERZ,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GRAND_HOST_OF_NAGASH,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGION_OF_BLOOD,
  LEGION_OF_SACRAMENT,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  SOULBLIGHT,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TOMB_KINGS,
  TZEENTCH,
  WANDERERS,
  CHAOS_GRAND_ALLIANCE,
} from 'meta/factions'
import { getBattlescribeArmy } from 'utils/battlescribe/getBattlescribeArmy'
import { HYSH } from 'types/realmscapes'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/battlescribe/html/${filename}.html`), 'utf8')
}

describe('getBattlescribeArmy', () => {
  it('should work with CoS1', () => {
    const parsedText = getFile('CoS1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.allegiances).toEqual([
      'Greywater Fastness',
      'Anvilgard',
      'Hallowheart',
      'Hammerhal',
      'The Living City',
      'The Phoenicium',
      "Tempest's Eye",
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Nighthaunt3', () => {
    const parsedText = getFile('Nighthaunt3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([
      { severity: 'warn', text: 'Beguile' },
      {
        severity: 'ally-warn',
        text:
          'Allied Coven Throne can belong to Grand Host Of Nagash or Legion Of Blood or Legion Of Night or Legion Of Sacrament or Soulblight. Please add this unit manually.',
      },
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
    expect(res.errors).toEqual([])
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

    expect(res.factionName).toEqual(IRONJAWZ)
    expect(res.selections.allegiances).toEqual(['Da Choppas'])
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
      factionName: 'OGOR_MAWTRIBES',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Bloodgullet (Mawtribe)'],
        artifacts: ['Wizardflesh Apron', 'Splatter-cleaver'],
        battalions: ['Goremand'],
        commands: ['Bloodbath', 'Bellowing Voice'],
        endless_spells: [],
        scenery: [],
        spells: [
          'Arcane Bolt',
          'Fleshcrave Curse',
          'Mystic Shield',
          'Blood Feast',
          'Voracious Maw',
          'Rockchomper',
        ],
        traits: ["'Nice Drop of the Red Stuff!'"],
        triumphs: [],
        units: [
          'Butcher',
          'Frostlord on Stonehorn',
          'Frost Sabres',
          'Gnoblars',
          'Leadbelchers',
          'Ogor Gluttons',
          'Slaughtermaster',
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
    expect(res.selections.allegiances).toEqual(['Fuethan (Enclave)'])
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
        severity: 'warn',
        text: 'Wind of Chaos',
      },
    ])
  })

  it('should work with Ironjawz2', () => {
    const parsedText = getFile('Ironjawz2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IRONJAWZ)
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers4', () => {
    const parsedText = getFile('Fyreslayers4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.errors).toEqual([])
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
    expect(res.errors).toEqual([])
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
    expect(res.errors).toEqual([])
  })

  it('should work with Slaanesh3', () => {
    const parsedText = getFile('Slaanesh3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.origin_realm).toEqual('Ulgu')
    expect(res.errors).toEqual([])
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

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.allegiances).toEqual([])
    // Bonesplitterz Drakkfoot allegiance spell
    expect(res.errors).toEqual([{ text: 'Fireball', severity: 'warn' }])
  })

  it('should work with BigWaaagh1', () => {
    const parsedText = getFile('BigWaaagh1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.allegiances).toEqual([])
    // Bonesplitterz Drakkfoot allegiance spell
    expect(res.errors).toEqual([{ text: 'Fireball', severity: 'warn' }])
  })

  it('should work with DoK2', () => {
    const parsedText = getFile('DoK2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections.spells).toEqual(['Arcane Bolt', 'Mystic Shield', "Arnzipal's Black Horror"])
    expect(res.selections.allegiances).toEqual([
      'Hagg Nar (Temple)',
      'Draichi Ganeth (Temple)',
      'The Kraith (Temple)',
      'Khailebron (Temple)',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers2', () => {
    const parsedText = getFile('Fyreslayers2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.allegiances).toEqual([
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
    expect(res.errors).toEqual([])
  })

  it('should work with Stormcast4', () => {
    const parsedText = getFile('Stormcast4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.commands).toEqual([
      'Heroes of Another Age',
      'Cut off the Head',
      'Righteous Hatred',
      'Astral Conjunction',
      'Holy Crusaders',
      'Soul of the Stormhost',
      'No Mercy',
      'Rousing Oratory',
    ])
    expect(res.selections.allegiances).toEqual([
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
    expect(res.selections.allegiances).toEqual(['Invaders (Host)', 'Godseekers (Host)', 'Pretenders (Host)'])
    expect(res.errors).toEqual([])
  })

  it('should work with Khorne3', () => {
    const parsedText = getFile('Khorne3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.allegiances).toEqual([
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
    expect(res.selections.allegiances).toEqual(['Anvils of the Heldenhammer (Stormhost)'])
    expect(res.errors).toEqual([
      { text: "Blacktalon's Shadowhammers", severity: 'warn' },
      { text: 'Warrior Brotherhood', severity: 'warn' },
    ])
  })

  it('should work with Gloomspite2', () => {
    const parsedText = getFile('Gloomspite2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.commands).toEqual(['Instinctive Leader'])
    expect(res.selections.spells).toEqual([
      'Arcane Bolt',
      'Mystic Shield',
      'The Great Green Spite',
      'Spore Maws',
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
    expect(res.errors).toEqual([])
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
    expect(res.errors).toEqual([])
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

    expect(res.factionName).toEqual(SOULBLIGHT)
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
    expect(res.selections.commands).toEqual(['Call to Battle', 'Heed the Spirit-song'])
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

    expect(res.factionName).toEqual(LEGION_OF_SACRAMENT)
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

    expect(res.factionName).toEqual(GRAND_HOST_OF_NAGASH)
    // @ts-ignore
    expect(res.allySelections[NIGHTHAUNT].battalions).toEqual(['Shrieker Host'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: '*COURT OF NULAHMIA',
      },
    ])
  })

  it('should work with Stormcast2', () => {
    const parsedText = getFile('Stormcast2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.realmscape).toEqual(HYSH)
    expect(res.selections.allegiances).toEqual([
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

    expect(res.factionName).toEqual(GRAND_HOST_OF_NAGASH)
    expect(res.selections.units).toContain('Corpse Cart w/ Unholy Lodestone')
    expect(res.origin_realm).toEqual('Ghyran')
    expect(res.errors).toEqual([])
  })

  it('should work with LoB1', () => {
    const parsedText = getFile('LoB1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(LEGION_OF_BLOOD)
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
      errors: [],
      realmscape_feature: null,
      realmscape: 'Ghyran',
      unknownSelections: [],
      factionName: 'BEASTS_OF_CHAOS',
      origin_realm: 'Aqshy',
      selections: {
        allegiances: [],
        artifacts: [
          'Bleating Gnarlstaff (Brayherds)',
          "Ignax's Scales (Aqshy)",
          'Ruby Ring (Aqshy)',
          'Crown of Flames (Aqshy)',
          'Glyph-etched Talisman (Warherds)',
          'Magmaforged Blade (Aqshy)',
          'Onyx Blade (Aqshy)',
          'Smouldering Helm (Aqshy)',
          'Thunderstrike Lodestone (Thunderscorn)',
          'Volcanic Axe (Brayherds)',
        ],
        battalions: ['Depraved Drove', 'Marauding Brayherd'],
        commands: ['Grisly Trophy', "Slaughterer's Call"],
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
          'Thunderwave (Thunderscorn Wizard)',
          'Vicious Stranglethorns (Brayherd Wizard)',
          'Summon Lightning',
          'Devolve',
          'Boon of Mutation',
        ],
        traits: [],
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
    expect(res.selections.allegiances).toEqual(['Gristlegore (Grand Court)'])
    expect(res.selections.artifacts).toEqual([
      'The Grim Garland (Royal Treasury)',
      'The Dermal Robe (Royal Treasury)',
      'Carrion Wand (Noble Heirlooms)',
      'Blood-river Chalice (Royal Treasury)',
      'Ghurish Mawshard',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Dok', () => {
    const parsedText = getFile('Dok1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections).toEqual({
      allegiances: ['Hagg Nar (Temple)'],
      artifacts: [
        "Ignax's Scales (Aqshy)",
        'Ruby Ring (Aqshy)',
        'Rune of Ulgu (Wizard)',
        'Thousand and One Dark Blessings',
        'Cursed Blade',
        'Purefire Brazier (Aqshy)',
        'The Mirror Glaive (Wizard)',
        'Thermalrider Cloak (Aqshy)',
        'Crone Blade',
        'Smouldering Helm (Aqshy)',
        'Khainite Pendant (Priest)',
        'Magmadroth Blood Vials (Aqshy)',
      ],
      battalions: ['Cauldron Guard', 'Shadowhammer Compact', 'Temple Nest'],
      commands: ['Worship Through Bloodshed', 'Orgy of Slaughter'],
      endless_spells: ['Emerald Lifeswarm', 'Quicksilver Swords', 'Soulsnare Shackles'],
      scenery: [],
      spells: [
        'Arcane Bolt',
        'Mystic Shield',
        'The Withering (Wizard)',
        'Enfeebling Foe',
        "Arnzipal's Black Horror",
        'Doomfire',
      ],
      traits: ['Devoted Disciples'],
      triumphs: [],
      units: [
        'Bloodwrack Medusa',
        'Bloodwrack Shrine',
        'Hag Queen',
        'Hag Queen on Cauldron of Blood',
        'Morathi, High Oracle of Khaine',
        'Morathi, the Shadow Queen',
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
      ],
    })
    expect(res.errors).toEqual([])
  })

  it('should work with Skaven2', () => {
    const parsedText = getFile('Skaven2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.errors).toEqual([])
  })

  it('should work with Skaven3', () => {
    const parsedText = getFile('Skaven3')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.errors).toEqual([])
  })

  it('should work with Khorne4', () => {
    const parsedText = getFile('Khorne4')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([])
  })

  it('should work with BigWaaagh2', () => {
    const parsedText = getFile('BigWaaagh2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections.spells).toContain("Mighty 'Eadbutt (Ironjawz)")
    // Bonesplitterz Drakkfoot allegiance spell
    expect(res.errors).toEqual([{ text: 'Fireball', severity: 'warn' }])
  })

  it('should work with GHoN2', () => {
    const parsedText = getFile('GHoN2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GRAND_HOST_OF_NAGASH)
    expect(res.errors).toEqual([{ severity: 'warn', text: 'Beacon of Nagashizzar' }])
  })

  it('should work with Fyreslayers', () => {
    const parsedText = getFile('Fyreslayers1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.origin_realm).toEqual(null)
    expect(res.selections.allegiances).toEqual(['Hermdar (Lodge)'])
    expect(res.selections.scenery).toEqual(['Magmic Battleforge'])
    expect(res.errors).toEqual([])
  })

  it('should work with Khorne2', () => {
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
    expect(res.selections.allegiances).toEqual([
      'Dhom Hain (Enclave)',
      'Nautilar (Enclave)',
      "Mor'phann (Enclave)",
      'Fuethan (Enclave)',
      'Briomdar (Enclave)',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Bonesplitterz1', () => {
    const parsedText = getFile('Bonesplitterz1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(BONESPLITTERZ)
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
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with KO2', () => {
    const parsedText = getFile('KO2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.allegiances).toEqual([
      'Barak-Nar, City of the First Sunrise (Skyport)',
      'Endless Skies (Custom Skyport)',
      'Barak-Mhornar, City of Shadow (Skyport)',
    ])
    expect(res.selections.endless_spells).toEqual(['Lauchon the Soulseeker'])
    expect(res.selections.traits).toEqual([
      'ARTYCLE: Respect Your Commanders',
      'AMENDMENT: Trust Aethermatics, Not Superstition',
      'AMENDMENT: Prosecute Wars With All Haste',
      'ARTYCLE: Seek New Prospects',
      'FOOTNOTE: Through Knowledge, Power',
      'Champion of Progress',
      'FOOTNOTE: Who Strikes First, Strikes Hardest',
      'Opportunistic Privateers',
    ])
    expect(res.selections.scenery).toEqual(['Penumbral Engine'])
    expect(res.errors).toEqual([])
  })

  it('should work with KO1', () => {
    const parsedText = getFile('KO1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.allegiances).toEqual(['Barak-Urbaz, The Market City (Skyport)'])
    expect(res.selections.commands).toEqual([
      'Invoke the Code',
      'Invoke the Code - Lead by Example',
      'Invoke the Code - Look out for the Boss',
      'Invoke the Code - Talk Softly, Carry a Big Hammer',
      'First Rule of Grungsson',
    ])
    expect(res.selections.endless_spells).toEqual(['Geminids of Uhl-Gysh', 'Shards of Valagharr'])
    expect(res.selections.traits).toEqual([
      'AMENDMENT: Always Take What You Are Owed',
      'ARTYCLE: Seek New Prospects',
      "FOOTNOTE: Where There's War, There's Gold",
    ])
    expect(res.selections.units).toEqual([
      'Aether-Khemist',
      'Aetheric Navigator',
      'Arkanaut Admiral',
      'Bjorgen Thundrik',
      'Brokk Grungsson, Lord-Magnate of Barak-Nar',
      'Endrinmaster',
      'Arkanaut Frigate',
      'Arkanaut Ironclad',
      'Grundstok Gunhauler',
      'Arkanaut Company',
      'Endrinriggers',
      'Grundstok Thunderers',
      'Skywardens',
      "Thundrik's Profiteers",
    ])
    expect(res.selections.battalions).toEqual([
      'Aetherstrike Force',
      'Grand Armada',
      'Grundstok Escort Wing',
      'Iron Sky Command',
      'Iron Sky Squadron',
    ])
    expect(res.selections.artifacts).toEqual([
      'Aethersight Loupe (SKY-PORT TREASURE)',
      "Gattlesson's Endless Repeater (AETHERMATIC WEAPON)",
      'Ghyrropian Gauntlets (Ghyran)',
      'The Sunderblade (Ghyran)',
      'Jade Diadem (Ghyran)',
      'Greenglade Flask (Ghyran)',
      'Staff of Ocular Optimisation (AETHERMATIC WEAPON)',
      'Malefic Skymines (GREAT ENDRINWORK)',
      'The Last Word (GREAT ENDRINWORK)',
      'Prudency Chutes (GREAT ENDRINWORK)',
    ])
    expect(res.errors).toEqual([])
  })

  it('should work with Sylvaneth2', () => {
    const parsedText = getFile('Sylvaneth2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SYLVANETH)
    expect(res.selections.allegiances).toEqual(['Winterleaf (Glade)'])
    expect(res.selections.artifacts).toEqual(['Spiritsong Stave', 'Frozen Kernel'])
    expect(res.selections.battalions).toEqual(['Outcasts'])
    expect(res.selections.commands).toEqual(['Branch Blizzard', 'Call to Battle', 'Heed the Spirit-song'])
    expect(res.selections.scenery).toEqual(['Awakened Wyldwood'])
    expect(res.selections.spells).toEqual([
      'Arcane Bolt',
      'Mystic Shield',
      'Verdant Blessing',
      'Roused to Wrath',
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

  it('should work with Seraphon2', () => {
    const parsedText = getFile('Seraphon2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.allyFactionNames).toEqual([STORMCAST_ETERNALS])
    expect(res.errors).toEqual([{ text: "Klaq-Tor's Talons", severity: 'warn' }])
    expect(res.allySelections).toEqual({
      STORMCAST_ETERNALS: {
        battalions: ['Lightning Echelon', 'Skyborne Slayers'],
        units: [
          'Drakesworn Templar',
          'Knight-Zephyros',
          'Celestar Ballista',
          'Protectors',
          'Vanguard-Raptors with Hurricane Crossbows',
        ],
      },
    })
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: ['Blade of Realities', 'Light of Dracothion', 'Coronal Shield'],
      battalions: ["Dracothion's Tail"],
      commands: ['Impeccable Foresight', 'Ancient Warlord', 'Saurian Savagery'],
      endless_spells: [],
      scenery: [],
      spells: ['Arcane Bolt', 'Celestial Deliverance', 'Claws of Glory', "Comet's Call", 'Mystic Shield'],
      traits: [],
      triumphs: [],
      units: [
        'Engine of the Gods',
        'Lord Kroak',
        'Saurus Astrolith Bearer',
        'Skink Priest w/ Cloak of Feathers',
        'Bastiladon w/ Ark of Sotek',
        'Stegadon w/ Skystreak Bow',
        'Razordons',
        'Salamanders',
        'Saurus Guard',
        'Saurus Knights',
        'Skinks',
        'Chameleon Skinks',
        'Kroxigor',
        'Ripperdactyl Riders',
        'Skink Handlers',
        'Terradon Riders',
        'Saurus Oldblood on Carnosaur',
        'Saurus Scar-Veteran on Carnosaur',
      ],
    })
  })
})
