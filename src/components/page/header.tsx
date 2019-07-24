import React from 'react'
import { connect } from 'react-redux'
import { initial, last } from 'lodash'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { SelectOne, TDropdownOption } from 'components/input/select'
import { titleCase } from 'utils/titleCase'
import { logFactionSwitch } from 'utils/analytics'
import { ValueType } from 'react-select/lib/types'
import { factionNames } from 'ducks'

interface IHeaderProps {
  setFactionName: (value: string) => void
}
/**
 * Hidden when printing
 */
const Header = (props: IHeaderProps) => {
  const { setFactionName } = props
  const factions = SUPPORTED_FACTIONS.map(x => titleCase(x))

  const setValue = (selectValue: ValueType<TDropdownOption>) => {
    const { value } = selectValue as TDropdownOption
    logFactionSwitch(value as TSupportedFaction)
    setFactionName(value)
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

        <div className={`row mx-auto pb-3 d-block text-dark text-left`}>
          <SelectOne items={SUPPORTED_FACTIONS} setValue={setValue} hasDefault={true} toTitle={true} />
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

const mapDispatchToProps = {
  setFactionName: factionNames.actions.setFactionName,
}

export default connect(
  null,
  mapDispatchToProps
)(Header)
