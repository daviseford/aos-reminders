import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Best of the Best (Invaders)`,
    effects: [
      {
        name: `Best of the Best (Invaders)`,
        desc: `You can re-roll wound rolls for attacks made by this general while they are within 6" of another hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glory Hog (Invaders)`,
    effects: [
      {
        name: `Glory Hog (Invaders)`,
        desc: `If any enemy units were destroyed in the combat phase, and this general is on the battlefield, you receive 1 command point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hurler of Obscenities (Invaders)`,
    effects: [
      {
        name: `Hurler of Obscenities (Invaders)`,
        desc: `You can pick 1 enemy hero within 6" of this general. Until the end of the combat phase, add 1 to the hit rolls for attacks made by that enemy hero but subtract 1 from the save rolls that target that enemy hero.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Territorial (Invaders)`,
    effects: [
      {
        name: `Territorial (Invaders)`,
        desc: `Add 1 to the number of depravity points you receive from Escalating Havoc if this general is wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Skin-taker (Invaders)`,
    effects: [
      {
        name: `Skin-taker (Invaders)`,
        desc: `If any enemy models were slain by wounds inflicted by this general's attacks in the combat phase, you can heal D3 wounds allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Delusions of Infallibility (Invaders)`,
    effects: [
      {
        name: `Delusions of Infallibility (Invaders)`,
        desc: `Add 1 to the wound characteristic of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Strength of Godhood (Pretenders)`,
    effects: [
      {
        name: `Strength of Godhood (Pretenders)`,
        desc: `Once per combat phase, in step 4 of the attack sequence, you can add D3 to the damage inflicted by 1 successful attack made by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Monarch of Lies (Pretenders)`,
    effects: [
      {
        name: `Monarch of Lies (Pretenders)`,
        desc: `Pick 1 enemy hero within 3" of this general. Subtract 1 from hit rolls for attacks made by that enemy hero in this phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `True Child of Slaanesh (Pretenders)`,
    effects: [
      {
        name: `True Child of Slaanesh (Pretenders)`,
        desc: `Before determining which player has the first turn, roll 6 dice. You receive 1 depravity point for each 5+.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Strongest Alone (Pretenders)`,
    effects: [
      {
        name: `Strongest Alone (Pretenders)`,
        desc: `You can re-roll hits roll for attacks made by this general while there are no other friendly models within 6" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hunter of Godbeasts (Pretenders)`,
    effects: [
      {
        name: `Hunter of Godbeasts (Pretenders)`,
        desc: `Add 1 to the damage inflicted by successful attacks made by this general that target a monster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Inspirer (Pretenders)`,
    effects: [
      {
        name: `Inspirer (Pretenders)`,
        desc: `Do not take battleshock tests for friendly Pretenders  units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Hunter Supreme (Godseekers)`,
    effects: [
      {
        name: `Hunter Sumpreme (Godseekers)`,
        desc: `You can re-roll hit and wound rolls of 1 for attacks made by this general if this general made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thrill-seeker (Godseekers)`,
    effects: [
      {
        name: `Thrill-seeker (Godseekers)`,
        desc: `This general can run and charge in the same turn. If this general already has anability that does this, add 3 to the run rolls for this general instead.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Into the Fray (Godseekers)`,
    effects: [
      {
        name: `Into the Fray (Godseekers)`,
        desc: `The hit roll for the first attack made by this general during the battle is automatically a 6 (do not roll the dice).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Trail-sniffer (Godseekers)`,
    effects: [
      {
        name: `Trail-sniffer (Godseekers)`,
        desc: `Roll a D6 for this general if it is wholly within enemy territory. On a 3+ add 1 to attacks characteristic of this general's melee weapons until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Symphoniac (Godseekers)`,
    effects: [
      {
        name: `Symphoniac (Godseekers)`,
        desc: `Roll 1 dice for each enemy unit within 3" of this general. On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Speed-chaser (Godseekers)`,
    effects: [
      {
        name: `Speed-chaser (Godseekers)`,
        desc: `This general can retreat and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
]

export default CommandTraits
