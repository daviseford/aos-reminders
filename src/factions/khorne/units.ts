import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Prayers from './prayers'

const MurderousChargeEffect = {
  name: `Murderous Charge`,
  desc: `After a model in this unit makes a charge move, you can pick 1 enemy unit within 1" of that model and roll a D6. On a 2+ that enemy unit suffers 1 mortal wound. If this unit has more than 1 model, roll to determine if mortal wounds are inflicted after each model completes its charge move, but do not allocate the mortal wounds until after all of the models in the unit have moved. If this unit has 6 or more models when it makes a charge move, change the mortal wounds inflicted by this ability from 1 to D3.`,
  when: [CHARGE_PHASE],
}

const Units = {
  // Daemons
  Skarbrand: {
    effects: [
      {
        name: `Roar of Total Rage`,
        desc: `Do not use the attack sequence for an attack made with the Roar of Total Rage. Instead, pick 1 enemy unit that is in range of the attack and roll the number of dice shown on the damage table above. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skarbrand's Rage`,
        desc: `From the second battle round, if this model is on the battlefield and did not attack in at least one of the combat phases of the previous battle round, when you look up a value on this model's damage table the model is treated as having suffered 13 wounds.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Total Carnage`,
        desc: `Do not use the attack sequence for an attack made with Carnage. Instead, roll a D6. The target unit suffers 8 mortal wounds if the roll is equal to or greater than the Carnage value shown on the damage table above. If the roll is 6, the target unit suffers 16 mortal wounds instead.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Inescapable Wrath`,
        desc: `You can reroll charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bloodthirster of Unfettered Fury': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Rejoice in the Slaughter'])],
    },
    effects: [
      {
        name: `Drawn in for the Kill`,
        desc: `At the start of the enemy movement phase, pick 1 enemy unit within 3" of this model. That unit cannot retreat in that phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `The Land Rebels`,
        desc: `At the start of your hero phase, roll 1 dice for each enemy unit wholly within 8" of any units with this ability. On a 5+ that unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Bloodthirster of Insensate Rage': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Bloodthirsty Charge'])],
    },
    effects: [
      {
        name: `Rage Unbound`,
        desc: `You can reroll hit rolls of 1 for attacks made by this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Outrageous Carnage`,
        desc: `If the unmodified wound roll for an attack made by this model is 6, each enemy unit within 8" of this model suffers the number of mortal wounds shown on the damage table above, in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Wrath of Khorne Bloodthirster': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Lord of the Blood Hunt'])],
    },
    effects: [
      {
        name: `Hellfire Breath`,
        desc: `Do not use the attack sequence for an attack made with Hellfire Breath. Instead, pick an enemy unit that is in range of the attack and roll a D6. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Relentless Hunters`,
        desc: `You can reroll hit rolls for attacks made by this model that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Rune-crown of Khorne`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase as if it were a WIZARD. In addition, add 2 to unbinding rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune-crown of Khorne`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Skulltaker: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Heads Must Roll'])],
    },
    effects: [
      {
        name: `Cloak of Skulls`,
        desc: `You can reroll save rolls for attacks that target this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Decapitating Strike`,
        desc: `If the unmodified hit roll for an attack made with the Slayer Sword is 6, that attack inflicts 3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Heroes' Bane`,
        desc: `You can reroll hit and wound rolls for attacks made by this model that target a HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Karanak: {
    effects: [
      {
        name: `Unflagging Hunter`,
        desc: `You can reroll charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Brass Collar of Bloody Vengeance`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD. If this model successfully unbinds a spell, the caster suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Brass Collar of Bloody Vengeance`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD. If this model successfully dispels an endless spell, the caster suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Prey of the Blood God`,
        desc: `After armies are set up, but before the first battle round begins, pick 1 enemy HERO to be this model's quarry. You can reroll hit and wound rolls for attacks made by this model that target that HERO.`,
        when: [END_OF_SETUP, COMBAT_PHASE],
      },
      {
        name: `Call of the Hunt`,
        desc: `Once per game, during the hero phase, you can summon 1 unit of 5 Flesh Hounds to the battlefield and add it to your army if this model is within 8" of its quarry (see Prey of the Blood God, left). The summoned unit must be set up wholly within 8" of this model and more than 9" from any enemy units. The summoned unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Flesh Hounds': {
    effects: [
      {
        name: `Collars of Khorne`,
        desc: `This unit can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD. Add 1 to unbinding rolls for this unit while it contains 10 or more models.`,
        when: [HERO_PHASE],
      },
      {
        name: `Collars of Khorne`,
        desc: `This unit can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD. Add 1 to dispelling rolls for this unit while it contains 10 or more models.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Unflagging Hunters`,
        desc: `You can reroll charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Skullmaster, Herald of Khorne': {
    effects: [
      {
        name: `Slaughter and Ruin`,
        desc: `You can reroll hit rolls for attacks made by this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Blade of Blood is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Slaughterous Charge`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of it and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bloodmaster, Herald of Khorne': {
    effects: [
      {
        name: `The Blood Must Flow`,
        desc: `In the combat phase, after this unit has fought in that combat phase for the first time, you can pick 1 friendly BLOODLETTER unit that is wholly within 12" of this model and is within 3" of an enemy unit, and which has not yet fought in that combat phase. The unit you pick must fight immediately, instead of being picked to fight later in that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Blade of Blood is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bloodletters: {
    effects: [
      {
        name: `Hornblower`,
        desc: `While this unit includes any Hornblowers, if the unmodified roll for a battleshock test for an enemy unit that is within 8" of this unit is 1, that battleshock test must be rerolled.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Hellblade is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gore-drenched Icon`,
        desc: `If an unmodified battleshock roll of 1 is made for this unit while it includes any Gore-drenched Icon Bearers, you can add D6 models to this unit, and no models from this unit will flee in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bloodsoaked Banner`,
        desc: `You can reroll charge rolls for this unit while it includes any Bloodsoaked Banner Bearers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Murderous Tide`,
        desc: `You can add 1 to hit rolls for attacks made by this unit while this unit has at least 20 models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bloodcrushers: {
    effects: [
      {
        name: `Icon Bearer`,
        desc: `If an unmodified battleshock roll of 1 is made for this unit while it includes any Icon Bearers, you can add 1 model to this unit, and no models from this unit will flee in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `While this unit includes any Hornblowers, if the unmodified roll for a battleshock test for an enemy unit that is within 8" of this unit is 1, that battleshock test must be rerolled.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Hellblade is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      MurderousChargeEffect,
    ],
  },
  'Herald of Khorne on Blood Throne': {
    effects: [
      {
        name: `The Blood Throne`,
        desc: `When this model uses the At the Double, Forward to Victory or Inspiring Presence command ability, the ability has a range of 12" even if this model is not a general.`,
        when: [DURING_GAME],
      },
      {
        name: `Gorefeast`,
        desc: `If any wounds are inflicted by this model's Gnashing Maw and not negated, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with a Blade of Blood or Hellblades is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skull Cannons': {
    effects: [
      {
        name: `Burning Skulls`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Burning Skulls if the target unit contains 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Grind their Bones, Seize their Skulls`,
        desc: `After this unit attacks for the first time in each combat phase, if any enemy models were slain by this unit's attacks, this unit can attack with all of the missile weapons it is armed with.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the unmodified hit roll for an attack made with Hellblades is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Exalted Greater Daemon of Khorne': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Rejoice in Exalted Slaughter'])],
    },
    effects: [
      {
        name: `Drawn in for the Kill`,
        desc: `At the start of the enemy movement phase, pick 1 enemy unit within 3" of this model. That unit cannot retreat in that phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `The Land Rebels`,
        desc: `At the start of your hero phase, roll a D6 for each enemy unit within 8" of any friendly models with this ability. On a 5+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Mazarall the Butcher': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["The Butcher's Due"])],
    },
    effects: [
      {
        name: `Bloody Charge`,
        desc: `Roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Harrow Meat's Hunger`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, add 1 to the Attacks characteristic of Harrow Meat for the rest of the battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `The Ancyte Shield`,
        desc: `This model can attempt to unbind 1 spell in the enemy hero phase in the same manner as a Wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Mortals
  'Korghos Khul': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Lord of the Goretide'])],
    },
    effects: [
      {
        name: `Favoured of Khorne`,
        desc: `You can reroll hit rolls for attacks made by this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aqshy's Bane`,
        desc: `This model is eligible to fight in the combat phase if it is within 8" of an enemy unit instead of 3", and can move an extra 5" when it piles in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Collar of Khorne`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Collar of Khorne`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Reality-splitting Axe`,
        desc: `At the end of any phase, if any wounds inflicted by this model's Axe of Khorne in that phase were allocated to an enemy model and not negated, and that enemy model has not been slain, roll a D6. On a 5+ that enemy model is slain.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Skarr Bloodwrath': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Murderous Paragon'])],
    },
    effects: [
      {
        name: `The Slaughterborn`,
        desc: `At the end of the movement phase, if this model has been slain, roll 2D6. On an 8+ you can set up this model anywhere on the battlefield more than 9" from any enemy units, with all wounds allocated to it removed.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Slaughterstorm`,
        desc: `The Attacks characteristic of this model's Bloodstorm Blades is either 5, or equal to the number of enemy models within 3" of this model when the number of attacks made with the weapon is determined (whichever is higher).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Valkia the Bloody': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['On Bloodstained Wings'])],
    },
    effects: [
      {
        name: `The Gaze of Khorne`,
        desc: `You can reroll battleshock tests for friendly KHORNE MORTAL units wholly within 16" of this model. However, if you do so and that unit still fails the battleshock test after the reroll has been made, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Spear Slaupnir`,
        desc: `Slaupnir has a Damage characteristic of D3 instead of 1 if this model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Daemonshield`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons that target this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Mighty Lord of Khorne': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Gorelord'])],
    },
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Collar of Khorne`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Reality-splitting Axe`,
        desc: `At the end of any phase, if any wounds inflicted by the Axe of Khorne in that phase were allocated to an enemy model and not negated, and that enemy model has not been slain, roll a D6. On a 5+ that enemy model is slain.`,
        when: [DURING_GAME],
      },
    ],
  },
  Bloodsecrator: {
    effects: [
      {
        name: `Loathsome Sorcery`,
        desc: `Reroll successful casting rolls for WIZARDS within 16" of this model, before any unbinding rolls are made.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rage of Khorne`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by friendly KHORNE units while they are wholly within 16" of any models with this ability.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord of Khorne on Juggernaut': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Blood Stampede'])],
    },
    effects: [
      {
        name: `Brass-clad Shield`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model that was inflicted by a spell. On a 5+ that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Slaughterous Charge`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of it and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Daemonic Axe`,
        desc: `If the unmodified wound roll for an attack made by this model's Wrathforged Axe is 6, the Damage characteristic for that attack is 3 instead of D3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Slaughterpriest: {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Blood Boil', 'Blood Bind'])],
    },
    effects: [
      {
        name: `Scorn of Sorcery`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scorn of Sorcery`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Bloodfuelled Prayers`,
        desc: `In your hero phase, this model can chant one of the prayers on this unit's warscroll. If it does so, pick one of the prayers and then make a prayer roll by rolling a dice. On a 1, this model suffers D3 mortal wounds and the prayer is not answered. On a 2-3, the prayer is not answered. On a 4+ the prayer is answered.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Skullgrinder: {
    effects: [
      {
        name: `Favoured by Khorne`,
        desc: `Add 1 to the Bravery characteristic of friendly KHORNE MORTAL units wholly within 12" of any friendly models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Fiery Anvil`,
        desc: `At the end of the combat phase, you can pick 1 enemy HERO or MONSTER within 2" of this model and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Aspiring Deathbringer': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Slaughter Incarnate'])],
    },
    effects: [
      {
        name: `Bane of Cowards`,
        desc: `If an enemy unit fails a battleshock test within 3" of this model, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Exalted Deathbringer': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Brutal Command'])],
    },
    effects: [
      {
        name: `Blooded Lieutenant`,
        desc: `If this model is not your general, add 2 to the Attacks characteristic of this model's melee weapons while it is wholly within 12" of a friendly KHORNE general.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Runemarked Shield`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a model armed with a Runemarked Shield that was inflicted by a spell. On a 2+ that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Skullgouger`,
        desc: `In the combat phase, if the unmodified save roll for an attack that targets a model armed with a Skullgouger is 6, the attacking unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Brutal Impalement`,
        desc: `If the unmodified wound roll for an attack made with an Impaling Spear is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bloodstoker: {
    effects: [
      {
        name: `Whipped to Fury`,
        desc: `At the start of your movement phase, you can pick 1 other friendly KHORNE MORTAL unit wholly within 8" of this model. Until your next movement phase, you can add 3" to run and charge rolls made for that unit.`,
        when: [START_OF_MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Whipped to Fury`,
        desc: `Until your next movement phase you can reroll wound rolls for attacks made by a unit that has been "Whipped to Fury". A unit cannot be picked to benefit from this ability more than once per turn.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Blood Warriors': {
    effects: [
      {
        name: `Icon Bearer`,
        desc: `Add 1 to the Bravery characteristic of this unit while it includes any Icon Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `No Respite`,
        desc: `If a model from this unit is slain in the combat phase, before that model is removed from play, that model can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Goreaxes`,
        desc: `You can reroll hit rolls of 1 for attacks made with a pair of Goreaxes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gorefists`,
        desc: `If an unmodified save roll for an attack made with a melee weapon that targets a unit that includes any models armed with a Goreaxe and Gorefist is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Bloodreavers: {
    effects: [
      {
        name: `Icon Bearer`,
        desc: `Add 1 to the Bravery characteristic of this unit while it includes any Icon Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Add 1 to run and charge rolls for this unit while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Frenzied Devotion`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while this unit is wholly within 16" of any friendly KHORNE TOTEMS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaver Blades`,
        desc: `You can reroll hit rolls of 1 for attacks made with Reaver Blades.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Garrek's Reavers": {
    effects: [
      {
        name: `Garrek Gorebeard`,
        desc: `If the unmodified hit roll for an attack made with Garrek Gorebeard's Blooddrinker Axe is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grisly Trophies`,
        desc: `Do not take a battleshock test for this unit if any enemy models were slain by attacks made by this unit's Garrek Gorebeard earlier in the same turn.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Frenzied Devotion`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while this unit is wholly within 16" of any friendly KHORNE TOTEMS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaver Blades`,
        desc: `You can reroll hit rolls of 1 for attacks made with Reaver Blades.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Magore's Fiends": {
    effects: [
      {
        name: `Magore Redhand`,
        desc: `You can reroll hit rolls for attacks made by this unit that target STORMCAST ETERNAL units while this unit includes Magore Redhand.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `No Respite`,
        desc: `If a model from this unit is slain in the combat phase, before that model is removed from play, that model can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Scent`,
        desc: `You can reroll charge rolls for this unit while it is wholly within 8" of a friendly RIPTOOTH model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Gorefists`,
        desc: `If an unmodified save roll for an attack made with a melee weapon that targets a unit that includes any models armed with a Goreaxe and Gorefist is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Riptooth: {
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `This unit can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Collar of Khorne`,
        desc: `This unit can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Unflagging Hunter`,
        desc: `You can reroll charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Wrathmongers: {
    effects: [
      {
        name: `Furious Assault`,
        desc: `Add 1 to hit rolls for attacks made by this unit if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodfury`,
        desc: `If a model in this unit is slain, before it is removed from play roll a D6 for each enemy unit within 1" of that model. Add 1 to the dice roll if 2 or more models from that enemy unit are within 1" of the slain model. On a 1, nothing happens. On a 2-5, that enemy unit suffers 1 mortal wound after all of its attacks have been resolved. On a 6+ that enemy unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Crimson Haze`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by Khorne units while they are wholly within 8" of any units with this ability. This ability has no effect on Wrathmongers.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Mighty Skullcrushers': {
    effects: [
      {
        name: `Hornblower`,
        desc: `Add 1 to run and charge rolls made for this unit while it includes any Hornblowers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Add 2 to the Bravery characteristic of this unit while it includes any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      MurderousChargeEffect,
    ],
  },
  Skullreapers: {
    effects: [
      {
        name: `Icon Bearer`,
        desc: `Add 1 to charge rolls for this unit while it includes any Icon Bearers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Trial of Skulls`,
        desc: `You can reroll hit rolls for attacks made by this unit if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Daemonforged Weapons`,
        desc: `If the unmodified hit roll for an attack made with this unit's Gore-slick Blades, Daemonblades, Spinecleavers and Soultearers is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Murderous to the Last`,
        desc: `Do not take battleshock tests for this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Murderous to the Last`,
        desc: `Roll a D6 each time a model from this unit is slain by an attack made with a melee weapon, before that model is removed from play. On a 5+ pick 1 enemy unit within 1" of the slain model. That unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Scyla Anfingrimm': {
    effects: [
      {
        name: `Brass Collar of Khorne`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase as if it were a WIZARD.`,
        when: [HERO_PHASE],
      },
      {
        name: `Brass Collar of Khorne`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Raging Fury`,
        desc: `When rolling to determine the Attacks characteristic of this model's Brutal Fists, add 1 to the roll for each wound allocated to this model that was not negated and has not been healed.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bestial Leap`,
        desc: `This model is eligible to fight in the combat phase if it is within 8" of an enemy unit instead of 3", and can move an extra 5" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Khorgoraths: {
    effects: [
      {
        name: `Horrific Predator`,
        desc: `Add 1 to battleshock rolls for units that had any models slain by attacks made by KHORGORATHS in the same turn.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Taker of Heads`,
        desc: `At the end of the combat phase, if any enemy models were slain by this unit's attacks in that combat phase, you can heal 1 wound allocated to this unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Vorgaroth the Scarred & Skalok the Skull Host of Khorne': {
    effects: [
      {
        name: `Monstrous Trophies`,
        desc: `You can reroll failed wound rolls for attacks made with this model's Skull Cleaver Axe of Khorne that target a MONSTER.
               If the unmodified wound roll for an attack made with the Skull Cleaver Axe of Khorne is a 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crushing Bulk`,
        desc: `Roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 3+ that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Eternal Hunt`,
        desc: `You can set up this model in reserve.`,
        when: [DURING_SETUP],
      },
      {
        name: `Eternal Hunt`,
        desc: `If this model is in reserve, at the end of your second movement phase you can set up this unit more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },

      {
        name: `Fettered Servitude`,
        desc: `Before battleshock testing friendly Khorne units wholly within 12" of this model, you can instead slay 1 model from that unit and skip its battleshock test. If you chose not to do this and fail the subsequent battleshock test, add D3 to the models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Fuelled by Death`,
        desc: `You can pick 1 friendly model within 3" of this unit and roll a D6. If the roll is equal to or greater than the models wound's characteristic, the model is slain. This unit heals a number of of wounds up to the value of the slain model's wounds characteristic.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wings of Fury`,
        desc: `Subract 3 from the casting and unbinding rolls for enemy wizards within 18" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs({ ...Units }, 'unit')
