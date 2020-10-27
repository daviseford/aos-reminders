import { TAllegiances } from 'types/army'
import { COMBAT_PHASE, END_OF_BATTLESHOCK_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Legion of the First Prince`,
    effects: [
      {
        name: `First-Damned Prince`,
        desc: `You can reroll hit and wound rolls for attacks made by Be'lakor while he is within 8" of at least 1 of each of the following friendly Legion of the First Prince units: Bloodletters, Plaguebearers, Daemonettes, and Horrors of Tzeentch.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `First-Damned Prince`,
        desc: `Before you allocate a wound or mortal wound to Be'lakor, pick 1 friendly Bloodletters, Plaguebearers, Daemonettes, or Horrors of Tzeentch unit within 8" of him an roll a D6. On a 4+ that wound/mortal wound is allocated to the selected unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Shadow Legion`,
        desc: `Once per turn you can use this ability if Be'lakor is your general an on the battlefield. Roll a D6 for each friendly Legion of the First Prince Bloodletters, Plaguebearers, Daemonettes, and Horrors of Tzeentch unit on the battlefield. On a 3+ you can return D3 slain models to that unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
      {
        name: `The Master's Command`,
        desc: `Casting value of 7. Pick 1 friendly Legion of the First Prince Bloodletters, Plaguebearers, Daemonettes, or Horrors of Tzeentch unit wholly within 12" of the caster and visible. Until the start of your next hero phase, if a model from that unit is slain by a melee attack, that model can fight before it is removed from play.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `The Master's Command`,
        desc: `If a model from the buffed unit is slain by a melee attack that model can fight before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default Allegiances
