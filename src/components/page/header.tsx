import React from 'react'
import { connect } from 'react-redux'

import { withSelectOne } from 'utils/withSelect'
import { logFactionSwitch } from 'utils/analytics'
import { factionNames, selections } from 'ducks'
import { SelectOne } from 'components/input/select'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'

interface IHeaderProps {
  resetSelections: () => void
  setFactionName: (value: string | null) => void
}
/**
 * Hidden when printing
 */
const HeaderComponent = (props: IHeaderProps) => {
  const { resetSelections, setFactionName } = props

  const setValue = withSelectOne((value: string | null) => {
    resetSelections()
    logFactionSwitch(value as TSupportedFaction)
    setFactionName(value)
  })

  return (
    <div className="jumbotron jumbotron-fluid text-center bg-dark text-white py-4 d-print-none">
      <div className="container">
        <h1 className="display-4">Age of Sigmar Reminders</h1>
        <p className="lead mt-3">
          By Davis E. Ford -{' '}
          <a className="text-white" href="https://daviseford.com" target="_blank" rel="noopener noreferrer">
            daviseford.com
          </a>
        </p>
        <span>This tool offers personalized gameplay reminders for:</span>
        <div className={`d-flex py-3 justify-content-center`}>
          <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-dark text-left">
            <SelectOne items={SUPPORTED_FACTIONS} setValue={setValue} hasDefault={true} toTitle={true} />
          </div>
        </div>
        <span>Other armies are being added based on demand.</span>
        <br />
        <small>
          Note: Our Spells and Endless Spells library is currently under construction.
          <br />
          If your army is currently missing spells, we're working on it!
        </small>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  resetSelections: selections.actions.resetSelections,
  setFactionName: factionNames.actions.setFactionName,
}

export const Header = connect(
  null,
  mapDispatchToProps
  //@ts-ignore
)(HeaderComponent)
