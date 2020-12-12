import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_TURN,
} from 'types/phases'
import Units from './units'

const RegularBattalions = {
  // Daemons
  Murderhost: {
    effects: [
      {
        name: `Insatiable Bloodlust`,
        desc: `Add 2 to run and charge rolls for units from this battalion while they are wholly within 16" of a BLOODLETTER HERO from the same battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Bloodthunder Stampede': {
    mandatory: {
      units: [keyPicker(Units, ['Skullmaster, Herald of Khorne', 'Bloodcrushers'])],
    },
    effects: [
      {
        name: `Obliterating Charge`,
        desc: `The Murderous Charge and Slaughterous Charge abilities used by units from this battalion automatically inflict mortal wounds after a model finishes a charge move, instead of inflicting mortal wounds on a roll of 2+`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Tyrants of Blood': {
    effects: [
      {
        name: `Fierce Rivals`,
        desc: `After a model from this battalion has fought in the combat phase for the first time, you can pick another model from the same battalion that has not yet fought in that combat phase and is within 3" of any enemy units. That model fights immediately, before the opposing player picks a unit to fight in that combat phase. That model cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blood Hunt': {
    mandatory: {
      units: [keyPicker(Units, ['Karanak', 'Wrath of Khorne Bloodthirster'])],
    },
    effects: [
      {
        name: `Khorne's Hunters`,
        desc: `Add 1 to wound rolls for attacks made by units from this battalion that target a HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Gorethunder Cohort': {
    mandatory: {
      units: [keyPicker(Units, ['Herald of Khorne on Blood Throne', 'Skull Cannons'])],
    },
    effects: [
      {
        name: `The Cannons of Khorne`,
        desc: `You can reroll hit rolls for attacks made with missile weapons by SKULL CANNONS from this battalion that are wholly within 12" of a HERALD OF KHORNE ON BLOOD THRONE from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Blood Host': {
    effects: [
      {
        name: `Cometh the Slaughter`,
        desc: `You can reroll charge rolls for units from this battalion while they are wholly within 16" of any BLOODTHIRSTERS from the same battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Charnel Host': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Bloodthirster of Unfettered Fury',
          'Bloodmaster, Herald of Khorne',
          'Bloodletters',
        ]),
      ],
    },
    effects: [
      {
        name: `Daemon Commander`,
        desc: `You can reroll wound rolls of 1 for attacks made with melee weapons by units from this battalion that are wholly within 16" of a BLOODTHIRSTER from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skullseeker Host': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Bloodthirster of Insensate Rage',
          'Herald of Khorne on Blood Throne',
          'Bloodcrushers',
          'Skull Cannons',
        ]),
      ],
    },
    effects: [
      {
        name: `Giant Killers`,
        desc: `You can reroll wound rolls for attacks made by units from this battalion that target a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  "Skall'uk's Slaughterband": {
    mandatory: {
      units: [keyPicker(Units, ['Herald of Khorne on Blood Throne', 'Bloodletters', 'Bloodcrushers'])],
    },
    effects: [
      {
        name: `Cometh the Slaughter`,
        desc: `In each of your hero phases, pick one Slaughterband unit that is within 3" of the enemy. All models in the unit you pick can immediately pile in and attack with their Hellbdades and Blades of Blood.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Mortals
  Gorechosen: {
    mandatory: {
      units: [keyPicker(Units, ['Exalted Deathbringer'])],
    },
    effects: [
      {
        name: `Mightiest of Champions`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by units from this battalion. In addition, while a unit from this battalion is wholly within 8" of at least two other units from the same battalion, add 1 to hit rolls for attacks made by that unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Brass Stampede': {
    mandatory: {
      units: [keyPicker(Units, ['Mighty Skullcrushers'])],
    },
    effects: [
      {
        name: `Obliterating Charge`,
        desc: `The Murderous Charge and Slaughterous Charge abilities used by units from this battalion automatically inflict mortal wounds after a model finishes a charge move, instead of inflicting mortal wounds on a roll of 2+.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Dark Feast': {
    mandatory: {
      units: [keyPicker(Units, ['Slaughterpriest', 'Bloodstoker', 'Bloodreavers'])],
    },
    effects: [
      {
        name: `Feeding Frenzy`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by BLOODREAVERS units from this battalion while they are wholly within 16" of a SLAUGHTERPRIEST from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Bloodmad Warband': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Aspiring Deathbringer',
          'Bloodsecrator',
          'Blood Warriors',
          'Bloodreavers',
          'Skullreapers',
        ]),
      ],
    },
    effects: [
      {
        name: `Frenzied Charge`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by a unit from this battalion if that unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Red Headsmen': {
    mandatory: {
      units: [keyPicker(Units, ['Aspiring Deathbringer', 'Skullgrinder', 'Blood Warriors'])],
    },
    effects: [
      {
        name: `Slay the Worthy`,
        desc: `Each time an enemy HERO or MONSTER is slain by an attack made by a unit from this battalion, you receive 1 additional Blood Tithe point.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Skulltake: {
    mandatory: {
      units: [keyPicker(Units, ['Bloodstoker', 'Skullreapers', 'Khorgoraths'])],
    },
    effects: [
      {
        name: `Reaping Strikes`,
        desc: `If the unmodified wound roll for an attack with a melee weapon made by a unit from this battalion is 6 and that unit is wholly within 12" of a BLOODSTOKER from the same battalion, add 1 to the Damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Slaughterborn: {
    mandatory: {
      units: [keyPicker(Units, ['Exalted Deathbringer', 'Skullreapers', 'Blood Warriors'])],
    },
    effects: [
      {
        name: `Inured to Bloodshed`,
        desc: `Worsen the Rend characteristic of melee weapons used for attacks that target a unit from this battalion by 1 (to a minimum of 0).`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Gore Pilgrims': {
    mandatory: {
      units: [keyPicker(Units, ['Bloodsecrator', 'Slaughterpriest', 'Blood Warriors', 'Bloodreavers'])],
    },
    effects: [
      {
        name: `Widening the Rift`,
        desc: `Add 8" to the range of the Loathsome Sorcery and Rage of Khorne abilities used by this battalion's BLOODSECRATOR while it is wholly within 8" of any SLAUGHTERPRIESTS from the same battalion.`,
        when: [HERO_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  Bloodforged: {
    mandatory: {
      units: [keyPicker(Units, ['Skullgrinder', 'Wrathmongers', 'Blood Warriors'])],
    },
    effects: [
      {
        name: `Feast of Wrath`,
        desc: `Immediately after a unit of WRATHMONGERS from this battalion has fought in your combat phase for the first time that phase, if that unit is within 3" of any enemy units and wholly within 8" of a SKULLGRINDER from the same battalion, that unit can immediately make a pile-in move and then attack with all of the melee weapons it is armed with for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Bloodbound Murderband': {
    mandatory: {
      units: [keyPicker(Units, ['Slaughterpriest', 'Blood Warriors', 'Mighty Skullcrushers'])],
    },
    effects: [
      {
        name: `Murderous Blessing`,
        desc: `In your hero phase, a Murderband's Slaughterpriest can pray for a Murderous Blessing in addition to using his Bloodfuelled Prayers. If he does so, roll a D6. If you roll a 3+, until your next hero phase you can reroll failed wound rolls made for him and other units from his Murderband that are within 8". On a 1, however, he suffers a mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  // Daemons
  'Blood Legion': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Blood Host'])],
    },
    effects: [
      {
        name: `Skulls for the Skull Throne`,
        desc: `When units from this battalion use their Decapitating Blow ability, it inflicts a mortal wound on an unmodified hit roll of 5+ instead of 6.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Mortals
  'Bloodbound Warhorde': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Gorechosen', 'Bloodmad Warband'])],
    },
    effects: [
      {
        name: `Endless Slaughter`,
        desc: `At the start of your turn, you receive 1 Blood Tithe point.`,
        when: [START_OF_TURN],
      },
    ],
  },
  // Legends
  'Daemon Legion of Khorne': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Blood Host'])],
    },
    effects: [
      {
        name: `Khorne Cares Not From Whence The Blood Flows`,
        desc: `If any units are wiped out during the combat phase, you can add 1 to the Attacks characteristic of all melee weapons used by the Daemon Legion of Khorne for the remainder of that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Revel in Carnage`,
        desc: `You immediately gain 1 Blood Tithe point at the start of each of your hero phases.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }
export default tagAs(Battalions, 'battalion')
