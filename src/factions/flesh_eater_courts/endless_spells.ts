import { tagAs } from 'factions/metatagger'
import {
  DURING_GAME,
  END_OF_HERO_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const EndlessSpells = {
  'Corpsemare Stampede': {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 12" and can fly.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 3D6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only FLESH-EATER COURTS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Trampled Underfoot`,
        desc: `After this endless spell has moved, roll 5 dice for each unit that has any models it passed across. For each roll that is more than that unit's Wounds characteristic, that unit suffers 1 mortal wound. For each 6, that unit instead suffers 1 mortal wound regardless of its Wounds characteristic.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
    ],
  },
  'Chalice of Ushoran': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 24". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only FLESH-EATER COURTS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Soul Stealer`,
        desc: `Keep track of the number of models that are slain within 12" of this endless spell each turn. At the end of each turn, roll a dice for each model that was slain within 12" of this endless spell during that turn. For each 4+, the commanding player can heal 1 wound allocated to 1 FLESH-EATER COURTS model within 12" of this endless spell or return 1 slain model to 1 FLESH-EATER COURTS unit with a Wounds characteristic of 1 that is wholly within 12" of this endless spell.`,
        when: [END_OF_TURN],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JANUARY_2021,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Soul Stealer`,
        desc: `Keep track of the number of models that are slain within 12" of this endless spell each turn.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JANUARY_2021,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
    ],
  },
  'Cadaverous Barricade': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 24". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, terrain features, other endless spells and invocations. Only FLESH-EATER COURTS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Grasping Hands`,
        desc: `If a model starts a move within 3" of this terrain feature, halve the distance that model can move when it makes that move. DEATH models are not affected by this scenery rule.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Terrain Feature`,
        desc: `After it is set up, this endless spell is treated as a terrain feature that has the Grasping Hands scenery rule, except that it can still be dispelled as if it were an endless spell.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
