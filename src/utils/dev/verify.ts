import { getArmyList } from 'meta/army_list'
import { BEASTS_OF_CHAOS } from 'meta/factions'
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
  const { Army } = armyList[BEASTS_OF_CHAOS]

  Army.Units?.forEach(unit => {
    const phaseStore = {}
    unit.effects.forEach(e => {
      Object.keys(phaseMap).forEach(phrase => {
        const phase = phaseMap[phrase]

        if (e.when.includes(phase)) return

        if (e.spell) {
          if (!e.when.includes(HERO_PHASE)) console.log(`${e.name} should be in ${HERO_PHASE}`)
          return
        }

        const regex = new RegExp(phrase, 'gi')
        if (regex.test(e.desc)) {
          console.log(`${e.name} should probably be in ${phase}`)
        }
      })
    })
  })
}

verify()
