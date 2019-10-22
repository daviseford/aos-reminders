export const cleanText = (txt: string) => {
  return txt
    .replace(/(.+)\\n {1,}(.+)/g, `$1 $2`)
    .replace(/\r|\n|\v|\f|↵/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim()
}

export const fixKeys = (obj: { [key: string]: string[] }) => {
  const lookup = {
    Artefact: 'Artifacts',
    'Command Abilities': 'Commands',
    Spell: 'Spells',
    Weapon: 'Weapons',
  }

  const removeVals = ['Allegiance', 'Game Type', 'Realm of Battle', 'Damage Table']

  return Object.keys(obj).reduce(
    (a, key) => {
      if (removeVals.includes(key)) return a

      if (lookup[key]) {
        a[lookup[key]] = obj[key]
      } else {
        a[key] = obj[key]
      }
      return a
    },
    {} as { [key: string]: string[] }
  )
}
