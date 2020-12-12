import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, HERO_PHASE, MOVEMENT_PHASE, START_OF_ROUND } from 'types/phases'

// Endless spells.
const EndlessSpells = {
  'Malevolent Moon': {
    effects: [
      {
        name: `Summon Malevolent Moon`,
        desc: `Casting value of 6. Only GLOOMSPITE GITZ WIZARDS can attempt to cast this spell. Set up a Malevolent Moon model wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `A Malevolent Moon is a predatory endless spell. A Malevolent Moon can move up to 12" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Swirling Doom`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Malevolent Intentions`,
        desc: `After this model moves, roll a D6 for each unit that has any models that this model passed across. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Moon of Ill Omen`,
        desc: `Subtract 1 from casting rolls made for casters within 9" of this model. Subtract 2 from casting rolls instead for casters within 3" of this model. If the caster is a GLOOMSPITE GITZ WIZARD, then it is not affected by this ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Mork's Mighty Mushroom": {
    effects: [
      {
        name: `Summon Mork's Mighty Mushroom`,
        desc: `Casting value of 6. Only GLOOMSPITE GITZ WIZARDS can attempt to cast this spell. Set up a Mork's Mighty Mushroom model wholly within 6D6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mutating Spores`,
        desc: `After this model is set up, and at the start of each battle round after it is set up, each unit within 8" of this model is enveloped by mutating spores. For each unit enveloped by mutating spores, roll a number of dice equal to the number of models from that unit that are within 8" of this model. For each 5+ that unit suffers 1 mortal wound.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  Scuttletide: {
    effects: [
      {
        name: `Summon Scuttletide`,
        desc: `Casting value of 7. Only GLOOMSPITE GITZ WIZARDS can attempt to cast this spell. Add 1 to casting rolls for this spell if the caster is a SPIDERFANG WIZARD . Set up a Scuttletide model wholly within 6" of a terrain feature.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `A Scuttletide is a predatory endless spell. A Scuttletide can move up to 6".`,
        when: [START_OF_ROUND],
      },
      {
        name: `Scuttling Horde`,
        desc: `After setting up or moving this model, you can pick 1 unit within 1" of this model and roll 6 dice. For each roll of 5+ that unit suffers 1 mortal wound. In addition, roll 6 dice for each unit that finishes a normal move or a charge move within 6" of this model. For each roll of 5+ that unit suffers 1 mortal wound.`,
        when: [START_OF_ROUND, CHARGE_PHASE, MOVEMENT_PHASE],
      },
      {
        name: `Spider-kin`,
        desc: `SPIDERFANG units are not affected by the Scuttling Horde ability. In addition, SPIDERFANG models can move across this model in the same manner as a model that can fly.`,
        when: [START_OF_ROUND, CHARGE_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
