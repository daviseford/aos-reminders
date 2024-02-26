import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  DURING_GAME,
  END_OF_HERO_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const EndlessSpells = {
  'Corpsemare Stampede': {
    effects: [
      GenericEffects.Predatory.Twelve_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 3D6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only FLESH-EATER COURTS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Trampled Underfoot`,
        desc: `After this endless spell has moved, roll 6 dice for each unit that has any models it passes across. For each roll that is greater than that unit's Wounds characteristic, that unit suffers 1 mortal wound. For each 6, that unit instead suffers 1 mortal wound regardless of its Wounds characteristic.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Chalice of Ushoran': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 24". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only FLESH-EATER COURTS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Soul Stealer`,
        desc: `Keep track of the number of models that are slain within 12" of this endless spell each turn. At the end of each turn, roll a dice for each model that was slain within 12" of this endless spell during that turn. For each 4+, the commanding player can heal 1 wound allocated to 1 FLESH-EATER COURTS model within 12" of this endless spell or return 1 slain model to 1 FLESH-EATER COURTS unit that has a Wounds characteristic of 1 that is wholly within 12" of this endless spell.`,
        when: [END_OF_TURN],
      },
      {
        name: `Soul Stealer`,
        desc: `Keep track of the number of models that are slain within 12" of this endless spell each turn.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Cadaverous Barricade': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 24". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, terrain features, other endless spells and invocations. Only FLESH-EATER COURTS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grasping Hands`,
        desc: `Enemy units within 3" of this terrain feature cannot run or retreat. In addition, if an enemy model starts a move within 3" of this terrain feature, halve the distance that model can move when it makes that move.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Terrain Feature`,
        desc: `After it is set up, this endless spell is treated as a terrain feature that has the Grasping Hands scenery rule, except that it can still be dispelled as if it were an endless spell.`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(EndlessSpells, 'endless_spell')
