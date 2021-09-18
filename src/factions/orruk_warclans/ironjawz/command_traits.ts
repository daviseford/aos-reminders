import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, HERO_PHASE } from 'types/phases'

const IronjawzCommandTraits = {
  'Hulking Brute': {
    effects: [
      {
        name: `Hulking Brute`,
        desc: `After this general makes a charge move, you can pick 1 enemy unit within 1" of them and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Mega Bossy': {
    effects: [
      {
        name: `Mega Bossy`,
        desc: `This general can issue the Mighty Destroyers command even if it has already been issued by another friendly model in the same phase.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Mighty Waaagh! Leader': {
    effects: [
      {
        name: `Mighty Waaagh! Leader`,
        desc: `If this general calls an Ironjawz Waaagh!, you can reroll charge rolls for friendly IRONJAWZ units wholly within 12" of them until the end of that turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Touched by the Waaagh!': {
    effects: [
      {
        name: `Touched by the Waaagh!`,
        desc: `Before attempting to cast a spell with this general, you must pick a unit within 6" of them. That unit suffers D3 mortal wounds but you can add the number of mortal wounds caused to that unit to the casting roll for the spell. If you pick this general to suffer the mortal wounds and they are slain by one of those wounds, the spell is not successfully cast.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Master of the Weird': {
    effects: [
      {
        name: `Master of the Weird`,
        desc: `You can pick 1 extra spell for this general from the Lore of the Weird (pg 91).`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Removed in 2021
  // 'Live to Fight': {
  //   effects: [
  //     {
  //       name: `Live to Fight`,
  //       desc: `You can reroll wound rolls for attacks made by this general and their mount if they charged in the same turn.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Brutish Cunning': {
  //   effects: [
  //     {
  //       name: `Brutish Cunning`,
  //       desc: `Once per battle round, this general can use the Mighty Destroyers command ability without spending a command point.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Bestial Charisma': {
  //   effects: [
  //     {
  //       name: `Bestial Charisma`,
  //       desc: `Once per battle round this general can use Inspiring Presence without spending a command point.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // Ironclad: {
  //   effects: [
  //     {
  //       name: `Ironclad`,
  //       desc: `Add 1 to the save rolls for this general.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  // "Dead Kunnin'": {
  //   effects: [
  //     {
  //       name: `Dead Kunnin'`,
  //       desc: `Gain D3 extra command points at the start of the first hero phase.`,
  //       when: [TURN_ONE_HERO_PHASE],
  //     },
  //   ],
  // },
  // "Burstin' with Power": {
  //   effects: [
  //     {
  //       name: `Burstin' with Power`,
  //       desc: `The general knows 1 extra spell from the Lore of the Weird, in addition, they can cast 1 extra spell.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Right Fist of Dakkbad': {
  //   effects: [
  //     {
  //       name: `Right Fist of Dakkbad`,
  //       desc: `Gain +1 CP at the start of the game.`,
  //       when: [START_OF_GAME],
  //     },
  //   ],
  // },
  // 'Get Da Realmgate': {
  //   effects: [
  //     {
  //       name: `Get Da Realmgate`,
  //       desc: `Add 2 to the dice result when you use the IRONJAWZ Waaagh! ability if there's a baleful realmgate on the table.`,
  //       when: [START_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Checked Out': {
  //   effects: [
  //     {
  //       name: `Checked Out`,
  //       desc: `Add 2 to the Bravery characteristic for units wholly within 18" of this general.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(IronjawzCommandTraits, 'command_trait')
