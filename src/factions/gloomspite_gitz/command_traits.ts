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
  'Fight Another Day': {
    effects: [
      {
        name: `Fight Another Day`,
        desc: `LOONBOSS only. Each time this general fights, after all of their attacks have been resolved, they can make a 2D6" move. If they do so, they must finish the move more than 3" from all enemy units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Clammy Hand': {
    effects: [
      {
        name: `The Clammy Hand`,
        desc: `If this general is within 12" of a Bad Moon Loonshrine in your army at the end of your turn, you can use the Bad Moon Loonshrine's Moonclan Lair scenery rule 2 times at the end of that turn.`,
        when: [END_OF_TURN],
      },
    ],
  },
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
}

export default tagAs(CommandTraits, 'command_trait')
