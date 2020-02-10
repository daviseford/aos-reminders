import { TBattalions, TUnits } from 'types/army'
import { HERO_PHASE, CHARGE_PHASE, COMBAT_PHASE } from 'types/phases'
import Khorne from 'army/khorne'
import Nurgle from 'army/nurgle'
import Slaanesh from 'army/slaanesh'
import Tzeentch from 'army/tzeentch'
import SlavestoDarkness from 'army/slaves_to_darkness'
import Skaven from 'army/skaven'
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
    `Rotigus`,
    `Great Unclean One`,
    `Poxbringer, Herald of Nurgle`,
    `Epidemius, Tallyman of Nurgle`,
    `Spoilpox Scrivener, Herald of Nurgle`,
    `Sloppity Bilepiper, Herald of Nurgle`,
    `Horticulous Slimux`,
    `Plaguebearers`,
    `Plague Drones`,
    `Beasts of Nurgle`,
    `Nurglings`,
    `Pusgoyle Blightlords`,
  ]
  return filterUnits(Nurgle.Units, listOfUnits)
}
const getSlaaneshDaemonUnits = () => {
  const listOfUnits = [
    `Keeper of Secrets w/ Ritual Knife`,
    `Keeper of Secrets w/ Living Whip`,
    `Keeper of Secrets w/ Shining Aegis`,
    `Keeper of Secrets w/ Sinistrous Hand`,
    `Syll'Esske, the Vengeful Allegiance`,
    `Shalaxi Helbane`,
    `The Contorted Epitome`,
    `Infernal Enrapturess, Herald of Slaanesh`,
    `The Masque`,
    `Viceleader, Herald of Slaanesh`,
    `Bladebringer, Herald on Hellflayer`,
    `Bladebringer, Herald on Seeker Chariot`,
    `Hellflayer`,
    `Seeker Chariots`,
    `Bladebringer, Herald on Exalted Chariot`,
    `Exalted Chariot`,
    `Fiends`,
    `Daemonettes`,
    `Seekers`,
    `Soulfeaster Keeper of Secrets`,
  ]
  return filterUnits(Slaanesh.Units, listOfUnits)
}

const getTzeentchDaemonUnits = () => {
  const listOfUnits = [
    `Kairos Fateweaver`,
    `Lord of Change`,
    `The Changeling`,
    `Changecaster, Herald of Tzeentch`,
    `Fluxmaster, Herald of Tzeentch on Disc`,
    `Fateskimmer, Herald of Tzeentch on Burning Chariot`,
    `The Blue Scribes`,
    `Horrors of Tzeentch`,
    `Exalted Flamers of Tzeentch`,
    `Flamers of Tzeentch`,
    `Screamers of Tzeentch`,
    `Burning Chariots of Tzeentch`,
    `Gaunt Summoner of Tzeentch`,
    `Exalted Greater Demon of Tzeentch`,
  ]
  return filterUnits(Tzeentch.Units, listOfUnits)
}

const getSlavesDaemonUnits = () => {
  const listOfUnits = [
    `Archaon the Everchosen`,
    `Daemon Prince`,
    `Gaunt Summoner on Disc of Tzeentch`,
    `Soul Grinder`,
  ]
  return filterUnits(SlavestoDarkness.Units, listOfUnits)
}

const getSkavenDaemonUnits = () => {
  const listOfUnits = [
    `Verminlord Corruptor`,
    `Verminlord Deceiver`,
    `Verminlord Warbringer`,
    `Verminlord Warpseer`,
    `Warpgnaw Verminlord`,
  ]
  return filterUnits(Skaven.Units, listOfUnits)
}

// Unit Names
export const Units: TUnits = [
  ...getKhorneDaemonUnits(),
  ...getNurgleDaemonUnits(),
  ...getSlaaneshDaemonUnits(),
  ...getTzeentchDaemonUnits(),
  ...getSlavesDaemonUnits(),
  ...getSkavenDaemonUnits(),
]

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Host of Rage`,
    effects: [
      {
        name: `First Blood`,
        desc: `You can re-roll charge rolls for friendly units from this battalion.`,
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
