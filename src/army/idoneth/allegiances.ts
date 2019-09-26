import { TAllegiances } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Ionrach (Enclave)`,
    effects: [
      {
        name: `Strong in Magic`,
        desc: `Add 1 to casting and unbinding rolls for Ionrach WIZARDS.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Dhom Hain (Enclave)`,
    effects: [
      {
        name: `Savage Fighters`,
        desc: `In your combat phase, re-roll hit rolls of 1 for Dhom-hain AKHELIAN and Dhom-hain NAMARTI units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deep Questors`,
        desc: `You can re-roll failed wound rolls for Dhom-hain AKHELIAN units if the target is a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Fuethan (Enclave)`,
    effects: [
      {
        name: `Fiercest of Creatures`,
        desc: `In the combat phase, re-roll wound rolls of 1 for Fuethan mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Revel in Slaughter`,
        desc: `You can re-roll hit rolls of 1 for Fuethan units that are affected by the Flood Tide ability from the Tides of Death.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Revel in Slaughter`,
        desc: `Whenever a Fuethan unit would be affected by the Ebb Tide ability from the Tides of Death table, they are instead affected by the Flood Tide ability from the same table.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mor'phann (Enclave)`,
    effects: [
      {
        name: `Soul-magic Adepts`,
        desc: `When a Mor'phann Isharann Soulrender uses their Lurelight ability, add 3 to the number of models that are returned.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Nautilar (Enclave)`,
    effects: [
      {
        name: `Consumate Defenders`,
        desc: `You can re-roll failed hit rolls for Nautilar units in the combat phase if the target made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Briomdar (Enclave)`,
    effects: [
      {
        name: `Unstoppable Raiders`,
        desc: `Briomdar units that cannot normally fly ignore terrain features when they move, as if they could fly. Note that this does not allow them to ignore enemy models when they move.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Supreme Soulscryers`,
        desc: `If a Briomdar Soulscryer uses their Finder of Ways ability, up to three friendly Briomdar units can join them instead of only two. In addition, you can set up the units that join a Briomdar Soulscryer wholly within 18" of the Soulscryer instead of wholly within 12" of the Soulscryer.`,
        when: [DURING_SETUP],
      },
    ],
  },
]

export default Allegiances
