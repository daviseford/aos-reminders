import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const EndlessSpells = {
  'Bone-tithe Shrieker': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 12". If successfully cast, set up this endless spell within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only OSSIARCH BONEREAPERS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Eight_Inches,
      ...GenericEffects.Bonded,
      {
        name: `Portent of Doom`,
        desc: `Units cannot receive the Inspiring Presence or Rally commands while they are within 12" of this endless spell. This ability has no effect on OSSIARCH BONEREAPERS units.`,
        when: [START_OF_BATTLESHOCK_PHASE, START_OF_HERO_PHASE],
      },
      {
        name: `No Escape`,
        desc: `Subtract 1 from ward rolls for units within 12" of this endless spell. This ability has no effect on OSSIARCH BONEREAPERS units.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Nightmare Predator': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      ...GenericEffects.Bonded,
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 12". If successfully cast, set up this endless spell within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only OSSIARCH BONEREAPERS WIZARDS can attempt to summon this endless spell. A WIZARD in a garrison cannot attempt to summon this endless spell, and if this endless spell is summoned, the WIZARD that summoned it cannot join a garrison until this endless spell has been removed from play.`,
        when: [HERO_PHASE],
      },
      {
        name: `Death Incarnate`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across. On a 2+, that unit suffers D3 mortal wounds. Then, the commanding player can pick 1 unit within 1" of this endless spell and roll a dice. On a 1, nothing happens. On a 2-5, that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds. This ability has no effect on OSSIARCH BONEREAPERS units.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Soulstealer Carrion': {
    effects: [
      GenericEffects.Predatory.Eight_Inches,
      ...GenericEffects.Bonded,
      {
        name: `Summoning`,
        desc: `Casting value of 6. If successfully cast, set up this endless spell anywhere on the battlefield that is visible to the caster, and more than 1" from all models, other endless spells and invocations. Only OSSIARCH BONEREAPERS WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aviarch Sentry`,
        desc: `Models with a Wounds characteristic of 1 or 2 that are within 6" of this endless spell cannot contest objectives. This ability has no effect on OSSIARCH BONEREAPERS units.`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(EndlessSpells, 'endless_spell')
