import { BATTLESHOCK_PHASE, COMBAT_PHASE, DURING_GAME } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
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
