import { TCommandTraits } from 'types/army'
import {
  HERO_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  START_OF_GAME,
  END_OF_SETUP,
  DURING_SETUP,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  END_OF_COMBAT_PHASE,
  START_OF_COMBAT_PHASE,
  BATTLESHOCK_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Hammers of Sigmar`,
    effects: [
      {
        name: `We Cannot Fail`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly HAMMERS OF SIGMAR unit wholly within 9" of this general. On a 6+, that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `First to be Forged`,
        desc: `Add 1 to the Bravery characteristic of friendly HAMMERS OF SIGMAR units.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `God-forged Blade`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified hit roll for an attack made with the God-forged Blade is 6, add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Soul of the Stormhost`,
        desc: `You can use this command ability when a friendly HAMMERS OF SIGMAR REDEEMER unit is destroyed. If you do so roll a dice. On a 5+ a new unit identical to the one that was destroyed is added to your army. Set up the new unit anywhere on the battlefield, more than 9" from any enemy models.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Hallowed Knights`,
    effects: [
      {
        name: `Martyr's Strength`,
        desc: `Roll a dice if this general is slain in the combat phase. On a 2+ this general can make a pile-in move and then attack with all of the melee weapons it is armed with, before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Only the Faithful`,
        desc: `If a friendly HALLOWED KNIGHTS unit is affected by a spell or endless spell, roll a dice. On a 6+ ignore the effects of that spell on that unit.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Parchment of Purity`,
        desc: `In your hero phase, heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
        artifact: true,
      },
      {
        name: `Holy Crusaders`,
        desc: `You can use this command ability at the start of your hero phase. Pick a friendly HALLOWED KNIGHTS unit wholly within 9" of a friendly HALLOWED KNIGHTS HERO, or wholly within 18" of a friendly HALLOWED KNIGHTS HERO that is a general. Add 1 to run and charge rolls for that unit until your next hero phase. In addition, until your next hero phase, that unit can run and still charge later in the same turn.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Celestial Vindicators`,
    effects: [
      {
        name: `Single-minded Fury`,
        desc: `Each time you roll an unmodified hit roll of 6 for this general, add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Driven by Vengeance`,
        desc: `You can re-roll hit rolls of 1 for attacks made by friendly CELESTIAL VINDICATORS units if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Stormrage Blade`,
        desc: `Pick one of the bearer's melee weapons. At the start of the combat phase, you can add 2 to the Attacks characteristic of this weapon until the end of that phase. If you do so, subtract 1 from save rolls for attacks that target the bearer until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Righteous Hatred`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, you pick a friendly CELESTIAL VINDICATORS unit wholly within 9" of a friendly of a friendly CELESTIAL VINDICATORS HERO, or wholly within 18" of a friendly CELESTIAL VINDICATORS HERO that is a general. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Anvils of the Heldenhammer`,
    effects: [
      {
        name: `Deathly Aura`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `No True Death`,
        desc: `You can re-roll failed battleshock tests for friendly ANVILS OF THE HELDENHAMMER units.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Soulthief`,
        desc: `Pick one of the bearer's melee weapons. At the end of the combat phase, roll a dice for each enemy model that was allocated any wounds caused by this weapon in that combat phase. On a 3+ that model suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Heroes of Another Age`,
        desc: `You can use this command ability in your hero phase. If you do so, you pick a friendly ANVILS OF THE HELDENHAMMER unit wholly within 9" of a friendly of a friendly ANVILS OF THE HELDENHAMMER HERO, or wholly within 18" of a friendly ANVILS OF THE HELDENHAMMER HERO that is a general. That unit can attack with all the missile weapons it is armed with, or make a pile-in move and attack with all of the melee weapons it is armed with.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Knights Excelsior`,
    effects: [
      {
        name: `Divine Executioner`,
        desc: `Add 1 to the Damage characteristic of this general's melee weapons if the target is a HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Storm of Annihilation`,
        desc: `If a friendly KNIGHTS EXCELSIOR unit makes an attack that destroys an enemy unit, you can re-roll hit rolls of 1 for attacks made by that KNIGHTS EXCELSIOR unit for the rest of the battle.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Chains of Celestial Lightning`,
        desc: `Once per battle, in your hero phase, the bearer can attempt to bind an enemy HERO or MONSTER model within 3". If they do so roll 3D6. Your opponent rolls 2D6 if the target is a HERO or 3D6 if it is a MONSTER or HERO MONSTER. If your roll is higher, until your next hero phase, halve the Move characteristic, run rolls and charge rolls for that enemy model, and halve the Attacks characteristic of its melee weapons. Round any fractions up.`,
        when: [HERO_PHASE],
        artifact: true,
      },
      {
        name: `No Mercy`,
        desc: `You can use this command ability in your hero phase. If you do so, you pick a friendly KNIGHTS EXCELSIOR unit wholly within 9" of a friendly KNIGHTS EXCELSIOR HERO, or wholly within 18" of a friendly ANVILS OF THE HELDENHAMMER HERO that is a general. You can re-roll wound rolls of 1 for attacks made by that unit until the end of the turn.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Celestial Warbringers`,
    effects: [
      {
        name: `Portents and Omens`,
        desc: `Once per turn, you can re-roll 1 failed hit roll or 1 failed wound roll for an attack made by this general, or 1 save roll for an attack that targets this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Fearless Foresight`,
        desc: `At the start of the first battle round, after determining who has the first turn but before the first turn begins, you can pick D3 friendly CELESTIAL WARBRINGERS units and set them up again (any restrictions in the set-up instructions for the battleplan being used still apply).`,
        when: [START_OF_GAME],
        allegiance_ability: true,
      },
      {
        name: `Hammers of Augury`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 3" of the bearer and roll a dice. On a 3+, that unit suffers 1 mortal wound and you can roll another dice. On a 4+, that unit suffers 1 extra mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Astral Conjunction`,
        desc: `You can use this command ability in your hero phase. If you do so, you pick a friendly CELESTIAL WARBRINGER WIZARD wholly within 9" of a friendly CELESTIAL WARBRINGER HERO, or wholly within 18" of a friendly CELESTIAL WARBRINGER HERO that is a general. Add 1 to casting rolls for that unit until the end of that phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Tempest Lords`,
    effects: [
      {
        name: `Bonds of Noble Duty`,
        desc: `Add 1 to wound rolls for attacks made with this general's melee weapons while this general is within 6" of any other friendly TEMPEST LORDS units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grand Strategists`,
        desc: `At the start of your hero phase roll a dice. On a 4+ you receive 1 extra command point.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Patrician's Helm`,
        desc: `If the bearer is on the battlefield, each time you spend a command point, roll a dice. On a 5+ you receive 1 extra command point.`,
        when: [DURING_GAME],
        artifact: true,
      },
      {
        name: `Rousing Oratory`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, you pick a friendly TEMPEST LORDS unit wholly within 9" of a friendly TEMPEST LORDS HERO, or wholly within 18" of a friendly TEMPEST LORDS HERO that is a general. You can re-roll wound rolls of 1 for attacks made by that unit until your next hero phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Astral Templars`,
    effects: [
      {
        name: `Dauntless Hunters`,
        desc: `After set-up is complete, but before the battle begins, friendly ASTRAL TEMPLARS units wholly within 12" of this general can move up to 6".`,
        when: [END_OF_SETUP],
      },
      {
        name: `Beast Stalkers`,
        desc: `Add 1 to hit rolls for attacks made by ASTRAL TEMPLARS units that target a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Godbeast Plate`,
        desc: `Subtract 1 from wound rolls for attacks made by a MONSTER that target the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        artifact: true,
      },
      {
        name: `Cut off the Head`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, you pick a friendly ASTRAL TEMPLARS unit wholly within 9" of a friendly ASTRAL TEMPLARS HERO, or wholly within 18" of a friendly ASTRAL TEMPLARS HERO that is a general. Until the end of that phase, add 1 to wound rolls for attacks made by that unit that target a HERO.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Shielded by Faith (Aspects of Azyr)`,
    effects: [
      {
        name: `Shielded by Faith (Aspects of Azyr)`,
        desc: `Roll a dice each time you allocate a mortal wound to this general. On a 5+ that mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Consummate Commander (Aspects of Azyr)`,
    effects: [
      {
        name: `Consummate Commander (Aspects of Azyr)`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a dice. On a 4+ you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cunning Strategist (Aspects of Azyr)`,
    effects: [
      {
        name: `Cunning Strategist (Aspects of Azyr)`,
        desc: `After set-up is complete, but before the battle begins, D3 friendly STORMCAST ETERNAL units can move up to 5".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Zealous Crusader (Aspects of Azyr)`,
    effects: [
      {
        name: `Zealous Crusader (Aspects of Azyr)`,
        desc: `You can reroll charge rolls for this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Staunch Defender (Aspects of Azyr)`,
    effects: [
      {
        name: `Staunch Defender (Aspects of Azyr)`,
        desc: `Add 1 to save rolls for attacks that target friendly STORMCAST ETERNAL units wholly within 9" of this general if that STORMCAST ETERNAL unit has not made a charge move the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Champion of the Realms (Aspects of Azyr)`,
    effects: [
      {
        name: `Champion of the Realms (Aspects of Azyr)`,
        desc: `Pick one of this general's melee weapons. Add 1 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lithe Limbed (Mount Trait)`,
    effects: [
      {
        name: `Lithe Limbed (Mount Trait)`,
        desc: `Add 1 to the move characteristic of this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Keen-clawed (Mount Trait)`,
    effects: [
      {
        name: `Keen-clawed (Mount Trait)`,
        desc: `If the unmodified wound roll for an attack made with this mount's melee weapons is 6, that attack has a rend characteristic of -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Loyalty (Mount Trait)`,
    effects: [
      {
        name: `Savage Loyalty (Mount Trait)`,
        desc: `If this model is slain by wounds or mortal wounds inflicted by an attack made with an enemy unit's melee weapons, roll a dice. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Drake-kin (Mount Trait)`,
    effects: [
      {
        name: `Drake-kin (Mount Trait)`,
        desc: `Before determining damage for an attack that targets this model that has a Damage characteristic of any value other than 1, roll a dice. On a 5+ change the Damage characteristic of that attack to 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Thunder Caller (Mount Trait)`,
    effects: [
      {
        name: `Thunder Caller (Mount Trait)`,
        desc: `This model's Storm Breath ability has a range of 16" rather than 12".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Pack Leader (Mount Trait)`,
    effects: [
      {
        name: `Pack Leader (Mount Trait)`,
        desc: `Add 2 to the Attacks characteristic oof this model's Claws and Fangs while this model is within 6" of any friendly DRACOTHIAN GUARD models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Storm-winged (Mount Trait)`,
    effects: [
      {
        name: `Storm-winged (Mount Trait)`,
        desc: `After this model has moved, you can pick 1 enemy unit that has any models that this model passed across, and roll a dice. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Thunderlord (Mount Trait)`,
    effects: [
      {
        name: `Thunderlord (Mount Trait)`,
        desc: `The Roiling Thunderhead from this model's Lord of the Heavens ability has a range of 24" instead of 18".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Star-branded (Mount Trait)`,
    effects: [
      {
        name: `Star-branded (Mount Trait)`,
        desc: `Subtract 1 from the number of wounds allocated to this model (to a minimum of 0) when determining which row on its damage table to use.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wind Runner (Mount Trait)`,
    effects: [
      {
        name: `Wind Runner (Mount Trait)`,
        desc: `When this model Rides the Winds Aetheric, roll an extra dice when determining the distance it can move.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Aethereal Stalker (Mount Trait)`,
    effects: [
      {
        name: `Aethereal Stalker (Mount Trait)`,
        desc: `When this model is set up, choose an enemy unit. You can re-roll failed hit and wound rolls for attacks made with this model's Gryph-charger's Razor Beak and Claws that target that enemy unit.`,
        when: [DURING_SETUP, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Indefatigable (Mount Trait)`,
    effects: [
      {
        name: `Indefatigable (Mount Trait)`,
        desc: `You can re-roll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Swiftwing (Mount Trait)`,
    effects: [
      {
        name: `Swiftwing (Mount Trait)`,
        desc: `You can re-roll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Lashing Tail (Mount Trait)`,
    effects: [
      {
        name: `Lashing Tail (Mount Trait)`,
        desc: `At the end of the combat phase, you can pick an enemy unit within 3" of this model and roll a dice. On a 4+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Steel Pinions (Mount Trait)`,
    effects: [
      {
        name: `Steel Pinions (Mount Trait)`,
        desc: `Roll a dice each time a wound or mortal wound is allocated too this model. On a 6+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Bounding Leap (Mount Trait)`,
    effects: [
      {
        name: `Bounding Leap (Mount Trait)`,
        desc: `This model is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pride Leader (Mount Trait)`,
    effects: [
      {
        name: `Pride Leader (Mount Trait)`,
        desc: `Add 1 to hit rolls for attacks made by friendly DRACOLINE units while they are wholly within 9" of this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ear-bursting Roar (Mount Trait)`,
    effects: [
      {
        name: `Ear-bursting Roar (Mount Trait)`,
        desc: `At the start of the combat phase you can pick an enemy unit within 3" oof this model and roll a dice. On a 4+ subtract 1 from hit rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
