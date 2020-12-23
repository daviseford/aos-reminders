import { tagAs } from 'factions/metatagger'
import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH, MARK_UNDIVIDED } from 'meta/alliances'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Prayers = {
  'Favour of the Ruinous Powers': {
    effects: [
      {
        name: `Favour of the Ruinous Powers`,
        desc: `This model may pick a mortal Slaves to Darkness unit within 18" and roll a D6. On a 3+ the prayer is answered. The prayer effect lasts until your next hero phase. The same unit cannot benefit from the same prayer more than once per turn.`,
        when: [START_OF_HERO_PHASE],
        prayer: true,
      },
      {
        name: `Favour: ${MARK_KHORNE}`,
        desc: `If active, you can reroll charge rolls for the unit. If you buffed a Khorne unit, you can reroll its hit rolls as well.`,
        when: [DURING_GAME, CHARGE_PHASE],
      },
      {
        name: `Favour: ${MARK_TZEENTCH}`,
        desc: `If active, you can reroll save rolls for the buffed unit.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Favour: ${MARK_TZEENTCH}`,
        desc: `If active, and if you buffed a Tzeentch unit, whenever the buffed unit is targeted by a spell roll a D6. On a 4+ ignore the effects.`,
        when: [HERO_PHASE],
      },
      {
        name: `Favour: ${MARK_NURGLE}`,
        desc: `If active, you can reroll wound rolls for the buffed unit.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Favour: ${MARK_NURGLE}`,
        desc: `If active, and if you buffed a Nurgle unit, add 1 to its save rolls.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Favour: ${MARK_SLAANESH}`,
        desc: `If active, you can reroll charge rolls for the buffed unit. If you buffed a Slaanesh unit, it also does not take battleshock tests.`,
        when: [CHARGE_PHASE, BATTLESHOCK_PHASE],
      },
      {
        name: `Favour: ${MARK_UNDIVIDED}`,
        desc: `If active, you can reroll hit and wound rolls for the buffed unit. If you buffed an Undivided unit, you can reroll its charge rolls as well.`,
        when: [DURING_GAME, CHARGE_PHASE],
      },
    ],
  },
  // Idolators
  'Idolators Prayers': {
    effects: [
      {
        name: `Idolators Prayers`,
        desc: `This model may chant a prayer by rolling a D6 on a friendly Idolators target within 12". On a 3+ the prayer is answered.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blessings of Khorne': {
    effects: [
      {
        name: `Blessings of Khorne`,
        desc: `If answered, targeted Khorne unit can reroll melee attack hit rolls until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blessings of Tzeentch': {
    effects: [
      {
        name: `Blessings of Tzeentch`,
        desc: `If answered, targeted Tzeentch unit can reroll save rolls until your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Blessings of Nurgle': {
    effects: [
      {
        name: `Blessings of Nurgle`,
        desc: `If answered, targeted Nurgle unit can reroll melee attack wound rolls until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blessings of Slaanesh': {
    effects: [
      {
        name: `Blessings of Slaanesh`,
        desc: `If answered, targeted Slaanesh unit can reroll charge rolls until your next hero phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Blessings of Chaos Undivided': {
    effects: [
      {
        name: `Blessings of Chaos Undivided`,
        desc: `If answered, you can heal D3 wounds allocated to targeted Idolators model.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
