import React, { useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { visibility } from 'ducks'
import { TDropdownOption, SelectMulti, TSelectOneSetValueFn, SelectOne } from 'components/input/select'
import { ValueType } from 'react-select/src/types'
import { TUnits, TArtifacts, TBattalions, TTraits, TAllegiances, TSpells, TEndlessSpells } from 'types/army'
import { IStore } from 'types/store'
import { VisibilityToggle } from './visibilityToggle'

const CARD_CLASSNAME = `col col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3`
interface ICardProps {
  hiddenSelectors: string[] // state2props
  hideSelector: (value: string) => void // dispatch2props
  showSelector: (value: string) => void // dispatch2props
  title: string
}

interface ICardMultiProps extends ICardProps {
  items: TUnits | TBattalions | TArtifacts | TTraits | TAllegiances | TSpells | TEndlessSpells
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  values: string[]
}

const CardMultiComponent = (props: ICardMultiProps) => {
  const { items, setValues, values, hiddenSelectors, title } = props
  const selectItems = items.map(x => x.name)
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])

  if (!items.length) return null
  return (
    <div className={CARD_CLASSNAME}>
      <div className="card">
        <CardHeader
          hideSelector={props.hideSelector}
          isVisible={isVisible}
          showSelector={props.showSelector}
          title={title}
        />
        <div className={`card-body${isVisible ? `` : ` d-none`}`}>
          <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
        </div>
      </div>
    </div>
  )
}

interface ICardSingleSelectProps extends ICardProps {
  setValue: TSelectOneSetValueFn
  items: string[]
  value?: string | null
}

const CardSingleSelectComponent: React.FC<ICardSingleSelectProps> = props => {
  const { setValue, items, title, value = null, hiddenSelectors } = props
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])

  return (
    <div className={CARD_CLASSNAME}>
      <div className="card">
        <CardHeader
          hideSelector={props.hideSelector}
          showSelector={props.showSelector}
          isVisible={isVisible}
          title={title}
        />
        <div className={`card-body${isVisible ? `` : ` d-none`}`}>
          <SelectOne setValue={setValue} items={items} value={value} isClearable={true} />
        </div>
      </div>
    </div>
  )
}

interface ICardHeaderProps {
  hideSelector: (value: string) => void // dispatch2props
  isVisible: boolean
  showSelector: (value: string) => void // dispatch2props
  title: string
}

const CardHeader = (props: ICardHeaderProps) => {
  const { title, isVisible, hideSelector, showSelector } = props

  const handleVisibility = useCallback(
    e => {
      e.preventDefault()
      return isVisible ? hideSelector(title) : showSelector(title)
    },
    [isVisible, showSelector, hideSelector, title]
  )

  return (
    <div className="card-header">
      <div className="d-flex justify-content-center">
        <div className="flex-grow-1 text-center pl-5">
          <h4 className="mb-0">{title}</h4>
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

export const CardMultiSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardMultiComponent)

export const CardSingleSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(CardSingleSelectComponent)
