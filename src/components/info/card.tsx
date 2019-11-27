import React, { useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { ValueType } from 'react-select/src/types'
import { useTheme } from 'context/useTheme'
import { visibility, selectors } from 'ducks'
import { componentWithSize } from 'utils/mapSizesToProps'
import { VisibilityToggle, TVisibilityIconType } from 'components/info/visibilityToggle'
import { TDropdownOption, SelectMulti, TSelectOneSetValueFn, SelectOne } from 'components/input/select'
import { TUnits, TArtifacts, TBattalions, TTraits, TAllegiances, TSpells, TEndlessSpells } from 'types/army'
import { IStore } from 'types/store'

interface ICardProps {
  title: string
  mobileTitle?: string | null
  isVisible: boolean
  isMobile: boolean
}

const CardComponent: React.FC<ICardProps> = props => {
  const { title, isVisible, isMobile, mobileTitle, children } = props
  const { theme } = useTheme()

  const bodyClass = `${theme.cardBody} ${isVisible ? `` : `d-none`} ${isMobile ? `py-3` : ``}`
  const colMobile = isMobile && !isVisible ? `col w-50 px-1` : `col-12 px-1`
  const colDesktop = `col-sm-12 col-md-6 col-lg-4 col-xl-4 ${!isMobile ? `mb-2` : ``}`
  const colClass = `${colMobile} ${colDesktop} ${theme.bgColor} mx-auto mt-1`

  return (
    <div className={colClass}>
      <div className={theme.card}>
        <CardHeader isMobile={isMobile} isVisible={isVisible} title={title} mobileTitle={mobileTitle} />
        <div className={bodyClass}>{children}</div>
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
  mobileTitle?: string
  values: string[]
  enableLog?: boolean
}

const CardMultiComponent = (props: ICardMultiProps) => {
  const {
    items,
    setValues,
    values,
    hiddenSelectors,
    title,
    isMobile,
    mobileTitle = null,
    enableLog = false,
  } = props
  const selectItems = items.map(x => x.name)
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])
  const log = enableLog ? { enable: true, trait: title } : { enable: false }

  if (!items.length) return null
  return (
    <CardComponent isMobile={isMobile} title={title} isVisible={isVisible} mobileTitle={mobileTitle}>
      <SelectMulti values={values} items={selectItems} setValues={setValues} isClearable={true} log={log} />
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
  enableLog?: boolean
}

const CardSingleSelectComponent: React.FC<ICardSingleSelectProps> = props => {
  const { setValue, items, title, value = null, hiddenSelectors, isMobile, enableLog = false } = props
  const isVisible = useMemo(() => !hiddenSelectors.find(x => x === title), [hiddenSelectors, title])
  const log = enableLog ? { enable: true, trait: title } : { enable: false }

  return (
    <CardComponent isMobile={isMobile} title={title} isVisible={isVisible}>
      <SelectOne setValue={setValue} items={items} value={value} isClearable={true} log={log} />
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
  mobileTitle?: string | null
  type?: TVisibilityIconType
}

export const CardHeaderComponent = (props: ICardHeaderProps) => {
  const { title, isMobile, mobileTitle, isVisible, hideCard, showCard, type = 'minus', iconSize = 1 } = props

  const { theme } = useTheme()

  const handleVisibility = () => (isVisible ? hideCard(title) : showCard(title))

  useEffect(() => {
    if (isMobile && title !== 'Units') hideCard(title)
  }, [hideCard, isMobile, title])

  const styles = {
    cardHeader: `${theme.cardHeader} py-${isMobile ? 3 : 2}`,
    flexClass: `flex-grow-1 text-center ${!isMobile ? `pl-5` : ``}`,
    flexWrapperClass: `d-flex justify-content-${isMobile ? `end` : `center`} align-items-center`,
    vizWrapper: `${isMobile ? `pr-0` : `px-3`} d-print-none`,
  }

  const titleText = isMobile && mobileTitle ? mobileTitle : title

  return (
    <div className={styles.cardHeader} onClick={handleVisibility}>
      <div className={styles.flexWrapperClass}>
        <div className={styles.flexClass}>
          {isMobile ? (
            <h5 className="CardHeaderTitle text-nowrap">{titleText}</h5>
          ) : (
            <h4 className="CardHeaderTitle text-nowrap">{titleText}</h4>
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
  hiddenSelectors: selectors.getSelectors(state),
})

const CardHeader = connect(null, mapDispatchToProps)(CardHeaderComponent)

export const CardMultiSelect = connect(mapStateToProps, null)(componentWithSize(CardMultiComponent))

export const CardSingleSelect = connect(mapStateToProps, null)(componentWithSize(CardSingleSelectComponent))
