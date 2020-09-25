import { TVisibilityIconType, VisibilityToggle } from 'components/info/visibilityToggle'
import { SelectMulti, SelectOne, TDropdownOption, TSelectOneSetValueFn } from 'components/input/select'
import { useTheme } from 'context/useTheme'
import { selectors, visibility } from 'ducks'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { ValueType } from 'react-select/src/types'
import { TAllegiances, TArtifacts, TBattalions, TEndlessSpells, TSpells, TTraits, TUnits } from 'types/army'
import { IStore } from 'types/store'
import useWindowSize from 'utils/hooks/useWindowSize'

interface IBaseCardProps {
  label?: string
  mobileTitle?: string | null
  title: string
}

interface ICardProps extends IBaseCardProps {
  isVisible: boolean
  selectionCount?: number
}

const CardComponent: React.FC<ICardProps> = props => {
  const { title, isVisible, mobileTitle, children, selectionCount } = props
  const { isMobile } = useWindowSize()
  const { theme } = useTheme()

  const bodyClass = `${theme.cardBody} ${isVisible ? `` : `d-none`} ${isMobile ? `py-3` : ``}`
  const colMobile = isMobile && !isVisible ? `col w-50 px-1` : `col-12 px-1`
  const colDesktop = `col-sm-12 col-md-6 col-lg-4 col-xl-4 ${!isMobile ? `mb-2` : ``}`
  const colClass = `${colMobile} ${colDesktop} ${theme.bgColor} mx-auto mt-1`

  return (
    <div className={colClass}>
      <div className={theme.card}>
        <CardHeader
          isVisible={isVisible}
          title={title}
          mobileTitle={mobileTitle}
          selectionCount={selectionCount}
        />
        <div className={bodyClass}>{children}</div>
      </div>
    </div>
  )
}

interface ICardMultiProps extends IBaseCardProps {
  hiddenSelectors: string[] // state2props
  items: TUnits | TBattalions | TArtifacts | TTraits | TAllegiances | TSpells | TEndlessSpells
  selectionCount: number
  setValues: (selectValues: ValueType<TDropdownOption>[]) => void
  values: string[]
  enableLog?: boolean
}

const CardMultiComponent = (props: ICardMultiProps) => {
  const {
    enableLog = false,
    hiddenSelectors,
    items,
    label = null,
    mobileTitle = null,
    setValues,
    title,
    values,
  } = props

  const selectItems = items.map(x => x.name)
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])
  const log = enableLog ? { title, label: label || title } : null

  if (!items.length) return null

  return (
    <CardComponent
      title={title}
      isVisible={isVisible}
      mobileTitle={mobileTitle}
      selectionCount={values.length}
    >
      <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} log={log} />
    </CardComponent>
  )
}

interface ICardSingleSelectProps extends IBaseCardProps {
  enableLog?: boolean
  hiddenSelectors: string[] // state2props
  items: string[]
  selectionCount: number
  setValue: TSelectOneSetValueFn
  value?: string | null
}

const CardSingleSelectComponent: React.FC<ICardSingleSelectProps> = props => {
  const {
    enableLog = false,
    hiddenSelectors,
    items,
    label = null,
    mobileTitle = null,
    setValue,
    title,
    value = null,
  } = props
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])
  const log = enableLog ? { title, label: label || title } : null

  return (
    <CardComponent
      title={title}
      isVisible={isVisible}
      mobileTitle={mobileTitle}
      selectionCount={value ? 1 : 0}
    >
      <SelectOne setValue={setValue} items={items} value={value} isClearable={true} log={log} />
    </CardComponent>
  )
}

interface ICardHeaderProps extends IBaseCardProps {
  headerClassName?: string
  hideCard: (value: string) => void
  iconSize?: number
  isVisible: boolean
  selectionCount?: number
  showCard: (value: string) => void
  type?: TVisibilityIconType
}

export const CardHeaderComponent = (props: ICardHeaderProps) => {
  const {
    title,
    mobileTitle,
    isVisible,
    hideCard,
    showCard,
    type = 'minus',
    iconSize = 1,
    selectionCount,
  } = props
  const { theme } = useTheme()
  const { isMobile } = useWindowSize()

  const handleVisibility = () => (isVisible ? hideCard(title) : showCard(title))

  useEffect(() => {
    if (isMobile && title !== 'Units') hideCard(title)
  }, [hideCard, isMobile, title])

  const styles = {
    cardHeader: `${theme.cardHeader} py-${isMobile ? 3 : 2} ${isMobile ? `px-3` : ``}`,
    flexClass: `flex-grow-1 text-center ${!isMobile ? `pl-5` : ``}`,
    flexWrapperClass: `d-flex justify-content-${isMobile ? `end` : `center`} align-items-center`,
    vizWrapper: `${isMobile ? `pr-0` : `px-3`} d-print-none`,
  }

  const titleText = isMobile && mobileTitle ? mobileTitle : title
  const selectionCountText = selectionCount && !isVisible ? ` (${selectionCount})` : ``

  return (
    <div className={styles.cardHeader} onClick={handleVisibility}>
      <div className={styles.flexWrapperClass}>
        <div className={styles.flexClass}>
          {isMobile ? (
            <h5 className="CardHeaderTitle text-nowrap">
              {titleText}
              {selectionCountText}
            </h5>
          ) : (
            <h4 className="CardHeaderTitle text-nowrap">
              {titleText}
              {selectionCountText}
            </h4>
          )}
        </div>
        <div className={styles.vizWrapper}>
          <VisibilityToggle isVisible={isVisible} size={iconSize} type={type} />
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
  hiddenSelectors: selectors.selectSelectors(state),
})

const CardHeader = connect(null, mapDispatchToProps)(CardHeaderComponent)

export const CardMultiSelect = connect(mapStateToProps, null)(CardMultiComponent)
export const CardSingleSelect = connect(mapStateToProps, null)(CardSingleSelectComponent)
