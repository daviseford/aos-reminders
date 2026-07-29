import fs from 'node:fs'
import path from 'node:path'
import type { RadarSource } from './model'

const SHA_PATTERN = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i

export interface RulesRadarConfig {
  schemaVersion: 1
  acceptedManifestPath: string
  sourceClassificationsPath: string
  acceptedSourceInventoryPath: string
  gamesWorkshop: {
    downloadsPageUrl: string
  }
  wahapedia: {
    rootUrl: string
    navigationUrl: string
    exportSpecificationUrl: string
    lastUpdateUrl: string
  }
  bsData: {
    repository: string
    branch: string
    baselineSha: string
    baselineReviewedAt: string
  }
  github: {
    repository: string
    assignee: string
    labels: string[]
  }
  requestBudgets: Record<RadarSource, number>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const nonEmptyString = (value: unknown, label: string): string => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a non-empty string`)
  return value.trim()
}

const positiveInteger = (value: unknown, label: string): number => {
  if (!Number.isSafeInteger(value) || Number(value) <= 0) {
    throw new Error(`${label} must be a positive integer`)
  }
  return Number(value)
}

const httpsUrl = (value: unknown, label: string): string => {
  const parsed = new URL(nonEmptyString(value, label))
  if (parsed.protocol !== 'https:') throw new Error(`${label} must use HTTPS`)
  parsed.hash = ''
  return parsed.toString()
}

const repositoryPath = (value: unknown, label: string): string => {
  const repository = nonEmptyString(value, label)
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error(`${label} must be an owner/repository pair`)
  }
  return repository
}

const checkedRepoPath = (value: unknown, label: string, rootPath?: string): string => {
  const relativePath = nonEmptyString(value, label)
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    throw new Error(`${label} must be a repository-relative path`)
  }
  if (rootPath) {
    const root = fs.realpathSync(rootPath)
    const target = path.resolve(root, relativePath)
    if (!target.startsWith(`${root}${path.sep}`) || !fs.existsSync(target)) {
      throw new Error(`${label} points to a stale or missing repository path: ${relativePath}`)
    }
  }
  return relativePath.replaceAll('\\', '/')
}

export const validateRulesRadarConfig = (
  value: unknown,
  options: { rootPath?: string } = {}
): RulesRadarConfig => {
  if (!isRecord(value) || value.schemaVersion !== 1) {
    throw new Error('Rules Radar config has an incompatible schema')
  }
  if (
    !isRecord(value.gamesWorkshop) ||
    !isRecord(value.wahapedia) ||
    !isRecord(value.bsData) ||
    !isRecord(value.github) ||
    !isRecord(value.requestBudgets)
  ) {
    throw new Error('Rules Radar config is missing a required section')
  }

  const baselineSha = nonEmptyString(value.bsData.baselineSha, 'bsData.baselineSha')
  if (!SHA_PATTERN.test(baselineSha)) throw new Error('bsData.baselineSha must be a Git checksum')
  const baselineReviewedAt = nonEmptyString(value.bsData.baselineReviewedAt, 'bsData.baselineReviewedAt')
  if (Number.isNaN(Date.parse(baselineReviewedAt))) {
    throw new Error('bsData.baselineReviewedAt must be an ISO instant')
  }
  if (
    !Array.isArray(value.github.labels) ||
    value.github.labels.length === 0 ||
    value.github.labels.some(label => typeof label !== 'string' || !label.trim())
  ) {
    throw new Error('github.labels must contain at least one label')
  }

  return {
    schemaVersion: 1,
    acceptedManifestPath: checkedRepoPath(
      value.acceptedManifestPath,
      'acceptedManifestPath',
      options.rootPath
    ),
    sourceClassificationsPath: checkedRepoPath(
      value.sourceClassificationsPath,
      'sourceClassificationsPath',
      options.rootPath
    ),
    acceptedSourceInventoryPath: checkedRepoPath(
      value.acceptedSourceInventoryPath,
      'acceptedSourceInventoryPath',
      options.rootPath
    ),
    gamesWorkshop: {
      downloadsPageUrl: httpsUrl(value.gamesWorkshop.downloadsPageUrl, 'gamesWorkshop.downloadsPageUrl'),
    },
    wahapedia: {
      rootUrl: httpsUrl(value.wahapedia.rootUrl, 'wahapedia.rootUrl'),
      navigationUrl: httpsUrl(value.wahapedia.navigationUrl, 'wahapedia.navigationUrl'),
      exportSpecificationUrl: httpsUrl(
        value.wahapedia.exportSpecificationUrl,
        'wahapedia.exportSpecificationUrl'
      ),
      lastUpdateUrl: httpsUrl(value.wahapedia.lastUpdateUrl, 'wahapedia.lastUpdateUrl'),
    },
    bsData: {
      repository: repositoryPath(value.bsData.repository, 'bsData.repository'),
      branch: nonEmptyString(value.bsData.branch, 'bsData.branch'),
      baselineSha: baselineSha.toLowerCase(),
      baselineReviewedAt: new Date(baselineReviewedAt).toISOString(),
    },
    github: {
      repository: repositoryPath(value.github.repository, 'github.repository'),
      assignee: nonEmptyString(value.github.assignee, 'github.assignee'),
      labels: Array.from(new Set(value.github.labels.map(label => label.trim()))).sort(),
    },
    requestBudgets: {
      'games-workshop': positiveInteger(
        value.requestBudgets['games-workshop'],
        'requestBudgets.games-workshop'
      ),
      wahapedia: positiveInteger(value.requestBudgets.wahapedia, 'requestBudgets.wahapedia'),
      bsdata: positiveInteger(value.requestBudgets.bsdata, 'requestBudgets.bsdata'),
    },
  }
}

export const readRulesRadarConfig = (configPath: string, rootPath = process.cwd()): RulesRadarConfig =>
  validateRulesRadarConfig(JSON.parse(fs.readFileSync(configPath, 'utf8')), { rootPath })
