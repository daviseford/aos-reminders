import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Ancient Curse': {
    effects: [
      {
        name: `Ancient Curse`,
        desc: `If this model is slain, the unit that inflicted the final wound upon him suffers D6 mortal wounds after all of its attacks have been made.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  "And He Did Say 'War', and the World Did Tremble": {
    effects: [
      {
        name: `And He Did Say 'War', and the World Did Tremble`,
        desc: `If a Tomb King on Exalted Chariot uses this command ability, then in your next combat phase you can add 1 to hit rolls for Tomb Kings units in your army while they are within 18" of this model. If a Desert Legions unit is affected by this ability, you can also add 1 to their wound rolls in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Supernatural Speed': {
    effects: [
      {
        name: `Supernatural Speed`,
        desc: `When an enemy unit within 3" of this model is picked to pile in and attack in the combat phase, if this model has not yet attacked this phase, you can immediately pile in and attack with it before that enemy unit does.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blessing of Accuracy': {
    effects: [
      {
        name: `Blessing of Accuracy`,
        desc: `If a Tomb Queen uses this command ability, add 1 to hit rolls made by friendly Desert Legions units during your next shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Royal Tomb Shield': {
    effects: [
      {
        name: `Royal Tomb Shield`,
        desc: `You can reroll failed save rolls for a Tomb King with a Royal Tomb Shield.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'My Will Be Done': {
    effects: [
      {
        name: `My Will Be Done`,
        desc: `If a Tomb King uses this command ability, pick one Desert Legions unit within 18". Until your next hero phase add 1 to all hit, run and charge rolls for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Royal Chariot': {
    effects: [
      {
        name: `Royal Chariot`,
        desc: `In the combat phase, if this model charged in the same turn, add 2 to the Attacks characteristic of the Tomb King's Dynastic Blade and double the Attacks characteristic of the Skeletal Steed's Thundering Hooves. 'And the Tomb Kings Rode to War': If a Tomb King in Royal Chariot uses this command ability you can reroll charge rolls for this model and friendly units of Desert Legion Chariots that are within 18" of him in your next charge phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Who Dares Disturb My Slumber?': {
    effects: [
      {
        name: `Who Dares Disturb My Slumber?`,
        desc: `If this model uses this ability, pick an enemy unit that is visible to it. Until your next hero phase, add 1 to all wound rolls for friendly Embalmed and Desert Legion units that target the chosen unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
