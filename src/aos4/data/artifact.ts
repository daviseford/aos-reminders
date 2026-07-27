import { createHash } from 'node:crypto'
import { AcquisitionError } from './http'

export const artifactChecksum = (bytes: Uint8Array): string =>
  createHash('sha256').update(bytes).digest('hex')

export const assertArtifactChecksum = (
  bytes: Uint8Array,
  expectedChecksum: string,
  errorCode: 'checksum-mismatch' | 'cache-corrupt' = 'checksum-mismatch'
): void => {
  const actualChecksum = artifactChecksum(bytes)
  if (actualChecksum !== expectedChecksum.toLowerCase()) {
    throw new AcquisitionError(
      errorCode,
      `Expected SHA-256 ${expectedChecksum.toLowerCase()}, received ${actualChecksum}`
    )
  }
}
