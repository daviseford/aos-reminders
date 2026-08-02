import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableJson } from '../generate/serialization'
import { createAdversarialBlindResult, createAdversarialComparisonResult } from './adversarialReview'
import {
  AOS4_REVIEW_SCHEMA_VERSION,
  checksumReviewRecord,
  type ReviewAssignment,
  type ReviewerMetadata,
  type ReviewerResult,
} from './records'
import type { ReviewPacketPair } from './packets'
import { assertCreateOnlyDirectoryComplete, writeCreateOnlyDirectory } from './reviewWorkspace'

export interface AdversarialReviewWorkerTask {
  schemaVersion: 1
  revision: string
  workspace: string
  assignmentId: ReviewAssignment['id']
  reviewer: ReviewerMetadata
  blindReviewedAt: string
  comparisonReviewedAt: string
  shards: Array<{
    index: number
    path: string
    freshPairKeys: string[]
  }>
}

interface PacketShard {
  schemaVersion: 1
  pairs: ReviewPacketPair[]
}

export interface AdversarialReviewWorkerReceipt {
  schemaVersion: 1
  revision: string
  shards: Array<{
    index: number
    path: string
    resultCount: number
    checksum: string
  }>
}

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const withinDirectory = (directory: string, relativePath: string): string => {
  if (path.isAbsolute(relativePath)) throw new Error(`Worker shard path must be relative: ${relativePath}`)
  const resolved = path.resolve(directory, relativePath)
  if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
    throw new Error(`Worker shard path escapes its directory: ${relativePath}`)
  }
  return resolved
}

export const runAdversarialReviewWorkerTask = async (
  task: AdversarialReviewWorkerTask,
  output: string
): Promise<AdversarialReviewWorkerReceipt> => {
  const workspace = path.resolve(task.workspace)
  await assertCreateOnlyDirectoryComplete(workspace)
  if (task.schemaVersion !== 1 || !Array.isArray(task.shards)) {
    throw new Error('Adversarial review worker task is invalid')
  }
  const receipt: AdversarialReviewWorkerReceipt = {
    schemaVersion: 1,
    revision: task.revision,
    shards: [],
  }
  await writeCreateOnlyDirectory(output, async staging => {
    await Promise.all([
      mkdir(path.join(staging, 'blind-results'), { recursive: true }),
      mkdir(path.join(staging, 'results'), { recursive: true }),
    ])
    for (const reference of task.shards) {
      const packetShard = await readJson<PacketShard>(withinDirectory(workspace, reference.path))
      if (packetShard.schemaVersion !== 1 || !Array.isArray(packetShard.pairs)) {
        throw new Error(`Adversarial review worker shard is invalid: ${reference.path}`)
      }
      const freshPairKeys = new Set(reference.freshPairKeys)
      const pairs = packetShard.pairs.filter(pair => freshPairKeys.has(pair.pairKey))
      if (pairs.length !== freshPairKeys.size) {
        throw new Error(`Adversarial review worker shard is missing fresh pairs: ${reference.path}`)
      }
      const blindResults = pairs.map(pair =>
        createAdversarialBlindResult(pair, task.assignmentId, task.reviewer, task.blindReviewedAt)
      )
      const suffix = String(reference.index + 1).padStart(4, '0')
      const blindPath = path.join(staging, 'blind-results', `shard-${suffix}.json`)
      await writeFile(blindPath, stableJson(blindResults), 'utf8')
      const persistedBlindResults = await readJson<ReviewerResult[]>(blindPath)
      const blindByPacketId = new Map(persistedBlindResults.map(result => [result.packetId, result]))
      const results = pairs.flatMap(pair => {
        const blind = blindByPacketId.get(pair.blindPacket.id)
        if (!blind) throw new Error(`Persisted blind result is missing for ${pair.pairKey}`)
        return [
          blind,
          createAdversarialComparisonResult(
            pair,
            blind,
            task.assignmentId,
            task.reviewer,
            task.comparisonReviewedAt
          ),
        ]
      })
      const relativeResultPath = `results/shard-${suffix}.json`
      await writeFile(
        withinDirectory(staging, relativeResultPath),
        stableJson({
          schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
          revision: task.revision,
          results,
        }),
        'utf8'
      )
      receipt.shards.push({
        index: reference.index,
        path: relativeResultPath,
        resultCount: results.length,
        checksum: checksumReviewRecord(results),
      })
    }
    receipt.shards.sort((left, right) => left.index - right.index)
    await writeFile(path.join(staging, 'receipt.json'), stableJson(receipt), 'utf8')
  })
  return receipt
}

const run = async (): Promise<void> => {
  const values = process.argv.slice(2)
  const taskIndex = values.indexOf('--task')
  const outputIndex = values.indexOf('--output')
  if (taskIndex < 0 || outputIndex < 0 || !values[taskIndex + 1] || !values[outputIndex + 1]) {
    throw new Error('Adversarial review worker requires --task and --output')
  }
  const task = await readJson<AdversarialReviewWorkerTask>(path.resolve(values[taskIndex + 1]))
  await runAdversarialReviewWorkerTask(task, path.resolve(values[outputIndex + 1]))
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
