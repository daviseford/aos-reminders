import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const WarbossBaseEffects = [
  {
    name: `Choppa Boss`,
    desc: `If this model is equipped with a pair of Boss Choppas, they make 8 attacks instead of 6.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Boss Shield`,
    desc: `You can reroll all failed save rolls for a model with a Boss Shield.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Waaagh!`,
    desc: `You can use this command ability in the combat phase. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly Orruk units while they are wholly within 18" of a friendly model with this command ability. The same unit cannot benefit from this command ability more than once per turn.`,
    when: [COMBAT_PHASE],
    command_ability: true,
  },
]
const WaaaghDrummersEffect = {
  name: `Waaagh! Drummers`,
  desc: `You can add 2 to the charge rolls of a unit that includes any Waaagh! Drummers.`,
  when: [CHARGE_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Orruk Warboss on Wyvern`,
    effects: [
      {
        name: `Agonising Venom`,
        desc: `If an enemy model suffers a wound from a Wyvern's Barbed, Venomous tail, but is not slain, roll a D6 at the end of the turn. On a 4+, that model suffers a mortal wound.`,
        when: [END_OF_TURN],
      },
      ...WarbossBaseEffects,
    ],
  },
  {
    name: `Orruk Warboss`,
    effects: [
      {
        name: `War Boar`,
        desc: `Some Orruk Warbosses ride to battle on War Boars; these models have Move 9" instead of 5" and gain the War Boar's Tusks attack.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Great Waaagh! Banner`,
        desc: `An Orruk Warboss with a Great Waaagh! Banner gains the Totem keyword. You can reroll wound rolls of 1 for attacks made with melee weapons by friendly Orruk units while they are wholly within 16" of a friendly Orruk Warboss with a Great Waaagh! Banner.`,
        when: [COMBAT_PHASE],
      },
      ...WarbossBaseEffects,
    ],
  },
  {
    name: `Orruk Great Shaman`,
    effects: [
      {
        name: `Waaagh! Energy`,
        desc: `Add 1 to casting rolls made by an Orruk Great Shaman that is within 8" of 20 or more Orruk models.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gaze of Mork`,
        desc: `Casting value of 6. Select up to 3 visible enemy units within 20". Roll a D6 for each unit chosen; on a 2-5 it suffers 1 mortal wound, and on a 6 it suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Mercenary Orruks`,
    effects: [
      {
        name: `Trophy Pole`,
        desc: `Add 1 to the Bravery of this unit while it includes a trophy pole.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Trophy Pole`,
        desc: `Roll a D6 whenever this model suffers a wound or a mortal wound; on a 4+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      WaaaghDrummersEffect,
      {
        name: `Shoot 'em Again, Boyz!`,
        desc: `While the Mercenary Boss is alive, you can shoot twice with this unit if it is more than 3" away from enemy units, and did not move in the preceding movement phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Orruks`,
    effects: [
      WaaaghDrummersEffect,
      {
        name: `Orruk Banner`,
        desc: `You can add 2 to the Bravery of all models in a unit that includes any Orruk Banners as long as there is an enemy model within 3" of the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Skull Icon`,
        desc: `If a model flees from a unit that includes any Skull Icons, roll a D6; on a 6 the Icon Bearer thumps some courage back into the cowardly Orruk - it returns to the fight and doesn't flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Choppas`,
        desc: `You can reroll hit rolls of 1 for a model attacking with two Choppas.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mob Rule`,
        desc: `Orruks make 1 extra attack with their melee weapons if their unit has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waaagh! Shield`,
        desc: `You can reroll save rolls for a unit with Waaagh! Shields in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ready Boyz! Aim! Fire!`,
        desc: `You can add 1 to the hits rolls of Orruk Bows if the unit using them is more than 3" away from any enemy units, and did not move in the preceding movement phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Orruk Boar Chariots`,
    effects: [
      {
        name: `Scythed Wheels`,
        desc: `Roll a D6 after an Orruk Boar Chariot has successfully charged during its turn: on a 4 or more it inflicts D3 mortal wounds on an enemy unit within 1".`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Tusker Charge`,
        desc: `You can reroll failed wound rolls when attacking with a War Boar's Tusks if its unit charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Orruk Boarboys`,
    effects: [
      {
        name: `Glyph Bearers`,
        desc: `You can add 2 to the Bravery of all models in a unit that includes any Glyph Bearers as long as there is an enemy model within 3" of the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Waaagh! Horns`,
        desc: `You can add 2 to the charge rolls of a unit that includes any Waaagh! Horns.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Tusker Charge`,
        desc: `You can reroll failed wound rolls when attacking with a War Boar's Tusks if its unit charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tusker Shield`,
        desc: `You can reroll save rolls for a unit with Tusker Shields in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]
