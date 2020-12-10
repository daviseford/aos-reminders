import { CHAOS_GRAND_ALLIANCE } from 'meta/factions'
import ChaosArtifacts from './artifacts'
import ChaosCommandAbilities from './command_abilities'
import ChaosCommandTraits from './command_traits'
import Units from './units'

const subFactions = {
  [CHAOS_GRAND_ALLIANCE]: {
    effects: [],
    available: {
      artifacts: [ChaosArtifacts],
      command_abilities: [ChaosCommandAbilities],
      command_traits: [ChaosCommandTraits],
      units: [Units],
    },
  },
  /*
  'Legion of Chaos Ascendant': {
    effects: [pickEffects(BattleTraits, ['Unwavering Devotion'])],

    available: {
      artifacts: [ChaosArtifacts],
      battalions: [Battalions],
      command_abilities: [ChaosCommandAbilities],
      command_traits: [ChaosCommandTraits],
      flavors: [Flavors],
      spells: [Spells],
      units: [
        keyPicker(KhorneUnits, [
          'Bloodcrushers',
          'Bloodletters',
          'Bloodmaster, Herald of Khorne',
          'Bloodthirster of Insensate Rage',
          'Bloodthirster of Unfettered Fury',
          'Exalted Greater Daemon of Khorne',
          'Flesh Hounds',
          'Herald of Khorne on Blood Throne',
          'Karanak',
          'Mazarall the Butcher',
          'Skarbrand',
          'Skull Cannons',
          'Skullmaster, Herald of Khorne',
          'Skulltaker',
          'Wrath of Khorne Bloodthirster']),
        keyPicker(NurgleUnits, [
          'Beasts of Nurgle',
          'Epidemius, Tallyman of Nurgle',
          'Great Unclean One',
          'Horticulous Slimux',
          'Nurglings',
          'Plague Drones',
          'Plaguebearers',
          'Poxbringer, Herald of Nurgle',
          'Pusgoyle Blightlords',
          'Rotigus',
          'Sloppity Bilepiper, Herald of Nurgle',
          'Spoilpox Scrivener, Herald of Nurgle',]),
        keyPicker(SlaaneshUnits, [
          'Bladebringer, Herald on Exalted Chariot',
          'Bladebringer, Herald on Hellflayer',
          'Bladebringer, Herald on Seeker Chariot',
          'Daemonettes',
          'Exalted Chariot',
          'Fiends',
          'Hellflayer',
          'Infernal Enrapturess, Herald of Slaanesh',
          'Keeper of Secrets w/ Living Whip',
          'Keeper of Secrets w/ Ritual Knife',
          'Keeper of Secrets w/ Shining Aegis',
          'Keeper of Secrets w/ Sinistrous Hand',
          'Seeker Chariots',
          'Seekers',
          'Shalaxi Helbane',
          'Soulfeaster Keeper of Secrets',
          'Syll`Esske, the Vengeful Allegiance',
          'The Contorted Epitome',
          'The Masque',
          'Viceleader, Herald of Slaanesh',]),
        keyPicker(TzeentchUnits, [
          'Burning Chariots of Tzeentch',
          'Changecaster, Herald of Tzeentch',
          'Exalted Flamers of Tzeentch',
          'Exalted Greater Demon of Tzeentch',
          'Fateskimmer, Herald of Tzeentch on Burning Chariot',
          'Flamers of Tzeentch',
          'Fluxmaster, Herald of Tzeentch on Disc',
          'Gaunt Summoner of Tzeentch',
          'Horrors of Tzeentch',
          'Kairos Fateweaver',
          'Lord of Change',
          'Screamers of Tzeentch',
          'The Blue Scribes',
          'The Changeling',]),
        keyPicker(SlavesUnits, [
          'Archaon the Everchosen',
          'Be`Lakor',
          'Daemon Prince',
          'Gaunt Summoner on Disc of Tzeentch',
          'Soul Grinder',]),
        keyPicker(SkavenUnits, [
          'Lord Skreech Verminking',
          'Verminlord Corruptor',
          'Verminlord Deceiver',
          'Verminlord Warbringer',
          'Verminlord Warpseer',
          'Warpgnaw Verminlord',]),
      ],
    },
  },
  */
}

export default subFactions
