import { TTraits } from 'types/army'
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
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Common traits shared by Damned Legions.
const LegionTraitBolstered = {
  name: `Bolstered by Hate (Ravagers, Cabalists, Despoilers)`,
  effects: [
    {
      name: `Bolstered by Hate (Ravagers, Cabalists, Despoilers)`,
      desc: `Add 2 to this general's wounds characteristic.`,
      when: [WOUND_ALLOCATION_PHASE],
    },
  ],
}

const LegionTraitPantheon = {
  name: `Favoured of the Pantheon (Ravagers, Cabalists)`,
  effects: [
    {
      name: `Favoured of the Pantheon (Ravagers, Cabalists)`,
      desc: `You can add or subtract 2 from the result of any rolls made for this general on the Eye of the Gods table.`,
      when: [END_OF_COMBAT_PHASE],
    },
  ],
}

const LegionTraitTerror = {
  name: `Lord of Terror (Cabalists, Despoilers)`,
  effects: [
    {
      name: `Lord of Terror (Cabalists, Despoilers)`,
      desc: `Subtract 1 from the bravery characteristic of enemy units within 6" of this general.`,
      when: [DURING_GAME],
    },
  ],
}

// Damned Legion comamnd traits.
const CommandTraits: TTraits = [
  // Ravagers Traits
  LegionTraitBolstered,
  LegionTraitPantheon,
  LegionTraitTerror,
  {
    name: `Unquestioned Resolve (Ravagers)`,
    effects: [
      {
        name: `Unquestioned Resolve  (Ravagers)`,
        desc: `Once per turn, you can use At the Double, Forward to Victory, or Inspiring Presence command ability without a command point if the target is a Cultists unit within 12" of this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Eternal Vendetta (Ravagers)`,
    effects: [
      {
        name: `Eternal Vendetta (Ravagers)`,
        desc: `You can reroll wound rolls for attacks made by this general. You can also reroll hit rolls if the target is an Order unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flames of Spite (Ravagers)`,
    effects: [
      {
        name: `Flames of Spite (Ravagers)`,
        desc: `If the unmodified wound roll for an attack made by this general is 6, the target suffers 1 mortal wound in addition to any normal damage.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Master of Deception (Ravagers)`,
    effects: [
      {
        name: `Master of Deception (Ravagers)`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Cabalists Traits
  {
    name: `Mighty Ritualist (Cabalists)`,
    effects: [
      {
        name: `Mighty Ritualist (Cabalists)`,
        desc: `When this general attampts to perform a Ritual of Sorcerous Might it is successful on a 2+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blasphemous Influence (Cabalists)`,
    effects: [
      {
        name: `Blasphemous Influence (Cabalists)`,
        desc: `When this general attempts to perform a Ritual of Corruption it is successful on a 2+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `All for One (Cabalists)`,
    effects: [
      {
        name: `All for One (Cabalists)`,
        desc: `Once per battle, when this general successfully performs a Binding Ritual, for each model slain in that ritual you can heal 1 wound allocated to this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Despoilers Traits
  {
    name: `Lightning Reflexes (Despoilers)`,
    effects: [
      {
        name: `Lightning Reflexes (Despoilers)`,
        desc: `Subtract 1 from hit rolls for attacks made with missle weapons targeting this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Radiance of Dark Glory (Despoilers)`,
    effects: [
      {
        name: `Radiance of Dark Glory (Despoilers)`,
        desc: `You can pick 1 friendly Despoilers unit wholly within 18" of this general and roll a D6. On a 3+, you can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Distorting Miasma (Despoilers)`,
    effects: [
      {
        name: `Distorting Miasma (Despoilers)`,
        desc: `You can give a terrain feature Pitch-black and Nightmare Chasm scenery rules if this general finishes a move within 9" of it.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Paragon of Ruin (Despoilers)`,
    effects: [
      {
        name: `Paragon of Ruin (Despoilers)`,
        desc: `Before the first battle round begins, D3 friendly Despoilers units can move up to 5".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  // Knights of the Empty Throne Traits
  {
    name: `Annihilating Charge (Knights of the Empty Throne)`,
    effects: [
      {
        name: `Annihilating Charge (Knights of the Empty Throne)`,
        desc: `You can reroll charge rolls for friendly Knights of the Empty Throne units wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Inescapeable Doom (Knights of the Empty Throne)`,
    effects: [
      {
        name: `Inescapeable Doom (Knights of the Empty Throne)`,
        desc: `Enemy units within 3" of this general cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Wall of Cursed Iron (Knights of the Empty Throne)`,
    effects: [
      {
        name: `Wall of Cursed Iron (Knights of the Empty Throne)`,
        desc: `When friendly Knights of the Empty Throne units wholly within 12" of this general use their Warpsteel Shields ability, add 1 to the roll.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default CommandTraits
