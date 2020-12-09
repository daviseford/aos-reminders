import GenericBattleTraits from 'army/generic/battle_traits'
import { TItemDescriptions } from 'factions/factionTypes'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const FleetOfWingEffect = {
  name: `Fleet of Wing`,
  desc: `If this model runs, roll 2D6 instead of one and use the total when determining how much extra it can move.`,
  when: [MOVEMENT_PHASE],
}
const SwifthawkDiscipline = {
  name: `Swifthawk Discipline`,
  desc: `If you fail a battleshock test for this unit whilst a Swifthawk Agents Hero from your army is within 16", halve the number of models that flee (rounding fractions up).`,
  when: [BATTLESHOCK_PHASE],
}
const InfantryHornblowerEffect = {
  name: `Hornblower`,
  desc: `Reroll dice rolls of 1 when determining how far this unit can run or charge while it includes any Hornblowers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}

export const LegacySwifthawkAgentUnits: TItemDescriptions = {
  Chariots: {
    effects: [
      {
        name: `Graceful Charge`,
        desc: `You can reroll all failed wound rolls for a Chariot in the combat phase if it made a charge in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swift and Deadly`,
        desc: `If a Chariot runs there is no need to roll a D6, it can always move up to an extra 6".`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Swift and Deadly`,
        desc: `Chariots can pile in up to 6", instead of 3".`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'High Warden': {
    effects: [
      {
        name: `Predatory Leap`,
        desc: `When this model piles in it can move up to 6" and can move over enemy models. Furthermore, it does not have to move towards the closest enemy model, as long as it ends its move within 1/2" of an enemy unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Starwood Lance`,
        desc: `Add 1 to the wound rolls and Damage of a Starwood Lance if this model charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hurricane Charge`,
        desc: `If a High Warden uses this ability, then until your next hero phase you can reroll any dice when determining the charge distance for Swifthawk Agents from your army if they are within 16" of this model when they charge.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  Reavers: {
    effects: [
      {
        name: `Harbinger`,
        desc: `The leader of this unit is a Harbinger. A Harbinger wields a Starsteel Blade in place of a Starwood Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aelven Purebreeds`,
        desc: `In the shooting phase, before or after making attacks with this unit, you can roll two dice and move all of the models in this unit up to that many inches. Models cannot start or end this move within 3" of an enemy unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Swift Volleys`,
        desc: `Models in this unit make 3 attacks with their Reaver Cavalry Bows if the unit is not within 3" of an enemy unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  Skycutters: {
    effects: [
      GenericBattleTraits.AelvenShield,
      {
        name: `Agents' Blades and Spears`,
        desc: `If a Skycutter is crewed by a trio of Agents, it makes 3 attacks with its Agents' Blades and Spears instead of 2.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fleet of Wing`,
        desc: `If this model runs, roll 2D6 instead of one and use the total when determining how much extra it can move.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Sky Chariot`,
        desc: `Skycutters can shoot even if they ran in their movement phase.`,
        when: [SHOOTING_PHASE],
      },
      SwifthawkDiscipline,
    ],
  },

  Skywarden: {
    effects: [
      {
        name: `Enchanted Shield`,
        desc: `You can reroll all failed save rolls for this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Swifthawk Pennant`,
        desc: `A Skywarden with a Swifthawk Pennant gains the Totem keyword. You can add 1 to all wound rolls for all Swifthawk Agents from your army if they are within 16" of this model when they attack.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Windrider`,
        desc: `A Skywarden has a Save of 4+ instead of 5+ in the shooting phase.`,
        when: [SAVES_PHASE],
      },
      FleetOfWingEffect,
      {
        name: `Swoop and Attack!`,
        desc: `If a Skywarden uses this ability, Swifthawk Agents in your army that can fly can charge in your next charge phase even if they ran this turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  Spireguard: {
    effects: [
      {
        name: `Watch Master`,
        desc: `The leader of this unit is a Watch Master. A Watch Master makes 2 attacks rather than 1 with a Silverwood Spear.`,
        when: [COMBAT_PHASE],
      },
      InfantryHornblowerEffect,
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 to their Bravery instead if the unit is within 8" of another Swifthawk Agents unit from your army that includes a Standard Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      GenericBattleTraits.AelvenShield,
      {
        name: `Strength of the Spireguard`,
        desc: `You can reroll hit rolls of 1 for a Spireguard if its unit has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      SwifthawkDiscipline,
    ],
  },
}
