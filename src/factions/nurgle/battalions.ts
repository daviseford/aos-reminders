import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'
import Units from './units'

const RegularBattalions = {
  'Tallyband of Nurgle': {
    effects: [
      {
        name: `Droning Masses`,
        desc: `Each unit in this battalion heals 1 wound that has been allocated to it. For units of Plaguebearers, return D3 slain models to each unit instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Disease and Pestilence Personified`,
        desc: `If the number of Plaguebearer units + the number of Plague Drone units = 7, you receive 1 extra contagion point in each of your hero phases.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Thricefold Befoulment': {
    mandatory: {
      units: [keyPicker(Units, ['Great Unclean One'])],
    },
    effects: [
      {
        name: `Hungry for the Plague God's Praise`,
        desc: `Reroll hit rolls of 1 for models from this battalion while they are within 14" of another model from this battalion. In addition, reroll wound rolls of 1 for models from this battalion while they are within 14" of two other models from this battalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Plague Storm of Nurgle`,
        desc: `If a model from this battalion successfully casts the Plague Wind spell when it is within 7" of another model from this battalion, then the number of mortal wounds inflicted by the spell is increased from D3 to 2D3. If the caster is within 7" of two other models from this battalion, then the number of mortal wounds inflicted is increased to 3D3 instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Nurgle`s Menagerie': {
    mandatory: {
      units: [keyPicker(Units, ['Horticulous Slimux', 'Beasts of Nurgle'])],
    },
    effects: [
      {
        name: `Assistant Gardeners`,
        desc: `Horticulous Slimux can use his Cultivating the Garden of Nurgle ability in each of your hero phases instead of only once per battle. In addition, when he does so, the Feculent Gnarlmaw can be set up within 3" of any unit from this battalion instead of being set up within 3" of Horticulous.`,
        when: [HERO_PHASE],
      },
      {
        name: `Utterly Revolting Horde`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 14" of 7 or more models from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Plague Cyst': {
    mandatory: {
      units: [keyPicker(Units, ['Lord of Plagues', 'Putrid Blightkings'])],
    },
    effects: [
      {
        name: `Master of Slaughter`,
        desc: `Reroll all failed hit rolls for units from this battalion that are affected by the Wanton Slaughter ability of this battalion's Lord of Plagues, instead of only rerolling hit rolls of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Horribly Contagious`,
        desc: `Roll a D6 for each enemy unit within 3" of any units from this battalion. On a 6+ the unit being rolled for suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blight Cyst': {
    mandatory: {
      units: [keyPicker(Units, ['Lord of Blights', 'Putrid Blightkings'])],
    },
    effects: [
      {
        name: `Endless Bounty`,
        desc: `The Munificent Bounty ability from this battalion's Lord of Blights affects all units from this battalion that are within 3" of him instead of only one unit.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Supremely Blighted Weapons`,
        desc: `The Blighted Weapons used by the Putrid Blightkings in this battalion have a Rend characteristic of '-1'.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blights on the Landscape`,
        desc: `Enemy units do not receive any benefits for being in cover against attacks made by this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Affliction Cyst': {
    mandatory: {
      units: [keyPicker(Units, ['Lord of Afflictions', 'Pusgoyle Blightlords'])],
    },
    effects: [
      {
        name: `The Droning Sky`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and set up as hovering the skies. You can do this with as many units from the battalion as you wish.`,
        when: [DURING_SETUP],
      },
      {
        name: `The Droning Sky`,
        desc: `Set up each unit hovering in the skies more than 9" from any enemy models.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Diseased Onslaught`,
        desc: `If the Lord of Afflictions from this battalion uses his Spearhead of Contagion command ability, it affects all units from this battalion that are within 14" of him instead of only one unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fecund Rituculturalists': {
    mandatory: {
      units: [keyPicker(Units, ['Horticulous Slimux', 'Beasts of Nurgle', 'Plaguebearers', 'Plague Drones'])],
    },
    effects: [
      {
        name: `Rituculturalists`,
        desc: `You can reroll hit rolls of 1 for models from this battalion whilst they are within 7" of Horticulous Slimux.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Fertile Ground`,
        desc: `If the unit of Plaguebearers from this battalion is within 3" of Horticulous at the start of your hero phase, you may immediately replace D3 of its models that were slain earlier in the battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Tamurkhan's Horde Battalions
  'Sons of the Maggot Lord': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Tamurkhan the Maggot Lord',
          'Kazyk the Befouled',
          'Plague Ogors',
          'Bile Troggoths',
        ]),
      ],
    },
    effects: [
      {
        name: `The Tide of Conquest`,
        desc: `Add 1 to the charge roll for units from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Leaping Pox': {
    mandatory: {
      units: [keyPicker(Units, ['Daemon Pox Riders of Nurgle', 'Daemon Plague Toads of Nurgle'])],
    },
    effects: [
      {
        name: `Infectious!`,
        desc: `Roll a D6 for each enemy unit within 1" of any units with this ability. On a 4+, that unit suffers 1 mortal wound. This ability has no effect on Nurgle units.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'The Munificent Wanderers': {
    mandatory: {
      units: [keyPicker(Units, ['Great Unclean One'])],
      battalions: [keyPicker(RegularBattalions, ['Tallyband of Nurgle'])],
    },
    effects: [
      {
        name: `Infested with Foul Gifts`,
        desc: `In the Rampant Disease stage of the Cycle of Corruption, enemy units that are affected by Rampant Disease that are within 14" of a unit from this battalion suffer D6 mortal wounds instead of D3. In addition if the Great Unclean One is on the battlefield during the Rampant Disease stage of the Cycle, then D6 enemy units are affected by the Rampant disease instead of D3.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Blessed Sons': {
    mandatory: {
      units: [keyPicker(Units, ['Sorcerer', 'Harbinger of Decay', 'Putrid Blightkings'])],
      battalions: [keyPicker(RegularBattalions, ['Plague Cyst'])],
    },
    effects: [
      {
        name: `Swollen with Pride`,
        desc: `Units in this battalion do not have to take battleshock tests while they have 7 or more models.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Blessed Blightplate`,
        desc: `Reroll saves rolls of 1 for models in this battalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }
export default tagAs(Battalions, 'battalion')
