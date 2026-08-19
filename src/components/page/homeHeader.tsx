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
  /**
   * Hold the Army of Renown row open while `armiesOfRenown` is still empty because the catalog has
   * not arrived, rather than because the faction has none.
   *
   * The row is rendered conditionally, so a shell that passed `[]` for a faction that does have
   * Armies of Renown would have the label and select *inserted* the moment the catalog landed,
   * pushing the builder and every reminder below it down the page. The faction index carries
   * `armiesOfRenownContextIndexes` for exactly this: reserve when the document's own rules context
   * is in that list, fill in on the real list. Answering per context matters — the same faction has
   * several in matched play and none in Spearhead — because a row reserved and then *removed*
   * shifts the page just as far as one inserted.
   */
  reserveArmyOfRenownSlot?: boolean
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
  reserveArmyOfRenownSlot = false,
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
  // Both selects in the masthead take the same slot overrides, and the reserved placeholder has to
  // take them too or it renders react-select's own palette next to the faction select's.
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
                content cards. Rendered only for factions that have one.
              */}
              {armiesOfRenown.length > 0 || reserveArmyOfRenownSlot ? (
                <>
                  <span className="text-white">Army of Renown:</span>
                  {/*
                    No `aria-busy` here. It sat on this wrapper because react-select would not
                    forward it to the control — which is precisely why it did nothing: a plain
                    <div> carrying a busy state is not a widget, and assistive technology has no
                    reason to look at it. Home announces the pending, ready, and failed states once,
                    properly, through a live region it owns for its whole life.
                  */}
                  <div className="d-flex pt-3 pb-2 justify-content-center">
                    <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-start">
                      {armiesOfRenown.length > 0 ? (
                        <Select
                          aria-label="Army of Renown"
                          value={armyOfRenownOption}
                          options={armyOfRenownOptions}
                          onChange={selected => onArmyOfRenownChange(selected?.value ?? null)}
                          isClearable={false}
                          className={theme.text}
                          theme={selectColors}
                        />
                      ) : (
                        /*
                          The same control, minus the answer. It keeps the live select's accessible
                          name so a screen reader meets one Army of Renown control rather than two,
                          and the same theme slots so its disabled surface stays dark in dark theme
                          — react-select's default disabled background is near-white, which is the
                          one inversion DESIGN.md's Slot Rule exists to prevent.
                        */
                        <Select
                          aria-label="Army of Renown"
                          value={null}
                          options={[]}
                          isDisabled
                          isClearable={false}
                          placeholder="Loading..."
                          className={theme.text}
                          theme={selectColors}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
