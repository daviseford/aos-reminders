import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import './header.css'

import { withSelectOne } from 'utils/withSelect'
import { logFactionSwitch } from 'utils/analytics'
import { factionNames, selections } from 'ducks'
import { SelectOne } from 'components/input/select'
import { SUPPORTED_FACTIONS, TSupportedFaction } from 'meta/factions'
import { componentWithSize } from 'utils/mapSizesToProps'

interface IHeaderProps {
  isMobile: boolean
  resetSelections: () => void
  setFactionName: (value: string | null) => void
}

const HeaderComponent: React.FC<IHeaderProps> = props => {
  const { resetSelections, setFactionName, isMobile } = props

  const setValue = withSelectOne((value: string | null) => {
    resetSelections()
    logFactionSwitch(value as TSupportedFaction)
    setFactionName(value)
  })
  const jumboClass = useMemo(
    () =>
      `jumbotron jumbotron-fluid text-center HeaderCover text-white d-print-none mb-0 pt-4 ${
        isMobile ? `pb-2` : `pb-3`
      } `,
    [isMobile]
  )

  return (
    <div className={jumboClass}>
      <div className="container">
        <h1 className="display-5">Age of Sigmar Reminders</h1>
        <p className="mt-3 mb-1">
          By Davis E. Ford -{' '}
          <a className="text-white" href="https://daviseford.com" target="_blank" rel="noopener noreferrer">
            daviseford.com
          </a>
        </p>
        <span>This tool offers gameplay reminders for:</span>
        <div className={`d-flex pt-3 pb-2 justify-content-center`}>
          <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-dark text-left">
            <SelectOne items={SUPPORTED_FACTIONS} setValue={setValue} hasDefault={true} toTitle={true} />
          </div>
        </div>
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
)(componentWithSize(HeaderComponent))
