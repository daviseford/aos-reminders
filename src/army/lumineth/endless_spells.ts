import { TEndlessSpells } from 'types/army'
import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'

const EndlessSpells: TEndlessSpells = [
  {
    name: `Hyshian Twinstones`,
    effects: [
      {
        name: `Summon Hyshian Twinstones`,
        desc: `Only LUMINETH REALM-LORDS WIZARDS can attempt to cast Hyshian Twinstones. Casting value of 7. Set up a Hyshian Twinstones model wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Hyshian Twinstones can move up to 8" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reservoir of Power`,
        desc: `When this model is set up, place a D6 beside it with the 1 facing up. Each time a spell is cast by a unit within 12" of this model and not unbound, increase the value of the dice by 1 (to maximum of 6). If a LUMINETH REALM-LORDS WIZARD attempts to cast a spell within 12" of this model, before making a casting roll, they can add the value of the dice to the casting roll. Once done, change the value of the dice back to 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Sanctum of Amyntok`,
    effects: [
      {
        name: `Summon Sanctum of Amyntok`,
        desc: `Only LUMINETH REALM-LORDS WIZARDS can attempt to cast Sanctum of Amyntok. Casting value of 7. Set up 1 Sanctum of Amyntok model wholly within 3" of the caster and more than 3" from enemy units. Then setup the second and third so that the tip of each model is touching the tip of a different model from the same endless spell with each model more than 3" from any other units and with the caster inside the ring.`,
        when: [HERO_PHASE],
      },
      {
        name: `Sigil of Yngra`,
        desc: `At the end of the combat phase, if this model was targeted by enemy attacks, roll a D6 for each enemy unit within 3". On a 1-3, nothing happens. On a 4-5 that enemy unit suffers 1 mortal wound. On a 6, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rune of Petrification`,
    effects: [
      {
        name: `Summon Rune of Petrification`,
        desc: `Only LUMINETH REALM-LORDS WIZARDS can attempt to cast Rune of Petrification. Casting value of 8. Set up a Rune of Petrification model wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Turn to Stone`,
        desc: `At the start and end of the movement phase, roll a D6 for each unit within 6". On a 4+ the unit suffers D3 mortal wounds. In addition, subtract 1 from run and change rolls for units within 6". This ability has no effect on LUMINETH REALM-LORDS units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

export default EndlessSpells
