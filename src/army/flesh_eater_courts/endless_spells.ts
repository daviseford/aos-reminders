import { TEndlessSpells } from 'types/army'
import { START_OF_ROUND, HERO_PHASE, END_OF_TURN, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

const EndlessSpells: TEndlessSpells = [
  {
    name: `Corpsemare Stampede`,
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 14" and can fly.`,
        when: [START_OF_ROUND, HERO_PHASE],
      },
      {
        name: `Summon`,
        desc: `Casting value of 7. Only Nagash, Supreme Lord of the Undead and Abhorrants can attempt to cast this spell. If successfully cast, set up a Corpsemare Stampede model wholly within 3D6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Crazed Gallop`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Trampled Underfoot`,
        desc: `After this model has moved, roll 5 dice for each unit that has any models it passed across. For each roll that is more than that unit's Wounds characteristic, that unit suffers 1 mortal wound. For each roll of 6, that unit suffers D3 mortal wounds instead (whatever its Wounds characteristic is).`,
        when: [START_OF_ROUND, HERO_PHASE],
      },
    ],
  },
  {
    name: `Chalice of Ushoran`,
    effects: [
      {
        name: `Summon`,
        desc: `Casting value of 6. Only Nagash, Supreme Lord of the Undead and Abhorrants can attempt to cast this spell. If successfully cast, set up a Chalice of Ushoran model wholly within 24" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soul Stealer`,
        desc: `Keep track of the number of models that are slain within 12" of this model each turn. At the end of each turn, roll a D6 for each model that was slain within 12" of this model during that turn. For each 4+ heal 1 wound allocated to 1 Flesh-eater Courts model within 12" of this model, or return 1 slain model to 1 Flesh-eater Courts unit with a Wounds characteristic of 1 that is wholly within 12" of this model.`,
        when: [END_OF_TURN],
      },
    ],
  },
  {
    name: `Cadaverous Barricade`,
    effects: [
      {
        name: `Summon`,
        desc: `Casting value of 5. Only Nagash, Supreme Lord of the Undead and Abhorrants can attempt to cast this spell. If successfully cast, set up a Cadaverous Barricade model wholly within 24" of the caster and more than 1" from any enemy units.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grasping Hands`,
        desc: `If a model starts a move within 3" of this model, halve the distance that model can move when it makes that move. Death units are not affected by this ability.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Grisly Obstacle`,
        desc: `When a missile weapon targets a unit that has all of its models within 1" of this model, then the target unit receives the benefit of cover if the attacking model is closer to this model than it is to the target unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

export default EndlessSpells
