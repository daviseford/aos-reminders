import { tagAs } from 'factions/metatagger'
import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH, MARK_UNDIVIDED } from 'meta/alliances'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const Prayers = {
  'Favour of the Ruinous Powers': {
    effects: [
      {
        name: `Bloodlust - ${MARK_KHORNE}`,
        desc: `Answer value of 3 and range of 18". This unit and the target unit must have the ${MARK_KHORNE} keyword. Pick 1 unit wholly within 18" and visible. Add 1 to charge rolls for that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Bloodlust - ${MARK_KHORNE}`,
        desc: `If picked, add 1 to charge rolls for that unit until the start of your next hero phase.`,
        when: [CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Prismatic Glamour - ${MARK_TZEENTCH}`,
        desc: `Answer value of 3 and range of 18". This unit and the target unit must have the ${MARK_TZEENTCH} keyword. Pick 1 unit wholly within 18" and visible. Subtract 1 from wound rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Prismatic Glamour - ${MARK_TZEENTCH}`,
        desc: `If picked, subtract 1 from wound rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Seeping Blades - ${MARK_NURGLE}`,
        desc: `Answer value of 3 and range of 18". This unit and the target unit must have the ${MARK_NURGLE} keyword. Pick 1 unit wholly within 18" and visible. Add 1 to wound rolls for attacks made with melee weapons until the start of your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Seeping Blades - ${MARK_NURGLE}`,
        desc: `If picked, add 1 to wound rolls for attacks made with melee weapons until the start of your next hero phase.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Unnatural Speed - ${MARK_SLAANESH}`,
        desc: `Answer value of 3 and range of 18". This unit and the target unit must have the ${MARK_SLAANESH} keyword. Pick 1 unit wholly within 18" and visible. Until the start of your next hero phase you can attempt a charge within 18" and roll 3d6 to charge.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Unnatural Speed - ${MARK_SLAANESH}`,
        desc: `If picked, until the start of your next hero phase you can attempt a charge within 18" and roll 3d6 to charge.`,
        when: [CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Favour of Chaos - ${MARK_UNDIVIDED}`,
        desc: `Answer value of 3 and range of 18". This unit and the target unit must have the ${MARK_UNDIVIDED} keyword. If answered, pick 1 friendly unit wholly within range and visible. Until the start of your next hero phase halve the number of models that flee from battleshock (rounded down).`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Favour of Chaos ${MARK_UNDIVIDED}`,
        desc: `If picked, halve the number of models that flee from battleshock (rounded down).`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },

  // Idolators
  'Blessings of Khorne': {
    effects: [
      {
        name: `Blessings of Khorne`,
        desc: `Blessings of Khorne is a prayer with an answer value of 3 and range of 12". If answered, pick 1 friendly KHORNE IDOLATORS unit wholly within range of the chanter and visible to them. You can reroll hit rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Blessings of Khorne`,
        desc: `If active, you can reroll hit rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Blessings of Tzeentch': {
    effects: [
      {
        name: `Blessings of Tzeentch`,
        desc: `Blessings of Tzeentch is a prayer with an answer value of 3 and range of 12". If answered, pick 1 friendly Tzeentch Idolators unit wholly within range of the chanter and visible to them. Add 1 to save rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Blessings of Tzeentch`,
        desc: `If active, add 1 to save rolls for attacks that target that unit until your next hero phase.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Blessings of Nurgle': {
    effects: [
      {
        name: `Blessings of Nurgle`,
        desc: `Blessings of Nurgle is a prayer with an answer value of 3 and range of 12". If answered, pick 1 friendly NURGLE IDOLATORS unit wholly within range of the chanter and visible to them. You can reroll wound rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Blessings of Nurgle`,
        desc: `If active, you can reroll wound rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Blessings of Slaanesh': {
    effects: [
      {
        name: `Blessings of Slaanesh`,
        desc: `Blessings of Slaanesh is a prayer with an answer value of 3 and range of 12". If answered, pick 1 friendly SLAANESH IDOLATORS unit wholly within range of the chanter and visible to them. You can reroll charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Blessings of Slaanesh`,
        desc: `If active, you can reroll charge rolls for that unit until your next hero phase.`,
        when: [CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Blessings of Chaos Undivided': {
    effects: [
      {
        name: `Blessings of Chaos Undivided`,
        desc: `Blessings of Chaos Undivided is a prayer with an answer value of 3 and range of 12". If answered, pick 1 friendly IDOLATORS model within range of the chanter and visible to them. You can heal D3 wounds allocated to that model.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Prayers, 'prayer')
