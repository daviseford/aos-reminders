import { HERO_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `The Herdstone`,
    desc: `After territories have been chosen but before players begin to set up their armies, you can set up one HERDSTONE wholly within your territory, more than 12" from enemy territory and more than 1" from any other terrain features. If both players can set up a terrain feature in this manner, each player rolls a dice, rolling again in the case of a tie, and whoever rolls higher can choose the order in which the terrain features are set up.`,
    when: [],
  },
  {
    name: `Brayherd Ambush`,
    desc: `Instead of setting up a BRAYHERD unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. You can set up one reserve unit in ambush for each BEASTS OF CHAOS unit you have set up on the battlefield. At the end of your first movement phase, you must set up all friendly reserve units that are in ambush on the battlefield, wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Any reserve units that cannot be set up are slain.`,
    when: [],
  },
  {
    name: `Creatures of the Storm`,
    desc: `At the start of your hero phase, roll a dice. Each friendly THUNDERSCORN unit more than 3" from any enemy units can move a distance in inches equal to the roll, but cannot move within 3" of any enemy units.`,
    when: [],
  },
  {
    name: `Bloodgorge`,
    desc: `At the end of the combat phase, if any attacks made by a WARHERD unit in that combat phase destroyed any enemy units, heal D3 wounds allocated to that WARHERD unit.`,
    when: [],
  },
  {
    name: `Gratfrays`,
    desc: `If your army is a Beasts of Chaos army, you can give it a Greatfray keyword. All BEASTS OF CHAOS units in your army gain that keyword. You can either choose one of the Greatfrays listed below, or choose another Greatfray you have read about or created yourself. If you choose one from the list below, all units with that keyword benefit from the extra abilities listed for that Greatfray on the page indicated. If you choose a different Greatfray, simply pick the Greatfray that most closely matches the nature of your own.`,
    when: [],
  },
  {
    name: `Primordial Call`,
    desc: `You can summon units of BEASTS OF CHAOS to the battlefield if you collect enough Primordial Call points. At the start of your hero phase, you receive 1 Primordial Call point. In addition, in your hero phase you can choose one friendly BEASTS OF CHAOS HERO within 3" of the HERDSTONE you set up at the start of the battle and say that they will enact a savage blood ritual. If you do so, pick a friendly BEASTS OF CHAOS unit within 3" of the HERDSTONE. That unit suffers D3 mortal wounds. For each mortal wound inflicted on that unit, you receive 1 Primordial Call point.
    If you have 3 or more Primordial Call points at the end of your movement phase, you can summon one or more units from the following list onto the battlefield, and add them to your army. Each unit you summon costs a number of Primordial Call points, as shown on the list, and you can only summon a unit if you have enough Primordial Call points remaining to pay its cost. Summoned units must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Subtract the cost of the summoned unit from the number of Primordial Call points you have available immediately after it has been set up.`,
    when: [],
  },
  {
    name: `Herdstone: Entropic Lodestone`,
    desc: `Subtract 1 from save rolls for attacks that target units within 6" of this terrain feature. At the start of each battle round after the first, add 6" to the range of this ability. BEASTS OF CHAOS units are not affected by this ability.`,
    when: [],
  },
  {
    name: `Herdstone: Locus of Savagery`,
    desc: `BEASTS OF CHAOS units wholly within 6" of this terrain feature do not take battleshock tests. At the start of each battle round after the first, add 6" to the range of this ability.`,
    when: [],
  },
]

export default Abilities
