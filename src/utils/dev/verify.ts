import { getArmyList } from 'meta/army_list'
import {
  START_OF_MOVEMENT_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  END_OF_SETUP,
  SHOOTING_PHASE,
  CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  BATTLESHOCK_PHASE,
  MOVEMENT_PHASE,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
} from 'types/phases'
import { TEntry } from 'types/data'

const phaseMap = {
  'After armies are set up, but before': END_OF_SETUP,
  'charge rolls': CHARGE_PHASE,
  'in the combat phase': COMBAT_PHASE,

  'made with melee weapons': COMBAT_PHASE,

  'start of your battleshock phase': START_OF_BATTLESHOCK_PHASE,
  'start of your charge phase': START_OF_CHARGE_PHASE,
  'start of your combat phase': START_OF_COMBAT_PHASE,
  'start of your hero phase': START_OF_HERO_PHASE,
  'start of your movement phase': START_OF_MOVEMENT_PHASE,
  'start of your shooting phase': START_OF_SHOOTING_PHASE,

  'in your battleshock phase': BATTLESHOCK_PHASE,
  'in your charge phase': CHARGE_PHASE,
  'in your combat phase': COMBAT_PHASE,
  'in your hero phase': HERO_PHASE,
  'in your movement phase': MOVEMENT_PHASE,
  'in your shooting phase': SHOOTING_PHASE,

  'end of your battleshock phase': END_OF_BATTLESHOCK_PHASE,
  'end of your charge phase': END_OF_CHARGE_PHASE,
  'end of your combat phase': END_OF_COMBAT_PHASE,
  'end of your hero phase': END_OF_HERO_PHASE,
  'end of your movement phase': END_OF_MOVEMENT_PHASE,
  'end of your shooting phase': END_OF_SHOOTING_PHASE,

  'with missile weapons': SHOOTING_PHASE,
}

const verify = () => {
  const armyList = getArmyList()
  Object.keys(armyList).forEach(faction => {
    const { Army } = armyList[faction]

    const { Units = [] } = Army

    Units.forEach((unit: TEntry) => {
      unit.effects.forEach(e => {
        if (e.command_ability) return

        if (e.spell || unit.spell) {
          if (!e.when.includes(HERO_PHASE)) {
            return console.log(`${e.name} should be in ${HERO_PHASE}`)
          }
          return
        }

        if (!e.spell && new RegExp('Casting value of', 'gi').test(e.desc)) {
          return console.log(`${e.name} should be marked as a spell`)
        }

        Object.keys(phaseMap).forEach(phrase => {
          const phase = phaseMap[phrase]

          if (e.when.includes(phase)) return

          const regex = new RegExp(phrase, 'gi')
          if (regex.test(e.desc)) {
            console.log(`${e.name} should probably be in ${phase}`)
          }
        })
      })
    })
  })
}

verify()
