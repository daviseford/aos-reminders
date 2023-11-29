import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { SKAVEN } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import { COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const BattleTraits = {
  [SKAVEN]: {
    effects: [
      {
        name: `Lead From The Back`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons if the target is a friendly SKAVEN HERO that is not a MONSTER and is within 3" of any friendly SKAVEN units that have 3 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scurry Away`,
        desc: `In the combat phase, when you pick a friendly SKAVEN HERO that does not have a mount to fight, you can say that it will scurry away instead. If you do so, that HERO can retreat.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Strength in Numbers`,
        desc: `Add 1" to the range of melee weapons used by friendly SKAVEN units for every 10 models in the attacking unit (to a maximum of 3").`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Restore the Beast`,
        desc: `Pick 1 friendly RAT OGOR unit on the battlefield that has 3 or more wounds allocated to it. You complete this tactic if that RAT OGOR unit has 0 wounds allocated to it at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Deathmark`,
        desc: `Pick 1 enemy HERO on the battlefield that has a Wounds characteristic of 10 or more and that has 0 wounds allocated to it. You complete this tactic if that HERO is slain in this turn by attacks made by friendly CLANS ESHIN units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Fire-fire! More-more!`,
        desc: `Pick 1 enemy MONSTER on the battlefield. You complete this tactic if that unit is destroyed in this turn by attacks made with missile weapons by friendly CLANS SKRVRE units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Crescendo of the Diseased Choir`,
        desc: `You complete this tactic if 3 or more prayers chanted by different friendly CLANS PESTILENS PRIESTS are answered in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Flee-flee!`,
        desc: `You complete this battle tactic at the end of the turn if any friendly Skaven Battleline units retreated this turn and any friendly Skaven Heroes retreated this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
