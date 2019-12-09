import {
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_ROUND,
  END_OF_TURN,
  COMBAT_PHASE,
} from 'types/phases'
import { TEndlessSpells } from 'types/army'

// Endless spells.
const EndlessSpells: TEndlessSpells = [
  {
    name: `Eightfold Doom-Sigil (Slaves)`,
    effects: [
      {
        name: `Summon`,
        desc: `Casting value of 5. Only Slaves to Darkness wizards can attempt to cast this spell. Set up 1 of these models wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Atrocity`,
        desc: `Keep track of the number of models slain within 12" of this model each turn.`,
        when: [DURING_GAME],
      },
      {
        name: `Empowered by Atrocity`,
        desc: `Roll a dice for each model that was tracked during the turn. On each 3+, the current turn's player must pick 1 Slaves to Darkness unit wholly within 18" of this model. The selected unit gets 1 additional attack to its melee weapons (excluding mounts). A unit cannot benefit from this more than once a turn.`,
        when: [END_OF_TURN],
      },
      {
        name: `Empowered by Atrocity`,
        desc: `If active, the affected unit gets 1 additional attack to its melee weapons (excluding mounts).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Darkfire Daemonrift (Slaves)`,
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 12" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 6. Only Slaves to Darkness wizards can attempt to cast this spell. Set up 1 of these models wholly within 9" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reality Screams`,
        desc: `The player who set this model up may immediately move it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Billowing Energies`,
        desc: `After this model has moved, each unit it passed across and each unit within 1" at the end of the move suffers D3 mortal wounds.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Fuelled by Sorcery`,
        desc: `Add 1 to the number of mortal wounds inflicted by this endless spell for each wizard and each other endless spell within 12" of this model after it has moved.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: `Realmscourge Rupture (Slaves)`,
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 9" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 7. Only Only Slaves to Darkness wizards can attempt to cast this spell. Set up 1 of these models wholly within 9" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Oncoming Annihilation`,
        desc: `The player who set this model up may immediately move it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tide of Ruin`,
        desc: `Whenever this model is set up it must be positioned widthways in the direction you wish to move it. It will only be able to move forward in this direction.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tide of Ruin`,
        desc: `This model can only move in a straight line widthwayhs in the direction it is facing (cannot move backwards).`,
        when: [START_OF_ROUND],
      },
      {
        name: `Debilitating Shockwave`,
        desc: `After this model has moved, each unit it passed across and each unit within 1" at the end of the move suffers D3 mortal wounds. Affected units halve their movement until the end of the round.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Debilitating Shockwave`,
        desc: `Units affected by this ability halve their move characteristic until the end of the battle round.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

export default [...EndlessSpells]
