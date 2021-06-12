import { tagAs } from 'factions/metatagger'
import { SKAVENTIDE } from 'meta/factions'
import rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  [SKAVENTIDE]: {
    effects: [
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
      {
        name: `Hidden Weapon Teams`,
        desc: `You can reveal 1 or more hidden Weapon Team units. Set up each wholly wthin 3" of the unit it was hiding in, more than 3" from any enemy units. These units can shoot as long as the concealing unit did not run this turn.`,
        when: [START_OF_SHOOTING_PHASE],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Hidden Weapon Teams`,
        desc: `You can reveal 1 or more hidden Weapon Team units hiding in a unit that completed a charge move this phase. Set up each wholly within 3" of the unit it was hiding in. This unit can be set up within 3" of enemy units and can fight in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Hidden Weapon Teams`,
        desc: `If the concealing unit is destroyed, the Weapon Team hiding inside it is also destroyed.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
