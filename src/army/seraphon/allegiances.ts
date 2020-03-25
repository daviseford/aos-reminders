import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_FOUR_START_OF_TURN,
  TURN_ONE_MOVEMENT_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'

// These are sub-allegiances
const DRACOTHIANS_TAIL = `Dracothian's Tail`
const FANGS_OF_SOTEK = `Fangs of Sotek`
const KOATLS_CLAW = `Koatl's Claw`
const THUNDER_LIZARD = `Thunder Lizard`

export const SeraphonConstellations = {
  COALESCED_ALLEGIANCES: [KOATLS_CLAW, THUNDER_LIZARD],
  COALESCED: `Coalesced`,
  DRACOTHIANS_TAIL,
  FANGS_OF_SOTEK,
  KOATLS_CLAW,
  STARBORNE_ALLEGIANCES: [DRACOTHIANS_TAIL, FANGS_OF_SOTEK],
  STARBORNE: `Starborne`,
  THUNDER_LIZARD,
}

const Allegiances: TAllegiances = [
  {
    name: SeraphonConstellations.COALESCED,
    effects: [
      {
        name: SeraphonConstellations.COALESCED,
        desc: `If your army is a COALESCED army, you can give it the KOATL'S CLAW or THUNDER LIZARD keyword. All COALESCED units in your army gain that keyword and you can use the extra abilities listed for that Constellation (pg 64-67).`,
        when: [START_OF_SETUP],
      },
      {
        name: `Cold-blooded`,
        desc: `Ignore modifiers (positive or negative) to the Bravery characteristic of COALESCED units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Predatory Fighters`,
        desc: `Add 1 to the Attacks characteristic of Jaws weapons used by COALESCED units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Primeval Domain`,
        desc: `If a terrain feature is partially or wholly within the territory of a COALESCED army, then any Damned, Arcane, Inspiring and Mystical scenery rules for that terrain feature only apply to COALESCED units, while any Deadly and Sinister scenery rules for that terrain feature do not apply to COALESCED units.`,
        when: [DURING_GAME],
      },
      {
        name: `Scaly Skin`,
        desc: `Subtract 1 from the damage inflicted by each successful attack that targets a COALESCED unit (to a minimum of 1)`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: SeraphonConstellations.STARBORNE,
    effects: [
      {
        name: `Unfeeling`,
        desc: `STARBORNE units have a Bravery characteristic of 10 instead of the Bravery characteristic on their warscroll.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `You can summon STARBORNE units to the battlefield if you collect enough celestial conjuration points (CCPs). At the start of your hero phase you receive D3 celestial conjuration points if your general is a SLANN or STARSEER and is on the battlefield, and D3 CCP if there are one or more friendly SAURUS ASTROLITH BEARERS on the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `In addition, in your hero phase, before attempting to cast the first spell with each friendly SLANN or ORACLE, you can say that it will carry out a celestial conjuration. If you do so, you receive D3 celestial conjuration points but the number of spells which that model can attempt to cast in that phase is reduced by 1.`,
        when: [HERO_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `If you have 6 or more celestial conjuration points at the end of your movement phase, you can summon 1 or more units from the conjuration list to the battlefield and add them to your army. Each unit you summon costs a number of celestial conjuration points as shown on the list, and you can only summon a unit if you have enough celestial conjuration points to pay its cost.

        Summoned units must be set up wholly within 12" of a friendly SLANN, friendly ORACLE or friendly SAURUS ASTROLITH BEARER and more than 9" from any enemy units. Subtract the cost of the summoned unit from the number of celestial conjuration points you have immediately after the summoned unit has been set up. Summoned units have the STARBORNE keyword.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Lords of Space and Time`,
        desc: `At the end of your movement phase, you can pick 1 friendly STARBORNE unit anywhere on the battlefield to be transported through space and time.

        If you do so, remove that unit from the battlefield and then set it up on the battlefield anywhere that is more than 9" from any enemy unit.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Starborne Constellations`,
        desc: `If your army is a STARBORNE army, you can give it the DRACOTHION'S TAIL or FANGS OF SOTEK keyword. All STARBORNE units in your army gain that keyword and you can use the extra abilities listed for that Constellation (pg 64-67)`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: SeraphonConstellations.DRACOTHIANS_TAIL,
    effects: [
      {
        name: `Appear on Command`,
        desc: `Instead of setting up a friendly DRACOTHION'S TAIL unit on the battlefield, you can place it to one side and say that it is set up waiting to appear at command as a reserve unit. You can set up 1 reserve unit waiting to appear at command for each friendly DRACOTHION'S TAIL unit you have already set up on the battlefield.`,
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
        desc: `This general knows 1 extra spell from the Lore of Celestial Domination (pg 60). In addition, you can re-roll 1 casting, dispelling or unbinding roll for this general each hero phase.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Godbeast Pendant`,
        desc: `The first time the bearer is slain, before removing them from the battlefield, roll a dice. On a 1-3, the bearer is slain. On a 4-6, the bearer is not slain, all wounds allocated to them are healed, and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION],
        artifact: true,
      },
    ],
  },
  {
    name: SeraphonConstellations.FANGS_OF_SOTEK,
    effects: [
      {
        name: `First to Battle`,
        desc: `In the first battle round, add 3" to the Move characteristic of FANGS OF SOTEK SKINK units.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Parting Shot`,
        desc: `You can use this command ability at the end of the enemy charge phase. If you do so, pick 1 friendly FANGS OF SOTEK SKINKS unit from the Skinks warscroll, or friendly FANGS OF SOTEK CHAMELEON SKINKS unit, that is wholly within 18" of a friendly FANGS OF SOTEK HERO. That SKINKS or CHAMELEON SKINKS unit can shoot. After you have resolved all of that unit's shooting attacks, roll a dice. On a 4+, that unit can make a normal move; if it does, it must retreat but cannot run. A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Old and Grizzled`,
        desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a dice. On a 3+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Serpent God Dagger`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of any phase, if any wounds inflicted by that weapon in that phase were allocated to an enemy model and not negated, and that enemy model has not been slain, roll a dice. On a 5+, that enemy model is slain.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: SeraphonConstellations.KOATLS_CLAW,
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
        desc: `Roll a dice each time this general is used to issue a command to a friendly KOATL'S CLAW SAURUS unit. On a 4+, you receive 1 extra command point.`,
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
  {
    name: SeraphonConstellations.THUNDER_LIZARD,
    effects: [
      {
        name: `Mighty Beasts of War`,
        desc: `Add 2 to the Wounds characteristic of THUNDER LIZARD MONSTERS.`,
        when: [WOUND_ALLOCATION],
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
        desc: `In your shooting phase, you can pick 1 enemy unit within 12" of the bearer and visible to them and roll a dice. On a 1, this artefact cannot be used again for the rest of the battle. On a 2-3, nothing happens. On a 4-5 that enemy unit suffers D3 mortal wounds. On a 6, that enemy unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
