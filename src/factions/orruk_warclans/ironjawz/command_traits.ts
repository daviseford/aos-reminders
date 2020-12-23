import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  TURN_ONE_HERO_PHASE,
} from 'types/phases'

const IronjawzCommandTraits = {
  'Hulking Muscle-bound Brute': {
    effects: [
      {
        name: `Hulking Muscle-bound Brute`,
        desc: `After this general makes a charge move, you can pick 1 enemy unit within 1" of this general and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Live to Fight': {
    effects: [
      {
        name: `Live to Fight`,
        desc: `You can reroll wound rolls for attacks made by this general and their mount if they charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Brutish Cunning': {
    effects: [
      {
        name: `Brutish Cunning`,
        desc: `Once per battle round, this general can use the Mighty Destroyers command ability without spending a command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bestial Charisma': {
    effects: [
      {
        name: `Bestial Charisma`,
        desc: `Once per battle round this general can use Inspiring Presence without spending a command point.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Mighty Waaagh!': {
    effects: [
      {
        name: `Mighty Waaagh!`,
        desc: `Your Ironjawz Waaagh! ability increases range from 18" to 24".`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Ironclad: {
    effects: [
      {
        name: `Ironclad`,
        desc: `Add 1 to the save rolls for this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  "Dead Kunnin'": {
    effects: [
      {
        name: `Dead Kunnin'`,
        desc: `Gain D3 extra command points at the start of the first hero phase.`,
        when: [TURN_ONE_HERO_PHASE],
      },
    ],
  },
  'Master of the Weird': {
    effects: [
      {
        name: `Master of the Weird`,
        desc: `This general gains +1 to casting, dispelling, and unbinding attempts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Burstin' with Power": {
    effects: [
      {
        name: `Burstin' with Power`,
        desc: `The general knows 1 extra spell from the Lore of the Weird, in addition, they can cast 1 extra spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Right Fist of Dakkbad': {
    effects: [
      {
        name: `Right Fist of Dakkbad`,
        desc: `Gain +1 CP at the start of the game.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Get Da Realmgate': {
    effects: [
      {
        name: `Get Da Realmgate`,
        desc: `Add 2 to the dice result when you use the IRONJAWZ Waaagh! ability if there's a baleful realmgate on the table.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Checked Out': {
    effects: [
      {
        name: `Checked Out`,
        desc: `Add 2 to the Bravery characteristic for units wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(IronjawzCommandTraits, 'command_trait')
