import React, { useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { visibility } from 'ducks'
import { TDropdownOption, SelectMulti } from 'components/input/select'
import { ValueType } from 'react-select/src/types'
import { TUnits, TArtifacts, TBattalions, TTraits, TAllegiances, TSpells, TEndlessSpells } from 'types/army'
import { IStore } from 'types/store'
import { VisibilityToggle } from './visibilityToggle'

interface ICardProps {
  hiddenSelectors: string[] // state2props
  hideSelector: (value: string) => void // dispatch2props
  items: TUnits | TBattalions | TArtifacts | TTraits | TAllegiances | TSpells | TEndlessSpells
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  showSelector: (value: string) => void // dispatch2props
  type: string
  values: string[]
}

export const CardComponent = (props: ICardProps) => {
  const { items, setValues, values, hiddenSelectors, type } = props
  const selectItems = items.map(x => x.name)
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === type), [hiddenSelectors, type])

  if (!items.length) return null
  return (
    <div className="col col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <CardHeader
          hideSelector={props.hideSelector}
          isVisible={isVisible}
          showSelector={props.showSelector}
          type={type}
        />
        <div className={`card-body${isVisible ? `` : ` d-none`}`}>
          <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
        </div>
      </div>
    </div>
  )
}

interface ICardHeaderProps {
  hideSelector: (value: string) => void // dispatch2props
  isVisible: boolean
  showSelector: (value: string) => void // dispatch2props
  type: string
}

const CardHeader = (props: ICardHeaderProps) => {
  const { type, isVisible, hideSelector, showSelector } = props

  const handleVisibility = useCallback(
    e => {
      e.preventDefault()
      return isVisible ? hideSelector(type) : showSelector(type)
    },
    [isVisible, showSelector, hideSelector, type]
  )

  return (
    <div className="card-header">
      <div className="d-flex justify-content-center">
        <div className="flex-grow-1 text-center pl-5">
          <h4 className="mb-0">{type}</h4>
        </div>
        <div className="px-2 d-print-none">
          <VisibilityToggle isVisible={isVisible} setVisibility={handleVisibility} size={1.2} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  hiddenSelectors: visibility.selectors.getSelectors(state),
})

const mapDispatchToProps = {
  hideSelector: visibility.actions.addSelector,
  showSelector: visibility.actions.deleteSelector,
}

export const Card = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardComponent)
