import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'

const MountTraits = {
  'Cinder-crest Youngblood': {
    effects: [
      {
        name: `Cinder-crest Youngblood`,
        desc: `When you use this model's Lashing Tail ability subtract 1 from the dice roll that determines if the target unit suffers D3 mortal wounds. If this model made a charge move in the same turn, subtract 2 instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Flame-scale Youngblood': {
    effects: [
      {
        name: `Flame-scale Youngblood`,
        desc: `After this model has made a charge move, pick 1 enemy unit within 1" of this model and roll a number of dice equal to the charge roll for that charge move. For each 6 that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Fire-claw Adult': {
    effects: [
      {
        name: `Fire-claw Adult`,
        desc: `If the unmodified wound roll for an attack made with this mount's melee weapons is 6, that attack has a rend characteristic of -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lava-Tongue Adult': {
    effects: [
      {
        name: `Lava-Tongue Adult`,
        desc: `When you use this model's Roaring Fyrestream ability, subtract 1 from the dice roll that determines if the target unit suffers mortal wounds. If this model is wholly within your territory or within 6" of an objective, subtract 2 instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Coal-heart Ancient': {
    effects: [
      {
        name: `Coal-heart Ancient`,
        desc: `Worsen the rend of melee weapons that attack this target by 1 to a minimum of 0.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Ash-horn Ancient': {
    effects: [
      {
        name: `Ash-horn Ancient`,
        desc: `You can reroll save rolls of 1 for attacks that target this model and friendly MAGMADROTHS within 6".`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')
