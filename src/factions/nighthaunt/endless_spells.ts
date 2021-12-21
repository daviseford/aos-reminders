import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { END_OF_HERO_PHASE, HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

// Add Endless spells here
const EndlessSpells = {
  'Shyish Reaper': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only NIGHTHAUNT WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. It can be moved up to 8" and can fly.

        Before this endless spell is moved, the commanding player can pivot it on the centre of its base so that it is facing in any direction. This pivot is free and does not count towards the distance the endless spell moves. When this endless spell is moved, it must move in a straight line in the direction in which the tip of the scythe blade is pointing.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Soul Reaper`,
        desc: `After this endless spell has moved, roll 2 dice for each unit that has any models it passed across (including models it passed across when it pivoted) and for each other unit within 1" of it at the end of its move. For each roll that is equal to or greater than that unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Vault of Souls': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only NIGHTHAUNT WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2021],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Soul Siphon`,
        desc: `After this endless spell has moved, roll a dice for each model within 6" of it. On a 6, that model's unit suffers 1 mortal wound. Keep track of the number of mortal wounds caused by this endless spell. If the total is 10 or more at the end of any phase, this endless spell erupts. If it does so, roll a dice for each unit within 6" of this endless spell. On a 2+, that unit suffers a number of mortal wounds equal to the roll. After you have rolled for each unit within 6" of this endless spell, this endless spell is removed from play.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Mortalis Terminexus': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 18". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Nighthaunt Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2021],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Keeper of Mortality`,
        desc: `After this endless spell has moved, the commanding player can choose whether it will reverse or hasten time. If they choose to reverse time, heal D3 wounds allocated to each unit within 6" of this endless spell. If they choose to hasten time, roll a dice for each unit within 6" of this endless spell. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_NIGHTHAUNT, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
