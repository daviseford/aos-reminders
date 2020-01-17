export const cleanText = (txt: string) => {
  return (
    txt
      .replace(/(.+)\\n {1,}(.+)/g, `$1 $2`)
      .replace(/\r|\n|\v|\f|↵/g, ' ')
      .replace(/ {2,}/g, ' ')
      .replace(/\*/g, '') // Remove asteriks
      .replace(/[‘’]/g, `'`) // Replace special apostrophes
      .replace(/[“”]/g, `"`) // Replace special quotes
      .replace(/[‑–—]/g, `-`) // Replace special dashes
      .replace(/ /g, ` `) // Remove non ASCII-spaces
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '') // Remove all other non-ASCII characters
      .trim()
  )
}
export const ignoredValues = [
  'Allegiance: The Ossiarch Empire',
  'Allegiance',
  'Alliegiance', // lol
  'Damage Table',
  'Game Type',
  'Points Variation',
  'Purchased Command Points',
  'Realm of Battle',
  'Realm of Origin',
]

export const fixKeys = (obj: { [key: string]: string[] }) => {
  const lookup = {
    Artefact: 'Artifacts',
    'Command Abilities': 'Commands',
    Spell: 'Spells',
    'The Kharadron Code': 'Traits',
    Weapon: 'Weapons',
  }

  return Object.keys(obj).reduce((a, key) => {
    if (ignoredValues.includes(key)) return a

    if (lookup[key]) {
      a[lookup[key]] = obj[key]
    } else {
      a[key] = obj[key]
    }
    return a
  }, {} as { [key: string]: string[] })
}
