import { keyPicker, tagAs } from 'factions/metatagger'
import GenericBattleTraits from 'generic_rules/battle_traits'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_TURN,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import spells from './spells'

const getDeathlyInvocation = (numUnits: number) => ({
  name: `Deathly Invocation`,
  desc: `At the start of your hero phase, pick up to ${numUnits} different friendly SUMMONABLE units within ${
    numUnits === 4 ? 18 : numUnits === 3 ? 12 : 6
  }" of this model. You can heal D3 wounds that have been allocated to each unit you picked (roll separately for each unit). If no wounds are currently allocated to a unit you have picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
  when: [START_OF_HERO_PHASE],
})
const ChaliceOfBloodEffect = {
  name: `Chalice of Blood`,
  desc: `If this model has a Chalice of Blood, then once per battle in your hero phase, you can heal D6 wounds that have been allocated to it.`,
  when: [HERO_PHASE],
}
const TheHungerEffect = {
  name: `The Hunger`,
  desc: `At the end of any combat phase in which this model slew any enemy models, you can heal 1 wound that has been allocated to this model.`,
  when: [END_OF_COMBAT_PHASE],
}
const FeasterOfSoulsEffect = {
  name: `Feaster of Souls`,
  desc: `At the end of any combat phase in which this unit slew any models, you can heal 2 wounds that have been allocated to him.`,
  when: [END_OF_COMBAT_PHASE],
}
const HeraldsOfTheAccursedOneEffect = {
  name: `Heralds of the Accursed One`,
  desc: `Subtract 1 from the Bravery characteristic of enemy units whilst they are within 6" of any MORGHASTS.`,
  when: [BATTLESHOCK_PHASE],
}
const StandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `Models in this unit may be Standard Bearers. Subtract 1 from the Bravery characteristic of enemy units that are within 6" of any DEATH Standard Bearers.`,
  when: [BATTLESHOCK_PHASE],
}
const HornblowerEffect = {
  name: `Hornblower`,
  desc: `Models in this unit may be Hornblowers. A unit that includes any Hornblowers can always move up to 6" when it charges, unless its charge roll is higher.`,
  when: [CHARGE_PHASE],
}
const WailOfTheDamnedEffect = {
  name: `Wail of the Damned`,
  desc: `When making a Wail of the Damned attack, roll two dice for each enemy unit within the range shown on the damage table. If the total is higher than that unit's Bravery, it suffers D3 mortal wounds.`,
  when: [SHOOTING_PHASE],
}
const CryptSwordEffect = {
  name: `Crypt Sword`,
  desc: `Instead of attacking with his Goad or Lash in the combat phase, you may declare that a Corpsemaster with a Cryptsword will attempt to impale his victim's soul. If he does so, pick an enemy unit within 1" and roll a D6. On a 5+ the unit you picked suffers a mortal wound.`,
  when: [COMBAT_PHASE],
}
const CryptShieldsEffect = {
  name: `Crypt Shields`,
  desc: `Add 1 to save rolls for a unit carrying Crypt Shields against attacks that have a Rend characteristic of '-'.`,
  when: [SAVES_PHASE],
}

const Units = {
  'Nagash, Supreme Lord of the Undead': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Supreme Lord of Death'])],
      spells: [keyPicker(spells, ['Hand of Dust', 'Soul Stealer'])],
    },
    effects: [
      {
        name: `The Staff of Power`,
        desc: `Add Alakanash's modifier (listed in the damage table) to casting, dispelling, and unbinding rolls for Nagash. In addition, Nagash can attempt to cast Arcane Bolt and Mystic Shield any number of times in the same Hero Phase, even if another Wizard has already attempted to cast the spell in that phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `Each time you make an unmodified hit roll of 6 for the Spirits' Spectral Claws and Daggers, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
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
        name: `Invocation of Nagash`,
        desc: `At the start of your hero phase, pick up to 5 different friendly SUMMONABLE units or friendly Ossiarch Bonereapers units on the battlefield in any combination. You can heal 3 wounds that have been allocated to each unit you picked. If no wounds are currently allocated to a unit you picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than 3.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Arkhan the Black, Mortarch of Sacrament': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['First of the Mortarchs'])],
      spells: [keyPicker(spells, ['Curse of Years'])],
    },
    effects: [
      FeasterOfSoulsEffect,
      {
        name: `The Staff of Spirits`,
        desc: `Add Khenash-an's modifier to casting, dispelling, and unbinding rolls for Arkhan. In addition, he can attempt to cast Arcane Bolt and Mystic Shield any number of times in the same Hero Phase, even if another Wizard has already attempted to cast the spell in that phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mortarch of Sacrament`,
        desc: `At the start of your hero phase, pick up to 4 different friendly SUMMONABLE units or friendly Ossiarch Bonereapers units wholly within 24" of Arkhan. You can heal 3 wounds that have been allocated to each unit you picked. If no wounds are currently allocated to a unit you picked, you may instead return a number of slain models to it that have a combined Wounds characteristic equal to or less than 3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `Each time you roll an unmodified hit roll of 6 for the Spirits' Spectral Claws and Daggers, that attack inflicts 1 mortal wound instead of the.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Mannfred, Mortarch of Night': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Vigour of Undeath'])],
      spells: [keyPicker(spells, ['Wind of Death'])],
    },
    effects: [
      FeasterOfSoulsEffect,
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
      getDeathlyInvocation(4),
      {
        name: `Magic`,
        desc: `Mannfred is a WIZARD. He can attempt to cast two spells in your hero phase, and attempt to unbind two spells in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Wind of Death spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Neferata, Mortarch of Blood': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Twilights Allure'])],
      spells: [keyPicker(spells, ['Dark Mist'])],
    },
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
      getDeathlyInvocation(4),
      {
        name: `Magic`,
        desc: `Neferata is a WIZARD. She can attempt to cast two spells in your hero phase, and attempt to unbind two spells in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Dark Mist spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Prince Vhordrai': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Fist of Nagash'])],
      spells: [keyPicker(spells, ['Quickblood'])],
    },
    effects: [
      TheHungerEffect,
      // Does not use generic ChaliceOfBlood
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
      getDeathlyInvocation(3),
      {
        name: `Magic`,
        desc: `Prince Vhordrai is a WIZARD. He can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Quickblood spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Morghast Harbingers': {
    effects: [
      HeraldsOfTheAccursedOneEffect,
      {
        name: `Harbingers of Death`,
        desc: `When making a charge roll for this unit, you may roll 3 dice instead of 2. In addition, you can declare a charge for this unit if it is within 18" of the enemy rather than 12".`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Morghast Archai': {
    effects: [
      HeraldsOfTheAccursedOneEffect,
      {
        name: `Ebon-wrought Armour`,
        desc: `Each time you allocate a mortal wound to this unit, roll a D6. On a 5+ the mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Vampire Lord on Zombie Dragon': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Dread Knight'])],
      spells: [keyPicker(spells, ['Blood Boil'])],
    },
    effects: [
      ...GenericBattleTraits.ZombieDragon,
      TheHungerEffect,
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
      ChaliceOfBloodEffect,
      getDeathlyInvocation(3),
      {
        name: `Magic`,
        desc: `A Vampire Lord on Zombie Dragon is a WIZARD. He can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Blood Boil spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Knights': {
    effects: [
      {
        name: `Kastellan`,
        desc: `The leader of this unit is a Kastellan. Add 1 to the Attacks characteristic of a Kastellan's Templar Lance or Blade.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      TheHungerEffect,
      {
        name: `Martial Fury`,
        desc: `If this unit completed a charge this turn, increase the Damage characteristic of its Templar Lances or Blades to D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodshields`,
        desc: `Add 1 to the save rolls for a unit carrying Bloodshields against attacks that have a Rend characteristic of '-'.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Vargheists: {
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
  'Bat Swarms': {
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
  'Fell Bats': {
    effects: [
      {
        name: `Scent of Gore`,
        desc: `If an enemy model is slain within 6" of this unit, increase the Attacks characteristic of this unit's Elongated Fangs to 6 for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Vampire Lord': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Blood Feast'])],
    },
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
      TheHungerEffect,
      ChaliceOfBloodEffect,
      getDeathlyInvocation(3),
      {
        name: `Magic`,
        desc: `A Vampire Lord is a WIZARD. They can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. They know the Arcane Bolt and Mystic Shield spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bloodseeker Palanquin': {
    mandatory: {
      spells: [keyPicker(spells, ['Blood Siphon'])],
    },
    effects: [
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Spectral Host's Ethereal Weapons, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `A Fine Vintage`,
        desc: `If an enemy HERO is slain within 9" of this model, add 1 to the Attacks characteristic of any melee weapons used by friendly SOULBLIGHT units within 12" of this model until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      WailOfTheDamnedEffect,
      getDeathlyInvocation(2),
      {
        name: `Magic`,
        desc: `The Sanguinarch on a Bloodseeker Palanquin is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Blood Siphon spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Coven Throne': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Tactical Insight'])],
      spells: [keyPicker(spells, ['Beguile'])],
    },
    effects: [
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Spectral Host's Ethereal Weapons, that attack inflicts 1 mortal wound instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scrying Pool`,
        desc: `Once per game, you can reroll a single dice roll of your choice for this model.`,
        when: [DURING_GAME],
      },
      // Does not fit with generic TheHungerEffect because of the HERO specification
      {
        name: `The Hunger`,
        desc: `At the end of any combat phase in which this model slew any enemy models, you can heal 1 wound that has been allocated to it. If this model slew any enemy HERO models this turn, you may heal 1 additional wound allocated to it.`,
        when: [END_OF_COMBAT_PHASE],
      },
      getDeathlyInvocation(3),
      {
        name: `Magic`,
        desc: `The Vampire Queen on a Coven Throne is a WIZARD. She can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Beguile spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mortis Engine': {
    effects: [
      WailOfTheDamnedEffect,
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
  Necromancer: {
    mandatory: {
      spells: [keyPicker(spells, ["Vanhel's Danse Macabre"])],
    },
    effects: [
      {
        name: `Undead Minions`,
        desc: `Before you allocate a wound or mortal wound to this model, you can pick a friendly Summonable unit within 3" of this model and roll a D6. On a 4+ the wound or mortal wound is allocated to that unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      getDeathlyInvocation(2),
      {
        name: `Magic`,
        desc: `A Necromancer is a WIZARD. He can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Vanhel's Danse Macabre spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Zombies: {
    effects: [
      StandardBearerEffect,
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
  'Corpse Cart w/ Unholy Lodestone': {
    effects: [
      {
        name: `Unholy Lodestone`,
        desc: `Add 1 to casting rolls for friendly DEATH WIZARDS within 18" of any Corpse Carts with an Unholy Lodestone.`,
        when: [HERO_PHASE],
      },
      {
        name: `Locus of Undeath`,
        desc: `Whilst it is within 6" of this model, you can reroll the dice to determine how many wounds are healed on a friendly DEATH unit picked as a target of a Deathly Invocation ability.`,
        when: [START_OF_HERO_PHASE],
      },
      CryptSwordEffect,
    ],
  },
  'Corpse Cart w/ Balefire Brazier': {
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
      CryptSwordEffect,
    ],
  },
  Terrorgheist: {
    effects: [...GenericBattleTraits.Terrorgheist],
  },
  'Zombie Dragon': {
    effects: [...GenericBattleTraits.ZombieDragon],
  },
  'Wight King with Baleful Tomb Blade': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Lord of Bones'])],
    },
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
      getDeathlyInvocation(2),
    ],
  },
  'Wight King with Black Axe': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Lord of Bones'])],
    },
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
      getDeathlyInvocation(2),
    ],
  },
  'Black Knights': {
    effects: [
      {
        name: `Hell Knight`,
        desc: `The leader of this unit is a Hell Knight. Add 1 to the Attacks characteristic of a Hell Knight's Barrow Lance.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
      {
        name: `Deathly Charge`,
        desc: `If this unit completed a charge this turn, add 1 to its wound rolls and add 1 to the Damage characteristic of its Barrow Lances.`,
        when: [COMBAT_PHASE],
      },
      CryptShieldsEffect,
    ],
  },
  'Grave Guard': {
    effects: [
      StandardBearerEffect,
      {
        name: `Seneschal`,
        desc: `The leader of this unit is a Seneschal. Add 1 to the Attacks characteristic of a Seneschal's Wight Blade or Great Wight Blade.`,
        when: [COMBAT_PHASE],
      },
      HornblowerEffect,
      {
        name: `Cursed Weapons`,
        desc: `If the wound roll for an attack made with a Wight Blade or Great Wight Blade is 6+, double the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
      CryptShieldsEffect,
    ],
  },
  'Skeleton Warriors': {
    effects: [
      {
        name: `Skeleton Champion`,
        desc: `The leader of this unit is a Skeleton Champion. Add 1 to the Attacks characteristic of a Skeleton Champion's Ancient Blade or Ancient Spear.`,
        when: [COMBAT_PHASE],
      },
      StandardBearerEffect,
      HornblowerEffect,
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
      CryptShieldsEffect,
    ],
  },
  'The Sepulchral Guard': {
    effects: [
      {
        name: `The Sepulchral Warden`,
        desc: `You can return D3 slain models to this unit if the Sepulchral Warden is on the battlefield.`,
        when: [HERO_PHASE],
      },
      CryptShieldsEffect,
      {
        name: `Serve in Death`,
        desc: `You can add 1 to hit rolls for this unit if it is wholly within 18" of any friendly Death heroes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frightening Speed`,
        desc: `You can reroll charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Legion Black Coach': {
    effects: [
      {
        name: `Frightful Touch`,
        desc: `Each time you make a hit roll of 6+ for the Cairn Wraith's Reaper Scythe, that attack inflicts 2 mortal wounds instead of the normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaped Like Corn`,
        desc: `If the target unit has 5 or more models, you can reroll failed hit rolls for the Cairn Wraith's Reaper Scythe.`,
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
  'Dire Wolves': {
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
        when: [SAVES_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
