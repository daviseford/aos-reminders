import type { CanonicalId } from '../../aos4/domain'
import type { createAos4BuilderViewModel } from '../../aos4/view'
import { CollapsibleCardHeader } from 'components/helpers/collapsibleCardHeader'
import { useIsMobile } from 'utils/hooks/useIsMobile'
import { useTheme } from 'context/useTheme'
import { useMemo, useState } from 'react'
import Select, { type MultiValue } from 'react-select'

type BuilderViewModel = ReturnType<typeof createAos4BuilderViewModel>
type BuilderOption = BuilderViewModel['options'][number]

interface ArmyBuilderProps {
  builder: BuilderViewModel
  onSetGroupSelections: (groupIds: CanonicalId[], selectedIds: CanonicalId[]) => void
}

interface Option {
  label: string
  value: CanonicalId
  disabled: boolean
}

interface SelectionGroup {
  key: string
  title: string
  mobileTitle?: string
  options: BuilderOption[]
}

const titles: Record<string, { title: string; mobileTitle?: string; order: number }> = {
  warscroll: { title: 'Units', order: 0 },
  'battle-formation': { title: 'Battle Formations', mobileTitle: 'Formations', order: 1 },
  'artefact-of-power': { title: 'Artefacts of Power', mobileTitle: 'Artefacts', order: 2 },
  'spell-lore': { title: 'Spell Lores', order: 3 },
  'prayer-lore': { title: 'Prayer Lores', order: 4 },
  'manifestation-lore': { title: 'Manifestation Lores', mobileTitle: 'Manif. Lores', order: 5 },
  manifestation: { title: 'Manifestations', order: 6 },
  'regiment-of-renown': {
    title: 'Regiment Of Renown',
    mobileTitle: 'Regiments',
    order: Number.MAX_SAFE_INTEGER,
  },
}

const titleCase = (value: string) =>
  value
    .split('-')
    .map(part => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

const groupKey = (option: BuilderOption) => option.groupType ?? option.kind

const groupSelections = (options: BuilderOption[]): SelectionGroup[] => {
  const grouped = options.reduce((result, option) => {
    const key = groupKey(option)
    result.set(key, [...(result.get(key) ?? []), option])
    return result
  }, new Map<string, BuilderOption[]>())

  return Array.from(grouped, ([key, groupOptions]) => {
    const configured = titles[key]
    return {
      key,
      title: configured?.title ?? titleCase(key),
      ...(configured?.mobileTitle ? { mobileTitle: configured.mobileTitle } : {}),
      options: groupOptions,
    }
  }).sort(
    (left, right) =>
      (titles[left.key]?.order ?? Number.MAX_SAFE_INTEGER) -
        (titles[right.key]?.order ?? Number.MAX_SAFE_INTEGER) || left.title.localeCompare(right.title)
  )
}

const SelectionCard = ({
  group,
  initiallyExpanded,
  onSetGroupSelections,
}: {
  group: SelectionGroup
  initiallyExpanded: boolean
  onSetGroupSelections: ArmyBuilderProps['onSetGroupSelections']
}) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)
  const toOption = (option: BuilderOption): Option => ({
    label: option.name,
    value: option.id,
    disabled: !option.available && !option.selected,
  })
  // Current-standard content lists first; Legends and Scourge of Ghyran content is always offered
  // but sits under its own group header so its provenance stays visible.
  const currentOptions = group.options.filter(option => !option.overlay).map(toOption)
  const legendsOptions = group.options.filter(option => option.overlay === 'legends').map(toOption)
  const historicalOptions = group.options.filter(option => option.overlay === 'historical').map(toOption)
  const options: Option[] = [...currentOptions, ...legendsOptions, ...historicalOptions]
  const groupedOptions = [
    ...currentOptions,
    ...(legendsOptions.length ? [{ label: 'Legends', options: legendsOptions }] : []),
    ...(historicalOptions.length
      ? [{ label: 'Scourge of Ghyran (2025-26)', options: historicalOptions }]
      : []),
  ]
  const selectedValues = options.filter(option =>
    group.options.some(candidate => candidate.id === option.value && candidate.selected)
  )
  const title = isMobile && group.mobileTitle ? group.mobileTitle : group.title
  const selectionCount = selectedValues.length
  const bodyClass = `${theme.cardBody} ${isExpanded ? '' : 'd-none'} ${isMobile ? 'py-3' : ''}`
  /*
   * col-6, not the `col w-50` this carried before: `.col` sets `flex: 1 0 0%`, and a flex-basis of 0
   * wins over `width`, so `w-50` never applied. Collapsed cards sized to their own title text instead
   * — on a 390px phone the row tiled three-up, then two-up, then three-up, and a trailing card grew
   * to fill its row. col-6 is the two-up tiling DESIGN.md specifies, at one width for every card.
   */
  const colMobile = isMobile && !isExpanded ? 'col-6 px-1' : 'col-12 px-1'
  const colDesktop = `col-sm-12 col-md-6 col-lg-4 col-xl-4 ${isMobile ? '' : 'mb-2'}`
  const bodyId = `aos4-builder-${group.key}`

  const toggleExpanded = () => setIsExpanded(current => !current)

  return (
    <div className={`${colMobile} ${colDesktop} ${theme.bgColor} mx-auto mt-1`}>
      <div className={theme.card}>
        <CollapsibleCardHeader
          bodyId={bodyId}
          isExpanded={isExpanded}
          onToggle={toggleExpanded}
          title={`${title}${selectionCount && !isExpanded ? ` (${selectionCount})` : ''}`}
        />
        <div className={bodyClass} id={bodyId}>
          <Select<Option, true>
            aria-label={group.title}
            value={selectedValues}
            options={groupedOptions}
            isMulti
            isClearable
            closeMenuOnSelect={false}
            isOptionDisabled={option => option.disabled}
            onChange={(values: MultiValue<Option>) =>
              onSetGroupSelections(
                group.options.map(option => option.id),
                values.map(option => option.value)
              )
            }
            className={theme.text}
            theme={defaultTheme => ({
              ...defaultTheme,
              colors: {
                ...defaultTheme.colors,
                ...theme.selectTheme,
              },
            })}
          />
        </div>
      </div>
    </div>
  )
}

const ArmyBuilder = ({ builder, onSetGroupSelections }: ArmyBuilderProps) => {
  const isMobile = useIsMobile()
  const groups = useMemo(
    () =>
      groupSelections(
        // Armies of Renown are the masthead's top-level choice, not a builder card; showing the
        // root here as well would duplicate the control. Their granted abilities do surface,
        // as selected chips inside the standard category cards.
        builder.options.filter(
          option =>
            (option.kind === 'warscroll' ||
              option.kind === 'content-group' ||
              (option.kind === 'ability' && Boolean(option.groupType))) &&
            option.groupType !== 'army-of-renown'
        )
      ),
    [builder.options]
  )
  const rowClass = `row d-print-none pb-1 ${isMobile ? 'mx-1' : 'pt-2 w-75'}`

  return (
    <div className="d-flex justify-content-center">
      <div className={rowClass}>
        {groups.map((group, index) => (
          <SelectionCard
            key={group.key}
            group={group}
            initiallyExpanded={index === 0}
            onSetGroupSelections={onSetGroupSelections}
          />
        ))}
      </div>
    </div>
  )
}

export default ArmyBuilder
