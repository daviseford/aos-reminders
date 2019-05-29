import { TCommandTraits } from 'types/army'
import {
  DURING_GAME,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  CHARGE_PHASE,
  TURN_ONE_DURING_ROUND,
  TURN_TWO_DURING_ROUND,
  TURN_THREE_DURING_ROUND,
  TURN_FOUR_DURING_ROUND,
  TURN_FIVE_DURING_ROUND,
  START_OF_HERO_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  DURING_ROUND,
  DURING_SETUP,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: 'Merciless Raider',
    effects: [
      {
        name: 'Merciless Raider',
        desc: 'You can re-roll run rolls and charge rolls for this general.',
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: 'Hunter of Souls',
    effects: [
      {
        name: 'Hunter of Souls',
        desc: 'Re-roll wound rolls of 1 for this general.',
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: 'Unstoppable Fury',
    effects: [
      {
        name: 'Unstoppable Fury',
        desc:
          '“Add 2 to the Attacks characteristic of any weapons used by this general in any battle round in which the High Tide ability is in effect.',
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: 'Born From Agony',
    effects: [
      {
        name: 'Born From Agony',
        desc: 'Increase this general’s Wounds characteristic by 2.',
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'Nightmare Legacy',
    effects: [
      {
        name: 'Nightmare Legacy',
        desc: 'Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.',
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'Lord of Storm and Sea',
    effects: [
      {
        name: 'Lord of Storm and Sea',
        desc:
          'Add 2 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 12" of this general.',
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: 'Tides of Death (Normal)',
    effects: [
      {
        name: 'Low Tide',
        desc: 'In this battle round, all units with the Tides of Death battle trait are treated as being in cover.',
        when: [TURN_ONE_DURING_ROUND],
      },
      {
        name: 'Flood Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that run can still either shoot or charge in the same turn (but not both).',
        when: [TURN_TWO_DURING_ROUND],
      },
      {
        name: 'High Tide',
        desc:
          'In this battle round, units with the Tides of Death battle trait fight before any other units in the combat phase. Fight with all eligible Idoneth Deepkin units one after the other, and then resolve any fights with any other units.',
        when: [TURN_THREE_DURING_ROUND],
      },
      {
        name: 'Ebb Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: [TURN_FOUR_DURING_ROUND],
      },
      {
        name: 'Low Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: [TURN_FIVE_DURING_ROUND],
      },
    ],
  },
  {
    name: 'Tides of Death (Reversed)',
    effects: [
      {
        name: 'Ebb Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: [TURN_ONE_DURING_ROUND],
      },
      {
        name: 'High Tide',
        desc:
          'In this battle round, units with the Tides of Death battle trait fight before any other units in the combat phase. Fight with all eligible Idoneth Deepkin units one after the other, and then resolve any fights with any other units.',
        when: [TURN_TWO_DURING_ROUND],
      },
      {
        name: 'Flood Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that run can still either shoot or charge in the same turn (but not both).',
        when: [TURN_THREE_DURING_ROUND],
      },
      {
        name: 'Low Tide',
        desc: 'In this battle round, all units with the Tides of Death battle trait are treated as being in cover.',
        when: [TURN_FOUR_DURING_ROUND],
      },
      {
        name: 'Ebb Tide',
        desc:
          'In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).',
        when: [TURN_FIVE_DURING_ROUND],
      },
    ],
  },
  {
    name: 'Isharann Rituals (Enclave)',
    effects: [
      {
        name: 'Isharann Rituals (Enclave)',
        desc: `A maximum of one Isharann ritual can be performed in each hero phase.
      In order to perform a ritual, at the start of your hero phase, say which ritual is being performed and then pick one ISHARANN HERO from your army that is more than 9" from any enemy models. Then roll 2D6. Add 1 to the roll if the HERO performing the ritual is within 1" of a Gloomtide Shipwreck, and add a further 1 to the roll if they are a PRIEST. In addition, add 1 to the roll for each other friendly ISHARANN HERO that is within 3" of the model performing the ritual (add 2 instead for each HERO within 3" that is a PRIEST). On a 10+ the ritual is successfully performed and has the effect listed below. On any other result, the ritual fails and nothing happens.
      
      \nRitual of Erosion: This ritual harnesses the power of the ethersea, and uses it to batter fortifications that the Idoneth Deepkin’s enemies are using for protection.
      Until your next hero phase, enemy units do not receive any benefit for being in cover.
      
      \nRitual of Rousing: This ritual draws on the energy of the chorrileums and uses it to empower Eidolons of Mathlann.
      Heal 1 wound allocated to each friendly EIDOLON on the battlefield. In addition, you can re-roll failed hit rolls and casting rolls for friendly EIDOLONS until your next hero phase.
      
      \nRitual of the Tempest: This ritual stirs the air above the ethersea into a swirling tempest that batters flying creatures to the ground.
      Until your next hero phase, enemy models cannot fly.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: 'Ionrach (Enclave)',
    effects: [
      {
        name: 'Strong in Magic',
        desc: `Add 1 to casting and unbinding rolls for Ionrach WIZARDS.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: 'Dhom Hain (Enclave)',
    effects: [
      {
        name: 'Savage Fighters',
        desc: `In your combat phase, re-roll hit rolls of 1 for Dhom-hain AKHELIAN and Dhom-hain NAMARTI units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: 'Deep Questors',
        desc: `You can re-roll failed wound rolls for Dhom-hain AKHELIAN units if the target is a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: 'Fuethan (Enclave)',
    effects: [
      {
        name: 'Fiercest of Creatures',
        desc: `In the combat phase, re-roll wound rolls of 1 for Fuethán mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: 'Revel in Slaughter',
        desc: `You can re-roll hit rolls of 1 for Fuethán units that are affected by the Flood Tide ability from the Tides of Death table (pg 86). In addition, whenever a Fuethán unit would be affected by the Ebb Tide ability from the Tides of Death table, they are instead affected by the Flood Tide ability from the same table.`,
        when: [DURING_ROUND],
      },
    ],
  },
  {
    name: "Mor'phann (Enclave)",
    effects: [
      {
        name: 'Soul-magic Adepts',
        desc: `When a Mor’phann Isharann Soulrender uses their Lurelight ability, add 3 to the number of models that are returned.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: 'Nautilar (Enclave)',
    effects: [
      {
        name: 'Consumate Defenders',
        desc: `You can re-roll failed hit rolls for Nautilar units in the combat phase if the target made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: 'Briomdar (Enclave)',
    effects: [
      {
        name: 'Unstoppable Raiders',
        desc: `Briomdar units that cannot normally fly ignore terrain features when they move, as if they could fly. Note that this does not allow them to ignore enemy models when they move.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: 'Supreme Soulscryers',
        desc: `If a Briomdar Soulscryer uses their Finder of Ways ability, up to three friendly Briomdar units can join them instead of only two. In addition, you can set up the units that join a Briomdar Soulscryer wholly within 18" of the Soulscryer instead of wholly within 12" of the Soulscryer.`,
        when: [DURING_SETUP],
      },
    ],
  },
]

export default CommandTraits
