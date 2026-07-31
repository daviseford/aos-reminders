import {
  access,
  cp,
  link,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import type {
  ReviewPacketPair,
  ReviewPacketShard,
  ReviewPacketWorkspace,
  ShardedReviewPacketWorkspace,
} from './packets'

const readJson = async <T>(filePath: string): Promise<T> => JSON.parse(await readFile(filePath, 'utf8')) as T
const COMPLETION_FILE = '.complete.json'
const COMPLETION_CONTENT = '{"kind":"aos4-create-only-directory","schemaVersion":1}\n'

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

const exists = async (target: string): Promise<boolean> =>
  access(target)
    .then(() => true)
    .catch(() => false)

const publishCreateOnlyDirectory = async (staging: string, output: string): Promise<void> => {
  const retryDelays = [0, 100, 250, 500, 1_000, 2_000, 4_000]
  let lastError: unknown
  for (const retryDelay of retryDelays) {
    if (retryDelay) await delay(retryDelay)
    if (await exists(output)) {
      throw new Error(`Create-only output already exists: ${output}`)
    }
    try {
      await rename(staging, output)
      return
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'EPERM' && code !== 'EACCES') throw error
      lastError = error
    }
  }
  if (process.platform === 'win32') {
    await unlink(path.join(staging, COMPLETION_FILE))
    await mkdir(output)
    try {
      for (const entry of await readdir(staging)) {
        await cp(path.join(staging, entry), path.join(output, entry), {
          recursive: true,
          force: false,
          errorOnExist: true,
        })
      }
      const temporaryCompletion = path.join(output, `${COMPLETION_FILE}.tmp-${process.pid}`)
      await writeFile(temporaryCompletion, COMPLETION_CONTENT, 'utf8')
      await link(temporaryCompletion, path.join(output, COMPLETION_FILE))
      await unlink(temporaryCompletion)
    } catch (error) {
      await rm(output, { recursive: true, force: true })
      throw error
    }
    await rm(staging, { recursive: true, force: true }).catch(() => undefined)
    return
  }
  throw lastError
}

export const writeCreateOnlyDirectory = async (
  output: string,
  populate: (staging: string) => Promise<void>
): Promise<void> => {
  const resolvedOutput = path.resolve(output)
  if (await exists(resolvedOutput)) {
    throw new Error(`Create-only output already exists: ${resolvedOutput}`)
  }
  const parent = path.dirname(resolvedOutput)
  await mkdir(parent, { recursive: true })
  const staging = await mkdtemp(path.join(parent, `${path.basename(resolvedOutput)}.tmp-`))
  try {
    await populate(staging)
    await writeFile(path.join(staging, COMPLETION_FILE), COMPLETION_CONTENT, 'utf8')
    if (await exists(resolvedOutput)) {
      throw new Error(`Create-only output already exists: ${resolvedOutput}`)
    }
    await publishCreateOnlyDirectory(staging, resolvedOutput)
  } catch (error) {
    await rm(staging, { recursive: true, force: true })
    throw error
  }
}

export const assertCreateOnlyDirectoryComplete = async (directory: string): Promise<void> => {
  const completion = await readFile(path.join(path.resolve(directory), COMPLETION_FILE), 'utf8').catch(
    () => undefined
  )
  if (completion !== COMPLETION_CONTENT) {
    throw new Error(`Create-only directory is incomplete: ${path.resolve(directory)}`)
  }
}

export const writeCreateOnlyFilesDirectory = async (
  output: string,
  files: ReadonlyMap<string, string>
): Promise<void> =>
  writeCreateOnlyDirectory(output, async staging => {
    await Promise.all(
      Array.from(files, async ([fileName, content]) => {
        const filePath = withinDirectory(staging, fileName)
        await mkdir(path.dirname(filePath), { recursive: true })
        await writeFile(filePath, content, 'utf8')
      })
    )
  })

export const writeCreateOnlyFile = async (output: string, content: string): Promise<void> => {
  const resolvedOutput = path.resolve(output)
  const parent = path.dirname(resolvedOutput)
  await mkdir(parent, { recursive: true })
  const stagingDirectory = await mkdtemp(path.join(parent, `${path.basename(resolvedOutput)}.tmp-`))
  const staging = path.join(stagingDirectory, 'content')
  try {
    await writeFile(staging, content, 'utf8')
    try {
      await link(staging, resolvedOutput)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        throw new Error(`Create-only output already exists: ${resolvedOutput}`)
      }
      throw error
    }
  } finally {
    await unlink(staging).catch(() => undefined)
    await rm(stagingDirectory, { recursive: true, force: true })
  }
}

export const loadReviewPacketPairs = async (workspacePath: string): Promise<ReviewPacketPair[]> => {
  const resolvedWorkspace = path.resolve(workspacePath)
  const workspace = await readJson<ReviewPacketWorkspace | ShardedReviewPacketWorkspace>(resolvedWorkspace)
  if (!isSharded(workspace)) return workspace.pairs

  const directory = path.dirname(resolvedWorkspace)
  if (workspace.publication === 'create-only-directory/v1') {
    await assertCreateOnlyDirectoryComplete(directory)
  }
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

export const loadReviewPacketPairsByKey = async (
  workspacePath: string,
  pairKeys: ReadonlySet<string>
): Promise<ReviewPacketPair[]> => {
  const resolvedWorkspace = path.resolve(workspacePath)
  const workspace = await readJson<ReviewPacketWorkspace | ShardedReviewPacketWorkspace>(resolvedWorkspace)
  if (!isSharded(workspace)) return workspace.pairs.filter(pair => pairKeys.has(pair.pairKey))

  const directory = path.dirname(resolvedWorkspace)
  if (workspace.publication === 'create-only-directory/v1') {
    await assertCreateOnlyDirectoryComplete(directory)
  }
  const pairs: ReviewPacketPair[] = []
  const found = new Set<string>()
  for (const reference of workspace.shards) {
    const shard = await readJson<ReviewPacketShard>(withinDirectory(directory, reference.path))
    if (shard.schemaVersion !== 1 || !Array.isArray(shard.pairs) || shard.pairs.length !== reference.pairs) {
      throw new Error(`Review packet shard does not match its workspace: ${reference.path}`)
    }
    shard.pairs.forEach(pair => {
      if (!pairKeys.has(pair.pairKey)) return
      if (found.has(pair.pairKey)) {
        throw new Error(`Review packet pair appears in multiple workspace shards: ${pair.pairKey}`)
      }
      found.add(pair.pairKey)
      pairs.push(pair)
    })
    if (found.size === pairKeys.size) break
  }
  return pairs
}
