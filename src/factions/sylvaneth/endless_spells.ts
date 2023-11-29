import { TItemDescriptions } from 'factions/factionTypes'
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

const EndlessSpells = {
  Gladewyrm: {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7. Set up this endless spell wholly within 6" of the caster. Only SYLVANETH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Death From Below`,
        desc: `After this endless spell has moved, roll a dice for each unit within 1" of it. On a 3+, that unit suffers D3 mortal wounds. This ability has no effect on SYLVANETH units.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Healing Mist`,
        desc: `After this endless spell has moved, roll a dice for each SYLVANETH unit within 6" of this model. On a 3+, heal up to D3 wounds allocated to that unit.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Spiteswarm Hive': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7. Set up this endless spell wholly within 15" of the caster. Only SYLVANETH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Hive Nourishes`,
        desc: `At the end of the hero phase, if a SYLVANETH WIZARD or SYLVANETH HERO in that player's army is within 9" of this endless spell, that unit's commanding player can use 1 of the following abilities:

        Vital Venoms: Pick 1 friendly SYLVANETH unit wholly within 9" of this endless spell. On a 2+, add 3" to normal moves and charge moves for that unit until the end of that turn.

        Shielding Swarm: Pick 1 friendly SYLVANETH unit wholly within 9" of this endless spell. On a 2+, worsen the Rend characteristic of attacks that target that unit by 1 (to a minimum of ) until the end of that turn.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Vital Venoms`,
        desc: `If active, add 3" to normal moves and charge moves for that unit until the end of that turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Shielding Swarm`,
        desc: `If active, worsen the Rend characteristic of attacks that target that unit by 1 (to a minimum of ) until the end of that turn.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Vengeful Skullroot': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6. Set up this endless spell wholly within 6" of the caster. Only SYLVANETH WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Terrors Unearthed`,
        desc: `If a unit fails a battleshock test within 3" of this endless spell, add D3 to the number of models that flee. This ability has no effect on SYLVANETH units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Strangleroots`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across and each other unit within 1" of it at the end of its move. On a 2+, that unit suffers D3 mortal wounds, or D6 mortal wounds if that unit is also within 6" of any AWAKENED WYLDWOODS. This ability has no effect on SYLVANETH units.`,
        when: [END_OF_HERO_PHASE],
      },
      GenericEffects.Predatory.Eight_Inches,
    ],
  },
} satisfies TItemDescriptions

export default tagAs(EndlessSpells, 'endless_spell')
