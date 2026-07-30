import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Ability, Aos4Catalog, BattleProfile, Warscroll } from '../../aos4/domain'

const catalog = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'aos4', 'catalog', 'catalog.json'), 'utf8')
) as Aos4Catalog

const abilitiesNamed = (name: string): Ability[] =>
  catalog.entities.filter(
    (entity): entity is Ability => entity.kind === 'ability' && entity.name === name
  )

const profileNamed = (name: string): BattleProfile => {
  const profile = catalog.entities.find(
    (entity): entity is BattleProfile => entity.kind === 'battle-profile' && entity.name === name
  )
  if (!profile) throw new Error(`Missing battle profile fixture: ${name}`)
  return profile
}

describe('29 July 2026 rules radar acceptance', () => {
  it('applies the official reminder text and timing corrections', () => {
    expect(abilitiesNamed('DEPLOY REGIMENT')).toHaveLength(2)
    abilitiesNamed('DEPLOY REGIMENT').forEach(ability => {
      expect(ability.text.effect).toContain(
        'You cannot set up units that are not in that regiment on the battlefield or in reserve'
      )
    })

    expect(abilitiesNamed('SIGIL OF DOOM')[0]).toMatchObject({
      text: {
        declare: expect.stringContaining('passive BLOOD TITHE ability'),
        effect: expect.stringContaining('the effects of that ability apply to the target'),
      },
      timings: [
        {
          kind: 'active',
          perspective: 'your',
          raw: 'Your Hero Phase',
          window: { kind: 'turn-phase', phase: 'hero' },
        },
      ],
    })
    expect(abilitiesNamed('REDOLENCE OF VIOLENCE')[0].text.effect).toContain(
      'banished and removed from play'
    )
    expect(abilitiesNamed('THE PRINCE IN THE MIRROR')[0].text.declare).toContain(
      'even if he is a replacement unit'
    )
    expect(abilitiesNamed('MASTER CONTAMINATOR')[0].text.effect).toBe(
      'The target is considered by you to be POLLUTED for the rest of the battle.'
    )
    expect(abilitiesNamed('TASTY MORSELS')[0].text.effect).toContain('‘Hungry Sinkhole’')
    expect(abilitiesNamed('PRIME GUTSERVER')[0].text.effect).toContain(
      'within 1" of a friendly Mawpit'
    )
    expect(abilitiesNamed('DAMNED VESSEL')[0]).toMatchObject({
      abilityKind: 'passive',
      text: {
        effect: expect.stringContaining('Whenever you declare a SPELL ability'),
      },
      timings: [
        {
          kind: 'passive',
          perspective: 'neutral',
          raw: 'Passive',
          window: { kind: 'always' },
        },
      ],
    })
  })

  it('applies the current seasonal points and corrected official profile facts', () => {
    expect(profileNamed('Scourge of Aqshy Iridan the Witness battle profile').points).toBe(320)
    expect(profileNamed('Scourge of Aqshy Ogroid Thaumaturge battle profile').points).toBe(140)
    expect(profileNamed('Scourge of Aqshy Killaboss on Great Gnashtoof battle profile')).toMatchObject({
      points: 150,
      notes: expect.arrayContaining([expect.stringContaining('as a Swamp Beast')]),
    })
    expect(profileNamed('Deathmaster Crixxit battle profile').regimentOptions).toContain(
      '0-1 Clanrats'
    )
  })

  it('removes the retired Hero keyword from Thyrielle’s Zephyrites', () => {
    const warscroll = catalog.entities.find(
      (entity): entity is Warscroll =>
        entity.kind === 'warscroll' && entity.name === 'Thyrielle’s Zephyrites'
    )

    expect(warscroll?.keywords).not.toContain('HERO')
  })
})
