import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  DURING_TURN,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import { getNighthauntUnits } from 'army/nighthaunt/units'

// Unit Names
export const Units: TUnits = [
  ...getNighthauntUnits(),

  {
    name: `Nagash, Supreme Lord of the Undead`,
    effects: [
      {
        name: `The Staff of Power`,
        desc: `Add Alakanash's modifier (listed in the damage table) to casting and unbinding rolls for Nagash.`,
        when: [HERO_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Spirits' Spectral Claws and Daggers, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Morikhane`,
        desc: `Each time a mortal wound is allocated to Nagash, roll a D6. On a 4+ the mortal wound is negated. On a 6+ the attacking unit also suffers a mortal wound.`,
        when: [DURING_GAME],
      },
      {
        name: `The Nine Books of Nagash`,
        desc: `The Nine Books of Nagash allow him to cast extra spells in your hero phase, and unbind extra spells in the enemy hero phase. The number of extra spells he can attempt to cast or unbind is shown on the damage table.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 5 different friendly SUMMONABLE units on the battlefield. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Death Magic Incarnate`,
        desc: `You can re-roll any of the D3 rolls when using Nagash's Deathly Invocation ability.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Nagash is a WIZARD. He can attempt to cast three spells in your hero phase, and attempt to unbind three spells in the enemy hero phase. In addition, he can attempt to cast or unbind extra spells with the Nine Books of Nagash. He knows the Arcane Bolt, Mystic Shield, Hand of Dust and Soul Stealer spells, as well as any spells known by other DEATH WIZARDS on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hand of Dust`,
        desc: `Casting value of 8. If successfully cast, pick an enemy model within 3" the caster. Then, take a dice and hide it in one of your hands. Your opponent must pick one of your hands. If they pick the one holding the dice, the spell has no effect. If they pick the empty hand, the enemy model is slain.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Soul Stealer`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 24" of the caster that is visible to them and roll two dice. If the total is greater than that unit's Bravery characteristic, it suffers D3 mortal wounds. If the total is at least double the unit's Bravery, it suffers D6 mortal wounds instead. For each mortal wound inflicted on the target, heal 1 wound that has been allocated to the caster.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Supreme Lord of Death`,
        desc: `If Nagash uses this ability, then until your next hero phase you can re-roll hit and save rolls of 1 for all friendly DEATH units. In addition, do not take battleshock tests for DEATH units affected by this ability.`,
        when: [HERO_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Arkhan the Black, Mortarch of Sacrament`,
    effects: [
      {
        name: `Feaster of Souls`,
        desc: `At the end of any combat phase in which Arkhan slew any models, you can heal 2 wounds that have been allocated to him.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `The Staff of Spirits`,
        desc: `Add Khenash-an's modifier to casting and unbinding rolls for Arkhan.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 4 different friendly SUMMONABLE units within 18" of Arkhan. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Mortarch of Sacrament`,
        desc: `You can re-roll any of the D3 rolls when using Arkhan's Deathly Invocation ability.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `Each time you roll a hit roll of 6+ for the Spirits' Spectral Claws and Daggers, that attack inflicts 1 mortal wound instead of the.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `Arkhan the Black is a WIZARD. He can attempt to cast two spells in your hero phase, and attempt to unbind two spells in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Curse of Years spells. Arkhan also knows the spells of any DEATH WIZARD that is within 18" of him.`,
        when: [HERO_PHASE],
      },
      {
        name: `Curse of Years`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them and roll ten dice. For each roll of 6, that unit suffers a mortal wound and you can roll an extra dice. For each roll of 5+ on these extra dice, the target suffers another mortal wound and you can roll another dice. Now, for each roll of 4+, the target suffers another mortal wound and you can roll another dice. Keep rolling dice in this way, inflicting mortal wounds and reducing the roll needed to cause them by 1 each time, until either no wounds are inflicted or the target unit is destroyed.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `First of the Mortarchs`,
        desc: `If Arkhan the Black uses this ability, then until the end of the hero phase all friendly DEATH WIZARDS within 18" of him can increase the range of their spells by 6".`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Mannfred, Mortarch of Night`,
    effects: [
      {
        name: `Feaster of Souls`,
        desc: `At the end of any combat phase in which Mannfred slew any models, you can heal 2 wounds that have been allocated to him.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Armour of Templehof`,
        desc: `The first wound or mortal wound allocated to Mannfred each turn is negated.`,
        when: [DURING_TURN],
      },
      {
        name: `Sword of Unholy Power`,
        desc: `If Mannfred causes any wounds to be allocated using Gheistvor in the combat phase, you can add 1 to the next casting or unbinding roll you make for Mannfred.`,
        when: [COMBAT_PHASE, HERO_PHASE],
      },
      {
        name: `Mortarch of Night`,
        desc: `If Mannfred successfully cast any spells during your hero phase, you can add 1 to all hit and wound rolls for Gheistvor until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `Each time you roll a hit roll of 6+ for the Spirits' Spectral Claws and Daggers, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 4 different friendly SUMMONABLE units within 18" of Mannfred. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Mannfred is a WIZARD. He can attempt to cast two spells in your hero phase, and attempt to unbind two spells in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Wind of Death spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wind of Death`,
        desc: `Casting value of 7. If successfully cast, pick an enemy model within 18" of the caster that is visible to them. Each enemy unit within 6" of that model suffers 1 mortal wound, while the model's own unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Vigour of Undeath`,
        desc: `If Mannfred uses this ability, then until your next hero phase you can re-roll hit and wound rolls of 1 for friendly DEATH units that are within the range shown on the damage table.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Neferata, Mortarch of Blood`,
    effects: [
      {
        name: `Dagger of Jet`,
        desc: `If a model is allocated any wounds from attacks made using Akmet-har but is not slain, roll a D6 after Neferata has finished making all of her attacks. On a 6+ that model is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mortarch of Blood`,
        desc: `At the end of any combat phase in which Neferata slew any models, you can heal 2 wounds that have been allocated to her. If Neferata slew any enemy HERO models this turn, you may heal 1 additional wound allocated to her.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Spirits' Spectral Claws and Daggers, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 4 different friendly SUMMONABLE units within 18" of Neferata. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Neferata is a WIZARD. She can attempt to cast two spells in your hero phase, and attempt to unbind two spells in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Dark Mist spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dark Mist`,
        desc: `Casting value of 6. If successfully cast, pick a friendly DEATH unit within 18" of the caster. Until your next hero phase, that unit can fly and you must ignore modifiers (positive or negative) when making save rolls for the unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Twilights Allure`,
        desc: `If Neferata uses this ability, then until your next hero phase subtract 1 from hit rolls for enemy units that are within the range shown on the damage table.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Prince Vhordrai`,
    effects: [
      {
        name: `The Hunger`,
        desc: `At the end of any combat phase in which Prince Vhordrai slew any enemy models, you can heal 1 wound that has been allocated to him.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Chalice of Blood`,
        desc: `Once per battle, in your hero phase, you can heal D6 wounds that have been allocated to Prince Vhordrai.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodlance Charge`,
        desc: `If Prince Vhordrai completed a charge this turn, increase the Damage characteristic of his Bloodlance to 3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Breath of Shyish`,
        desc: `At the start of your shooting phase, pick an enemy unit within 8" of this model that is visible to it. Then roll a D6, adding 1 to the result if this model slew any enemy models in the previous combat phase. On a 3+ that unit suffers a number of mortal wounds as shown on the damage table above.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 3 different friendly SUMMONABLE units within 12" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Prince Vhordrai is a WIZARD. He can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Quickblood spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Quickblood`,
        desc: `Casting value of 7. If successfully cast, add 1 to hit and wound rolls for the caster until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Fist of Nagash`,
        desc: `If Prince Vhordrai uses this ability, pick a friendly DEATH HERO within 14" of him (you cannot choose Prince Vhordrai). That hero can immediately either be chosen to pile in and attack as if it were the combat phase, or if it is a WIZARD, attempt to cast a spell in addition to any others they can attempt to cast this phase. The same unit cannot be picked to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Morghast Harbingers`,
    effects: [
      {
        name: `Heralds of the Accursed One`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units whilst they are within 6" of any MORGHASTS.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Harbingers of Death`,
        desc: `When making a charge roll for this unit, you may roll 3 dice instead of 2. In addition, you can declare a charge for this unit if it is within 18" of the enemy rather than 12".`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Morghast Archai`,
    effects: [
      {
        name: `Heralds of the Accursed One`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units whilst they are within 6" of any MORGHASTS.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Ebon-wrought Armour`,
        desc: `Each time you allocate a mortal wound to this unit, roll a D6. On a 5+ the mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Vampire Lord on Zombie Dragon`,
    effects: [
      {
        name: `Pestilential Breath`,
        desc: `Roll a D6 when you attack with the Zombie Dragon's Pestilential Breath. If the result is equal to or less than the number of models in the target unit, the attack scores a hit without needing to make a hit roll.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `The Hunger`,
        desc: `At the end of any combat phase in which this model slew any enemy models, you can heal 1 wound that has been allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Deathlance Charge`,
        desc: `If this model completed a charge this turn, increase the Damage characteristic of its Deathlance to 3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ancient Shield`,
        desc: `A model with an Ancient Shield has a Save characteristic of 3+.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Chalice of Blood`,
        desc: `If this model has a Chalice of Blood, then once per battle in your hero phase, you can heal D6 wounds that have been allocated to it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 3 different friendly SUMMONABLE units within 12" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `A Vampire Lord on Zombie Dragon is a WIZARD. He can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Blood Boil spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood Boil`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. That unit suffers a mortal wound. If a model was allocated any wounds caused by this spell but was not slain, roll another dice. On a 4+ that model suffers another mortal wound. If the model is still not slain, roll another dice. It will suffer another mortal wound on a 4+. Keep rolling dice in this way until either the model is slain or you fail to cause a mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Dread Knight`,
        desc: `If this model uses this ability, pick a friendly DEATH unit within 15" of it. Until your next hero phase, you can re-roll failed hit rolls for that unit.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Blood Knights`,
    effects: [
      {
        name: `Kastellan`,
        desc: `The leader of this unit is a Kastellan. Add 1 to the Attacks characteristic of a Kastellan's Templar Lance or Blade.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. Subtract 1 from the Bravery characteristic of enemy units whilst they are within 6" of any DEATH Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Models in this unit may be Hornblowers. A unit that includes any Hornblowers can always move up to 6" when it charges, unless its charge roll is higher.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `The Hunger`,
        desc: `At the end of any combat phase in which this unit slew any models, you can heal 1 wound that has been allocated to it.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Martial Fury`,
        desc: `If this unit completed a charge this turn, increase the Damage characteristic of its Templar Lances or Blades to D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodshields`,
        desc: `Add 1 to the save rolls for a unit carrying Bloodshields against attacks that have a Rend characteristic of '-'.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Vargheists`,
    effects: [
      {
        name: `Vargoyle`,
        desc: `The leader of this unit is a Vargoyle. Add 1 to the Attacks characteristic of a Vargoyle's Murderous Fangs and Talons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood-Maddened Feeding Frenzy`,
        desc: `Each time a model from this unit slays an enemy model, roll a D6. On a 6+ it can immediately make one additional attack against the same unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bat Swarms`,
    effects: [
      {
        name: `Cloud of Horror`,
        desc: `Subtract 1 from hit rolls for enemy units that are within 12" of any Bat Swarms in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Blood Suckers`,
        desc: `At the end of any combat phase in which this unit caused any wounds to be allocated to any enemy models, you can heal all wounds that have been allocated to this unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fell Bats`,
    effects: [
      {
        name: `Scent of Gore`,
        desc: `If an enemy model is slain within 6" of this unit, increase the Attacks characteristic of this unit's Elongated Fangs to 6 for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Vampire Lord`,
    effects: [
      {
        name: `Nightmare`,
        desc: `Some Vampire Lords are mounted on a Nightmare steed; these have a Move of 10" rather than 5", and can attack with the Nightmare's Hooves and Teeth.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
      {
        name: `Flying Horror`,
        desc: `Some Vampire Lords have membranous wings; these have a Move of 10" and can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `The Hunger`,
        desc: `At the end of any combat phase in which this model slew any enemy models, you can heal 1 wound that has been allocated to it.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Chalice of Blood`,
        desc: `If this model has a Chalice of Blood, then once per battle in your hero phase, you can heal D6 wounds that have been allocated to it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 3 different friendly SUMMONABLE units within 12" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `A Vampire Lord is a WIZARD. They can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. They know the Arcane Bolt and Mystic Shield spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood Feast`,
        desc: `If this model uses this ability, pick a friendly DEATH unit within 15" of it. Models in that unit make one extra attack with each of their melee weapons until your next hero phase. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bloodseeker Palanquin`,
    effects: [
      {
        name: `Fightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Spectral Host's Ethereal Weapons, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `A Fine Vintage`,
        desc: `If an enemy HERO is slain within 9" of this model, add 1 to the Attacks characteristic of any melee weapons used by friendly SOULBLIGHT units within 12" of this model until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wail of the Damned`,
        desc: `When making a Wail of the Damned attack, roll two dice for each enemy unit within the range shown on the damage table. If the total is higher than that unit's Bravery, it suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 2 different friendly SUMMONABLE units within 6" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `The Sanguinarch on a Bloodseeker Palanquin is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Blood Siphon spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood Siphon`,
        desc: `Casting value of 6. If successfully cast, pick an enemy HERO within 12" of the caster that is visible to them and roll a D6. On a 1-3 the hero suffers a mortal wound. On a 4-5 the hero suffers D3 mortal wounds. On a 6 the hero suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Coven Throne`,
    effects: [
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Spectral Host's Ethereal Weapons, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scrying Pool`,
        desc: `Once per game, you can re-roll a single dice roll of your choice for this model.`,
        when: [DURING_GAME],
      },
      {
        name: `The Hunger`,
        desc: `At the end of any combat phase in which this model slew any enemy models, you can heal 1 wound that has been allocated to it. If this model slew any enemy HERO models this turn, you may heal 1 additional wound allocated to it.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 3 different friendly SUMMONABLE units within 12" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `The Vampire Queen on a Coven Throne is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Beguile spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Beguile`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them and roll three dice. If the total is higher than that unit's Bravery, then until your next hero phase the caster cannot be selected as the target of any attacks made by that unit or spells cast by that unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Tactical Insight`,
        desc: `If this model uses this ability, pick a friendly DEATH unit within 12" of it. You can re-roll hit, wound and save rolls of 1 for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Mortis Engine`,
    effects: [
      {
        name: `Wail of the Damned`,
        desc: `When making a Wail of the Damned attack, roll two dice for each enemy unit within the range shown on the damage table. If the total is higher than that unit's Bravery, it suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Spectral Host's Ethereal Weapons, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Reliquary`,
        desc: `Once per battle, in your hero phase, you can declare that the Corpsemaster will unleash the energies stored in the reliquary. When you do so, roll four dice and add the scores together to determine the range of this ability. Each unit within range is struck by a wave of necromantic force. DEATH units that are struck heal D3 wounds that have been allocated to them, while any other unit struck suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bound Necromancer`,
        desc: `Add 1 to casting rolls for DEATH WIZARDS within 12" of any Mortis Engines. Subtract 1 from casting rolls for ORDER, DESTRUCTION and CHAOS WIZARDS within 12" of any Mortis Engines.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Necromancer`,
    effects: [
      {
        name: `Undead Minions`,
        desc: `Before you allocate a wound or mortal wound to this model, you can pick a friendly Summonable unit within 3" of this model and roll a D6. On a 4+ the wound or mortal wound is allocated to that unit instead.`,
        when: [DURING_GAME],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 2 different friendly SUMMONABLE units within 6" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `A Necromancer is a WIZARD. He can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Vanhel's Danse Macabre spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vanhel's Dance Macabre`,
        desc: `Casting value of 6. If successfully cast, pick a friendly SUMMONABLE unit within 18" of the caster. That unit can be chosen to pile in and attack twice in your next combat phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Zombies`,
    effects: [
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. Subtract 1 from the Bravery characteristic of enemy units whilst they are within 6" of any DEATH Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Noise Maker`,
        desc: `Models in this unit may be Noise Makers. A unit that includes any Noise Makers can always move up to 6" when it charges, unless its charge roll is higher.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Dragged Down and Torn Apart`,
        desc: `You can add 1 to hit and wound rolls for a unit of Zombies if it has 20 or more models, or 2 if it has 40 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Newly Dead`,
        desc: `At the end of the combat phase, roll a D6 for each model slain by this unit. For each roll of a 6, add a Zombie to this unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Vigour Mortis`,
        desc: `You can add 1 to hit rolls for this unit whilst it is within 9" of any friendly CORPSE CARTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Corpse Cart w/ Unholy Lodestone`,
    effects: [
      {
        name: `Unholy Lodestone`,
        desc: `Add 1 to casting rolls for friendly DEATH WIZARDS within 18" of any Corpse Carts with an Unholy Lodestone.`,
        when: [HERO_PHASE],
      },
      {
        name: `Locus of Undeath`,
        desc: `Whilst it is within 6" of this model, you can re-roll the dice to determine how many wounds are healed on a friendly DEATH unit picked as a target of a Deathly Invocation ability.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Crypt Sword`,
        desc: `Instead of attacking with his Goad or Lash in the combat phase, you may declare that a Corpsemaster with a Cryptsword will attempt to impale his victim's soul. If he does so, pick an enemy unit within 1" and roll a D6. On a 5+ the unit you picked suffers a mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Corpse Cart w/ Balefire Brazier`,
    effects: [
      {
        name: `Balefire Brazier`,
        desc: `Subtract 1 from casting rolls for enemy WIZARDS that are within 18" of any Corpse Carts with Balefire Braziers.`,
        when: [HERO_PHASE],
      },
      {
        name: `Malefic Fumes`,
        desc: `At the start of your hero phase, roll a D6 for each enemy WIZARD within 6" any Corpse Carts with a Balefire Brazier. On a 4+ that unit suffers a mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Crypt Sword`,
        desc: `Instead of attacking with his Goad or Lash in the combat phase, you may declare that a Corpsemaster with a Cryptsword will attempt to impale his victim's soul. If he does so, pick an enemy unit within 1" and roll a D6. On a 5+ the unit you picked suffers a mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Terrorgheist`,
    effects: [
      {
        name: `Death Shriek`,
        desc: `Do not use the attack sequence for an attack made with this model's Death Shriek. Instead roll a D6 and add the Death Shriek value shown on this model's damage table. If the total is higher than the target unit's Bravery characteristic, the target unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the total.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Gaping Maw`,
        desc: `If the unmodified hit roll for an attack made with this model's Fanged Maw is 6, that attack inflicts 6 mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll)`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infested`,
        desc: `If this model is slain, before this model is removed from play each unit within 3" of this model suffers D3 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Zombie Dragon`,
    effects: [
      {
        name: `Pestilential Breath`,
        desc: `Roll a D6 when you attack with the Zombie Dragon's Pestilential Breath. If the roll is equal to or less than the number of models in the target unit, the attack scores a hit without needing to make a hit roll.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Wight King with Baleful Tomb Blade`,
    effects: [
      {
        name: `Skeletal Steed`,
        desc: `Some Wight Kings are mounted on Skeletal Steeds. They have a Move of 12" rather than 4" and can attack with the steed's Hooves and Teeth.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
      {
        name: `Beheading Strike`,
        desc: `If the wound roll for an attack made with a Baleful Tomb Blade is 6+, that attack has a Damage characteristic of D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 2 different friendly SUMMONABLE units within 6" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Lord of Bones`,
        desc: `If this model uses this ability, pick a friendly DEATHRATTLE unit within 18" of it. Until your next hero phase, add 1 to the Attacks characteristic of that unit's melee weapons. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Wight King with Black Axe`,
    effects: [
      {
        name: `Black Axe`,
        desc: `If a model is allocated any wounds from attacks made using the Black Axe but is not slain, roll a D6 after the Wight King has finished making all of its attacks. On a 6+ that model is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Barrow Armour`,
        desc: `Halve the number of wounds allocated to this model from each attack, rounding up (the remainder are negated).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `At the start of your hero phase, pick up to 2 different friendly SUMMONABLE units within 6" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Lord of Bones`,
        desc: `If this model uses this ability, pick a friendly DEATHRATTLE unit within 18" of it. Until your next hero phase, add 1 to the Attacks characteristic of that unit's melee weapons. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Black Knights`,
    effects: [
      {
        name: `Hell Knight`,
        desc: `The leader of this unit is a Hell Knight. Add 1 to the Attacks characteristic of a Hell Knight's Barrow Lance.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. Subtract 1 from the Bravery characteristic of enemy units that are within 6" of any DEATH Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Models in this unit may be Hornblowers. A unit that includes any Hornblowers can always move up to 6" when it charges, unless its charge roll is higher.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Deathly Charge`,
        desc: `If this unit completed a charge this turn, add 1 to its wound rolls and add 1 to the Damage characteristic of its Barrow Lances.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crypt Shields`,
        desc: `You can add 1 to save rolls for this unit against attacks that have a Rend of '-'.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grave Guard`,
    effects: [
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. Subtract 1 from the Bravery characteristic of enemy units whilst they are within 6" of any DEATH Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Seneschal`,
        desc: `The leader of this unit is a Seneschal. Add 1 to the Attacks characteristic of a Seneschal's Wight Blade or Great Wight Blade.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Models in this unit may be Hornblowers. A unit that includes any Hornblowers can always move up to 6" when it charges, unless its charge roll is higher.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Cursed Weapons`,
        desc: `If the wound roll for an attack made with a Wight Blade or Great Wight Blade is 6+, double the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crypt Shields`,
        desc: `Add 1 to save rolls for a unit carrying Crypt Shields against attacks that have a Rend characteristic of '-'.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skeleton Warriors`,
    effects: [
      {
        name: `Skeleton Champion`,
        desc: `The leader of this unit is a Skeleton Champion. Add 1 to the Attacks characteristic of a Skeleton Champion's Ancient Blade or Ancient Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. Subtract 1 from the Bravery characteristic of enemy units whilst they are within 6" of any DEATH Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Models in this unit may be Hornblowers. A unit that includes any Hornblowers can always move up to 6" when it charges, unless its charge roll is higher.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Serve in Death`,
        desc: `Add 1 to hit rolls for Skeleton Warriors units that are within 18" of any friendly DEATH HEROES.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Skeleton Legion`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if it has 20 or more models. Add 2 instead if it has 30 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crypt Shields`,
        desc: `Add 1 to save rolls for a unit carrying Crypt Shields against attacks that have a Rend characteristic of '-'.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Sepulchral Guard`,
    effects: [
      {
        name: `The Sepulchral Warden`,
        desc: `You can return D3 slain models to this unit if the Sepulchral Warden is on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Crypt Shields`,
        desc: `If any models in this unit are carrying Crypt Shields, add 1 to save rolls against attacks with a rend characteristic of '-'.`,
        when: [DURING_GAME],
      },
      {
        name: `Serve in Death`,
        desc: `You can add 1 to hit rolls for this unit if it is wholly within 18" of any friendly Death heroes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frightening Speed`,
        desc: `You can re-roll charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Legion Black Coach`,
    effects: [
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Cairn Wraith's Reaper Scythe, that attack inflicts 2 mortal wounds instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaped Like Corn`,
        desc: `If the target unit has 5 or more models, you can re-roll failed hit rolls for the Cairn Wraith's Reaper Scythe.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Evocation of Death`,
        desc: `In your hero phase, roll a D6 for each friendly DEATH WIZARD within 12" of this model. For each roll of 6, the Black Coach gains a level of power for the rest of the battle; these are cumulative and grant the following abilities:`,
        when: [HERO_PHASE],
      },
      {
        name: `Evocation of Death: First Level, Gleaming Scythes`,
        desc: `After this model completes a charge, pick an enemy unit within 1" of this model. That unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Evocation of Death: Second Level, Unholy Vigour`,
        desc: `This model has a Move characteristic of 14" instead of 10".`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Evocation of Death: Third Level, Witch-fire`,
        desc: `Add 1 to hit rolls for this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Evocation of Death: Fourth Level, Howling Winds`,
        desc: `This model can Fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Evocation of Death: Fifth Level, Nimbus of Darkness`,
        desc: `This model can attempt to unbind one spell in the enemy hero phase as if it were a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Dire Wolves`,
    effects: [
      {
        name: `Doom Wolf`,
        desc: `The leader of this unit is a Doom Wolf. Add 1 to the Attacks characteristic of a Doom Wolf's Rotting Fangs and Claws.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Slavering Charge`,
        desc: `Add 1 to wound rolls for this unit if it completed a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Vigour Necris`,
        desc: `Add 1 to save rolls for this unit if it is within 9" of any friendly CORPSE CARTS.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `The First Cohort`,
    effects: [
      {
        name: `Ceaseless Vigil`,
        desc: `Before you allocate a wound or mortal wound to Nagash, you can pick a friendly Morghast unit from this battalion within 3" of Nagash and roll a D6. On a 3+ the wound or mortal wound is allocated to that unit instead.`,
        when: [DURING_GAME],
      },
      {
        name: `Eternal Servitude`,
        desc: `If Nagash uses his Deathly Invocation ability on any SUMMONABLE unit from the First Cohort, you can treat the D3 result as 3 instead of rolling the dice.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Lords of Sacrament`,
    effects: [
      {
        name: `Unearthly Focus`,
        desc: `In your hero phase, each WIZARD from the Lords of Sacrament may cast an additional spell whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swirling Spirits`,
        desc: `In the shooting phase, add 1 to save rolls for units from the Lords of Sacrament whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Deathmarch`,
    effects: [
      {
        name: `Unbreaking Ranks`,
        desc: `At the start of your hero phase, you can return 1 slain model to each Deathmarch unit that is within 9" of the battalion's WIGHT KING.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `March of the Dead`,
        desc: `At the start of your hero phase, each unit from this battalion wholly within 12" of the battalion's Wight King and more than 3" from any enemy units can move 4". The units cannot run, or move within 3" of an enemy unit, and the distance to the Wight King must be measured before any of the moves are made.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Castellans of the Crimson Keep`,
    effects: [
      {
        name: `The Shifting Keep`,
        desc: `At the start of the game, after territories have been determined, but before any units have been set up, pick a battlefield edge. Instead of setting up this battalion, you may place it to one side and say that it is set up in the Crimson Keep. At the end of any of your movement phases you may set up any units from this battalion wholly within 6" of the chosen battlefield edge and more than 9" from enemy models.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `In the Shadow of the Keep`,
        desc: `Whilst they are within 15" of the battlefield edge picked as described in the Shifting Keep ability above, you can re-roll failed hit rolls for the Templar Lances or Blades used by units of Blood Knights in this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Court of Nulahmia`,
    effects: [
      {
        name: `The Adevore`,
        desc: `Whilst she is within 9" of this battalion's Bloodseeker Palanquin, you may re-roll failed hit rolls for Neferata if the target is an enemy HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scent of Blood`,
        desc: `At the start of your movement phase, units from the Court of Nulahmia that are within 9" of the battalion's Bloodseeker Palanquin may add 4" to their Move characteristic until the end of the phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Nightfall Pack`,
    effects: [
      {
        name: `Swooping Predators`,
        desc: `On any turn in which they completed a successful charge move, add 1 to the Attacks characteristic of the Murderous Fangs and Talons of this battalion's Vargheists.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Call of the Night`,
        desc: `If Mannfred uses his Deathly Invocation ability on any Skeleton Warriors unit from the Nightfall Pack, you may re-roll the D3 result for that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]
