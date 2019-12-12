import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Barak-Zilfin, The Windswept City (Skyport)`,
    effects: [
      {
        name: `ARTYCLE: Master the Skies`,
        desc: `You can re-roll hit and wound rolls of 1 for your units if their target can fly.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `AMENDMENT: Don't Argue With the Wind`,
        desc: `When you run with a SKYVESSEL, you are always considered to have rolled a 6.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
      {
        name: `FOOTNOTE: There's Always a Breeze if You Look for it`,
        desc: `Once per battle, in your hero phase, one of your SKYVESSELS can immediately move as if it were the movement phase (though it cannot run, and it cannot do this in a turn in which it descended using Aetherspheric Endrins). It can act normally for the remainder of your turn, including allowing embarked units to disembark in the hero phase.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Superlative Sailors`,
        desc: `Whenever a Barak-Zilfin SKYVESSEL suffers a mortal wound, roll a dice. On a roll of 6 that mortal wound is ignored.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Barak-Zon, City of the Sun (Skyport)`,
    effects: [
      {
        name: `ARTYCLE: Honour is Everything`,
        desc: `Re-roll hit and wounds of 1 vs HERO and MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `AMENDMENT: Leave no Duardin Behind`,
        desc: `If unit within 7" of SKYVESSEL fails battleshock, does not flee on 5+.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `FOOTNOTE: Show them your steel`,
        desc: `Once per battle, one SKYFARER unit embarked may disembark and charge.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Deeds, Not Words`,
        desc: `Re-roll wound rolls of 1 if unit charged this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Barak-Urbaz, The Market City (Skyport)`,
    effects: [
      {
        name: `ARTYCLE: Seek New Prospects`,
        desc: `Re-roll battleshock tests for units wholly within enemy territory.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `ARTYCLE: Seek New Prospects`,
        desc: `Re-roll battleshock tests for units wholly within enemy territory.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `FOOTNOTE: Where There's War, There's Gold`,
        desc: `Once per battle, one unit within 3" of enemy can pile-in and attack, or shoot.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Khemists Supreme`,
        desc: `Aether-Khemists can target 2 units with Aetheric Augmentation.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Barak-Mhornar, City of Shadow (Skyport)`,
    effects: [
      {
        name: `ARTYCLE: Seek New Prospects`,
        desc: `Re-roll battleshock tests for units wholly within enemy territory.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `AMENDMENT: Prosecute Wars With All Haste`,
        desc: `In first turn, units can run and shoot.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `FOOTNOTE: Who Strikes First, Strikes Hardest`,
        desc: `Once per battle, one unit can charge or pile-in and attack.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Fearsome Raiders`,
        desc: `Enemies within 3" add 1 to battleshock rolls.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Opportunistic Privateers`,
        desc: `Pick an enemy unit, re-roll failed hits vs that unit for all units within 3".`,
        when: [SHOOTING_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Barak-Thryng, City of the Ancestors (Skyport)`,
    effects: [
      {
        name: `ARTYCLE: Settle the Grudges`,
        desc: `Choose an enemy unit, re-roll hit and wounds of 1 vs this enemy.`,
        when: [END_OF_SETUP, DURING_GAME],
        command_trait: true,
      },
      {
        name: `AMENDMENT: Trust to Your Guns`,
        desc: `+1 to bravery when not within 3" of enemies.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `FOOTNOTE: Honour the Gods, Just in Case`,
        desc: `One per battle, re-roll one dice roll.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Log of Grudges`,
        desc: `When picking enemy for Settle the Grudges, pick D3 instead.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: 'Endless Skies (Custom Skyport)',
    effects: [
      {
        name: `Stick to the Code`,
        desc: `When you are not in a defined skyport, choose an ARTYCLE, AMENDMENT, and FOOTNOTE. (Located in the Traits drop down)`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Barak-Nar, City of the First Sunrise (Skyport)`,
    effects: [
      {
        name: `ARTYCLE: Respect Your Commanders`,
        desc: `Re-roll battleshock when within 8" of a HERO.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `AMENDMENT: Trust Aethermatics, Not Superstition`,
        desc: `HEROES can unbind +1 spell.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `FOOTNOTE: Through Knowledge, Power`,
        desc: `Once per battle, HEROES can unbind +1 spell.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Scholars and Commanders`,
        desc: `+1 to unbinding for all HEROES.`,
        when: [HERO_PHASE],
      },
      {
        name: `Champion of Progress`,
        desc: `Friendly units within 3" do not take battleshock tests.`,
        when: [DURING_GAME],
        command_trait: true,
      },
    ],
  },
]

export default Allegiances
