import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type {
  ReviewPacketPair,
  ReviewPacketShard,
  ReviewPacketWorkspace,
  ShardedReviewPacketWorkspace,
} from './packets'

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T

const isSharded = (
  workspace: ReviewPacketWorkspace | ShardedReviewPacketWorkspace
): workspace is ShardedReviewPacketWorkspace => 'shards' in workspace

const withinDirectory = (directory: string, relativePath: string): string => {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Review packet shard path must be relative: ${relativePath}`)
  }
  const resolved = path.resolve(directory, relativePath)
  if (resolved !== directory && !resolved.startsWith(`${directory}${path.sep}`)) {
    throw new Error(`Review packet shard path escapes the workspace: ${relativePath}`)
  }
  return resolved
}

export const loadReviewPacketPairs = async (workspacePath: string): Promise<ReviewPacketPair[]> => {
  const resolvedWorkspace = path.resolve(workspacePath)
  const workspace = await readJson<ReviewPacketWorkspace | ShardedReviewPacketWorkspace>(resolvedWorkspace)
  if (!isSharded(workspace)) return workspace.pairs

  const directory = path.dirname(resolvedWorkspace)
  const pairs: ReviewPacketPair[] = []
  for (const reference of workspace.shards) {
    const shard = await readJson<ReviewPacketShard>(withinDirectory(directory, reference.path))
    if (shard.schemaVersion !== 1 || !Array.isArray(shard.pairs) || shard.pairs.length !== reference.pairs) {
      throw new Error(`Review packet shard does not match its workspace: ${reference.path}`)
    }
    pairs.push(...shard.pairs)
  }
  return pairs
}
