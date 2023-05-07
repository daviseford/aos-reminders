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
        desc: `You can reroll wound rolls for attacks made by this general while it is within 6" of another HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Glory Hog': {
    effects: [
      {
        name: `Glory Hog`,
        desc: `At the end of the combat phase, if any enemy units were destroyed in that phase and this general is on the battlefield, you receive 1 command point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Hurler of Obscenities': {
    effects: [
      {
        name: `Hurler of Obscenities`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 6" of this general. Until the end of that phase, add 1 to hit rolls for attacks made by that HERO that target this general, but subtract 1 from save rolls for attacks that target that HERO.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Territorial: {
    effects: [
      {
        name: `Territorial`,
        desc: `You can reroll hit rolls for attacks made with melee weapons by this general if they are wholly within your territory.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skin-taker': {
    effects: [
      {
        name: `Skin-taker`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this general's attacks in that phase, you can heal up to D3 wounds allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Delusions of Infallibility': {
    effects: [
      {
        name: `Delusions of Infallibility`,
        desc: `Add 2 to the Wounds characteristic of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Pretenders Host - Aspects of the Perfect Liege
  'Strength of Godhood': {
    effects: [
      {
        name: `Strength of Godhood`,
        desc: `Once per combat phase, in step 4 of the attack sequence, you can add 1 to the damage inflicted by 1 successful attack made by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Monarch of Lies': {
    effects: [
      {
        name: `Monarch of Lies`,
        desc: `At the start of the combat phase, pick 1 enemy HERO within 3" of this general. Subtract 1 from hit rolls for attacks made by that HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Craving Stare': {
    effects: [
      {
        name: `Craving Stare`,
        desc: `If an enemy unit fails a battleshock test within 6" of this general, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Strongest Alone': {
    effects: [
      {
        name: `Strongest Alone`,
        desc: `You can reroll hit rolls for attacks made by this general while there are no other friendly models within 6" of them.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Hunter of Godbeasts': {
    effects: [
      {
        name: `Hunter of Godbeasts`,
        desc: `Add 1 to the damage inflicted by successful attacks made by this general that target a MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Inspirer: {
    effects: [
      {
        name: `Inspirer`,
        desc: `You can reroll battleshock tests for friendly PRETENDERS units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Godseekers Host
  'Hunter Supreme': {
    effects: [
      {
        name: `Hunter Supreme`,
        desc: `Reroll hit and wound rolls of 1 for attacks made with melee weapons by this general if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sweeping Slash': {
    effects: [
      {
        name: `Sweeping Slash`,
        desc: `After this general makes a charge move, roll a dice for each enemy unit within 1" of them. On a 2+, that unit suffers D3 mortal wounds.`,
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
        desc: `At the start of your hero phase, roll a dice if this general is wholly within enemy territory. On a 3+, add 1 to the Attacks characteristic of this general's melee weapons until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Symphoniac: {
    effects: [
      {
        name: `Symphoniac`,
        desc: `At the start of the combat phase, roll 1 dice for each enemy unit within 3" of this general. On a 3+, that unit suffers 1 mortal wound.`,
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

  'Feverish Anticipation': {
    effects: [
      {
        name: `Feverish Anticipation`,
        desc: `You can reroll run rolls for friendly LURID HAZE INVADERS HOST units that are wholly within 12" of this general when the run roll is made.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Contest of Cruelty': {
    effects: [
      {
        name: `Contest of Cruelty`,
        desc: `Friendly FAULTLESS BLADES PRETENDERS HOST units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Embodiment of Haste': {
    effects: [
      {
        name: `Embodiment of Haste`,
        desc: `You can reroll battleshock tests for friendly SCARLET CAVALCADE GODSEEKERS HOST units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
