import React from 'react'
import { btnDarkBlock, btnContentWrapper } from 'theme/helperClasses'

export const FallbackBtn = () => {
  return (
    <button className={btnDarkBlock} disabled type="button">
      <div className={btnContentWrapper}>
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>{' '}
        Loading
      </div>
    </button>
  )
}
