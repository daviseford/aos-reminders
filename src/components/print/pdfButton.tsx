import React from 'react'
import { connect } from 'react-redux'
import { army, selections, factionNames, visibility, realmscape } from 'ducks'
import { MdFileDownload } from 'react-icons/md'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'
import { TSupportedFaction } from 'meta/factions'
import { TAllyArmies, IArmy } from 'types/army'
import { TRealms } from 'types/realmscapes'
import { IAllySelections, ISelections } from 'types/selections'
import { IStore } from 'types/store'
import { processReminders } from 'utils/processReminders'
import { savePdf } from './pdf'
import { componentWithSize } from 'utils/mapSizesToProps'
import { logDownloadEvent } from 'utils/analytics'

interface IDownloadPDFProps {
  allyArmies: TAllyArmies
  allyFactionNames: TSupportedFaction[]
  allySelections: { [key: string]: IAllySelections }
  army: IArmy
  factionName: TSupportedFaction
  hiddenReminders: string[]
  isMobile: boolean
  realmscape_feature: string
  realmscape: TRealms | null
  selections: ISelections
}

const DownloadPDFComponent: React.FC<IDownloadPDFProps> = props => {
  const {
    allyArmies,
    allyFactionNames,
    allySelections,
    army,
    factionName,
    hiddenReminders,
    isMobile,
    realmscape_feature,
    realmscape,
    selections,
  } = props

  const handleDownload = e => {
    e.preventDefault()

    logDownloadEvent(factionName)

    // Generate reminders
    const reminders = processReminders(
      army,
      factionName,
      selections,
      realmscape_feature,
      allyFactionNames,
      allyArmies,
      allySelections
    )

    // And save the PDF (need to add an option for filename)
    savePdf({
      factionName,
      selections,
      realmscape_feature,
      allyFactionNames,
      allySelections,
      reminders,
      realmscape,
      hiddenReminders,
    })
  }

  const text = `Download${isMobile ? `` : ` PDF`}`

  return (
    <button className={btnDarkBlock} onClick={handleDownload}>
      <div className={btnContentWrapper}>
        <MdFileDownload className="mr-2" /> {text}
      </div>
    </button>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  allyArmies: army.selectors.getAllyArmies(state),
  allyFactionNames: selections.selectors.getAllyFactionNames(state),
  allySelections: selections.selectors.getAllySelections(state),
  army: army.selectors.getArmy(state),
  factionName: factionNames.selectors.getFactionName(state),
  hiddenReminders: visibility.selectors.getReminders(state),
  realmscape_feature: realmscape.selectors.getRealmscapeFeature(state),
  realmscape: realmscape.selectors.getRealmscape(state),
  selections: selections.selectors.getSelections(state),
})

export const DownloadPDFButton = connect(
  mapStateToProps,
  null
)(componentWithSize(DownloadPDFComponent))
