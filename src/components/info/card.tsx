import React, { useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { visibility } from 'ducks'
import { VisibilityToggle, TVisibilityIconType } from 'components/info/visibilityToggle'
import { TDropdownOption, SelectMulti, TSelectOneSetValueFn, SelectOne } from 'components/input/select'
import { ValueType } from 'react-select/src/types'
import { TUnits, TArtifacts, TBattalions, TTraits, TAllegiances, TSpells, TEndlessSpells } from 'types/army'
import { IStore } from 'types/store'

interface ICardProps {
  title: string
  isVisible: boolean
}

const CardComponent: React.FC<ICardProps> = props => {
  const { title, isVisible, children } = props
  return (
    <div className={`col col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3`}>
      <div className="card">
        <CardHeader isVisible={isVisible} title={title} />
        <div className={`card-body${isVisible ? `` : ` d-none`}`}>{children}</div>
      </div>
    </div>
  )
}

interface ICardMultiProps {
  hiddenSelectors: string[] // state2props
  items: TUnits | TBattalions | TArtifacts | TTraits | TAllegiances | TSpells | TEndlessSpells
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  title: string
  values: string[]
}

const CardMultiComponent = (props: ICardMultiProps) => {
  const { items, setValues, values, hiddenSelectors, title } = props
  const selectItems = items.map(x => x.name)
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])

  if (!items.length) return null
  return (
    <CardComponent title={title} isVisible={isVisible}>
      <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
    </CardComponent>
  )
}

interface ICardSingleSelectProps {
  hiddenSelectors: string[] // state2props
  items: string[]
  setValue: TSelectOneSetValueFn
  title: string
  value?: string | null
}

const CardSingleSelectComponent: React.FC<ICardSingleSelectProps> = props => {
  const { setValue, items, title, value = null, hiddenSelectors } = props
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])

  return (
    <CardComponent title={title} isVisible={isVisible}>
      <SelectOne setValue={setValue} items={items} value={value} isClearable={true} />
    </CardComponent>
  )
}

interface ICardHeaderProps {
  hideCard: (value: string) => void
  isVisible: boolean
  showCard: (value: string) => void
  title: string
  headerClassName?: string
  type?: TVisibilityIconType
}

export const CardHeaderComponent = (props: ICardHeaderProps) => {
  const { title, isVisible, hideCard, showCard, type = 'fold', headerClassName: className = '' } = props

  const handleVisibility = useCallback(
    e => {
      e.preventDefault()
      return isVisible ? hideCard(title) : showCard(title)
    },
    [isVisible, showCard, hideCard, title]
  )

  return (
    <div className={`card-header ${className}`}>
      <div className="d-flex justify-content-center">
        <div className="flex-grow-1 text-center pl-5">
          <h4 className="mb-0">{title}</h4>
        </div>
        <div className="px-2 d-print-none">
          <VisibilityToggle isVisible={isVisible} setVisibility={handleVisibility} size={1} type={type} />
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  hideCard: visibility.actions.addSelector,
  showCard: visibility.actions.deleteSelector,
}

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  hiddenSelectors: visibility.selectors.getSelectors(state),
})

const CardHeader = connect(
  null,
  mapDispatchToProps
)(CardHeaderComponent)

export const CardMultiSelect = connect(
  mapStateToProps,
  null
)(CardMultiComponent)

export const CardSingleSelect = connect(
  mapStateToProps,
  null
)(CardSingleSelectComponent)
