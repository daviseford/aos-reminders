import React, { useState } from 'react'
import { initial, last } from 'lodash'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { SelectOne, TDropdownOption } from 'components/input/select_one'
import { titleCase } from 'utils/titleCase'
import { logFactionSwitch } from 'utils/analytics'
import { ValueType } from 'react-select/lib/types'

/**
 * Hidden when printing
 */
const Header = ({ setFactionName, factionName }) => {
  const [selectCount, setSelectCount] = useState(0)
  const factions = SUPPORTED_FACTIONS.map(x => titleCase(x))

  const setValue = (selectValue: ValueType<TDropdownOption>, action) => {
    const { value: factionName } = selectValue as TDropdownOption
    // Avoid registering an event on pageload
    if (selectCount > 0) {
      logFactionSwitch(factionName as TSupportedFaction)
    }
    setFactionName(factionName)
    setSelectCount(selectCount + 1)
  }

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

        <div className="row w-50 mx-auto pb-3 d-block text-dark">
          <SelectOne items={SUPPORTED_FACTIONS} setValue={setValue} hasDefault={true} />
        </div>

        <p>
          This tool offers personalized gameplay reminders for {initial(factions).join(', ')}, and {last(factions)}.
          <br />
          Other armies are being added based on demand.
        </p>
      </div>
    </div>
  )
}

export default Header
