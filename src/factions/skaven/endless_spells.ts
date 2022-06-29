import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

const EndlessSpells = {
  'Warp Lightning Vortex': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 8 and a range of 13". If successfully cast, set up 1 part of the endless spell wholly within range of the caster, then set up the second and third parts exactly 7" from the first part and exactly 7" from each other (the parts will form a triangle with each part exactly 7" from the other two parts). All of the parts must be set up more than 1 " from all models, other endless spells and invocations. Only Skaven Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warp Lightning Bolts`,
        desc: `After this endless spell is set up and at the end of each movement phase, roll a dice for each unit within 6" of this endless spell. Add 1 to the roll if that unit is within 6" of 2 parts of this endless spell. Add 2 to the roll instead if that unit is within 6" of all 3 parts of this endless spell. On a 4+, that unit suffers D3 mortal wounds. On an unmodified roll of 6, that unit suffers D6 mortal wounds instead of D3.`,
        when: [HERO_PHASE, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Warp Vortex`,
        desc: `Units within 3" of this endless spell cannot run.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Vermintide: {
    effects: [
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. It can be moved up to 7".`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 18". If successfully cast, set up the endless spell wholly within range and visible to the caster, more than 1 " from all models, other endless spells and invocations. Only Skaven Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ravening Horde`,
        desc: `After this endless spell has moved, the commanding player can pick 1 unit within 3" of it and roll 13 dice. For each 6, that unit suffers 1 mortal wound. In addition, roll 13 dice for each unit that finishes a normal move, run, retreat or charge move within 3" of this endless spell. For each 6, that unit suffers 1 mortal wound.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Ravening Horde`,
        desc: `Roll 13 dice for each unit that finishes a normal move, run, retreat or charge move within 3" of this endless spell. For each 6, that unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Bell of Doom': {
    effects: [
      GenericEffects.Predatory.Two_D6,
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 13". If successfully cast, set up the endless spell wholly within range and visible to the caster, more than 1 " from all models, other endless spells and invocations. Only Skaven Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Apocalyptic Doom`,
        desc: `After this endless spell has moved, roll 3D6. On a 13, each unit within 13" of this endless spell suffers D3 mortal wounds, and then this endless spell is removed from play.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Boldness or Despair`,
        desc: `Do not take battleshock tests for Skaven units wholly within 13" of this endless spell. Subtract 1 from the Bravery characteristic of other units within 13" of this endless spell.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
