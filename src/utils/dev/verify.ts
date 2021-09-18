import { getFactionList } from 'meta/faction_list'
import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const phaseMap = {
  'After armies are set up, but before': END_OF_SETUP,

  'start of each battle round': START_OF_ROUND,

  'charge rolls': CHARGE_PHASE,

  'in the combat phase': COMBAT_PHASE,
  'made with melee weapons': COMBAT_PHASE,
  'can pile-in': COMBAT_PHASE,
  'can pile in': COMBAT_PHASE,

  'with missile weapons': SHOOTING_PHASE,

  'start of your battleshock phase': START_OF_BATTLESHOCK_PHASE,
  'start of your charge phase': START_OF_CHARGE_PHASE,
  'start of your combat phase': START_OF_COMBAT_PHASE,
  'start of your hero phase': START_OF_HERO_PHASE,
  'start of your movement phase': START_OF_MOVEMENT_PHASE,
  'start of your shooting phase': START_OF_SHOOTING_PHASE,

  'in your battleshock phase': BATTLESHOCK_PHASE,
  'in your charge phase': CHARGE_PHASE,
  'in your combat phase': COMBAT_PHASE,
  'in your hero phase': HERO_PHASE,
  'in your movement phase': MOVEMENT_PHASE,
  'in your shooting phase': SHOOTING_PHASE,

  'in the enemy battleshock phase': BATTLESHOCK_PHASE,
  'in the enemy charge phase': CHARGE_PHASE,
  'in the enemy combat phase': COMBAT_PHASE,
  'in the enemy hero phase': HERO_PHASE,
  'in the enemy movement phase': MOVEMENT_PHASE,
  'in the enemy shooting phase': SHOOTING_PHASE,

  "in your opponent's battleshock phase": BATTLESHOCK_PHASE,
  'do not take battleshock tests for': BATTLESHOCK_PHASE,
  "in your opponent's charge phase": CHARGE_PHASE,
  "in your opponent's combat phase": COMBAT_PHASE,
  "in your opponent's hero phase": HERO_PHASE,
  "in your opponent's movement phase": MOVEMENT_PHASE,
  "in your opponent's shooting phase": SHOOTING_PHASE,

  'end of your battleshock phase': END_OF_BATTLESHOCK_PHASE,
  'end of your charge phase': END_OF_CHARGE_PHASE,
  'end of your combat phase': END_OF_COMBAT_PHASE,
  'end of your hero phase': END_OF_HERO_PHASE,
  'end of your movement phase': END_OF_MOVEMENT_PHASE,
  'end of your shooting phase': END_OF_SHOOTING_PHASE,

  'If this model is slain': WOUND_ALLOCATION_PHASE,
  'If this unit is slain': WOUND_ALLOCATION_PHASE,
  'you allocate a wound': WOUND_ALLOCATION_PHASE,
  'you allocate a mortal wound': WOUND_ALLOCATION_PHASE,

  'Reroll save roll': SAVES_PHASE,
  'reroll save roll': SAVES_PHASE,
  'to save roll': SAVES_PHASE,
  'Worsen the rend of': SAVES_PHASE,
  'have a ward of': SAVES_PHASE,
  'has a ward of': SAVES_PHASE,
}

// Effect names that are flagged by the script, but have been verified and should be ignored for the phase checking
const whitelistedRules = ['The Shield Inviolate']

let logged: string[] = []

const log_once = (message: string) => {
  if (!logged.includes(message)) {
    console.log(message)
    logged = [...logged, message]
  }
}

type TEffectInfo = { name: string; shared: boolean }

const verify = () => {
  log_once('Starting rules verification...')
  const armyList = getFactionList()
  let identicalEffects: Record<string, TEffectInfo[]> = {}

  Object.values(armyList).forEach(faction => {
    const { AggregateArmy } = faction

    const {
      Artifacts = [],
      Battalions = [],
      CommandAbilities = [],
      CommandTraits = [],
      EndlessSpells = [],
      Flavors = [],
      GrandStrategies = [],
      MountTraits = [],
      Prayers = [],
      Scenery = [],
      Spells = [],
      Triumphs = [],
      Units = [],
    } = AggregateArmy

    const combinedEntries = Units.concat(
      Artifacts,
      Battalions,
      CommandAbilities,
      CommandTraits,
      EndlessSpells,
      Flavors,
      GrandStrategies,
      MountTraits,
      Prayers,
      Scenery,
      Spells,
      Triumphs
    )

    combinedEntries.forEach((entry: TEntry) => {
      entry.effects.forEach(e => {
        const matchBy = `${e.name} | ${e.desc} | ${e.when}`
        const effectInfo = { name: entry.name, shared: e.shared || false }
        const matches = identicalEffects[matchBy]

        if (matches) {
          if (!matches.find(existing => existing.name === effectInfo.name)) {
            identicalEffects[matchBy] = [...matches, effectInfo]
          }
        } else {
          identicalEffects[matchBy] = [effectInfo]
        }

        if (whitelistedRules.includes(e.name)) return

        if (e.command_ability) {
          if (e.name !== entry.name)
            log_once(`${e.name} is a command_ability with a different named effect than the entry itself.`)
          return
        }

        if (e.spell || entry.spell) {
          if (!entry.effects.some(x => x.when.includes(HERO_PHASE))) {
            log_once(`${e.name} should be in ${HERO_PHASE}`)
          }
          return
        }

        if (e.when.length === 0) {
          return log_once(`${e.name} is missing a 'when' value`)
        }

        if (!e.spell && new RegExp('Casting value ', 'gi').test(e.desc)) {
          return log_once(`${e.name} should be marked as a spell`)
        }

        Object.keys(phaseMap).forEach(phrase => {
          const phase = phaseMap[phrase]

          if (e.when.includes(phase)) return

          const regex = new RegExp(phrase, 'gi')
          if (regex.test(e.desc) && !entry.effects.some(x => x.when.includes(phase))) {
            return log_once(`${e.name} should probably be in ${phase}`)
          }
        })
      })
    })
  })

  console.log('\n------------------\n------------------\n\nChecking for identical effects...\n')
  Object.entries(identicalEffects).forEach(([description, entries]) => {
    if (entries.length > 1 && !entries.every(entry => entry.shared)) console.log(description, entries)
  })
  console.log('\nDone!')
}

verify()
