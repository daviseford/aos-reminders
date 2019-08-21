import React, { useMemo, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { componentWithSize } from 'utils/mapSizesToProps'
import './card.css'
import { visibility } from 'ducks'
import { VisibilityToggle, TVisibilityIconType } from 'components/info/visibilityToggle'
import { TDropdownOption, SelectMulti, TSelectOneSetValueFn, SelectOne } from 'components/input/select'
import { ValueType } from 'react-select/src/types'
import { TUnits, TArtifacts, TBattalions, TTraits, TAllegiances, TSpells, TEndlessSpells } from 'types/army'
import { IStore } from 'types/store'

interface ICardProps {
  title: string
  isVisible: boolean
  isMobile: boolean
}

const CardComponent: React.FC<ICardProps> = props => {
  const { title, isVisible, isMobile, children } = props
  return (
    <div className={`col col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3`}>
      <div className="card">
        <CardHeader
          isMobile={isMobile}
          isVisible={isVisible}
          title={title}
          headerClassName={'SelectorHeader'}
        />
        <div className={`card-body${isVisible ? `` : ` d-none`}`}>{children}</div>
      </div>
    </div>
  )
}

interface ICardMultiProps {
  hiddenSelectors: string[] // state2props
  isMobile: boolean
  items: TUnits | TBattalions | TArtifacts | TTraits | TAllegiances | TSpells | TEndlessSpells
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  title: string
  values: string[]
}

const CardMultiComponent = (props: ICardMultiProps) => {
  const { items, setValues, values, hiddenSelectors, title, isMobile } = props
  const selectItems = items.map(x => x.name)
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])

  if (!items.length) return null
  return (
    <CardComponent isMobile={isMobile} title={title} isVisible={isVisible}>
      <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} />
    </CardComponent>
  )
}

interface ICardSingleSelectProps {
  hiddenSelectors: string[] // state2props
  isMobile: boolean
  items: string[]
  setValue: TSelectOneSetValueFn
  title: string
  value?: string | null
}

const CardSingleSelectComponent: React.FC<ICardSingleSelectProps> = props => {
  const { setValue, items, title, value = null, hiddenSelectors, isMobile } = props
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])

  return (
    <CardComponent isMobile={isMobile} title={title} isVisible={isVisible}>
      <SelectOne setValue={setValue} items={items} value={value} isClearable={true} />
    </CardComponent>
  )
}

interface ICardHeaderProps {
  headerClassName?: string
  hideCard: (value: string) => void
  iconSize?: number
  isMobile: boolean
  isVisible: boolean
  showCard: (value: string) => void
  title: string
  type?: TVisibilityIconType
}

export const CardHeaderComponent = (props: ICardHeaderProps) => {
  const {
    title,
    isMobile,
    isVisible,
    hideCard,
    showCard,
    type = 'minus',
    headerClassName = '',
    iconSize = 1,
  } = props

  const handleVisibility = useCallback(
    e => {
      e.preventDefault()
      return isVisible ? hideCard(title) : showCard(title)
    },
    [isVisible, showCard, hideCard, title]
  )

  useEffect(() => {
    if (isMobile && title !== 'Units') hideCard(title)
  }, [hideCard, isMobile, title])

  return (
    <div className={`card-header ${headerClassName}`}>
      <div className="d-flex justify-content-center">
        <div className="flex-grow-1 text-center pl-5">
          <h4 className="mb-0">{title}</h4>
        </div>
        <div className="px-2 d-print-none">
          <VisibilityToggle
            isVisible={isVisible}
            setVisibility={handleVisibility}
            size={iconSize}
            type={type}
          />
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
)(componentWithSize(CardMultiComponent))

export const CardSingleSelect = connect(
  mapStateToProps,
  null
)(componentWithSize(CardSingleSelectComponent))
