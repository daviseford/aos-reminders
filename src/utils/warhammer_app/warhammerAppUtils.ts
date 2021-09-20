const CREATED_BY_WARHAMMER_APP = 'Created with Warhammer Age of Sigmar: The App'

export const warhammerAppPlaceholders = {
  ALLY_SUFFIX: ' (Ally)',
  ARMY_NAME_PREFIX: 'Army Name: ',
  ARMY_NOTES_PREFIX: 'Army Notes: ',
  ARTIFACTS_PREFIX: 'Artefacts of Power: ',
  BATTALIONS: '---BATTALIONS---',
  COMMAND_TRAITS_PREFIX: 'Command Traits: ',
  CREATED_BY_WARHAMMER_APP,
  END_OF_ENTRY: '---END_OF_ENTRY---',
  END_OF_LIST: '---END_OF_LIST---',
  ENDLESS_SPELLS: '---ENDLESS_SPELLS---',
  ENHANCEMENTS: '---ENHANCEMENTS---',
  FACTION_NAME_PREFIX: 'FACTION_NAME: ',
  FLAVOR_PREFIX: 'FLAVOR: ',
  GRAND_STRATEGIES_PREFIX: 'Grand Strategies: ',
  INVALID_LIST: `Invalid: ${CREATED_BY_WARHAMMER_APP}`,
  MOUNT_TRAITS_PREFIX: 'Mount Traits: ',
  PRAYERS_PREFIX: 'Prayers: ',
  SCENERY: '---SCENERY---',
  SPELLS_PREFIX: 'Spells: ',
  SUBFACTION_PREFIX: 'SUBFACTION: ',
  TRIUMPHS_PREFIX: 'Triumphs: ',
  UNITS: '---UNITS---',
  VALID_LIST: `Valid: ${CREATED_BY_WARHAMMER_APP}`,
}

export const cleanWarhammerAppText = (text: string): string[] => {
  return text
    .split('\n')
    .map(txt =>
      txt
        .replace(/[‘’]/g, `'`) // Replace special quotes
        .replace(/[“”]/g, `"`) // Replace special quotes
        .replace(/[‑–—]/g, `-`) // Replace special dashes
        .replace(/ /g, ` `) // // Remove non ASCII-spaces
        .trim()
        .replace(/ \(General\)$/g, '') // Remove General tag e.g. "Lord Kroak (General)" -> "Lord Kroak"
        .replace(
          /^(Army Notes|General|Battle Trait Bonus|Reinforced|Battlefield Role|Battlepack|Points Limit|Battalion Slot Filled): .+/g,
          ''
        ) // Remove unnecessary info
        .replace(/^Points Cost: .+/g, warhammerAppPlaceholders.END_OF_ENTRY) // Replace "Points Cost: 430 pts" with a constant separator (helps to mark the end of a unit entry)
        .replace(/^Total Points: .+/g, warhammerAppPlaceholders.END_OF_LIST) // Replace "Total Points: 2000 pts" with a constant separator (helps to mark the end of a list)
        .replace('Endless Spells/Invocations', warhammerAppPlaceholders.ENDLESS_SPELLS)
        .replace(/^Core Battalions$/g, warhammerAppPlaceholders.BATTALIONS)
        .replace(/^Enhancements$/g, warhammerAppPlaceholders.ENHANCEMENTS)
        .replace(/^Faction Terrain$/g, warhammerAppPlaceholders.SCENERY)
        .replace(/^Units$/g, warhammerAppPlaceholders.UNITS)
        .replace(/^Army Faction: /g, warhammerAppPlaceholders.FACTION_NAME_PREFIX)
        .replace(/^Army Type: /g, warhammerAppPlaceholders.SUBFACTION_PREFIX) // Army Type in WH App === Subfactions in AoSr
        .replace(/^Subfaction: /g, warhammerAppPlaceholders.FLAVOR_PREFIX) // Subfactions in WH App === Flavors in AoSr
        .trim()
    )
    .filter(txt => txt && txt.length > 2)
}
