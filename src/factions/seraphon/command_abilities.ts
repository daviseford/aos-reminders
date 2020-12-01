import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandAbilities = {
  'Parting Shot': {
    effects: [
      {
        name: `Parting Shot`,
        desc: `You can use this command ability when an enemy unit ends a charge move within 3" of a friendly FANGS OF SOTEK unit from the Skinks or Chameleon Skinks warscroll that is wholly within 18" of a friendly FANGS OF SOTEK HERO. If you do so, that unit can shoot. After you have resolved all of that unit's shooting attacks, roll a D6. On a 4+, that unit must retreat but cannot run. A unit cannot benefit from this command ability more than once per phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Controlled Fury': {
    effects: [
      {
        name: `Controlled Fury`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly KOATL'S CLAW SAURUS unit wholly within 24" of a friendly KOATL'S CLAW SAURUS HERO. That unit counts as having made a charge move in that turn for the purposes of the Savagery Incarnate ability.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Trove of Old One Technology': {
    effects: [
      {
        name: `Trove of Old One Technology`,
        desc: `You can use this command ability at the end of your shooting phase. If you do so, pick 1 friendly THUNDER LIZARDBASTILADON, or friendly THUNDER LIZARDENGINE OF THE GODS, that is wholly within 18" of a friendly THUNDER LIZARD HERO. If that unit is a BASTILADON, it can shoot with its Solar Engine even if it has already done so in that phase. If that unit is an ENGINE OF THE GODS, you can make a cosmic engine roll for it even if you have already done so in that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_SHOOTING_PHASE],
      },
    ],
  },

  'Saurian Savagery': {
    effects: [
      {
        name: `Saurian Savagery`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly SAURUS unit wholly within 18" of a friendly model with this command ability, Until the end of that phase, if the unmodified hit roll for an attack made with a melee weapon by that friendly SAURUS unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },

  'Wrath of the Seraphon': {
    effects: [
      {
        name: `Wrath of the Seraphon`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly SAURUS unit wholly within 18" of a friendly model with this command ability. Until the end of that phase, you can add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },

  'Gift from the Heavens': {
    effects: [
      {
        name: `Gift from the Heavens`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly SERAPHON unit wholly within 18" of a friendly model with this command ability Until your next hero phase, that unit can fly and you can add 1 to save rolls for attacks made with missile weapons that target that unit. You can only use this command ability once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  'Prime Guardian': {
    effects: [
      {
        name: `Prime Guardian`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly SAURUS GUARD unit wholly within 18" of a friendly model with this command ability. Until the end of that phase, you can add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },

  'Scent of Weakness': {
    effects: [
      {
        name: `Scent of Weakness`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 enemy unit within 12" of a friendly model with this command ability, Until the end of that phase, add 1 to wound rolls for attacks made by friendly SAURUS models that target that enemy unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },

  'Herald of the Old Ones': {
    effects: [
      {
        name: `Herald of the Old Ones`,
        desc: `You can use this command ability in your hero phase, If you do so, pick 1 friendly SKINK unit wholly within 18" of a friendly model with this command ability. Until your next hero phase, you can add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },

  'Coordinated Attack': {
    effects: [
      {
        name: `Coordinated Attack`,
        desc: `You can this command ability when a friendly TERRADON RIDERS unit uses its Deadly Cargo ability while it is wholly within 12" of a friendly model with this command ability. If you do so, the enemy unit suffers D3 mortal wounds for each 2+ instead of each 4+.`,
        when: [MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },

  'Ripperdactyl Assault': {
    effects: [
      {
        name: `Ripperdactyl Assault`,
        desc: `You can this command ability at the start of the combat phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly RIPPERDACTYL units that are wholly within 18" of that model. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },

  'Coordinated Strike': {
    effects: [
      {
        name: `Coordinated Strike`,
        desc: `You can this command ability at the start of the combat phase. If you do so, pick 1 friendly SKINK unit wholly within 24" of a friendly STEGADON HERO with this command ability. Until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by that SKINK unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
