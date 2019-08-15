import React from 'react'
import { TUnits, TArtifacts, TBattalions, TTraits, TAllegiances, TSpells, TEndlessSpells } from 'types/army'
import { TDropdownOption, SelectMulti } from '../input/select'
import { ValueType } from 'react-select/src/types'

interface ICardProps {
  values: string[]
  type: string
  items: TUnits | TBattalions | TArtifacts | TTraits | TAllegiances | TSpells | TEndlessSpells
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
}

export const CardComponent = (props: ICardProps) => {
  const { items, type, setValues, values } = props
  if (!items.length) return null
  const selectItems = items.map(x => x.name)
  return (
    <div className="col col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">Add {type}</h4>
          <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
        </div>
      </div>
    </div>
  )
}
