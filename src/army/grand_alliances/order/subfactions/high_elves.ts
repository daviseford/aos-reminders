import GenericEffects from 'army/generic/effects'
import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

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
const EnchantedShieldEffect = {
  name: `Enchanted Shield`,
  desc: `Reroll failed save rolls for this model.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
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
  {
    name: `Dragon Blades`,
    effects: [
      {
        name: `Drakemaster`,
        desc: `The leader of this unit is a Drakemaster. A Drakemaster makes 3 attacks rather than 2 with his Drake Lance and Sword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 to their Bravery instead if the unit is within 8" of another Order Draconis unit from your army that includes a Standard Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      HornblowerEffect,
      {
        name: `Lance Charge`,
        desc: `Add 1 to the wound rolls and Damage of this unit's Drake Lances and Swords if it charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Drake Shield`,
        desc: `You can reroll save rolls of 1 for a unit with Drake Shields. You can instead reroll failed save rolls of 1 or 2 for this unit in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Ancient Dignity`,
        desc: `This unit does not need to take a battleshock test if it is within 16" of any friendly Order Draconis Hero.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Seawarden on Foot`,
    effects: [
      EnchantedShieldEffect,
      {
        name: `Sea Drake Pennant`,
        desc: `A Seawarden with a Sea Drake Pennant gains the Totem keyword. Add 1 to all wound rolls for Highborn units from your army if they are within 8" of a friendly Sea Drake Pennant when they attack.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Stand Fast!`,
        desc: `If a Seawarden uses this ability, pick a friendly Highborn unit within 16". That unit cannot move or charge this turn, but you can reroll hit rolls, wound rolls and save rolls for it until your next hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Dragon Noble`,
    effects: [
      {
        name: `Aelven Purebred`,
        desc: `Some Dragon Nobles ride to battle on Aelven Purebreeds; these models have Move 12" instead of 6" and gain the steed's lthilmar-shod Hooves attack.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
      {
        name: `Phoenix Banner`,
        desc: `A Noble with a Phoenix Banner gains the Totem keyword. You can reroll any dice when determining the charge distance for Order Draconis units from your army if they are within 16" of this model when they charge.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Star Lance`,
        desc: `Add 1 to the wound rolls and Damage of a Star Lance if the Dragon Noble charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      EnchantedShieldEffect,
      {
        name: `Might of the Dragon`,
        desc: `If a Noble uses this ability, pick a Order Draconis unit within 16". Until your next hero phase you can reroll all failed hit rolls for that unit.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Dragonlord`,
    effects: [
      {
        name: `Dragon Lance`,
        desc: `Add 1 to the wound rolls and Damage of a Dragon Lance if the Dragonlord charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aelven War Horn`,
        desc: `Once per game, in your hero phase, a Dragonlord with an Aelven War Horn can blow it to sound the attack. When he does so, all models in Order Draconis units from your army within 10" of this model when they attack in your next combat phase make one extra attack with each of their melee weapons.`,
        when: [HERO_PHASE],
      },
      EnchantedShieldEffect,
      GenericEffects.Dragonfire,
      {
        name: `Lord of Dragons`,
        desc: `If a Dragonlord uses this ability, then until your next hero phase you can reroll failed hit rolls for any Order Draconis unit from your army that is within 10" when it attacks in the combat phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
]
