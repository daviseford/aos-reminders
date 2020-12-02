import { TURN_ONE_START_OF_HERO_PHASE } from 'types/phases'

// This file is useful when storing abilities for units that we'd like to re-use
// E.G. all mercenaries share the "Disruptive Presence" effect, so we'll store it here.

const GenericBattleTraits = {
  DisruptivePresence: {
    name: `Disruptive Presence`,
    desc: `If your army includes any MERCENARY units, at the start of your hero phase in the first battle round, you do not receive 1 command point.`,
    when: [TURN_ONE_START_OF_HERO_PHASE],
  },
}

export default GenericBattleTraits
