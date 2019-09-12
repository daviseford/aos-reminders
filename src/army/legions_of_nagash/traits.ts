import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Master of Death (Grand Host of Nagash)`,
    effects: [
      {
        name: `Master of Death (Grand Host of Nagash)`,
        desc: `Re-roll results of 1 (i.e. rolls of 1-2 on a D3) for friendly units affected by a Deathly Invocation ability that are within 12" of this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Chosen Champion (Grand Host of Nagash)`,
    effects: [
      {
        name: `Chosen Champion (Grand Host of Nagash)`,
        desc: `Add 1 to the Damage characteristic of melee weapons used by this general for attacks made against enemy HEROES.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bane of the Living (Grand Host of Nagash)`,
    effects: [
      {
        name: `Bane of the Living (Grand Host of Nagash)`,
        desc: `Re-roll wound rolls of 1 for this general for attacks made against enemy units that do not have the DEATH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aura of Ages (Grand Host of Nagash)`,
    effects: [
      {
        name: `Aura of Ages (Grand Host of Nagash)`,
        desc: `At the start of the combat phase, roll a D6 for each enemy unit within 3" of this general. On a 4+ subtract 1 from hit rolls made for that unit until the end of the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ancient Strategist (Grand Host of Nagash)`,
    effects: [
      {
        name: `Ancient Strategist (Grand Host of Nagash)`,
        desc: `Re-roll failed charge rolls for friendly DEATHRATTLE and MORGHAST units that are within 9" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Lord of Nagashizzar (Grand Host of Nagash)`,
    effects: [
      {
        name: `Lord of Nagashizzar (Grand Host of Nagash)`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by friendly DEATHRATTLE units that are within 6" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Emissary of the Master (Legion of Sacrament)`,
    effects: [
      {
        name: `Emissary of the Master (Legion of Sacrament)`,
        desc: `You can re-roll failed charge rolls for friendly DEATH units that are within 6" of this general at the start of the charge phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Favoured (Legion of Sacrament)`,
    effects: [
      {
        name: `Mark of the Favoured (Legion of Sacrament)`,
        desc: `Each time this general is selected as the target of an attack in the combat phase, roll a D6. On a 6+ the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dark Acolyte (Legion of Sacrament)`,
    effects: [
      {
        name: `Dark Acolyte (Legion of Sacrament)`,
        desc: `This general is a WIZARD that knows the Arcane Bolt and Mystic Shield spells, as well as a single spell from one of the Lores of the Dead. If this general is already a WIZARD, they may generate an additional spell from one of the Lores of the Dead.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
    ],
  },
  {
    name: `Mastery of Death (Legion of Sacrament)`,
    effects: [
      {
        name: `Mastery of Death (Legion of Sacrament)`,
        desc: `At the start of your hero phase, all friendly DEATH units within 6" of this general may immediately make a move of up to 3" as if it were your movement phase. They may not run as part of this move.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Peerless Commander (Legion of Sacrament)`,
    effects: [
      {
        name: `Peerless Commander (Legion of Sacrament)`,
        desc: `This general may summon a unit from a gravesite whilst they are within 12" rather than 9".`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Bound to the Master (Legion of Sacrament)`,
    effects: [
      {
        name: `Bound to the Master (Legion of Sacrament)`,
        desc: `This general may use Arkhan the Black's First of the Mortarchs command ability.\n\n (Until the end of the hero phase all friendly DEATH WIZARDS within 18" of this general can increase the range of their spells by 6".)`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Swift Strike (Legion of Blood)`,
    effects: [
      {
        name: `Swift Strike (Legion of Blood)`,
        desc: `Each time you make a hit roll of 6+ in the combat phase for this general, you can make one additional hit roll for the same weapon against the same target.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Soul-crushing Contempt (Legion of Blood)`,
    effects: [
      {
        name: `Soul-crushing Contempt (Legion of Blood)`,
        desc: `If this general slays any models in the combat phase, subtract 1 from the Bravery characteristic of the slain model's unit until the end of the turn.`,
        when: [COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Aristocracy of Blood (Legion of Blood)`,
    effects: [
      {
        name: `Aristocracy of Blood (Legion of Blood)`,
        desc: `You can re-roll failed charge rolls for friendly SOULBLIGHT units that are within 9" of this general at the start of the charge phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Aura of Dark Majesty (Legion of Blood)`,
    effects: [
      {
        name: `Aura of Dark Majesty (Legion of Blood)`,
        desc: `Subtract 1 from the hit rolls of attacks that target this general in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Walking Death (Legion of Blood)`,
    effects: [
      {
        name: `Walking Death (Legion of Blood)`,
        desc: `If the hit roll for an attack made with one of this general's melee weapons is 6+, do not roll to wound. Instead, the target suffers a number of mortal wounds equal to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sanguine Blur (Legion of Blood)`,
    effects: [
      {
        name: `Sanguine Blur (Legion of Blood)`,
        desc: `Add 2" to this general's Move characteristic. In addition, you can re-roll failed charge rolls for this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Above Suspicion (Legion of Night)`,
    effects: [
      {
        name: `Above Suspicion (Legion of Night)`,
        desc: `This general may be set up in ambush in addition to the 3 units normally allowed by the Ageless Cunning battle trait.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Swift Form (Legion of Night)`,
    effects: [
      {
        name: `Swift Form (Legion of Night)`,
        desc: `Add 2" to this general's Move characteristic. In addition, add 2" to the distance they can move when they run.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Unbending Will (Legion of Night)`,
    effects: [
      {
        name: `Unbending Will (Legion of Night)`,
        desc: `Friendly LEGION OF NIGHT units within 12" of this general may re-roll failed battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Merciless Hunter (Legion of Night)`,
    effects: [
      {
        name: `Merciless Hunter (Legion of Night)`,
        desc: `Re-roll wound rolls of 1 for this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Unholy Impetus (Legion of Night)`,
    effects: [
      {
        name: `Unholy Impetus (Legion of Night)`,
        desc: `If this general slays any models in the combat phase, pick a friendly LEGION OF NIGHT unit within 3" of the general. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Terrifying Visage (Legion of Night)`,
    effects: [
      {
        name: `Terrifying Visage (Legion of Night)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Curse of the Revenant (Soulblight)`,
    effects: [
      {
        name: `Curse of the Revenant (Soulblight)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Deathless Duelist (Soulblight)`,
    effects: [
      {
        name: `Deathless Duelist (Soulblight)`,
        desc: `Re-roll hits rolls of 1 for this general when they attack an enemy HERO in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Transfix (Soulblight)`,
    effects: [
      {
        name: `Transfix (Soulblight)`,
        desc: `At the start of the combat phase, pick one enemy HERO within 3" of this general. Until the end of the phase, subtract 1 from hit rolls for the model you picked when it targets the general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mist Form (Soulblight)`,
    effects: [
      {
        name: `Mist Form (Soulblight)`,
        desc: `If this general retreats, they can move as if they can fly and they can still charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Killing Blow (Soulblight)`,
    effects: [
      {
        name: `Killing Blow (Soulblight)`,
        desc: `Wound rolls of 6+ for attacks made by this general in the combat phase inflict a mortal wound in addition to any other damage they inflict.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blood Fury (Soulblight)`,
    effects: [
      {
        name: `Blood Fury (Soulblight)`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
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
        desc: `In your hero phase, you may roll a D6 for each friendly GRAND HOST OF NAGASH SUMMONABLE unit on the battlefield. On a 5+ you can heal up to D3 wounds that have been allocated to it. For units with a Wounds characteristic of 1, return 1 slain model to the unit for each wound that would have been healed.`,
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
        desc: `All WIZARDS in a SOULBLIGHT army know an additional spell from Lore of the Vampires.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Aura of Grief (Legion of Grief)`,
    effects: [
      {
        name: `Aura of Grief (Legion of Grief)`,
        desc: `Subtract 1 from the Bravery Characteristic of enemy units when they are within 6" of any LEGION OF GRIEF units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Master's Teachings (Legion of Sacrament)`,
    effects: [
      {
        name: `The Master's Teachings (Legin of Sacrament)`,
        desc: `Whenever an enemy unit is destroyed, before removing the last model, you may pick one of your gravesites within 6" of that model. Roll a D6, then remove the model. On a 4+, you may pick a friendly SUMMONABLE unit that has been destroyed and set it up again wholly within 9" of that gravesite and more than 9" from any enemy models.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Black Disciples (Legion of Sacrament)`,
    effects: [
      {
        name: `The Black Disciples (Legion of Sacrament)`,
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
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly SOULBLIGHT unit within 6" of your general or another SOULBLIGHT HERO from your army. On a 6+ the wound is negated.`,
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
