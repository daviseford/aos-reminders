import React from 'react'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa'

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

  const increment = e => {
    e.preventDefault()
    if (canIncrement) setPageNum(pageNum + 1)
  }

  const decrement = e => {
    e.preventDefault()
    if (canDecrement) setPageNum(pageNum - 1)
  }

  return (
    <nav aria-label="Saved Army Pagination">
      <ul className="pagination justify-content-center my-2">
        <li className={`page-item ${canDecrement ? `` : `disabled`}`} onClick={decrement}>
          <button className="page-link">{canDecrement && <FaAngleLeft className="mr-1" />}Previous</button>
        </li>
        <li className={`page-item ${canIncrement ? `` : `disabled`}`} onClick={increment}>
          <button className="page-link">Next{canIncrement && <FaAngleRight className="ml-1" />}</button>
        </li>
      </ul>
    </nav>
  )
}
