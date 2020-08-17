import GenericEffects from 'army/generic/effects'
import { TUnits } from 'types/army'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, COMBAT_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

const StandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `Add 1 to the Bravery characteristic of the unit while it includes any Standard Bearers.`,
  when: [BATTLESHOCK_PHASE],
}
const HornblowerEffect = {
  name: `Hornblower`,
  desc: `Reroll any dice rolls of 1 when determining how far this unit can run or charge while it includes any Hornblowers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}

export const LegacyHighElvesUnits: TUnits = [
  {
    name: `Highborn Repeater Bolt Thrower`,
    effects: [
      ...GenericEffects.CrewedWarMachine('Crewed War Machine'),
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
      StandardBearerEffect,
      HornblowerEffect,
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
  {
    name: `Highborn Spearmen`,
    effects: [
      {
        name: `Sentinel`,
        desc: `The leader of this unit is a Sentinel. Add 1 to the Attacks characteristic of the Sentinel's Silverwood Spear.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      ...GenericEffects.AelvenShield,
      {
        name: `Militia`,
        desc: `Add 1 to the Attacks characteristic of this unit's Silverwood Spears while it has 20 or more models. Spear Phalanx.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spear Phalanx`,
        desc: `Reroll hit rolls of 1 for this unit if it did not move in its preceding movement phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Highborn Silver Helms`,
    effects: [
      {
        name: `High Helm`,
        desc: `The leader of this unit is a High Helm. Add 1 to the Attacks characteristic of the High Helm's Ithilmar Lance and Sword.`,
        when: [COMBAT_PHASE],
      },
      HornblowerEffect,
      StandardBearerEffect,
      ...GenericEffects.AelvenShield,
      {
        name: `Lance Charge`,
        desc: `Add 1 to wound rolls for this unit's Ithilmar Lances and Swords and increase the Damage characteristic of the weapons by 1 if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]
