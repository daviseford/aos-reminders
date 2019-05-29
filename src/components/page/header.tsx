import React from 'react'
import { initial, last } from 'lodash'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { SelectOne } from 'components/input/select_one'
import { titleCase } from 'utils/titleCase'

/**
 * Hidden when printing
 */
const Header = ({ setFactionName, factionName }) => {
  const factions = SUPPORTED_FACTIONS.map(x => titleCase(x))
  return (
    <div className="jumbotron jumbotron-fluid text-center bg-dark text-white d-print-none">
      <div className="container">
        <h1 className="display-4">Age of Sigmar Reminders</h1>
        <p className="lead mt-3">
          By Davis E. Ford -{' '}
          <a className="text-white" href="https://daviseford.com" target="_blank" rel="noopener noreferrer">
            daviseford.com
          </a>
        </p>

        <SelectOne items={SUPPORTED_FACTIONS} setValue={setFactionName} value={factionName} />

        <p>
          Right now, this tool offers personalized gameplay reminders for {initial(factions).join(', ')}, and{' '}
          {last(factions)}.
          <br />
          Other armies may be added if there is demand.
        </p>
      </div>
    </div>
  )
}

export default Header
