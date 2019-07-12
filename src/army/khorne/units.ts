import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_TURN,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Skaarac the Bloodborn`,
    effects: [
      {
        name: `Life-eater`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },

      {
        name: `Infernal Iron`,
        desc: `Subtract 2 from casting rolls for enemy Wizards while they are within 12" of this model.`,
        when: [HERO_PHASE],
      },

      {
        name: `Towering Horror`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },

      {
        name: `Undying Hate`,
        desc: `If this model is slain, before removing the model from play, roll a dice for each enemy model within 3" of this model. On a 4+, that model's unit suffers 1 mortal wound. This model is then removed from play.`,
        when: [DURING_GAME],
      },

      {
        name: `Call of the Skull Throne`,
        desc: `You can use this command ability at the start of your charge phase if this model is on the battlefield. If you do so, you can re-roll charge rolls for friendly Khorne units while they are wholly within 12" of this model in that charge phase.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Khorgoraths`,
    effects: [
      {
        name: `Horrific Predator`,
        desc: `If this unit inflicts damage on one or more enemy units in the combat phase, then you must subtract 1 from the Bravery of all enemy units within 12" of this unit in the battleshock phase of the same turn.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Taker of Heads`,
        desc: `If the attacks made by this unit in the combat phase result in one or more enemy models being slain, then you can heal 1 wound suffered by a model from this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Scyla Anfingrimm`,
    effects: [
      {
        name: `Brass Collar of Khorne`,
        desc: `The Brass Collar of Khorne embedded into Scyla's neck allows him to attempt to unbind one spell in each enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Raging Fury`,
        desc: `When you roll to see how many attacks Scyla makes with his Brutal Fists, add 1 to the result for each wound he has suffered.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bestial Leap`,
        desc: `When Scyla piles in, he can move up to 6" and can move over enemy models. Furthermore, he does not have to move towards the closest enemy model, as long as he ends his move within 2" of more enemy models than before he piled in.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Mighty Skull Crushers`,
    effects: [
      {
        name: `Hornblower`,
        desc: `If the unit includes one or more Hornblowers, add 1 to its run and charge rolls.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `If the unit includes one or more Standard Bearers, add 1 to the Bravery of all its models. After this unit has slain an enemy model, add 3 to their Bravery instead.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Brass-clad Shield`,
        desc: `If this unit suffers any wounds or mortal wounds as the result of a spell, roll a dice. If the result is 4 or more, the wounds or mortal wounds are ignored.`,
        when: [HERO_PHASE],
      },
      {
        name: `Murderous Charge`,
        desc: `If this unit completes a charge move, then at the end of the charge phase, roll a dice for each enemy unit within 1". On a roll of 4 or more that unit suffers D3 mortal wounds; if this unit includes 6 or more models, the target unit suffers D6 mortal wounds instead.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Wrathmongers`,
    effects: [
      {
        name: `Wraith-flails`,
        desc: `Add 1 to any hit rolls made for a model attacking with Wrath-flails if that model charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crimson Haze`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by Khorne units while they are wholly within 8" of any units with this ability. This ability has no effect on Wrathmongers.'`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodfury`,
        desc: `Each time a Wrathmonger is slain in the combat phase, you can choose an enemy model that is within 2" of the slain model. Immediately attack with the enemy model you chose as though it was part of your army. The model can attack its own unit, and even itself! No enemy model can be chosen in this way more than once in a phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skullreapers`,
    effects: [
      {
        name: `Icon Bearer`,
        desc: `If the unit includes one or more Icon Bearers, add 1 to the Bravery of all its models.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Trial of Skulls`,
        desc: `Keep a running total of the number of enemy models slain by this unit's attacks. If the running total is greater than the number of models in this unit, you can re-roll failed hit rolls for this unit. If the running total is at least double the number of models, you can also re-roll failed wound rolls.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Daemonforged Weapons`,
        desc: `When a model attacks with a Daemonblade or Soultearer, and the hit roll is 6 or higher, the target suffers a mortal wound in addition to any other damage. If the wound roll is a 1, the attacking unit suffers a mortal wound instead!`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frenzied Attacks`,
        desc: `You can re-roll hit rolls of 1 for models armed with Gore-slick Blades or Daemonblades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Murderous to the Last`,
        desc: `Roll a dice immediately after any model from this unit is slain in the combat phase. If the result is 4 or 5, the attacking unit suffers a mortal wound; if it is 6, the attacking unit suffers D3 mortal wounds instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodreavers`,
    effects: [
      {
        name: `Icon Bearer`,
        desc: `If the unit includes one or more Icon Bearers, add 1 to the Bravery of all its models.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `If the unit includes one or more Hornblowers, add 1 to its run and charge rolls.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Frenzied Devotion`,
        desc: `If this unit is within 12" of a CHAOS TOTEM from your army when it is selected to attack, then all models in this unit make 2 attacks rather than 1, and the Chieftain makes 3 attacks rather than 2.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaver Blades`,
        desc: `You can re-roll hit rolls of 1 for models armed with Reaver Blades.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blood Warriors`,
    effects: [
      {
        name: `Icon Bearer`,
        desc: `If the unit includes any Icon Bearers, add 1 to the Bravery of all its models.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `No Respite`,
        desc: `If a model from this unit is slain in the combat phase, you can make a pile in move and then attack with the model before you remove it.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Goreaxes`,
        desc: `You can re-roll hit rolls of 1 for models armed with more than one Goreaxe.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gorefists`,
        desc: `Each time you make a successful save roll for a unit that contains any models carrying Gorefists, and the attacking unit is within 1" of this unit, roll a dice. For each roll of a 6, the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Bloodstoker`,
    effects: [
      {
        name: `Whipped to Fury`,
        desc: `In your hero phase, pick one KHORNE unit from your army within 12" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Whipped to Fury`,
        desc: `Until your next hero phase, you can add 3" to all run or charge rolls for a unit that has been whipped to fury, and can re-roll wound rolls of 1 for models in that unit.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skullgrinder`,
    effects: [
      {
        name: `Favoured by Khorne`,
        desc: `Add 1 to the Bravery of all MORTAL KHORNE units in your army that are within 6" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Altar of Skulls`,
        desc: `If a HERO or MONSTER is slain by the Skullgrinder's Brazen Anvil, the Skullgrinder and all MORTAL KHORNE units in your army within 8" are blood-blessed for the rest of the battle. If a hit roll for an attack made by a blood-blessed model is 4 or higher, make two wound rolls rather than one.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Slaughterpriest`,
    effects: [
      {
        name: `Scorn of Sorcery`,
        desc: `This model can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodfuelled Prayers`,
        desc: `In your hero phase, a Slaughterpriest can pray to Khorne for aid. Pick one of the prayers on the warscroll, then roll a dice, adding 1 to the result if the Slaughterpriest slew any enemy models in the previous turn. If the result is 4 or higher, the effect takes place. If the result is 1, this Slaughterpriest suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Slaughterpriest with Hackblade and Wrath-hammer`,
    effects: [
      {
        name: `Scorn of Sorcery`,
        desc: `This model can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodfuelled Prayers`,
        desc: `In your hero phase, a Slaughterpriest can pray to Khorne for aid. Pick one of the prayers on the warscroll, then roll a dice, adding 1 to the result if the Slaughterpriest slew any enemy models in the previous turn. If the result is 4 or higher, the effect takes place. If the result is 1, this Slaughterpriest suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aspiring Deathbringer with Goreaxe and Skullhammer`,
    effects: [
      {
        name: `Bane of Cowards`,
        desc: `If any enemy models flee within 8" of this Aspiring Deathbringer in the battleshock phase, this model can, at the end of that phase, pile in and attack as if it were the combat phase.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Slaughter Incarnate`,
        desc: `If this model uses this ability, then until your next hero phase you can add 1 to the Attacks characteristic of all melee weapons used by MORTAL KHORNE units in your army while they are within 6" of this model. A unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Lord of Khorne on Juggernaut`,
    effects: [
      {
        name: `Brass-clad Shield`,
        desc: `If this model suffers any wounds or mortal wounds as the result of a spell, roll a dice. If the result is 4 or more, the wounds are ignored.`,
        when: [HERO_PHASE],
      },
      {
        name: `Murderous Charge`,
        desc: `If this model completes a charge move, then at the end of the charge phase, roll a dice for each enemy unit within 1". On a roll of 4 or more that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Daemonic Axe`,
        desc: `If the wound roll for an attack made with the Wrathforged Axe is 6 or more, the attack inflicts 3 wounds rather than D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Stampede`,
        desc: `If this model uses this ability, pick up to 3 MORTAL KHORNE units within 24" of him. Until your next hero phase, add 1 to the wound rolls made in the combat phase for this model and any units you picked, as long as they charged in the same turn.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bloodsecrator`,
    effects: [
      {
        name: `Portal of Skulls`,
        desc: ` In your hero phase, you can declare that this model opens the Portal of Skulls. If you do, until your next hero phase you may not move the model, but it has the following abilities:
        
        Loathsome Sorcery: Both sides must re-roll successful casting rolls for wizards within 18" of this model, before any unbinding rolls are made.
        
        Rage of Khorne: This ability affects all KHORNE units in your army within 18" of this model at the start of the combat phase. When they attack, add 1 to the Attacks characteristic of all melee weapons used by units affected by the Rage of Khorne. In addition, players do not have to take battleshock tests for any KHORNE units within 18" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood Throne`,
    effects: [
      {
        name: `Gorefeast`,
        desc: `The Blood Throne heals a wound at the end of the combat phase for each wound that was inflicted by its Gnashing Maw.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the hit roll for a Blade of Blood or a Hellblade is 6 or more, that blow inflicts a mortal wound instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodthirster of Insensate Rage`,
    effects: [
      {
        name: `Rage Unbound`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Outrageous Carnage`,
        desc: `If the unmodified wound roll for an attack made by this model is 6, each enemy unit within 8" of this model suffers the number of mortal wounds shown on the damage table above, in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodthirsty Charge`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick a friendly model with this command ability. Until the end of that phase, you can re-roll charge rolls for friendly KHORNE DAEMON units wholly within 16" of that model when the charge roll is made.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bloodthirster of Unfettered Fury`,
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
      {
        name: `Rejoice in the Slaughter`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Until the end of that combat phase friendly KHORNE DAEMON units wholly within 16" of that model are eligible to fight in that combat phase if they are within 6" of an enemy unit instead of 3", and can move an extra 3" when they pile in.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Wrath of Khorne Bloodthirster`,
    effects: [
      {
        name: `Hellfire Breath`,
        desc: `Do not use the attack sequence for an attack made with Hellfire Breath. Instead, pick an enemy unit that is in range of the attack and roll a dice. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Relentless Hunters`,
        desc: `You can re-roll hit rolls for attacks made by this model that target a HERO or MONSTER`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Rune-crown of Khorne`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase as if it were a WIZARD. In addition, add 2 to unbinding rolls for this model`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune-crown of Khorne`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Lord of the Blood Hunt`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly KHORNE DAEMON unit wholly within 16" of a friendly model with this command ability. Until the end of the phase you can re-roll hit rolls for attacks made by that unit.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skarbrand`,
    effects: [
      {
        name: `Roar of Total Rage`,
        desc: `Do not use the attack sequence for an attack made with the Roar of Total Rage. Instead, pick 1 enemy unit that is in range of the attack and roll the number of dice shown on the damage table above. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [ SHOOTING_PHASE],
      },
      {
        name: `Skarbrand's Rage`,
        desc: `From the second battle round, if this model is on the battlefield and did not attack in at least one of the combat phases of the previous battle round, when you look up a value on this model’s damage table the model is treated as having suffered 13 wounds.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Total Carnage`,
        desc: `Do not use the attack sequence for an attack made with Carnage. Instead, roll a dice. The target unit suffers 8 mortal wounds if the roll is equal to or greater than the Carnage value shown on the damage table above. If the roll is 6, the target unit suffers 16 mortal wounds instead.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Inescapable Wrath`,
        desc: `You can re-roll charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Skulltaker`,
    effects: [
      {
        name: `Cloak of Skulls`,
        desc: `You can re-roll save rolls for attacks that target this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Decapitating Strike`,
        desc: `If the unmodified hit roll for an attack made with the Slayer Sword is 6, that attack inflicts 3 mortal wounds on the target in addition to any normal damage`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Heroes' Bane`,
        desc: `You can re-roll hit and wound rolls for attacks made by this model that target a HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Heads Must Roll`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly BLOODLETTERS unit wholly within 12" of a friendly model with this command ability. Until the end of that phase, you can re-roll wound rolls of 1 for attacks made by that unit.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true
      },
    ],
  },
  {
    name: `Bloodmaster, Herald of Khorne`,
    effects: [
      {
        name: `The Blood Must Flow`,
        desc: `After a Bloodmaster attacks in the combat phase, you can pick another BLOODLETTER unit within 8". That unit can immediately pile in and attack if it is within 3" of the enemy and has not already attacked this phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the hit roll for a Blade of Blood is 6 or more, that blow inflicts a mortal wound instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skullmaster, Herald of Khorne`,
    effects: [
      {
        name: `Slaughter and Ruin`,
        desc: `You can re-roll all failed hit rolls for this model if it charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the hit roll for a Blade of Blood is 6 or more, that blow inflicts a mortal wound instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Murderous Charge`,
        desc: `If this model completes a charge move, then at the end of the charge phase, roll a dice for each enemy unit within 1". On a roll of 4 or more that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Mighty Lord of Khorne`,
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `This model may attempt to unbind one spell in each enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reality-splitting Axe`,
        desc: `After a Mighty Lord of Khorne has made all of his attacks with his Axe of Khorne in the combat phase, roll a dice for each enemy model that suffered one or more wounds as a result of those attacks but was not slain. On a roll of 5 or more, the model being rolled for is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gorelord`,
        desc: `If this model uses this ability, pick up to 3 MORTAL KHORNE units in your army within 24" of this model in your hero phase. Until your next hero phase, when you make charge rolls for this model or any of the units you picked, roll 3 dice rather than 2 dice, and use the 2 dice with the highest rolls to determine the charge move of the unit being rolled for.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skarr Bloodwrath`,
    effects: [
      {
        name: `The Slaughterborn`,
        desc: `After Skarr Bloodwrath has been slain, roll a dice at the start of each battleshock phase if at least 8 models have been slain during the turn. On a roll of 4 or more, set up Skarr Bloodwrath anywhere on the battlefield more than 9" from the enemy.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Slaughterstorm`,
        desc: `Skarr Bloodwrath can make a slaughterstorm attack instead of attacking normally. To do so, select a target unit and make one attack against it for each model that is within range. Repeat this for each enemy unit that is within range of the Bloodstorm Blades.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Valkia the Bloody`,
    effects: [
      {
        name: `The Gaze of Khorne`,
        desc: `MORTAL KHORNE units within 12" of Valkia the Bloody, can re-roll battleshock tests, but if any models flee after the re-roll, a further D3 from that unit are slain.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Spear Slaupnir`,
        desc: `Slaupnir's Damage characteristic is D3 rather than 1 if Valkia charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Daemonshield`,
        desc: `Subtract 1 from any wound rolls for attacks that target Valkia the Bloody in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exalted Greater Daemon of Khorne`,
    effects: [
      {
        name: `Drawn in for the Kill`,
        desc: `At the start of the enemy movement phase, pick 1 enemy unit within 3" of this model. That unit cannot retreat in that phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `The Land Rebels`,
        desc: `At the start of your hero phase, roll a dice for each enemy unit within 8" of any friendly models with this ability. On a 5+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Rejoice in Exalted Slaughter`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Until the end of that combat phase friendly Khorne Daemon units wholly within 18" of that model are eligible to fight in that combat phase if they are within 6" of an enemy unit instead of 3", and they can move an extra 3" when they pile-in.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Exalted Deathbringer`,
    effects: [
      {
        name: `Blooded Lieutenant`,
        desc: `If this model is not your general, he makes 2 additional attacks whilst he is within 12" of a KHORNE general.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Runemarked Shield`,
        desc: `If an Exalted Deathbringer carrying a Runemarked Shield suffers any wounds or mortal wounds as the result of a spell, roll a dice. If the result is 2 or more, the wounds are ignored.`,
        when: [HERO_PHASE],
      },
      {
        name: `Skullgouger`,
        desc: `Each time you make a save roll of 6 or more in the combat phase for an Exalted Deathbringer with a Skullgouger,he inflicts D3 mortal wounds on the attacking unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Brutal Command`,
        desc: `If this model uses this ability, all MORTAL KHORNE units in your army within 12" of the Exalted Deathbringer can use his Bravery characteristic instead of their own until your next hero phase. If there is a unit from your army within 1" of the Exalted Deathbringer when he uses this ability, you can inflict D3 mortal wounds on that unit to increase its range from 12" to 24".`,
        when: [BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Exalted Deathbringer with Impaling Spear`,
    effects: [
      {
        name: `Blooded Lieutenant`,
        desc: `If this model is not your general, he makes 2 additional attacks whilst he is within 12" of a KHORNE general.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Brutal Impalement`,
        desc: `Roll a dice when an enemy HERO is wounded by an Impaling Spear but not slain; on a 1, 2 or 3 nothing happens, but on a 4, 5 or 6 the HERO suffers a mortal wound. Continue to repeat this process until you either fail to inflict a mortal wound or the enemy HERO is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Brutal Command`,
        desc: `If this model uses this ability, all MORTAL KHORNE units in your army within 12" of the Exalted Deathbringer can use his Bravery characteristic instead of their own until your next hero phase. If there is a unit from your army within 1" of the Exalted Deathbringer when he uses this ability, you can inflict D3 mortal wounds on that unit to increase its range from 12" to 24".`,
        when: [BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Karanak`,
    effects: [
      {
        name: `Unflagging Hunter`,
        desc: `You can re-roll charge rolls for this model`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Brass Collar of Bloody Vengeance`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD. If this model successfully unbinds a spell, the caster suffers D3 mortal wounds`,
        when: [HERO_PHASE],
      },
      {
        name: `Brass Collar of Bloody Vengeance`,
        desc: `This model can attempt to dispel one endless spell at the start of your hero phase in the same manner as a WIZARD. If this model successfully dispels an endless spell, the caster suffers D3 mortal wounds`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Prey of the Blood God`,
        desc: `After armies are set up, but before the first battle round begins, pick 1 enemy HERO to be this model’s quarry. You can re-roll hit and wound rolls for attacks made by this model that target that HERO.`,
        when: [END_OF_SETUP, COMBAT_PHASE],
      },
      {
        name: `Call of the Hunt`,
        desc: `Once per game, during the hero phase, you can summon 1 unit of 5 Flesh Hounds to the battlefield and add it to your army if this model is within 8" of its quarry (see Prey of the Blood God, left). The summoned unit must be set up wholly within 8" of this model and more than 9" from any enemy units. The summoned unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodletters`,
    effects: [
      {
        name: `Hornblower`,
        desc: `Your opponent must re-roll battleshock tests of 1 for units that are within 6" of any Hornblowers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the hit roll for a Hellblade is 6 or more, that blow inflicts a mortal wound instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gore-drenched Icon`,
        desc: `If you roll a 1 when making a battleshock test for a unit that includes any Goredrenched Icons, add D6 Bloodletters to the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bloodsoaked Banner`,
        desc: `Each time a unit containing any Bloodsoaked Banners slays a HERO, add 1 to any charge rolls you make for it for the rest of the battle.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Locus of Fury`,
        desc: `You can re-roll hit rolls of 1 for this unit if there is a DAEMON HERO of KHORNE from your army within 8".`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Murderous Tide`,
        desc: `You can add 1 to hit rolls made for a Bloodletter if its unit contains 20 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodcrushers`,
    effects: [
      {
        name: `Icon Bearer`,
        desc: `If you roll a 1 when making a battleshock test for a unit that includes any Icon Bearers, add D6 Bloodletters to the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Your opponent must re-roll battleshock tests of 1 for units that are within 6" of any Hornblowers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the hit roll for a Hellblade is 6 or more, that blow inflicts a mortal wound instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Murderous Charge`,
        desc: `If this unit completes a charge move, then at the end of the charge phase, roll a dice for each enemy unit within 1". On a roll of 4 or more that unit suffers D3 mortal wounds; if this unit includes 6 or more models, the target unit suffers D6 mortal wounds instead.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Locus of Wrath`,
        desc: `You can re-roll all failed hit rolls for this unit if it charged this turn and there is a DAEMON HERO of KHORNE from your army within 8".`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flesh Hounds`,
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
        desc: `You can re-roll charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Skull Cannons`,
    effects: [
      {
        name: `Skull Cannon`,
        desc: `When a Skull Cannon shoots a Burning Skull, add 1 to the hit roll if the target contains 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Grind their Bones, Seize their Skulls`,
        desc: `If the Skull Cannon's Gnashing Maw causes any wounds in the combat phase, at the end of that phase you can make a Burning Skull attack as though it were your shooting phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Decapitating Blow`,
        desc: `If the hit roll for a Hellblade is 6 or more, that blow inflicts a mortal wound instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Slaughterborn`,
    effects: [
      {
        name: `Inured to Bloodshed`,
        desc: `Worsen the Rend characteristic of melee weapons used for attacks that target a unit from this battalion by 1 (to a minimum of 0).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gore Pilgrims`,
    effects: [
      {
        name: `Widening the Rift`,
        desc: `Add 8" to the range of the Loathsome Sorcery and Rage of Khorne abilities used by this battalion’s BLOODSECRATOR while it is wholly within 8" of any SLAUGHTERPRIESTS from the same battalion.`,
        when: [HERO_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Bloodforged`,
    effects: [
      {
        name: `Feast of Wrath`,
        desc: `Immediately after a unit of WRATHMONGERS from this battalion has fought in your combat phase for the first time that phase, if that unit is within 3" of any enemy units and wholly within 8" of a SKULLGRINDER from the same battalion, that unit can immediately make a pile-in move and then attack with all of the melee weapons it is armed with for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodmad Warband`,
    effects: [
      {
        name: `Frenzied Charge`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by a unit from this battalion if that unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Red Headsmen`,
    effects: [
      {
        name: `Slay the Worthy`,
        desc: `Each time an enemy HERO or MONSTER is slain by an attack made by a unit from this battalion, you receive 1 additional Blood Tithe point.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Skulltake`,
    effects: [
      {
        name: `Reaping Strikes`,
        desc: `If the unmodified wound roll for an attack with a melee weapon made by a unit from this battalion is 6 and that unit is wholly within 12" of a BLOODSTOKER from the same battalion, add 1 to the Damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dark Feast`,
    effects: [
      {
        name: `Feeding Frenzy`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by BLOODREAVERS units from this battalion while they are wholly within 16" of a SLAUGHTERPRIEST from the same battalion`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Brass Stampede`,
    effects: [
      {
        name: `Obliterating Charge`,
        desc: `The Murderous Charge and Slaughterous Charge abilities used by units from this battalion automatically inflict mortal wounds after a model finishes a charge move, instead of inflicting mortal wounds on a roll of 2+.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Gorechosen`,
    effects: [
      {
        name: `Mightiest of Champions`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by units from this battalion. In addition, while a unit from this battalion is wholly within 8" of at least two other units from the same battalion, add 1 to hit rolls for attacks made by that unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodbound Warhorde`,
    effects: [
      {
        name: `Endless Slaughter`,
        desc: `At the start of your turn, you receive 1 Blood Tithe point.`,
        when: [START_OF_TURN],
      },
    ],
  },
  {
    name: `Blood Legion`,
    effects: [
      {
        name: `Skulls for the Skull Throne`,
        desc: `When units from this battalion use their Decapitating Blow ability, it inflicts a mortal wound on an unmodified wound roll of 5+ instead of 6.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blood Host`,
    effects: [
      {
        name: `Cometh the Slaughter`,
        desc: `You can re-roll charge rolls for units from this battalion while they are wholly within 16" of any BLOODTHIRSTERS from the same battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Council of Blood`,
    effects: [
      {
        name: `Fierce Rivals`,
        desc: `In each of your hero phases, pick one BLOODTHIRSTER from the Council of Blood to pile in and make attacks. If that BLOODTHIRSTER kills an enemy HERO or MONSTER, or wipes out a unit in doing so, you can immediately pick another BLOODTHIRSTER from the Council of Blood to pile in and make attacks with. You can continue to do this until either each model in the battalion has attacked once in this manner, or one of them fails to slay an enemy HERO or MONSTER, or wipe out a unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lords of Battle`,
        desc: `Each BLOODTHIRSTER from a Council of Blood can use the command ability on its warscroll in each of your hero phases, even if they are not your army's general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Daemon Legion of Khorne`,
    effects: [
      {
        name: `Khorne Cares Not From Whence The Blood Flows`,
        desc: `If any units are wiped out during the combat phase, you can add 1 to the Attacks characteristic of all melee weapons used by the Daemon Legion of Khorne for the remainder of that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Revel in Carnage`,
        desc: `You immediately gain 1 Blood Tithe point at the start of each of your hero phases.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood Hunt`,
    effects: [
      {
        name: `Khorne's Hunters`,
        desc: `Add 1 to wound rolls for attacks made by units from this battalion that target a HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Bloodthunder Stampede`,
    effects: [
      {
        name: `Obliterating Charge`,
        desc: `The Murderous Charge and Slaughterous Charge abilities used by units from this battalion automatically inflict mortal wounds after a model finishes a charge move, instead of inflicting mortal wounds on a roll of 2+`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Tyrants of Blood`,
    effects: [
      {
        name: `Fierce Rivals`,
        desc: `After a model from this battalion has fought in the combat phase for the first time, you can pick another model from the same battalion that has not yet fought in that combat phase and is within 3" of any enemy units. That model fights immediately, before the opposing player picks a unit to fight in that combat phase. That model cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Charnel Host`,
    effects: [
      {
        name: `Daemon Commander`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by units from this battalion that are wholly within 16" of a BLOODTHIRSTER from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gorethunder Cohort`,
    effects: [
      {
        name: `The Cannons of Khorne`,
        desc: `You can re-roll hit rolls for attacks made with missile weapons by SKULL CANNONS from this battalion that are wholly within 12" of a HERALD OF KHORNE ON BLOOD THRONE from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Murderhost`,
    effects: [
      {
        name: `Insatiable Bloodlust`,
        desc: `Add 2 to run and charge rolls for units from this battalion while they are wholly within 16" of a BLOODLETTER HERO from the same battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Skullseeker Host`,
    effects: [
      {
        name: `Giant Killers`,
        desc: `You can re-roll wound rolls for attacks made by units from this battalion that target a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]
