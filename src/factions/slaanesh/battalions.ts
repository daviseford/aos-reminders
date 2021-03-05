import { keyPicker, tagAs } from 'factions/metatagger'
import SlavesToDarknessUnits from 'factions/slaves_to_darkness/units'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import Units from './units'

const RegularBattalions = {
  'Supreme Sybarites': {
    effects: [
      {
        name: `Ruling Cabal`,
        desc: `Roll a D6. If the roll is less than or equal to the number of heroes from this battalion that are on the battlefield, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Epicurean Revellers': {
    mandatory: {
      units: [keyPicker(Units, ['Daemonettes'])],
    },
    effects: [
      {
        name: `Perfect Destroyers`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by a Daemonette from this battalion is a 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Seeker Cavalcade': {
    effects: [
      {
        name: `Drawn to Battle`,
        desc: `Units from this battalion are eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3". They also move an extra 3" when piling in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Depraved Carnival': {
    mandatory: {
      units: [keyPicker(Units, ['Blissbarb Archers'])],
    },
    effects: [
      {
        name: `Honed by the Inimical`,
        desc: `Once per turn, 1 unit of Blissbarb Archers in this battalion can shoot.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Nobles of Excess': {
    effects: [
      {
        name: `A Demonstration of Prowess`,
        desc: `You can reroll wound rolls for melee attacks made by units in this battalion if they charged this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Exalted Speed-Knights': {
    mandatory: {
      units: [keyPicker(Units, ['Blissbarb Seekers', 'Slickblade Seekers', 'Seekers'])],
    },
    effects: [
      {
        name: `Timing is Everything`,
        desc: `D6 units from this battalion can move up to 6".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Devout Supplicants': {
    mandatory: {
      units: [keyPicker(SlavesToDarknessUnits, ['Chaos Warshrine'])],
    },
    effects: [
      {
        name: `Favoured of Slaanesh`,
        desc: `When you use the Favour of the Ruinous Powers ability for a Warshrine from this battalion, the prayer is answered on a 2+ instead of a 3+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vengeful Throng': {
    effects: [
      {
        name: `Headlong Charge`,
        desc: `Once per battle this battalion can make a Headlong Charge. You can attempt a Headlong Charge with a unit from this battalion from within 18" of the enemy instead of 12" and roll 3D6 instead of 2D6. After completing each Headlong Charge move, pick 1 enemy unit within 1" of the charging unit. On a 5+ that enemy unit suffers D3 mortal wounds at the end of the charge phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Headlong Charge`,
        desc: `Inflict D3 mortal wounds from any successful 5+ rolls against enemy units during the Headlong Charge.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Daemonsteel Contingent': {
    mandatory: {
      units: [keyPicker(SlavesToDarknessUnits, ['Soul Grinder'])],
    },
    effects: [
      {
        name: `The Debt`,
        desc: `Add 1 to the hit rolls for attacks made by Soul Grinders in this battalion.
               Add 1 to the save rolls made by Soul Grinders in this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  "Gestharyx's Cavalcade": {
    mandatory: {
      units: [keyPicker(Units, ['Lord of Pain', 'Daemonettes', 'Hellflayer'])],
    },
    effects: [
      {
        name: `Unyielding Seekers`,
        desc: `Do not take battleshock tests for this battalion's units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Hedonite Host': {
    mandatory: {
      battalions: [
        keyPicker(RegularBattalions, ['Supreme Sybarites', 'Epicurean Revellers', 'Seeker Cavalcade']),
      ],
    },
    effects: [
      {
        name: `Transcendental Warriors`,
        desc: `If this battalion is part of a Slaanesh army you receive D3 depravity points.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Transcendental Warriors`,
        desc: `Add 1 to the bravery characteric of units in this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  'The Vengeful Alliance': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Seeker Cavalcade'])],
      units: [keyPicker(Units, ["Syll'Esske, the Vengeful Allegiance"])],
    },
    effects: [
      {
        name: `Brutal Tyranny`,
        desc: `All mortal units in this battalion count as having a bravery characteristic of 10 as long as Syll'Esske is part of your army and on the battlefield.`,
        when: [DURING_GAME],
      },
      {
        name: `Brutal Tyranny`,
        desc: `You receive 1 command point if Syll'Esske is part of your army and on the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }
export default tagAs(Battalions, 'battalion')
