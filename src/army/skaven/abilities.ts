import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SETUP,
} from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Gnawholes`,
    desc: `A Skaventide army can include up to 3 GNAWHOLE terrain features. After territories have been chosen but before armies are set up, you can set up the GNAWHOLES for your army. Each GNAWHOLE must be set up wholly within 8" of the edge of the battlefield, more than 3" from any enemy units or other terrain features, and more than 1" from any objectives. If both players can set up any terrain features before armies are set up, they must roll off, and the winner chooses who sets up their terrain features first.`,
    when: [START_OF_SETUP],
  },
  {
    name: `Gnawhole: Tunnels Through Reality`,
    desc: `At the start of your movement phase, you can use 1 GNAWHOLE to transport 1 friendly SKAVENTIDE unit. In order to do so, that unit must be wholly within 6" of the GNAWHOLE , and a friendly SKAVENTIDE HERO must be within 6" of the GNAWHOLE . If this is the case, remove the SKAVENTIDE unit from the battlefield and then set it up wholly within 6" of another GNAWHOLE and more than 9" from any enemy models. This counts as that unit's move for that movement phase.`,
    when: [START_OF_MOVEMENT_PHASE],
  },
  {
    name: `Gnawhole: Aura of the Horned Rat`,
    desc: `SKAVENTIDE units treat this terrain feature as having the Arcane scenery rule. In addition, you can add 1 to the dice that determines if a prayer is answered if the prayer is chanted by a friendly SKAVENTIDE PRIEST within 1" of a GNAWHOLE.`,
    when: [HERO_PHASE],
  },
  {
    name: `Gnawhole: Aura of the Horned Rat`,
    desc: `Non-SKAVENTIDE units treat this terrain feature as having the Deadly scenery rule.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Lead From The Back`,
    desc: `The Look Out, Sir! rule applies to an attack made with a melee weapon as well as an attack made with a missile weapon if the target of the attack is a SKAVENTIDE HERO that is not a MONSTER.`,
    when: [DURING_GAME],
  },
  {
    name: `Scurry Away`,
    desc: `In the combat phase, when you pick a friendly SKAVENTIDE HERO to fight with, you can say it is going to scurry away instead of making a pile-in move and then attacking. If you do so, that HERO must make a normal move, and must retreat.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Overwhelming Mass`,
    desc: `Add 1 to hit rolls for attacks made with melee weapons by SKAVENTIDE units while they have 20 or more models. In addition, add 1 to wound rolls for attacks made with melee weapons by SKAVENTIDE units while they have 30 or more models.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Strength in Numbers`,
    desc: `When a SKAVENTIDE unit takes a battleshock test, add 2 to its Bravery characteristic instead of 1 for every 10 models in the unit.`,
    when: [BATTLESHOCK_PHASE],
  },
]

export default Abilities
