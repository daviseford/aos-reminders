import {
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Flavors = {
  Ionrach: {
    // mandatory: {
    //   command_trait: [keyPicker(CommandTraits, ['Emissary of the Deep Places'])],
    // },
    effects: [
      {
        name: `Legacy of Glory`,
        desc: `You can carry out this heroic action with a friendly IONRACH AKHELIAN HERO instead of any other heroic action you can carry out with that HERO. If you do so, pick 1 friendly IONRACH AKHELIAN unit wholly within 12" of that HERO. Until the end of that turn, you can choose for that unit to be affected by either the Flood Tide or Ebb Tide ability from the Tides of Death table in addition to any other abilities from the Tides of Death table they are affected by.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Dhom-Hain': {
    effects: [
      {
        name: `Namarti Savages`,
        desc: `If you take the first turn in the current battle round, in your combat phase, after a friendly DHOM-HAIN NAMARTI unit has fought for the first time in that phase, if there are no enemy units within 3" of that DHOM-HAIN NAMARTI unit, you can attempt a charge with that unit if it is within 12" of any enemy units. If that DHOM-HAIN NAMARTI unit finishes that charge move within 1/2" of an enemy unit, you can pick that unit to fight for a second time in that phase when it is your turn to do so. If you take the second turn in the current battle round, when a friendly DHOM-HAIN HERO issues the Redeploy command to a friendly DHOM-HAIN NAMARTI unit, you can pick up to 3 friendly DHOM-HAIN NAMARTI units to receive the command instead of only 1 friendly unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Fuethan: {
    effects: [
      {
        name: `Bloodthirsty Shiver`,
        desc: `You can include Bloodthirsty Shivers in your army (pg 96). At the start of the combat phase, you can pick 1 unit from each Bloodthirsty Shiver in your army. If you do so, until the end of that phase, if the unmodified hit roll for an attack made with that unit's Ferocious Bites is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit. If the attacking unit is within 3" of 1 or more other units from the same Bloodthirsty Shiver, its Ferocious Bite scores 3 hits on an unmodified hit roll of 6 instead.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  "Mor'phann": {
    // mandatory: {
    //   spells: [keyPicker(Spells, ['Freezing Mists'])],
    // },
    effects: [
      {
        name: `Soul-magic Adepts`,
        desc: `If the Lurelight ability of a friendly MOR'PHANN SOULRENDER affects a friendly MOR'PHANN NAMARTI unit, add 3 to the number of slain models that are returned to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  Nautilar: {
    // mandatory: {
    //   spells: [keyPicker(Spells, ['Protective Barrier'])],
    // },
    effects: [
      {
        name: `Crushing Assault`,
        desc: `You can carry out this monstrous rampage with a friendly NAUTILAR LEVIADON instead of any other monstrous rampage you can carry out with that LEVIADON. If you do so, change the Rend characteristic of that LEVIADON'S Massive Scythed Fins and Crushing Jaws to -3 until the end of the next combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },

  Briomdar: {
    effects: [
      {
        name: `Supreme Soulscryers`,
        desc: `During deployment, if you set up a friendly BRIOMDAR SOULSCRYER using the Finder Of Ways ability, up to 3 friendly BRIOMDAR IDONETH DEEPKIN units can join that SOULSCRYER instead of up to 2. In addition, when you set up any units that can join that SOULSCRYER, you can set up those units wholly within 12" of that SOULSCRYER and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
    ],
  },
}

export default Flavors
