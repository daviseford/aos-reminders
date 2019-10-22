import parse5 from 'parse5'
import { uniq } from 'lodash'

export const getBattleScribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const strippedDoc = stripParentNode(document as ParentNode)

  const { allegiance, faction, rootSelections } = traverseDoc(strippedDoc)
  const parsedRoots: IParsedRoot[] = rootSelections.map(parseRootSelection)
  const Collection = sortParsedRoots(parsedRoots)

  console.log(strippedDoc)
  console.log(allegiance, faction, rootSelections)
  console.log(parsedRoots)
  console.log(Collection)

  return Collection
}

interface IParsedRoot {
  name: string
  entries: {
    [key: string]: string[]
  }
}

const sortParsedRoots = (roots: IParsedRoot[]) => {
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
    Spells: 'spells',
    'Super Battalion': 'battalions',
  }

  const removeVals = ['Allegiance', 'Game Type', 'Realm of Battle', 'Damage Table']

  roots.forEach(r => {
    // Handle name first
    if (removeVals.includes(r.name)) return
    let has_matched = false
    Object.keys(lookup).forEach(key => {
      if (!has_matched && r.name.startsWith(`${key}:`)) {
        const vals = r.name
          .split(`${key}:`)[1]
          .split(',')
          .map(cleanText)
        Collection[lookup[key]] = uniq(Collection[lookup[key]].concat(vals))
        has_matched = true
      }
    })

    // Put everything else in units
    if (!has_matched) {
      const vals = r.name.split(',').map(cleanText)
      Collection.units = uniq(Collection.units.concat(vals))
    }

    // Now need to handle entries
    Object.keys(r.entries).forEach(key => {
      if (lookup[key]) {
        const vals = r.entries[key]
        Collection[lookup[key]] = uniq(Collection[lookup[key]].concat(vals))
      }
    })
  })

  return Collection
}

/**
 * Helps us get the JSON string (removes circular references)
 */
const stripParentNode = (docObj: ParentNode | ChildNode) => {
  if (isChildNode(docObj) && docObj.value) {
    docObj.value = cleanText(docObj.value)
  }
  //@ts-ignore
  delete docObj.parentNode // Get rid of circular references
  //@ts-ignore
  delete docObj.namespaceURI // Unnecessary key
  //@ts-ignore
  delete docObj.tagName // Unnecessary key

  if (!isParentNode(docObj)) return docObj

  if (docObj.childNodes.length > 0) {
    docObj.childNodes = docObj.childNodes
      .map(stripParentNode)
      .map(x => {
        if (isChildNode(x)) {
          x.value = cleanText(x.value)
        }
        return x
      })
      .filter(x => {
        if (isChildNode(x)) {
          const trimmedVal = cleanText(x.value)
          if (trimmedVal === '') return false
          if (trimmedVal === '\n') return false
          if (trimmedVal === '\n\n') return false
        }
        return true
      })
  }

  return docObj
}

const isParentNode = (node: ParentNode | ChildNode | undefined): node is ParentNode =>
  !!node && 'childNodes' in node
const isChildNode = (node: ParentNode | ChildNode | undefined): node is ChildNode => !!node && 'value' in node

const isFactionObj = (obj: ParentNode | ChildNode): obj is ParentNode => {
  if (isChildNode(obj)) return false
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'force'
}

const cleanText = (txt: string) => {
  return txt
    .replace(/(.+)\\n {1,}(.+)/g, `$1 $2`)
    .replace(/\r|\n|\v|\f|↵/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim()
}

/**
 *
 * @param obj
 */
const parseFaction = (obj: ParentNode): IFaction => {
  try {
    const factionNode = obj.childNodes.find(x => x.nodeName === 'h2')
    if (!isParentNode(factionNode)) throw new Error('Could not find factionNode')
    if (!isChildNode(factionNode.childNodes[0])) throw new Error('Not a child node')
    const factionValue = factionNode.childNodes[0].value.replace(/.+\((.+)\).+/g, '$1')
    const [alliance, faction] = factionValue.split(' - ').map(x => x.trim())
    return { alliance, faction }
  } catch (err) {
    console.log('There was an error detecting the faction name')
    console.error(err)
    return { alliance: null, faction: null }
  }
}

const parseAllegiance = (obj: ParentNode) => {
  try {
    const strippedObj = stripParentNode(obj) as ParentNode
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

const getAllegianceMetadata = (obj: ParentNode) => {
  // We need to do some dumb shit now because of Battlescribe
  const ulNode = obj.childNodes.find(x => x.nodeName === 'ul') as ParentNode
  if (!ulNode) return
  const liNode = ulNode.childNodes.find(x => x.nodeName === 'li') as ParentNode
  if (!liNode) return

  const pChildren = liNode.childNodes.filter(x => x.nodeName === 'p') as ParentNode[]

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
          val = cleanText((cNode.childNodes[0] as ChildNode).value)
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
  return Object.keys(entries).reduce(
    (a, key) => {
      const val = entries[key].replace(/ {1,},$/g, '') // remove trailing comma
      if (key === 'Selections') {
        a['Allegiance'] = val
      } else if (key === 'Categories') {
        a['Faction'] = val
      } else {
        a[key] = val
      }
      return a
    },
    {} as { [key: string]: string }
  )
}

const parseRootSelection = (obj: ParentNode) => {
  try {
    const { childNodes = [] } = obj
    const nameObj = childNodes.find(x => x.nodeName === 'h4')
    if (!isParentNode(nameObj) || !nameObj.childNodes.length) throw new Error('Could not find the item name')
    const name = (nameObj.childNodes[0] as ChildNode).value.replace(/(.+)\[.+\]/g, '$1').trim()

    const tableTags = childNodes.filter(x => {
      return isParentNode(x) && x.nodeName === 'table'
    }) as ParentNode[]

    const entries: { [key: string]: string[] } = {}

    tableTags.forEach(table => {
      // @ts-ignore
      const tableName = table.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value
      // @ts-ignore
      const tds = table.childNodes[0].childNodes.slice(1).map(x => x.childNodes[0])
      const names = tds.map(x => x.childNodes[0].value).flat()
      entries[tableName] = names
    })

    return { name, entries: fixKeys(entries) }
  } catch (err) {
    console.log('There was an error parsing a root selection')
    console.error(err)
    return { name: '', entries: {} }
  }
}

const fixKeys = (obj: { [key: string]: string[] }) => {
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

const isRootSelection = (obj: ParentNode | ChildNode): obj is ParentNode => {
  if (isChildNode(obj)) return false
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'rootselection'
}

const traverseDoc = (docObj: ParentNode | ChildNode) => {
  let results = {
    allegiance: null as any,
    faction: null as null | IFaction,
    rootSelections: [] as ParentNode[],
  }

  const traverse = (obj: ParentNode | ChildNode) => {
    if (!isParentNode(obj)) return

    if (isRootSelection(obj)) {
      results.rootSelections.push(obj)
    }

    if (!results.faction && isFactionObj(obj)) {
      results.faction = parseFaction(obj)
    }

    if (!results.allegiance && isAllegianceObj(obj)) {
      results.allegiance = parseAllegiance(obj)
    }

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return results
}

const partialSearchDoc = (docObj: ParentNode, searchString: string) => {
  let result: string = ''

  const traverse = (obj: ParentNode | ChildNode) => {
    if (result) return
    if (isChildNode(obj) && obj.value.startsWith(searchString)) {
      result = obj.value
      return
    }
    if (!isParentNode(obj)) return

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return result
}

const isAllegianceObj = (obj: ParentNode | ChildNode): obj is ParentNode => {
  if (isChildNode(obj)) return false
  if (!isRootSelection(obj)) return false
  if (!obj.childNodes.length) return false
  const subObj = obj.childNodes.find(x => {
    return (
      isParentNode(x) &&
      x.nodeName === 'h4' &&
      isChildNode(x.childNodes[0]) &&
      x.childNodes[0].value === 'Allegiance'
    )
  })
  return !!subObj
}

interface Attrs {
  name: string
  value: string
}

interface ChildNode {
  nodeName: string
  value: string
}

interface ParentNode {
  nodeName: string
  attrs: Attrs[]
  childNodes: Array<ChildNode | ParentNode>
}

interface IFaction {
  alliance: string | null
  faction: string | null
}
