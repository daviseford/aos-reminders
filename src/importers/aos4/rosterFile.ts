import type { Aos4ImportDiagnostic, Aos4ParsedRosterResult } from '../../aos4/import'
import { parseAos4RosterXml } from './rosterXml'
import { decodeAos4TextRoster } from './textRoster'

export const MAX_ROSTER_FILE_BYTES = 1024 * 1024
export const MAX_EXPANDED_ROSTER_BYTES = 5 * 1024 * 1024

export interface Aos4RosterFileInput {
  name: string
  bytes: Uint8Array
}

interface ZipRosterEntry {
  name: string
  originalSize: number
}

class RosterFileError extends Error {
  constructor(
    readonly code: Aos4ImportDiagnostic['code'],
    message: string
  ) {
    super(message)
  }
}

const inputError = (code: Aos4ImportDiagnostic['code'], message: string): Aos4ParsedRosterResult => ({
  diagnostics: [{ code, severity: 'error', message }],
})

export const createRosterFileTooLargeResult = (): Aos4ParsedRosterResult =>
  inputError('input-too-large', `Roster files must be ${MAX_ROSTER_FILE_BYTES} bytes or smaller.`)

const readUint16 = (view: DataView, offset: number): number => {
  if (offset < 0 || offset + 2 > view.byteLength) {
    throw new RosterFileError('unsafe-input', 'The roster archive is truncated.')
  }
  return view.getUint16(offset, true)
}

const readUint32 = (view: DataView, offset: number): number => {
  if (offset < 0 || offset + 4 > view.byteLength) {
    throw new RosterFileError('unsafe-input', 'The roster archive is truncated.')
  }
  return view.getUint32(offset, true)
}

const findEndOfCentralDirectory = (view: DataView): number => {
  const minimum = Math.max(0, view.byteLength - 65_557)
  for (let offset = view.byteLength - 22; offset >= minimum; offset -= 1) {
    if (readUint32(view, offset) === 0x06054b50) return offset
  }
  throw new RosterFileError('unsafe-input', 'The roster file is not a valid ZIP archive.')
}

const isTraversalPath = (name: string): boolean => {
  const normalized = name.replace(/\\/g, '/')
  return (
    normalized.startsWith('/') ||
    /^[A-Za-z]:/.test(normalized) ||
    normalized.split('/').some(segment => segment === '..')
  )
}

const isMetadataEntry = (name: string): boolean => {
  const normalized = name.replace(/\\/g, '/')
  const segments = normalized.split('/')
  const basename = segments[segments.length - 1]
  return segments[0] === '__MACOSX' || basename === '.DS_Store' || basename.startsWith('._')
}

const findRosterZipEntry = (bytes: Uint8Array): ZipRosterEntry => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const eocd = findEndOfCentralDirectory(view)
  const disk = readUint16(view, eocd + 4)
  const centralDisk = readUint16(view, eocd + 6)
  const diskEntries = readUint16(view, eocd + 8)
  const totalEntries = readUint16(view, eocd + 10)
  const centralSize = readUint32(view, eocd + 12)
  const centralOffset = readUint32(view, eocd + 16)
  const archiveCommentLength = readUint16(view, eocd + 20)
  if (
    disk !== 0 ||
    centralDisk !== 0 ||
    diskEntries !== totalEntries ||
    totalEntries === 0xffff ||
    centralOffset === 0xffffffff ||
    centralSize === 0xffffffff ||
    centralOffset + centralSize > eocd ||
    eocd + 22 + archiveCommentLength > bytes.byteLength
  ) {
    throw new RosterFileError('unsafe-input', 'Multi-disk and ZIP64 roster archives are not supported.')
  }

  const decoder = new TextDecoder('utf-8', { fatal: true })
  const candidates: ZipRosterEntry[] = []
  let cursor = centralOffset
  for (let index = 0; index < totalEntries; index += 1) {
    if (readUint32(view, cursor) !== 0x02014b50) {
      throw new RosterFileError('unsafe-input', 'The roster archive central directory is malformed.')
    }
    const flags = readUint16(view, cursor + 8)
    const compression = readUint16(view, cursor + 10)
    const originalSize = readUint32(view, cursor + 24)
    const nameLength = readUint16(view, cursor + 28)
    const extraLength = readUint16(view, cursor + 30)
    const commentLength = readUint16(view, cursor + 32)
    const localOffset = readUint32(view, cursor + 42)
    const nameStart = cursor + 46
    const nameEnd = nameStart + nameLength
    if (nameEnd > bytes.byteLength) {
      throw new RosterFileError('unsafe-input', 'The roster archive entry name is truncated.')
    }

    let name: string
    try {
      name = decoder.decode(bytes.subarray(nameStart, nameEnd))
    } catch {
      throw new RosterFileError('unsafe-input', 'The roster archive contains an invalid entry name.')
    }
    if ((flags & 1) !== 0) {
      throw new RosterFileError('unsafe-input', 'Encrypted roster archives are not supported.')
    }
    if (readUint32(view, localOffset) !== 0x04034b50) {
      throw new RosterFileError('unsafe-input', 'The roster archive local header is malformed.')
    }
    const localFlags = readUint16(view, localOffset + 6)
    const localCompression = readUint16(view, localOffset + 8)
    const localNameLength = readUint16(view, localOffset + 26)
    const localExtraLength = readUint16(view, localOffset + 28)
    const localNameStart = localOffset + 30
    const localNameEnd = localNameStart + localNameLength
    if (localNameEnd + localExtraLength > bytes.byteLength) {
      throw new RosterFileError('unsafe-input', 'The roster archive local entry is truncated.')
    }
    let localName: string
    try {
      localName = decoder.decode(bytes.subarray(localNameStart, localNameEnd))
    } catch {
      throw new RosterFileError('unsafe-input', 'The roster archive contains an invalid entry name.')
    }
    if ((localFlags & 1) !== 0) {
      throw new RosterFileError('unsafe-input', 'Encrypted roster archives are not supported.')
    }
    if (localName !== name || localCompression !== compression) {
      throw new RosterFileError('unsafe-input', 'The roster archive entry headers do not agree.')
    }
    if (isTraversalPath(name)) {
      throw new RosterFileError('unsafe-input', 'Roster archives cannot contain traversal paths.')
    }
    if (!name.endsWith('/') && !isMetadataEntry(name) && name.toLocaleLowerCase('en').endsWith('.ros')) {
      if (compression !== 0 && compression !== 8) {
        throw new RosterFileError(
          'unsafe-input',
          'The roster archive uses an unsupported compression method.'
        )
      }
      candidates.push({ name, originalSize })
    }
    cursor = nameEnd + extraLength + commentLength
    if (cursor > bytes.byteLength) {
      throw new RosterFileError('unsafe-input', 'The roster archive central directory is truncated.')
    }
  }
  if (cursor !== centralOffset + centralSize) {
    throw new RosterFileError('unsafe-input', 'The roster archive central directory is inconsistent.')
  }

  if (candidates.length !== 1) {
    throw new RosterFileError('unsafe-input', 'A roster archive must contain exactly one .ros file.')
  }
  if (candidates[0].originalSize > MAX_EXPANDED_ROSTER_BYTES) {
    throw new RosterFileError(
      'input-too-large',
      `Expanded roster XML must be ${MAX_EXPANDED_ROSTER_BYTES} bytes or smaller.`
    )
  }
  return candidates[0]
}

const extractRosterXml = async (bytes: Uint8Array): Promise<Uint8Array> => {
  const candidate = findRosterZipEntry(bytes)
  const { Unzip, UnzipInflate, UnzipPassThrough } = await import('fflate')
  const chunks: Uint8Array[] = []
  let expandedBytes = 0
  let completed = false
  let failure: RosterFileError | undefined

  const unzip = new Unzip(file => {
    if (file.name !== candidate.name) {
      file.ondata = () => undefined
      return
    }
    if (file.originalSize !== undefined && file.originalSize > MAX_EXPANDED_ROSTER_BYTES) {
      failure = new RosterFileError(
        'input-too-large',
        `Expanded roster XML must be ${MAX_EXPANDED_ROSTER_BYTES} bytes or smaller.`
      )
      file.terminate()
      return
    }
    file.ondata = (error, chunk, final) => {
      if (error) {
        failure = new RosterFileError('unsafe-input', 'The roster archive could not be expanded.')
        return
      }
      expandedBytes += chunk.byteLength
      if (expandedBytes > MAX_EXPANDED_ROSTER_BYTES) {
        failure = new RosterFileError(
          'input-too-large',
          `Expanded roster XML must be ${MAX_EXPANDED_ROSTER_BYTES} bytes or smaller.`
        )
        file.terminate()
        return
      }
      chunks.push(chunk)
      if (final) completed = true
    }
    file.start()
  })
  unzip.register(UnzipPassThrough)
  unzip.register(UnzipInflate)
  try {
    unzip.push(bytes, true)
  } catch {
    throw failure ?? new RosterFileError('unsafe-input', 'The roster archive could not be expanded.')
  }
  if (failure) throw failure
  if (!completed) {
    throw new RosterFileError('unsafe-input', 'The roster archive does not contain its declared roster.')
  }

  const result = new Uint8Array(expandedBytes)
  let offset = 0
  chunks.forEach(chunk => {
    result.set(chunk, offset)
    offset += chunk.byteLength
  })
  return result
}

const decodeUtf8 = (bytes: Uint8Array, description: string): string => {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    throw new RosterFileError('unsafe-input', `${description} must be valid UTF-8 text.`)
  }
}

export const decodeAos4RosterFile = async (input: Aos4RosterFileInput): Promise<Aos4ParsedRosterResult> => {
  if (input.bytes.byteLength > MAX_ROSTER_FILE_BYTES) {
    return createRosterFileTooLargeResult()
  }

  const extension = input.name.split('.').pop()?.toLocaleLowerCase('en')
  if (extension !== 'txt' && extension !== 'ros' && extension !== 'rosz') {
    return inputError('unsupported-source', 'Choose a .txt, .ros, or .rosz roster file.')
  }

  try {
    if (extension === 'txt') {
      return decodeAos4TextRoster(decodeUtf8(input.bytes, 'Roster text'))
    }
    const xmlBytes = extension === 'rosz' ? await extractRosterXml(input.bytes) : input.bytes
    return parseAos4RosterXml(decodeUtf8(xmlBytes, 'Roster XML'))
  } catch (caught) {
    const known = caught instanceof RosterFileError ? caught : undefined
    return inputError(
      known?.code ?? 'unsafe-input',
      known?.message ?? 'The roster file could not be imported safely.'
    )
  }
}
