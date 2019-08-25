import { TArtifacts } from 'types/army'
import { HERO_PHASE, DURING_GAME, SHOOTING_PHASE, START_OF_HERO_PHASE, COMBAT_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Elixir of Frostwyrm`,
    effects: [
      {
        name: `Elixir of Frostwyrm`,
        desc: `In each of your shooting phases, the bearer can drink from the Elixir of Frostwyrm. If they do, pick a unit within 9" that is visible to them and roll a D6:
        
        1: The drinker suffers a mortal wound. They cannot drink the Elixir of Frostwyrm again during this battle.
        
        2-3: The unit you picked suffers 1 mortal wound. 4-5 The unit you picked suffers D3 mortal wounds.
        
        6: The unit you picked suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Bleeding Skull of Dragaar`,
    effects: [
      {
        name: `The Bleeding Skull of Dragaar`,
        desc: `The bearer of the Bleeding Skull can attempt to unbind one spell in each enemy hero phase exactly as if they were a wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Pelt of Charngar`,
    effects: [
      {
        name: `The Pelt of Charngar`,
        desc: `Roll a D6 at the start of each of your hero phases. On a 1, 2 or 3 the bearer of the Pelt of Charngar heals 1 wound, but on a 4, 5 or 6 he heals D3 wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blade of All-Frost`,
    effects: [
      {
        name: `Blade of All-Frost`,
        desc: `Pick one of this HERO's melee weapons to be the Blade of All-Frost. Add 1 to the Damage characteristic of this weapon. If this weapon wounds a HERO or a MONSTER, that model cannot be selected to fight in the combat phase until after all other units that can do so have fought.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tokens of the Everwinter`,
    effects: [
      {
        name: `Tokens of the Everwinter`,
        desc: `Once during the battle, in any hero phase, the bearer can swallow the Tokens of the Everwinter. If he does, until the start of the next hero phase you can re-roll all hit rolls, wound rolls and save rolls made for him.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ice Mammoth Skull Plate`,
    effects: [
      {
        name: `Ice Mammoth Skull Plate`,
        desc: `The wearer of an Ice Mammoth Skull Plate can re-roll all save rolls against weapons that have a Rend characteristic of '-'.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Helwinter Vambrace (Svard Alfrostun)`,
    effects: [
      {
        name: `Helwinter Vambrace (Svard Alfrostun)`,
        desc: `Roll a D6 each time the bearer suffers a mortal wound; on a 5 or more that wound is ignored.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts
