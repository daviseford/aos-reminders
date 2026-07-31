import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { assertArtifactChecksum } from './artifact'
import { AcquisitionError } from './http'

export interface ArtifactCache {
  get(checksum: string): Promise<Uint8Array | undefined>
  put(checksum: string, bytes: Uint8Array): Promise<void>
}

export class MemoryArtifactCache implements ArtifactCache {
  private readonly values = new Map<string, Uint8Array>()

  get size(): number {
    return this.values.size
  }

  async get(checksum: string): Promise<Uint8Array | undefined> {
    const value = this.values.get(checksum)
    return value ? value.slice() : undefined
  }

  async put(checksum: string, bytes: Uint8Array): Promise<void> {
    this.values.set(checksum, bytes.slice())
  }
}

const validateChecksumPath = (checksum: string): string => {
  const normalized = checksum.toLowerCase()
  if (!/^[0-9a-f]{64}$/.test(normalized)) {
    throw new AcquisitionError('checksum-mismatch', `Invalid SHA-256 checksum: ${checksum}`)
  }
  return normalized
}

export class FileArtifactCache implements ArtifactCache {
  constructor(private readonly rootDirectory: string) {}

  private pathFor(checksum: string): string {
    return path.join(this.rootDirectory, validateChecksumPath(checksum))
  }

  async get(checksum: string): Promise<Uint8Array | undefined> {
    try {
      return await readFile(this.pathFor(checksum))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined
      throw error
    }
  }

  async put(checksum: string, bytes: Uint8Array): Promise<void> {
    const normalizedChecksum = validateChecksumPath(checksum)
    assertArtifactChecksum(bytes, normalizedChecksum)
    await mkdir(this.rootDirectory, { recursive: true })

    const destination = this.pathFor(normalizedChecksum)
    const existing = await this.get(normalizedChecksum)
    if (existing) {
      assertArtifactChecksum(existing, normalizedChecksum, 'cache-corrupt')
      return
    }

    const temporary = path.join(this.rootDirectory, `.${normalizedChecksum}.${randomUUID()}.tmp`)
    await writeFile(temporary, bytes, { flag: 'wx' })
    await rename(temporary, destination)
  }
}
