import { tagAs } from 'factions/metatagger'
import rule_sources from 'meta/rule_sources'
import { BATTLESHOCK_PHASE, END_OF_TURN, START_OF_SETUP } from 'types/phases'

const Scenery = {
  'Bad Moon Loonshrine': {
    effects: [
      {
        name: `Bad Moon Loonshrine`,
        desc: `After territories have been chosen but before armies are set up, you can set up the BAD MOON LOONSHRINE wholly within your territory, more than 12" from enemy territory and more than 1" from any other terrain features.`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Loonatic Courage`,
        desc: `GLOOMSPITE GITZ units wholly within 12" of the BAD MOON LOONSHRINE do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Moonclan Lairs`,
        desc: `You can pick 1 friendly unit that has been destroyed. Roll a D6 and on a 4+ half the original model count of the selected unit (rounded up) is restored. This unit must be set up wholly within 12" of a Bad Moon Loonshrine, more than 3" from enemy units. A restored unit cannot be restored again.
               The restorable unit is based on your armies' general and you must pick from the associated unit matching that general: 
               Spiderfang General: Spider Riders
               Squig General: Squig Herd, Squig Hoppers, Boingrot Bounderz
               Troggoth General: Troggoth unit with Wounds characteristic of 5 or less.
               Other General: Stabbas, Shootas`,
        when: [END_OF_TURN],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
