import { tagAs } from 'factions/metatagger'
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
const CommandTraits = {
  // Invaders Host
  'Obessions of the Invader': {
    effects: [
      {
        name: `Best of the Best`,
        desc: `You can reroll wound rolls for attacks made by this general while they are within 6" of another hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Glory Hog`,
        desc: `If any enemy units were destroyed in the combat phase, and this general is on the battlefield, you receive 1 command point.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Hurler of Obscenities`,
        desc: `You can pick 1 enemy hero within 6" of this general. Until the end of the combat phase, add 1 to the hit rolls for attacks made by that enemy hero but subtract 1 from the save rolls that target that enemy hero.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Territorial`,
        desc: `Add 1 to the number of depravity points you receive from Escalating Havoc if this general is wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Skin-taker`,
        desc: `If any enemy models were slain by wounds inflicted by this general's attacks in the combat phase, you can heal D3 wounds allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Delusions of Infallibility`,
        desc: `Add 1 to the wound characteristic of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Pretenders Host
  'Aspects of the Perfect Liege': {
    effects: [
      {
        name: `Strength of Godhood`,
        desc: `Once per combat phase, in step 4 of the attack sequence, you can add D3 to the damage inflicted by 1 successful attack made by this general.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Monarch of Lies`,
        desc: `Pick 1 enemy hero within 3" of this general. Subtract 1 from hit rolls for attacks made by that enemy hero in this phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `True Child of Slaanesh`,
        desc: `Before determining which player has the first turn, roll 6 dice. You receive 1 depravity point for each 5+.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Strongest Alone`,
        desc: `You can reroll hits roll for attacks made by this general while there are no other friendly models within 6" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Hunter of Godbeasts`,
        desc: `Add 1 to the damage inflicted by successful attacks made by this general that target a monster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Inspirer`,
        desc: `Do not take battleshock tests for friendly Pretenders  units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Godseekers Host
  'Traits of the Seeker Supreme': {
    effects: [
      {
        name: `Hunter Sumpreme`,
        desc: `You can reroll hit and wound rolls of 1 for attacks made by this general if this general made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thrill-seeker`,
        desc: `This general can run and charge in the same turn. If this general already has anability that does this, add 3 to the run rolls for this general instead.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Into the Fray`,
        desc: `The hit roll for the first attack made by this general during the battle is automatically a 6 (do not roll the dice).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Trail-sniffer`,
        desc: `Roll a D6 for this general if it is wholly within enemy territory. On a 3+ add 1 to attacks characteristic of this general's melee weapons until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Symphoniac`,
        desc: `Roll 1 dice for each enemy unit within 3" of this general. On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Speed-chaser`,
        desc: `This general can retreat and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  // Lurid Haze Flavor
  'Lurid Haze': {
    effects: [
      {
        name: `Feverish Anticipation`,
        desc: `You can reroll run rolls for friendly Lurid Haze Invaders Host units that are wholly within 12" of this general before the run roll is made.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Faultless Blades Flavor
  'Faultless Blades': {
    effects: [
      {
        name: `Contest of Cruelty`,
        desc: `Friendly Faultless Blades Pretenders Host units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Scarlet Cavalcade Flavor
  'Scarlet Cavalcade': {
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
