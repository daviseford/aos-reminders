import {
  abilityId,
  rulesContextId,
  sourceRecordId,
  type AbilityActor,
  type AbilityKind,
  type TurnPhaseId,
} from '../../aos4/domain'
import {
  normalizeAbility,
  normalizeAbilityText,
  normalizeSourceText,
  parseTiming,
} from '../../aos4/normalize'

const expectedPhases: Array<[string, TurnPhaseId]> = [
  ['Start of Turn', 'start-of-turn'],
  ['Hero Phase', 'hero'],
  ['Movement Phase', 'movement'],
  ['Shooting Phase', 'shooting'],
  ['Charge Phase', 'charge'],
  ['Combat Phase', 'combat'],
  ['End of Turn', 'end-of-turn'],
]

describe('AoS 4 timing normalization', () => {
  it.each([
    ['Start of Any Turn', 'start-of-turn', 'any'],
    ['End of Your Turn', 'end-of-turn', 'your'],
    ['End of the Enemy Turn', 'end-of-turn', 'enemy'],
  ] as const)('parses perspective embedded inside %s', (source, phase, perspective) => {
    const result = parseTiming(source, {
      abilityKind: 'active',
      actor: 'unit',
    })

    expect(result.timings).toEqual([
      expect.objectContaining({
        window: { kind: 'turn-phase', phase },
        perspective,
      }),
    ])
    expect(result.diagnostics).toEqual([])
  })

  it.each(['Your', 'Enemy', 'Any'] as const)('normalizes every %s turn-phase perspective', perspective => {
    expectedPhases.forEach(([sourcePhase, phase]) => {
      const result = parseTiming(`${perspective} ${sourcePhase}`, {
        abilityKind: 'active',
        actor: 'unit',
      })

      expect(result.diagnostics).toEqual([])
      expect(result.timings).toEqual([
        expect.objectContaining({
          kind: 'active',
          perspective: perspective.toLowerCase(),
          window: { kind: 'turn-phase', phase },
        }),
      ])
    })
  })

  it('normalizes deployment, battle boundaries, passive timing, and combat priority', () => {
    const cases = [
      ['Deployment Phase', { kind: 'deployment' }],
      ['Start of Battle', { kind: 'battle-start' }],
      ['Start of Battle Round', { kind: 'battle-round-start' }],
      ['Start of the First Battle Round', { kind: 'battle-round-start', round: 1 }],
      ['Start of the Third Battle Round', { kind: 'battle-round-start', round: 3 }],
      ['End of Battle Round', { kind: 'battle-round-end' }],
      ['End of the 2nd Battle Round', { kind: 'battle-round-end', round: 2 }],
      ['End of Battle', { kind: 'battle-end' }],
    ] as const

    cases.forEach(([raw, window]) => {
      expect(parseTiming(raw, { abilityKind: 'active', actor: 'player' }).timings[0].window).toEqual(window)
    })

    expect(parseTiming('Passive', { abilityKind: 'passive', actor: 'unit' }).timings[0]).toEqual({
      kind: 'passive',
      perspective: 'neutral',
      raw: 'Passive',
      window: { kind: 'always' },
    })

    expect(
      parseTiming('Any Combat Phase - Strike-First', {
        abilityKind: 'active',
        actor: 'unit',
      }).timings[0].priority
    ).toBe('strike-first')
    expect(
      parseTiming('Any Combat Phase - Strike-Last', {
        abilityKind: 'active',
        actor: 'unit',
      }).timings[0].priority
    ).toBe('strike-last')
  })

  it('normalizes usage periods and defaults scope from the actor', () => {
    const cases = [
      ['Once Per Phase, Your Hero Phase', 'phase'],
      ['Once Per Turn, Your Movement Phase', 'turn'],
      ['Once Per Battle Round, Any Combat Phase', 'battle-round'],
      ['Once Per Battle, Deployment Phase', 'battle'],
    ] as const

    cases.forEach(([raw, period]) => {
      expect(parseTiming(raw, { abilityKind: 'active', actor: 'unit' }).timings[0].usage).toEqual({
        limit: 1,
        period,
        scope: 'unit',
      })
    })

    expect(
      parseTiming('Once Per Battle (Army), Your Hero Phase', {
        abilityKind: 'active',
        actor: 'player',
      }).timings[0].usage?.scope
    ).toBe('army')
  })

  it('retains a usage-only active timing as phase-independent', () => {
    const result = parseTiming('Once Per Turn (Army)', {
      abilityKind: 'active',
      actor: 'unit',
    })

    expect(result.timings).toEqual([
      {
        kind: 'active',
        perspective: 'neutral',
        raw: 'Once Per Turn (Army)',
        usage: { limit: 1, period: 'turn', scope: 'army' },
        window: { kind: 'phase-independent' },
      },
    ])
    expect(result.diagnostics).toEqual([])
  })

  it('preserves unknown and conflicting timing as diagnostics instead of guessing', () => {
    const unknown = parseTiming('After mustering the army', {
      abilityKind: 'active',
      actor: 'army',
    })
    expect(unknown.timings[0]).toEqual({
      kind: 'active',
      perspective: 'neutral',
      raw: 'After mustering the army',
      window: { kind: 'unknown' },
    })
    expect(unknown.diagnostics.map(diagnostic => diagnostic.code)).toContain('unknown-timing')

    const conflict = parseTiming('Your or Enemy Shooting Phase', {
      abilityKind: 'reaction',
      actor: 'unit',
    })
    expect(conflict.timings[0].perspective).toBe('neutral')
    expect(conflict.diagnostics.map(diagnostic => diagnostic.code)).toContain('conflicting-perspective')
  })

  it('does not mistake reaction trigger prose for the phase perspective', () => {
    const result = parseTiming('Your Shooting Phase (Reaction): When an enemy declares an ATTACK ability.', {
      abilityKind: 'reaction',
      actor: 'unit',
    })

    expect(result.timings[0].perspective).toBe('your')
    expect(result.diagnostics.map(diagnostic => diagnostic.code)).not.toContain('conflicting-perspective')
  })

  it('models phase-independent reactions as triggered windows', () => {
    const result = parseTiming(
      'Once Per Turn (Army), Reaction: This unit was picked as the target of a non-Core ability',
      {
        abilityKind: 'reaction',
        actor: 'unit',
      }
    )

    expect(result.timings).toEqual([
      {
        kind: 'reaction',
        perspective: 'neutral',
        raw: 'Once Per Turn (Army), Reaction: This unit was picked as the target of a non-Core ability',
        usage: { limit: 1, period: 'turn', scope: 'army' },
        window: { kind: 'reaction' },
      },
    ])
    expect(result.diagnostics).toEqual([])
  })

  it('uses polluted markup only as parsing evidence and retains safe raw text', () => {
    const result = parseTiming('%123 <ky>Any Combat Phase</ky> (Reaction)', {
      abilityKind: 'reaction',
      actor: 'unit',
    })

    expect(result.timings[0]).toEqual({
      kind: 'reaction',
      perspective: 'any',
      raw: '%123 Any Combat Phase (Reaction)',
      window: { kind: 'turn-phase', phase: 'combat' },
    })
  })
})

describe('AoS 4 source text normalization', () => {
  it('converts supported markup to plain text and diagnoses unsafe content', () => {
    const result = normalizeSourceText(
      '<b>Declare:</b> Pick this unit.<br>' +
        '<script>alert("bad")</script>' +
        '<a href="javascript:alert(1)" onclick="bad()">Effect:</a> Move it.'
    )

    expect(result.text).toBe('Declare: Pick this unit.\nEffect: Move it.')
    expect(result.text).not.toContain('<')
    expect(result.text).not.toContain('alert')
    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toEqual([
      'unsafe-html-element',
      'unsafe-html-url',
      'unsafe-html-attribute',
    ])
  })

  it('removes encoded Wahapedia keyword wrappers without removing their text', () => {
    const result = normalizeSourceText('&lt;KY&gt;THE BLACKTALONS&lt;/KY&gt;')

    expect(result.text).toBe('THE BLACKTALONS')
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'source-marker-removed' }))
  })

  it('splits Declare and Effect while retaining reaction trigger text', () => {
    const result = normalizeAbilityText({
      descriptionHtml:
        '<b>Declare:</b> Pick a visible enemy unit.<br><br><b>Effect:</b> Subtract 1 from hit rolls.',
      reactionTriggerHtml: 'An enemy declares an <ky>ATTACK</ky> ability.',
    })

    expect(result.text).toEqual({
      declare: 'Pick a visible enemy unit.',
      effect: 'Subtract 1 from hit rolls.',
      reactionTrigger: 'An enemy declares an ATTACK ability.',
    })
    expect(result.diagnostics).toEqual([])
  })

  it('uses unlabeled description text as the effect', () => {
    expect(normalizeAbilityText({ descriptionHtml: 'This unit has WARD (6+).' }).text).toEqual({
      effect: 'This unit has WARD (6+).',
    })
  })
})

describe('AoS 4 ability normalization', () => {
  it.each([
    ['active', 'unit'],
    ['passive', 'army'],
    ['reaction', 'player'],
  ] as Array<[AbilityKind, AbilityActor]>)('builds a source-neutral %s ability', (abilityKind, actor) => {
    const rawTiming =
      abilityKind === 'passive'
        ? 'Passive'
        : abilityKind === 'reaction'
          ? 'Enemy Shooting Phase (Reaction)'
          : 'Your Hero Phase'
    const result = normalizeAbility({
      id: abilityId('20000000-0000-4000-8000-000000000001'),
      revision: 'fixture-1',
      name: 'Fixture Ability',
      abilityKind,
      actor,
      descriptionHtml: '<b>Effect:</b> Apply the fixture effect.',
      reactionTriggerHtml: abilityKind === 'reaction' ? 'An enemy declares an ATTACK ability.' : undefined,
      rawTiming,
      keywords: [' CORE ', 'CORE'],
      rulesContextIds: [rulesContextId('20000000-0000-4000-8000-000000000002')],
      sourceRefs: [{ sourceRecordId: sourceRecordId('fixture', 'ability-1') }],
    })

    expect(result.ability).toEqual(
      expect.objectContaining({
        abilityKind,
        actor,
        keywords: ['CORE'],
        text: expect.objectContaining({ effect: 'Apply the fixture effect.' }),
      })
    )
    expect(result.ability.timings).toHaveLength(1)
    expect(result.diagnostics).toEqual([])
  })

  it('attaches source identity to normalization diagnostics', () => {
    const sourceId = sourceRecordId('fixture', 'ability-with-unknown-timing')
    const result = normalizeAbility({
      id: abilityId('20000000-0000-4000-8000-000000000003'),
      revision: 'fixture-1',
      name: 'Unknown Timing',
      abilityKind: 'active',
      actor: 'unit',
      descriptionHtml: 'Apply the fixture effect.',
      rawTiming: 'After mustering',
      keywords: [],
      rulesContextIds: [rulesContextId('20000000-0000-4000-8000-000000000002')],
      sourceRefs: [{ sourceRecordId: sourceId }],
    })

    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unknown-timing',
        sourceRecordId: sourceId,
      })
    )
  })
})
