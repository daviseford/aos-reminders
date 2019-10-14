import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Morgaunt (Grand Court)`,
    effects: [
      {
        name: `Bloody Loyalty`,
        desc: `You can re-roll hit rolls of 1 for friendly MORGAUNT COURTIER units that are wholly within 12" of a friendly MORGAUNT SERFS unit. In addition, while a friendly MORGAUNT SERFS unit is wholly within 12" of a friendly MORGAUNT COURTIER, its Boundless Ferocity ability activates if the SERFS unit has 10 or more models. You cannot use this command ability more than once per phase.`,
        when: [DURING_GAME],
      },
      {
        name: `Heaving Masses`,
        desc: `You can use this command ability when a friendly MORGAUNT SERFS unit is destroyed. If you do so, roll a D6. On a 4+ a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy models.`,
        when: [DURING_GAME],
        command_ability: true,
      },
      {
        name: `Savage Chivalry`,
        desc: `You can re-roll hit rolls of 1 for this general while this general is within 12" of a friendly MORGAUNT SERFS unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Decrepit Coronet`,
        desc: `Do not take battleshock tests for friendly MORGAUNT units while they are wholly within 12" of the bearer, or wholly within 18" of the bearer if the bearer is your general.`,
        when: [BATTLESHOCK_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Hollowmourne (Grand Court)`,
    effects: [
      {
        name: `Shattering Charge`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by friendly HOLLOWMOURNE COURTIER units and friendly HOLLOWMOURNE KNIGHTS units that have made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ravenous Crusaders`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly HOLLOWMOURNE unit wholly within 9" of a friendly HOLLOWMOURNE HERO, or wholly within 18" of a friendly HOLLOWMOURNE HERO that is a general. Add 1 to run and charge rolls for that unit until your next hero phase. In addition, until your next hero phase, that unit can run and still charge later in the same turn.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Grave Robber`,
        desc: `Add 1 to the Attacks characteristic and Damage characteristic of this general's melee weapons while this general is within 3" of any enemy HEROES with an artifact of power.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Corpsefane Gauntlet`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Blisterskin (Grand Court)`,
    effects: [
      {
        name: `Blistering Speed`,
        desc: `Add 2" to the Move characteristic of BLISTERSKIN units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Lords of the Burning Skies`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, pick 1 friendly BLISTERSKIN unit that can fly and which is wholly within 12" of a friendly BLISTERSKIN HERO, or wholly within 18" of a friendly BLISTERSKIN HERO that is a general. Remove that unit from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units. It may not move later in that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Hellish Orator`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a D6. On a 4+ you receive 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Eye of Hysh`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target a friendly BLISTERSKIN unit wholly within 6" of the bearer.`,
        when: [SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Gristlegore (Grand Court)`,
    effects: [
      {
        name: `Peerless Ferocity`,
        desc: `If the unmodified hit roll for an attack made by a GRISTLEGORE HERO or GRISTLEGORE MONSTER is 6, that attack inflicts 2 hits on that target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Call to War`,
        desc: `You can use this command ability in the combat phase if a friendly GRISTLEGORE HERO or GRISTLEGORE MONSTER that has not fought in that phase is slain while it is wholly within 12" of a friendly GRISTLEGORE HERO, or wholly within 18" of a friendly GRISTLEGORE HERO that is a general. If you do so, before that model is removed from play, it can make a pile-in move and then attack with all of the melee weapons it is armed with. You cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Savage Strike`,
        desc: `This general and their mount fight at the start of the combat phase if they made a charge move in the same turn. This general and their mount cannot fight again in that combat phase unless a spell or ability allows them to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Ghurish Mawshard`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy model within 1" of the bearer and roll a D6. If the roll is greater than that model's Wounds characteristic, that model is slain.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
