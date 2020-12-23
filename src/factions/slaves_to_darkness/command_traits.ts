import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  // Shared Command Traits
  // Ravagers, Cabalists, and Despoilers.
  'Bolstered by Hate': {
    effects: [
      {
        name: `Bolstered by Hate`,
        desc: `Add 2 to this general's wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Ravagers and Cabalists.
  'Favoured of the Pantheon': {
    effects: [
      {
        name: `Favoured of the Pantheon (Ravagers, Cabalists)`,
        desc: `You can add or subtract 2 from the result of any rolls made for this general on the Eye of the Gods table.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // Cabalists and Despoilers.
  'Lord of Terror': {
    effects: [
      {
        name: `Lord of Terror (Cabalists, Despoilers)`,
        desc: `Subtract 1 from the bravery characteristic of enemy units within 6" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },

  // Ravagers Only
  'Unquestioned Resolve': {
    effects: [
      {
        name: `Unquestioned Resolve`,
        desc: `Once per turn, you can use At the Double, Forward to Victory, or Inspiring Presence command ability without a command point if the target is a Cultists unit within 12" of this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Eternal Vendetta': {
    effects: [
      {
        name: `Eternal Vendetta`,
        desc: `You can reroll wound rolls for attacks made by this general. You can also reroll hit rolls if the target is an Order unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Flames of Spite': {
    effects: [
      {
        name: `Flames of Spite`,
        desc: `If the unmodified wound roll for an attack made by this general is 6, the target suffers 1 mortal wound in addition to any normal damage.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Master of Deception': {
    effects: [
      {
        name: `Master of Deception`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Cabalists Traits
  'Mighty Ritualist': {
    effects: [
      {
        name: `Mighty Ritualist`,
        desc: `When this general attampts to perform a Ritual of Sorcerous Might it is successful on a 2+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blasphemous Influence': {
    effects: [
      {
        name: `Blasphemous Influence`,
        desc: `When this general attempts to perform a Ritual of Corruption it is successful on a 2+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'All for One': {
    effects: [
      {
        name: `All for One`,
        desc: `Once per battle, when this general successfully performs a Binding Ritual, for each model slain in that ritual you can heal 1 wound allocated to this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Despoilers Traits
  'Lightning Reflexes': {
    effects: [
      {
        name: `Lightning Reflexes`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons targeting this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Radiance of Dark Glory': {
    effects: [
      {
        name: `Radiance of Dark Glory`,
        desc: `You can pick 1 friendly Despoilers unit wholly within 18" of this general and roll a D6. On a 3+, you can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Distorting Miasma': {
    effects: [
      {
        name: `Distorting Miasma`,
        desc: `You can give a terrain feature Pitch-black and Nightmare Chasm scenery rules if this general finishes a move within 9" of it.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Paragon of Ruin': {
    effects: [
      {
        name: `Paragon of Ruin`,
        desc: `Before the first battle round begins, D3 friendly Despoilers units can move up to 5".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  // Knights of the Empty Throne
  'Annihilating Charge': {
    effects: [
      {
        name: `Annihilating Charge`,
        desc: `You can reroll charge rolls for friendly Knights of the Empty Throne units wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Inescapeable Doom': {
    effects: [
      {
        name: `Inescapeable Doom`,
        desc: `Enemy units within 3" of this general cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Wall of Cursed Iron': {
    effects: [
      {
        name: `Wall of Cursed Iron`,
        desc: `When friendly Knights of the Empty Throne units wholly within 12" of this general use their Warpsteel Shields ability, add 1 to the roll.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Idolators
  'Fiery Orator': {
    effects: [
      {
        name: `Fiery Orator`,
        desc: `This general can chant 2 prayers instead of 1. The same prayer may be chanted more than once.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bane of the False Idols': {
    effects: [
      {
        name: `Bane of the False Idols`,
        desc: `Once per hero phase, this general can use Desecrate without spending a command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Smite the Unbeliever': {
    effects: [
      {
        name: `Smite the Unbeliever`,
        desc: `Add 2 to the attacks characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Idolators, Gresh's Iron Reapers Battalion
  'Profane Oratory': {
    effects: [
      {
        name: `Profane Oratory`,
        desc: `You can pick 1 friendly Slaves to Darkness unit wholly within 18" of this general and add 1 to their hit rolls until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
