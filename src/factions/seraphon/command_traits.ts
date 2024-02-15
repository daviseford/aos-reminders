import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'

const CommandTraits = {
  'Arcane Might': {
    effects: [
      {
        name: `Arcane Might`,
        desc: `This general can control up to 3 predatory endless spells per hero phase. In addition, when this general casts a spell that summons an endless spell, the range of that spell is doubled.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Higher State of Consciousness': {
    effects: [
      {
        name: `Higher State of Consciousness`,
        desc: `Ignore modifiers (positive and negative) to save rolls for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },

  'Lord of Celestial Resonance': {
    effects: [
      {
        name: `Lord of Celestial Resonance`,
        desc: `The first time each phase that this general either successfully casts a spell that is not unbound, successfully unbinds a spell or successfully dispels an endless spell, you receive 2 cosmic power points instead of 1.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SERAPHON, meta_rule_sources.BATTLESCROLL_NULLSTONE_CACHE],
      },
    ],
  },

  'Vast Intellect': {
    effects: [
      {
        name: `Vast Intellect`,
        desc: `This general knows 2 extra spells from the Lore of Celestial Domination.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Thickly Scaled Hide': {
    effects: [
      {
        name: `Thickly Scaled Hide`,
        desc: `Add 1 to save rolls for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },

  'Master of Star-rituals': {
    effects: [
      {
        name: `Master of Star Rituals`,
        desc: `WIZARD only. This general knows all the spells from the Lore of Celestial Manipulation in addition to any other spells they know.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Nimble Warleader': {
    effects: [
      {
        name: `Nimble Warleader`,
        desc: `Roll 2D6 instead of D6 when making run rolls for friendly SKINK units while they are wholly within 18" of this general.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  'Shrewd Strategist': {
    effects: [
      {
        name: `Shrewd Strategist`,
        desc: `Once per battle, at the start of your opponent's combat phase, you can pick 1 friendly SERAPHON unit wholly within 18" of this general. If that unit is within 12" of any enemy units but more than 3" from all enemy units, it can immediately attempt a charge.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'Prime Warbeast': {
    effects: [
      {
        name: `Prime Warbeast`,
        desc: `Unit with mount only. Add 1 to the Attacks characteristic of the weapons used by this general's mount.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Wrath of Aeons': {
    effects: [
      {
        name: `Wrath of Aeons`,
        desc: `Once per battle, at the start of your combat phase, you can say that this general will rouse the wrath of the Seraphon. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly SAURUS and KROXIGOR units while they are wholly within 12" of this unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Custodian of Divine Technology': {
    effects: [
      {
        name: `Custodian of Divine Technology`,
        desc: `Pick 2 artefacts of power from the Treasures of the Temple-cities table and note them on your roster. This general has both of those artefacts of power, but they cannot be given any others. These 2 artefacts of power are in addition to the first artefact of power enhancement you can take for your army.`,
        when: [DURING_SETUP],
      },
    ],
  },
  'Master of the Material Plane': {
    effects: [
      {
        name: `Master of the Material Plane`,
        desc: `This general knows 2 extra spells from the Lore of Ancient Domains.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dominating Mind': {
    effects: [
      {
        name: `Dominating Mind`,
        desc: `Once per turn, at the start of your hero phase, you can pick 1 friendly COALESCED MONSTER unit on the battlefield and say that it will have its mind dominated by this general. If you do so, roll a dice. On a 2+, add 1 to wound rolls for attacks made with melee weapons by that unit until the start of your next hero phase. If the unit picked to have its mind dominated has a mount, this command trait only affects attacks made by that unit's mount.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Vengeful Defender': {
    effects: [
      {
        name: `Vengeful Defender`,
        desc: `At the start of your hero phase, if this general is wholly within your territory, you can pick this general and up to 2 other friendly SAURUS or KROXIGOR units wholly within 12" of this general to each make a normal move.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
