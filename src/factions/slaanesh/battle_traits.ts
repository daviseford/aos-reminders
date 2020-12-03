import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Battle traits available to factions and subfactions.
const BattleTraits = {
  // Slaanesh Allegiance
  'Thrilling Compulsions': {
    effects: [
      {
        name: `Feast of Depravities`,
        desc: `Each time a wound or mortal wound is inflicted on an enemy model by an attack or spell cast made by a friendly Slaanesh hero, and that enemy model is not slain by that wound, you receive 1 depravity point. In addition, every time a wound or mortal wound is allocated to a friendly Slaanesh Hero and not negated, and that friendly model is not slain by that wound or mortal would, you receive 1 depravity point.
      
               Unit abilities and endless spell damage cannot generate depravity.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Feast of Depravities`,
        desc: `If you have any depravity points you may summon one or more units from the summoning table. Summoned units must be setup wholly within 12" of a friendly Slaanesh Hero and more than 9" from any enemy models.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Feast of Depravities`,
        desc: `Summoning Costs:
             1 Keeper of Secrets                  45 DP
             30 Daemonettes -                     40 DP
             3 Seeker Chariots -                  35 DP
             20 Daemonettes -                     28 DP
             1 Contorted Epitome -                23 DP
             1 Bladebringer on Exalted Chariot -  23 DP
             3 Fiends -                           23 DP
             1 Bladebringer on Hellflayer -       20 DP
             1 Exalted Chariot -                  20 DP
             1 Infernal Enrapturess -             17 DP
             1 Bladebringer on Seeker Chariot -   17 DP
             1 Hellflayer -                       17 DP
             1 Viceleader -                       15 DP
             1 Seeker Chariot -                   15 DP
             5 Seekers -                          15 DP
             10 Daemonettes -                     14 DP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Locus of Diversion`,
        desc: `Each friendly Hedonite hero that is within 6" of an enemy unit can create a Locus of Diversion. If they do, select 1 enemy unit within 6" of the selected hero and roll a D6, adding 2 if the Hedonite hero is a Greater Daemon. On a 5+, that enemy unit fights at the end of the following combat phase, after the players have picked any other units to fight in that combat phase. You cannot pick the same unit as the target for this ability more than once in the same charge phase (whether successful or not).`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Euphoric Killers`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a Chaos Slaanesh model is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound or save roll for each hit. If the attacking unit is 20 or more models, its attacks inflict 3 hits instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Invaders Host
  "The Despoiler's Art": {
    effects: [
      {
        name: `Figureheads of the Dark Prince`,
        desc: `This army can have up to 3 generals instead of 1. Only 1 of the generals (your choice) can have a command trait but all 3 are considered to be a general for command ability purposes. An Invaders Host general cannot use a command trait or command ability while within 12" of another Invaders Host general. In addition each time 1 of your generals is slain for the first time, you receive 1 extra command point.`,
        when: [START_OF_GAME],
      },
      {
        name: `Escalating Havoc`,
        desc: `You receive D3 depravity points if any friendly Invaders Host units are wholly within enemy territory. If 3 or more friendly Invaders Host units are wholly within enemy territory at the start of your hero phase, you receive D6 depravity points instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Invaders Hedonite Host`,
        desc: `A Hedonite Host battalion in an Invaders Host army must contain 2-4 Epicurean Revellers battalions and 0-2 Seeker Cavalcade battalions instead of the standard quantities.`,
        when: [START_OF_GAME],
      },
    ],
  },
  // Pretenders Host
  'Magnificence Made Flesh': {
    effects: [
      {
        name: `Heir to the Throne`,
        desc: `If the general of a Pretenders Host army is a hero, they have 2 different command traits instead of 1. If you randomly generate traits, roll again if the second result matches the first.`,
        when: [START_OF_GAME],
      },
      {
        name: `Heir to the Throne`,
        desc: `You can reroll hit rolls of 1 for attacks made with melee and missile weapons by Pretenders Host units while they have 10 or more models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Warlord Supreme`,
        desc: `You receive D3 depravity points if your general is within 3" of any enemy units. If your general is within 3" of 3 or more enemy units you receive D6 depravity points instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Pretenders Hedonite Host`,
        desc: `A Supreme Sybarites battalion in a Pretenders Host army must have only 1 Chaos Slaanesh hero instead of 3-6.`,
        when: [START_OF_GAME],
      },
    ],
  },
  // Godseekers Host
  'Blessings of the Gleeful Chase': {
    effects: [
      {
        name: `Thundering Cavalcade`,
        desc: `Add 1 charge rolls for units in a Godseekers Host army.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Maniacal Hunters`,
        desc: `You receive D3 depravity points if any friendly Godseekers Host units made a charge move in this phase. If 3 or more friendly Godseekers Host units made a charge move in this phase receive D6 depravity points instead.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Godseekers Hedonite Host`,
        desc: `A Hedonite Host in a Godseekers Host army must contain 0-2 Epicurean Revellers battalions and 2-4 Seeker Cavalcade battalions.`,
        when: [START_OF_GAME],
      },
    ],
  },
  // Syll'Esskan Host
  'Vengeance Unleashed': {
    effects: [
      {
        name: `Common Purpose`,
        desc: `If the number of mortal units is exactly equal to the number of daemon units in your army, you receive D3 extra command points. If this condition is true and the army contains more that 12 units, you receive D6 command points instead of D3. Syll'Esske counts as 2 units towards this condition (1 mortal, 1 daemon).`,
        when: [START_OF_GAME],
      },
      {
        name: `Deadly Symbiosis`,
        desc: `When you receive depravity points due to a friendly Slaanesh hero inflicting or suffering wounds/mortal wounds, you receive 2 depravity points instead of 1 if the hero unit is within 12" of Syll'Esske.`,
        when: [DURING_GAME],
      },
      {
        name: `Syll'Esskan Host`,
        desc: `A Syll'Esskan host can include only include the following battalions: The Vengeful Alliance, Epicurean Revellers, Seeker Cavalcade, Devout Supplicants, Vengeful Throng, and Daemonsteel Contingent. The Syll'Esskan specific battalions can only be used by an army that is a Syll'Esskan Host.`,
        when: [START_OF_GAME],
      },
    ],
  },
  // Lurid Haze Flavor
  'Lurid Haze': {
    effects: [
      {
        name: `Billowing Mists`,
        desc: `After set up is complete before the first battle round, you can remove D3 friendly Lurid Haze Invaders Host units from the battlefield and say that they are in ambush as reserves (following any battleplan set-up restrictions). At the end of your first movement phase, you must set up these reserves within 6" of a battlefield edge and more than 9" away from any enemy units.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Billowing Mists`,
        desc: `You must set up the selected reserves within 6" of a battlefield edge and more than 9" away from any enemy units.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  // Faultless Blades Flavor
  'Faultless Blades': {
    effects: [
      {
        name: `Send Me Your Best`,
        desc: `Add 1 to the hit rolls for melee attacks made by friendly Faultless Blades Pretenders Host units that target a hero if that friendly unit made a charge move this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Scarlet Cavalcade Flavor
  'Scarlet Cavalcade': {
    effects: [
      {
        name: `Excessive Swiftness`,
        desc: `If 2 friendly Scarlet Cavalcade Godseekers Host units that each have 10 or more models are within 6" of each other, you can make 1 charge roll to determine the distance for both units.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
