import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { BattleProfile, Faction, Warscroll } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * The September 2026 Battletome: Sons of Behemat cycle (Games Workshop publications dated
 * 2026-09-09, Rules Radar alarm in #1757) accepted the faction's battle-profile supplement as
 * corpus 2026-09-10. Its points corrections apply to the nine carried-over units and supersede
 * the July 2026 main-document rows.
 *
 * The battletome rules text shipped from the pinned BSData `gargants`-branch catalogue from corpus
 * 2026-09-22, and from the re-pinned Wahapedia Sons of Behemat pages from corpus 2026-09-25 (issue
 * #1999), which also brought the King Brodd's Stomp September 2026 rewrite and the Stone Lobbas
 * Spearhead (`sonsOfBehematBattletome.test.ts` covers the swap in detail). This file keeps the
 * surviving points/regiment-option assertions for the nine carried-over units. Krong the Club
 * ships as of corpus 2026-09-24, its rules text from the pinned BSData Regiments of Renown
 * catalogue.
 */

const SEPTEMBER_POINTS: Array<{ name: string; points: number }> = [
  { name: 'Beast-smasher Mega-Gargant', points: 380 },
  { name: 'Gatebreaker Mega-Gargant', points: 400 },
  { name: 'King Brodd', points: 430 },
  { name: 'Kragnos, the End of Empires', points: 580 },
  { name: 'Kraken-eater Mega-Gargant', points: 370 },
  { name: 'Warstomper Mega-Gargant', points: 390 },
  { name: 'Mancrusher Gargant', points: 140 },
  { name: 'Scourge of Aqshy Gatebreaker Mega-Gargant', points: 400 },
  { name: 'Scourge of Aqshy Mancrusher Gargant', points: 150 },
]

const factionByName = (name: string): Faction =>
  AOS4_FULL_CATALOG.entities.find(
    (entity): entity is Faction => entity.kind === 'faction' && entity.name === name
  )!

const warscrollFor = (faction: Faction, name: string): Warscroll | undefined =>
  AOS4_FULL_CATALOG.entities.find(
    (entity): entity is Warscroll =>
      entity.kind === 'warscroll' && entity.name === name && entity.factionIds.includes(faction.id)
  )

const profileFor = (warscroll: Warscroll): BattleProfile | undefined =>
  AOS4_FULL_CATALOG.entities.find(
    (entity): entity is BattleProfile =>
      entity.kind === 'battle-profile' && entity.warscrollId === warscroll.id
  )

describe('the September 2026 Sons of Behemat battle-profile supplement (#1757)', () => {
  const sob = factionByName('Sons of Behemat')

  it.each(SEPTEMBER_POINTS)('applies the September 2026 points for $name', ({ name, points }) => {
    const warscroll = warscrollFor(sob, name)
    expect(warscroll).toBeDefined()
    expect(profileFor(warscroll!)).toMatchObject({ points })
  })

  it('drops the Eager Lout regiment option from Kragnos per the September 2026 document', () => {
    const kragnos = warscrollFor(sob, 'Kragnos, the End of Empires')!
    expect(profileFor(kragnos)?.regimentOptions).toEqual(['Any Sons of Behemat'])
  })

  it('ships the Stone Lobbas Spearhead from the re-pinned faction page, and Krong the Club once', () => {
    expect(
      AOS4_FULL_CATALOG.entities.filter(
        entity => entity.kind === 'content-group' && entity.name === 'Krong the Club'
      )
    ).toHaveLength(1)
    const spearhead = AOS4_FULL_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!
    const stoneLobbas = AOS4_FULL_CATALOG.entities.filter(
      entity => entity.kind === 'content-group' && entity.name === 'Stone Lobbas'
    )
    expect(stoneLobbas.length).toBeGreaterThan(0)
    stoneLobbas.forEach(group => expect(group.rulesContextIds).toEqual([spearhead.id]))
  })

  it('records a reviewed deviation for only The Emberwatch, now that the battletome units ship', () => {
    const ledger = JSON.parse(
      readFileSync(
        path.join(process.cwd(), 'data', 'aos4', 'reviews', 'profile-only-deviations.json'),
        'utf8'
      )
    ) as { deviations: Array<{ faction: string; name: string }> }
    expect(ledger.deviations.map(deviation => `${deviation.faction}: ${deviation.name}`).sort()).toEqual([
      'Warhammer Legends: The Emberwatch',
    ])
  })

  it('carries the September 2026 Sons of Behemat publications as accepted official artifacts', () => {
    const titles = AOS4_FULL_CATALOG.sourceArtifacts.map(artifact => artifact.title)
    expect(titles).toEqual(
      expect.arrayContaining([
        'Battle Profiles - Sons of Behemat',
        'Regiments of Renown - Sons of Behemat',
        'Spearhead: Sons of Behemat - Stone Lobbas',
      ])
    )
  })
})
