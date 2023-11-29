import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { DURING_ANY_PHASE, DURING_GAME, MOVEMENT_PHASE } from 'types/phases'

const BattleTraits = {
  'Grundstok Expeditionary Force': {
    effects: [
      {
        name: `Only The Best`,
        desc: `Friendly GRUNDSTOK EXPEDITIONARY FORCE units that do not have the Leader battlefield role gain the Battleline battlefield role.`,
        when: [DURING_GAME],
        rule_sources: [
          meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2,
          meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2,
        ],
      },
      {
        name: `Grudgesettler Protocols`,
        desc: `In any phase, after a friendly Grundstok Expeditionary Force unit has shot or fought for the first time in that phase, you can roll a dice. On a 4+, that unit immediately shoots or fights for a second time in that phase. However, you must subtract 1 from hit rolls for attacks made in this way.

        Designer's Note: This ability can be used in your opponent's turn after a Grundstok Expeditionary Force unit shoots with the Unleash Hell command. The second time it shoots, those attacks are part of that Unleash Hell command and must target the same enemy unit. `,
        when: [DURING_ANY_PHASE],
        rule_sources: [
          meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2,
          meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2,
        ],
      },
      {
        name: `Rapid Redeployment`,
        desc: `Each time a friendly Grundstok Gunhauler makes a normal move or runs, you can say that it will transport a friendly unit. If you do so, before the move is made, you can pick up to 2 other friendly Grundstok Expeditionary Force units with a combined model count of 6 or less. Each unit must have a Wounds characteristic of 6 or less and must be within 3" of the Grundstok Gunhauler and more than 3" from all enemy units (you can pick a unit that has already moved in that phase). Remove that unit from the battlefield. Then, when the Grundstok Gunhauler finishes its move, set up the transported unit on the battlefield again, wholly within 3" of the Grundstok Gunhauler and more than 3" from all enemy units. Units transported in this manner cannot make a charge move in the same turn.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [
          meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2,
          meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2,
        ],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
