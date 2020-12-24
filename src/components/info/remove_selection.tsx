import { selectionActions } from 'ducks'
import { without } from 'lodash'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { store } from 'store'
import { lowerToUpperLookup, TCondition } from 'types/data'

interface IRemoveSelectionMenuProps {
  selection: TCondition
}

export const RemoveSelectionMenu = (props: IRemoveSelectionMenuProps) => {
  const { selection } = props
  const dispatch = useDispatch()
  const state = store.getState()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!selection.type) return
    const action = selectionActions['set' + lowerToUpperLookup[selection.type]]
    const remainingValues = without(state.selections.selections[selection.type], selection.value)
    dispatch(action(remainingValues))
  }

  return (
    <>
      <Dropdown.Item onClick={handleClick}>Remove {selection.value}</Dropdown.Item>
    </>
  )
}
