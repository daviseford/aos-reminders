import { TItemDescriptions } from 'factions/factionTypes'
import { keyPicker } from 'factions/metatagger'
import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH, MARK_UNDIVIDED } from 'meta/alliances'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  WARDS_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import rule_sources from './rule_sources'
import spells from './spells'

const Flavors = {
  Khorne: {
    effects: [
      {
        name: `Mark of ${MARK_KHORNE}`,
        desc: `Add 1 to the attacks characteristic of melee weapons used by KHORNE SLAVES TO DARKNESS units if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Banner of Rage: Khorne Unit Only`,
        desc: `Add 1 to wound roll for attacks made with melee weapons by this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Let the Blood Flow'])],
    },
  },
  Tzeentch: {
    effects: [
      {
        name: `Mark of ${MARK_TZEENTCH}`,
        desc: `You can roll a dice each time a spell targets a friendly TZEENTCH SLAVES TO DARKNESS unit. On a 6, that spell has no effect on that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Blasted Standard: Tzeentch Unit Only`,
        desc: `This unit has a ward of 4+ for attacks made with missile weapons that target this unit.`,
        when: [WARDS_PHASE],
      },
    ],
    mandatory: {
      spells: [keyPicker(spells, ['Warp Reality'])],
    },
  },
  Nurgle: {
    effects: [
      {
        name: `Mark of ${MARK_NURGLE}`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons that target NURGLE SLAVES TO DARKNESS units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Eroding Icon: Nurgle Unit Only`,
        desc: `Worsen the Rend characteristic of melee weapons that target this unit by 1.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
    ],
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Bestow Contagion'])],
    },
  },
  Slaanesh: {
    effects: [
      {
        name: `Mark of ${MARK_SLAANESH}`,
        desc: `Add 1 to run and charge rolls for SLAANESH SLAVES TO DARKNESS units.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `The Banner of Screaming Flesh: Slaanesh Unit Only`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Close in for the Kill'])],
    },
  },
  Undivided: {
    effects: [
      {
        name: `Mark of ${MARK_UNDIVIDED}`,
        desc: `All MORTAL and OGROID SLAVES TO DARKNESS UNDIVIDED units that are not unique gain the EYE OF THE GODS keyword.`,
        when: [DURING_SETUP],
      },
      {
        name: `Mark of ${MARK_UNDIVIDED}`,
        desc: `When a SLAVES TO DARKNESS UNDIVIDED HERO rolls on the Eye of the Gods table, you can reroll any 1 of the dice.`,
        when: [DURING_GAME],
      },
      {
        name: `The Dread Banner: Undivided Unit Only`,
        desc: `Each time this unit rolls on the Eye of the Gods table, you can roll 2 dice instead of 1 and pick 1 to be used as your roll.`,
        when: [DURING_GAME],
      },
    ],
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Slay Worthy Foes'])],
    },
  },
} satisfies TItemDescriptions

export default Flavors
