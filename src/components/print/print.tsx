import React from 'react'
import { connect } from 'react-redux'

import { ISelections, IAllySelections } from 'types/selections'
import { titleCase } from 'utils/titleCase'
import { factionNames, selections, realmscape } from 'ducks'

const PrintHeaderComponent = (props: { factionName: string }) => {
  return (
    <header className={'text-center mt-4 mb-1 d-none d-print-block'}>
      <h1>AoS Reminders - {titleCase(props.factionName)}</h1>
    </header>
  )
}

const mapHeaderStateToProps = (state, ownProps) => ({
  ...ownProps,
  factionName: factionNames.selectors.getFactionName(state),
})

export const PrintHeader = connect(
  mapHeaderStateToProps,
  null
)(PrintHeaderComponent)

const PrintUnitsComponent = (props: {
  selections: ISelections
  allySelections: IAllySelections
  realmscape_feature: string | null
}) => {
  const { realmscape_feature, selections, allySelections } = props
  const { units, battalions, artifacts, traits, spells, endless_spells } = selections
  const realmFeature = realmscape_feature ? [realmscape_feature] : []
  return (
    <div className={'row text-center d-none d-print-block'}>
      <ItemsDisplayComponent name={'Unit'} items={units} />
      <ItemsDisplayComponent name={'Allied Unit'} items={allySelections.units} />
      <ItemsDisplayComponent name={'Artifact'} items={artifacts} />
      <ItemsDisplayComponent name={'Battalion'} items={battalions} />
      <ItemsDisplayComponent name={'Command Trait'} items={traits} />
      <ItemsDisplayComponent name={'Spell'} items={spells} />
      <ItemsDisplayComponent name={'Endless Spell'} items={endless_spells} />
      <ItemsDisplayComponent name={'Realmscape Feature'} items={realmFeature} />
    </div>
  )
}

const mapUnitsStateToProps = (state, ownProps) => ({
  ...ownProps,
  allySelections: selections.selectors.getAllySelections(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  selections: selections.selectors.getSelections(state),
})

export const PrintUnits = connect(
  mapUnitsStateToProps,
  null
)(PrintUnitsComponent)

const ItemsDisplayComponent = (props: { name: string; items: string[] }) => {
  const { items, name } = props
  if (!items.length) return null
  const title = items.length > 1 ? `${name}s` : name
  return (
    <p className="py-0 my-0">
      <strong>{title}:</strong> {items.join(' | ')}
    </p>
  )
}

export const PrintFooterComponent = () => {
  return (
    <footer className={'text-center pb-4 pt-1 d-none d-print-block'}>
      Generated by <strong>AoS Reminders</strong>
      <br />
      <strong>daviseford.com/aos-reminders/</strong>
    </footer>
  )
}
