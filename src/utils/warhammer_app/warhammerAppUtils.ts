export const warhammerAppPlaceholders = {
  END_OF_ENTRY: '---END_OF_ENTRY---',
  END_OF_LIST: '---END_OF_LIST---',
  ENDLESS_SPELLS: '---ENDLESS_SPELLS---',
  ENHANCEMENTS: '---ENHANCEMENTS---',
  SEPARATOR: '---SEPARATOR---',
  TERRAIN: '---TERRAIN---',
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
        .replace(/^Enhancements$/g, warhammerAppPlaceholders.ENHANCEMENTS)
        .replace('Endless Spells/Invocations', warhammerAppPlaceholders.ENDLESS_SPELLS)
        .replace(/^Faction Terrain$/g, warhammerAppPlaceholders.TERRAIN)
        .trim()
    )
    .filter(txt => txt && txt.length > 2)
}
