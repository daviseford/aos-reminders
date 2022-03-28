import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'

const MountTraits = {
  'Swift-finned Impaler': {
    effects: [
      {
        name: `Swift-finned Impaler`,
        desc: `If the roll for this unit's Deepmare Horn ability roll is a 6, the target suffers D6 mortal wounds instead of D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Savage Ferocity': {
    effects: [
      {
        name: `Savage Ferocity`,
        desc: `Add 1 to the attacks characteristic of this unit's Fangs and Talons and its Lashing Tails.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Voidchill Darkness': {
    effects: [
      {
        name: `Voidchill Darkness`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units that are within 3" of this unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Ancient: {
    effects: [
      {
        name: `Ancient`,
        desc: `If the Rend characteristic of a weapon used for an attack that targets this unit is -1, change it to '-' for that attack.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Denizen of the Darkest Depths': {
    effects: [
      {
        name: `Denizen of the Darkest Depths`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons that target this unit that have a Damage characteristic of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Reverberating Carapace': {
    effects: [
      {
        name: `Reverberating Carapace`,
        desc: `Increase the range of this unit's Void Drum ability from 12" to 15".`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')
