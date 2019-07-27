import React from 'react'
import { SelectOne, TSelectOneSetValueFn } from './select'

interface ISelectRealmscapeProps {
  setValue: TSelectOneSetValueFn
  items: string[]
}

export const SelectRealmscapeComponent = (props: ISelectRealmscapeProps) => {
  return (
    <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">Realmscape Feature</h4>
          <SelectOne {...props} isClearable={true} />
        </div>
      </div>
    </div>
  )
}
