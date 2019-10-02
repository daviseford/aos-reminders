import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Barak-Zilfin, The Windswept City (Skyport)`,
    effects: [
      {
        name: `ARTYCLE: Master the Skies`,
        desc: `Re-roll hit and wounds of 1 vs flying units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `AMENDMENT: Don't Argue With the Wind`,
        desc: `When you run with a SKYVESSEL, result is always 6.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `FOOTNOTE: There's Always a Breeze if You Look for it`,
        desc: `Once per battle, one SKYVESSEL may move in the hero phase. It cannot run, and cannot use same turn as Aetherspheric Endrins.`,
        when: [HERO_PHASE],
      },
      {
        name: `Superlative Sailors`,
        desc: `Ignore mortal wounds on SKYVESSEL on roll of 6.`,
        when: [DURING_GAME],
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
      },
      {
        name: `AMENDMENT: Leave no Duardin Behind`,
        desc: `If unit within 7" of SKYVESSEL fails battleshock, does not flee on 5+.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `FOOTNOTE: Show them your steel`,
        desc: `Once per battle, one SKYFARER unit embarked may disembark and charge.`,
        when: [HERO_PHASE],
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
      },
      {
        name: `Where There's War, There's Gold`,
        desc: `Once per battle, one unit within 3" of enemy can pile-in and attack, or shoot.`,
        when: [HERO_PHASE],
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
      },
      {
        name: `AMENDMENT: Prosecute Wars With All Haste`,
        desc: `In first turn, units can run and shoot.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `FOOTNOTE: Who Strikes First, Strikes Hardest`,
        desc: `Once per battle, one unit can charge or pile-in and attack.`,
        when: [HERO_PHASE],
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
      },
      {
        name: `AMENDMENT: Trust to Your Guns`,
        desc: `+1 to bravery when not within 3" of enemies.`,
        when: [DURING_GAME],
      },
      {
        name: `Honour the Gods, Just in Case`,
        desc: `One per battle, re-roll one dice roll.`,
        when: [DURING_GAME],
      },
      {
        name: `Log of Grudges`,
        desc: `When picking enemy for Settle the Grudges, pick D3 instead.`,
        when: [END_OF_SETUP],
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
      },
      {
        name: `AMENDMENT: Trust Aethermatics, Not Superstition`,
        desc: `HEROES can unbind +1 spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `FOOTNOTE: Through Knowledge, Power`,
        desc: `Once per battle, HEROES can unbind +1 spell.`,
        when: [HERO_PHASE],
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
