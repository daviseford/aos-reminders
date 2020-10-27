import { TAllegiances } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// This is where we store sub-allegiances such as
// Grand Courts, Hosts, Clans, Glades, Lodges, etc
const Allegiances: TAllegiances = [
  {
    name: `Mortis Praetorians`,
    effects: [
      {
        name: `The Dread Legion`,
        desc: `Subtract 1 from the Bravery characteristic of enemy untis while they are within 12" of any friendly MORTIS PRAETORIANS units.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Counter-strike`,
        desc: `You can use this command ability at the end of the enemy charge phase. If you do so, pick 1 friendly MORTIS PRAETORIANS unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly MORTIS PRAETORIANS HERO. Until the end of that turn, you can reroll hit rolls for attacks made by that unit that target an enemy unit that made a charge move in the same turn.`,
        when: [END_OF_CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Katakros' Chosen`,
        desc: `Once per battle, at the start of your hero phase, if this general is on the battlefield you can receive D3 additional relentless discipline points.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Artificer's Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Change the Rend characteristic of that weapon to -3.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Petrifex Elite`,
    effects: [
      {
        name: `Unstoppable Juggernauts`,
        desc: `Reroll save rolls of 1 for attacks made with melee weapons that target PETRIFEX ELITE units.'`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Bludgeon`,
        desc: `You can use this command ability in a combat phase. If you do so, pick 1 friendly PETRIFEX ELITE unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly PETRIFEX ELITE HERO. In that combat phase, improve the Rend characteristic of melee weapons used by that unit by 1. You cannot pick the same unit to benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Mighty Archaeossian`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Godbone Armour`,
        desc: `The first wound allocated to the bearer in each phase is negated.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Stalliarch Lords`,
    effects: [
      {
        name: `Equumortoi`,
        desc: `STALLIARCH LORDS units can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Rally Back`,
        desc: `You can use this command ability in your movement phase. If you do so, pick 1 friendly STALLIARCH LORDS unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly STALLIARCH LORDS HERO. That unit can retreat and still charge later in the same turn, as long as it did not run.`,
        when: [MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Twisted Challenge`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this general. Until the end of that phase, add 1 to hit rolls made by this general that target that enemy HERO, but subtract 1 from hit rolls for attacks made by this general that target any other unit.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Nadir-bound Mount`,
        desc: `You can roll D3 additional dice when this LIEGE uses their Unstoppable Charge ability.`,
        when: [CHARGE_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Ivory Host`,
    effects: [
      {
        name: `Simmering Rage`,
        desc: `At the start of the combat phase, each friendly IVORY HOST unit within 6" of a friendly IVORY HOST model that currently has any wounds allocated to it becomes subject to rage until the end of that phase. Add 1 to hit rolls for attacks made by a unit that is subject to rage, but subtract 1 from save rolls for attacks that target a unit that is subject to rage.`,
        when: [START_OF_COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Temper Fury`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly IVORY HOST unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly IVORY HOST HERO. In that phase, do not subtract 1 from save rolls for attacks that target that unit because of their rage, but still add 1 to the hit rolls for attacks made by that unit.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Scrimshawed Savage`,
        desc: `In each of your hero phases, roll a D6 for this general. On a 5+, add 1 to the Attacks characteristic of melee weapons used by this general for the rest of the battle.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Beastbone Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Add 1 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Null Myriad`,
    effects: [
      {
        name: `Eldritch Nulls`,
        desc: `Each time a friendly NULL MYRIAD unit is affected by a spell or endless spell, you can roll a D6. If you do so, on a 5+, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Holdfast`,
        desc: `You can use this command ability before you use the Eldritch Nulls ability for a unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly NULL MYRIAD HERO; that unit is not affected by the spell or endless spell on a roll of 2+ instead of 5+.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Unsettling and Sinister`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general. In addition, subtract 1 from the Bravery characteristic of enemy units while they are within 3" of this general.`,
        when: [COMBAT_PHASE, DURING_GAME],
        command_trait: true,
      },
      {
        name: `Baleful Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Do not make save rolls for attacks made with that weapon, and wounds inflicted by that weapon cannot be negated when they are allocated to a model(the wounds can be healed later in the battle).`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Crematorians`,
    effects: [
      {
        name: `Immolation`,
        desc: `Roll a D6 each time a friendly CREMATORIANS model is slain by an attack made with a melee weapon, before the slain model is removed from play. Add 1 to the roll if the slain model is a HERO or MONSTER. On a 5+, pick 1 enemy unit within 3" of the slain model. That unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Levellers of Cities`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly CREMATORIANS unit that either has the HEKATOS keyword, or is wholly within 6" of a friendly Mortis Hekatos, or is wholly within 12" of a friendly CREMATORIANS HERO. Do not apply the cover modifier to save rolls for attacks made with melee weapons by that CREMATORIANS unit in that phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Wrathful Avenger`,
        desc: `If this general is slain, add 2 to the Immolation dice roll instead of 1, and if the roll is successful inflict D3 mortal wounds on the enemy unit instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
        command_trait: true,
      },
      {
        name: `Searing Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Add 1 to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
