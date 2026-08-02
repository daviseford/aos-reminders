import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  evaluateProvisionalWatch,
  validateProvisionalWatchConfig,
  type ProvisionalWatchConfig,
} from '../../aos4/radar/provisionalWatch'

/**
 * The provisional-verification watch (GitHub Actions replacement for the operator-machine cron):
 * it checks the pages named by the accepted review's community-fallback verification conditions
 * for reviewed sentinel strings and reports which have appeared. Evidence, not acceptance.
 */

const NOW = '2026-08-01T14:07:00.000Z'

const config: ProvisionalWatchConfig = {
  schemaVersion: 1,
  watches: [
    {
      id: 'watch-a',
      issueNumber: 100,
      reason: 'Reason A.',
      url: 'https://wahapedia.ru/aos4/factions/example/',
      sentinels: [
        { label: 'First option', needle: 'First Option' },
        { label: 'Second option', needle: 'Second Option' },
      ],
    },
    {
      id: 'watch-b',
      issueNumber: 100,
      reason: 'Reason B.',
      url: 'https://raw.githubusercontent.com/example/repo/refs/heads/main/file.cat',
      sentinels: [{ label: 'Group definition', needle: ' id="abcd-1234"' }],
    },
  ],
}

describe('the provisional-verification watch', () => {
  it('accepts the checked-in watch configuration', () => {
    const checkedIn = validateProvisionalWatchConfig(
      JSON.parse(
        readFileSync(path.join(process.cwd(), 'data', 'aos4', 'radar', 'provisional-watch.json'), 'utf8')
      )
    )
    expect(checkedIn.watches.length).toBeGreaterThan(0)
    checkedIn.watches.forEach(watch => {
      expect([1812, 1828, 1850]).toContain(watch.issueNumber)
      expect(['wahapedia.ru', 'raw.githubusercontent.com']).toContain(new URL(watch.url).hostname)
    })
  })

  it('rejects malformed configurations', () => {
    expect(() => validateProvisionalWatchConfig({ schemaVersion: 1, watches: [] })).toThrow(/at least one/)
    expect(() =>
      validateProvisionalWatchConfig({
        schemaVersion: 1,
        watches: [{ id: 'x', issueNumber: 1, reason: 'r', url: 'http://insecure/', sentinels: [{ label: 'l', needle: 'n' }] }],
      })
    ).toThrow(/https/)
    expect(() =>
      validateProvisionalWatchConfig({
        schemaVersion: 1,
        watches: [
          { id: 'x', issueNumber: 1, reason: 'r', url: 'https://a/', sentinels: [{ label: 'l', needle: 'n' }] },
          { id: 'x', issueNumber: 2, reason: 'r', url: 'https://b/', sentinels: [{ label: 'l', needle: 'n' }] },
        ],
      })
    ).toThrow(/duplicated/)
  })

  it('reports found and missing sentinels case-insensitively and notifies per issue', async () => {
    const bodies = new Map([
      [config.watches[0].url, 'intro FIRST option text'],
      [config.watches[1].url, '<x targetId="abcd-1234"/>'],
    ])
    const report = await evaluateProvisionalWatch(config, {
      now: () => NOW,
      fetch: async url => ({ status: 200, body: bodies.get(url) ?? '' }),
    })
    expect(report.observedAt).toBe(NOW)
    expect(report.findings).toMatchObject([
      { id: 'watch-a', availability: 'accessible', found: ['First option'], missing: ['Second option'] },
      // The leading space in the needle keeps a targetId reference from matching an id definition.
      { id: 'watch-b', availability: 'accessible', found: [], missing: ['Group definition'] },
    ])
    expect(report.notifications).toHaveLength(1)
    const [notification] = report.notifications
    expect(notification.issueNumber).toBe(100)
    expect(notification.marker).toBe(`<!-- aos4-provisional-watch:100:${notification.fingerprint} -->`)
    expect(notification.body).toContain(notification.marker)
    expect(notification.body).toContain('- [x] First option')
    expect(notification.body).toContain('- [ ] Second option (not yet present)')
    expect(notification.body).toContain('candidate intake')
  })

  it('keeps the fingerprint stable for the same findings and changes it when more content appears', async () => {
    const run = (body: string) =>
      evaluateProvisionalWatch(config, {
        now: () => NOW,
        fetch: async url => ({ status: 200, body: url === config.watches[0].url ? body : '' }),
      })
    const first = await run('First Option')
    const repeat = await run('First Option')
    const grown = await run('First Option and Second Option')
    expect(repeat.notifications[0].fingerprint).toBe(first.notifications[0].fingerprint)
    expect(grown.notifications[0].fingerprint).not.toBe(first.notifications[0].fingerprint)
  })

  it('marks an unreachable page inaccessible without inventing findings', async () => {
    const report = await evaluateProvisionalWatch(config, {
      now: () => NOW,
      fetch: async url => {
        if (url === config.watches[0].url) throw new Error('offline')
        return { status: 503, body: 'First Option' }
      },
    })
    expect(report.findings.map(finding => finding.availability)).toEqual(['inaccessible', 'inaccessible'])
    expect(report.notifications).toEqual([])
  })
})
