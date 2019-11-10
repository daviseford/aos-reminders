import {
  COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  {
    name: `Brain Burst`,
    effects: [
      {
        name: `Brain Burst`,
        desc: `Casting value of 5. Pick 1 enemy unit within 16" of the caster and visible to them, and roll 2D6. If the roll is greater than that unit's Bravery characteristic, that unit suffers D6 mortal wounds; if not, that unit suffers D3 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mighty 'Eadbutt`,
    effects: [
      {
        name: `Mighty 'Eadbutt`,
        desc: `Casting value of 5. Pick 1 enemy HERO within 16" of the caster and visible to them. That HERO suffers D3 mortal wounds. If that HERO is a WIZARD, they suffer D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Da Blazin' Eyes`,
    effects: [
      {
        name: `Da Blazin' Eyes`,
        desc: `Casting value of 6. Pick 1 point on the battlefeld within 4D6" of the caster and visible to them. Draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a D6 for each enemy model passed across by this line. On a 4+ that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Da Great Big Green Hand of Gork`,
    effects: [
      {
        name: `Da Great Big Green Hand of Gork`,
        desc: `Casting value of 7. Pick 1 friendly IRONJAWZ unit wholly within 24" of the caster, visible to them and more than 3" from any enemy units. Remove that unit from the battlefeld and then set it up on the battlefeld anywhere more than 9" from any enemy units. That unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bash 'Em Ladz`,
    effects: [
      {
        name: `Bash 'Em Ladz`,
        desc: `Casting value of 8. Until your next hero phase add 1 to wound rolls for friendly units within 16" of the caster.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Wrath of Gork`,
    effects: [
      {
        name: `Wrath of Gork`,
        desc: `Casting value of 8. Pick en enemy unit within 16" and visible. roll 2 dice for each IRONJAWZ unit with 2+ models wholly within 16", for each 2+ inflict 1 mortal wound to the chosen enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Get 'Em Beat`,
    effects: [
      {
        name: `Get 'Em Beat`,
        desc: `Roll a D6, on a 4+ pick 1 friendly Ironjawz unit wholly within 12" of this Warchanter. You can attempt a charge for 18" out and roll 3D6 instead of 2D6 for your charge roll.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Fixin' Beat`,
    effects: [
      {
        name: `Fixin' Beat`,
        desc: `Roll a D6, on a 4+ pick 1 friendly Ironjawz model within 12" and heal D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Killa Beat`,
    effects: [
      {
        name: `Killa Beat`,
        desc: `Roll a D6, on a 4+ pick 1 enemy unit within 12". Attacks directed at that unit add 1 to the hit rolls.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default Spells
