import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  END_OF_CHARGE_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// Endless spells.
const EndlessSpells = {
  Bladewind: {
    effects: [
      GenericEffects.Predatory.Twelve_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 9". If successfully cast, set up this endless spell wholly within range of the caster. Only Daughters of Khaine Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unnatural Edge`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across and for each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers 1 mortal wound. In addition, do not apply the cover modifier to save rolls for attacks that target units within 12" of this endless spell.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Unnatural Edge`,
        desc: `Do not apply the cover modifier to save rolls for attacks that target units within 12" of this endless spell.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Bloodwrack Viper': {
    effects: [
      GenericEffects.Predatory.Nine_Inches,
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 9". If successfully cast, set up this endless spell wholly within range of the caster. Only Daughters of Khaine Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fanged Strike`,
        desc: `After this endless spell has moved, the commanding player must pick 1 unit within 1" of it and roll 3 dice. For each roll that is equal to or greater than that unit's Wounds characteristic, 1 model in that unit is slain.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Monster of Blood`,
        desc: `At the end of the charge phase, the commanding player can count this endless spell as a MONSTER for the purposes of the Monstrous Rampage rules (core rules, 21.1) but they can only carry out a Stomp or Smash To Rubble monstrous rampage with it. It cannot be picked to be the target of a monstrous rampage.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Heart of Fury': {
    effects: [
      {
        name: `Summoning`,
        desc: `This invocation is summoned with a prayer that has an answer value of 3 and a range of 12". If answered, set up this invocation wholly within range and visible to the chanter. Only Daughters of Khaine Priests can attempt to summon this invocation.`,
        when: [HERO_PHASE],
      },
      {
        name: `Locus of the Murder God`,
        desc: `At the start of the combat phase, if this invocation is on the battlefield, the commanding player must roll a dice.

        On a 1-5, until the end of that phase, subtract 1 from the damage inflicted (to a minimum of 1) by each successful attack that targets a Daughters of Khaine unit in the commanding player's army wholly within 12" of this invocation.

        On a 6, until the end of that phase, subtract 1 from the damage inflicted (to a minimum of 1) by each successful attack that targets a Daughters of Khaine unit in the commanding player's army wholly within 12" of this invocation and add 1 to the Attacks characteristic of melee weapons used by Daughters of Khaine units in the commanding player's army wholly within 12" of this invocation.

        In addition, if the roll was a 6, this invocation is removed from play at the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(EndlessSpells, 'endless_spell')
