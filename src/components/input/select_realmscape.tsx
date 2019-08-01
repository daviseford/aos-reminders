import React from 'react'
import { SelectOne, TSelectOneSetValueFn } from './select'

interface ISelectRealmscapeProps {
  setValue: TSelectOneSetValueFn
  items: string[]
  value?: string | null
  title: string
}

export const SelectRealmscapeComponent = (props: ISelectRealmscapeProps) => {
  const { setValue, items, title, value = null } = props
  return (
    <div className="col col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">{title}</h4>
          <SelectOne setValue={setValue} items={items} value={value} isClearable={true} />
        </div>
      </div>
    </div>
  )
}
