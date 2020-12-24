import { selectionActions } from 'ducks'
import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { TCondition } from 'types/data'

interface IRemoveSelectionMenuProps {
  selection: TCondition
}

export const RemoveSelectionMenu = (props: IRemoveSelectionMenuProps) => {
  const { selection } = props
  const dispatch = useDispatch()
  const { removeSelections } = selectionActions

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(removeSelections([selection.value]))
  }

  return (
    <>
      <Dropdown.Item onClick={handleClick}>Remove {selection.value}</Dropdown.Item>
    </>
  )
}
