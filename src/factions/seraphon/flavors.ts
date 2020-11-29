import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_FOUR_START_OF_TURN,
  TURN_ONE_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Flavors = {
  "Dracothion's Tail": {
    effects: [
      {
        name: `Appear on Command`,
        desc: `Instead of setting up a friendly DRACOTHION'S TAIL unit on the battlefield before the battle begins, you can place it to one side and say that it is set up waiting to appear at command as a reserve unit. You can set up 1 reserve unit waiting to appear at command for each friendly DRACOTHION'S TAIL unit you have already set up on the battlefield.`,
        when: [DURING_SETUP],
      },
      {
        name: `Appear on Command`,
        desc: `At the end of your movement phase, you can set up one or more of the reserve units waiting to appear at command on the battlefield, more than 9" from any enemy units and wholly within 18" of a friendly DRACOTHION'S TAIL SLANN.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Appear on Command`,
        desc: `Any reserve units waiting to appear at command which are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [TURN_FOUR_START_OF_TURN],
      },
      {
        name: `Ancient Knowledge`,
        desc: `This general knows 1 extra spell from the Lore of Celestial Domination (pg 60). In addition, you can reroll 1 casting, dispelling or unbinding roll for this general each hero phase.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Godbeast Pendant`,
        desc: `The first time the bearer is slain, before removing them from the battlefield, roll a D6. On a 1-3, the bearer is slain. On a 4-6, the bearer is not slain, all wounds allocated to them are healed, and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
    ],
  },

  'Fangs of Sotek': {
    effects: [
      {
        name: `First to Battle`,
        desc: `In the first battle round, add 3" to the Move characteristic of FANGS OF SOTEK SKINK units.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Parting Shot`,
        desc: `You can use this command ability when an enemy unit ends a charge move within 3" of a friendly FANGS OF SOTEK unit from the Skinks or Chameleon Skinks warscroll that is wholly within 18" of a friendly FANGS OF SOTEK HERO. If you do so, that unit can shoot. After you have resolved all of that unit's shooting attacks, roll a D6. On a 4+, that unit must retreat but cannot run. A unit cannot benefit from this command ability more than once per phase.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Old and Grizzled`,
        desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a D6. On a 3+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Serpent God Dagger`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of any phase, if any wounds inflicted by that weapon in that phase were allocated to an enemy model and not negated, and that enemy model has not been slain, roll a D6. On a 5+, that enemy model is slain.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },

  "Koatl's Claw": {
    effects: [
      {
        name: `Savagery Incarnate`,
        desc: `Add 1 to hit rolls for attacks made by friendly KOATL'S CLAW SAURUS units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Controlled Fury`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly KOATL'S CLAW SAURUS unit wholly within 24" of a friendly KOATL'S CLAW SAURUS HERO. That unit counts as having made a charge move in that turn for the purposes of the Savagery Incarnate ability.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Dominant Predator`,
        desc: `Roll a D6 each time this general is used to issue a command to a friendly KOATL'S CLAW SAURUS unit. On a 4+, you receive 1 extra command point.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Eviscerating Blade`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts 2 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },

  'Thunder Lizard': {
    effects: [
      {
        name: `Mighty Beasts of War`,
        desc: `Add 2 to the Wounds characteristic of THUNDER LIZARD MONSTERS.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Trove of Old One Technology`,
        desc: `You can use this command ability at the end of your shooting phase. If you do so, pick 1 friendly THUNDER LIZARDBASTILADON, or friendly THUNDER LIZARDENGINE OF THE GODS, that is wholly within 18" of a friendly THUNDER LIZARD HERO. If that unit is a BASTILADON, it can shoot with its Solar Engine even if it has already done so in that phase. If that unit is an ENGINE OF THE GODS, you can make a cosmic engine roll for it even if you have already done so in that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Prime Warbeast`,
        desc: `Add 1 to the Attacks characteristic of the weapons used by this general's mount.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Fusil of Conflagration`,
        desc: `In your shooting phase, you can pick 1 enemy unit within 12" of the bearer and visible to them and roll a D6. On a 1, this artefact cannot be used again for the rest of the battle. On a 2-3, nothing happens. On a 4-5 that enemy unit suffers D3 mortal wounds. On a 6, that enemy unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
}

export default Flavors
