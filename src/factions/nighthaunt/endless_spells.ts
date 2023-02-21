import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { END_OF_HERO_PHASE, HERO_PHASE } from 'types/phases'

// Add Endless spells here
const EndlessSpells = {
  'Shyish Reaper': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6". Only Nighthaunt Wizards can attempt to summon this endless spell. If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models and other endless spells or invocations.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. You can move it up to 8" and it can fly. Before moving this endless spell, you can pivot the endless spell on the centre of its base so that it is facing in any direction. This pivot is free and does not count towards the distance the endless spell moves. When you move this endless spell, it must move in a straight line in the direction the tip of the blade is pointing.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Soul Reaper`,
        desc: `After this endless spell has moved, roll 2 dice for each unit that it passed across (including models it moved over when it pivoted) and each other unit that is within 1" of it at the end of its move. Add 1 to the roll if that unit is terrified. For each roll that is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Vault of Souls': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6". Only Nighthaunt Wizards can attempt to summon this endless spell. If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models and other endless spells or invocations.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Soul Eruption`,
        desc: `After this endless spell has moved, roll a dice for each model within 6" of it. Add 1 to the roll if that model's unit is terrified. On a 6+, that model's unit suffers 1 mortal wound. Keep track of the number of mortal wounds caused by this endless spell. If the total is 10 or more at the end of any phase, roll a dice for each unit within 6" of this endless spell. Add 1 to the roll if that unit is terrified. On a 2+, that unit suffers a number of mortal wounds equal to the roll, then this endless spell is dispelled.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Mortalis Terminexus': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 12". Only Nighthaunt Wizards can attempt to summon this endless spell. If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models and other endless spells or invocations.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Keeper of Mortality`,
        desc: `After this endless spell has moved, the player who moved it can decide whether the Mortalis Terminexus will reverse time or hasten time.

        If they choose to reverse time, heal D3 wounds allocated to each unit within 6" of this endless spell.

        If they choose to hasten time, roll a dice for each unit within 6" of this endless spell. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
