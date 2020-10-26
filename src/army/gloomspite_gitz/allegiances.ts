import { TAllegiances } from 'types/army'
import { BATTLESHOCK_PHASE, DURING_GAME, MOVEMENT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Jaws of Mork`,
    effects: [
      {
        name: `Running Riot`,
        desc: `You can reroll the roll that determines the Move characteristic of friendly SQUIG units.`,
        when: [MOVEMENT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `"Get Some Loonshine Down 'Em!"`,
        desc: `You can use this command ability at the start of any phase. If you do so, pick 1 friendly JAWS OF MORK MANGLER SQUIGS model. Until the end of that phase, use the top row on that model's damage table, regardless of how many wounds it has suffered.`,
        when: [DURING_GAME],
        command_ability: true,
      },
      {
        name: `Envoy of the Overbounder`,
        desc: `You can reroll failed battleshock tests for friendly JAWS OF MORK units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Syari Screamersquig`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer. If you do so, until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by the bearer that target that HERO.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
