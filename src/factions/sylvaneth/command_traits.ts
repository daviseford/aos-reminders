import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, SAVES_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const CommandTraits = {
  'Gnarled Warrior': {
    effects: [
      {
        name: `Gnarled Warrior`,
        desc: `Ignore modifiers (positive and negative) to save rolls for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Lord of Spites': {
    effects: [
      {
        name: `Lord of Spites`,
        desc: `In the combat phase, subtract 1 from the Attacks characteristic of melee weapons used by enemy units (to a minimum of 1) that finish a pile-in move within 3" of this general until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Warsinger: {
    effects: [
      {
        name: `Warsinger`,
        desc: `If this general is on the battlefield at the start of your movement phase, add 3" to the Move characteristic of friendly SYLVANETH units that start a move wholly within 12' of this general until the end of that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Nurtured by Magic': {
    effects: [
      {
        name: `Nurtured by Magic`,
        desc: `Once per turn, if this general successfully casts a spell that is not unbound, pick 1 friendly SYLVANETH unit wholly within 18" of this general. If you do so, heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Spellsinger: {
    effects: [
      {
        name: `Spellsinger`,
        desc: `When this general attempts to cast a spell, before making the casting roll, you can pick 1 friendly Awakened Wyldwood on the battlefield. If you do so and the spell is successfully cast and not unbound, the range, visibility and effect of that spell can be measured from 1 scenery piece that is a part of that friendly Awakened Wyldwood. Spells that summon endless spells do not benefit from this effect.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_OCTOBER_2022],
      },
    ],
  },
  'Radiant Spirit': {
    effects: [
      {
        name: `Radiant Spirit`,
        desc: `Each time a friendly SYLVANETH unit wholly within 12" of this general is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Evergreen Hunt
  'Sapwood Leader': {
    effects: [
      {
        name: `Sapwood Leader`,
        desc: `When you use the Abundant Growth battle trait to heal this general, you can heal up to D3 wounds allocated to this general instead of 1.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
