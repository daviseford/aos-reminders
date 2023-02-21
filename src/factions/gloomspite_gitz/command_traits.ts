import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_TURN,
  HERO_PHASE,
  START_OF_SETUP,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  // 'Cunning Plans': {
  //   effects: [
  //     {
  //       name: `Cunning Plans`,
  //       desc: `At the start of the first battle round, you receive 1 additional command point.`,
  //       when: [TURN_ONE_START_OF_ROUND],
  //     },
  //   ],
  // },
  'Fight Another Day': {
    effects: [
      {
        name: `Fight Another Day`,
        desc: `LOONBOSS only. Each time this general fights, after all of their attacks have been resolved, they can make a 2D6" move. If they do so, they must finish the move more than 3" from all enemy units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Sneaky Stabba': {
  //   effects: [
  //     {
  //       name: `Sneaky Stabba`,
  //       desc: `You can reroll wound rolls for attacks made with melee weapons by this general.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // "Tough 'n' Leathery": {
  //   effects: [
  //     {
  //       name: `Tough 'n' Leathery`,
  //       desc: `Add 2 to this general's Wounds characteristic.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // 'Dead Shouty': {
  //   effects: [
  //     {
  //       name: `Dead Shouty`,
  //       desc: `Once per battle round, this general can use a command ability on their warscroll without a command point being spent.`,
  //       when: [DURING_ROUND],
  //     },
  //   ],
  // },
  'The Clammy Hand': {
    effects: [
      {
        name: `The Clammy Hand`,
        desc: `If this general is within 12" of a Bad Moon Loonshrine in your army at the end of your turn, you can use the Bad Moon Loonshrine's Moonclan Lair scenery rule 2 times at the end of that turn.`,
        when: [END_OF_TURN],
      },
    ],
  },
  // 'Low Cunning': {
  //   effects: [
  //     {
  //       name: `Low Cunning`,
  //       desc: `At the start of the first battle round, you receive 1 additional command point.`,
  //       when: [TURN_ONE_START_OF_ROUND],
  //     },
  //   ],
  // },
  // 'Spiteful Git': {
  //   effects: [
  //     {
  //       name: `Spiteful Git`,
  //       desc: `Roll a D6 each time a wound or mortal wound is allocated to this model. On a 4+ the unit that inflicted the wound or mortal wound suffers 1 mortal wound. On a 6, it suffers D3 mortal wounds instead.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  // 'Great Shaman': {
  //   effects: [
  //     {
  //       name: `Great Shaman`,
  //       desc: `This general knows 1 extra spell from the Lore of the Moonclans.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Dodgy Character': {
  //   effects: [
  //     {
  //       name: `Dodgy Character`,
  //       desc: `Reroll successful hit rolls for attacks that target this general.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // 'Boss Shaman': {
  //   mandatory: {
  //     command_abilities: [keyPicker(CommandAbilities, ["I'm Da Boss, Now Stab 'Em Good!"])],
  //   },
  //   effects: [
  //     {
  //       name: `Boss Shaman`,
  //       desc: `This general has the I'm Da Boss, Now Stab 'Em Good! command ability from the Loonboss warscroll.`,
  //       when: [START_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Loon-touched': {
    effects: [
      {
        name: `Loon-touched`,
        desc: `WIZARD only. This general can cast 1 additional spell in each of your hero phases while they are affected by the Light of the Bad Moon.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Supa-nasty Venom': {
    effects: [
      {
        name: `Supa-nasty Venom`,
        desc: `SPIDERFANG HERO with mount only. Double the number of mortal wounds that are inflicted by this general's Spider Venom ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Squig Whisperer': {
    effects: [
      {
        name: `Squig Whisperer`,
        desc: `SQUIG HERO with mount only. Add 1 to hit rolls and wound rolls for attacks made by this general's mount.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Monstrous Mount': {
  //   effects: [
  //     {
  //       name: `Monstrous Mount`,
  //       desc: `Double the number of mortal wounds that are inflicted by this general's Spider Venom ability.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Masterful Spider Rider': {
  //   effects: [
  //     {
  //       name: `Masterful Spider Rider`,
  //       desc: `Add 4" to this general's Move characteristic.`,
  //       when: [MOVEMENT_PHASE],
  //     },
  //   ],
  // },
  // 'Ululating Battle Cry': {
  //   effects: [
  //     {
  //       name: `Ululating Battle Cry`,
  //       desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 9" of this general.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // 'Creeping Assault': {
  //   effects: [
  //     {
  //       name: `Creeping Assault`,
  //       desc: `Enemy units do not receive the benefit of cover against attacks made by friendly SPIDERFANG units while the friendly unit is wholly within 12" of this general.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Tough as Rocks': {
  //   effects: [
  //     {
  //       name: `Tough as Rocks`,
  //       desc: `Add 2 to this general's Wounds characteristic.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  'Alpha Trogg': {
    effects: [
      {
        name: `Alpha Trogg`,
        desc: `Add 2 to this general's Wounds characteristic. In addition, this general gains the MONSTER keyword.`,
        when: [WOUND_ALLOCATION_PHASE, DURING_GAME],
      },
    ],
  },
  'Trogg Smash': {
    effects: [
      {
        name: `Trogg Smash`,
        desc: `Once per battle, when this general fights, after all of their attacks have been resolved, you can say they will perform a Trogg Smash. If you do so, roll a dice for each enemy unit within 3" of this general. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Loonskin: {
    effects: [
      {
        name: `Loonskin`,
        desc: `If your general has this command trait, you can include 1 of the following endless spells in your army without spending any points to do so: Mork's Mighty Mushroom, Scuttletide or Malevolent Moon. In addition, in your hero phase, this general can attempt to cast the spell that summons that endless spell in the same manner as a WIZARD.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Loonskin`,
        desc: `In your hero phase, this general can attempt to cast the spell that summons that endless spell in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Pulverising Grip': {
  //   effects: [
  //     {
  //       name: `Pulverising Grip`,
  //       desc: `When you use this general's Crushing Grip ability, you can reroll the dice that determines if the target is slain.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Mighty Blow': {
  //   effects: [
  //     {
  //       name: `Mighty Blow`,
  //       desc: `You can reroll the dice that determines the Damage characteristic of this general's Boulder Club.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Realmstone-studded Hide': {
  //   effects: [
  //     {
  //       name: `Realmstone-studded Hide`,
  //       desc: `When you use this general's Magical Resistance ability, you can reroll the dice that determines if the spell's effects are ignored.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // Jaws of Mork
  // 'Envoy of the Overbounder': {
  //   effects: [
  //     {
  //       name: `Envoy of the Overbounder`,
  //       desc: `You can reroll failed battleshock tests for friendly JAWS OF MORK units wholly within 12" of this general.`,
  //       when: [BATTLESHOCK_PHASE],
  //       rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
  //     },
  //   ],
  // },
  // Glogg's Megamob
  // 'Shepherd of Idiotic Destruction': {
  //   effects: [
  //     {
  //       name: `Shepherd of Idiotic Destruction`,
  //       desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point.`,
  //       when: [START_OF_HERO_PHASE],
  //       rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
  //     },
  //   ],
  // },
  // Grimscuttle Tribes
  // 'Prophet of da Spider God': {
  //   effects: [
  //     {
  //       name: `Prophet of da Spider God`,
  //       desc: `Once per battle in the combat phase, you can say that this general will unleash their battle cry. If you do so, friendly GRIMSCUTTLE SPIDERFANG models are treated as being affected by the light of the Bad Moon until the end of that phase.`,
  //       when: [COMBAT_PHASE],
  //       rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
  //     },
  //   ],
  // },
}

export default tagAs(CommandTraits, 'command_trait')
