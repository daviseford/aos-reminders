import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const EndlessSpells = {
  Gladewyrm: {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7 and range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only SYLVANETH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Death From Below`,
        desc: `After this endless spell has moved, roll a dice for each unit within 1" of it. On a 3+, that unit suffers D3 mortal wounds. This ability has no effect on SYLVANETH units.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Healing Mist`,
        desc: `After this endless spell has moved, roll a dice for each SYLVANETH unit within 6" of this model. On a 3+, heal up to D3 wounds allocated to that unit.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Spiteswarm Hive': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7 and range of 15". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only SYLVANETH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `The Hive Nourishes`,
        desc: `At the end of the hero phase, if a SYLVANETH WIZARD or SYLVANETH HERO is within 6" of this endless spell, that unit's commanding player can use 1 of the following abilities:

        Vital Venoms: Roll a dice for each friendly SYLVANETH unit wholly within 8" of this endless spell. On a 2+, add 3" to normal moves and charge moves for that unit until the end of that turn.

        Shielding Swarm: Roll a dice for each friendly SYLVANETH unit wholly within 8" of this endless spell. On a 2+, add 1 to save rolls for attacks that target that unit until the end of that turn.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Vital Venoms`,
        desc: `If active, add 3" to normal moves and charge moves for that unit until the end of that turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Shielding Swarm`,
        desc: `If active, add 1 to save rolls for attacks that target that unit until the end of that turn.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Vengeful Skullroot': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only SYLVANETH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Terrors Unearthed`,
        desc: `If a unit fails a battleshock test within 3" of this endless spell, add D3 to the number of models that flee. This ability has no effect on SYLVANETH units.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Strangleroots`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across. On a 2+, that unit suffers D3 mortal wounds, or D6 mortal wounds if that unit is within 3" of any AWAKENED WYLDWOODS. This ability has no effect on SYLVANETH units.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_JULY_2021],
      },
      GenericEffects.Predatory.Eight_Inches,
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
