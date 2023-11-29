import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import { DURING_GAME, SHOOTING_PHASE, START_OF_HERO_PHASE, WARDS_PHASE } from 'types/phases'

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

  'Battle Tactics': {
    effects: [
      {
        name: `That's Mine!`,
        desc: `Pick 1 objective on the battlefield that is not within your territory. You complete this tactic if that objective is kicked away and is wholly within your territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Wrecking Crew`,
        desc: `You complete this tactic if an enemy faction terrain feature was demolished during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Man-skittles`,
        desc: `You complete this tactic if a friendly Warstomper used its 'Hurled Body' ability, an enemy model was slain by the first part of the ability, and an enemy Battleline unit was picked for the second part of the ability and suffered any mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Fury of Titans`,
        desc: `You complete this tactic if you carry out the Beast Grapple, Earth-Shaking Roar and Colossal Slam monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Splat!`,
        desc: `Pick 1 enemy Hero. You complete this tactic if that Hero is slain by wounds caused by an attack made with Throwin' Rocks, Hurled Debris or a Hurled Boulder during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Colossal Violence`,
        desc: `Pick 1 friendly Mega-Gargant. You complete this tactic if you carried out the Titanic Duel monstrous rampage with that unit during this turn and the enemy Monster picked as the target was slain by attacks made by that unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  "King Brodd's Stomp": {
    effects: [
      {
        name: `These Realms Is Ours`,
        desc: `Each MEGA-GARGANT has a Mightier Makes Righlier value listed on its damage table on its warscroll. For the purposes of contesting objectives, each MEGA- GARGANT model in a King Brodd's Stomp army counts as a number of models equal to its Mightier Makes Rightier value, while each MANCRUSHER GARGANT model counts as 10 models.`,
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

  "King Brodd's Stomp Battle Tactics": {
    effects: [
      {
        name: `'Good Shot! Hur Hur!'`,
        desc: `You complete this battle tactic if an enemy unit was destroyed during this turn by an attack made with the Hurled Terrain missile weapon.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `King's Conquest`,
        desc: `You complete this battle tactic if a friendly KING BRODD and 1 other friendly KING BRODD'S STOMP unit are contesting the same objective at the end of this turn and that objective was controlled by your opponent at the start of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Clear 'Em Out`,
        desc: `Pick 1 objective on the battlefield that you do not control. You complete this battle tactic if, at the end of this turn, you control that objective and that objective is contested by a friendly KING BR0DD's STOMP unit that made a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')
