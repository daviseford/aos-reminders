const CREATED_BY_WARHAMMER_APP = 'Created with Warhammer Age of Sigmar: The App'

export const warhammerAppPlaceholders = {
  ALLY_SUFFIX: ' (ALLY)',
  ARMY_NAME_PREFIX: 'Army Name: ',
  ARMY_NOTES_PREFIX: 'Army Notes: ',
  ARTIFACTS_PREFIX: 'Artefacts: ',
  BATTALIONS: '---BATTALIONS---',
  COMMAND_TRAITS_PREFIX: 'Command Traits: ',
  CREATED_BY_WARHAMMER_APP,
  END_OF_ENTRY: '---END_OF_ENTRY---',
  END_OF_LIST: '---END_OF_LIST---',
  ENDLESS_SPELLS: '---ENDLESS_SPELLS---',
  ENHANCEMENTS: '---ENHANCEMENTS---',
  FACTION_NAME_PREFIX: 'FACTION_NAME: ',
  FLAVOR_PREFIX: 'FLAVOR: ',
  GRAND_STRATEGY_PREFIX: 'Grand Strategy: ',
  INVALID_LIST: `Invalid: ${CREATED_BY_WARHAMMER_APP}`,
  MOUNT_TRAITS_PREFIX: 'Mount Traits: ',
  PRAYERS_PREFIX: 'Prayers: ',
  SCENERY: '---SCENERY---',
  SPELLS_PREFIX: 'Spells: ',
  SUBFACTION_PREFIX: 'SUBFACTION: ',
  TRIUMPHS_PREFIX: 'Triumphs: ',
  UNITS: '---UNITS---',
  VALID_LIST: `Valid: ${CREATED_BY_WARHAMMER_APP}`,
} as const

export const cleanWarhammerAppText = (text: string): string[] => {
  const pass1 = text.split('\n').map(txt =>
    txt
      .replace(/[‘’]/g, `'`) // Replace special quotes
      .replace(/[“”]/g, `"`) // Replace special quotes
      .replace(/[‑–—]/g, `-`) // Replace special dashes
      .replace(/ /g, ` `) // Remove non ASCII-spaces

      // Replace special characters
      .replace(/ú/, 'u')
      .replace(/á/, 'a')

      // Mark our units for later use
      .replace(/^(Units|BATTLELINE|LEADERS|OTHER|BEHEMOTH|LEADER)$/g, warhammerAppPlaceholders.UNITS)

      .trim()
  )

  let pastBeginningSection = false
  const pass2 = pass1.map(x => {
    if (x === warhammerAppPlaceholders.UNITS) {
      pastBeginningSection = true
      return x
    }
    return pastBeginningSection ? x : x.replace(/^- /g, '')
  })

  // Remove unnecessary info
  const pass3 = pass2
    .map(txt =>
      txt
        .replace(/ \(General\)$/g, '') // Remove General tag e.g. "Lord Kroak (General)" -> "Lord Kroak"
        .replace(/^- General$/g, '') // Remove General entry
        .replace(/^General$/g, '') // Remove General entry
        .replace(/^Triumps: /g, warhammerAppPlaceholders.TRIUMPHS_PREFIX) // fix a typo
        .replace(
          /^(Army Notes|General|Battle Trait Bonus|Reinforced|Battlefield Role|Battlepack|Points Limit|Battalion Slot Filled): .+/g,
          ''
        )
        .replace(/^Mark of Chaos: .+/g, '') // Remove Mark of Chaos tag e.g. "Mark of Chaos: Khorne"
        .replace(/^Host Option: .+/g, '') // Remove Host Option tag e.g. "Host Option: General"
        .replace(/\*+$/g, '') // Remove asterik suffixes
        .replace(/^\*+/g, '') // Remove asterik prefixes e.g. "**Bosses of the Stomp - Unified"
        .replace(/^[0-9]+ x /g, '') // Remove quantity from units e.g. "3 x Razordons"
        .replace(/ \([0-9]+\)$/g, '') // Remove point values e.g. "Slann Starmaster (360)"
        .replace(/^-(\w)/g, `- $1`) //  Replace non-spaced list dash e.g. "-Warlord"

        // Replace text with standardized endings
        .replace(/^Points Cost: .+/g, warhammerAppPlaceholders.END_OF_ENTRY) // Replace "Points Cost: 430 pts" with a constant separator (helps to mark the end of a unit entry)
        .replace(/^(Total Points|TOTAL POINTS): .+/g, warhammerAppPlaceholders.END_OF_LIST) // Replace "Total Points: 2000 pts" with a constant separator (helps to mark the end of a list)
        .replace('Endless Spells/Invocations', warhammerAppPlaceholders.ENDLESS_SPELLS)
        .replace(/^ENDLESS SPELLS & INVOCATIONS/g, warhammerAppPlaceholders.ENDLESS_SPELLS)
        .replace(/^(ENDLESS SPELL|INVOCATION)$/g, warhammerAppPlaceholders.ENDLESS_SPELLS)
        .replace(/^(Core Battalions|CORE BATTALIONS|CORE BATTALIONS:)$/g, warhammerAppPlaceholders.BATTALIONS)
        .replace(/^Enhancements$/g, warhammerAppPlaceholders.ENHANCEMENTS)
        .replace(/^(Faction Terrain|TERRAIN)$/g, warhammerAppPlaceholders.SCENERY)
        .replace(
          /^(Units|BATTLELINE|LEADERS|OTHER|BEHEMOTH|ARTILLERY|LEADER)$/g,
          warhammerAppPlaceholders.UNITS
        )
        .replace(/^Army Faction: /g, warhammerAppPlaceholders.FACTION_NAME_PREFIX)
        .replace(/^Army Type: /g, warhammerAppPlaceholders.SUBFACTION_PREFIX) // Army Type in WH App === Subfactions in AoSr
        .replace(/^(Subfaction|Army Subfaction): /g, warhammerAppPlaceholders.FLAVOR_PREFIX) // Subfactions in WH App === Flavors in AoSr
        .replace(/ \(Coalition Ally\)$/g, warhammerAppPlaceholders.ALLY_SUFFIX) // Mark Allies appropriately
        .replace(/ \(Ally\)$/g, warhammerAppPlaceholders.ALLY_SUFFIX) // Mark Allies appropriately
        .replace(/^Artefacts of Power: /g, warhammerAppPlaceholders.ARTIFACTS_PREFIX)
        .replace(/^Grand Strategies: /, warhammerAppPlaceholders.GRAND_STRATEGY_PREFIX)

        // Faction specific and/or special prefixes go here
        .replace(/^Great Endrinworks: /g, warhammerAppPlaceholders.ARTIFACTS_PREFIX)
        .replace(/^Cursed Mutations: /g, warhammerAppPlaceholders.MOUNT_TRAITS_PREFIX)
        .replace(/^Drakeblood Curses: /g, warhammerAppPlaceholders.COMMAND_TRAITS_PREFIX)
        .replace(/^Seasons of War: /g, warhammerAppPlaceholders.SUBFACTION_PREFIX)

        // One final trim, and we're done!
        .trim()
    )
    .filter(txt => txt && txt.length > 2)

  const validPrefixes = Object.values(warhammerAppPlaceholders)
  // Remove weapon/unit equipment options that are irrelevant for us
  const pass4 = pass3
    .filter(x => {
      if (x.startsWith('- ')) {
        return validPrefixes.some(prefix => x.startsWith(`- ${prefix}`))
      }
      return true
    })
    .map(x => x.replace(/^- /, '').trim())

  return pass4
}
