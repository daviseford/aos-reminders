import { keyPicker } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import artifacts from './artifacts'
import command_abilities from './command_abilities'
import command_traits from './command_traits'
import spells from './spells'

const Flavors = {
  Ymetrica: {
    mandatory: {
      artifacts: [keyPicker(artifacts, ["Mountain's Gift"])],
      command_abilities: [keyPicker(command_abilities, ['Redoubled Force'])],
      command_traits: [keyPicker(command_traits, ['Almighty Blow'])],
    },
    effects: [
      {
        name: `Mountain Realm`,
        desc: `The Enduring as Rock battle trait changes an attack that targets a YMETRICA ALARITH units in mountain stance to '-' if the weapon used for the attack has Rend -1 or -2.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Syar: {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['The Perfect Blade'])],
      command_abilities: [keyPicker(command_abilities, ['Deplete Reserves'])],
      command_traits: [keyPicker(command_traits, ['Goading Arrogance'])],
    },
    effects: [
      {
        name: `Gleaming Brightness`,
        desc: `SYAR units start the battle with 2 aetherquartz reserves instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  Iliatha: {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Simulacra Amulet'])],
      command_traits: [keyPicker(command_traits, ['Strike in Unison'])],
    },
    effects: [
      {
        name: `Soul-bond`,
        desc: `Add 2 to the Bravery characteristic of ILIATHA VANARI amd ILIATHA AELEMENTIRI units.`,
        when: [DURING_GAME],
      },
      {
        name: `Unity of Purpose`,
        desc: `After a friendly ILIATHA VANARI unit uses a command ability, you can pick 1 other friendly ILIATHA VANARI unit within 3" of that unit. That other unit can use that command ability without spending a command point. You can only use this ability once per phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  Zaitrec: {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Gift of Celennar'])],
      spells: [keyPicker(spells, ['Overwhelming Heat'])],
      command_traits: [keyPicker(command_traits, ['Fast Learner'])],
    },
    effects: [
      {
        name: `Lambent Mystics`,
        desc: `Add 1 to the first casting, dispelling or unbinding roll you make for each ZAITREC WIZARD in each hero phase. In addition, each ZAITREC WIZARD HERO knows 1 extra spell form the appropriate lore.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
