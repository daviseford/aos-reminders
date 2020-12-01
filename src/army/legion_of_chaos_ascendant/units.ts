import Khorne from 'army/khorne'
import Nurgle from 'army/nurgle'
import Skaven from 'army/skaven'
import Slaanesh from 'army/slaanesh'
import SlavestoDarkness from 'army/slaves_to_darkness'
import Tzeentch from 'army/tzeentch'
import { TUnits } from 'types/army'
// Battalions
import { TEntry } from 'types/data'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE } from 'types/phases'
import { filterUnits } from 'utils/filterUtils'

const getKhorneDaemonUnits = () => {
  const listOfUnits = [
    `Bloodcrushers`,
    `Bloodletters`,
    `Bloodmaster, Herald of Khorne`,
    `Bloodthirster of Insensate Rage`,
    `Bloodthirster of Unfettered Fury`,
    `Exalted Greater Daemon of Khorne`,
    `Flesh Hounds`,
    `Herald of Khorne on Blood Throne`,
    `Karanak`,
    `Mazarall the Butcher`,
    `Skarbrand`,
    `Skull Cannons`,
    `Skullmaster, Herald of Khorne`,
    `Skulltaker`,
    `Wrath of Khorne Bloodthirster`,
  ]
  return filterUnits(Khorne.Units, listOfUnits)
}

const getNurgleDaemonUnits = () => {
  const listOfUnits = [
    `Beasts of Nurgle`,
    `Epidemius, Tallyman of Nurgle`,
    `Great Unclean One`,
    `Horticulous Slimux`,
    `Nurglings`,
    `Plague Drones`,
    `Plaguebearers`,
    `Poxbringer, Herald of Nurgle`,
    `Pusgoyle Blightlords`,
    `Rotigus`,
    `Sloppity Bilepiper, Herald of Nurgle`,
    `Spoilpox Scrivener, Herald of Nurgle`,
  ]
  return filterUnits(Nurgle.Units, listOfUnits)
}
const getSlaaneshDaemonUnits = () => {
  const listOfUnits = [
    `Bladebringer, Herald on Exalted Chariot`,
    `Bladebringer, Herald on Hellflayer`,
    `Bladebringer, Herald on Seeker Chariot`,
    `Daemonettes`,
    `Exalted Chariot`,
    `Fiends`,
    `Hellflayer`,
    `Infernal Enrapturess, Herald of Slaanesh`,
    `Keeper of Secrets w/ Living Whip`,
    `Keeper of Secrets w/ Ritual Knife`,
    `Keeper of Secrets w/ Shining Aegis`,
    `Keeper of Secrets w/ Sinistrous Hand`,
    `Seeker Chariots`,
    `Seekers`,
    `Shalaxi Helbane`,
    `Soulfeaster Keeper of Secrets`,
    `Syll'Esske, the Vengeful Allegiance`,
    `The Contorted Epitome`,
    `The Masque`,
    `Viceleader, Herald of Slaanesh`,
  ]
  return filterUnits(Slaanesh.Units, listOfUnits)
}

const getTzeentchDaemonUnits = () => {
  const listOfUnits = [
    `Burning Chariots of Tzeentch`,
    `Changecaster, Herald of Tzeentch`,
    `Exalted Flamers of Tzeentch`,
    `Exalted Greater Demon of Tzeentch`,
    `Fateskimmer, Herald of Tzeentch on Burning Chariot`,
    `Flamers of Tzeentch`,
    `Fluxmaster, Herald of Tzeentch on Disc`,
    `Gaunt Summoner of Tzeentch`,
    `Horrors of Tzeentch`,
    `Kairos Fateweaver`,
    `Lord of Change`,
    `Screamers of Tzeentch`,
    `The Blue Scribes`,
    `The Changeling`,
  ]
  return filterUnits(Tzeentch.Units, listOfUnits)
}

const getSlavesDaemonUnits = () => {
  const listOfUnits = [
    `Archaon the Everchosen`,
    `Be'Lakor`,
    `Daemon Prince`,
    `Gaunt Summoner on Disc of Tzeentch`,
    `Soul Grinder`,
  ]
  return filterUnits(SlavestoDarkness.Units, listOfUnits)
}

const getSkavenDaemonUnits = () => {
  const listOfUnits = [
    `Lord Skreech Verminking`,
    `Verminlord Corruptor`,
    `Verminlord Deceiver`,
    `Verminlord Warbringer`,
    `Verminlord Warpseer`,
    `Warpgnaw Verminlord`,
  ]
  return filterUnits(Skaven.Units, listOfUnits)
}

// Unit Names
export const Units: TUnits = []

// Allied units
export const AlliedUnits: TUnits = [
  ...getKhorneDaemonUnits(),
  ...getNurgleDaemonUnits(),
  ...getSkavenDaemonUnits(),
  ...getSlaaneshDaemonUnits(),
  ...getSlavesDaemonUnits(),
  ...getTzeentchDaemonUnits(),
]

export const Battalions: TEntry[] = [
  {
    name: `Host of Rage`,
    effects: [
      {
        name: `First Blood`,
        desc: `You can reroll charge rolls for friendly units from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Host of Corruption`,
    effects: [
      {
        name: `Plague-smeared Blades`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a friendly unit from this battalion is a 6, add 1 to the damage inflicted.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Host of the Arcane`,
    effects: [
      {
        name: `Agents of the Change God`,
        desc: `Add 1 to casting, unbinding, and dispelling rolls made for friendly Chaos Ascendant Daemon wizards from this battalion. They must be wholly within 9" of 2 or more other friendly units from the same battalion to use this ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Host of the Depraved`,
    effects: [
      {
        name: `Sadistic Exemplars`,
        desc: `Add 1 to wound rolls for attacks made with melee units from friendly units in this battalion if they made a charge move this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
]
