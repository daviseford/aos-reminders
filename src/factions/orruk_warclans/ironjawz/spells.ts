import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

const IronjawzSpells = {
  'Green Puke': {
    effects: [
      {
        name: `Green Puke`,
        desc: `Casting value of 6 and range of 2D6". Pick 1 point on the battlefield within range and visible to the caster. Draw a straight line between that point and the closest point on the caster's base. Each unit that has models passed across by that line suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Brain-bursta': {
    effects: [
      {
        name: `Brain-bursta`,
        desc: `Casting value of 5. Pick 1 enemy unit within 16" of the caster and visible to them, and roll 2D6. If the roll is greater than that unit's Bravery characteristic, that unit suffers D6 mortal wounds; if not, that unit suffers D3 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Mighty 'Eadbutt": {
    effects: [
      {
        name: `Mighty 'Eadbutt`,
        desc: `Casting value of 5 and range of 16". Pick 1 enemy HERO within range and visible to the caster. That HERO suffers 1 mortal wound. If that HERO is a WIZARD, they suffer D3 mortal wounds instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Da Blazin' Eyes": {
    effects: [
      {
        name: `Da Blazin' Eyes`,
        desc: `Casting value of 6. Pick 1 point on the battlefeld within 4D6" of the caster and visible to them. Draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a D6 for each enemy model passed across by this line. On a 4+ that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Foot of Gork': {
    effects: [
      {
        name: `Foot of Gork`,
        desc: `Casting value of 10 and range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D6 mortal wounds. Then, roll a dice. On a 1-3, the sequence stops. On a 4+, the unit suffers D6 mortal wounds. Keep rolling dice in this way until the sequence stops or the target unit is destroyed.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Da Great Big Green Hand of Gork': {
    effects: [
      {
        name: `Da Great Big Green Hand of Gork`,
        desc: `Casting value of 7 and range of 12". Pick 1 friendly ORRUK unit wholly within range, visible to the caster and more than 3" from all enemy units. Remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from any enemy units. It cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Bash 'Em, Ladz!": {
    effects: [
      {
        name: `Bash 'Em, Ladz!`,
        desc: `Bash 'Em, Ladz! is a spell that has a casting value of 8. If successfully cast, until your next hero phase, you can add 1 to wound rolls for attacks made by friendly IRONJAWZ units that are wholly within 16" of the caster.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Wrath of Gork': {
    effects: [
      {
        name: `Wrath of Gork`,
        desc: `Casting value of 8. Pick en enemy unit within 16" and visible. roll 2 dice for each IRONJAWZ unit with 2+ models wholly within 16", for each 2+ inflict 1 mortal wound to the chosen enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(IronjawzSpells, 'spell')
