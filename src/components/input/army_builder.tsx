import type { CanonicalId } from '../../aos4/domain'
import type { createAos4BuilderViewModel } from '../../aos4/view'
import { CollapsibleCardHeader } from 'components/helpers/collapsibleCardHeader'
import { useIsMobile } from 'utils/hooks/useIsMobile'
import { useTheme } from 'context/useTheme'
import { useMemo, useState } from 'react'
import Select, { type MultiValue, type SingleValue } from 'react-select'

type BuilderViewModel = ReturnType<typeof createAos4BuilderViewModel>
type BuilderOption = BuilderViewModel['options'][number]
type BuilderBearer = BuilderViewModel['enhancementBearers'][number]

interface ArmyBuilderProps {
  builder: BuilderViewModel
  onSetEnhancementBearer: (enhancementId: CanonicalId, bearerId: CanonicalId | null) => void
  onSetGroupSelections: (groupIds: CanonicalId[], selectedIds: CanonicalId[]) => void
}

interface Option {
  label: string
  value: CanonicalId
  disabled: boolean
}

interface BearerOption {
  label: string
  value: CanonicalId
}

interface SelectionGroup {
  key: string
  title: string
  mobileTitle?: string
  options: BuilderOption[]
  bearers: BuilderBearer[]
}

const titles: Record<string, { title: string; mobileTitle?: string; order: number }> = {
  warscroll: { title: 'Units', order: 0 },
  'battle-formation': { title: 'Battle Formations', mobileTitle: 'Formations', order: 1 },
  'heroic-trait': { title: 'Heroic Traits', order: 2 },
  'artefact-of-power': { title: 'Artefacts of Power', mobileTitle: 'Artefacts', order: 3 },
  'spell-lore': { title: 'Spell Lores', order: 4 },
  'prayer-lore': { title: 'Prayer Lores', order: 5 },
  'manifestation-lore': { title: 'Manifestation Lores', mobileTitle: 'Manif. Lores', order: 6 },
  manifestation: { title: 'Manifestations', order: 7 },
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

const groupSelections = (options: BuilderOption[], bearers: BuilderBearer[]): SelectionGroup[] => {
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
      bearers: bearers.filter(bearer => bearer.groupType === key),
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
  onSetEnhancementBearer,
  onSetGroupSelections,
}: {
  group: SelectionGroup
  initiallyExpanded: boolean
  onSetEnhancementBearer: ArmyBuilderProps['onSetEnhancementBearer']
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
  // Current-standard content lists first; season-exclusive, Legends, and Scourge of Ghyran
  // content is always offered but sits under its own group header so its provenance stays
  // visible. The seasonal header also carries the disambiguation for the General's Handbook
  // 2026-27 enhancement tables, which share their battletome counterparts' names (#1979).
  const currentOptions = group.options.filter(option => !option.overlay && !option.seasonal).map(toOption)
  const seasonalOptions = group.options.filter(option => !option.overlay && option.seasonal).map(toOption)
  const legendsOptions = group.options.filter(option => option.overlay === 'legends').map(toOption)
  const historicalOptions = group.options.filter(option => option.overlay === 'historical').map(toOption)
  const options: Option[] = [...currentOptions, ...seasonalOptions, ...legendsOptions, ...historicalOptions]
  const groupedOptions = [
    ...currentOptions,
    ...(seasonalOptions.length
      ? [{ label: 'General’s Handbook 2026-27 (Scourge of Aqshy)', options: seasonalOptions }]
      : []),
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
          {/*
           * One "carried by" picker per selected heroic trait or artefact of power (#1992), so a
           * hand-built army can record what an imported roster states outright: which hero carries
           * the enhancement. Writes `enhancementBearers`, the field imports populate, so the
           * reminder's "Carried by your <unit>" tag renders identically either way. Clearing it
           * returns the reminder to the army-wide reading.
           */}
          {group.bearers.map(bearer => {
            const bearerOptions: BearerOption[] = bearer.bearerOptions.map(option => ({
              label: option.name,
              value: option.id,
            }))
            const bearerValue = bearerOptions.find(option => option.value === bearer.bearerId) ?? null
            const bearerInputId = `aos4-bearer-${bearer.enhancementId}`
            return (
              <div key={bearer.enhancementId} className="mt-2">
                <label className={`small mb-1 ${theme.textMuted}`} htmlFor={bearerInputId}>
                  {`${bearer.enhancementName} — Carried by`}
                </label>
                <Select<BearerOption, false>
                  inputId={bearerInputId}
                  value={bearerValue}
                  options={bearerOptions}
                  isClearable
                  placeholder="Army-wide"
                  onChange={(option: SingleValue<BearerOption>) =>
                    onSetEnhancementBearer(bearer.enhancementId, option?.value ?? null)
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
            )
          })}
        </div>
      </div>
    </div>
  )
}

const ArmyBuilder = ({ builder, onSetEnhancementBearer, onSetGroupSelections }: ArmyBuilderProps) => {
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
        ),
        builder.enhancementBearers
      ),
    [builder.options, builder.enhancementBearers]
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
            onSetEnhancementBearer={onSetEnhancementBearer}
            onSetGroupSelections={onSetGroupSelections}
          />
        ))}
      </div>
    </div>
  )
}

export default ArmyBuilder
