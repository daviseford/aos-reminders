import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_FOUR_START_OF_ROUND,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const ThundertuskEffects = [
  {
    name: `Blasts of Frost-wreathed Ice`,
    desc: `Do not use the attack sequence for an attack made with Frost-wreathed Ice. Instead, pick 1 enemy unit within 18" of this model that is visible to it and roll the number of dice shown on the damage table on the warscroll.

    Add 1 to each roll if the target unit has 10 or more models.
    Add 2 to each roll instead if the target unit has 20 or more models.

    For each 6+, that enemy unit suffers 1 mortal wound.`,
    when: [SHOOTING_PHASE],
  },
  {
    name: `Numbing Chill`,
    desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
    when: [COMBAT_PHASE],
  },
]
const StonehornEffects = [
  {
    name: `Earth-shattering Charge`,
    desc: `Add 1 to the damage inflicted by attacks made with this model's Rock-hard Horns and Crushing Hooves if this model made a charge move in the same turn.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Stone Skeleton`,
    desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
]
const IronfistEffect = {
  name: `Ironfist`,
  desc: `If the unmodified save roll for an attack made with a melee weapon that targets a unit armed with Ironfists is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
  when: [COMBAT_PHASE],
}
const BellowerEffect = {
  name: `Bellower`,
  desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any Bellowers.`,
  when: [BATTLESHOCK_PHASE],
}
const RhinoxChargeEffect = {
  name: `Rhinox Charge`,
  desc: `Add 1 to the damage inflicted by attacks made with this model's Rhinox's Sharp Horns if this model made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
}
const BloodVultureEffect = {
  name: `Blood Vulture`,
  desc: `If this model is armed with a Blood Vulture, at the start of your shooting phase, pick 1 enemy unit within 30" of this model that is visible to it and roll a D6. On a 2+, that unit suffers 1 mortal wound.`,
  when: [START_OF_SHOOTING_PHASE],
}
const BellowingVoiceEffect = {
  name: `Bellowing Voice`,
  desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, you can reroll charge rolls for friendly Beastclaw Raiders units that are wholly within 12" of that model when the charge roll is made.`,
  when: [START_OF_CHARGE_PHASE],
  command_ability: true,
}
const BloodgruelEffect = {
  name: `Bloodgruel`,
  desc: `Roll a D6 each time this model successfully casts or unbinds a spell, after the effects of the spell have been resolved. On a 2+, you can heal 1 wound allocated to this model. On a 1, this model suffers 1 mortal wound.`,
  when: [HERO_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Butcher`,
    effects: [
      BloodgruelEffect,
      {
        name: `Voracious Maw`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. After resolving any damage, roll a D6. On a 1, 2 or 3, the maw is said to be satisfied and the spell ends. On a 4+, the target unit suffers D3 additional mortal wounds. Keep repeating this process until the maw is satisfied or the target unit is destroyed.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Firebelly`,
    effects: [
      {
        name: `Fire Breath`,
        desc: `Do not use the attack sequence for an attack made with Fire Breath. Instead, pick 1 enemy unit that is within range of the attack and roll a D6. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Cascading Fire-cloak`,
        desc: `Casting value of 6. Roll 1 dice for each enemy unit within 3" of the caster. On a 4+, that enemy unit suffers D3 mortal wounds. In addition, if this spell is successfully cast, add 1 to save rolls for attacks that target this model until the start of your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Frost Sabres`,
    effects: [
      {
        name: `Their Master's Voice`,
        desc: `Add 3 to charge rolls for this unit if it is wholly within 16" of a friendly Icebrow Hunter when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Their Master's Voice`,
        desc: `Add 2 to the Bravery characteristic of this unit while it is wholly within 16" of a friendly Icebrow Hunter.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Frostlord on Stonehorn`,
    effects: [...StonehornEffects, BellowingVoiceEffect],
  },
  {
    name: `Frostlord on Thundertusk`,
    effects: [...ThundertuskEffects, BellowingVoiceEffect],
  },
  {
    name: `Gnoblar Scraplauncher`,
    effects: [
      RhinoxChargeEffect,
      {
        name: `Deadly Rain of Scrap`,
        desc: `Add 1 to hit rolls and increase the Damage characteristic to D6 for attacks made with Piles of Old Scrap if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Gnoblars`,
    effects: [
      {
        name: `Groinbiter`,
        desc: `1 model in this unit can be a Groinbiter. Add 1 to the Attacks characteristic of that model's Motley Assortment of Weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Screeching Horde`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while it has 10 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Trappers`,
        desc: `Roll 1 dice for each enemy unit that is within 3" of a model from this unit after that enemy unit finishes a charge move. On a 6, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Gorgers`,
    effects: [
      {
        name: `Ambushing Hunters`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Ambushing Hunters`,
        desc: `If you set this unit up in reserve, at the end of your first movement phase, you must set up this unit on the battlefield more than 9" from any enemy units.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Insatiable Hunger`,
        desc: `You can reroll charge rolls for this unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Huskard on Stonehorn`,
    effects: [
      ...StonehornEffects,
      BloodVultureEffect,
      {
        name: `Line-breakers`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Mournfang Pack unit that made a charge move in the same turn and is wholly within 12" of a model with this command ability. If you use that unit's Mournfang Charge ability in that phase, add 2 to the damage inflicted by attacks made with that unit's Tusks instead of 1.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Huskard on Thundertusk`,
    effects: [
      ...ThundertuskEffects,
      BloodVultureEffect,
      {
        name: `Blizzard Speaker`,
        desc: `In your hero phase, this model can chant one of the following prayers. If it does so, pick one of the prayers and then make a prayer roll by rolling a dice. Add 1 to the roll for each other friendly Thundertusk within 18" of this model. On a 1-3, the prayer is not answered. On a 4+, the prayer is answered.

        Winter's Endurance: If this prayer is answered, pick 1 friendly Beastclaw Raiders unit wholly within 18" of this model. You can heal D3 wounds allocated to that unit.

        Winter's Strength: If this prayer is answered, pick 1 friendly Beastclaw Raiders unit wholly within 18" of this model. Until the start of your next hero phase, add 1 to wound rolls for attacks made with melee weapons by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Icebrow Hunter`,
    effects: [
      {
        name: `Masters of Ambush`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. If you do so, when you would set up a friendly Frost Sabres unit, instead of setting up that unit on the battlefield, you can say that it is joining this model in ambush as a reserve unit. 1 unit can join this model in this way.`,
        when: [DURING_SETUP],
      },
      {
        name: `Masters of Ambush`,
        desc: `If you set this model up in reserve, at the end of your movement phase, you can set up this model anywhere on the battlefield that is more than 9" from any enemy units. You can then set up any unit that joined this model in ambush wholly within 12" of this model and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Masters of Ambush`,
        desc: `Any reserve units in ambush that are not set up on the battlefield before the start of the fourth battle round are destroyed.`,
        when: [TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Mighty Throw`,
        desc: `This model can run and still shoot with its Great Throwing Spear later in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Mighty Throw`,
        desc: `This model can run and still shoot with its Great Throwing Spear later in the same turn. In addition, this model's Great Throwing Spear has a Damage characteristic of D6 instead of D3 and a Range characteristic of 18" instead of 9" if it ran in the same turn.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Icy Breath`,
        desc: `In your shooting phase, you can say that this model will attack with its Icy Breath instead of attacking with its missile weapons. If you do so, pick 1 enemy unit within 6" of this model that is visible to it and roll a D6. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Lead the Skal`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Frost Sabres unit that is wholly within 12" of a friendly model with this command ability. Until the end of that phase, add 1 to the Attacks characteristics of that unit's melee weapons.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Icefall Yhetees`,
    effects: [
      {
        name: `Aura of Frost`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bounding Leaps`,
        desc: `This unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Invigorated by the Blizzard`,
        desc: `This unit can run and still charge later in the same turn if it is wholly within 16" of a friendly Thundertusk when the charge roll is made.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Ironblaster`,
    effects: [
      {
        name: `Lethal Payload`,
        desc: `Before attacking with an Ironblaster Cannon, choose either the Cannon Ball or Hail Shot missile weapon characteristics for that shooting attack.`,
        when: [SHOOTING_PHASE],
      },
      RhinoxChargeEffect,
    ],
  },
  {
    name: `Ironguts`,
    effects: [
      {
        name: `Gutlord`,
        desc: `1 model in this unit can be a Gutlord. Add 1 to the Attacks characteristic of that model's Mighty Bashing Weapon.`,
        when: [COMBAT_PHASE],
      },
      BellowerEffect,
      {
        name: `Rune Maw Bearer`,
        desc: `If an enemy unit fails a battleshock test within 6" of any Rune Maw Bearers, you can roll a D6. On a 6, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Rune Maw Bearer`,
        desc: `Each time a unit with any Rune Maw Bearers is affected by a spell or endless spell, you can roll a D6. If you do so, on a 6, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Down to the Ironguts`,
        desc: `Once per battle, in your hero phase, if at least 1 Ogor model from your army has fled the battle, you can use this ability. If you do so, you can reroll hit, wound and save rolls of 1 for this unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Leadbelchers`,
    effects: [
      {
        name: `Thunderfist`,
        desc: `1 model in this unit can be a Thunderfist. Add 1 to the Attacks characteristic of that model's Bludgeoning Blow.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thunderous Blasts of Hot Metal`,
        desc: `This unit's Leadbelcher Guns have an Attacks characteristic of D6 instead of D3 if this unit did not make a move in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Maneaters`,
    effects: [
      {
        name: `Been There, Done That`,
        desc: `After armies have been set up but before the first battle round begins, pick 1 ability to apply to this unit from the following list:

        Brawlers: You can reroll hit rolls of 1 for attacks made with melee weapons by this unit.

        Crack Shots: You can reroll hit rolls of 1 for attacks made with missile weapons by this unit.

        Striders: This unit can run and still charge later in the same turn.

        Stubborn: Do not take battleshock tests for this unit.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Brawlers`,
        desc: `If you selected this ability, you can reroll hit rolls of 1 for attacks made with melee weapons by this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crack Shots`,
        desc: `If you selected this ability, you can reroll hit rolls of 1 for attacks made with missile weapons by this unit.`,
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
  {
    name: `Mournfang Pack`,
    effects: [
      {
        name: `Horn Blower`,
        desc: `1 in every 4 models in this unit can be a Horn Blower. Add 1 to charge rolls for this unit while it includes any Horn Blowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Banner Bearer`,
        desc: `1 in every 4 models in this unit can be a Banner Bearer. Add 1 to the Bravery characteristic of this unit while it includes any Banner Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      IronfistEffect,
      {
        name: `Mournfang Charge`,
        desc: `Add 1 to the damage inflicted by attacks made with this unit's Tusks if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ogor Gluttons`,
    effects: [
      {
        name: `Crusher`,
        desc: `1 model in this unit can be a Crusher. Add 1 to the Attacks characteristic of that model's Club(s) or Blade(s).`,
        when: [COMBAT_PHASE],
      },
      BellowerEffect,
      {
        name: `Beast Skull Bearer`,
        desc: `You can reroll charge rolls for this unit while it includes any Beast Skull Bearers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Tribal Banner Bearer`,
        desc: `Add 1 to the Bravery characteristic of this unit while it includes any Tribal Banner Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Lookout Gnoblar`,
        desc: `Roll a D6 each time you allocate a wound inflicted by a missile weapon to a unit that includes any Lookout Gnoblars. On a 6, that wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Paired Clubs or Blades`,
        desc: `If the unmodified hit roll for an attack made with paired Clubs or Blades is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      IronfistEffect,
    ],
  },
  {
    name: `Slaughtermaster`,
    effects: [
      BloodgruelEffect,
      {
        name: `Great Cauldron`,
        desc: `In your hero phase, you can say that this model will reach into its cauldron and feast on the contents. If you do so, roll a D6 and consult the table below.

        1: Bad Meat: This model suffers D3 mortal wounds.

        2: Troggoth Guts: You can heal D3 wounds allocated to this model. In addition, you can heal 1 wound allocated to each friendly Ogor unit wholly within 12" of this model.

        3-4: Spinemarrow: Pick a friendly Ogor unit wholly within 12" of this model. Add 1 to hit rolls for attacks made with melee weapons by that unit until the start of your next hero phase.

        5-6: Bonecrusher: Roll a D6 for each enemy unit within 6" of this model. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rockchomper`,
        desc: `Casting value of 5. Pick 1 friendly unit of Ogor Gluttons wholly within 18" of the caster that is visible to them. Until the start of your next hero phase, if the unmodified wound roll for an attack made with that unit's Gulping Bite is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage and that unit can heal 1 wound allocated to it.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Stonehorn Beastriders`,
    effects: [...StonehornEffects, BloodVultureEffect],
  },
  {
    name: `Thundertusk Beastriders`,
    effects: [...ThundertuskEffects, BloodVultureEffect],
  },
  {
    name: `Tyrant`,
    effects: [
      {
        name: `Beastskewer Glaive`,
        desc: `If the unmodified hit roll for an attack made with a Beastskewer Glaive that targets a HERO or MONSTER is 6, the Beastskewer Glaive has a Damage characteristic of D6 instead of D3 for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Thundermace`,
        desc: `If the unmodified hit roll for an attack made with a Thundermace is 6, that attack inflicts 1 mortal wound in addition to any normal damage. If the target unit has more than 3 models, on an unmodified 6, that attack inflicts D3 mortal wounds instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bully of the First Degree`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly Gutbusters unit within 3" of a friendly model with this command ability. That unit suffers D3 mortal wounds, but you do not have to take battleshock tests for that unit for the rest of the battle.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Hrothgorn's Mantrappers`,
    effects: [
      {
        name: `Shivering Gnoblars`,
        desc: `This unit is not considered a Beastclaw Raiders unit for the purposes of the 'Grasp of the Everwinter' battle trait.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Hidden Trap`,
        desc: `At the start of the first hero phase, if this unit is in your army, you can pick 1 terrain feature or objective that is not wholly within enemy territory and say that it is trapped. If you do so, place 1 Bushwakka's Trap marker next to that terrain feature or objective.

      The first time a unit finishes a move within 1" of the trapped terrain feature or objective, roll a D6. On a 2+, that unit suffers D6 mortal wounds and the Bushwakka's Trap marker is removed.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
      {
        name: `Here You Go Boss!`,
        desc: `While a friendly HROTHGORN is within 3" of this unit while it includes Quiv, add 1 to the Attacks characteristic of his Trap Launcher.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Hrothgorn`,
    effects: [
      {
        name: `Masters of Ambush`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. If you do so, when you would set up a friendly Hrothgorn's Mantrappers unit, instead of setting up that unit on the battlefield, you can say that it is joining this model in ambush as a reserve unit. 1 unit can join this model in this way.`,
        when: [DURING_SETUP],
      },
      {
        name: `Masters of Ambush`,
        desc: `At the end of your movement phase, you can set up this model anywhere on the battlefield more than 9" from any enemy units; then set up any unit that joined this model wholly within 12" of this model and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Masters of Ambush`,
        desc: `Any reserve units in ambush that are not set up on the battlefield before the start of the fourth battle round are destroyed.`,
        when: [TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Thrafnir`,
        desc: `The first time this model is set up on the battlefield, you can set up a Frost Sabres unit consisting of a single model on the battlefield and add it to your army. Set up the Frost Sabre wholly within 3" of this model and more than 9" from any enemy units.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
    ],
  },
]

export const AlliedUnits: TUnits = []

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Gutbuster Warglutt`,
    effects: [
      {
        name: `The Mawpath`,
        desc: `At the start of your hero phase in the first battle round, each friendly unit from this battalion can make a move of D6". Roll separately for each unit.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Tyrant's Gutguard`,
    effects: [
      {
        name: `Wall of Fat`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly TYRANT from this battalion while it is within 3" of a friendly IRONGUTS unit from this battalion. On a 4+, that wound or mortal wound is negated. That unit of IRONGUTS then suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Goremand`,
    effects: [
      {
        name: `The Tyrant's Butcher`,
        desc: `The SLAUGHTERMASTER from this battalion can use its Great Cauldron ability twice in each of your hero phases instead of once.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Butcher's Band`,
    effects: [
      {
        name: `Well-fed Warriors`,
        desc: `At the start of your hero phase, you can heal 1 wound allocated to each friendly unit from this battalion that is wholly within 12" of the BUTCHER from this battalion.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Junkmob`,
    effects: [
      {
        name: `Don't Eat Me, Boss!`,
        desc: `Add 1 to the Attacks characteristic of Piles of Old Scrap used by any GNOBLAR SCRAPLAUNCHERS from this battalion while they are within 3" of any GNOBLAR units from this battalion that have 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Alfrostun`,
    effects: [
      {
        name: `Alfrostun Avalanche`,
        desc: `When using the Grasp of the Everwinter battle trait and rolling a dice for each enemy unit within 3" of a unit from this battalion, subtract 1 from the roll.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Jorlbad`,
    effects: [
      {
        name: `Tip of the Hunting Spear`,
        desc: `At the start of your hero phase in the first battle round, each friendly unit from this battalion can make a move of D6". Roll separately for each unit.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Eurlbad`,
    effects: [
      {
        name: `Crush, Mangle, Tenderise`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon used by a model from this battalion is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Torrbad`,
    effects: [
      {
        name: `Heat-numbing Chill`,
        desc: `At the start of your hero phase, roll 1 dice for each enemy unit within 3" of any units from this battalion. On a 2+, that unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Skal`,
    effects: [
      {
        name: `Hunting Pack`,
        desc: `Add 1 to charge rolls for units from this battalion while they are wholly within 12" of another unit from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Kin-eater's Bully Boys`,
    effects: [
      {
        name: `Bully Boys`,
        desc: `You can reroll charge rolls for units from this battalion while they are wholly within 12" of the TYRANT from the same battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
]
