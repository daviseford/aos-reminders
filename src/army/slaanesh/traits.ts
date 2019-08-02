import { TCommandTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  // Invaders Host Traits
  {
    name: `(Battle Trait) Figureheads of the Dark Prince (Invaders)`,
    effects: [
      {
        name: `Figureheads of the Dark Prince (Invaders)`,
        desc: `This army can have up to 3 generals instead of 1.  Only 1 of the generals (your choice) can have a command trait but all 3 are considered to be a general for command ability purposes.  An Invaders Host general cannot use a command trait or command ability while within 12" of another Invaders Host general.  In addtion each time 1 of your generals is slain for the first time, you receive 1 extra command point.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `(Battle Trait) Escalating Havoc (Invaders)`,
    effects: [
      {
        name: `Escalating Havoc (Invaders)`,
        desc: `You receive D3 depravity points if any friendly Invaders Host units are wholly within enemy territory.  If 3 or more friendly Invaders Host units are wholly within enemy territory at the start of your hero phase, you receive D6 depravity points instead.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `(Battle Trait) Invaders Hedonite Host (Invaders)`,
    effects: [
      {
        name: `Invaders Hedonite Host (Invaders)`,
        desc: `A Hedonite Host battalion in an Invaders Host army must contain 2-4 Epicurean Revellers battalions and 0-2 Seeker Cavalcade battalions instead of the standard quantities.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Best of the Best (Invaders)`,
    effects: [
      {
        name: `Best of the Best (Invaders)`,
        desc: `You can re-roll wound rolls for attacks made by this general while they are within 6" of another hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
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
        command_trait: true,
      },
    ],
  },
  {
    name: `Hurler of Obscenities (Invaders)`,
    effects: [
      {
        name: `Hurler of Obscenities (Invaders)`,
        desc: `You can pick 1 enemy hero within 6" of this general.  Until the end of the combat phase, add 1 to the hit rolls for attacks made by that enemy hero but subtract 1 from the save rolls that target that enemy hero.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
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
        command_trait: true,
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
        command_trait: true,
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
        command_trait: true,
      },
    ],
  },
  // Pretenders Host Traits
  {
    name: `(Battle Trait) Heir to the Throne (Pretenders)`,
    effects: [
      {
        name: `(Battle Trait) Heir to the Throne (Pretenders)`,
        desc: `If the general of a Pretenders Host army is a hero, they have 2 different command traits instead of 1.  If you randomly generate traits, roll again if the second result matches the first.`,
        when: [START_OF_GAME],
      },
      {
        name: `(Battle Trait) Heir to the Throne (Pretenders)`,
        desc: `You can re-roll hit rolls of 1 for attacks made with melee and missle weapons by Pretenders Host units while they have 10 or more models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `(Battle Trait) Warlord Supreme (Pretenders)`,
    effects: [
      {
        name: `(Battle Trait) Warlord Supreme (Pretenders)`,
        desc: `You receive D3 depravity points if your general is within 3" of any enemy units.  If your general is within 3" of 3 or more enemy units you receive D6 depravity points instead.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `(Battle Trait) Pretenders Hedonite Host (Pretenders)`,
    effects: [
      {
        name: `(Battle Trait) Pretenders Hedonite Host (Pretenders)`,
        desc: `A Supreme Sybarites battalion in a Pretenders Host army must have only 1 Chaos Slaanesh hero instead of 3-6.`,
        when: [START_OF_GAME],
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
        command_trait: true,
      },
    ],
  },
  {
    name: `Monarch of Lies (Pretenders)`,
    effects: [
      {
        name: `Monarch of Lies (Pretenders)`,
        desc: `Pick 1 enemy hero within 3" of this general.  Subtract 1 from hit rolls for attacks made by that enemy hero in this phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `True Child of Slaanesh (Pretenders)`,
    effects: [
      {
        name: `True Child of Slaanesh (Pretenders)`,
        desc: `Before determining which player has the first turn, roll 6 dice.  You receive 1 depravity point for each 5+.`,
        when: [TURN_ONE_START_OF_ROUND],
        command_trait: true,
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
        command_trait: true,
      },
    ],
  },
  {
    name: `Hunter of the Godbeasts (Pretenders)`,
    effects: [
      {
        name: `Hunter of the Godbeasts (Pretenders)`,
        desc: `Add 1 to the damage inflicted by successful attacks made by this general that target a monster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Inspirer (Pretenders)`,
    effects: [
      {
        name: `Inspirer (Pretenders)`,
        desc: `Do not take battleshock tests for friendly Pretenders Host units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
    ],
  },
  // Godseekers Host Traits
  {
    name: `(Battle Trait) Thundering Cavalcade (Godseekers)`,
    effects: [
      {
        name: `Thundering Cavalcade (Godseekers)`,
        desc: `Add 1 charge rolls for units in a Godseekers Host army.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `(Battle Trait) Maniacal Hunters (Godseekers)`,
    effects: [
      {
        name: `Maniacal Hunters (Godseekers)`,
        desc: `You receive D3 depravity points if any friendly Godseekers Host units made a charge move in this phase.  If 3 or more friendly Godseekers Host units made a charge move in this phase receive D6 depravity points instead.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `(Battle Trait) Godseekers Hedonite Host (Godseekers)`,
    effects: [
      {
        name: `Godseekers Hedonite Host (Godseekers)`,
        desc: `A Hedonite Host in a Godseekers Host army must contain 0-2 Epicurean Revellers battalions and 2-4 Seeker Cavalcade battalions.`,
        when: [START_OF_GAME],
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
        command_trait: true,
      },
    ],
  },
  {
    name: `Thrill-seeker (Godseekers)`,
    effects: [
      {
        name: `Thrill-seeker (Godseekers)`,
        desc: `This general can run and charge in the same turn.  If this general already has anability that does this, add 3 to the run rolls for this general instead.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        command_trait: true,
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
        command_trait: true,
      },
    ],
  },
  {
    name: `Trail-sniffer (Godseekers)`,
    effects: [
      {
        name: `Trail-sniffer (Godseekers)`,
        desc: `Roll a dice for this general if it is wholly within enemy territory.  On a 3+ add 1 to attacks characteristic of this general's melee weapons until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Symphoniac (Godseekers)`,
    effects: [
      {
        name: `Symphoniac (Godseekers)`,
        desc: `Roll 1 dice for each enemy unit within 3" of this general.  On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
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
        command_trait: true,
      },
    ],
  },
]

export default CommandTraits
