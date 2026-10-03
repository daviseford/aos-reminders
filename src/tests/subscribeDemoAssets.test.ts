import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/*
 * The /subscribe demo reel (#1761) is a checked-in public file, so nothing in the build measures it.
 * These pins keep the web encode the page was reviewed with: small enough to be a reasonable
 * press-play download on a phone (the 1080p60 master is ~13 MB and does not belong here), and
 * fast-start, so playback can begin before the whole file arrives.
 */
const publicImg = (name: string) => join(process.cwd(), 'public', 'img', name)

/** Top-level MP4 box types in file order. */
const topLevelBoxes = (bytes: Buffer): string[] => {
  const boxes: string[] = []
  let offset = 0
  while (offset + 8 <= bytes.length) {
    let size = bytes.readUInt32BE(offset)
    const type = bytes.toString('latin1', offset + 4, offset + 8)
    if (size === 1) size = Number(bytes.readBigUInt64BE(offset + 8))
    if (size === 0) size = bytes.length - offset
    if (size < 8) throw new Error(`Malformed MP4 box ${type} at ${offset}`)
    boxes.push(type)
    offset += size
  }
  return boxes
}

describe('subscribe demo reel assets', () => {
  const video = readFileSync(publicImg('subscribe-demo-2026-10.mp4'))
  const poster = readFileSync(publicImg('subscribe-demo-2026-10-poster.jpg'))

  it('keeps the video to the web encode, not the master', () => {
    expect(video.length).toBeLessThan(8 * 1024 * 1024)
  })

  it('is a fast-start MP4: the index comes before the media', () => {
    const boxes = topLevelBoxes(video)
    expect(boxes[0]).toBe('ftyp')
    expect(boxes.indexOf('moov')).toBeGreaterThan(-1)
    expect(boxes.indexOf('moov')).toBeLessThan(boxes.indexOf('mdat'))
  })

  it('keeps the poster a small JPEG', () => {
    expect(poster.subarray(0, 3)).toEqual(Buffer.from([0xff, 0xd8, 0xff]))
    expect(poster.length).toBeLessThan(150 * 1024)
  })
})
