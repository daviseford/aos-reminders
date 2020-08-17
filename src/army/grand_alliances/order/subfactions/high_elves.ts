import GenericEffects from 'army/generic/effects'
import { TUnits } from 'types/army'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

const InfantryHornblowerEffect = {
  name: `Hornblower`,
  desc: `Reroll dice rolls of 1 when determining how far this unit can run or charge while it includes any Hornblowers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}

export const LegacyHighElvesUnits: TUnits = [
  {
    name: `Highborn Repeater Bolt Thrower`,
    effects: [
      ...GenericEffects.CrewedWarMachine('War Machine'),
      {
        name: `Bolt Selection`,
        desc: `Each time a Highborn Repeater Bolt Thrower is fired in the shooting phase, the crew can load and fire either Ithilmar Bolts or volleys of Repeating Bolts. They cannot load and fire both in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Highborn Archers`,
    effects: [
      {
        name: `Hawkeye`,
        desc: `The leader of this unit is a Hawkeye. Add 1 to hit rolls for a Hawkeye in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 1 to the Bravery characteristic of the unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      InfantryHornblowerEffect,
      {
        name: `Aelven Archery`,
        desc: `Add 1 to hit rolls for this unit in the shooting phase while it has 20 or more models and there are no enemy models within 3" of it.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Storm of Arrows`,
        desc: `Once per battle, you can declare that this unit will fire a Storm of Arrows in their shooting phase; when you do so, add 1 to the Attacks characteristic of their Silverwood Longbows. This unit cannot fire a Storm of Arrows if there are any enemy models within 3" of it.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]
