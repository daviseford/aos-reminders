import { TTraits } from 'types/army'
import {
  HERO_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  START_OF_HERO_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Arcane Might`,
    effects: [
      {
        name: `Arcane Might`,
        desc: `You can re-roll one casting or unbinding roll for this general each hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vast Intellect`,
    effects: [
      {
        name: `Vast Intellect`,
        desc: `This general can use the Curse of Fates and Summon Starlight spells from the Skink Starseer and Skink Starpriest warscrolls.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Great Rememberer`,
    effects: [
      {
        name: `Great Rememberer`,
        desc: `If this general is on the battlefield, you can use the Lords of Space and Time battle trait twice in each of your hero phases rather than only once.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Disciplined Fury`,
    effects: [
      {
        name: `Disciplined Fury`,
        desc: `You can re-roll hit rolls of 1 for attacks made with this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thickly Scaled Hide`,
    effects: [
      {
        name: `Thickly Scaled Hide`,
        desc: `You can re-roll save rolls of 1 for this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mighty War Leader`,
    effects: [
      {
        name: `Mighty War Leader`,
        desc: `At the start of your hero phase, if this general is on the battlefield, roll a D6. On a 5+ you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  {
    name: `Master of Star Rituals`,
    effects: [
      {
        name: `Master of Star Rituals`,
        desc: `If this general is a SKINK PRIEST from the Skink Priest warscroll, they can use the Celestial Rites ability from their warscroll twice in each of their hero phases rather than once. If they are not a SKINK PRIEST from the Skink Priest warscroll, then they can use the Celestial Rites ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Nimble`,
    effects: [
      {
        name: `Nimble`,
        desc: `Add 1 to this general's Move characteristic. In addition, add 1 to save rolls for this general as long as they are not riding upon a mount.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Cunning`,
    effects: [
      {
        name: `Cunning`,
        desc: `Roll a D6 at the start of the combat phase if this general is within 3" of an enemy HERO. On a 4+ the enemy HERO suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
