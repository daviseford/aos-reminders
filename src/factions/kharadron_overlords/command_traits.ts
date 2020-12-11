import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Master Commander': {
    effects: [
      {
        name: `Master Commander`,
        desc: `If this general is part of your army and on the battlefield, each time you spend a command point to use a command ability on this general's warscroll, roll a D6. On a 5+, you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Bearer of the Ironstar': {
    effects: [
      {
        name: `Bearer of the Ironstar`,
        desc: `The first time this general is slain, before removing them, roll a D6. On a 2+ they are not slain, you can heal up to D3 wounds allocated to them, and any wounds remaining to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Opportunistic Privateers': {
    effects: [
      {
        name: `Opportunistic Privateers`,
        desc: `If this general is part of the garrison of a SKYVESSEL that is on is on the battlefield after armies are set up but before the first battle round begins, you can remove that SKYVESSEL from the battlefield and set it up again anywhere more than 9" from any enemy units. If you do so, that SKYVESSEL cannot make a normal move in the first battle round, and units in its garrison cannot leave the garrison in the first battle round.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Supremely Stubborn': {
    effects: [
      {
        name: `Supremely Stubborn`,
        desc: `When you use the Incredibly Stubborn ability for this general, they can fight on a roll of 2+ instead of 4+.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Champion of Progress': {
    effects: [
      {
        name: `Champion of Progress`,
        desc: `Do not take battleshock for friendly BARAK-NAR units while they are wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  'Khemist Supreme': {
    effects: [
      {
        name: `Khemist Supreme`,
        desc: `Replace the rules for this general's Aetheric Augmentation ability with:

    "In your hero phase you can pick 2 friendly SKYFARERS units wholly within 12" of this model. Until your next hero phase, you can reroll wound rolls of 1 for attacks made by those units. This ability cannot be used by an AETHER-KHEMIST that is part of a garrison, or on a friendly unit that is part of a garrison.'`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
