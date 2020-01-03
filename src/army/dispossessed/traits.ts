import { TTraits } from 'types/army'
import { HERO_PHASE, DURING_GAME, COMBAT_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Resolute`,
    effects: [
      {
        name: `Resolute`,
        desc: `Friendly DISPOSSESSED units wholly within 12" of this general pass battleshock tests on a roll of 1 to 4, rather than only on a roll of 1 to 3 (see the Stubborn to the End battle trait).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Resilient`,
    effects: [
      {
        name: `Resilient`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Siegemaster`,
    effects: [
      {
        name: `Siegemaster`,
        desc: `Do not add 1 to the save rolls of enemy units that are in cover if they are attacked by this general or a friendly DISPOSSESSED unit wholly within 12" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Unforgiving`,
    effects: [
      {
        name: `Unforgiving`,
        desc: `Add 1 to wound rolls for attacks made by this general if the target is from a unit that has inflicted any wounds on this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Battle Fury`,
    effects: [
      {
        name: `Battle Fury`,
        desc: `Roll a D6 after this general completes their attacks in the combat phase; on a roll of 6+ they can fight again (do not roll again after completing the second set of attacks).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grudgebearer`,
    effects: [
      {
        name: `Grudgebearer`,
        desc: `Once per battle, if your general has not been slain, you can pick a new grudge in your hero phase to replace the original grudge you chose for your army (see "End of Setup").`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
