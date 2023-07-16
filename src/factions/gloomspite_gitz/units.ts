import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const ArachnarokSpiderVenomEffect = {
  name: `Spider Venom`,
  desc: `If the unmodified hit roll for an attack made with this model's Monstrous Fangs is 6, that attack inflicts 3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
  shared: true,
}

const DeadTricksyEffect = {
  name: `Dead Tricksy`,
  desc: `This unit has a ward of 6+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const FerociousPounceEffect = {
  name: `Ferocious Pounce`,
  desc: `This unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const NettersEffect = {
  name: `Netters`,
  desc: `Subtract 1 from hit rolls for attacks made by enemy units while they are within 1" of any friendly units that include any models armed with a Barbed Net.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  shared: true,
}
const GrotBaseEffects = [
  {
    name: `Musician`,
    desc: `1 in every 20 models in this unit can be a Gong Basher. Add 1 to run rolls for this unit if it includes any Gong Bashers.`,
    when: [MOVEMENT_PHASE],
    shared: true,
  },
  {
    name: `Standard Bearer`,
    desc: `1 in every 20 models in this unit can be a Bad Moon Icon Bearer. Add 1 to save rolls for attacks made with missile weapons that target this unit if it includes any Bad Moon Icon Bearers.`,
    when: [SAVES_PHASE],
    shared: true,
  },
  NettersEffect,
]
const WhirlingDeathEffect = {
  name: `Whirling Death`,
  desc: `This unit fights at the start of the combat phase, before the players pick any other units to fight in that combat phase. This unit cannot fight again in the combat phase unless an ability or spell allows it to fight more than once.`,
  when: [START_OF_CHARGE_PHASE],
  shared: true,
}
const HallucinogenicFungusBrewsEffect = {
  name: `Hallucinogenic Fungus Brews`,
  desc: `In the first battle round, this unit has a ward of 4+. In the second battle round, this unit has a ward of 5+. In the third and subsequent battle rounds, this unit has a ward of 6+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const WatchOutEffect = {
  name: `Watch Out!`,
  desc: `If this model is slain, before it is removed from play, roll a dice for each other unit within 3" of this model. On a 4+, that unit suffers D3 mortal wounds.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const KersplatEffect = {
  name: `Ker-splat!`,
  desc: `After this unit makes a charge move, pick 1 enemy unit within 1" of this unit and roll a dice for each model in that unit, to a maximum of 10 dice. For each 4+, that unit suffers 1 mortal wound.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const SquigsGoneWildEffect = {
  name: `Squigs Gone Wild`,
  desc: `Each time a Cave Squig in this unit flees as a result of a failed battleshock test, before that model is removed from play, roll a dice. On a 3+, you can pick the closest enemy unit within 9" of that model. That unit suffers 1 mortal wound. If multiple units are tied to be the closest within 9" of it, you can pick which suffers the mortal wound.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}
const WallCrawlerEffect = {
  name: `Wall Crawler`,
  desc: `When this model makes a move, it can pass across terrain features in the same manner as a model that can fly.`,
  when: [MOVEMENT_PHASE],
  shared: true,
}
const RegenerationEffect = {
  name: `Regeneration`,
  desc: `At the start of the hero phase, you can heal up to D3 wounds allocated to this unit.`,
  when: [START_OF_HERO_PHASE],
  shared: true,
}
const MagicalResistanceEffect = {
  name: `Magical Resistance`,
  desc: `Each time this unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on this unit.`,
  when: [HERO_PHASE],
  shared: true,
}
const SquigglyBeastFollowersEffect = {
  name: `Squiggly-beast Followers`,
  desc: `At the start of the combat phase, roll 1 dice for each enemy unit within 3" of any friendly units with this ability. If the roll is equal to or greater than the number of models in that enemy unit, that enemy unit suffers 1 mortal wound.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const CrushingGripEffect = {
  name: `Crushing Grip`,
  desc: `At the end of the combat phase, pick 1 enemy model within 1" of this unit and roll a dice. If the roll is equal to or greater than that model's Wounds characteristic, it is slain.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}

// TODO: Make sure we have Kragnos available

const Units = {
  'Skragrott, The Loonking': {
    mandatory: {
      spells: [keyPicker(Spells, ['Fangz of da Bad Moon'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `Warmaster`,
        desc: `If this unit is included in a Gloomspite Gitz army, it is treated as a general even if it is not the model picked to be the army's general.`,
        when: [DURING_GAME],
      },
      {
        name: `Da Moon Onna Stikk`,
        desc: `If this unit is included in a Gloomspite Gitz army, friendly Gloomspite Gitz units are affected by the Light of the Bad Moon while they are wholly within 12" of this unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Babbling Wand`,
        desc: `Once per turn, this unit can issue a command without a command point being spent.`,
        when: [DURING_GAME],
      },
      {
        name: `Loonking's Crown`,
        desc: `This unit has a ward of 4+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Loonking's Crown`,
        desc: `Add 1 to casting and unbinding rolls for this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Loonking's Entreaty`,
        desc: `Once per battle, before you roll a dice to determine if the Bad Moon moves at the start of a battle round, if this unit is on the battlefield, you can say that Skragrott will reveal his prediction. If you do so, do not roll a dice. Instead, you can choose if the Bad Moon moves to the next location or stays in its current location.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  Loonboss: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["I'm Da Boss, Now Stab 'Em Good!"])],
    },
    effects: [DeadTricksyEffect],
  },
  'Loonboss on Mangler Squigs': {
    effects: [
      {
        name: `Bite Da Moon!`,
        desc: `Once per battle, at the start of the combat phase, you can say that this unit will use this ability. If you do so, until the end of the phase, add 1 to wound rolls for friendly Squig units while they are wholly within 18" of this unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
      WatchOutEffect,
      KersplatEffect,
    ],
  },
  'Loonboss on Giant Cave Squig': {
    effects: [
      {
        name: `Let's Get Bouncin'!`,
        desc: `In the combat phase, after this unit has fought for the first time in that phase, you can pick 1 friendly Boingrot Bounderz unit that has not yet fought in that phase, is within 3" of an enemy unit, and is wholly within 12" of this unit. That unit can fight immediately.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Moonclan Stabba`,
        desc: `If this unit made a charge move in the same turn, add 1 to the Damage characteristic of this unit's Moonclan Stabba and improve the Rend characteristic of this unit's Moonclan Stabba by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Loonboss with Giant Cave Squig': {
    effects: [
      DeadTricksyEffect,
      {
        name: `Goin' Somewhere?`,
        desc: `At the start of the battleshock phase, you can pick 1 other friendly Gloomspite Gitz Grot unit within 3" of this unit and say that the Loonboss will set his Cave Squig loose on them. If you do so, that unit suffers D3 mortal wounds, but for each mortal wound it suffers, add 3 to its Bravery characteristic until the end of the phase.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Gobbled Up`,
        desc: `At the end of the combat phase, pick 1 enemy model within 1" of this unit and roll a dice. If the roll is equal or greater than that model's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Madcap Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Night Shroud'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Madcap Mushroom`,
        desc: `Once per battle, in your hero phase, you can say this unit will eat its Madcap Mushroom. If you do so, this unit can attempt to cast 1 additional spell in that phase. If it does so and the casting roll is a double, this unit suffers D3 mortal wounds after the effect of the spell has been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fungoid Cave-Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Spore Maws'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Mouthpiece of Mork`,
        desc: `If this unit is on the battlefield at the start of your hero phase, roll a dice. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Deffcap Mushroom`,
        desc: `If this unit is in a Gloomspite Gitz army, once per battle in your hero phase, you can say this unit will eat a Deffcap Mushroom. If you do so, this unit can attempt to cast 1 additional spell in that hero phase, and that spell can be any spell from the Lore of the Moonclans.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spore Squig`,
        desc: `This unit is not visible to enemy units that are more than 12" away.`,
        when: [DURING_GAME],
      },
    ],
  },
  Zarbag: {
    mandatory: {
      spells: [keyPicker(Spells, ['Face of Da Bad Moon', 'Jealous Hex'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Sniffer Spite`,
        desc: `At the start of your hero phase, roll a dice. On a 4+, this unit can attempt to cast 1 additional spell in that phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Zarbag's Gitz": {
    effects: [
      {
        name: `Loonsmasha Fanatic`,
        desc: `A Loonsmasha Fanatic unit consisting of 1 model lurks with Zarbag's Gitz.`,
        when: [DURING_GAME],
      },
      NettersEffect,
      {
        name: `'Protect Da Boss!'`,
        desc: `Before you allocate a wound or mortal wound to a friendly Zarbag, or instead of making a ward roll for a wound or mortal wound that would be allocated to a friendly Zarbag, if this unit is within 3" of that friendly Zarbag, you can roll a dice. On a 1-2, that wound or mortal wound is allocated to that Zarbag as normal. On a 3+, that wound or mortal wound is allocated to this unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Snirk Sourtongue`,
        desc: `The first time this unit is set up on the battlefield, 1 Loonsmasha Fanatics unit consisting of 1 model is added to your army and hidden within this unit as a reserve unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Moonclan Stabbas': {
    effects: [
      ...GrotBaseEffects,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Moonclan Boss. Add 1 to the Attacks characteristic of that model's Stabba or Pokin' Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Anarchic Hordes`,
        desc: `While this unit has 20 or more models, models in this unit can contest an objective while they are within 9" of it instead of 6".`,
        when: [DURING_GAME],
      },
    ],
  },
  'Moonclan Shootas': {
    effects: [
      ...GrotBaseEffects,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Moonclan Boss. Add 1 to the Attacks characteristic of that model's Moonclan Bow.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Loadsa Arrers`,
        desc: `Add 1 to Attacks characteristic of this unit's Moonclan Bows while it has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Loonsmasha Fanatics': {
    effects: [
      {
        name: `Release the Fanatics!`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up hidden as a reserve unit. You can set up 1 unit hidden in this manner for each friendly Moonclan Grot unit consisting of 5 or more models that is on the battlefield and that does not have the Squig or Fanatic keyword.`,
        when: [DURING_SETUP],
      },
      {
        name: `Release the Fanatics!`,
        desc: `At the end of deployment, secretly pick 1 friendly unit that is on the battlefield for this unit to be hidden within and record this information on a piece of paper. The unit picked must be another friendly Moonclan Grot unit consisting of 5 or more models that does not have the Squig or Fanatickeyword. This unit cannot be hidden within a unit that already has another unit hidden within it.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Release the Fanatics!`,
        desc: `At the start of the charge phase, you can release this unit. If you do so, set up this unit wholly within 3" of the unit in which it is hidden and more than 3" from all enemy units. If this unit was released in your charge phase, it can attempt a charge in that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Release the Fanatics!`,
        desc: `If the unit in which this unit is hidden is destroyed before this unit is released, before the last model in that unit is removed from play, set up this unit wholly within 6" of that model, then remove that model as normal.`,
        when: [WOUND_ALLOCATION_PHASE],
      },

      WhirlingDeathEffect,
    ],
  },
  'Sporesplatta Fanatics': {
    effects: [
      {
        name: `Puffshroom Frenzy`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by other friendly Gloomspite Gitz units while they are wholly within 9" of any friendly units with this ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spore Cloud`,
        desc: `Visibility between 2 models is blocked if a straight line drawn between the closest points of the 2 models passes across a model in this unit or passes within 1 " of this unit. This ability does not apply if either of the models the line is drawn between is a model in this unit, a model that can fly, or a Monster.`,
        when: [DURING_GAME],
      },
      {
        name: `A Prod in the Right Direction`,
        desc: `After deployment but before the first battle round begins, this unit can make a normal move.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Squig Hoppers': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Squig Hopper Boss. Add 1 to the Attacks characteristic of that model's Slitta.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Boing! Boing! Boing!`,
        desc: `After this unit has made a normal move, run or retreat, pick 1 enemy unit and roll a dice for each model in this unit that passed across a model in that unit. For each 4+, that unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Boingrot Bounderz': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Bounder Boss. Add 1 to the Attacks characteristic of that model's Pokin' Lance.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Boing! Smash!`,
        desc: `After this unit makes a charge move, pick 1 enemy unit within 1" of this unit and roll a dice for each model in this unit. For each 4+, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Lances of the Bounderz`,
        desc: `If this unit made a charge move in the same turn, add 1 to the Damage characteristic of this unit's Pokin' Lances and improve the Rend characteristic of this unit's Pokin' Lances by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sneaky Snufflers': {
    effects: [
      {
        name: `Looncap Mushrooms`,
        desc: `At the start of your movement phase, you can say that this unit is harvesting Looncap Mushrooms. If you do so, it cannot move in that movement phase, but you can make a harvesting roll by rolling a dice. Add 1 to the roll if this unit is affected by the Light of the Bad Moon. On a 1-2, nothing happens. On a 3+, you can pick 1 friendly Gloomspite Gitz unit wholly within 12" of this unit. That unit has a ward of 5+ until the start of your next hero phase. In addition, if the harvesting roll was 6+, add 1 to the Attacks characteristic of that unit's melee weapons until the start of your next hero phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Off Their 'Eads`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Squig Herd': {
    effects: [
      {
        name: `Squig Herders`,
        desc: `1 in every 6 models in this unit must be a Squig Herder. Those models are each armed with a Squig Prodder instead of a Fang-filled Gob.`,
        when: [COMBAT_PHASE],
      },
      SquigsGoneWildEffect,
      {
        name: `Herding Squigs`,
        desc: `This unit cannot receive commands. However, at the start of your hero phase, you can roll 1 dice for each Squig Herder in this unit. For each 2+, you can return D3 slain Cave Squigs to this unit. For each 1, 1 Squig Herder in this unit is slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Mangler Squigs': {
    effects: [KersplatEffect, WatchOutEffect],
  },
  'Colossal Squig': {
    effects: [
      {
        name: `Crazed Charge`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Fungoid Squig Explosion`,
        desc: `If this model is slain, before removing this model from play, roll a dice for each enemy unit within 3" of it. On a 2+, that enemy unit suffers D3 mortal wounds. Then, you can add 1 Squig Herd unit of up to 5 models to your army. Set up the Squig Herd unit wholly within 9" of this model and more than 3" from all enemy models. This model is then removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Puff Spores`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swallowed Whole`,
        desc: `If the unmodified hit roll for an attack made with this model's Enormous Jaws is 6, that attack causes D3 mortal wounds to the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Squig Gobba': {
    effects: [
      {
        name: `Arcing Spit`,
        desc: `When this model makes an attack with Spitsquigs, it can target an enemy unit that is not visible to it. In addition, add 1 to hit rolls for attacks made with Spit-squigs if the target has more than 5 models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Webspinner Shaman on Arachnarok Spider': {
    mandatory: {
      spells: [keyPicker(Spells, ['Venom of the Spider God'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 2 spells in your hero phase, and attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      ArachnarokSpiderVenomEffect,
      WallCrawlerEffect,
      {
        name: `Catchweb Spidershrine`,
        desc: `Add 1 to casting rolls and unbinding rolls for friendly Spiderfang Wizards while they are within 12" of any friendly models with this ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Scuttleboss on Gigantic Spider': {
    effects: [
      {
        name: `Spider Venom`,
        desc: `If the unmodified hit roll for an attack made by this model is 6, that attack causes 2 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      WallCrawlerEffect,
      {
        name: `'Scuttle Away!'`,
        desc: `Once per battle, at the end of the combat phase, you can say this unit will order his warriors to scuttle away. If you do so, you can pick 1 friendly Spider Riders unit wholly within 12" of this unit. This unit and the unit you picked can retreat, one after the other in the order of your choice.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Webspinner Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Speed of the Spider God'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Touched by the Spider God`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Spider Riders': {
    effects: [
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Bone Drummer. Add 1 to run rolls for this unit if it includes any Bone Drummers.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Spider Totem Bearer. Add 1 to the Bravery characteristic of this unit if it includes any Spider Totem Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Spider Rider Boss. Add 1 to the Attacks characteristic of that model's Crooked Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spider Venom`,
        desc: `If the unmodified hit roll for an attack made by this model's Giant Spider's Fangs is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      WallCrawlerEffect,
    ],
  },
  'Arachnarok Spider with Flinger': {
    effects: [
      {
        name: `Flinger`,
        desc: `The Attacks characteristic of a Flinger is equal to the number of models in the target unit, to a maximum of 20. In addition, if any attacks made with this unit's Flinger score a hit, after those attacks have been resolved, roll a dice. On a 2+, the target unit is entangled until the start of your next hero phase. While a unit is entangled, halve its Move characteristic. A unit cannot be entangled more than once at the same time.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spider Venom`,
        desc: `If the unmodified hit roll for an attack made with this model's Monstrous Fangs is 6, that attack causes 3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      WallCrawlerEffect,
    ],
  },
  'Arachnarok Spider with Spiderfang Warparty': {
    effects: [
      ArachnarokSpiderVenomEffect,
      WallCrawlerEffect,
      {
        name: `'For Da spider God!'`,
        desc: `This unit counts as 10 models for the purposes of contesting objectives.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Skitterstrand Arachnarok': {
    effects: [
      {
        name: `Spider Venom`,
        desc: `If the unmodified hit roll for an attack made with this model's Monstrous Fangs is 6, that attack causes 3 mortal wounds to the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      WallCrawlerEffect,
      {
        name: `Ambush From Beyond`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. At the end of your movement phase, you can set up any friendly units that are in ambush on the battlefield more than 9" from all enemy units. In addition, at the end of the combat phase, you can say that this unit will ambush again. If you do so, remove it from the battlefield. It is set up in ambush as a reserve unit once more.`,
        when: [DURING_SETUP],
      },
      {
        name: `Ambush From Beyond`,
        desc: `At the end of the combat phase, you can say that this unit will ambush again. If you do so, remove it from the battlefield. It is set up in ambush as a reserve unit once more.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Troggoth Hag': {
    mandatory: {
      spells: [keyPicker(Spells, ['Hag Curse'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Hag Regeneration`,
        desc: `In your hero phase, you can heal up to D6 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spell-spite`,
        desc: `Each time this model successfully unbinds a spell, you can roll a dice. On a 4+, the caster of that spell suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Terrible Stench`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dankhold Troggboss': {
    effects: [
      CrushingGripEffect,
      {
        name: `Greater Regeneration`,
        desc: `At the start of the hero phase, you can heal up to D6 wounds allocated to this unit.`,
        when: [START_OF_HERO_PHASE],
      },
      MagicalResistanceEffect,
      SquigglyBeastFollowersEffect,
      {
        name: `Shepherd of Destruction`,
        desc: `When this unit issues the All-out Attack command to a friendly Gloomspite Gitz Troggoth unit in the combat phase, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by that unit.
        
        Designer's Note: This effect is in addition to the normal effect of All-out Attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Mollog: {
    effects: [
      {
        name: `Companions`,
        desc: `Mollog is accompanied by a Bat Squig, Spiteshroom and Stalagsquig. Mollog and his companions are treated as a single model that uses the characteristics above. His companions must remain within 1" of him. Before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, you can choose to remove 1 of its companions. If you do so, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Bat Squig`,
        desc: `At the start of your shooting phase, you can pick 1 enemy unit within 18" of this unit and roll a dice. On a 2+, that enemy unit suffers 1 mortal wound. This ability cannot be used if the Bat Squig companion has been removed.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      RegenerationEffect,
      {
        name: `Spiteshroom`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 3" of this unit and roll a dice. On a 5+, subtract 1 from hit rolls for attacks made by that unit in that phase. This ability cannot be used if the Spiteshroom companion has been removed.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Stalagsquig`,
        desc: `If you choose to remove this companion, roll a dice. On a 5+, this companion is not removed, but the wound or mortal wound is still negated. This roll is not a ward roll.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Fellwater Troggoths': {
    effects: [
      RegenerationEffect,
      {
        name: `Terrible Stench`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons by enemy units while they are within 3" of any friendly units with this ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Noxious Vomit`,
        desc: `If any wounds caused by this unit's Noxious Vomit are allocated to an enemy unit and not negated, that enemy unit is drenched in vomit until the start of your next hero phase. While a unit is drenched in vomit, subtract 1 from save rolls for attacks that target that unit, and ignore positive modifiers to save rolls for attacks that target that unit. A unit cannot be drenched in vomit more than once at the same time.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Sourbreath Troggoths': {
    effects: [
      {
        name: `Regeneration`,
        desc: `In your hero phase, you can roll a dice for this unit. If you do so, on a 4+, heal up to D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Too Dumb to Die`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Rockgut Troggoths': {
    effects: [
      RegenerationEffect,
      {
        name: `Stony Skin`,
        desc: `This unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Throwin' Boulders`,
        desc: `Do not use the attack sequence for an attack made with Throwin' Boulders. Instead, pick 1 enemy unit within range and roll a dice. Add 1 to the roll if the target unit has 5 or more models. On a 4+, that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Dankhold Troggoths': {
    effects: [CrushingGripEffect, MagicalResistanceEffect, RegenerationEffect, SquigglyBeastFollowersEffect],
  },
  'Aleguzzler Gargant': {
    effects: [
      {
        name: `Drunken Stagger`,
        desc: `You can attempt a charge with this unit if it is within 18" of the enemy instead of 12". In addition, roll 3D6 instead of 2D6 when making a charge roll for this unit. However, if a charge roll for this unit includes three dice that show the same number before modifiers are applied, this unit cannot make a charge move in that phase and the players must roll off. The winner must pick a point on the battlefield 3" from this unit. Each unit within 2" of that point suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Stuff Em In Me Bag`,
        desc: `After this model piles in, you can pick 1 enemy model within 3" of this model and roll a dice. If the roll is equal to or greater than double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      ...GenericEffects.Gargant,
    ],
  },
  "Rippa's Snarlfangs": {
    effects: [
      {
        name: `Vindictive Attackers`,
        desc: `Add 1 to hit rolls and wound rolls for attacks made by this unit that target a unit that has 1 or more wounds allocated to it.`,
        when: [COMBAT_PHASE],
      },
      FerociousPounceEffect,
    ],
  },
  'Snarlfang Riders': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Gitboss. Add 1 to the Attacks characteristic of that model's Stabbin' Stikka.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Gitflag Waver. Add 1 to the Bravery characteristic of this unit if it includes any Gitflag Wavers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Horn Blaster. Add 1 to charge rolls for this unit if it includes any Horn Blasters.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `'Can't Catch Us!'`,
        desc: `When this unit receives the Redeploy command, you can reroll the dice that determines the distance it can move. In addition, immediately after this unit redeploys, it can shoot. This unit cannot receive the Unleash Hell command in the same turn it has received the Redeploy command.`,
        when: [MOVEMENT_PHASE],
      },
      FerociousPounceEffect,
      {
        name: `Smell Weakness`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Slavering Jaws that target a unit that has 1 or more wounds allocated to it.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Gobbapalooza: {
    mandatory: {
      spells: [keyPicker(Spells, ['Mesmerise', 'Fungoid Cloud'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit's Boggleye can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. In addition, this unit's Shroomancer can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase.

        Each time you take a spell lore enhancement, the spell that you pick for this unit is known by both the Boggleye and the Shroomancer. No other models in this unit can attempt to cast or unbind spells.`,
        when: [HERO_PHASE],
      },
      HallucinogenicFungusBrewsEffect,
      {
        name: `Gobbapalooza Know-wotz`,
        desc: `Once per turn in your hero phase, this unit can use its Gobbapalooza Know-wotz. If it does so, pick 1 of the following effects to apply:

        Glareface Dance: You can only pick this effect while this unit has a Scaremonger. Pick 1 friendly Gloomspite Gitz unit wholly within 12" of this unit. Add 1 to run rolls and charge rolls for that unit until the start of your next hero phase.

        Peddled Potion: You can only pick this effect while this unit has a Brewgit. Pick 1 friendly Gloomspite Gitz Hero wholly within 12" of this unit. Add 1 to hit rolls and wound rolls for attacks made with melee weapons by that unit until the start of your next hero phase.

        Nasty Poisons: You can only pick this effect while this unit has a Spiker. Pick 1 friendly Gloomspite Gitz unit wholly within 12" of this unit. Improve the Rend characteristic of that unit's weapons by 1 until the start of your next hero phase. `,
        when: [HERO_PHASE],
      },
    ],
  },
  'Grinkrak the Great': {
    effects: [
      DeadTricksyEffect,
      {
        name: `'I Dub Thee...'`,
        desc: `At the start of the combat phase, you can pick 1 other friendly Moonclan unit within 3" of this unit to be dubbed. If you do so, until the end of that phase, if any models in that unit are slain, those models can fight before they are removed from play.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "Grinkrak's Looncourt": {
    effects: [
      {
        name: `The Looncourt's Quest`,
        desc: `After this unit has been set up on the battlefield for the first time, you can pick 1 objective or 1 terrain feature in enemy territory to be the object of this unit's quest. If you gain control of that objective or terrain feature while this unit is contesting it, this unit completes its quest. Once the quest is complete, for the rest of the battle, this unit has a ward of 4+.`,
        when: [DURING_GAME],
      },
      {
        name: `Grinkrak's Toadies`,
        desc: `Before you allocate a wound or mortal wound to a friendly Grinkrak, or instead of making a ward roll for a wound or mortal wound that would be allocated to a friendly Grinkrak, if this unit is within 3" of that friendly Grinkrak, you can roll a dice. On a 1-2, that wound or mortal wound is allocated to that Grinkrak as normal. On a 3+, that wound or mortal wound is allocated to this unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Squigboss: {
    effects: [
      {
        name: `Mycophile's Pouch`,
        desc: `In your hero phase you can pick 1 friendly Squig unit within 3" of this unit to be fed a batch of shrooms. If you do so, apply 1 of the following effects to that unit. Each effect lasts until the start of your next hero phase. The same unit cannot be fed a batch of shrooms more than once in the same phase.

        Crimson Deffcap: Add 3" to that unit's Move characteristic.

        Yellow Lurka: If the unmodified hit roll for an attack made by that unit with a Fang-filled Gob, Massive Fang-filled Gob or Huge Fang-filled Gobs is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.

        Sproutin' Moon: Add 1 to the Attacks characteristic of that unit's Fang- filled Gob, Massive Fang-filled Gob or Huge Fang-filled Gobs.`,
        when: [HERO_PHASE],
      },
      {
        name: `Release Da Squigs`,
        desc: `Once per battle, at the start of your hero phase, you can say this unit will release da squigs. If you do so, each friendly Squig Herd unit wholly within 12" of this unit that has not moved this phase can make a normal move.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
