import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Prayers = {
  'Bronzed Flesh': {
    effects: [
      {
        name: `Bronzed Flesh`,
        desc: `Answer value of 3 and a range of 16". If answered, pick 1 friendly BLADES OF KHORNE unit wholly within range and visible to the chanter. Add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Sacrifice': {
    effects: [
      {
        name: `Blood Sacrifice`,
        desc: `Answer value of 4 and a range of 8". If answered, pick 1 friendly BLADES OF KHORNE unit wholly within range and visible to the chanter. That unit suffers D3 mortal wounds and you receive 1 Blood Tithe point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Killer Instinct': {
    effects: [
      {
        name: `Killer Instinct`,
        desc: `Answer value of 3 and a range of 16". If answered, pick 1 friendly BLADES OF KHORNE unit wholly within range, visible to the chanter and more than 3" from all enemy units. That unit can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Witchbane Curse': {
    effects: [
      {
        name: `Witchbane Curse`,
        desc: `Answer value of 4. If answered, pick 1 enemy WIZARD unit visible to the chanter. Until the start of your next hero phase, subtract 1 from casting rolls made for that unit. In addition, until the start of your next hero phase, each time that unit attempts to cast a spell and that spell is not successfully cast, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Unholy Flames': {
    effects: [
      {
        name: `Unholy Flames`,
        desc: `Answer value of 4 and a range of 16". If answered, pick 1 friendly BLADES OF KHORNE unit wholly within range and visible to the chanter. Until the start of your next hero phase, improve the Rend characteristic of that unit's melee weapons by 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Boil': {
    effects: [
      {
        name: `Blood Boil`,
        desc: `Answer value of 4 and a range of 16". If answered, pick 1 enemy unit within range and visible to the chanter. That enemy unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Bloodbind: {
    effects: [
      {
        name: `Bloodbind`,
        desc: `Answer value of 3 and a range of 16". If answered, pick 1 enemy unit within range, visible to the chanter and more than 3" from all friendly units. Your opponent must make a move of up to 8" with that unit. All of the models in that unit must finish that move as close as possible to the chanter and can finish that move within 3" of units in your army.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Wound the Realm': {
    effects: [
      {
        name: `Wound the Realm`,
        desc: `Answer value of 4 and a range of 16". If answered, pick 1 point on the battlefield within range and visible to the chanter and draw a straight line between that point and the closest part on the chanter's base. Roll a dice for each enemy unit passed across by that line. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Bloodmark: {
    effects: [
      {
        name: `Bloodmark`,
        desc: `Answer value of 3 and a range of 16". If answered, pick 1 enemy unit within range and visible to the chanter. Until the start of your next hero phase, add 1 to wound rolls for attacks made by friendly BLADES OF KHORNE DAEMON units that target that enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Bloodhex: {
    effects: [
      {
        name: `Bloodhex`,
        desc: `Answer value of 4 and a range of 16". If answered, pick 1 enemy unit within range and visible to the chanter. Until the start of your next hero phase, subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Call': {
    effects: [
      {
        name: `Blood Call`,
        desc: `Answer value of 3 and a range of 16". Add 1 to the chanting roll if the chanter is within 3" of any enemy units. If answered, pick 1 friendly BLOODLETTER HOST or 1 friendly BLOODCRUSHERS unit wholly within range and visible to the chanter. If the unit is a BLOODLETTER HOST, you can return D6 slain models to that unit. If it is a BLOODCRUSHERS unit, you can return 1 slain model to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Prayers, 'prayer')
