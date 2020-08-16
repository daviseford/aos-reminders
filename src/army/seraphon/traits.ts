import { TTraits } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Arcane Might`,
    effects: [
      {
        name: `Arcane Might`,
        desc: `You can re-roll 1 casting, dispelling or unbinding roll for this general each hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vast Intellect`,
    effects: [
      {
        name: `Vast Intellect`,
        desc: `This general knows 1 extra spell from the Lore of Celestial Domination (pg 60).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Great Rememberer`,
    effects: [
      {
        name: `Great Rememberer`,
        desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Disciplined Fury`,
    effects: [
      {
        name: `Disciplined Fury`,
        desc: `You can re-roll hit rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thickly Scaled Hide`,
    effects: [
      {
        name: `Thickly Scaled Hide`,
        desc: `You can re-roll save rolls of 1 for attacks that target this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mighty Warleader`,
    effects: [
      {
        name: `Mighty Warleader`,
        desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  {
    name: `Master of Star Rituals`,
    effects: [
      {
        name: `Master of Star Rituals`,
        desc: `Add 1 to casting rolls for this general if they are a WIZARD. If they are not a WIZARD, then once per battle round they can use the Herald of the Old Ones command ability from the Skink Priest warscroll without a command point being spent.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Nimble`,
    effects: [
      {
        name: `Nimble`,
        desc: `Add 1 to save rolls for attacks that target this general.`,
        when: [DURING_GAME],
      },
      {
        name: `Nimble`,
        desc: `Add 1" to this general's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Cunning`,
    effects: [
      {
        name: `Cunning`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this general and roll a D6. On a 4+, that enemy HERO suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
