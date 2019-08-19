import { TTraits } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, SHOOTING_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Eternal Vendetta`,
    effects: [
      {
        name: `Eternal Vendetta`,
        desc: `You can re-roll wound rolls for attacks made with melee weapons by this general that target an Order unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flames of Spite`,
    effects: [
      {
        name: `Flames of Spite`,
        desc: `If the unmodified wound roll for an attack made by this general is 6, the target suffers 1 mortal wound in addition to any normal damage.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Master of Deception`,
    effects: [
      {
        name: `Master of Deception`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hatred Incarnate`,
    effects: [
      {
        name: `Hatred Incarnate`,
        desc: `You can re-roll wound rolls of 1 for attacks made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lord of Terror`,
    effects: [
      {
        name: `Lord of Terror`,
        desc: `Subtract 1 from the bravery characterisic of enemy units while they are within 6" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Exalted Champion`,
    effects: [
      {
        name: `Exalted Champion`,
        desc: `Add 1 to the bravery characterisic of friendly Slaves to Darkness units while they are wholly within 12" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default CommandTraits
