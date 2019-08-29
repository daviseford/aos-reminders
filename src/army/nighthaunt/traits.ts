import { TTraits } from 'types/army'
import { COMBAT_PHASE, SHOOTING_PHASE, START_OF_HERO_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Hatred of the Living`,
    effects: [
      {
        name: `Hatred of the Living`,
        desc: `You can re-roll failed hit rolls for attacks made with this general's melee weapons unless the target has the DEATH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Terrifying Entity`,
    effects: [
      {
        name: `Terrifying Entity`,
        desc: `At the start of the enemy movement phase, roll a D6 for each enemy unit within 3" of this model. If the roll is equal to or greater than that enemy unit's Bravery characteristic, that unit must make a retreat move in that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Lingering Spirit`,
    effects: [
      {
        name: `Lingering Spirit`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spiteful Spirit`,
    effects: [
      {
        name: `Spiteful Spirit`,
        desc: `Roll a D6 each time you allocate a wound to this general that was inflicted by a melee weapon. On a 5+, the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Cloaked in Shadow`,
    effects: [
      {
        name: `Cloaked in Shadow`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ruler of the Spirit Hosts`,
    effects: [
      {
        name: `Ruler of the Spirit Hosts`,
        desc: `At the start of your hero phase, you can pick a friendly SUMMONABLE NIGHTHAUNT unit within 9" of this general and return D3 slain models to that unit. The returning models must be set up within 9" of this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
