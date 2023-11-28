import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  TURN_FOUR_START_OF_ROUND,
  TURN_ONE_START_OF_HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import prayers from './prayers'
import spells from './spells'
import meta_rule_sources from 'meta/rule_sources'

const ThundertuskEffects = [
  {
    name: `Blasts of Frost-wreathed Ice`,
    desc: `Do not use the attack sequence for an attack made with Frost-wreathed Ice. Instead, pick 1 enemy unit within 18" of this model that is visible to it and roll the number of dice shown on the damage table on the warscroll.
      Add 1 to each roll if the target unit has 10 or more models.
      Add 2 to each roll instead if the target unit has 20 or more models.
      For each 6+, that enemy unit suffers 1 mortal wound.`,
    when: [SHOOTING_PHASE],
    shared: true,
  },
  {
    name: `Numbing Chill`,
    desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this unit.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Chill of the Everwinter`,
    desc: `Only a THUNDERTUSK unit that has made a charge move in the same phase can carry out this monstrous rampage. Roll a dice for each enemy unit within 1" of this unit. On a 3+, the strike-last effect applies to that unit until the end of the following combat phase.`,
    when: [END_OF_CHARGE_PHASE],
    monstrous_rampage: true,
    shared: true,
  },
]
const StonehornEffects = [
  {
    name: `Earth-shattering Charge`,
    desc: `Add 1 to the damage inflicted by attacks made with this model's Rock-hard Horns and Crushing Hooves if this model made a charge move in the same turn.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Stone Skeleton`,
    desc: `This unit has a ward of 5+.`,
    when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
    shared: true,
  },
  {
    name: `Unstoppable Charge`,
    desc: `Only a STONEHORN unit that has made a charge move in the same phase can carry out this monstrous rampage. This unit makes a 3D6" move and can pass across enemy units in the same manner as a unit that can fly. It must finish the move within 3" of any enemy units. At the end of the move, roll a dice for each unit it passed across. On a 2+, that unit suffers D3 mortal wounds.`,
    when: [END_OF_CHARGE_PHASE],
    monstrous_rampage: true,
    shared: true,
  },
]
const ReelEmInEffects = [
  {
    name: `Reel Em In`,
    desc: `If an attack made with a Chaintrap scores a hit on an enemy MONSTER and that MONSTER unit is not
  destroyed and not already snagged, after that attack has been resolved, you can roll a dice. On a 4+ that MONSTER unit is snagged until the start of your next shooting phase. 
  
  While a MONSTER unit is snagged, each time it makes a move, it must finish that move at least as close to the unit that snagged it as it was at the start of the move.`,
    when: [SHOOTING_PHASE],
    shared: true,
  },
  {
    name: `Reel Em In`,
    desc: `While an enemy MONSTER unit is snagged, each time it makes a move, it must finish that move at least as close to the unit that snagged it as it was at the start of the move.`,
    when: [MOVEMENT_PHASE],
    shared: true,
  },
]
const BloodVultureEffect = {
  name: `Blood Vulture`,
  desc: `If this model is armed with a Blood Vulture, at the start of your shooting phase, pick 1 enemy unit that is visible to it and roll a D6. On a 2+, that unit suffers 1 mortal wound.`,
  when: [START_OF_SHOOTING_PHASE],
  shared: true,
}
const MastersOfAmbushEffects = (otherUnit: 'Frost Sabres' | "Hrothgorn's Mantrappers") => [
  {
    name: `Masters of Ambush`,
    desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. If you do so, when you would set up a friendly ${otherUnit} unit, instead of setting up that unit on the battlefield, you can say that it is joining this model in ambush as a reserve unit. 1 unit can join this model in this way.`,
    when: [DURING_SETUP],
    shared: true,
  },
  {
    name: `Masters of Ambush`,
    desc: `If you set this model up in reserve, at the end of your movement phase, you can set up this model anywhere on the battlefield that is more than 9" from any enemy units. You can then set up any unit that joined this model in ambush wholly within 12" of this model and more than 9" from any enemy units.`,
    when: [END_OF_MOVEMENT_PHASE],
    shared: true,
  },
  {
    name: `Masters of Ambush`,
    desc: `Any reserve units in ambush that are not set up on the battlefield before the start of the fourth battle round are destroyed.`,
    when: [TURN_FOUR_START_OF_ROUND],
    shared: true,
  },
]
const RhinoxChargeEffect = {
  name: `Rhinox Charge`,
  desc: `Add 1 to the damage inflicted by attacks made with this unit's Rhinox's Sharp Horns if this model made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const IronfistEffect = {
  name: `Ironfist`,
  desc: `If the unmodified save roll for an attack made with a melee weapon that targets a unit armed with Ironfists is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
  when: [SAVES_PHASE],
  shared: true,
}
const BellowerEffect = {
  name: `Bellower`,
  desc: `Add 1 to charge rolls for this unit if it includes any bellowers.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const BloodgruelEffect = {
  name: `Bloodgruel`,
  desc: `Roll a D6 each time this model successfully casts or unbinds a spell, after the effects of the spell have been resolved. On a 2+, you can heal 1 wound allocated to this model. On a 1, this model suffers 1 mortal wound.`,
  when: [HERO_PHASE],
  shared: true,
}
const FrostlordEffects = [
  {
    name: `Frost Spear`,
    desc: `If the unmodified wound roll for an attack made with a frost spear that targets an enemy HERO or MONSTER is a 6, subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1) until the end of that phase. The same unit can only be affected by this ability once per phase.`,
    when: [COMBAT_PHASE],
    shared: true,
  },
  {
    name: `Bellowing Voice`,
    desc: `Add 1 to charge rolls for friendly BEASTCLAW RAIDERS units wholly within 12" of this unit.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
]
const ChampionEffect = {
  name: `Champion`,
  desc: `1 model in this unit can be a champion. Add 1 to the Attacks characteristic for that model.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const Units = {
  Butcher: {
    mandatory: {
      spells: [keyPicker(spells, ['Voracious Maw'])],
    },
    effects: [BloodgruelEffect, GenericEffects.WizardOneSpellEffect],
  },
  Firebelly: {
    mandatory: { spells: [keyPicker(spells, ['Cascading Fire-cloak'])] },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Fire Breath`,
        desc: `The attacks characteristic of Fire breath is equal to the number of models in the target unit to a max of 10.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Frost Sabres': {
    effects: [
      {
        name: `Hunters of the Frozen Wilds`,
        desc: `This unit is not visible to enemy units while it is in cover.`,
        when: [DURING_GAME],
      },
      {
        name: `Their Master's Voice`,
        desc: `Do not take battleshock tests for this unit if it is wholly within 12" of a friednly ICEBROW HUNTER.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Frostlord on Stonehorn': {
    effects: [...StonehornEffects, ...FrostlordEffects],
  },
  'Frostlord on Thundertusk': {
    effects: [...ThundertuskEffects, ...FrostlordEffects],
  },
  'Huskard on Stonehorn': {
    mandatory: {
      prayers: [keyPicker(prayers, ["Winter's Endurance", "Winter's Strength"])],
    },
    effects: [...StonehornEffects, BloodVultureEffect, ...ReelEmInEffects],
  },
  'Huskard on Thundertusk': {
    mandatory: {
      prayers: [keyPicker(prayers, ["Winter's Endurance", "Winter's Strength"])],
    },
    effects: [...ThundertuskEffects, BloodVultureEffect, ...ReelEmInEffects],
  },
  'Stonehorn Beastriders': {
    effects: [...StonehornEffects, BloodVultureEffect, ...ReelEmInEffects],
  },
  'Thundertusk Beastriders': {
    effects: [...ThundertuskEffects, BloodVultureEffect, ...ReelEmInEffects],
  },
  'Gnoblar Scraplauncher': {
    effects: [
      RhinoxChargeEffect,
      {
        name: `Deadly Rain of Scrap`,
        desc: `The attacks characteristic of Piles of Old Scrap is equal to the number of models in the target unit (to a maxumum of 20)`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Load it Up!`,
        desc: `Pick 1 freindly GNOBLARS unit wholly within 9" of this unit and roll 2D6. If the roll is less than the number of models in that unit, add 1 to hit rolls for attacks made with this unit's Piles of Old Scrap until the end of that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  Gnoblars: {
    effects: [
      ChampionEffect,
      {
        name: `Nasty Traps and Tricks`,
        desc: `Roll a dice each time an enemy unit fishines a move within 6" of any friendly units with this ability, on a 4+ that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Gorgers: {
    effects: [
      {
        name: `Ambushing Hunters`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Ambushing Hunters`,
        desc: `If you set this unit up in reserve, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Gruesome Devourers`,
        desc: `If this unit is part of an Ogor Mawtribes army and it is eating, enemy units within 9" of this unit cannot receive the Inspiring Presence or Rally commands.`,
        when: [START_OF_HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  Maneaters: {
    mandatory: { command_abilities: [keyPicker(command_abilities, ['A Barrel of Meat and the Jobs Done'])] },
    effects: [
      GenericEffects.Elite,
      {
        name: `Been There, Done That`,
        desc: `After deployment, pick 1 ability to apply to this unit from the following list:
            Brawlers: Add 1 to wound rolls for melee weapons used by this unit.
            Crack Shots: The Range characteristic for this unit's Pistols and Throwing weapons is 18".
            Striders: This unit can run and still charge later in the same turn.
            Stubborn: Do not take battleshock tests for this unit.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Brawlers`,
        desc: `If you selected this ability, you can add 1 to wound rolls for attacks made with melee weapons by this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crack Shots`,
        desc: `If you selected this ability, the Range of this unit's shooting attacks is 18".`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Striders`,
        desc: `If you selected this ability, this unit can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Stubborn`,
        desc: `If you selected this ability, do not take battleshock tests for this unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Icebrow Hunter': {
    mandatory: { command_abilities: [keyPicker(command_abilities, ['Lead the Skal'])] },
    effects: [
      ...MastersOfAmbushEffects('Frost Sabres'),
      {
        name: `Icy Breath`,
        desc: `In your shooting phase, you can say that this unit will attack with its Icy Breath instead of attacking with its missile weapons. If you do so, pick 1 enemy unit within 6" of this model that is visible to it and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Icefall Yhetees': {
    effects: [
      {
        name: `Aura of Frost`,
        desc: `This unit has a ward of 6+.`,
        when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
      },
      {
        name: `Bounding Leaps`,
        desc: `This unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Invigorated by the Blizzard`,
        desc: `This unit can run and still charge later in the same turn if it is wholly within 15" of a friendly Thundertusk when the charge roll is made.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Mournfang Pack': {
    effects: [
      {
        name: `Skalg`,
        desc: `This model is armed with the Ironlock Pistol in addition to any other weapons.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skalg`,
        desc: `Add 1 to the attack characteristics of this models melee weapons excluding the mount.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Horn Blower`,
        desc: `Add 1 to charge rolls for this unit while it includes any Horn Blowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Banner Bearer`,
        desc: `Add 1 to the Bravery characteristic of this unit while it includes any Banner Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Line Breaker`,
        desc: `Subtract 1 from wound rolls for attacks made with missile weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Line Breaker`,
        desc: `Attacks made by a unit that received the Unleash Hell command in that phase only wound on an unmodifed roll of 6 when targeting this unit.`,
        when: [CHARGE_PHASE],
      },
      IronfistEffect,
    ],
  },
  Ironblaster: {
    effects: [
      {
        name: `Lethal Payload`,
        desc: `Each time this unit shoots, choose either the Cannon Ball or Hail Shot missile weapon characteristics for that shooting attack.`,
        when: [SHOOTING_PHASE],
      },
      RhinoxChargeEffect,
    ],
  },
  Leadbelchers: {
    effects: [
      {
        name: `Thunderfist`,
        desc: `1 model in this unit can be a Thunderfist. Add 1 to the Attacks characteristic of that model's Bludgeoning Blow.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thunderous Blasts of Hot Metal`,
        desc: `If this unit remained stationery in your movement phase, when this unit shoots in your following shooting phase, the Attacks characterisitc is 2D3 instead of D3.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Ironguts: {
    effects: [
      {
        name: `Gutlord`,
        desc: `1 model in this unit can be a Gutlord. Add 1 to the Attacks characteristic of that model's Mighty Bashing Weapon.`,
        when: [COMBAT_PHASE],
      },
      BellowerEffect,
      {
        name: `Rune Maw Bearer`,
        desc: `Each time a unit with any Rune Maw Bearers is affected by a spell or endless spell, you can roll a D6. If you do so, on a 6, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Down to the Ironguts`,
        desc: `Once per battle, in the combat phase, after this unit has fought for the first time in that phase you can say they will unleash their ferocity. If you do so they can fight for a second time in that phase. The strike-last effect applies to this unit when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gutguard`,
        desc: `Before you allocate a wound, mortal to a friendly TYRANT within 3" or make a ward roll for that TYRANT you can roll a dice. On a 1-2 that wound or mortal wound is allocated to that TYRANT as normal. On a 3+ that wound or mortal wound is allocated to this unit instead of that TYRANT.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Ogor Gluttons': {
    effects: [
      {
        name: `Crusher`,
        desc: `1 model in this unit can be a Crusher. Add 1 to the Attacks characteristic of that model's Club(s) or Blade(s).`,
        when: [COMBAT_PHASE],
      },
      BellowerEffect,
      {
        name: `Beast Skull Bearer`,
        desc: `Add 1 to the Bravery characteristic of this unit while it includes any Beast Skull Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Tribal Banner Bearer with Lookout Gnoblar`,
        desc: `Subtract 1 from wound rolls from missile weapons that target this unit while it has any Tribal Banner Bearer with Lookout Gnoblar.`,
        when: [SHOOTING_PHASE],
      },
      IronfistEffect,
    ],
  },
  Slaughtermaster: {
    mandatory: { spells: [keyPicker(spells, ['Rockchomper'])] },
    effects: [
      BloodgruelEffect,
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Great Cauldron`,
        desc: `In your hero phase, you can say that this model will reach into its cauldron and feast on the contents. If you do so, roll a D6 and consult the table below.
            1: Bad Meat: This model suffers 1 mortal wound.
            2: Troggoth Guts: You can heal D3 wounds allocated to this model. In addition, you can heal 1 wound allocated to each friendly OGOR unit wholly within 12" of this model.
            3-4: Spinemarrow: Pick a friendly Ogor unit wholly within 12" of this model. Add 1 to wound rolls for attacks made with melee weapons by that unit until the start of your next hero phase.
            5-6: Bonecrusher: Roll a D6 for each enemy unit within 6" of this model. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Tyrant: {
    effects: [
      {
        name: `Big Name`,
        desc: `When you pick this unit to be a part of your amry, you can pick 1 of the big names from the list below and record it on your army roster.
              Deathcheater: This unit has a ward of 5+.
              Brawlerguts: This unit is treated as a monster for the purposes of the Trampling charge battle trait.
              Fateseeker: this unit has a Save characteristic of 3+ instead of 4+.
              Longstrider: This unit has a Move characteristic of 8".
              Giantbreaker: Add 1 to the damage inflicted by attacks made with this unit's weapones that target a MONSTER.
              Wallcrusher: Improve the Rend characteristic of this unit's melee weapons by 1 if the target is in cover or in a garrison.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Deathcheater (Big Name)`,
        desc: `This unit has a ward of 5+.`,
        when: [WOUND_ALLOCATION_PHASE, WARDS_PHASE],
      },
      {
        name: `Brawlerguts (Big Name)`,
        desc: `This unit is treated as a monster for the purposes of the Trampling charge battle trait.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Fateseeker (Big Name)`,
        desc: `This unit has a Save characteristic of 3+ instead of 4+.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Longstrider (Big Name)`,
        desc: `This unit has a Move characteristic of 8".`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Giantbreaker (Big Name)`,
        desc: `Add 1 to the damage inflicted by attacks made with this unit's weapones that target a MONSTER.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wallcrusher (Big Name)`,
        desc: `Improve the Rend characteristic of this unit's melee weapons by 1 if the target is in cover or in a garrison.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Beastskewer Glaive`,
        desc: `If the unmodified hit roll for an attack made with a Beastskewer Glaive that targets a HERO or MONSTER is 6, the Beastskewer Glaive has a Damage characteristic of D6 instead of D3 for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thundermace`,
        desc: `If the unmodified hit roll for an attack made with a Thundermace is 6, that attack inflicts 1 mortal wound in addition to any normal damage. If the target unit has more than 3 models, that attack inflicts D3 mortal wounds instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bully of the First Degree`,
        desc: `If a friendly OGOR MAWTRIBES unit fails a battleshock test within 3" of any friendly units with this ability, only 1 model in that unit will flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  "Hrothgorn's Mantrappers": {
    effects: [
      {
        name: `Hidden Trap`,
        desc: `At the start of the first hero phase, if this unit is in your army, you can pick 1 terrain feature or objective that is not wholly within enemy territory and say that it is trapped. If you do so, place 1 Bushwakka's Trap marker next to that terrain feature or objective.
          The first time a unit finishes a move within 1" of the trapped terrain feature or objective remove the Bushwakka's Trap minature and roll a D6. On a 2+, that unit suffers a number of mortal wounds equal to the roll.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
      {
        name: `Here You Go Boss!`,
        desc: `While a friendly HROTHGORN is within 3" of this unit while it includes Quiv, add 1 to the Attacks characteristic of his Trap Launcher.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Hrothgorn: {
    effects: [
      ...MastersOfAmbushEffects("Hrothgorn's Mantrappers"),
      {
        name: `Thrafnir`,
        desc: `The first time this model is set up on the battlefield, you can set up a Frost Sabres unit consisting of a single model on the battlefield and add it to your army. Set up the Frost Sabre wholly within 3" of this model and more than 9" from any enemy units.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  "Blackpowder's Buccaneers": {
    effects: [
      {
        name: `Companions`,
        desc: `Gorlok Blackpowder is accompanied by four Minions: Peggz, Kagey, Mange and Shreek. The minions must remain within 1" of Gorlok Blackpowder. For rules purposes, Gorlok Blackpowder and their minions are treated as a single model.`,
        when: [DURING_GAME],
      },
      {
        name: `Legendary Looter`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO with an artefact of power enhancement that is within 3" of this unit, and roll 2d6. Add 2 to the roll if Kagey has not been removed, and add 1 to the roll for each other minion that has not been removed. If the roll is 12+, that enemy HERO cannot use that artefact of power for the rest of the battle. If the artefact of power modified any of the bearer's characteristics or weapon characteristics, they return to their original values.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Gorlok's Minions`,
        desc: `Each time a wound or mortal wound is allocated to this model and not negated, you can choose to remove 1 minion. If you do so the wound or mortal wound is negated. In additiona, each minion confers an ability to this unit as shown below. If the minion is removed, that ability can no longer be used.
        
        Peggz: Add 1 to hit rolls for this unit. In addition, if you choose to remove this unit when this unit suffers a wound or mortal wound, roll a dice. On a 5+ this minion is not removed, but the wound or mortal wound is still negated.
        
        Kagey: See the Legendary Looter Ability
        
        Mange: After this unit fights, you can pick 1 enemy unit within 3" of this model and roll a dice. On a 5+ that enemy unit suffers 1 mortal wound.
        
        Shreek: In your shooting phase, you can pick 1 enemy unit within 18" of this model and roll a dice. On a 5+ that enemy unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Gorlok's Minions - Peggz`,
        desc: `Add 1 to hit rolls for this unit. In addition, if you choose to remove this unit when this unit suffers a wound or mortal wound, roll a dice. On a 5+ this minion is not removed, but the wound or mortal wound is still negated.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Gorlok's Minions - Kagey`,
        desc: `See the Legendary Looter Ability.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Gorlok's Minions - Mange`,
        desc: `After this unit fights, you can pick 1 enemy unit within 3" of this model and roll a dice. On a 5+ that enemy unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gorlok's Minions - Shreek`,
        desc: `In your shooting phase, you can pick 1 enemy unit within 18" of this model and roll a dice. On a 5+ that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Bloodpelt Hunter': {
    effects: [
      {
        name: `Hidden Predator`,
        desc: `This unit is not visible to enemy units while it is within cover.`,
        when: [DURING_GAME],
      },
      {
        name: `Unrelenting Hunter`,
        desc: `At the end of your opponent's movement phase, if this unit is more than 9" from all enemy units, it can make a normal move.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Beast-Breaker`,
        desc: `If the target is a MONSTER, the damage of a Skullshatter Crossbow is 3 and the damage of an Impaling Spear is 6.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Gorger Mawpack': {
    effects: [
      {
        name: `Clawback`,
        desc: `1 in every 5 models in this unit must be a Clawback. Add 1 to the Attacks characteristic of that model's Bone-shattering Strikes. That model can issue commands to their own unit.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
      {
        name: `Cave Howler`,
        desc: `1 in every 5 models in this unit must be a Cave Howler.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
      {
        name: `Ambushing Hunters`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. If you do so, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
      {
        name: `Ambushing Hunters`,
        desc: `If this unit is set up in ambush as a reserve unit, at the end of your movement phase, you can set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
      {
        name: `Agonising Roar`,
        desc: `Roll a dice each time an enemy unit receives a command within 12" of a friendly Cave Howler. On a 5+, that command is not received (the command ability still counts as having been used) and the command point that was spent to issue that command is lost.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
