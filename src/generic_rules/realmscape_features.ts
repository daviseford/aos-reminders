import { TEffects } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_ROUND,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_CHARGE_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import {
  AQSHY,
  CHAMON,
  CHARRWIND,
  DOLORUM,
  EIGHTPOINTS,
  GENESISGATE,
  GHUR,
  GHYRAN,
  HELLEFlUX,
  HYSH,
  INVIDA,
  PRAETORIS,
  PROSPERIS,
  SHYISH,
  STYGXX,
  ULGU,
  UMBRAL,
  VARANTHAX,
  YMETRICA,
} from 'types/realmscapes'
import { DEADLY, ENTANGLING, HEALING, MYSTICAL, NULLIFICATION, OVERGROWN, VOLCANIC } from 'types/terrain'

const RealmscapeFeatures: TEffects[] = [
  {
    name: `Terminal Lands (${SHYISH})`,
    desc: `Terrain features (including faction terrain) have the ${NULLIFICATION} scenery rule in addition to any other scenery rules that they have.`,
    when: [HERO_PHASE],
  },
  {
    name: `Burning Lands (${AQSHY})`,
    desc: `Terrain features (including faction terrain) have the ${VOLCANIC} scenery rule in addition to any other scenery rules that they have.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Transmutative Lands (${CHAMON})`,
    desc: `Terrain features (including faction terrain) have the ${ENTANGLING} scenery rule in addition to any other scenery rules that they have.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Savage Lands (${GHUR})`,
    desc: `Terrain features (including faction terrain) have the ${DEADLY} scenery rule in addition to any other scenery rules that they have.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Verdant Lands (${GHYRAN})`,
    desc: `Terrain features (including faction terrain) have the ${HEALING} scenery rule in addition to any other scenery rules that they have.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Dazzling Lands (${HYSH})`,
    desc: `Terrain features (including faction terrain) have the ${MYSTICAL} scenery rule in addition to any other scenery rules that they have.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Dazzling Lands (${ULGU})`,
    desc: `Terrain features (including faction terrain) have the ${OVERGROWN} scenery rule in addition to any other scenery rules that they have.`,
    when: [DURING_GAME],
  },
  {
    name: `Energies of the Midnight Tomb (${STYGXX})`,
    desc: `If the casting roll for a spell is a double, that spell is successfully cast and cannot be unbound.`,
    when: [HERO_PHASE],
  },
  {
    name: `Furious Bloodstorm (${EIGHTPOINTS})`,
    desc: `Subract 1 from casting rolls for wizards. You can reroll melee wound rolls of 1 for units that charged this turn.`,
    when: [HERO_PHASE, CHARGE_PHASE, COMBAT_PHASE],
  },
  {
    name: `Drifting Chokespores (${EIGHTPOINTS})`,
    desc: `Units cannot fly. Subtract 1 from missile attacks.`,
    when: [MOVEMENT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Crystal Wyrdshards (${EIGHTPOINTS})`,
    desc: `You can reroll casting rolls for wizards. If the reroll is successful the wizards suffers D3 mortal wounds after spell has resolved.`,
    when: [HERO_PHASE],
  },
  {
    name: `Exultant Melody (${EIGHTPOINTS})`,
    desc: `Units can run and charge in the same turn. If used, the unit suffers D3 mortal wounds at the end of the charge phase.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `The Great Game (${EIGHTPOINTS})`,
    desc: `Before determining who goes first, roll off. The winner decides which Eightpoints realmscape feature (excluding No Effect) is active this round.`,
    when: [START_OF_ROUND],
  },
  {
    name: `Dense with Fog (${UMBRAL})`,
    desc: `Units cannot run or charge this round.`,
    when: [TURN_ONE_MOVEMENT_PHASE, TURN_ONE_CHARGE_PHASE],
  },
  {
    name: `Hazy Front Line (${UMBRAL})`,
    desc: `Subtract 1 from missile attack hit rolls.`,
    when: [SHOOTING_PHASE],
  },
  {
    name: `Shadow Stalkers (${UMBRAL})`,
    desc: `Starting with current player, each player selects 1 enemy unit on the battlefield and rolls a D6. On a 6, the target suffers D3 mortal wounds. Continue alternating for each unit on the battlefield.`,
    when: [END_OF_ROUND],
  },
  {
    name: `Swallowed by Shadow (${UMBRAL})`,
    desc: `Starting with current player, each player selects 1 friendly unit on the battlefield and rolls a D6. On a 6, you may remove that unit and set it up again more than 9" from enemy units and more than 6" from objectives. Continue alternating for each unit on the battlefield.`,
    when: [END_OF_ROUND],
  },
  {
    name: `Under the Cover of Darkness (${UMBRAL})`,
    desc: `After terrain is placed, roll off. Starting with the winner, select D3 units and place them in reserve. At the end of your movement phase, you may set these units up more than 9" from enemy units. Any units not set up by the start of the 4th battle round are slain.`,
    when: [START_OF_SETUP],
  },
  {
    name: `Wellspring of Shadow (${HELLEFlUX})`,
    desc: `Terrain features do not get scenery rules at setup time. The first time a unit finishes a move within 1" of the terrain, randomly roll a scenery rule for that terrain.`,
    when: [START_OF_SETUP, MOVEMENT_PHASE],
  },
  {
    name: `Sweltering Mists (${CHARRWIND})`,
    desc: `Up to D3 friendly units subtract 1 from missile attack hit rolls made against them.`,
    when: [START_OF_SHOOTING_PHASE],
  },
  {
    name: `Forbidden Forgecraft (${VARANTHAX})`,
    desc: `Once per battle, you can pick 1 unnamed, artifactless, friendly hero within 1" of an objective or terrain feature wholly within enemy territory. Roll a D6. On a 2+, you may give the target an valid artifact available at army selection.`,
    when: [HERO_PHASE],
  },
  {
    name: `The Triptych (${PRAETORIS})`,
    desc: `Death wizards treat all scenery as Arcane in additional to other rules.`,
    when: [HERO_PHASE],
  },
  {
    name: `Thumb-sized Mosquitos (${INVIDA})`,
    desc: `You can pick up to D3 enemy units and roll a D6 for each. On a 4-5, the target suffers 1 mortal wound. On a 6, the target suffers 1 mortal wound and cannot run this phase.`,
    when: [START_OF_MOVEMENT_PHASE],
  },
  {
    name: `Mountainous Landscape (${YMETRICA})`,
    desc: `Reserve units that set up on board edges can only be deployed to the narrow sides of the battlefield.`,
    when: [DURING_GAME],
  },
  {
    name: `Ironwood Bulwarks (${GENESISGATE})`,
    desc: `Roll a D6 each time a unit finishes a charge within 1" of a Citadel Wood. On a 4+ that unit suffers D3 mortal wounds.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Aura of Ancient Tragedy (${DOLORUM})`,
    desc: `Terrain features are Sinister in addition to their other rules. Roll a D6 (add 2 if your general has the Death keyword). On a 6+ pick an enemy non-Death unit to suffer D3 mortal wounds.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Ironclad Buildings (${PROSPERIS})`,
    desc: `Worsen the rend characteristic by 1 (to a minimum of '-') for attacks that target units in cover.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
]

export default RealmscapeFeatures
