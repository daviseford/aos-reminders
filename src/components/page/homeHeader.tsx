import Navbar from 'components/page/navbar'
import { useIsMobile } from 'utils/hooks/useIsMobile'
import { useTheme } from 'context/useTheme'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FaInfoCircle } from 'react-icons/fa'
import Switch from 'react-switch'
import Select, { type Theme as SelectTheme } from 'react-select'
import type { CanonicalId, RulesContextId } from '../../aos4/domain'

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
  /**
   * The rules-season choice (issues #1994 and #2042): one select naming every standard season the
   * catalog carries (the sitting General's Handbook, any past season, and battletome-only rules).
   * `null` hides the row: before the catalog-bound half publishes there is nothing to choose, and
   * a document living outside those contexts (Spearhead, a Legends-moved import) is not something
   * the select can speak for, since any value it showed would lie. Hidden follows the Army of
   * Renown row's precedent: masthead controls that do not apply are absent, not disabled.
   */
  rulesSeason: Aos4RulesSeasonBinding | null
  onRulesSeasonChange: (rulesContextId: RulesContextId) => void
}

export interface Aos4RulesSeasonOption {
  /** e.g. `General’s Handbook 2026-27`, or `General’s Handbook 2025-26 (past)` */
  label: string
  value: RulesContextId
}

export interface Aos4RulesSeasonBinding {
  options: Aos4RulesSeasonOption[]
  /** The document's own context; always one of `options`. */
  value: RulesContextId
  /**
   * Set while the army plays a past season: the masthead carries the season's name and accuracy
   * caveat in both modes, because its warscrolls and points are today's, not the season's.
   */
  pastSeason: { label: string; caveat: string } | null
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
  rulesSeason,
  onRulesSeasonChange,
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
  const rulesSeasonOption =
    rulesSeason?.options.find(candidate => candidate.value === rulesSeason.value) ?? null
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
              {rulesSeason?.pastSeason && (
                <p className="text-white small mb-0" data-testid="past-season-notice">
                  {rulesSeason.pastSeason.label} (past season). {rulesSeason.pastSeason.caveat}
                </p>
              )}
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
                The rules season (issues #1994 and #2042), one select styled and sized like the two
                above it. It replaces a seasonal on/off switch plus a separate past-season link,
                which made the same choice look like two unrelated controls. Every move is
                non-destructive: only the rules context changes. It renders only for a document in
                one of the standard seasons (see `rulesSeason`) and only in edit mode, beside the
                selects it belongs with: it reconfigures the army, which is an edit-mode act.
              */}
              {rulesSeason && (
                <>
                  <span className="text-white">
                    Seasonal rules:
                    {/*
                      The options name the handbooks, not what a season adds, so an info control
                      carries the explanation. A real button: the tooltip has to be reachable by
                      keyboard (focus shows it) and announced by screen readers. The copy names no
                      handbook, so it survives the next one.
                    */}
                    <OverlayTrigger
                      placement="bottom"
                      trigger={['hover', 'focus']}
                      overlay={
                        <Tooltip id="seasonal-rules-tooltip">
                          Choose which General&apos;s Handbook season&apos;s rules join your reminders, or
                          None for battletome and core rules only.
                        </Tooltip>
                      }
                    >
                      <button
                        type="button"
                        className="bg-transparent border-0 text-white p-0 ms-2 align-baseline"
                        aria-label="What are seasonal rules?"
                      >
                        <FaInfoCircle aria-hidden />
                      </button>
                    </OverlayTrigger>
                  </span>
                  <div className="d-flex pt-3 pb-2 justify-content-center">
                    <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-start">
                      <Select
                        aria-label="Seasonal rules"
                        inputId="seasonal-rules-select"
                        value={rulesSeasonOption}
                        options={rulesSeason.options}
                        onChange={selected => selected && onRulesSeasonChange(selected.value)}
                        isClearable={false}
                        isSearchable={false}
                        // The season labels are longer than a faction name; on a phone they wrap
                        // rather than losing the "(past)" that tells them apart.
                        styles={{ singleValue: base => ({ ...base, whiteSpace: 'normal' }) }}
                        className={theme.text}
                        theme={selectColors}
                      />
                    </div>
                  </div>
                  {rulesSeason.pastSeason && (
                    <div className="text-white small" data-testid="past-season-notice">
                      {rulesSeason.pastSeason.caveat}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
