import { TArtifacts } from 'types/army'
import { DURING_SETUP, HERO_PHASE, SHOOTING_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Vial of Pure Blood`,
    effects: [
      {
        name: `Vial of Pure Blood`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will drink from the Vial of Pure Blood. If you do so, you can add 1 to hit and wound rolls for the bearer until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shard of Night`,
    effects: [
      {
        name: `Shard of Night`,
        desc: `Subtract 1 from the hit rolls of attacks that target the bearer in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Gem of Exsanguination`,
    effects: [
      {
        name: `Gem of Exsanguination`,
        desc: `Once per battle, at the start of the combat phase, you can pick an enemy unit within 6" of the bearer and roll a D6. On a 1 nothing happens. On a 2-5 the unit suffers D3 mortal wounds. On a 6+ the unit suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chiropteric Cloak`,
    effects: [
      {
        name: `Chiropteric Cloak`,
        desc: `At the start of the combat phase, you can declare that the bearer will feed the Chiropteric Cloak. If you do so, the bearer suffers 1 mortal wound. During that combat phase, each time the hit roll of an attack that targets the bearer is 1 or less, the attacking unit suffers 1 mortal wound after all its attacks have been resolved.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Morbheg's Claw`,
    effects: [
      {
        name: `Morbheg's Claw`,
        desc: `In your hero phase, you can declare that the bearer will carve sigils in the ground with this claw. If you do so, they may not move, charge or attack this turn, but you can add 2 to casting rolls made for friendly LEGION OF NIGHT WIZARDS within 12" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Curseblade`,
    effects: [
      {
        name: `Curseblade`,
        desc: `After armies have been set up but before the first battle round begins, you can pick an enemy HERO. In your hero phase, as long as the enemy hero is on the battlefield, you can roll a D6. On a 4+ that enemy hero suffers 1 mortal wound and you may heal a wound that has been allocated to the bearer.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
