import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import spells from './spells'
import { TItemDescriptions } from 'factions/factionTypes'
import prayers from './prayers'

const NobleBloodEffect = {
  name: `Noble Blood`,
  desc: `In your hero phase, you can heal up to D3 wounds allocated to this unit.`,
  when: [HERO_PHASE],
  shared: true,
}
const RoyalBloodEffect = {
  name: `Royal Blood`,
  desc: `In your hero phase, you can heal up to D3 wounds allocated to this unit.`,
  when: [HERO_PHASE],
  shared: true,
}
const ChosenOfTheKingEffect = {
  name: `Chosen of the King`,
  desc: `Improve the Rend characteristic of this unit's melee weapons by 1 while it is wholly within 6" of any friendly COURTIERS or 18" of any friendly ABHORRANTS.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const Units = {
  'Ushoran, Mortarch of Delusion': {
    mandatory: {
      spells: [keyPicker(spells, ['Glimpse of Delusion'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `Warmaster`,
        desc: `If this unit is included in your army, it is treated as a general even if it is not the model picked to be the army's general.`,
        when: [DURING_GAME],
      },
      {
        name: `Epicentre of Delusion`,
        desc: `If this unit is part of a Flesh-eater Courts army, in your hero phase, you can pick 1 delusion from the Courts of Delusion battle trait. Until your next hero phase, that delusion applies to friendly FLESH-EATER COURTS units while they are wholly within the Epicentre of Delusion range shown on this unit's damage table, in addition to the delusion you picked before the start of the first turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Carrion King`,
        desc: `While this unit has 6 noble deeds points, friendly FLESH-EATER COURTS units are affected by the Feeding Frenzy battle trait while they are wholly within 24" of this unit instead of 12".`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shroudcage Fragment`,
        desc: `At the start of the combat phase, subtract 1 from the Bravery characteristic of each enemy unit within 3" of this unit until the end of the battle. Then, roll 2D6 for each enemy unit within 1" of this unit. If the result is higher than the Bravery characteristic of that unit, the strike-last effect applies to that unit until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `The King's Chalice`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `The King's Chalice`,
        desc: `In your hero phase, you can heal up to 2D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Abhorrant Ghoul King': {
    mandatory: {
      spells: [keyPicker(spells, ['Unnatural Speed'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      RoyalBloodEffect,
      {
        name: `Code of Honour`,
        desc: `At the start of the combat phase, you can pick an enemy HERO within 1" of this unit and say that this unit will duel that enemy HERO. If you do so, add 1 to the Damage characteristic of this unit's melee weapons until the end of the phase, but it can only target that enemy HERO.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Abhorrant Ghoul King on Royal Terrorgheist': {
    mandatory: {
      spells: [keyPicker(spells, ['Ferocious Hunger'])],
    },
    effects: [GenericEffects.WizardOneSpellEffect, ...GenericEffects.Terrorgheist, RoyalBloodEffect],
  },
  'Abhorrant Ghoul King on Royal Zombie Dragon': {
    mandatory: {
      spells: [keyPicker(spells, ['Monstrous Hunger'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      RoyalBloodEffect,
      {
        name: `Draconic Terror`,
        desc: `Enemy units cannot receive the Inspiring Presence command while they are within 3" of any friendly units with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Grand Justice Gormayne': {
    effects: [
      RoyalBloodEffect,
      {
        name: `Pronounce Judgement`,
        desc: `In your hero phase, pick 1 of the following judgements to pronounce. The same unit cannot be affected by more than 1 judgement at the same time.

        Petty Transgression: Pick 1 enemy unit that is visible to this unit and roll a dice. On a 3+, add 1 to wound rolls for attacks made by friendly FLESH-EATER COURTS units that target that unit until the end of the turn.
        
        Dishonourable Conduct in Battle: Pick 1 enemy unit that is visible to this unit and more than 3" from all friendly units. Roll a dice. On a 3+, until the end of the turn, friendly FLESH-EATER COURTS units can charge even if they ran earlier in the turn, as long as they finish the charge move within 1/2" of the enemy unit you picked.
        
        Grievous Insult to the Court: Pick 1 enemy unit that is visible to this unit and within 3" of a friendly ABHORRANT. Roll a dice. On a 3+, add 1 to hit rolls for attacks made by friendly FLESH-EATER COURTS units that target that enemy unit until the end of the turn.
        
        Regicide: Pick 1 enemy unit that is visible to this unit and has slain a friendly ABHORRANT. Roll a dice. On a 3+, until the end of the turn, add 1 to the Damage characteristic of weapons used by friendly FLESH-EATER COURTS units for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Crypt Ghast Courtier': {
    effects: [
      {
        name: `Marshal of the Peasantry`,
        desc: `In the combat phase, after this unit has fought for the first time in that phase, you can pick 1 friendly SERFS unit that has not yet fought in that phase, is within 3" of an enemy unit and is wholly within 9" of this unit. That unit can fight immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crypt Haunter Courtier': {
    effects: [
      NobleBloodEffect,
      {
        name: `Knightly Retinue`,
        desc: `In the combat phase, after this unit has fought for the first time in that phase, you can pick 1 friendly CRYPT HORRORS unit that has not yet fought in that phase, is within 3" of an enemy unit and is wholly within 9" of this unit. That unit can fight immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crypt Infernal Courtier': {
    effects: [
      {
        name: `Mind-shattering Cacophony`,
        desc: `If any enemy models are slain by wounds caused by this unit's Foetid Breath, until the end of the phase, add 1 to the Damage characteristic of missile weapons used by friendly CRYPT FLAYERS units while they are wholly within 9" of this unit. The same CRYPT FLAYERS unit cannot benefit from this ability more than once per phase.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Varghulf Courtier': {
    effects: [
      {
        name: `Bounding Strides`,
        desc: `When this unit makes a move, it can pass across terrain features in the same manner as a model that can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `King's Champion`,
        desc: `At the start of the combat phase, you can say that this unit will use this ability. If you do so, in that phase, you can add 2 to the Attacks characteristic of this unit's melee weapons, but it can only target units that have a Wounds characteristic of 1 or 2 and do not have a mount.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Victory Feast`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds caused by this unit's attacks in that phase, you can heal up to D6 wounds allocated to this unit. In addition, at the end of the combat phase, this unit can immediately retreat.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Abhorrant Archregent': {
    mandatory: {
      spells: [keyPicker(spells, ['Carrion Call'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      RoyalBloodEffect,
      {
        name: `Countless Servants`,
        desc: `At the start of your hero phase, you can return up to 3 slain models to 1 friendly SERFS unit that is within 18" of this unit, or you can return 1 slain model to 1 friendly KNIGHTS unit that is within 18" of this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Abhorrant Cardinal': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Speak in Tongues'])],
    },
    effects: [RoyalBloodEffect],
  },
  'Abhorrant Gorewarden': {
    mandatory: {
      spells: [keyPicker(spells, ['Winds of Shyish'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      RoyalBloodEffect,
      {
        name: `Royal Hunting Party`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is circling in the skies as a reserve unit. If you do so, when you would set up a friendly CRYPT FLAYERS or MORBHEG KNIGHTS unit during deployment, that unit can join this unit circling in the skies as a reserve unit. A maximum of 1 unit can join this unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Royal Hunting Party`,
        desc: `If you set this unit up in reserve, at the end of your movement phase, you can set up this unit more than 9" from all enemy units. If you do so, set up the unit that joined this unit wholly within 9" of this unit and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Crypt Ghouls': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Crypt Ghast. Add 1 to the Attacks characteristic of that model's Sharpened Teeth and Filthy Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Boundless Ferocity`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack automatically wounds the target (do not make a wound roll). If this unit has 20 or more models, unmodified hit rolls of 5 or 6 automatically wound the target.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Royal Approval`,
        desc: `Improve the Rend characteristic of this unit's melee weapons by 1 while it is wholly within 9" of any friendly COURTIERS or 18" of any friendly ABHORRANTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crypt Horrors': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Crypt Haunter. Add 1 to the Attacks characteristic of that model's Club and Septic Talons.`,
        when: [COMBAT_PHASE],
      },
      NobleBloodEffect,
      ChosenOfTheKingEffect,
      {
        name: `Warrior Elite`,
        desc: `If the unmodified wound roll for an attack made with a Club and Septic Talons is 6, that weapon has a Damage characteristic of 3 instead of 2 for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crypt Flayers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Crypt Infernal. Add 1 to the Attacks characteristic of that model's Piercing Talons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Death Scream`,
        desc: `Add 1 to wound rolls for attacks made with a Death Scream if the target unit has a Bravery characteristic of 6 or less.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Escort Courtier`,
        desc: `When you pick this unit to move in the movement phase, you can pick 1 friendly FLESH-EATER COURTS HERO that has a Wounds characteristic of 7 or less, that cannot fly, and that is wholly within 3" of this unit. If you do so, remove that HERO from the battlefield. After this unit has finished moving, set up that HERO wholly within 3" of this unit and more than 3" from all enemy units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Duke Crakmarrow': {
  //   effects: [
  //     {
  //       name: `Muster the Grymwatch`,
  //       desc: `Pick 1 friendly Grymwatch unit within 3" of this model and roll 6 dice. For each 2+ you can return 1 slain model to that unit.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Gallant Champion`,
  //       desc: `Add 1 to the damage inflicted by each successful attack made by this model that targets a monster.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'The Grymwatch': {
  //   effects: [
  //     {
  //       name: `Royal Retinue`,
  //       desc: `Roll a D6 before you allocate a wound or mortal wound to a friendly Duke Crakmarrow while he is within 3" of this unit. On a 4+, that wound is allocate to this unit instead.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //     {
  //       name: `Quest to Slay the Monster`,
  //       desc: `Add 1 to the damage inflicted by each successful attack made by this unit that targets a monster.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Royal Terrorgheist': {
    effects: [...GenericEffects.Terrorgheist],
  },
  'Royal Zombie Dragon': {
    effects: [...GenericEffects.ZombieDragon],
  },
  'Marrowscroll Herald': {
    effects: [
      {
        name: `The King's Entreaty`,
        desc: `At the end of the charge phase, you can pick 1 enemy unit within 3" of this unit and say that this unit will offer it an infected bone. If you do so, your opponent must choose whether that enemy unit accepts or refuses the bone.

        If it refuses, the strike-first effect applies to friendly FLESH-EATER COURTS units within 3" of this unit until the end of the following combat phase.
        
        If it accepts, that enemy unit becomes infected. For the rest of the battle, roll 2D6 before an infected unit issues or receives a command, attempts to cast a spell, or chants a prayer. Make the roll before the action is carried out. If the roll is greater than that unit's Bravery characteristic, that unit cannot perform that action in that phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Don't Shoot the Messenger`,
        desc: `This unit is not visible to enemy models while it is wholly within 6" of 5 or more other friendly FLESH-EATER COURTS models.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Royal Decapitator': {
    effects: [
      {
        name: `Executioner's Entourage`,
        desc: `In the combat phase, after this unit has fought for the first time in that phase, you can pick 1 friendly SERFS unit that has not yet fought in that phase, is within 3" of an enemy unit and is wholly within 9" of this unit. That unit can fight immediately.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Off with their Head!`,
        desc: `At the end of the combat phase, if any wounds caused by this unit's Headsman's Axe in that phase were allocated to an enemy HERO and that enemy HERO has not been slain, roll a dice. On a 5+, that enemy HERO is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  Cryptguard: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Crypt Captain. Add 1 to the Attacks characteristic of that model's melee weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Standard Bearer. While this unit includes a Standard Bearer, if this unit fails a battleshock test, halve the number of models that flee (rounding down).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Drummer. Add 1 to run rolls and charge rolls for this unit while it includes any Drummers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Armoury of Madness`,
        desc: `If any wounds caused by this unit's attacks are allocated to an enemy unit, that enemy unit cannot issue or receive commands until the end of the turn.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Royal Bodyguard`,
        desc: `This unit has a ward of 5+. In addition, add 1 to ward rolls for friendly FLESH-EATER COURTS HEROES wholly within 3" of any units with this ability.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Morbheg Knights': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Champion of Morbheg. Add 1 to the Attacks characteristic of that model's Grisly Lance.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 3 models in this unit can be a Standard Bearer. While this unit includes any Standard Bearers, if it made a charge move in the same turn, each model in this unit counts as 3 models for the purposes of contesting objectives.`,
        when: [END_OF_TURN],
      },
      {
        name: `Musician`,
        desc: `1 in every 3 models in this unit can be a Hornblower. Add 1 to run rolls and charge rolls for this unit while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Shrieking Charge`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit. That enemy unit cannot receive the Unleash Hell command in this phase. In addition, roll 1 dice for each model in this unit that is within 1" of that enemy unit. For each 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Predator's Pounce`,
        desc: `This unit can retreat and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Royal Beastflayers': {
    effects: [
      {
        name: `Royal Flaymaster`,
        desc: `1 in every 10 models in this unit must be a Royal Flaymaster. That model has a Wounds characteristic of 3 and is armed with a Hunting Polearm instead of Sharpened Teeth and Filthy Claws. Royal Flaymasters can issue commands to their own unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Hunter's Instincts`,
        desc: `Enemy MONSTERS within 3" of this unit cannot carry out monstrous rampages.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Hunter's Instincts`,
        desc: `Reduce the Damage characteristic of weapons used by enemy MONSTERS by 1 while they are within 3" of any friendly units with this ability, to a minimum of 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Offal Hounds`,
        desc: `While this unit includes any Offal Hounds, add 2" to the Move characteristic of this unit if it is within 18" of any enemy MONSTERS that have any wounds allocated to them.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Units, 'unit')
