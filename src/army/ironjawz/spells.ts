import { COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  {
    name: `Brain-busta`,
    effects: [
      {
        name: `Brain-busta`,
        desc: `Brain-busta has a casting value of 5. If successfully cast, pick 1 enemy unit within 15" of the caster and visible to them, and roll 2D6. If the roll is greater than that unit's Bravery characteristic, that unit suffers D3 mortal wounds; if not, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mighty 'Eadbutt`,
    effects: [
      {
        name: `Mighty 'Eadbutt`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy HERO within 16" of the caster and visible to them. That HERO suffers 1 mortal wound. If that HERO is a WIZARD, they suffer D3 mortal wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Da Blazin' Eyes`,
    effects: [
      {
        name: `Da Blazin' Eyes`,
        desc: `Casting value of 6. If successfully cast, pick 1 point on the battlefeld within 4D6" of the caster and visible to them. Draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a D6 for each enemy model passed across by this line. On a 5+ that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Da Great Big Green Hand of Gork`,
    effects: [
      {
        name: `Da Great Big Green Hand of Gork`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly IRONJAWZ unit wholly within 24" of the caster, visible to them and more than 3" from any enemy units. Remove that unit from the battlefeld and then set it up on the battlefeld anywhere more than 9" from any enemy units. That unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bash 'Em Ladz`,
    effects: [
      {
        name: `Bash 'Em Ladz`,
        desc: `Casting value of 8. If successfully cast, until your next hero phase you can re-roll wound rolls for attacks made by friendly IRONJAWZ units while they are wholly within 12" of the caster.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Power of Da Waaagh!`,
    effects: [
      {
        name: `Power of Da Waaagh!`,
        desc: `Casting value of 8. If successfully cast, roll 1 dice for each friendly IRONJAWZ unit with 2 or more models that is wholly within 18" of the caster. For each 3+, you can pick 1 different enemy unit within 24" of the caster. That unit suffers D3 mortal wounds. For each 6, that unit suffers D6 mortal wounds instead of D3.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
