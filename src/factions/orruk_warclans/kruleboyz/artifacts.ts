import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, START_OF_COMBAT_PHASE, START_OF_SHOOTING_PHASE } from 'types/phases'

const KruleboyzArtifacts = {
  'Eye-biter Ash': {
    effects: [
      {
        name: `Eye-biter Ash`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will hurl the Eye-biter Ash at a foe. If you do so, pick 1 enemy unit within 3" of the bearer and roll a dice. On a 1-2, nothing happens. On a 3-4, subtract 1 from hit rolls for attacks made by that unit for the rest of that phase. On a 5+, subtract 1 from hit rolls for attacks made by that unit for the rest of the battle.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "Mork's Eye Pebble": {
    effects: [
      {
        name: `Mork's Eye Pebble`,
        desc: `Once per battle, at the start of the enemy shooting phase, you can say the bearer will rub their Mork's Eye Pebble. If you do so, the bearer and all friendly units wholly within 12" of the bearer have a ward of 5+ until the start of the next phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Beastkilla Slop': {
    effects: [
      {
        name: `Beastkilla Slop`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy MONSTER within 3" of the bearer and roll a dice. On a 1, nothing happens. On a 2-5, that MONSTER suffers D6 mortal wounds. On a 6, that MONSTER suffers 2D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Spiker Seeds': {
    effects: [
      {
        name: `Spiker Seeds`,
        desc: `Once per battle, after an enemy unit finishes a charge move within 6" of the bearer, you can say the bearer will throw their Spiker Seeds. If you do so, roll a dice for each model in that enemy unit, For each 5+, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(KruleboyzArtifacts, 'artifact')
