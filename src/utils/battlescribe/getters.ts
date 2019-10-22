import { uniq } from 'lodash'
import { IParentNode, IFactionInfo, IChildNode, IParsedRoot } from './getBattlescribeArmy'
import { isParentNode, isChildNode } from './checks'
import { importFactionNameMap } from 'utils/import/options'
import { stripParentNode, partialSearchDoc } from './parseHTML'
import { cleanText, fixKeys, ignoredValues } from './battlescribeUtils'
import { TRealms } from 'types/realmscapes'

export const parseRealmObj = (obj: IParentNode): TRealms | null => {
  try {
    //@ts-ignore
    const text = obj.childNodes[1].childNodes[1].value
    return text.split(': ')[1].trim() as TRealms
  } catch (err) {
    return null
  }
}

/**
 *
 * @param obj
 */
export const parseFaction = (obj: IParentNode): IFactionInfo => {
  try {
    const factionNode = obj.childNodes.find(x => x.nodeName === 'h2')

    if (!isParentNode(factionNode)) throw new Error('Could not find factionNode')
    if (!isChildNode(factionNode.childNodes[0])) throw new Error('Not a child node')

    const factionValue = factionNode.childNodes[0].value.replace(/.+\((.+)\).+/g, '$1')

    const sep = factionValue.includes(': ') ? ': ' : ' - '
    let [grandAlliance, factionName] = factionValue.split(sep).map(x => x.trim())

    factionName = importFactionNameMap[factionName] || 'Unknown'

    return { grandAlliance, factionName }
  } catch (err) {
    console.log('There was an error detecting the faction name')
    console.error(err)
    return { grandAlliance: null, factionName: null }
  }
}

export const parseAllegiance = (obj: IParentNode) => {
  try {
    const strippedObj = stripParentNode(obj) as IParentNode
    strippedObj.childNodes = strippedObj.childNodes.filter(x => isParentNode(x))

    // If there is a node with the value of `Allegiance:`
    // There is some advanced Battlescribe bullshittery going on
    // And we need to parse it in a special manner
    if (partialSearchDoc(obj, 'Allegiance:')) {
      return getAllegianceMetadata(obj)
    }

    // TODO: Switch to Table lookup
    // Otherwise we can do a semi-normal lookup
    const { childNodes = [] } = strippedObj
    const nameObj = childNodes.find(x => {
      if (
        isParentNode(x) &&
        x.nodeName === 'p' &&
        x.childNodes.length &&
        x.childNodes.some(
          y =>
            isParentNode(y) &&
            y.nodeName === 'span' &&
            y.childNodes.length &&
            isChildNode(y.childNodes[0]) &&
            y.childNodes[0].value === 'Selections:'
        )
      ) {
        return true
      } else {
        return false
      }
    })

    if (!nameObj || !isParentNode(nameObj)) return null

    const selectionIdx = nameObj.childNodes.findIndex(
      y =>
        isParentNode(y) &&
        y.nodeName === 'span' &&
        y.childNodes.length &&
        isChildNode(y.childNodes[0]) &&
        y.childNodes[0].value === 'Selections:'
    )

    const objs = nameObj.childNodes.slice(selectionIdx + 1)

    let faction = objs
      .reduce((a, b) => {
        if (isParentNode(b)) return a
        a = `${a} ${b.value}`
        return a
      }, '')
      .trim()

    return { faction }
  } catch (err) {
    return { faction: null }
  }
}

export const getAllegianceMetadata = (obj: IParentNode) => {
  // We need to do some dumb shit now because of Battlescribe
  const ulNode = obj.childNodes.find(x => x.nodeName === 'ul') as IParentNode
  if (!ulNode) return
  const liNode = ulNode.childNodes.find(x => x.nodeName === 'li') as IParentNode
  if (!liNode) return

  const pChildren = liNode.childNodes.filter(x => x.nodeName === 'p') as IParentNode[]

  let className = ''
  let key = ''
  const entries = pChildren.reduce(
    (accum, x) => {
      x.childNodes.forEach(cNode => {
        let val = ''

        if (isParentNode(cNode)) {
          if (cNode.attrs.length > 0) {
            if (cNode.attrs[0].value === 'bold' && className !== 'bold') {
              className = 'bold'
              key = ''
            } else if (cNode.attrs[0].value !== 'bold' && className !== 'not_bold') {
              accum[key] = ''
              className = 'not_bold'
            }
          }
          val = cleanText((cNode.childNodes[0] as IChildNode).value)
        } else if (isChildNode(cNode)) {
          if (!accum[key]) accum[key] = ''
          className = 'not_bold'
          val = cleanText(cNode.value)
        }

        if (className === 'bold') {
          key = cleanText(`${key} ${val}`).replace(/:$/g, '')
        } else {
          accum[key] = cleanText(`${accum[key]} ${val}`)
        }
      })

      return accum
    },
    {} as { [key: string]: string }
  )

  // Rename any keys here
  const liEntries = Object.keys(entries).reduce(
    (a, key) => {
      const val = entries[key].replace(/ {1,},$/g, '') // remove trailing comma
      a[key] = val
      return a
    },
    {} as { [key: string]: string }
  )

  const tableTags = obj.childNodes.filter(x => isParentNode(x) && x.nodeName === 'table') as IParentNode[]

  const tableTraits: { [key: string]: string[] } = {}

  tableTags.forEach(table => {
    // @ts-ignore
    const tableName = table.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value
    // @ts-ignore
    const tds = table.childNodes[0].childNodes.slice(1).map(x => x.childNodes[0])
    const names = tds.map(x => x.childNodes[0].value).flat()
    tableTraits[tableName] = names
  })

  const mergedTraits = fixKeys(
    Object.keys(liEntries).reduce((a, key) => {
      if (tableTraits[key]) {
        a[key] = tableTraits[key]
      } else {
        a[key] = liEntries[key]
      }
      return a
    }, {})
  )

  return Object.keys(mergedTraits).reduce((a, key) => {
    const val = mergedTraits[key]
    if (key === 'Selections') {
      a['Allegiance'] = val
    } else if (key === 'Categories') {
      a['Faction'] = val
    } else {
      a[key] = val
    }
    return a
  }, {})
}

export const sortParsedRoots = (roots: IParsedRoot[]) => {
  const Collection = {
    allegiances: [] as string[],
    artifacts: [] as string[],
    battalions: [] as string[],
    commands: [] as string[],
    endless_spells: [] as string[],
    scenery: [] as string[],
    spells: [] as string[],
    traits: [] as string[],
    triumphs: [] as string[],
    units: [] as string[],
  }

  const lookup = {
    Artifacts: 'artifacts',
    Commands: 'commands',
    'Endless Spell': 'endless_spells',
    Battalion: 'battalions',
    Scenery: 'scenery',
    Spells: 'spells',
    'Super Battalion': 'battalions',
  }

  roots.forEach(r => {
    // Handle name first
    if (ignoredValues.includes(r.name)) return

    let [has_matched, process_entries] = [false, true]
    Object.keys(lookup).forEach(key => {
      if (!has_matched && r.name.startsWith(`${key}:`)) {
        const vals = r.name
          .split(`${key}:`)[1]
          .split(',')
          .map(cleanText)
        Collection[lookup[key]] = uniq(Collection[lookup[key]].concat(vals))
        has_matched = true
        if (key === 'Endless Spell') process_entries = false
      }
    })

    // Put everything else in units
    if (!has_matched) {
      const vals = r.name.split(',').map(cleanText)
      Collection.units = uniq(Collection.units.concat(vals))
    }

    if (process_entries) {
      // Now need to handle entries
      Object.keys(r.entries).forEach(key => {
        if (lookup[key]) {
          const vals = r.entries[key]
          Collection[lookup[key]] = uniq(Collection[lookup[key]].concat(vals))
        }
      })
    }
  })

  return Collection
}
