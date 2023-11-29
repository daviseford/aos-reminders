import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_ANY_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts = {
  'Master Rune of Unbreakable Resolve': {
    effects: [
      {
        name: `Master Rune of Unbreakable Resolve`,
        desc: `Once per battle, at the start of a phase, you can say that the bearer will use their master rune. If you do so, the bearer has a ward of 3+ until the end of that phase.`,
        when: [START_OF_ANY_PHASE],
      },
    ],
  },
  'Magnetised Runes': {
    effects: [
      {
        name: `Magnetised Runes`,
        desc: `Add 2 to charge rolls made for the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'The Fiery Ring': {
    effects: [
      {
        name: `The Fiery Ring`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 6" of the bearer and roll a dice. On a 2+, that unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Draught of Magmalt Ale': {
    effects: [
      {
        name: `Draught of Magmalt Ale`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will drink their magmalt ale. If you do so, double the Attacks characteristic of the bearer's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Axe of Grimnir': {
    effects: [
      {
        name: `The Axe of Grimnir`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend characteristic of that weapon by 1 and add 1 to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Ash-cloud Rune': {
    effects: [
      {
        name: `Ash-cloud Rune`,
        desc: `Once per battle, at the start of the enemy hero phase, you can say that the bearer will call down a column of soot. If you do so, until the end of that phase, units wholly within 12" of the bearer are not visible to enemy units attempting to cast a spell.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Volatile Brazier': {
    effects: [
      {
        name: `Volatile Brazier`,
        desc: `When the bearer attempts to summon an invocation, you can reroll chanting rolls for the bearer and the range of the prayer is doubled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Droth-helm': {
    effects: [
      {
        name: `Droth-helm`,
        desc: `Add 1 to wound rolls for attacks made with Claws and Horns by friendly MAGMADROTHS wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Daemon Slayer': {
    effects: [
      {
        name: `The Daemon Slayer`,
        desc: `Pick 1 of the bearer's melee weapons. Ward rolls cannot be made for wounds and mortal wounds caused by attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Nulsidian Icon': {
    effects: [
      {
        name: `Nulsidian Icon`,
        desc: `This artefact of power can only be given to a BATTLESMITH. Each time a friendly FYRESLAYERS unit wholly within 12" of the bearer is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mastery Over Monsters': {
    effects: [
      {
        name: `Mastery Over Monsters`,
        desc: `While the bearer is contesting an objective, each enemy MONSTER contesting that objective counts as 2 models regardless of any other abilities that would allow that enemy MONSTER to count as more models (such as Mightier Makes Rightier).`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')
