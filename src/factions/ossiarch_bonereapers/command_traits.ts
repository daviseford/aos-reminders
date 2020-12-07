import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
const CommandTraits = {
  'Ancient Knowledge': {
    effects: [
      {
        name: `Ancient Knowledge`,
        desc: `You receive 1 additional relentless discipline point at the start of the battle round if this general is on the battlefield.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Immortal Ruler': {
    effects: [
      {
        name: `Immortal Ruler`,
        desc: `The Deathless Warriors battle trait negates a wound or mortal wound allocated to this general on a roll of a 5+ instead of 6.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  //Kavalos Commander traits - Liege-Kavalos only
  'Dark Acolyte': {
    effects: [
      {
        name: `Dark Acolyte`,
        desc: `This general is a WIZARD that knows 1 spell from the Lore of the Mortisans. They can attempt to cast that spell in your hero phase, and attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Peerless Warrior': {
    effects: [
      {
        name: `Peerless Warrior`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this general is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hatred of the Living': {
    effects: [
      {
        name: `Hatred of the Living`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by this general and their mount unless the target has the DEATH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Life-stealer': {
    effects: [
      {
        name: `Life-stealer`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this general's attacks in that combat phase, you can heal up to D3 wounds allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  //Mortisan Qualities - Mortisan only
  'Dire Ultimatum': {
    effects: [
      {
        name: `Dire Ultimatum`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Grave-sand Bones': {
    effects: [
      {
        name: `Grave-sand Bones`,
        desc: `This general knows 1 extra spell from the Lore of the Mortisans.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Oathbreaker Curse': {
    effects: [
      {
        name: `Oathbreaker Curse`,
        desc: `Roll a D6 each time your opponent receives a command point while this general is on the battlefield. On a 6, that command point is lost.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Soul Energy': {
    effects: [
      {
        name: `Soul Energy`,
        desc: `You can reroll casting, dispelling and unbinding rolls for this general. If you do so, this general suffers 1 mortal wound after the effects of the spell (if any) are carried out.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Mortis Praetorians
  "Katakros' Chosen": {
    effects: [
      {
        name: `Katakros' Chosen`,
        desc: `Once per battle, at the start of your hero phase, if this general is on the battlefield you can receive D3 additional relentless discipline points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  //Petrifex Elite
  'Mighty Archaeossian': {
    effects: [
      {
        name: `Mighty Archaeossian`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  //Stalliarch Lords
  'Twisted Challenge': {
    effects: [
      {
        name: `Twisted Challenge`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this general. Until the end of that phase, add 1 to hit rolls made by this general that target that enemy HERO, but subtract 1 from hit rolls for attacks made by this general that target any other unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  //Ivory Host
  'Scrimshawed Savage': {
    effects: [
      {
        name: `Scrimshawed Savage`,
        desc: `In each of your hero phases, roll a D6 for this general. On a 5+, add 1 to the Attacks characteristic of melee weapons used by this general for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Null Myriad
  'Unsettling and Sinister': {
    effects: [
      {
        name: `Unsettling and Sinister`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general. In addition, subtract 1 from the Bravery characteristic of enemy units while they are within 3" of this general.`,
        when: [COMBAT_PHASE, DURING_GAME],
      },
    ],
  },
  //Crematorians
  'Wrathful Avenger': {
    effects: [
      {
        name: `Wrathful Avenger`,
        desc: `If this general is slain, add 2 to the Immolation dice roll instead of 1, and if the roll is successful inflict D3 mortal wounds on the enemy unit instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
