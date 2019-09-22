import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Hammers of Sigmar (Stormhost)`,
    effects: [
      {
        name: `We Cannot Fail`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly HAMMERS OF SIGMAR unit wholly within 9" of this general. On a 6+, that wound or mortal wound is negated.`,
        when: [DURING_GAME],
        command_trait: true,
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
        desc: `You can use this command ability when a friendly HAMMERS OF SIGMAR REDEEMER unit is destroyed. If you do so roll a D6. On a 5+ a new unit identical to the one that was destroyed is added to your army. Set up the new unit anywhere on the battlefield, more than 9" from any enemy models. Cannot use more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Hallowed Knights (Stormhost)`,
    effects: [
      {
        name: `Martyr's Strength`,
        desc: `Roll a D6 if this general is slain in the combat phase. On a 2+ this general can make a pile-in move and then attack with all melee weapons, before it is removed from play.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Only the Faithful`,
        desc: `If a friendly HALLOWED KNIGHTS unit is affected by a spell or endless spell, roll a D6. On a 6+ ignore the effects of that spell on that unit.`,
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
    name: `Celestial Vindicators (Stormhost)`,
    effects: [
      {
        name: `Single-minded Fury`,
        desc: `Each time you roll an unmodified hit roll of 6 for this general, add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Driven by Vengeance`,
        desc: `You can re-roll hit rolls of 1 for attacks made by friendly CELESTIAL VINDICATORS units if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Stormrage Blade`,
        desc: `Pick one of the bearer's melee weapons. At the start of the combat phase, you can add 2 to the Attacks of this weapon until the end of that phase. If you do so, subtract 1 from save rolls for attacks that target the bearer until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Righteous Hatred`,
        desc: `Pick a friendly CELESTIAL VINDICATORS unit wholly within 9" of a friendly of a friendly CELESTIAL VINDICATORS HERO, or wholly within 18" of a friendly CELESTIAL VINDICATORS HERO that is a general. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase. Same unit cannot benefit more than once per hero phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Anvils of the Heldenhammer (Stormhost)`,
    effects: [
      {
        name: `Deathly Aura`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `No True Death`,
        desc: `You can re-roll failed battleshock tests for friendly ANVILS OF THE HELDENHAMMER units.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Soulthief`,
        desc: `Pick one of the bearer's melee weapons. At the end of the combat phase, roll a D6 for each enemy model that was allocated any wounds caused by this weapon in that combat phase. On a 3+ that model suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Heroes of Another Age`,
        desc: `Pick a friendly ANVILS OF THE HELDENHAMMER unit wholly within 9" of a friendly of a friendly ANVILS OF THE HELDENHAMMER HERO, or wholly within 18" of a friendly ANVILS OF THE HELDENHAMMER HERO that is a general. That unit can attack with all the missile weapons it is armed with, or make a pile-in move and attack with all of the melee weapons it is armed with. Same unit cannot benefit more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Knights Excelsior (Stormhost)`,
    effects: [
      {
        name: `Divine Executioner`,
        desc: `Add 1 to the Damage characteristic of this general's melee weapons if the target is a HERO.`,
        when: [COMBAT_PHASE],
        command_trait: true,
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
        desc: `Pick a friendly KNIGHTS EXCELSIOR unit wholly within 9" of a friendly KNIGHTS EXCELSIOR HERO, or wholly within 18" of a friendly ANVILS OF THE HELDENHAMMER HERO that is a general. You can re-roll wound rolls of 1 for attacks made by that unit until the end of the turn.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Celestial Warbringers (Stormhost)`,
    effects: [
      {
        name: `Portents and Omens`,
        desc: `Once per turn, you can re-roll 1 failed hit roll or 1 failed wound roll for an attack made by this general, or 1 save roll for an attack that targets this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Fearless Foresight`,
        desc: `Pick D3 friendly CELESTIAL WARBRINGERS units and set them up again (any restrictions in the set-up instructions for the battleplan being used still apply).`,
        when: [START_OF_GAME],
        allegiance_ability: true,
      },
      {
        name: `Hammers of Augury`,
        desc: `Pick 1 enemy unit within 3" of the bearer and roll a D6. On a 3+, that unit suffers 1 mortal wound and you can roll another dice. On a 4+, that unit suffers 1 extra mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Astral Conjunction`,
        desc: `Pick a friendly CELESTIAL WARBRINGER WIZARD wholly within 9" of a friendly CELESTIAL WARBRINGER HERO, or wholly within 18" of a friendly CELESTIAL WARBRINGER HERO that is a general. Add 1 to casting rolls for that unit until the end of that phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Tempest Lords (Stormhost)`,
    effects: [
      {
        name: `Bonds of Noble Duty`,
        desc: `Add 1 to wound rolls for attacks made with this general's melee weapons while this general is within 6" of any other friendly TEMPEST LORDS units.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Grand Strategists`,
        desc: `At the start of your hero phase roll a D6. On a 4+ you receive 1 extra command point.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Patrician's Helm`,
        desc: `If the bearer is on the battlefield, each time you spend a command point, roll a D6. On a 5+ you receive 1 extra command point.`,
        when: [DURING_GAME],
        artifact: true,
      },
      {
        name: `Rousing Oratory`,
        desc: `Pick a friendly TEMPEST LORDS unit wholly within 9" of a friendly TEMPEST LORDS HERO, or wholly within 18" of a friendly TEMPEST LORDS HERO that is a general. You can re-roll wound rolls of 1 for attacks made by that unit until your next hero phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Astral Templars (Stormhost)`,
    effects: [
      {
        name: `Dauntless Hunters`,
        desc: `After set-up is complete, but before the battle begins, friendly ASTRAL TEMPLARS units wholly within 12" of this general can move up to 6".`,
        when: [END_OF_SETUP],
        command_trait: true,
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
        desc: `Pick a friendly ASTRAL TEMPLARS unit wholly within 9" of a friendly ASTRAL TEMPLARS HERO, or wholly within 18" of a friendly ASTRAL TEMPLARS HERO that is a general. Until the end of that phase, add 1 to wound rolls for attacks made by that unit that target a HERO.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
]

export default Allegiances
