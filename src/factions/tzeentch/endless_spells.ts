import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { END_OF_HERO_PHASE, END_OF_MOVEMENT_PHASE, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'
import Spells from './spells'
import { TItemDescriptions } from 'factions/factionTypes'

// Endless prayers.
const EndlessSpells = {
  'Daemonic Simulacrum': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7 and range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Disciples of Tzeentch Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Nine_Inches,
      {
        name: `Snapping Jaws`,
        desc: `After this endless spell has moved, roll 9 dice for the closest unit within 6" of it. If more than 1 such unit is equally close, the commanding player can choose which unit to roll for. For each 5+, that unit suffers 1 mortal wound. If that unit is a Wizard, it suffers 1 mortal wound for each 4+ instead.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Tome of Eyes': {
    mandatory: {
      spells: [keyPicker(Spells, ['The Parchment Curse'])],
    },
    effects: [
      {
        name: `Summoning`,
        desc: `This endless spell is summoned with a spell that has a casting value of 5 and range of 1". If successfully cast, set up this endless spell within range and visible to the caster, and more than 1" from all other models, other endless spells and invocations. Only Disciples of Tzeentch Wizards can attempt to summon this endless spell.

        A Wizard in a garrison cannot attempt to summon this endless spell, and if this endless spell is summoned, the Wizard that summoned it cannot join a garrison until this endless spell has been removed from play.`,
        when: [HERO_PHASE],
      },
      {
        name: `Linked`,
        desc: `After the model that summoned this endless spell has moved, remove this endless spell from the battlefield and set it up again within 1" of that model and more than 1" from all other models, other endless spells and invocations. If the model that summoned this endless spell is removed from play, then this endless spell is removed from play.`,
        when: [MOVEMENT_PHASE],
      },
      GenericEffects.Linked,
      {
        name: `Transfixed by Countless Eyes`,
        desc: `You can reroll casting rolls for the model that summoned this endless spell while this endless spell is on the battlefield.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Burning Sigil of Tzeentch': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and range of 18". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Disciples of Tzeentch Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Radiant Transmogrification`,
        desc: `At the end of the movement phase, roll a dice for each unit within 9" of this endless spell. On a 4+, that unit suffers D3 mortal wounds. If any models were slain by this spell, before removing the first slain model, the commanding player of the model that summoned this endless spell can add 1 Tzeentch Chaos Spawn to their army and set it up within 3" of the slain model's unit. Then, remove the slain model.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(EndlessSpells, 'endless_spell')
