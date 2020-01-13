import { readFileSync } from 'fs'
import path from 'path'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'
import {
  BEASTS_OF_CHAOS,
  BIG_WAAAGH,
  BONESPLITTERZ,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DEATH_GRAND_ALLIANCE,
  DESTRUCTION_GRAND_ALLIANCE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  GREENSKINZ,
  IRONJAWZ,
  KHORNE,
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

describe('getWarscrollArmyFromPdf', () => {
  it('should not work with The Choir of Torments battalion (not in current book)', () => {
    const parsedText = getFile('1578184338167-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'warn',
        text: 'The Choir of Torments',
      },
    ])
  })

  it("should not work with Everwinter's Master trait (not in book)", () => {
    const parsedText = getFile('1578192442310-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'warn',
        text: "Everwinter's Master",
      },
    ])
  })

  it('should work with Greenskinz', () => {
    const parsedText = getFile('1578518862312-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.factionName).toEqual(GREENSKINZ)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should not work with Stormcast/Nighthaunt mix', () => {
    const parsedText = getFile('1578691480138-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.errors).toEqual([
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
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.artifacts).toContain('The Blood-forged Armour')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Vitriolic Spray (Anvilgard)', () => {
    const parsedText = getFile('1577866703167-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.spells).toContain('Vitriolic Spray (Anvilgard)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Amethyst Glow/Dread Withering trait/spell', () => {
    const parsedText = getFile('1577088536258-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.traits).toContain('Amethyst Glow')
    expect(warscrollTxt.selections.spells).toContain('Dread Withering')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with legacy Wood Elf warscrolls', () => {
    const parsedText = getFile('1577400809137-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Darkling Covens', () => {
    const parsedText = getFile('1577400907052-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    // We convert Darkling Covens to Cities of Sigmar
    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with legacy High Elf warscrolls', () => {
    const parsedText = getFile('1577741192555-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.units).toContain('Highborn Repeater Bolt Thrower')
    expect(warscrollTxt.selections.units).toContain('Highborn Archers')
    expect(warscrollTxt.selections.units).toContain('Loremaster')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with The Fleshform Raiment (Noble Heirlooms)', () => {
    const parsedText = getFile('1576858425499-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.artifacts).toContain('The Fleshform Raiment (Noble Heirlooms)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Guardian of Souls and Chaos allegiance', () => {
    const parsedText = getFile('1574504452431-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CHAOS_GRAND_ALLIANCE)
    // Guardian of Souls is a DEATH unit...
    expect(warscrollTxt.errors).toEqual([{ severity: 'warn', text: 'Guardian of Souls' }])
  })

  it('should work with Chaos Hellcannon', () => {
    const parsedText = getFile('1574545285739-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CHAOS_GRAND_ALLIANCE)
    expect(warscrollTxt.selections.units).toEqual([
      'Chaos Lord on Daemonic Mount',
      'Gaunt Summoner of Tzeentch',
      'Chaos Chosen',
      'Chaos Warriors',
      'Varanguard',
      'Tuskgor Chariots',
      'Hellcannon',
    ])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Warcry scrolls', () => {
    const parsedText = getFile('1574613461286-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(warscrollTxt.selections.units).toEqual([
      'Archaon the Everchosen',
      'Darkoath Warqueen',
      'Chaos Sorcerer Lord on Manticore',
      'Varanguard',
      'Untamed Beasts',
      'Cypher Lords',
      'Iron Golems',
    ])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should (not) work with The Wraith Fleet', () => {
    const parsedText = getFile('1576230943609-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'error',
        text: 'The Wraith Fleet are not supported.',
      },
    ])
  })

  it('should work with Master of Defense', () => {
    const parsedText = getFile('1576328165962-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.traits).toContain('Master of Defence (Order)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Berzerker Lord', () => {
    const parsedText = getFile('1576328837058-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.traits).toContain('Berserker Lord (Mortal)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with 3*+ formatting', () => {
    const parsedText = getFile('1576364961328-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with The Gorechosen', () => {
    const parsedText = getFile('1576418593609-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.battalions).toContain('Gorechosen')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Lord of Chaos', () => {
    const parsedText = getFile('1576448761220-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'warn',
        text: 'Lord of Chaos', // Deprecated post-dec2019
      },
    ])
  })

  it('should work with Slaves to Darkness Chaos Spawn', () => {
    const parsedText = getFile('1576493074441-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.units).toContain('Chaos Spawn')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Slaves to Darkness Daemon Prince ', () => {
    const parsedText = getFile('1576502239768-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)
    expect(warscrollTxt.selections.units).toContain('Daemon Prince')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Warcry scrolls', () => {
    const parsedText = getFile('1574613528170-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1576047037925-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Corvus Cabal', () => {
    const parsedText = getFile('1576093463575-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(TZEENTCH)
    expect(warscrollTxt.allySelections[SLAVES_TO_DARKNESS]).toEqual({
      battalions: [],
      units: ['Corvus Cabal'],
    })
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Hailstorm Battery (SCE battalion)', () => {
    const parsedText = getFile('1574638101530-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.allySelections).toEqual({
      [STORMCAST_ETERNALS]: {
        battalions: ['Hailstorm Battery'],
        units: [],
      },
    })
    expect(warscrollTxt.origin_realm).toEqual(null)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Dabblings in Sorcery (Anvilgard Battle Trait)', () => {
    const parsedText = getFile('1576513040341-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.traits).toContain('Dabblings in Sorcery (Anvilgard Battle Trait)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1574686232621-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OGOR_MAWTRIBES)
    expect(warscrollTxt.origin_realm).toEqual(GHUR)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with The Brazen Rune', () => {
    const parsedText = getFile('1576533398655-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(KHORNE)
    expect(warscrollTxt.selections.artifacts).toContain('The Brazen Rune')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with The Dolorous Guard and The Forgotten Scions', () => {
    const parsedText = getFile('1576527400569-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(NIGHTHAUNT)
    expect(warscrollTxt.origin_realm).toEqual(HYSH)
    expect(warscrollTxt.selections.battalions).toEqual([
      'The Forgotten Scions',
      'The Dolorous Guard',
      'The Condemned',
    ])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1575078564630-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.origin_realm).toEqual(AQSHY)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Mark of Chaos and Scroll of Dark Unravelling', () => {
    const parsedText = getFile('1576681454336-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(warscrollTxt.origin_realm).toEqual(ULGU)

    expect(warscrollTxt.selections).toEqual({
      allegiances: ['Cabalists'],
      artifacts: ['Spellmirror (Ulgu)', 'Scroll of Dark Unravelling (Cabalists)', 'Soul Feeder (Cabalists)'],
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
      traits: ['Mighty Ritualist (Cabalists)', 'Bolstered by Hate (Ravagers, Cabalists, Despoilers)'],
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

    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Nurgle and a Skaven battalion', () => {
    const parsedText = getFile('1575286599238-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(NURGLE)
    expect(warscrollTxt.allySelections).toEqual({
      [SKAVEN]: { battalions: ['Congregation of Filth'], units: [] },
    })
    expect(warscrollTxt.origin_realm).toEqual(HYSH)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1574746733739-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.origin_realm).toEqual(null)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Vokmortians Retinue', () => {
    const parsedText = getFile('1573791319612-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.selections.battalions).toContain("Vokmortian's Retinue")
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Vokmortians Retinue', () => {
    const parsedText = getFile('1574249013027-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.selections.battalions).toContain("Vokmortian's Retinue")
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with One with Fire and Ice trait/spell', () => {
    const parsedText = getFile('1574356951165-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.traits).toContain('One with Fire and Ice (The Phoenicium)')
    expect(warscrollTxt.selections.spells).toContain('Golden Mist (The Phoenicium)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Ironjawz', () => {
    const parsedText = getFile('1574391649028-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(IRONJAWZ)
    expect(warscrollTxt.selections.allegiances).toContain('Ironsunz')
    expect(warscrollTxt.errors).toEqual([])
  })
  it('should work with OBR', () => {
    const parsedText = getFile('1574207831990-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with random Death artifacts/traits', () => {
    const parsedText = getFile('1573865086310-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(DEATH_GRAND_ALLIANCE)
    // I am not sure what these are tbh
    expect(warscrollTxt.errors).toEqual([
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
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections.units).toContain('Orruk Great Shaman')
    expect(warscrollTxt.errors).toEqual([])
  })
  it('should work with Fyreslayers', () => {
    const parsedText = getFile('1573446762118-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Fyreslayers', () => {
    const parsedText = getFile('1573484994551-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Great-Bray Shaman', () => {
    const parsedText = getFile('1573340651447-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BEASTS_OF_CHAOS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Beastclaw Raiders (legacy, recognize as Ogor Mawtribes)', () => {
    const parsedText = getFile('1573387764362-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OGOR_MAWTRIBES)
    expect(warscrollTxt.errors).toEqual([{ severity: 'warn', text: 'Massive Bulk' }])
  })

  it('should work with Vosaxe', () => {
    const parsedText = getFile('1573252116567-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.selections.artifacts).toContain('Vosaxe')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Lore of the Phoenix', () => {
    const parsedText = getFile('1573254186379-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.errors).toEqual([])
  })
  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1573208101434-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OGOR_MAWTRIBES)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Arch-Sorcerer', () => {
    const parsedText = getFile('1573145524404-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(TZEENTCH)
    expect(warscrollTxt.selections.traits).toEqual(['Arch-sorcerer'])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Big Rukk', () => {
    const parsedText = getFile('1573144291799-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.selections.battalions).toEqual(['Big Rukk', 'Brutal Rukk', 'Kop Rukk', 'Teef Rukk'])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Armour of Silvered Sigmarite (pt 2)', () => {
    const parsedText = getFile('1573174872898-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.selections.artifacts).toContain('Armour of Silvered Sigmarite')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Armour of Silvered Sigmarite (pt 1)', () => {
    const parsedText = getFile('1573172812429-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.selections.artifacts).toEqual(['Strife-ender', 'Armour of Silvered Sigmarite'])
    expect(warscrollTxt.selections.battalions).toEqual(['Cleansing Phalanx'])
    expect(warscrollTxt.selections.traits).toEqual(['Staunch Defender', 'Lithe-Limbed'])
    expect(warscrollTxt.selections.spells).toEqual([
      'Azyrite Halo',
      'Translocation',
      'Celestial Blades',
      'Terrifying Aspect',
      'Healing Light',
      'Empower',
    ])
    expect(warscrollTxt.selections.units).toEqual([
      'Lord-Celestant',
      'Lord-Relictor',
      'Lord-Arcanum on Gryph-Charger',
      'Judicators',
      'Sequitors',
      'Evocators',
      'Evocators on Celestial Dracolines',
      'Prosecutors with Celestial Hammers',
    ])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with SCE', () => {
    const parsedText = getFile('1573142427791-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it("should work with Burstin' with Power", () => {
    const parsedText = getFile('1573012088615-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections.traits).toContain("Burstin' with Power (Ironjawz)")
    expect(warscrollTxt.errors).toEqual([])
  })

  it("should work with Burstin' with Power", () => {
    const parsedText = getFile('1573018890027-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections.traits).toContain("Burstin' with Power (Ironjawz)")
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1573020637936-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OGOR_MAWTRIBES)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Ogor Mawtribes', () => {
    const parsedText = getFile('1573045302823-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OGOR_MAWTRIBES)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Mirrorshield', () => {
    const parsedText = getFile('1572905242205-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.selections.artifacts).toContain('Mirrorshield')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with OBR', () => {
    const parsedText = getFile('1572884424770-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Vokmortian', () => {
    const parsedText = getFile('1572873152220-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Druid of the Everspring', () => {
    const parsedText = getFile('1572871747455-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.traits).toContain('Druid of the Everspring (Living City)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Ogor Gluttons', () => {
    const parsedText = getFile('1572868206060-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OGOR_MAWTRIBES)
    expect(warscrollTxt.selections.units).toContain('Ogor Gluttons')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with CoS', () => {
    const parsedText = getFile('1572858808157-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with FEC', () => {
    const parsedText = getFile('1572735282204-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Enrapturing Circlet', () => {
    const parsedText = getFile('1572660547365-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SLAANESH)
    expect(warscrollTxt.selections.artifacts).toContain('Enrapturing Circlet (Godseekers Host)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Flaypelt Cloak', () => {
    const parsedText = getFile('1572694928061-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    expect(warscrollTxt.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Flaypelt Cloak (part 2)', () => {
    const parsedText = getFile('1572695046339-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    expect(warscrollTxt.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Warpcog Convocation', () => {
    const parsedText = getFile('1571895994578-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    expect(warscrollTxt.selections.battalions).toEqual([
      'Warpcog Convocation',
      'Arkhspark Voltik (Enginecoven)',
      'Rattlegauge Warplock (Enginecoven)',
    ])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Dark Wizardry', () => {
    const parsedText = getFile('1572497009675-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.selections.traits).toContain('Dark Wizardry (Royalty)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Blade of Endless Bloodshed', () => {
    const parsedText = getFile('1571896391287-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(KHORNE)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Windthief Charm', () => {
    const parsedText = getFile('1572003972006-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(TZEENTCH)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Hammers of Augury', () => {
    const parsedText = getFile('1572043447588-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Destroyer of Foes', () => {
    const parsedText = getFile('1572123301755-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Bonesplitterz spells', () => {
    const parsedText = getFile('1572206506395-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with legacy Order units', () => {
    const parsedText = getFile('1572245593799-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'warn',
        text: 'Archmage',
      },
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
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.selections.endless_spells).toContain('Everblaze Comet')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Horn of the Consort', () => {
    const parsedText = getFile('1571520651334-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SYLVANETH)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections.artifacts).toEqual(['Horn of the Consort'])
  })

  it('should work with Ironjawz allied with Gloomspite Gitz', () => {
    const parsedText = getFile('1571425644480-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(IRONJAWZ)
    expect(warscrollTxt.selections.artifacts).toEqual(["Metalrippa's Klaw", 'Thermalrider Cloak (Aqshy)'])
    expect(warscrollTxt.allyFactionNames).toEqual([BONESPLITTERZ, GLOOMSPITE_GITZ])
    expect(warscrollTxt.allySelections).toEqual({
      BONESPLITTERZ: { battalions: [], units: ['Wurrgog Prophet'] },
      GLOOMSPITE_GITZ: { battalions: [], units: ['Fungoid Cave-Shaman'] },
    })
    expect(warscrollTxt.selections.units).toEqual([
      'Megaboss on Maw-Krusha',
      'Orruk Megaboss',
      'Orruk Warchanter',
      'Orruk Ardboys',
      'Orruk Brutes',
      'Orruk Gore-gruntas',
    ])
    expect(warscrollTxt.selections.endless_spells).toContain('Scuttletide')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Bonesplitterz', () => {
    const parsedText = getFile('1571329765256-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Grundstock Thunderers', () => {
    const parsedText = getFile('1571347470427-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.units).toContain('Grundstok Thunderers')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Horribly Resilient typo', () => {
    const parsedText = getFile('1571263525536-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Anointed on Frostheart Phoenix', () => {
    const parsedText = getFile('1571285206236-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.units).toContain('Anointed on Frostheart Phoenix')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Firebelly', () => {
    const parsedText = getFile('1571287948786-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(DESTRUCTION_GRAND_ALLIANCE)
    expect(warscrollTxt.selections.units).toContain('Firebelly')
    expect(warscrollTxt.errors).toEqual([])
  })

  it("should work with Bonesplitterz Burnin' Tattooz", () => {
    const parsedText = getFile('1571240331862-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.selections.allegiances).toEqual(['Drakkfoot Clan'])
    expect(warscrollTxt.selections.artifacts).toEqual(["Burnin' Tattooz"])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571220408099-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.spells).toContain('Vitriolic Spray (Anvilgard)')
    expect(warscrollTxt.selections.traits).toContain('Secretive Warlock (Anvilgard)')
    expect(warscrollTxt.selections.units).toContain('Knight-Azyros')
    expect(warscrollTxt.selections.units).toContain('Prosecutors with Celestial Hammers')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571233444845-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with FEC Command Traits', () => {
    const parsedText = getFile('1571084621521-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.selections.traits).toEqual(['The Feast Day (Delusion)', 'Dark Acolyte (Nobility)'])
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.unknownSelections).toEqual([])
  })

  it('should work with The Grand Fyrd of Furios Peak', () => {
    const parsedText = getFile('1571131908806-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections.battalions).toEqual([
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
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571165179317-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections.units).toContain('Orruk Warboss')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571171962804-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections.units).toContain('Orruk Warboss')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should figure out allies from context clues', () => {
    const parsedText = getFile('1571040089053-Warscroll_Builder')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt).toEqual({
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
