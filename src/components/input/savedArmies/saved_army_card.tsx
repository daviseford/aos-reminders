import { DeleteArmyModal } from 'components/input/savedArmies/delete_army_modal'
import { LoadArmyBtn } from 'components/input/savedArmies/load_army_btn'
import { SavedArmyTable } from 'components/input/savedArmies/saved_army_table'
import UpdateNameButton from 'components/input/savedArmies/update_name_btn'
import { useAppStatus } from 'context/useAppStatus'
import { useSavedArmies } from 'context/useSavedArmies'
import { useTheme } from 'context/useTheme'
import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import { ISavedArmyFromApi } from 'types/savedArmy'
import { titleCase } from 'utils/textUtils'

interface ISavedArmyCardProps {
  army: ISavedArmyFromApi
}

export const SavedArmyCard: React.FC<ISavedArmyCardProps> = props => {
  const { army } = props
  const { isOffline } = useAppStatus()
  const { theme } = useTheme()

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [border, setBorder] = useState('')
  const { loadedArmy } = useSavedArmies()

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  useEffect(() => {
    if (!loadedArmy) {
      if (border.includes('border-success')) {
        setBorder('shadow-drop-2-center-reverse')
        setTimeout(() => setBorder(''), 500)
      }
      return
    }

    if (loadedArmy.id === army.id) {
      setBorder('border-success shadow-drop-2-center')
    } else if (border.includes('border-success')) {
      setBorder('shadow-drop-2-center-reverse')
      setTimeout(() => setBorder(''), 500)
    }
  }, [loadedArmy, army.id, border])

  // TODO Make the table stuff collapsable
  return (
    <div className="col-12 col-lg-6 col-xl-6 col-xxl-4 mb-2">
      <div className={`card ${border}`}>
        <div className={theme.cardBody}>
          <CardTitle
            id={army.id}
            armyName={army.armyName}
            factionName={army.factionName}
            createdAt={army.createdAt}
          />
          <div className="mt-1">
            <SavedArmyTable army={army} />
          </div>
          <div className="d-flex justify-content-center">
            <LoadArmyBtn army={army} />
            <button className="btn btn-sm btn-danger mx-3" onClick={openModal} disabled={isOffline}>
              Delete
            </button>
            {modalIsOpen && (
              <DeleteArmyModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                armyName={army.armyName}
                factionName={army.factionName}
                id={army.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ICardTitleProps {
  armyName: ISavedArmyFromApi['armyName']
  factionName: ISavedArmyFromApi['factionName']
  createdAt: ISavedArmyFromApi['createdAt']
  id: ISavedArmyFromApi['id']
}

const CardTitle = ({ armyName, factionName, createdAt, id }: ICardTitleProps) => {
  const { isOffline } = useAppStatus()
  const { theme } = useTheme()

  const faction = titleCase(factionName)
  const created = DateTime.fromMillis(createdAt).toLocaleString({
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <>
      <div className={`d-flex ${theme.text} mb-1 justify-content-start align-items-center`}>
        <div hidden={isOffline}>
          <UpdateNameButton size="0.75rem" className="mr-3" armyName={armyName} id={id} />
        </div>
        <div className="flex-grow-1">
          <h5 className="card-title mb-0">{armyName ? armyName : `Untitled`}</h5>
        </div>
      </div>

      <div className="d-flex justify-content-around">
        <small className={`flex-fill ${theme.textMuted}`}>{faction}</small>
        <small className={`flex-fill ${theme.textMuted} text-right mr-2`}>Created: {created}</small>
      </div>
    </>
  )
}
