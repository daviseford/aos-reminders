import { TAllegiances } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  DURING_GAME,
  WOUND_ALLOCATION,
  MOVEMENT_PHASE,
  HERO_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `The Eternal Conflagration`,
    effects: [
      {
        name: `Twisters of Materiality`,
        desc: `Improve the Rend characteristic of friendly Eternal Conflagration units' Warpflame, Billowing Warpflame, and Magical Flames missle weapons by 1.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Infernos of Mutation`,
        desc: `You can use this command ability in the shooting phase. If you do so, pick 1 friendly Eternal Conflagration Daemon unit wholly within 12" of a friendly Daemon Hero. If the unmodified hit roll for any attack made by that unit's Warpflame, Billowing Warpflame, or Magical Flames missile weapons is 6, subtract 2 from the Bravery characteristic of the target unit until the end of the battle round. A unit cannot benefit from this command ability more than once per turn.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Coruscating Flames`,
        desc: `Subtract 1 from hit rolls for attacks made with missle weapons that target friendly Eternal Conflagration Daemon units wholly within 12" of this general.`,
        when: [SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Shroud of Warpflame`,
        desc: `Roll a dice each time you allocate a wound or mortal wound inflicted by a melee weapon to the bearer. On a 3+, the attacking unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION],
        artifact: true,
      },
    ],
  },
  {
    name: `The Host Duplicitous`,
    effects: [
      {
        name: `Ranks of Mischievous Mirages`,
        desc: `Enemy units within 3" of a Host Duplicitous unit cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Impossible to Anticipate`,
        desc: `You can use this command ability once per battle, immediately after a friendly Hosts Duplicitous Horrors of Tzeentch unit is destroyed. If you do so, roll a dice. On a 5+, a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 12" of a friendly Hosts Duplicitious Hero and more than 9" from any enemy units.`,
        when: [WOUND_ALLOCATION],
        command_ability: true,
      },
      {
        name: `Will of the Phantom Lord`,
        desc: `You can re-roll casting and unbinding rolls for friendly Hosts Duplicitous Daemon Wizards while they are wholly within 9" of this general.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Pretenders Hedonite Host`,
        desc: `A Supreme Sybarites battalion in a Pretenders Host army must have only 1 Chaos Slaanesh hero instead of 3-6.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `The Host Arcanum`,
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
  {
    name: `The Cult of Transient Form`,
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
    name: `The Pyrofane Cult`,
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
    name: `The Guild of SUmmoners`,
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
]

export default Allegiances
