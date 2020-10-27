import { TAllegiances } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Ymetrica`,
    effects: [
      {
        name: `Mountain Realm`,
        desc: `The Enduring as Rock battle trait changes an attack that targets a YMETRICA ALARITH units in mountain stance to '-' if the weapon used for the attack has Rend -1 or -2.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Mountain's Gift`,
        desc: `Pick 1 of the bearer's weapons, once per phase add 1 damage inflicted by 1 attack. Additionally, roll a D6 each time you allocate a wound or mortal wound to the bearer, on a 6+ it is negated. Additionally, roll a D6 each time the bearer is inflicted by a spell or endless spell, on a 5+ ignore the effects.`,
        when: [COMBAT_PHASE, WOUND_ALLOCATION_PHASE, HERO_PHASE],
        artifact: true,
      },
      {
        name: `Redoubled Force`,
        desc: `Pick 1 YMETRICA ALARITH unit that has forced an enemy unit to move using the Tectonic Force battle trait for the first time in that phase and that is wholly within 18" of a friendly YMETRICA HERO. You can use Tectonic Force a second time by picking 1 other enemy unit within 1" of that friendly unit.`,
        when: [END_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Almighty Blow`,
        desc: `Instead of piling in and attacking, you can say you will unleash a single mighty blow. If you do so, pick one enemy unit with 1" of this general and roll 1 dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Syar`,
    effects: [
      {
        name: `The Perfect Blade`,
        desc: `Pick 1 of the bearer's weapons, an unmodified hit roll of 3+ always hits, an unmodified wound roll of 3+ always wounds and an unmodified save roll of 3 or less always fails.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gleaming Brightness`,
        desc: `SYAR units start the battle with 2 aetherquartz reserves instead of 1.`,
        when: [DURING_GAME],
      },
      {
        name: `Deplete Reserves`,
        desc: `You can use this command ability when a friendly SYAR unit could use an aetherquartz reserve ability, even if any friendly SYAR units have already done so in that phase. Pick 1 friendly SYAR unit that has any aetherquartz reserves and is wholly within 18" of a friendly SYAR HERO. That unit can use one of its aetherquartz reserves.`,
        when: [DURING_GAME],
        command_ability: true,
      },
      {
        name: `Goading Arrogance`,
        desc: `You can pick 1 enemy HERO within 6" of this general. That enemy HERO can only target this general in that phase. In addition, you can add 1 to hit rolls for attacks that target that enemy HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Iliatha`,
    effects: [
      {
        name: `Simulacra Amulet`,
        desc: `The first time the bearer is slain, roll a D6. 1-3 the bearer is slain. 4-6 the bearer is not slain, all wounds allocated to them are healed and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
      {
        name: `Soul-bond`,
        desc: `Add 2 to the Bravery characteristic of ILIATHA VANARI amd ILIATHA AELEMENTIRI units.`,
        when: [DURING_GAME],
      },
      {
        name: `Unity of Purpose`,
        desc: `After a friendly ILIATHA VANARI unit uses a command ability, you can pick 1 other friendly ILIATHA VANARI unit within 3" of that unit. That other unit can use that command ability without spending a command point. You can only use this ability once per phase.`,
        when: [DURING_GAME],
      },
      {
        name: `Strike in Unison`,
        desc: `You can use this command ability in your shooting phase or in the combat phase. If you do so, pick 1 friendly ILIATHA VANARI unit with 2 or more models. You can reroll hit rolls of 1 for that unit until the end of that phase.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Zaitrec`,
    effects: [
      {
        name: `Lambent Mystics`,
        desc: `Add 1 to the first casting, dispelling or unbinding roll you make for each ZAITREC WIZARD in each hero phase. In addition, each ZAITREC WIZARD HERO knows 1 extra spell form the appropriate lore.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fast Learner`,
        desc: `This general can attempt to unbind 1 extra spell in the enemy hero phase. In addition, the second time that this general attempts to unbind a spell in the same enemy hero phase, you can reroll the unbinding roll.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Gift of Celennar`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound (add 2 to the roll if TECLIS is part of your army and on the battlefield). On a 6+ the wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
      {
        name: `Overwhelming Heat`,
        desc: `All ZAITREC WIZARDS know Overwhelming Heat. Casting value of 7. Pick 1 enemy unit wholly within 24" of the caster and visible to them. Halve the Move characteristic of that unit until your next hero phase. Roll a D6, if the roll is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
        spell: true,
      },
    ],
  },
]

export default Allegiances
