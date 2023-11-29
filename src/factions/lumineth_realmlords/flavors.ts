import { TItemDescriptions } from 'factions/factionTypes'
import meta_rule_sources from 'meta/rule_sources'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

const Flavors = {
  Ymetrica: {
    effects: [
      {
        name: `Mountain Realm`,
        desc: `The Enduring as Rock ability of friendly Ymetrica Alarith units worsens the Rend characteristic of attacks that target those units by 2 instead of 1, to a minimum of 0.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
  Syar: {
    effects: [
      {
        name: `Gleaming Brightness`,
        desc: `Friendly Syar units start the battle with 2 aetherquartz reserves instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  Iliatha: {
    effects: [
      {
        name: `Unity of Purpose`,
        desc: `Once per turn, you can say that 2 friendly Iliatha Vanari units will use their aetherquartz reserves to use an aetherquartz reserve ability in the same phase instead of only 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  Zaitrec: {
    effects: [
      {
        name: `Lambent Mystics`,
        desc: `Add 1 to casting, dispelling or unbinding rolls for friendly Zaitrec Wizards.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Alumnia: {
    effects: [
      {
        name: `Claim the field`,
        desc: `If the base of each model in a friendly Alumnia Vanari unit is touching the bases of 2 or more other models in the same unit, each model in that unit that is within 6" of an objective counts as 2 models for the purposes of contesting that objective.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Helon: {
    effects: [
      {
        name: `Gale of Killing Shafts`,
        desc: `In your shooting phase, when you pick a friendly Helon unit to shoot, you can say that it will unleash a gale of killing shafts. If you do so, in that phase, you can add 1 to hit rolls and wound rolls for that unit's missile weapons, but that unit can only target enemy units within 6" of it.`,
        when: [SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
} satisfies TItemDescriptions

export default Flavors
