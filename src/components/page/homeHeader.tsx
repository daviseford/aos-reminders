import { useIsMobile } from 'components/aos4/useIsMobile'
import Navbar from 'components/page/navbar'
import { useTheme } from 'context/useTheme'
import Switch from 'react-switch'
import Select from 'react-select'
import type { CanonicalId } from '../../aos4/domain'

interface HeaderProps {
  armyName: string
  factionId: CanonicalId<'faction'>
  factions: Array<{
    label: string
    value: CanonicalId<'faction'>
  }>
  isGameMode: boolean
  onFactionChange: (factionId: CanonicalId<'faction'>) => void
  onToggleGameMode: () => void
}

export const Header = ({
  armyName,
  factionId,
  factions,
  isGameMode,
  onFactionChange,
  onToggleGameMode,
}: HeaderProps) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const option = factions.find(faction => faction.value === factionId) ?? null
  const jumboClass = `jumbotron jumbotron-fluid text-center ${theme.headerColor} d-print-none mb-0 pt-4 ${
    isMobile ? 'pb-2' : 'pb-3'
  }`

  return (
    <div className={theme.headerColor}>
      <Navbar />

      <div className={jumboClass}>
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
                className={`align-self-center pb-2 mr-2 ${isGameMode ? '' : 'font-weight-bold'}`}
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
                className={`align-self-center pb-2 ml-2 ${isGameMode ? 'font-weight-bold' : ''}`}
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
                <div className="col-12 col-sm-9 col-md-6 col-lg-4 text-left">
                  <Select
                    aria-label="Faction"
                    value={option}
                    options={factions}
                    onChange={selected => selected && onFactionChange(selected.value)}
                    isClearable={false}
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
