import { ICommandTraits } from 'types/army'

import { HERO_PHASE, COMBAT_PHASE, GAME_DURING, START_OF_HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import { Tags } from './units'

const CommandTraits: ICommandTraits = {
  [Tags.SLANN]: {
    'Arcane Might': {
      desc: 'You can re-roll one casting or unbinding roll for this general each hero phase.',
      when: HERO_PHASE,
    },
    'Vast Intellect': {
      desc:
        'This general can use the Curse of Fates and Summon Starlight spells from the Skink Starseer and Skink Starpriest warscrolls.',
      when: HERO_PHASE,
    },
    'Great Rememberer': {
      desc:
        'If this general is on the battlefield, you can use the Lords of Space and Time battle trait twice in each of your hero phases rather than only once.',
      when: HERO_PHASE,
    },
  },
  [Tags.SAURUS]: {
    'Disciplined Fury': {
      desc: 'You can re-roll hit rolls of 1 for attacks made with this general’s melee weapons.',
      when: COMBAT_PHASE,
    },
    'Thickly Scaled Hide': {
      desc: 'You can re-roll save rolls of 1 for this general.',
      when: GAME_DURING,
    },
    'Mighty War Leader': {
      desc:
        'At the start of your hero phase, if this general is on the battlefield, roll a dice. On a 5+ you receive 1 extra command point.',
      when: START_OF_HERO_PHASE,
    },
  },
  [Tags.SKINK]: {
    'Master of Star Rituals': {
      desc:
        'If this general is a SKINK PRIEST from the Skink Priest warscroll, they can use the Celestial Rites ability from their warscroll twice in each of their hero phases rather than once. If they are not a SKINK PRIEST from the Skink Priest warscroll, then they can use the Celestial Rites ability.',
      when: HERO_PHASE,
    },
    Nimble: {
      desc:
        'Add 1 to this general’s Move characteristic. In addition, add 1 to save rolls for this general as long as they are not riding upon a mount.',
      when: GAME_DURING,
    },
    Cunning: {
      desc:
        'Roll a dice at the start of the combat phase if this general is within 3" of an enemy HERO. On a 4+ the enemy HERO suffers 1 mortal wound.',
      when: START_OF_COMBAT_PHASE,
    },
  },
}

export default CommandTraits
