import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Awakened Wyldwood`,
    effects: [
      {
        name: `Overgrown Wilderness`,
        desc: `Models are not visible to each other if an imaginary straight line 1mm wide drawn between the closest points of the two models crosses over more than 1" of an AWAKENED WYLDWOOD. This scenery rule does not apply if either model can fly.`,
        when: [DURING_GAME],
      },
      {
        name: `Roused by Magic`,
        desc: `In the hero phase, if a spell is successfully cast by a WIZARD wholly within 6" of an AWAKENED WYLDWOOD and not unbound, roll a D6 for each unit within 1" of that AWAKENED WYLDWOOD which does not have the SYLVANETH keyword. On a 5+ that unit suffers D3 mortal wounds after that spell's effects have been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wyldwood`,
        desc: `At the end of the charge phase, roll a D6 for each unit within 1" of an AWAKENED WYLDWOOD which does not have the SYLVANETH keyword. On a 6, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Alarielle The Everqueen`,
    effects: [
      {
        name: `Talon of the Dwindling`,
        desc: `If the unmodified hit roll for an attack made by the Talon of the Dwindling is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lifebloom`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to each friendly SYLVANETH unit wholly within 30" of this model (roll separately for each unit)`,
        when: [HERO_PHASE],
      },
      {
        name: `Sweeping Blows`,
        desc: `Add 1 to hit rolls for attacks made with this model's Great Antlers if the target unit contains 5 or more model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Living Battering Ram`,
        desc: `Roll a D6 for each enemy unit that is within 1" of this model after this model makes a charge move. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Soul Amphorae`,
        desc: `Once per battle, at the end of your movement phase, you can summon 1 of the following units to the battlefield:
 20 Dryads
 10 Tree-Revenants
 10 Spite-Revenants
 3 Kurnoth Hunters
 1 Branchwych
 1 Treelord
The summoned unit is added to your army, and must be set up wholly within 9" of this model and more than 9" from any enemy units`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Magic`,
        desc: `Alarielle the Everqueen is a WIZARD. She can attempt to cast three spells in your hero phase, and attempt to unbind three spells in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Metamorphosis spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Metamorphosis`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 16" of the caster that is visible to them and roll a number of dice equal to the casting roll. For each 4+ that unit suffers 1 mortal wound. In addition, if that unit is destroyed by the mortal wounds inflicted by this spell, you can set up 1 AWAKENED WYLDWOOD terrain feature wholly within 12" of the last model from that unit to be slain, and more than 1" from any other model, terrain feature or objective, and add it to your army.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Ghyran's Wrath`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, in that phase you can re-roll wound rolls of 1 for attacks made by friendly SYLVANETH units while they are wholly within 14" of a friendly model with this command ability.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Drycha Hamadreth`,
    effects: [
      {
        name: `Deadly Infestation`,
        desc: `If the unmodified hit roll for an attack made with a Colony of Flitterfuries or a Swarm of Squirmlings is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll)`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Mercurial Aspect`,
        desc: `At the start of the battle round, declare whether this model is Enraged or Embittered. The relevant ability below lasts until the end of that battle round:

Enraged:While this model is Enraged, its Colony of Flitterfuries has an Attacks characteristic of 20 instead of 10.

Embittered:While this model is Embittered, its Swarm of Squirmlings has an Attacks characteristic of 20 instead of 10.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Song of Spite`,
        desc: `You can re-roll wound rolls of 1 for attacks made by friendly SPITE-REVENANTS units while they are wholly within 16" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `Drycha Hamadreth is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Primal Terror spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Primal Terror`,
        desc: `Casting value of 6. If successfully cast, roll 2D6. Each enemy unit within 10" of the caster with a Bravery characteristic lower than this roll suffers D3 mortal wounds (roll separately for each unit)`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Spirit of Durthu`,
    effects: [
      {
        name: `Champion of the Everqueen's Will`,
        desc: `Add 1 to the Bravery characteristic of friendly SYLVANETH units while they are wholly within 12" of any friendly models with this ability.`,
        when: [DURING_GAME],
      },
      {
        name: `Groundshaking Stomp`,
        desc: `At the start of the combat phase, pick 1 enemy unit within 3" of this model and roll a D6. On a 4+ that unit fights at the end of that combat phase, after the players have picked any other units to fight.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impale`,
        desc: `If the unmodified hit roll for an attack made with Massive Impaling Talons is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll)`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Paths`,
        desc: `At the start of your movement phase, if this model is wholly within 6" of a friendly AWAKENED WYLDWOOD, it can walk the spirit paths instead of making a normal move in that movement phase. If it does so, remove this model from the battlefield and set it up wholly within 6" of a different friendly AWAKENED WYLDWOOD and more than 9" from any enemy units.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Wrathful Guardian`,
        desc: `Add 2 to the Attacks characteristic of this model's Guardian Sword while this model is wholly within 8" of any friendly AWAKENED WYLDWOODS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Treelord Ancient`,
    effects: [
      {
        name: `Groundshaking Stomp`,
        desc: `At the start of the combat phase, pick 1 enemy unit within 3" of this model and roll a D6. On a 4+ that unit fights at the end of that combat phase, after the players have picked any other units to fight.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impale`,
        desc: `If the unmodified hit roll for an attack made with Massive Impaling Talons is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll)`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Paths`,
        desc: `At the start of your movement phase, if this model is wholly within 6" of a friendly AWAKENED WYLDWOOD, it can walk the spirit paths instead of making a normal move in that movement phase. If it does so, remove this model from the battlefield and set it up wholly within 6" of a different friendly AWAKENED WYLDWOOD and more than 9" from any enemy units.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Silent Communion`,
        desc: `Once per battle, in your hero phase, you can pick 1 friendly model with this ability and set up 1 AWAKENED WYLDWOODwholly within 18" of that model and more than 1" from any other model, terrain feature or objective, and add it to your army.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Awakening the Wood spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Awakening the Wood`,
        desc: `Casting value of 6. If successfully cast, pick 1 friendly AWAKENED WYLDWOODthat is wholly within 30" of the caster. Each enemy unit within 3" of that AWAKENED WYLDWOODsuffers D3 mortal wounds (roll separately for each unit)`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Heed the Spirit-song`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly model with this command ability. Until your next hero phase, you can re-roll save rolls of 1 for attacks that target friendly SYLVANETH units wholly within 12" of that model.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Treelord`,
    effects: [
      {
        name: `Groundshaking Stomp`,
        desc: `At the start of the combat phase, pick 1 enemy unit within 3" of this model and roll a D6. On a 4+ that unit fights at the end of that combat phase, after the players have picked any other units to fight.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impale`,
        desc: `If the unmodified hit roll for an attack made with Massive Impaling Talons is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll)`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Paths`,
        desc: `At the start of your movement phase, if this model is wholly within 6" of a friendly AWAKENED WYLDWOOD, it can walk the spirit paths instead of making a normal move in that movement phase. If it does so, remove this model from the battlefield and set it up wholly within 6" of a different friendly AWAKENED WYLDWOOD and more than 9" from any enemy units.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Arch-Revenant`,
    effects: [
      {
        name: `Crescent Shield`,
        desc: `At the start of the combat phase, say whether this model is using their shield for protection or to steady their weapon. If they use their shield for protection, you can re-roll save rolls of 1 for attacks that target this model in that phase. If they use the shield to steady their weapon, you can re-roll hit rolls of 1 for attacks made with this model's Revenant's Glaive in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Champion of Kurnoth`,
        desc: `Re-roll hit rolls of 1 for attacks made by friendly KURNOTH HUNTERS units while they are wholly within 12" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Ultimate Sacrifice`,
        desc: `Once per battle, when you allocate a wound or mortal wound to this model, you can choose to negate it. If you do so, this model cannot fly or use its Zephyrspite's Tail Pincers attack for the rest of the battle.`,
        when: [DURING_GAME],
      },
      {
        name: `Call to Battle`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly SYLVANETH unit wholly within 9" of a friendly model with this command ability, or wholly within 12" of a friendly model with this command ability that is your general. Add 1 to the Attacks characteristic of that unit's melee weapons in that combat phase. You cannot pick the same unit to benefit from this command ability more than once per combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Branchwych`,
    effects: [
      {
        name: `Fury of the Forest`,
        desc: `Add 1 to hit rolls for attacks made by this model while it is wholly within 6" of any friendly AWAKENED WYLDWOODS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Quick-tempered`,
        desc: `Add 2 to the Attacks characteristic of this model's Greenwood Scythe whilst any wounds are allocated to this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Unleash Spites spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unleash Spites`,
        desc: `Casting value of 5. If successfully cast, roll a number of dice equal to the casting roll for each enemy unit within 9" of the caster. For each 6, that enemy unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Branchwraith`,
    effects: [
      {
        name: `Blessings of the Forest`,
        desc: `Subtract 1 from hit rolls for attacks that target this model while it is wholly within 6" of any friendly AWAKENED WYLDWOODS.`,
        when: [DURING_GAME],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Roused to Wrath spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Roused to Wrath`,
        desc: `Casting value of 7. If successfully cast, you can summon 1 unit of 10 DRYADS and add it to your army. The summoned unit must be set up more than 9" from any enemy units, and wholly within 1" of an AWAKENED WYLDWOOD that is within 12" of the caster. The summoned unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Ylthari`,
    effects: [
      {
        name: `Vigour and Wrath`,
        desc: `You can re-roll wound rolls of 1 for attacks made by this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `Ylthari is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and The Reaping spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Reaping`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 12" of the caster that is visible to them and roll 6 dice. For each 5+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Ylthari's Guardians`,
    effects: [
      {
        name: `Martial Memories`,
        desc: `Once per phase, you can re-roll 1 failed hit roll or 1 failed wound roll for an attack made by this unit, or 1 failed save roll for an attack that targets this unit. You cannot use this ability to re-roll more than once dice for this unit in the same phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Martial Memories`,
        desc: `Once per phase, you can re-roll 1 battleshock test for this unit. You cannot use this ability to re-roll more than once dice for this unit in the same phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Vigour and Wrath`,
        desc: `You can re-roll wound rolls of 1 for attacks made by this unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tree-Revenants`,
    effects: [
      {
        name: `Scion`,
        desc: `1 model in this unit can be a Scion. Add 2 to the Attacks characteristic of that model's Enchanted Blade. A Scion can be armed with a Protector Glaive instead of an Enchanted Blade.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Glade Banner Bearer`,
        desc: `Whenever a unit that includes any Glade Banner Bearers makes a pile-in move, you can move it up to 6" instead of up to 3".`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waypipes`,
        desc: `At the start of your movement phase, a unit that includes any Waypipes can walk the spirit paths instead of making a normal move. If it does so, remove this unit from the battlefield and set it up anywhere on the battlefield more than 9" from any enemy units.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Martial Memories`,
        desc: `Once per phase, you can re-roll 1 failed hit roll or 1 failed wound roll for an attack made by this unit, or 1 failed save roll for an attack that targets this unit. You cannot use this ability to re-roll more than once dice for this unit in the same phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Martial Memories`,
        desc: `Once per phase, you can re-roll 1 battleshock test for this unit. You cannot use this ability to re-roll more than once dice for this unit in the same phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Spite-Revenants`,
    effects: [
      {
        name: `Shadestalker`,
        desc: `1 model in this unit can be a Shadestalker. Add 1 to the Attacks characteristic of that model's Cruel Talons and Fangs.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unbridled Malice`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any friendly units with this ability. In addition, re-roll successful battleshock tests for enemy units while they are within 3" of any friendly units with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Kurnoth Hunters`,
    effects: [
      {
        name: `Huntmaster`,
        desc: `1 model in this unit can be a Huntmaster. Add 1 to hit rolls for attacks made by that model.`,
        when: [DURING_GAME],
      },
      {
        name: `Envoys of the Everqueen`,
        desc: `If a friendly SYLVANETH HERO uses a command ability, friendly SYLVANETH units wholly within 12" of this unit are treated as being in range of that command ability.`,
        when: [DURING_GAME],
      },
      {
        name: `Tanglethorn Thicket`,
        desc: `At the start of the charge phase, you can say that this unit will sprout thorned branches. If you do so, until the end of the turn, this unit cannot move except to pile in up to 1", but you can re-roll save rolls for attacks that target this unit.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Trample Underfoot`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Sundering Strikes (Greatswords)`,
        desc: `If the unmodified wound roll for an attack made with a Kurnoth Greatsword is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dryads`,
    effects: [
      {
        name: `Branch Nymph`,
        desc: `1 model in this unit can be a Branch Nymph. Add 1 to the Attacks characteristic of that model's Wracking Talons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blessings of the Forest`,
        desc: `Subtract 1 from hit rolls for attacks that target this unit if it is wholly within 6" of any friendly AWAKENED WYLDWOODS.`,
        when: [DURING_GAME],
      },
      {
        name: `Enrapturing Song`,
        desc: `At the start of your combat phase, pick 1 enemy unit within 3" of this unit. Add 1 to hit rolls for attacks made by this unit that target that enemy unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impenetrable Thicket`,
        desc: `Add 1 to save rolls for attacks that target this unit while it contains 10 or more models.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Skaeth's Wild Hunt`,
    effects: [
      {
        name: `Fleet of Foot`,
        desc: `This unit can run and still shoot and/or charge later in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Karthaen`,
        desc: `While Karthaen is still in the unit, this unit is considered a Wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Might of Kurnoth`,
        desc: `Casting value 7. Pick 1 friendly Sylvaneth unit within 12" of the caster that is visible to them. Add 1 to wound rolls for attacks made with melee weapons until the start of your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
        spell: true,
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Wargrove`,
    effects: [
      {
        name: `Mighty Wyldwood`,
        desc: `When you choose a Sylvaneth army, you can include 2 AWAKENED WYLDWOOD terrain features instead of 1 if your army includes this battalion.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Free Spirits`,
    effects: [
      {
        name: `Swift Vengeance`,
        desc: `In your movement phase, if you declare a unit from this battalion will run, do not make a run roll. Instead, add 6" to the Move characteristic of that unit for that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lords of the Clan`,
    effects: [
      {
        name: `Deadly Chorus`,
        desc: `In your shooting phase, roll a D6 for each enemy unit that is within 6" of 2 or more models from this battalion. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Household`,
    effects: [
      {
        name: `Discipline of the Ages`,
        desc: `Enemy units within 3" of any units from this battalion cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Forest Folk`,
    effects: [
      {
        name: `Swift as the Breeze`,
        desc: `Units from this battalion can retreat and still charge later in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Outcasts`,
    effects: [
      {
        name: `Feat the Forest-kin`,
        desc: `If an enemy unit fails a battleshock test within 3" of any units from this battalion, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]
