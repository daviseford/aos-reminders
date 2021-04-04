import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
const CommandTraits = {
  // Invaders Host - Obessions of the Invader
  'Best of the Best': {
    effects: [
      {
        name: `Best of the Best`,
        desc: `You can reroll wound rolls for attacks made by this general while they are within 6" of another hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Glory Hog': {
    effects: [
      {
        name: `Glory Hog`,
        desc: `If any enemy units were destroyed in the combat phase, and this general is on the battlefield, you receive 1 command point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Hurler of Obscenities': {
    effects: [
      {
        name: `Hurler of Obscenities`,
        desc: `You can pick 1 enemy hero within 6" of this general. Until the end of the combat phase, add 1 to the hit rolls for attacks made by that enemy hero but subtract 1 from the save rolls that target that enemy hero.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Territorial: {
    effects: [
      {
        name: `Territorial`,
        desc: `You can reroll hit rolls for melee attacks made by this general while they are wholly within your territory.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skin-taker': {
    effects: [
      {
        name: `Skin-taker`,
        desc: `If any enemy models were slain by wounds inflicted by this general's attacks in the combat phase, you can heal D3 wounds allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Delusions of Infallibility': {
    effects: [
      {
        name: `Delusions of Infallibility`,
        desc: `Add 2 to the wounds characteristic of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Pretenders Host - Aspects of the Perfect Liege
  'Strength of Godhood': {
    effects: [
      {
        name: `Strength of Godhood`,
        desc: `Once per combat phase, in step 4 of the attack sequence, you can add D3 to the damage inflicted by 1 successful attack made by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Monarch of Lies': {
    effects: [
      {
        name: `Monarch of Lies`,
        desc: `Pick 1 enemy hero within 3" of this general. Subtract 1 from hit rolls for attacks made by that enemy hero in this phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Craving Stare': {
    effects: [
      {
        name: `Craving Stare`,
        desc: `Enemy units that fail battleshock tests within 6" of this general add D3 to the number of models fleeing.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Strongest Alone': {
    effects: [
      {
        name: `Strongest Alone`,
        desc: `You can reroll hits roll for attacks made by this general while there are no other friendly models within 6" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Hunter of Godbeasts': {
    effects: [
      {
        name: `Hunter of Godbeasts`,
        desc: `Add 1 to the damage inflicted by successful attacks made by this general that target a monster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Inspirer: {
    effects: [
      {
        name: `Inspirer`,
        desc: `You can reroll battleshock tests for friendly Pretenders units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Godseekers Host
  'Hunter Supreme': {
    effects: [
      {
        name: `Hunter Supreme`,
        desc: `You can reroll hit and wound rolls of 1 for attacks made by this general if this general made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sweeping Slash': {
    effects: [
      {
        name: `Sweeping Slash`,
        desc: `After this general makes a charge move, roll a D6 for each enemy unit within 1". On a 2+ the target suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Into the Fray': {
    effects: [
      {
        name: `Into the Fray`,
        desc: `The hit roll for the first attack made by this general during the battle is automatically a 6 (do not roll the dice).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Trail-sniffer': {
    effects: [
      {
        name: `Trail-sniffer`,
        desc: `Roll a D6 for this general if it is wholly within enemy territory. On a 3+ add 1 to attacks characteristic of this general's melee weapons until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Trail-sniffer`,
        desc: `If active, add 1 to melee attacks characteristic of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Symphoniac: {
    effects: [
      {
        name: `Symphoniac`,
        desc: `Roll 1 dice for each enemy unit within 3" of this general. On a 3+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Speed-chaser': {
    effects: [
      {
        name: `Speed-chaser`,
        desc: `This general can retreat and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  // Lurid Haze Flavor
  'Feverish Anticipation': {
    effects: [
      {
        name: `Feverish Anticipation`,
        desc: `You can reroll run rolls for friendly Lurid Haze Invaders Host units that are wholly within 12" of this general before the run roll is made.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Faultless Blades Flavor
  'Contest of Cruelty': {
    effects: [
      {
        name: `Contest of Cruelty`,
        desc: `Friendly Faultless Blades Pretenders Host units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Scarlet Cavalcade Flavor
  'Embodiment of Haste': {
    effects: [
      {
        name: `Embodiment of Haste`,
        desc: `You can reroll battleshock tests for friendly Scarlet Cavalcade Godseekers Host units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
