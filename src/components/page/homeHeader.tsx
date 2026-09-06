import Navbar from 'components/page/navbar'
import { useIsMobile } from 'utils/hooks/useIsMobile'
import { useTheme } from 'context/useTheme'
import Switch from 'react-switch'
import Select, { type Theme as SelectTheme } from 'react-select'
import type { CanonicalId } from '../../aos4/domain'

interface HeaderProps {
  armiesOfRenown: Array<{
    label: string
    value: CanonicalId
    overlay?: 'legends' | 'historical'
  }>
  armyName: string
  armyOfRenownId: CanonicalId | null
  /**
   * The catalog-bound half failed to load, so no faction change can be honoured: resolving a pick
   * means rebuilding the army against a catalog that is not here, and the shell has no way to hold
   * one until it is — the save guard it would have to cross is the same one that stops an unvalidated
   * document reaching storage.
   *
   * Mounted and disabled rather than removed, the way `Join`'s redeem button is. The select is the
   * only thing on this screen naming the army the player has, and taking it away would leave a
   * masthead that says nothing while the region below it says the load failed. Disabled, it keeps
   * the name and stops offering a choice that would quietly evaporate.
   */
  catalogUnavailable?: boolean
  factionId: CanonicalId<'faction'>
  factions: Array<{
    label: string
    value: CanonicalId<'faction'>
  }>
  isGameMode: boolean
  onArmyOfRenownChange: (armyOfRenownId: CanonicalId | null) => void
  onFactionChange: (factionId: CanonicalId<'faction'>) => void
  onToggleGameMode: () => void
  onToggleSeasonalRules: () => void
  /**
   * The seasonal rules switch (issue #1994): ON puts the army in the seasonal standard context
   * (the sitting General's Handbook), OFF in the current standard one (battletome and core rules
   * only). `null` hides the row entirely — before the catalog-bound half publishes there is
   * nothing to flip, and a document living outside those two contexts (Spearhead, a Legends-moved
   * import, a historical season) is not something the switch can speak for: a disabled switch
   * still shows a knob position, and either position would lie. Hidden follows the Army of Renown
   * row's precedent — masthead controls that do not apply are absent, not disabled.
   */
  seasonalRulesChecked: boolean | null
}

const NO_ARMY_OF_RENOWN = { label: 'None', value: null }

export const Header = ({
  armiesOfRenown,
  armyName,
  armyOfRenownId,
  catalogUnavailable = false,
  factionId,
  factions,
  isGameMode,
  onArmyOfRenownChange,
  onFactionChange,
  onToggleGameMode,
  onToggleSeasonalRules,
  seasonalRulesChecked,
}: HeaderProps) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const option = factions.find(faction => faction.value === factionId) ?? null
  // Current-standard armies list first; Legends (White Dwarf) and historical armies sit under
  // their own group header so their provenance stays visible, like every builder dropdown.
  const currentArmies = armiesOfRenown.filter(army => !army.overlay)
  const legendsArmies = armiesOfRenown.filter(army => army.overlay === 'legends')
  const historicalArmies = armiesOfRenown.filter(army => army.overlay === 'historical')
  const armyOfRenownOptions = [
    NO_ARMY_OF_RENOWN,
    ...currentArmies,
    ...(legendsArmies.length ? [{ label: 'Legends', options: legendsArmies }] : []),
    ...(historicalArmies.length ? [{ label: 'Scourge of Ghyran (2025-26)', options: historicalArmies }] : []),
  ]
  const armyOfRenownOption =
    [NO_ARMY_OF_RENOWN, ...armiesOfRenown].find(candidate => candidate.value === armyOfRenownId) ??
    NO_ARMY_OF_RENOWN
  /*
   * Bootstrap 5 dropped .jumbotron/.jumbotron-fluid. Nothing is lost here: after the utilities on
   * this same element (mb-0, pt-4, pb-2/pb-3, and theme.headerColor) the pair contributed only
   * padding-inline: 0 and border-radius: 0, which a bare <div> already has. Measured before and
   * after the upgrade, the element's box is unchanged.
   */
  const mastheadClass = `text-center ${theme.headerColor} d-print-none mb-0 pt-4 ${
    isMobile ? 'pb-2' : 'pb-3'
  }`
  // Both selects in the masthead take the same slot overrides — including the faction select's
  // disabled state on the catalog-failed screen, which would otherwise render react-select's own
  // palette beside its live neighbours.
  const selectColors = (defaultTheme: SelectTheme) => ({
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      ...theme.selectTheme,
    },
  })

  return (
    <div className={theme.headerColor}>
      <Navbar />

      <div className={mastheadClass}>
        <div className="container">
          <h1 className="text-white">Age of Sigmar Reminders</h1>
          <p className="mt-3 mb-1 d-none d-sm-block text-white">
            By Davis E. Ford -{' '}
            <a
              className="text-white"
              href="//daviseford.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Davis E. Ford website"
            >
              daviseford.com
            </a>
          </p>

          <div className="d-flex align-items-center justify-content-center text-white">
            <div className="d-inline-flex flex-row">
              {/*
                These labels stay click-to-toggle for the mouse, but they are not focusable: the
                switch below is the single keyboard control, and a focusable label that only fires
                in the opposite mode is a dead stop in the tab order.
              */}
              <span
                className={`align-self-center pb-2 me-2 ${isGameMode ? '' : 'fw-bold'}`}
                onClick={() => isGameMode && onToggleGameMode()}
              >
                Edit
              </span>
              <label htmlFor="game-mode-switch" className="mb-0">
                <Switch
                  onChange={onToggleGameMode}
                  checked={isGameMode}
                  onColor="#1C7595"
                  onHandleColor="#E9ECEF"
                  handleDiameter={30}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={20}
                  width={80}
                  className="react-switch"
                  id="game-mode-switch"
                  aria-label="Edit or play mode"
                />
              </label>
              <span
                className={`align-self-center pb-2 ms-2 ${isGameMode ? 'fw-bold' : ''}`}
                onClick={() => !isGameMode && onToggleGameMode()}
              >
                Play
              </span>
            </div>
          </div>

          {isGameMode ? (
            <div className="pt-1 pb-0 justify-content-center">
              <h2 className="text-white">{armyName}</h2>
            </div>
          ) : (
            <>
              <span className="text-white">Select your faction to get started:</span>
              <div className="d-flex pt-3 pb-2 justify-content-center">
                <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-start">
                  <Select
                    aria-label="Faction"
                    value={option}
                    options={factions}
                    onChange={selected => selected && onFactionChange(selected.value)}
                    isClearable={false}
                    isDisabled={catalogUnavailable}
                    className={theme.text}
                    theme={selectColors}
                  />
                </div>
              </div>
              {/*
                The sub-faction slot, reborn: an Army of Renown replaces the faction's regular
                rules, so the choice sits directly under the faction rather than among the
                content cards. Rendered only for factions that have one. The splash covers the
                masthead until the catalog's list arrives, so there is no reserved placeholder:
                the row is simply part of the finished screen when it appears.
              */}
              {armiesOfRenown.length > 0 ? (
                <>
                  <span className="text-white">Army of Renown:</span>
                  <div className="d-flex pt-3 pb-2 justify-content-center">
                    <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-start">
                      <Select
                        aria-label="Army of Renown"
                        value={armyOfRenownOption}
                        options={armyOfRenownOptions}
                        onChange={selected => onArmyOfRenownChange(selected?.value ?? null)}
                        isClearable={false}
                        className={theme.text}
                        theme={selectColors}
                      />
                    </div>
                  </div>
                </>
              ) : null}
              {/*
                The seasonal rules switch (issue #1994), styled after the Edit/Play toggle above.
                ON keeps the army under the sitting General's Handbook; OFF plays battletome and
                core rules only. It renders only for a document in one of the two standard-mode
                contexts — see `seasonalRulesChecked` — and only in edit mode, with the faction
                and Army of Renown selects it belongs beside: it reconfigures the army, which is
                an edit-mode act.
              */}
              {seasonalRulesChecked !== null && (
                <div className="d-flex align-items-center justify-content-center text-white pt-2">
                  <div className="d-inline-flex flex-row">
                    {/*
                      Click-to-toggle for the mouse like the Edit/Play labels, and like them not
                      focusable: the switch below is the single keyboard control.
                    */}
                    <span className="align-self-center pb-2 me-2" onClick={onToggleSeasonalRules}>
                      Seasonal rules
                    </span>
                    <label htmlFor="seasonal-rules-switch" className="mb-0">
                      <Switch
                        onChange={onToggleSeasonalRules}
                        checked={seasonalRulesChecked}
                        onColor="#1C7595"
                        onHandleColor="#E9ECEF"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={80}
                        className="react-switch"
                        id="seasonal-rules-switch"
                        aria-label="Seasonal rules"
                      />
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
