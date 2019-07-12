import { TCommandTraits } from 'types/army'
import {
  COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Chosen Guardians (Grand Host of Nagash)`,
    effects: [
      {
        name: `Chosen Guardians (Grand Host of Nagash)`,
        desc: `Add 1 to the Attacks characteristic of all melee weapons used by GRAND HOST OF NAGASH MORGHAST units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Legions Innumerable (Grand Host of Nagash)`,
    effects: [
      {
        name: `Legions Innumerable (Grand Host of Nagash)`,
        desc: `In your hero phase, you may roll a dice for each friendly GRAND HOST OF NAGASH SUMMONABLE unit on the battlefield. On a 5+ you can heal up to D3 wounds that have been allocated to it. For units with a Wounds characteristic of 1, return 1 slain model to the unit for each wound that would have been healed.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Magic (Grand Host of Nagash)`,
    effects: [
      {
        name: `Magic (Grand Host of Nagash)`,
        desc: `All WIZARDS in a GRAND HOST OF NAGASH army know an additional spell from one of the Lores of the Dead. If Nagash is included in the army, he instead knows an additional 3 spells from the Lores of the Dead.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Magic (Legion of Sacrament, Blood or Night)`,
    effects: [
      {
        name: `Magic (Legion of Sacrament, Blood or Night)`,
        desc: `All WIZARDS know an additional spell from one of the Lores of the Dead.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Magic (Soulblight)`,
    effects: [
      {
        name: `Magic (Soulblight)`,
        desc: `All WIZARDS in a SOULBLIGHT army know an additional spell from Lore of the Vampires`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Aura of Grief (Legion of Grief)`,
    effects: [
      {
        name: `Aura of Grief (Legion of Grief)`,
        desc: `Subtract 1 from the Bravery Characteristic of enemy units when they are within 6" of any LEGION OF GRIEF units`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Master's Teachings (Legion of Sacrament)`,
    effects: [
      {
        name: `The Master's Teachings (Legin of Sacrament)`,
        desc: `Whenever an enemy unit is destroyed, before removing the last model, you may pick one of your gravesites within 6" of that model. Roll a dice, then remove the model. On a 4+, you may pick a friendly SUMMONABLE unit that has been destroyed and set it up again wholly within 9" of that gravesite and more than 9" from any enemy models.
`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Black Desciples (Legion of Sacrament)`,
    effects: [
      {
        name: `The Black Desciples (Legion of Sacrament)`,
        desc: `Friendly LEGION OF SACRAMENT WIZARDS may add 1 to casting rolls.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Immortal Majesty (Legion of Blood)`,
    effects: [
      {
        name: `Immortal Majesty (Legion of Blood)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units within 6" of any friendly LEGION OF BLOOD units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Favoured Retainers (Legion of Blood)`,
    effects: [
      {
        name: `Favoured Retainers (Legion of Blood)`,
        desc: `Add 1 to the Attacks characteristic of all melee weapons used by friendly LEGION OF BLOOD VAMPIRE LORDS and LEGION OF BLOOD Blood Knights.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Bait (Legion of Night)`,
    effects: [
      {
        name: `The Bait (Legion of Night)`,
        desc: `Add 1 to save rolls for friendly LEGION OF NIGHT DEATHRATTLE units that are wholly within your territory.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ageless Cunning (Legion of Night)`,
    effects: [
      {
        name: `Ageless Cunning (Legion of Night)`,
        desc: `Instead of setting up a LEGION OF NIGHT unit on the battlefield, you can place it to one side and say that it is set up in ambush. You can do this with up to 3 units.\n\nAt the end of any of your movement phases, you can set up any of the units in ambush wholly within 6" of any battlefield edge and more than 9" away from any enemy models.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Deathless Thralls (Soulblight)`,
    effects: [
      {
        name: `Deathless Thralls (Soulblight)`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly SOULBLIGHT unit within 6" of your general or another SOULBLIGHT HERO from your army. On a 6+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Bloodlines: Dragon Warriors (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Dragon Warriors (Soulblight)`,
        desc: `You can re-roll hit rolls of 1 for models that have the Dragon Warriors bloodline if they charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Bloodlines: Lords of Night (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Lords of Night (Soulblight)`,
        desc: `Models with the Lords of Night bloodline receive the benefit of the Deathless Thralls battle trait even if they are not within 6" of the general or another friendly SOULBLIGHT HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Bloodlines: Necromantic (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Necromantic (Soulblight)`,
        desc: `Add 1 to casting and unbinding rolls for WIZARDS with the Necromantic bloodline. In addition, subtract 1 from the Bravery characteristic of enemy units that are within 6" of one or more models with the Necromantic bloodline.`,
        when: [HERO_PHASE, DURING_GAME],
      },
    ],
  },
  {
    name: `The Bloodlines: Swift Death (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Swift Death (Soulblight)`,
        desc: `Add 2" to the Move characteristic of all models that have the Swift Death bloodline. In addition, Swift Death models can always move as if they can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

export default CommandTraits
