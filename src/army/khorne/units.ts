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
        command: true,
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
        command: true,
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
        command: true,
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
        desc: `You can re-roll hit rolls of 1 for this model's Great Axe of Khorne if it charged this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Outrageous Carnage`,
        desc: `If the wound roll for a Great Axe of Khorne is 6 or more, each enemy unit within 8" of the Bloodthirster suffers a number of mortal wounds. The number of mortal wounds suffered is shown in the damage table.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodthirsty Charge`,
        desc: `If a Bloodthirster of Insensate Rage uses this ability, then in your next charge phase, you can re-roll the dice when determining the charge distance for any KHORNE DAEMON units within 8"`,
        when: [CHARGE_PHASE],
        command: true,
      },
    ],
  },
  {
    name: `Bloodthirster of Unfettered Fury`,
    effects: [
      {
        name: `Drawn in for the Kill`,
        desc: `If a Bloodthirster of Unfettered Fury hits an enemy HERO or MONSTER with its Lash of Khorne but does not kill it, roll a dice at the end of the shooting phase and move the model that many inches directly towards the Bloodthirster. The model can be moved to within 3" of the Bloodthirster.`,
        when: [END_OF_SHOOTING_PHASE],
      },
      {
        name: `The Land Rebels`,
        desc: `At the
        beginning of your hero phase, roll a dice for each enemy unit within 8". On a 6, that unit suffers a mortal wound and halves its Move until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Rejoice in the Slaughter`,
        desc: `If a Bloodthirster of Unfettered Fury uses this ability, then until your next hero phase KHORNE DAEMON units within 8" of this model when they pile in can move up to 6" instead of 3".`,
        when: [CHARGE_PHASE],
        command: true,
      },
    ],
  },
  {
    name: `Wrath of Khorne Bloodthirster`,
    effects: [
      {
        name: `Hellfire Breath`,
        desc: `In the shooting phase, pick a unit within range that is visible to the Bloodthirster; that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Relentless Hunters`,
        desc: `You can re-roll any failed hit rolls for attacks made by this model against HEROES or MONSTERS.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Rune-crown of Khorne`,
        desc: `A Wrath of Khorne Bloodthirster can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard. Add 2 to the result of any unbinding rolls made for it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lord of the Blood Hunt`,
        desc: `If a Wrath of Khorne Bloodthirster uses this ability, select a unit of KHORNE DAEMONS within 16". Until your next hero phase, that unit can run and charge in the same turn and you can add 1 to its run and charge rolls.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
        command: true,
      },
    ],
  },
  {
    name: `Skarbrand`,
    effects: [
      {
        name: `Skarbrand's Rage`,
        desc: `In each of your hero phases, look on Skarbrand's damage table to see his current level of rage. If Skarbrand was not able to attack in at least one of the combat phases of the previous battle round, he is always Incandescent, regardless of the wounds he has remaining. Skarbrand can use his rage to fuel one or more of the following abilities.`,
        when: [HERO_PHASE],
      },
      {
        name: `Total Carnage`,
        desc: `Roll a dice each time Skarbrand hits a target with the axe Carnage; if the roll is greater than or equal to the result shown in the damage table, the hit has caused total carnage. Pick a model in the target unit; that model immediately suffers 8 wounds. No saves of any kind can be taken against total carnage, and abilities that would prevent or reduce the damage of an attack are ignored. If the roll is less than the result shown in the table, the hit inflicts one mortal wound on the target unit instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skulltaker`,
    effects: [
      {
        name: `Cloak of Skulls`,
        desc: `You can re-roll failed save rolls for Skulltaker.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Decapitating Strike`,
        desc: `If the hit roll for the Slayer Sword is 6+, that blow inflicts 3 mortal wounds instead of its normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Skulls for Khorne`,
        desc: `You can re-roll all failed hit and wound rolls when Skulltaker targets a HERO.`,
        when: [COMBAT_PHASE],
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
        command: true,
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
        command: true,
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
        command: true,
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
        command: true,
      },
    ],
  },
  {
    name: `Karanak`,
    effects: [
      {
        name: `Brass Collar of Bloody Vengeance`,
        desc: `Karanak can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard. If he successfully unbinds a spell, the caster immediately suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Prey of the Blood God`,
        desc: `After set-up is complete, you can pick one HERO to be Karanak's quarry. You can re-roll failed hit and wound rolls for Karanak when he attacks this model.`,
        when: [END_OF_SETUP, COMBAT_PHASE],
      },
      {
        name: `Call of the Hunt`,
        desc: `Once per game, if Karanak is within 8" of his quarry during your hero phase, you can summon a unit of 5 Flesh Hounds anywhere wholly within 8" of Karanak and more than 9" from any enemy unit. The summoned unit cannot move in the following movement phase.`,
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
        desc: `This unit can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard. Add 1 to the unbinding roll if the unit contains 10 or more models.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tireless Hunters`,
        desc: `You can re-roll failed charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Locus of Abjuration`,
        desc: `You can re-roll failed unbinding attempts for this unit if it is within 8" of a DAEMON HERO of KHORNE from your army.`,
        when: [HERO_PHASE],
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
    name: `The Skullfiend Tribe`,
    effects: [
      {
        name: `Skull Hunters`,
        desc: `If any units from the Skullfiend Tribe are within 3" of any enemy HEROES or MONSTERS at the start of your hero phase, they can immediately pile in and each model in that unit can make a single attack against one such unit with one of their melee weapons.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Goretide`,
    effects: [
      {
        name: `Aqshy's Bane`,
        desc: `In each of your hero phases, you can pile in up to 8" and attack with the Goretide's Mighty Lord of Khorne.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aqshy's Bane`,
        desc: `You can re-roll all failed hit rolls for the Goretide's Mighty Lord of Khorne, including any attacks made with the Blood-dark Claws of his ferocious Flesh Hound, Grizzlemaw.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hot-headed Conquerors`,
        desc: `In each of your hero phases, roll a D6. You can move each Goretide unit up to the number rolled in inches. You cannot retreat or run as part of this move, but can use it to charge the enemy.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Slaughterborn`,
    effects: [
      {
        name: `Hungry for Glory`,
        desc: `If your general is a KHORNE HERO and they are within 3" of any enemy units in the hero phase, any Slaughterborn units that are within 12" of your general can immediately attempt to charge those enemy units. Any Slaughterborn units that make successful charges in this manner can immediately pile in and each model in those units can make a single attack with one of their melee weapons during that hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gore Pilgrims`,
    effects: [
      {
        name: `Acolytes of Khorne`,
        desc: `You can choose to re-roll the dice when attempting a Bloodfuelled Prayer or Blood Blessing of Khorne with a SLAUGHTERPRIEST from the Gore Pilgrims.`,
        when: [HERO_PHASE],
      },
      {
        name: `Widening the Rift`,
        desc: `Increase the range of the Portal of Skulls ability of this battalion's Bloodsecrator by 6" for each of this battalion's SLAUGHTERPRIESTS that are within 8" of him when he opens the Portal of Skulls.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodforged`,
    effects: [
      {
        name: `Blood Aegis`,
        desc: `When you make save rolls for this unit in the combat phase, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infectious Bloodletting`,
        desc: `Roll a dice for each enemy model within 3" of a Bloodforged model at the start of each of your hero phases. On a roll of 6, you can immediately attack (but not pile in) with all of the melee weapons of the enemy model being rolled for as though it was part of your army. The model can attack its own unit, and even itself!`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodbound Warband`,
    effects: [
      {
        name: `Bloodrain`,
        desc: `If at least three units from a Bloodbound Warband are within 3" of an enemy unit at the start of your hero phase, Khorne's blessing manifests as a squall of blood and gore which falls until your next hero phase. While this bloodrain is falling, KHORNE units in your army do not need to take battleshock tests.`,
        when: [START_OF_HERO_PHASE, BATTLESHOCK_PHASE],
      },
      {
        name: `Frenzied Charge`,
        desc: `When units in a Bloodbound Warband make attacks in any turn that they charged, add 1 to the Attacks characteristic of all melee weapons they use. If the Bloodbound Warband contained the maximum number of units at the start of the battle, then you can also re-roll failed wound rolls of 1 for units from this battalion in the combat phase of any turn in which the unit charged.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Red Headsmen`,
    effects: [
      {
        name: `Slay the Worthy`,
        desc: `At the start of your first hero phase, pick up to 3 HEROES and/ or MONSTERS in your opponent's army and declare them to be worthy foes. Your opponent can re-roll failed hit rolls for attacks made by those units. For each worthy foe they slay, the Red Headsmen add 1 to the Attacks characteristic of their melee weapons for the rest of the game. If the Red Headsmen contained the maximum number of units at the start of the battle, then you can pick up to 5 HEROES and/or MONSTERS to be worthy foes instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ritual Slaughter`,
        desc: `Red Headsmen always count as being within range of their Skullgrinder's Altar of Skulls ability. In addition, if the Skullgrinder slays a worthy foe (see "Slay the Worthy"), the range of his Altar of Skulls ability is doubled.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skulltake`,
    effects: [
      {
        name: `Reaping Strikes`,
        desc: `Skullreapers from a Skulltake within 12" of their Bloodstoker are in a frenzied fury. If the wound roll for a Skullreaper in a frenzied fury is 6 or higher, add 1 to the Damage characteristic of the weapon they are using. If the Skulltake contained the maximum number of units at the start of the battle, then this ability applies to all Skulltake units that are within 12" of the Bloodstoker.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Skullhungry`,
        desc: `The Skulltake's Khorgoraths make 8 attacks with their Claws and Fangs rather than 5, as long as their unit is within 6" of any of the battalion's Skullreapers.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dark Feast`,
    effects: [
      {
        name: `Feeding Frenzy`,
        desc: `As long as the SLAUGHTERPRIEST is alive, add 1 to the Attacks characteristics of any melee weapons used by a unit from this battalion whenever it is selected to attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood-goaded`,
        desc: `Units from this battalion within 12" of the Bloodstoker do not need to take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Brass Stampede`,
    effects: [
      {
        name: `Avalanche of Brass`,
        desc: `If the Brass Stampede contained the maximum number of units at the start of the battle, roll a dice for each enemy unit within 3" of any units from the Brass Stampede in each of your hero phases; on a roll of 2 or more, that unit suffers D3 mortal wounds as they are crushed beneath the Juggernaut herd's stamping hooves.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood-scent`,
        desc: `If any units in either army have been wiped out, the Brass Stampede add 3 to their charge rolls.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Obliterating Charge`,
        desc: `If a unit uses its Murderous Charge ability within 3" of another unit in the Brass Stampede, you do not need to roll a dice – it automatically inflicts D3 mortal wounds (or D6 if the Mighty Skullcrusher unit includes 6 or more models).`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `The Gorechosen`,
    effects: [
      {
        name: `Eternal Contest`,
        desc: `If a Gorechosen model is within 12" of at least two other models from the Gorechosen battalion, add 1 to its hit rolls.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mightiest of Champions`,
        desc: `Add 1 to the Attacks characteristic of all Gorechosen melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodbound Warhorde`,
    effects: [
      {
        name: `Khorne Cares Not From Whence The Blood Flows`,
        desc: `If any units are wiped out during the combat phase, you can add 1 to the Attacks characteristic of all melee weapons used by the Bloodbound Warhorde for the remainder of that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Blood God's Scorn`,
        desc: `Units from the Bloodbound Warhorde can attempt to unbind one spell (or one additional spell if they could already do so) in each enemy hero phase in the same manner as a wizard. If a Mighty Lord of Khorne or SLAUGHTERPRIEST from the Warhorde successfully unbinds a spell, you immediately earn one Blood Tithe point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Bloodlords`,
    effects: [
      {
        name: `Murderous Lieutenants`,
        desc: `Any BLOODLETTER HEROES from the Bloodlords that are within 3" of any enemy models at the start of your hero phase can immediately pile in and attack as if it were the combat phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Exalted Loci of Khorne`,
        desc: `If any units of Bloodletters and/or Bloodcrushers from the Bloodlords are within 8" of any of the battalion's BLOODLETTER HEROES at the start of your hero phase, they can immediately pile in and each model in the unit can make a single attack with one of their melee weapons.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Reapers of Vengeance`,
    effects: [
      {
        name: `Khorne's Vengeance Made Manifest`,
        desc: `After set-up, pick up to D3+1 enemy units (note that they need not be HEROES) from your opponent's army to receive Khorne's blood mark.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Khorne's Vengeance Made Manifest`,
        desc: `At the start of each of your hero phases, you can roll two dice for each unit from the Reapers of Vengeance that is not within 3" of any enemy models and move the unit being rolled for up to the total distance rolled in inches towards a unit with a blood mark (provided that they are on the battlefield).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Unstoppable Charge`,
        desc: `Units of Bloodcrushers from the Reapers of Vengeance inflict D3 mortal wounds as a result of their Murderous Charge ability on a roll of 2+ instead of 4+.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Blood Host of Khorne`,
    effects: [
      {
        name: `Cometh the Slaughter`,
        desc: `In each of your hero phases, pick D3 units from the Blood Host of Khorne that are within 3" of the enemy. All models in the units you pick can immediately pile in and attack with one of their melee weapons. Increase the number of units that can attack from D3 to D6 if there are sixteen or more units in the battalion at the start of the hero phase.`,
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
        name: `Blood Mark`,
        desc: `After set-up, pick an enemy HERO to receive Khorne's blood mark.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Blood Mark`,
        desc: `At the start of each of your hero phases, you can roll two dice for each unit from the Blood Hunt that is not within 3" of any enemy models and move the unit being rolled for up to the total distance rolled in inches towards the HERO with the blood mark (provided that they are on the battlefield).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Khorne's Hunters`,
        desc: `Add 1 to any wound rolls you make for models from a Blood Hunt when attacking an enemy HERO. If a Blood Hunt contained the maximum number of units at the start of the battle, then you can re-roll all failed wound rolls you make for models from the battalion when attacking an enemy HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Bloodthunder Stampede`,
    effects: [
      {
        name: `Avalanche of Brass`,
        desc: `If the Bloodthunder Stampede contained the maximum number of units at the start of the battle, roll a dice for each enemy unit within 3" of any units from the Bloodthunder Stampede in each of your hero phases; on a roll of 2 or more, that unit suffers D3 mortal wounds as they are crushed beneath the Juggernaut herd's stamping hooves.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood-scent`,
        desc: `If any units in either army have been wiped out, the Bloodthunder Stampede add 3 to their charge rolls.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Obliterating Charge`,
        desc: `If a unit uses its Murderous Charge ability within 3" of another unit in the Bloodthunder Stampede, you do not need to roll a dice – it automatically inflicts D3 mortal wounds (or D6 if the Bloodcrusher unit includes 6 or more models) as the enemy is trampled to a bloody pulp.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Charnel Host`,
    effects: [
      {
        name: `Daemon Commander`,
        desc: `You can use the Rejoice in the Slaughter command ability of the Charnel Host's Bloodthirster of Unfettered Fury in your hero phase, even if it is not your general.`,
        when: [HERO_PHASE],
      },
      {
        name: `Butchers of Khorne`,
        desc: `In each of your hero phases, you can pile in and attack with any units from a Charnel Host that are within 8" of their battalion's Bloodthirster of Unfettered Fury at the start of the phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gorethunder Cohort`,
    effects: [
      {
        name: `The Cannons of Khorne`,
        desc: `In each of your hero phases, D3 Skull Cannons from a Gorethunder Cohort that are within 8" of their battalion's Blood Throne can shoot as if were the shooting phase. If a Gorethunder Cohort contained the maximum number of units at the start of the battle, then all Skull Cannons that are within 8" of their battalion's Blood Throne can shoot as if were the shooting phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Murderhost`,
    effects: [
      {
        name: `Insatiable Bloodlust`,
        desc: `After set-up has been completed, roll two dice for the Murderhost's BLOODLETTER HERO and for each unit from this battalion that is within 8" of them, and move the unit(s) being rolled for up to the total distance rolled in inches. If the Murderhost contained the maximum number of units at the start of the battle, then you can repeat this process in each of your hero phases as well.`,
        when: [END_OF_SETUP, HERO_PHASE],
      },
    ],
  },
  {
    name: `Skullseeker Host`,
    effects: [
      {
        name: `Giant Killers`,
        desc: `If any units from a Skullseeker Host are within 3" of any enemy MONSTERS at the start of your hero phase, they can immediately pile in and each model in the unit can make a single attack against the MONSTER with one of their melee weapons.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Prey Upon the Wounded`,
        desc: `In each of your hero phases, you can make a shooting attack with any Skull Cannons from a Skullseeker Host that are within 8" of a KHORNE HERO from the same battalion. After resolving any attacks made in this manner, any other units in the same Skullseeker Host can immediately attempt to charge any units that suffered any unsaved wounds from these attacks, and can attack as described in Giant Killers if the unit they charge is a MONSTER.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
