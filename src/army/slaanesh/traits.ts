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
    name: `Best of the Best (Invaders Host)`,
    effects: [
      {
        name: `Best of the Best (Invaders Host)`,
        desc: `You can re-roll wound rolls for attacks made by this general while they are within 6" of another hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glory Hog (Invaders Host)`,
    effects: [
      {
        name: `Glory Hog (Invaders Host)`,
        desc: `If any enemy units were destroyed in the combat phase, and this general is on the battlefield, you receive 1 command point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hurler of Obscenities (Invaders Host)`,
    effects: [
      {
        name: `Hurler of Obscenities (Invaders Host)`,
        desc: `You can pick 1 enemy hero within 6" of this general. Until the end of the combat phase, add 1 to the hit rolls for attacks made by that enemy hero but subtract 1 from the save rolls that target that enemy hero.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Territorial (Invaders Host)`,
    effects: [
      {
        name: `Territorial (Invaders Host)`,
        desc: `Add 1 to the number of depravity points you receive from Escalating Havoc if this general is wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Skin-taker (Invaders Host)`,
    effects: [
      {
        name: `Skin-taker (Invaders Host)`,
        desc: `If any enemy models were slain by wounds inflicted by this general's attacks in the combat phase, you can heal D3 wounds allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Delusions of Infallibility (Invaders Host)`,
    effects: [
      {
        name: `Delusions of Infallibility (Invaders Host)`,
        desc: `Add 1 to the wound characteristic of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Strength of Godhood (Pretenders Host)`,
    effects: [
      {
        name: `Strength of Godhood (Pretenders Host)`,
        desc: `Once per combat phase, in step 4 of the attack sequence, you can add D3 to the damage inflicted by 1 successful attack made by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Monarch of Lies (Pretenders Host)`,
    effects: [
      {
        name: `Monarch of Lies (Pretenders Host)`,
        desc: `Pick 1 enemy hero within 3" of this general. Subtract 1 from hit rolls for attacks made by that enemy hero in this phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `True Child of Slaanesh (Pretenders Host)`,
    effects: [
      {
        name: `True Child of Slaanesh (Pretenders Host)`,
        desc: `Before determining which player has the first turn, roll 6 dice. You receive 1 depravity point for each 5+.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Strongest Alone (Pretenders Host)`,
    effects: [
      {
        name: `Strongest Alone (Pretenders Host)`,
        desc: `You can re-roll hits roll for attacks made by this general while there are no other friendly models within 6" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hunter of Godbeasts (Pretenders Host)`,
    effects: [
      {
        name: `Hunter of Godbeasts (Pretenders Host)`,
        desc: `Add 1 to the damage inflicted by successful attacks made by this general that target a monster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Inspirer (Pretenders Host)`,
    effects: [
      {
        name: `Inspirer (Pretenders Host)`,
        desc: `Do not take battleshock tests for friendly Pretenders Host units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Hunter Supreme (Godseekers Host)`,
    effects: [
      {
        name: `Hunter Sumpreme (Godseekers Host)`,
        desc: `You can re-roll hit and wound rolls of 1 for attacks made by this general if this general made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thrill-seeker (Godseekers Host)`,
    effects: [
      {
        name: `Thrill-seeker (Godseekers Host)`,
        desc: `This general can run and charge in the same turn. If this general already has anability that does this, add 3 to the run rolls for this general instead.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Into the Fray (Godseekers Host)`,
    effects: [
      {
        name: `Into the Fray (Godseekers Host)`,
        desc: `The hit roll for the first attack made by this general during the battle is automatically a 6 (do not roll the dice).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Trail-sniffer (Godseekers Host)`,
    effects: [
      {
        name: `Trail-sniffer (Godseekers Host)`,
        desc: `Roll a D6 for this general if it is wholly within enemy territory. On a 3+ add 1 to attacks characteristic of this general's melee weapons until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Symphoniac (Godseekers Host)`,
    effects: [
      {
        name: `Symphoniac (Godseekers Host)`,
        desc: `Roll 1 dice for each enemy unit within 3" of this general. On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Speed-chaser (Godseekers Host)`,
    effects: [
      {
        name: `Speed-chaser (Godseekers Host)`,
        desc: `This general can retreat and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
]

export default CommandTraits
