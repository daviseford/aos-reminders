import { selectors } from 'ducks'
import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { titleCase } from 'utils/textUtils'

const PrintArmy = () => {
  const { factionName, subFactionName, realmscape_feature, selections, allySelections } = useSelector(
    selectors.selectCurrentArmy
  )
  const {
    artifacts,
    battalions,
    command_abilities,
    command_traits,
    endless_spells,
    flavors,
    prayers,
    mount_traits,
    scenery,
    spells,
    triumphs,
    units,
  } = selections
  const realmFeature = realmscape_feature ? [realmscape_feature] : []
  return (
    <>
      <div className={'row text-center mt-4 mb-1 d-none d-print-block'}>
        <h5>{titleCase(factionName)}</h5>
        {!!subFactionName && titleCase(factionName) !== titleCase(subFactionName) && (
          <h5>SubFaction: {titleCase(subFactionName)}</h5>
        )}
      </div>
      <div className={'row text-center d-none d-print-block'}>
        <ItemsDisplayComponent name={'Flavor'} items={flavors} />
        <ItemsDisplayComponent name={'Battalion'} items={battalions} />
        <ItemsDisplayComponent name={'Unit'} items={units} />
        <ItemsDisplayComponent name={'Artifact'} items={artifacts} />

        <ItemsDisplayComponent name={'Command Trait'} items={command_traits} />
        <ItemsDisplayComponent name={'Mount Trait'} items={mount_traits} />
        <ItemsDisplayComponent name={'Command Abilities'} items={command_abilities} pluralize={false} />
        <ItemsDisplayComponent name={'Spell'} items={spells} />
        <ItemsDisplayComponent name={'Prayer'} items={prayers} />
        <ItemsDisplayComponent name={'Endless Spell'} items={endless_spells} />
        <ItemsDisplayComponent name={'Scenery'} items={scenery} pluralize={false} />
        <ItemsDisplayComponent name={'Realmscape Feature'} items={realmFeature} />
        <ItemsDisplayComponent name={'Triumph'} items={triumphs} />

        {Object.keys(allySelections).map(name => (
          <ItemsDisplayComponent
            name={`Allied ${titleCase(name)} Unit`}
            items={allySelections[name as keyof typeof allySelections]?.units || []}
            key={name}
          />
        ))}

        {Object.keys(allySelections).map(name => (
          <ItemsDisplayComponent
            name={`Allied ${titleCase(name)} Battalion`}
            items={allySelections[name as keyof typeof allySelections]?.battalions || []}
            key={name}
          />
        ))}
      </div>
    </>
  )
}

export default PrintArmy

/**
 * Here be dragons
 * @param title
 * @param items
 */
const getWrappedItemText = (title: string, items: string[]) => {
  if (!items.length) return []
  const wrapLimit = 70
  return items.reduce(
    (a, b, i) => {
      if (i === 0) return a
      if (a.lineLength + 3 + b.length > wrapLimit) {
        a.lineLength = b.length
        a.index = a.index + 1
        a.text[a.index] = b
      } else {
        a.lineLength = a.lineLength + b.length
        a.text[a.index] = `${a.text[a.index]} | ${b}`
      }
      return a
    },
    { text: [items[0]], lineLength: title.length + 2, index: 0 }
  ).text
}

const ItemsDisplayComponent = (props: { name: string; items: string[]; pluralize?: boolean }) => {
  const { items = [], name, pluralize = true } = props
  const title = !pluralize ? name : items.length > 1 ? `${name}s` : name
  const itemsText = useMemo(() => getWrappedItemText(title, items), [title, items])
  if (!items.length) return null

  return (
    <div className="col px-5">
      <strong>{title}:</strong>{' '}
      {itemsText.map((line, i) => (
        <Fragment key={i}>
          {line}
          <br />
        </Fragment>
      ))}
    </div>
  )
}
