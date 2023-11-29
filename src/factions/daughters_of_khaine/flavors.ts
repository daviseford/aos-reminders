import { keyPicker } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const Flavors = {
  'Hagg Nar': {
    effects: [
      {
        name: `Daughters of the First Temple`,
        desc: `Add 1 to the number of the current battle round when determining the abilities gained by friendly HAGG NAR units from the Blood Rites battle trait (pg 66). This ability and other similar abilities are cumulative.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Draichi Ganeth': {
    effects: [
      {
        name: `Bladed Killers`,
        desc: `Improve the Rend characteristic of melee weapons used by friendly DRAICHI GANETH WITCH AELVES units and friendly DRAICHI GANETH SISTERS OF SLAUGHTER units by 1 if those units made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'The Kraith': {
    effects: [
      {
        name: `Disciples of Slaughter`,
        desc: `After a friendly KRAITH SISTERS OF SLAUGHTER unit has fought for the first time in the combat phase, roll a dice. On a 4+, that unit can fight for a second time in that phase. The strike-last effect applies to that unit when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Khailebron: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Masters of the Shadowpaths'])],
    },
    effects: [],
  },
  'Khelt Nar': {
    effects: [
      {
        name: `Strike and Fade`,
        desc: `Friendly KHELT NAR units can retreat and still charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Zainthar Kai': {
    effects: [
      {
        name: `Khaine's Essence`,
        desc: `Each time a model in a friendly ZAINTHAR KAI MELUSAI unit is slain by an attack made with a melee weapon, that model can fight before it is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2022],
      },
    ],
  },
} satisfies TItemDescriptions

export default Flavors
