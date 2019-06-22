import { TArtifacts } from 'types/army'
import { HERO_PHASE, COMBAT_PHASE, DURING_GAME, BATTLESHOCK_PHASE, MOVEMENT_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Daith's Reaper`,
    effects: [
      {
        name: `Daith's Reaper`,
        desc: `Pick one of this HERO's melee weapons to be Daith's Reaper. When making attacks with this weapon, any wound rolls of 6 or more have a Rend characteristic of -4.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Oaken Armour`,
    effects: [
      {
        name: `The Oaken Armour`,
        desc: `Add 1 to any save rolls made for this HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Briarsheath`,
    effects: [
      {
        name: `Briarsheath`,
        desc: `Your opponent must subtract 1 from all hit rolls made against the Briarsheath's bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Seed of Rebirth`,
    effects: [
      {
        name: `Seed of Rebirth`,
        desc: `The first time the bearer of this artefact loses its last wound, it immediately heals D3 wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Wraithstone`,
    effects: [
      {
        name: `Wraithstone`,
        desc: `Subtract 1 from the Bravery of all enemy units within 10" of the bearer in the battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Glamourweave`,
    effects: [
      {
        name: `Glamourweave`,
        desc: `Roll a dice each time the bearer suffers an unsaved wound or a mortal wound. On a roll of 6, the wound is ignored.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Acorn of the Ages`,
    effects: [
      {
        name: `Acorn of the Ages`,
        desc: `Once per game, in your hero phase, set up a new Sylvaneth Wyldwood anywhere within 5" of the bearer. The wood cannot be set up within 1" of any other models or terrain features.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warsong Stave`,
    effects: [
      {
        name: `Warsong Stave`,
        desc: `The bearer knows the Treesong spell in addition to any other spells they know.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Moonstone of the Hidden Ways`,
    effects: [
      {
        name: `Moonstone of the Hidden Ways`,
        desc: `Once per game, instead of moving the bearer in the movement phase, remove them from the battlefield and place them anywhere that is more than 4" from any enemy models.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Ranu's Lamentari`,
    effects: [
      {
        name: `Ranu's Lamentari`,
        desc: `Add 1 to all casting rolls made for the bearer of Ranu's Lamentiri. If they attempt to cast a spell from the Deepwood spell lore, add 2 to the casting roll instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hagbane Spite`,
    effects: [
      {
        name: `Hagbane Spite`,
        desc: `Once per game, instead of attempting to unbind a spell, the bearer can send forth their Hagbane Spite to attack the caster. After resolving the spell's effects, the caster immediately suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Silverwood Circlet`,
    effects: [
      {
        name: `The Silverwood Circlet`,
        desc: `Add 6" to the maximum range of every spell that the wearer knows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ironbark Talisman (Ironbark)`,
    effects: [
      {
        name: `Ironbark Talisman (Ironbark)`,
        desc: `You can add 1 to all wound rolls made for the bearer's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tear of Grace (Harvestboon)`,
    effects: [
      {
        name: `Tear of Grace (Harvestboon)`,
        desc: `The bearer of the Tear of Grace knows an extra spell, which is always generated from the Deepwood spell lore. In addition, the bearer can add 3" to the range of all of their spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
