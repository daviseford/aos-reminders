import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const CommandAbilities = {
  'Lord of the Deepwood Host': {
    effects: [
      {
        name: `Lord of the Deepwood Host`,
        desc: `If a Nomad Prince uses this ability, then until your next hero phase you can reroll all hit rolls of 1 for Wanderer units from your army that are within 8" of him when they attack.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bravest of the Brave': {
    effects: [
      {
        name: `Bravest of the Brave`,
        desc: `If a Wayfinder uses this ability, then until your next hero phase, Wanderers from your army that are within 18" of him in the battleshock phase may use his Bravery instead of their own. In addition, if you roll a 1 for any of these units' battleshock tests, that unit can immediately shoot as if it were the shooting phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Boldest of the Bold': {
    effects: [
      {
        name: `Boldest of the Bold`,
        desc: `If a Waystrider uses this ability, then until your next hero phase, Wanderers from your army that are within 18" of him in the battleshock phase may use his Bravery instead of their own. In addition, if you roll a 1 for any of these units' battleshock tests, that unit can immediately pile in and attack as if it were the combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'See, But Do Not Be Seen': {
    effects: [
      {
        name: `See, But Do Not Be Seen`,
        desc: `If a Waywatcher uses this ability, then until your next hero phase, Wanderers from your army that are within 18" of him gain the Invisible Hunter ability (see left).`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
