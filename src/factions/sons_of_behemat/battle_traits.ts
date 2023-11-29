import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import { DURING_GAME, SHOOTING_PHASE, WARDS_PHASE } from 'types/phases'

const BattleTraits = {
  [SONS_OF_BEHEMAT]: {
    effects: [
      {
        name: `Mightier Makes Rightier`,
        desc: `Each Mega-Gargant has a Mightier Makes Rightier value listed on its damage table on its warscroll. For the purposes of contesting objectives, each Mega-Gargant model in a Sons of Behemat army counts as a number of models equal to its Mightier Makes Rightier value, while each Mancrusher Gargant model counts as 10 models.`,
        when: [DURING_GAME],
      },
      {
        name: `Chuck Rocks`,
        desc: `In your shooting phase, you can pick 1 friendly MANCRUSHER GARGANT unit wholly within 18" of your general. Each model in that unit can make a shooting attack with the Chuck Rocks missile weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  "King Brodd's Stomp": {
    effects: [
      {
        name: `These Realms Is Ours`,
        desc: `Each MEGA-GARGANT has a Mightier Makes Righlier value listed on its damage table on its warscroll. For the purposes of contesting objectives, each MEGA-GARGANT model in a King Brodd's Stomp army counts as a number of models equal to its Mightier Makes Rightier value, while each MANCRUSHER GARGANT model counts as 10 models.`,
        when: [DURING_GAME],
      },
      {
        name: `The World Titan's Prophet`,
        desc: `If your army includes KING BRODD, he has a ward of 5+ while he is within 3" of any other friendly units.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Smash It All To Bits`,
        desc: `Once per turn, in your shooting phase, you can pick 1 terrain feature that does not have any units with the Monster keyword wholly or partially on it and 1 friendly Mega-Gargant within 1" of it. If you do so, roll a dice. On a 2+, that terrain feature is sundered.

        If a terrain feature is sundered, roll a dice for each unit that has any models on or garrisoning that terrain feature. On a 2+, that unit suffers D3 mortal wounds. Then, starting with the active player, each player must remove all friendly models that were on or garrisoning that terrain feature and set them up wholly within 6" of, but not on, that terrain feature and more than 3" from all enemy units. Those models must be set up in coherency with any models in their unit, including those that were not on or garrisoning that terrain feature. If a model cannot be set up following these restrictions, it is slain. The terrain feature is then removed from play.

        Finally, the Mega-Gargant you picked can make a shooting attack in that phase with the Hurled Terrain missile weapon below (this is treated as an additional weapon profile that can be used when you pick that unit to shoot)`,
        when: [SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
