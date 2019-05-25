import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  MOVEMENT_PHASE,
  BATTLESHOCK_PHASE,
  START_OF_SETUP,
  START_OF_MOVEMENT_PHASE,
  DURING_GAME,
  COMBAT_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
  CHARGE_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: 'Branchwraith',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Branchwych',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Spirit of Durthu',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Drycha Hamadreth',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Alarielle the Everqueen',

    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Treelord Ancient',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Ylthari',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Dryads',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Kurnoth Hunters',

    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Spite-Revenants',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Tree-Revenants',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: "Ylthari's Guardians",
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Treelord',

    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: "Alarielle's Heartwood Guard",
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Sylvaneth Wargrove',
    effects: [
      {
        name: 'Mighty Wyldwood',
        desc:
          'If your army has the SYLVANETH allegiance and includes a Sylvaneth Wargrove, then the Wyldwood Groves ability allows you to set up one additional Sylvaneth Wyldwood.',
        when: START_OF_SETUP,
      },
      {
        name: 'Mighty Wyldwood',
        desc: 'Each time one of your units uses the Navigate Realmroots ability, add 1 to the dice result.',
        when: START_OF_MOVEMENT_PHASE,
      },
    ],
  },
  {
    name: 'Winterleaf Wargrove',
    effects: [
      {
        name: 'Surrounded by Devastation',
        desc:
          'Any SYLVANETH Winterleaf units that are set up in a hidden enclave at the start of the battle (see the Forest Spirits rule), can be set up within 3" of an Ophidian Archway and more than 9" from any enemy models, in addition to the other ways it can be set up. This is their move for that movement phase.',
        when: MOVEMENT_PHASE,
      },
      {
        name: 'Embittered by War',
        desc:
          'Each time you make a hit roll of 6 or more for a Winterleaf Dryad, it can immediately make one additional attack with its Wracking Talons.',
        when: COMBAT_PHASE,
      },
      {
        name: 'Revenge Against Chaos',
        desc:
          'You can re-roll hit and wound rolls of 1 for any attack made by a SYLVANETH Winterleaf unit upon a CHAOS unit.',
        when: COMBAT_PHASE,
      },
      {
        name: 'Revenge Against Chaos',
        desc:
          'You can re-roll hit and wound rolls of 1 for any attack made by a SYLVANETH Winterleaf unit upon a CHAOS unit.',
        when: SHOOTING_PHASE,
      },
    ],
  },
  {
    name: 'Ironbark Wargrove',
    effects: [
      {
        name: 'Stubborn and Taciturn',
        desc:
          'Halve the number of casualties when working out the result of a battleshock test for a SYLVANETH Ironbark unit, rounding fractions up. For example, if an Ironbark unit suffered 3 casualties, then 2 would be added to its battleshock test rather than 3.',
        when: BATTLESHOCK_PHASE,
      },
      {
        name: 'Master-crafted Weapons',
        desc:
          'You can re-roll wound rolls of 1 for the enchanted blades, protector glaives or greenwood scythes used by Ironbark Tree-Revenants and Branchwyches.',
        when: COMBAT_PHASE,
      },
    ],
  },
  {
    name: 'Dreadwood Wargrove',
    effects: [
      {
        name: 'Malicious Tormentors',
        desc: 'You can re-roll wound rolls of 1 for attacks made by Dreadwood Spite-Revenants.',
        when: COMBAT_PHASE,
      },
      {
        name: 'Subterfuge',
        desc:
          'Roll a dice at the start of the first battle round; on a 1 or 2 you can use one of the following stratagems, on a 3 or 4 you can use two of them, and on a 5 or 6 you can use all three:' +
          '\n\nAmbush: A Dreadwood unit can be redeployed anywhere on the battlefield that is more than 6" from an enemy unit.' +
          '\n\nHidden Attackers: The maximum range of enemy attacks, abilities and spells against Dreadwood units is limited to 12" during the first round of the battle.' +
          '\n\nSneak Attack: Up to 3 Dreadwood units can immediately move as if it were the movement phase (they cannot run).',
        when: TURN_ONE_START_OF_ROUND,
      },
    ],
  },
  {
    name: 'Heartwood Wargrove',
    effects: [
      {
        name: 'Worshippers of Kurnoth',
        desc:
          'Add 1 to the Bravery of any Heartwood units that are within 6" of a friendly unit of Kurnoth Hunters. This bonus does not apply to units of Kurnoth Hunters themselves.',
        when: BATTLESHOCK_PHASE,
      },
      {
        name: 'Followers of the Wild Hunt',
        desc:
          'Roll a dice in each of your hero phases, adding 1 to the roll if there are any friendly units of Kurnoth Hunters on the battlefield. On a roll of 6 or more you can replace a unit of Heartwood Dryads, Tree-Revenants, or Spite-Revenants that has been completely destroyed with an identical unit. Set up the replacement unit within 6" of the edge of the battlefield or within a Sylvaneth Wyldwood, and more than 9" from any enemy units. This counts as its move for the following movement phase.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Gnarlroot Wargrove',
    effects: [
      {
        name: 'Seekers of Knowledge',
        desc:
          'A Gnarlroot Treelord Ancient, Branchwych or Branchwraith is allowed to attempt to cast one extra spell in each of their hero phases, and unbind one extra spell in each enemy hero phase.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Oakenbrow Wargrove',
    effects: [
      {
        name: 'Noble Spirits',
        desc: 'Oakenbrow Treelords and Treelord Ancients have a Wounds characteristic of 13.',
        when: DURING_GAME,
      },
      {
        name: 'Mighty Hosts',
        desc:
          'Once during the battle, in your hero phase, you can replace a unit of Oakenbrow Dryads or Tree-Revenants that has been completely destroyed with an identical unit. Set up the replacement unit within 6" of the edge of the battlefield or within a Sylvaneth Wyldwood, and more than 9" from any enemy models. This counts as its move for the following movement phase.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Harvestboon Wargrove',
    effects: [
      {
        name: 'Chorus of Magic',
        desc: 'Add 1 to casting rolls for Harvestboon Branchwraiths.',
        when: HERO_PHASE,
      },
      {
        name: 'Vibrant Surge',
        desc: 'Add 1 to any run rolls made for Harvestboon units.',
        when: MOVEMENT_PHASE,
      },
      {
        name: 'Vibrant Surge',
        desc: 'Add 1 to any charge rolls made for Harvestboon units.',
        when: CHARGE_PHASE,
      },
    ],
  },
  {
    name: 'Forest Spirit Wargrove',
    effects: [
      {
        name: '',
        desc: '',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Outcasts',
    effects: [
      {
        name: 'Fear the Forest-kin',
        desc:
          'In your hero phase, roll two dice for each enemy unit that is within 8" of at least two units from this battalion. For each point by which the total dice roll exceeds the unit’s Bravery, the unit suffers a mortal wound.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Free Spirits',
    effects: [
      {
        name: 'Swift Vengeance',
        desc:
          'In your hero phase, you can pick either an enemy unit or a terrain feature, and then move each unit from the Free Spirits as though it were the movement phase (they cannot run). They must end their move closer to the chosen unit or terrain feature than they were before they moved.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Forest Folk',
    effects: [
      {
        name: 'Fade from View',
        desc:
          'Once per game, in your hero phase, the Forest Folk can vanish along the spirit paths. Remove all of the models in the battalion from the battlefield and set them to one side. Then set up each of the units anywhere within your territory, or within 3" of a Sylvaneth Wyldwood. They must be set up at least 9" from the enemy, and cannot move in the following movement phase.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'Household',
    effects: [
      {
        name: 'Discipline of the Ages',
        desc: 'Enemy units cannot choose to retreat if they are within 3" of a Household unit.',
        when: MOVEMENT_PHASE,
      },
      {
        name: 'Discipline of the Ages',
        desc:
          'Units from the Household battalion add 1 to their Bravery in the battleshock phase if they are within 3" of an enemy unit.',
        when: BATTLESHOCK_PHASE,
      },
    ],
  },
  {
    name: 'Lords of the Clan',
    effects: [
      {
        name: 'Deadly Chorus',
        desc:
          'In the hero phase, the Head of the Clan can unleash a great chorus. Roll a dice for each enemy unit within 10" of him, adding 1 to the result for each other model from this battalion that is also within 10" of the enemy unit being rolled for. If the result is 6-9, that enemy unit suffers D3 mortal wounds. If the result is 10 or more, that enemy unit suffers D6 mortal wounds instead.',
        when: HERO_PHASE,
      },
    ],
  },
  {
    name: 'The Guardians of Alarielle',
    effects: [
      {
        name: 'The Song of the Lady of Vines',
        desc:
          'The Lady of Vines’ song has magical healing powers. She can give voice to the song in each of her hero phases. If she does so, pick a model anywhere on the battlefield; that model heals 1 wound (it heals D3 wounds instead if it is a SYLVANETH unit within 18").',
        when: HERO_PHASE,
      },
      {
        name: 'Master of Defence',
        desc:
          'Lorrus Grymn is a master of defensive warfare. Add 1 to the save rolls of Grymn, and to the save rolls of any STORMCAST ETERNALS unit from this battalion that is within 9" of him when the save is made.',
        when: DURING_GAME,
      },
      {
        name: 'Guardians of the Queen-seed',
        desc:
          'The Lady of Vines bears Alarielle’s dormant form in a soulpod, and those tasked with the Everqueen’s defence will fight to the last to protect it. So long as the Lady of Vines is still alive, the Bravery of all Guardians of Alarielle units is 10.',
        when: BATTLESHOCK_PHASE,
      },
    ],
  },
]
