import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_SHOOTING_PHASE,
  START_OF_SETUP,
  WARDS_PHASE,
} from 'types/phases'

const Artifacts = {
  'Masterwrought Armour': {
    effects: [
      {
        name: `Masterwrought Armour`,
        desc: `The bearer has a ward of 5+`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Celestium Burst-grenade': {
    effects: [
      {
        name: `Celestium Burst-grenade`,
        desc: `Once per battle, you can pick 1 enemy unit within 12". On a D6 2+, ward rolls cannot be made for models in that unit in that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  "Blazebeard and Sons 'Drakk-hobbler' Mag-bolas": {
    effects: [
      {
        name: `Blazebeard and Sons 'Drakk-hobbler' Mag-bolas`,
        desc: `You can pick 1 enemy MONSTER within 12". On a D6 2+, that unit is grappled until the end of your opponent's next turn. While grappled, roll 1 fewer dice when making a charge, to a minimum of 1 dice.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Spell in a Bottle': {
    effects: [
      {
        name: `Spell in a Bottle`,
        desc: `Pick 1 endless spell that does not belong to a faction. You can include that endless spell in your army without spending any points to do so.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Spell in a Bottle`,
        desc: `Once per battle, bearer can automatically cast the spell that summons the endless spell (do not make a casting roll), and it cannot be unbound. Bearer cannot control the endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Phosphorite Bomblets': {
    effects: [
      {
        name: `Phosphorite Bomblets`,
        desc: `Once per battle, you can pick 1 enemy unit within 6". Ona D6 2+, the unit suffers 1 MW and you may roll again. Repeat until you roll a 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Voidstone Orb': {
    effects: [
      {
        name: `Voidstone Orb`,
        desc: `Once per battle, when attempting to unbind a spell, the bearer can unbind it automatically (do not make an unbinding roll).`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Grundstok Expeditionary Force
  'Aetheric Nullifier': {
    effects: [
      {
        name: `Aetheric Nullifier`,
        desc: `Each time a friendly GRUNDSTOK EXPEDITIONARY FORCE unit wholly within 12" of the bearer is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  "'Gimlet Gaze' Scope": {
    effects: [
      {
        name: `'Gimlet Gaze' Scope`,
        desc: `Add 9" to the Range characteristic of missile weapons used by the bearer.`,
        when: [SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Grudgefire Rounds': {
    effects: [
      {
        name: `Grudgefire Rounds`,
        desc: `Pick 1 of the bearer's missile weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack causes a number of mortal wounds to the target equal to its Damage characteristic and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
