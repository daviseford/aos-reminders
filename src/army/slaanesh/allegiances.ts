import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const InvadersEffects = [
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
]

const PretendersEffects = [
  {
    name: `Heir to the Throne`,
    desc: `If the general of a Pretenders Host army is a hero, they have 2 different command traits instead of 1. If you randomly generate traits, roll again if the second result matches the first.`,
    when: [START_OF_GAME],
  },
  {
    name: `Heir to the Throne`,
    desc: `You can reroll hit rolls of 1 for attacks made with melee and missle weapons by Pretenders Host units while they have 10 or more models.`,
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
]

const GodseekersEffects = [
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
]

const Allegiances: TAllegiances = [
  {
    name: `Invaders Host`,
    effects: InvadersEffects,
  },
  {
    name: `Pretenders Host`,
    effects: PretendersEffects,
  },
  {
    name: `Godseekers Host`,
    effects: GodseekersEffects,
  },
  {
    name: `Syll'Esskan Host`,
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
  {
    name: `Lurid Haze Invaders Host`,
    effects: [
      ...InvadersEffects,
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
      {
        name: `Intoxicating Pall`,
        desc: `You can use this ability once per turn in this phase. Pick 1 friendly Lurid Haze Invaders Host unit wholly within 12" of a friendly Lurid Haze Invaders Host hero with this ability. Until the end of the phase, add 1 to the save rolls for attacks that target the selected unit. The same unit cannot benefit from this more than once per turn.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Feverish Anticipation`,
        desc: `You can reroll run rolls for friendly Lurid Haze Invaders Host units that are wholly within 12" of this general before the run roll is made.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
      {
        name: `Oil of Exultation`,
        desc: `Add 1 to the wounds characteristic of the bearer.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Faultless Blades Pretenders Host`,
    effects: [
      ...PretendersEffects,
      {
        name: `Send Me Your Best`,
        desc: `Add 1 to the hit rolls for melee attacks made by friendly Faultless Blades Pretenders Host units that target a hero if that friendly unit made a charge move this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Armour of Arrogance`,
        desc: `You can use this ability once per turn. Pick 1 friendly Faultless Blades Pretenders Host unit wholly within 12" of a friendly Faultless Blades Pretenders Host hero with this ability. The first 2 wounds allocated to that unit in this phase are negated.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Contest of Cruelty`,
        desc: `Friendly Faultless Blades Pretenders Host units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Contemptuous Brand`,
        desc: `Add 1 to the wound rolls for melee attacks made with this weapon that target a hero.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Scarlet Cavalcade Godseekers Host`,
    effects: [
      ...GodseekersEffects,
      {
        name: `Excessive Swiftness`,
        desc: `If 2 friendly Scarlet Cavalcade Godseekers Host units that each have 10 or more models are within 6" of each other, you can make 1 charge roll to determine the distance for both units.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Vicious Spurs`,
        desc: `Pick 1 friendly Scarlet Cavalcade Godseekers Host unit that made a charge move this turn wholly within 12" of a friendly Scarlet Cavalcade Godseekers Host hero. Until the end of the phase, if the unmodified save roll for an attack that targets the unit is a 6, the attacking unit suffers 1 mortal wound after all its attacks have resolved.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Vicious Spurs`,
        desc: `A unit that charges in this phase will be an eligible target for Vicious Spurs if it is wholly within 12" of a Scarlet Cavalcade Godseekers hero.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Embodiment of Haste`,
        desc: `You can reroll battleshock tests for friendly Scarlet Cavalcade Godseekers Host units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Helm of the Last Rider`,
        desc: `Add 1 to the bravery characteristic of friendly Scarlet Cavalcade Godseekers Host units while they are wholly within 12" of the bearer.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
