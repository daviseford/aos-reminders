/**
 * Invariants for the New Recruit fixture corpus.
 *
 * Every list is captured in all three formats New Recruit exports. That redundancy is the point:
 * it gives each fixture a self-checking oracle that needs no hand-authored expected value, and it
 * holds before any importer exists.
 *
 * Invariants 3 and 4 (all three formats decode to an identical normalized roster; decoding is
 * deterministic) land with the adapter in plan `2026-07-29-001` step U4.
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import {
  canonicalize,
  describeDifferences,
  parseRosterXml,
  readZipEntries,
  xmlToRosterJson,
} from '../support/newRecruit'
import {
  buildManifest,
  FORMATS,
  LISTS_ROOT,
  listDirectories,
  MANIFEST_PATH,
  serializeManifest,
} from '../support/newRecruitManifest'

const directories = listDirectories()
const fixturePath = (id: string, file: string) => path.join(LISTS_ROOT, id, file)
const readMeta = (id: string) => JSON.parse(readFileSync(fixturePath(id, 'meta.json'), 'utf8'))

describe('New Recruit import fixtures', () => {
  it('has at least one captured list', () => {
    expect(directories.length).toBeGreaterThan(0)
  })

  it('keeps the generated manifest current', () => {
    const committed = readFileSync(MANIFEST_PATH, 'utf8')
    expect(committed).toEqual(serializeManifest(buildManifest()))
  })

  describe.each(directories)('%s', id => {
    it('captures all three export formats plus metadata', () => {
      for (const format of FORMATS) {
        expect(existsSync(fixturePath(id, `list.${format}`))).toBe(true)
      }
      expect(existsSync(fixturePath(id, 'meta.json'))).toBe(true)
    })

    // Invariant 1
    it('stores .rosz as a single-entry zip byte-identical to .ros', () => {
      const entries = readZipEntries(readFileSync(fixturePath(id, 'list.rosz')))
      const rosterEntries = entries.filter(entry => entry.name.toLowerCase().endsWith('.ros'))

      expect(rosterEntries).toHaveLength(1)
      expect(rosterEntries[0].encrypted).toBe(false)
      expect(entries.every(entry => !entry.name.includes('..'))).toBe(true)

      const packed = createHash('sha256').update(rosterEntries[0].data).digest('hex')
      const loose = createHash('sha256')
        .update(readFileSync(fixturePath(id, 'list.ros')))
        .digest('hex')
      expect(packed).toEqual(loose)
    })

    // Invariant 2
    it('stores .json as an exact transliteration of .ros', () => {
      const fromXml = {
        roster: xmlToRosterJson(parseRosterXml(readFileSync(fixturePath(id, 'list.ros'), 'utf8'))),
      }
      const fromJson = JSON.parse(readFileSync(fixturePath(id, 'list.json'), 'utf8'))

      const left = canonicalize(fromXml)
      const right = canonicalize(fromJson)
      expect(describeDifferences(left, right)).toEqual([])
      expect(left).toEqual(right)
    })

    it('matches the composition its metadata claims', () => {
      const meta = readMeta(id)
      const roster = JSON.parse(readFileSync(fixturePath(id, 'list.json'), 'utf8')).roster

      let totalSelections = 0
      let unitSelections = 0
      let modelCount = 0
      let profiles = 0
      let characteristics = 0
      let nestedForces = 0

      const walk = (value: unknown): void => {
        if (Array.isArray(value)) return value.forEach(walk)
        if (!value || typeof value !== 'object') return
        for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
          if (Array.isArray(item)) {
            if (key === 'profiles') profiles += item.length
            if (key === 'characteristics') characteristics += item.length
            if (key === 'forces') nestedForces += item.length
            if (key === 'selections') {
              for (const selection of item as Array<Record<string, unknown>>) {
                totalSelections += 1
                if (selection.type === 'unit') unitSelections += 1
                if (selection.type === 'model') modelCount += Number(selection.number ?? 1)
              }
            }
          }
          walk(item)
        }
      }
      walk(roster)

      expect({
        forces: roster.forces.length,
        nestedForces: nestedForces - roster.forces.length,
        unitSelections,
        modelCount,
        totalSelections,
        profiles,
        characteristics,
      }).toEqual(meta.composition)
    })

    it('declares the shapes it exercises', () => {
      const meta = readMeta(id)
      expect(Array.isArray(meta.shapes)).toBe(true)
      expect(meta.shapes.length).toBeGreaterThan(0)
      expect(new Set(meta.shapes).size).toEqual(meta.shapes.length)
    })

    it('audits sanitisation and carries no personal fields', () => {
      const meta = readMeta(id)
      expect(meta.sanitisation?.audited).toBe(true)

      const source = readFileSync(fixturePath(id, 'list.json'), 'utf8')
      const keys = new Set<string>()
      const collect = (value: unknown): void => {
        if (Array.isArray(value)) return value.forEach(collect)
        if (!value || typeof value !== 'object') return
        for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
          keys.add(key)
          collect(item)
        }
      }
      collect(JSON.parse(source))

      const personal = ['author', 'user', 'username', 'email', 'owner', 'player', 'notes', 'note']
      expect(personal.filter(field => keys.has(field))).toEqual([])
    })

    /**
     * Game legality is a list builder's and a tournament organiser's concern, never ours. A list
     * New Recruit marks illegal must still import completely, so we keep such fixtures on purpose.
     */
    it('keeps declared legality markers intact for illegal lists', () => {
      const meta = readMeta(id)
      if (meta.legality?.legalForPlay !== false) return

      const source = readFileSync(fixturePath(id, 'list.ros'), 'utf8')
      for (const marker of meta.legality.markers ?? []) {
        expect(source).toContain(marker)
      }
    })
  })
})
