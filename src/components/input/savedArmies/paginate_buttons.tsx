import GenericButton from 'components/input/generic_button'
import React from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

interface IPaginateButtonsProps {
  pageNum: number
  numPages: number
  setPageNum: (num: number) => void
}

export const PaginateButtons: React.FC<IPaginateButtonsProps> = props => {
  const { pageNum, setPageNum, numPages } = props

  if (numPages < 2) return null

  const canIncrement = pageNum !== numPages
  const canDecrement = pageNum !== 1

  const increment = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canIncrement) setPageNum(pageNum + 1)
  }

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canDecrement) setPageNum(pageNum - 1)
  }

  return (
    <nav aria-label="Saved Army Pagination">
      <ul className="pagination justify-content-center my-2">
        <li className={`page-item ${canDecrement ? `` : `disabled`}`} onClick={decrement}>
          <GenericButton className="page-link">
            {canDecrement && <FaAngleLeft className="mr-1" />}Previous
          </GenericButton>
        </li>
        <li className={`page-item ${canIncrement ? `` : `disabled`}`} onClick={increment}>
          <GenericButton className="page-link">
            Next{canIncrement && <FaAngleRight className="ml-1" />}
          </GenericButton>
        </li>
      </ul>
    </nav>
  )
}
