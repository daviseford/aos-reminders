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
import rule_sources from './rule_sources'

// Endless spells.
const EndlessSpells = {
  'Malevolent Moon': {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only GLOOMSPITE GITZ WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      GenericEffects.Predatory.Eight_Inches,
      {
        name: `Malevolent Intentions`,
        desc: `After this endless spell has moved, roll a dice for each unit that has any models it passed across. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Moon of Ill Omen`,
        desc: `Subtract 1 from casting rolls for WIZARDS within 9" of this endless spell. Subtract 2 from casting rolls instead for WIZARDS within 3" of this endless spell. GLOOMSPITE GITZ WIZARDS are not affected by this ability.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  "Mork's Mighty Mushroom": {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 6 and a range of 6D6". If successfully cast, set up this endless spell wholly within range and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only GLOOMSPITE GITZ WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Mutating Spores`,
        desc: `At the start of the shooting phase, roll a number of dice for each unit within 8" of this endless spell equal to the number of models in that unit that are within 8" of this endless spell. For each 5+, that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  "Scrapskuttle's Arachnacauldron": {
    effects: [
      {
        name: `Summoning`,
        desc: `This endless spell is summoned with a spell that has a casting value of 5 and a range of 1". If successfully cast, set up this endless spell within range and visible to the caster, and more than 1" from all other models, other endless spells and invocations. Only GLOOMSPITE GITZ WIZARDS can attempt to summon this endless spell.

        A WIZARD in a garrison cannot attempt to summon this endless spell, and if this endless spell is summoned, the WIZARD that summoned it cannot join a garrison until this endless spell has been removed from play.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Linked`,
        desc: `This endless spell must remain within 1" of the model that summoned it. For rules purposes, this endless spell and the model that summoned it are treated as a single model that uses that model's warscroll, with the addition of the abilities on this warscroll.

        If the model that summoned this endless spell is slain, then this endless spell is immediately removed from play. If this endless spell is dispelled and the model that summoned it has not been slain, remove this endless spell from play but leave the model that summoned it on the battlefield.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Linked`,
        desc: `If the model that summoned this endless spell is slain, then this endless spell is immediately removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Blessings of the Cauldron`,
        desc: `You can reroll casting, dispelling and unbinding rolls for the model that summoned this endless spell while this endless spell is on the battlefield. In addition, the model that summoned this endless spell knows all the spells from the Lore of the Moonclans while this endless spell is on the battlefield.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Bloodslither Pact`,
        desc: `After this endless spell is set up and at the start of each of their hero phases, the commanding player must pick 1 unit within 3" of the model that summoned this endless spell. That unit suffers D3 mortal wounds.

        Designer's Note: If there are no other units within 3", then the model that summoned this endless spell will suffer the mortal wounds.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  Scuttletide: {
    effects: [
      {
        name: `Summoning`,
        desc: `Casting value of 7 and a range of 6". Add 1 to casting rolls for this spell if the caster is a SPIDERFANG WIZARD. If successfully cast, set up this endless spell within range of a terrain feature and visible to the caster, and more than 1" from all models, other endless spells and invocations. Only GLOOMSPITE GITZ WIZARDS can attempt to summon this endless spell.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Predatory`,
        desc: `This endless spell is a predatory endless spell. It can be moved up to 6".`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Scuttling Horde`,
        desc: `After this endless spell has moved, the commanding player can pick 1 unit within 1" of this endless spell and roll 6 dice. For each 5+, that unit suffers 1 mortal wound. In addition, roll 6 dice for each unit that finishes a normal move, run, retreat or charge move within 6" of this endless spell. For each 5+, that unit suffers 1 mortal wound. SPIDERFANG units are not affected by this ability.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_GLOOMSPITE_GITZ,
          rule_sources.ERRATA_JULY_2021,
          rule_sources.ERRATA_AUGUST_2021,
        ],
      },
      {
        name: `Scuttling Horde`,
        desc: `Roll 6 dice for each unit that finishes a normal move or charge move within 6" of this endless spell. For each 5+, that unit suffers 1 mortal wound. Spiderfang units are not affected by this ability.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_GLOOMSPITE_GITZ, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
