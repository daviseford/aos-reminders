import { TEntry } from 'types/data'
import { START_OF_COMBAT_PHASE } from 'types/phases'
import { GHUR } from 'types/realmscapes'

// Realm specific command abilities.
const RealmscapeCommands: TEntry[] = [
  {
    name: `Feral Roar (${GHUR})`,
    effects: [
      {
        name: `Feral Roar (${GHUR})`,
        desc: `You can use this command ability at the start of the combat phase. The unit that receives that command must be a MONSTER. Until the end of that phase, when you look up a value on that unit's damage table, it is treated as if it has suffered 0 wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default RealmscapeCommands
