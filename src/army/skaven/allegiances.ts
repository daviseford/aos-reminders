import { TAllegiances } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Skilled Manipulators (Masterclan)`,
    effects: [
      {
        name: `Skilled Manipulators (Masterclan)`,
        desc: `Each time a friendly MASTERCLAN model uses a command ability, roll a D6. On a 5+ you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Prized Creations (Moulder)`,
    effects: [
      {
        name: `Prized Creations (Moulder)`,
        desc: `At the start of the first battle round, before determining which player has the first turn, you can pick 1 friendly CLANS MOULDER FIGHTING BEAST model for each MASTER MOULDER in your army. The same FIGHTING BEAST cannot be picked more than once to benefit from this ability. Add D3 to the Wounds characteristic of each of those models (roll separately for each).`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Prized Creations (Moulder)`,
        desc: `You can re-roll hit rolls of 1 for attacks made with melee weapons by selected CLANS MOULDER FIGHTING BEASTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Masters of Murder (Eshin)`,
    effects: [
      {
        name: `Masters of Murder (Eshin)`,
        desc: `At the start of the first battle round, before determining which player has the first turn, you can pick 1 enemy HERO for each CLANS ESHIN HERO in your army.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Masters of Murder (Eshin)`,
        desc: `You can re-roll wound rolls for attacks made by friendly CLANS ESHIN units that target the selected enemy HEROES.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Mighty Warlords (Verminus)`,
    effects: [
      {
        name: `Mighty Warlords (Verminus)`,
        desc: `When you pick command traits, you can pick 1 command trait for up to 6 friendly CLAWLORDS, in addition to 1 command trait for your general if your general is not a CLAWLORD. You must pick a different command trait for each CLAWLORD that has a command trait, and no model can have more than 1 command trait. You can use the command trait for that CLAWLORD even though they are not your general.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Warpstone Sparks (Skryre)`,
    effects: [
      {
        name: `Warpstone Sparks (Skryre)`,
        desc: `If your army includes any CLANS SKRYRE HEROES, at the start of the battle, before either army is set up, you can roll a D3 and add 3 to the roll. The result is the number of warpstone sparks that you can use during the battle. You cannot use more than 1 warpstone spark in the same phase. Each warpstone spark can be used once per battle to carry out 1 of the warpstone spark abilities.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Warpstone Sparks (Skryre)`,
        desc: `In the hero phase, pick 1 friendly CLANS SKRYRE WIZARD. You can re-roll casting, dispelling and unbinding rolls for that WIZARD until the end of that phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warpstone Sparks (Skryre)`,
        desc: `At the end of the phase, roll a D6. On a 1, that WIZARD suffers D3 mortal wounds.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Warpstone Sparks (Skryre)`,
        desc: `In your shooting phase, pick 1 friendly CLANS SKRYRE HERO. Then pick up to 3 different friendly CLANS SKRYRE units that are wholly within 13" of that HERO. You can add 1 to the Damage characteristic of missile weapons used by those units until the end of that phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Warpstone Sparks (Skryre)`,
        desc: `At the end of the phase, roll a D6. On a 1, that HERO suffers D3 mortal wounds.`,
        when: [END_OF_SHOOTING_PHASE, END_OF_COMBAT_PHASE],
      },
      {
        name: `Warpstone Sparks (Skryre)`,
        desc: `In the combat phase, pick 1 friendly CLANS SKRYRE HERO. You can re-roll hit rolls for that HERO until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Echoes of the Great Plagues (Pestilens)`,
    effects: [
      {
        name: `Echoes of the Great Plagues (Pestilens)`,
        desc: `If the unmodified prayer roll for a prayer chanted by a friendly CLANS PESTILENS PRIEST is 6, you can pick 1 of the following Great Plagues to manifest (in addition to the effect of the prayer). Each Great Plague can only manifest once per battle, and no more than one Great Plague can manifest in the same turn.

        Bubonic Blightplague: If this Great Plague manifests, pick the nearest enemy unit within 13" of the PRIEST chanting the prayer. That unit is infected with the Bubonic Blightplague. If several enemy units are equally close, you can pick which is infected. The infected unit suffers D6 mortal wounds. If the infected unit is destroyed by these mortal wounds, you can pick another enemy unit within 6" of the last model to be slain from the infected unit. The new unit is infected and suffers D3 mortal wounds. If the second unit is also destroyed, then another enemy unit within 6" of the last model to be slain suffers D3 mortal wounds, and so on until a unit is not destroyed by the disease or there are no other enemy units within 6" when a unit is destroyed.

        Crimsonweal Curse: If this Great Plague manifests, pick the nearest enemy unit within 13" of the PRIEST chanting the prayer. That unit is infected with the Crimsonweal Curse. If several enemy units are equally close, you can pick which is infected. The infected unit suffers 1 mortal wound. In addition, at the start of each of your hero phases, the infected unit, and each enemy unit within 1" of the infected unit, suffers 1 mortal wound.

        Redmaw Plague: If this Great Plague manifests, pick the nearest enemy HERO within 13" of the PRIEST chanting the prayer. That HERO is infected with the Redmaw Plague. If several enemy HEROES are equally close, you can pick which is infected. If a HERO infected with the Redmaw Plague is within 3" of any other models from its own army at the start of any combat phase, and is not within 3" of any models from your army, then you can treat that HERO as a friendly model until the end of that combat phase.

        The Neverplague: If this Great Plague manifests, you can re-roll prayer rolls for friendly CLANS PESTILENS PRIESTS for the rest of the battle.

        Undulant Scourge: If this Great Plague manifests, pick the nearest enemy unit within 13" of the PRIEST chanting the prayer, and roll 1 dice for each model in that unit. If several enemy units are equally close, you can pick which of those units to roll dice for. For each 5+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Allegiances
