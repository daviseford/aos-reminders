import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  CHARGE_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Endless spells.
const EndlessSpells = {
  'Malevolent Moon': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 12". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Gloomspite Gitz Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      GenericEffects.Predatory.Twelve_Inches,
      {
        name: `Malevolent Intentions`,
        desc: `After this endless spell has moved, roll a dice for each unit within 3" of it. On a 2+, that unit suffers D3 mortal wounds. Gloomspite Gitz units are not affected by this ability.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Lurid Light`,
        desc: `While this endless spell is controlled by a model in a Gloomspite Gitz army, Gloomspite Gitz units in the same army are affected by the Light of the Bad Moon while they are wholly within 12" of this endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Mork's Mighty Mushroom": {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6D6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Gloomspite Gitz Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mutating Spores`,
        desc: `At the start of the shooting phase, roll a number of dice for each unit within 8" of this endless spell equal to the number of models in that unit that are within 8" of this endless spell. For each 5+, that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  "Scrapskuttle's Arachnacauldron": {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 5 and a range of 1". If successfully cast, set up this endless spell within range and visible to the caster, and more than 1" from all other models, other endless spells and invocations. Only Gloomspite Gitz Wizards can attempt to summon this endless spell. A Wizard in a garrison cannot attempt to summon this endless spell, and if this endless spell is summoned, the Wizard that summoned it cannot join a garrison until this endless spell has been removed from play.`,
        when: [HERO_PHASE],
      },
      {
        name: `Linked`,
        desc: `This endless spell must remain within 1" of the model that summoned it. For rules purposes, this endless spell and the model that summoned it are treated as a single model that uses that model's warscroll, with the addition of the abilities on this warscroll.

        If the model that summoned this endless spell is slain, then this endless spell is immediately removed from play. If this endless spell is dispelled and the model that summoned it has not been slain, remove this endless spell from play but leave the model that summoned it on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Linked`,
        desc: `If the model that summoned this endless spell is slain, then this endless spell is immediately removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Blessings of the Cauldron`,
        desc: `The model that summoned this endless spell can attempt to cast 1 additional spell while this endless spell is on the battlefield. In addition, if the model that summoned this endless spell is a Moonclan unit in a Gloomspite Gitz army, it knows all of the spells from the Lore of the Moonclans while this endless spell is on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodslither Pact`,
        desc: `After this endless spell is set up and at the start of each of their hero phases, the commanding player must pick 1 unit within 3" of the model that summoned this endless spell. That unit suffers 1 mortal wound that cannot be negated.

        Designer's Note: If there are no other units within 3", then the model that summoned this endless spell must be picked to suffer the mortal wound. `,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
      },
    ],
  },
  Scuttletide: {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7. Add 1 to casting rolls for this spell if the caster is a Spiderfang Wizard. If successfully cast, set up this endless spell within 8" of a terrain feature that is visible to the caster, and more than 1" from all models, other endless spells and invocations. Only Gloomspite Gitz Wizards can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. It can be moved up to 8".`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Scuttling Horde`,
        desc: `After this endless spell has moved, the commanding player can pick 1 unit within 1" of this endless spell and roll 8 dice. For each 5+, that unit suffers 1 mortal wound. In addition, roll 8 dice for each unit that finishes a normal move, run, retreat or charge move within 6" of this endless spell. For each 5+, that unit suffers 1 mortal wound. Spiderfang units are not affected by this ability.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Scuttling Horde`,
        desc: `Roll 8 dice for each unit that finishes a normal move, run, retreat or charge move within 6" of this endless spell. For each 5+, that unit suffers 1 mortal wound. Spiderfang units are not affected by this ability.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Endless Terrors`,
        desc: `While this endless spell is wholly within 12" of any Arachnarok units, it can only be dispelled with a dispelling roll of 9+.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
