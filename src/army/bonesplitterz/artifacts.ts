import { TArtifacts } from 'types/army'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, HERO_PHASE, START_OF_GAME, DURING_GAME } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Glowin' Tattooz`,
    effects: [
      {
        name: `Glowin' Tattooz`,
        desc: `Add 1 to any save rolls made for this Hero.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dragon Toof`,
    effects: [
      {
        name: `Dragon Toof`,
        desc: `Pick a melee weapon. This weapon deal double damage against monsters each tim the wound roll is 5+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Weepwood Big Shiv`,
    effects: [
      {
        name: `Weepwood Big Shiv`,
        desc: `Pick a melee weapon. Add 1 to the attacks characteristic of this weapon. Add another 1 each time the Weepwood Big Shiv kills a Monster.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dokk Juice`,
    effects: [
      {
        name: `Dokk Juice`,
        desc: `In your hero phase, the bearer can drink Dokk Juice. If they do, roll a dice:

          1: The bearer suffers a mortal wound.
          2-5: The bearer heals D3 wounds.
          6: The bearer heals D6 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Savage Trophy`,
    effects: [
      {
        name: `Savage Trophy`,
        desc: `Add 1 to the Bravery characteristic of all friendly Bonesplitterz models within 10" of the bearer in the battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Lucky Bone`,
    effects: [
      {
        name: `Lucky Bone`,
        desc: `You can re-roll any run rolls, hit rolls, wound rolls, save rolls, and damage rolls of 1 for the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ju-Ju Wotnotz`,
    effects: [
      {
        name: `Ju-Ju Wotnotz`,
        desc: `Each time the bearer successfully casts a spell and the casting roll was a double, they can immediately attempt to cast another spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Big Spirit Stikk`,
    effects: [
      {
        name: `Big Spirit Stikk`,
        desc: `Pic a melee weapon. Add 1 to the attacks characteristic for this weapon. Add 2 instead if the wielder directs all of it's attacks against a Monster.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mork's Boney Bitz`,
    effects: [
      {
        name: `Mork's Boney Bitz`,
        desc: `Add 1 to this Wizard's casting rolls for each enemy Monster within 24".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Da Great Zappa Squig`,
    effects: [
      {
        name: `Da Great Zappa Squig`,
        desc: `The bearer knows one additional spell randomly choosen from the lore of the Savage Waaagh!`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Big Wurrgog Mask`,
    effects: [
      {
        name: `Big Wurrgog Mask`,
        desc: `Once per game, during your hero phase, the bearer can select a unit within 12" that is visible to them. That unit suffers D3 mortal wounds. The bearer can then continue to star at the unit. If they do, roll a dice, on a 3+, the unit suffers another D3 mortal wounds. but on a 1 or 2, the bearer is immediately slain. Continue repeating this until the wearer is slain, decides to stop, or the target unit has been wiped out.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mystic Waaagh! Paint`,
    effects: [
      {
        name: `Mystic Waaagh! Paint`,
        desc: `Add 1 to all unbind rolls made by the bearer and increase unbdind range to 36".`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
