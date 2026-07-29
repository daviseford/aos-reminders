import { randomBytes, timingSafeEqual } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  loadGuidedComparisonReview,
  saveGuidedComparisonReview,
  type GuidedComparisonResponse,
  type GuidedComparisonStage,
} from './humanReviewComparisonUi'
import { guidedComparisonPage } from './humanReviewComparisonUiPage'
import {
  loadGuidedBlindReview,
  saveGuidedBlindReview,
  type GuidedBlindResponse,
  type GuidedBlindStage,
} from './humanReviewUi'
import { guidedReviewPage } from './humanReviewUiPage'

type GuidedReviewStage = GuidedBlindStage | GuidedComparisonStage

interface GuidedReviewUiArguments {
  reviewDirectory: string
  stage: GuidedReviewStage
  workspace: string
  port: number
  openBrowser: boolean
}

const MAX_REQUEST_BYTES = 2 * 1024 * 1024
const LOOPBACK_HOST = '127.0.0.1'
const MODULE_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))
const LOGO_PATH = path.resolve(MODULE_DIRECTORY, '../../../public/img/logo_noURL.png')
const ALLOWED_OPTIONS = new Set(['--review-dir', '--stage', '--workspace', '--port', '--no-open'])
const COMPARISON_STAGES = new Set<GuidedReviewStage>(['calibration-comparison', 'sample-comparison'])

const isComparisonStage = (stage: GuidedReviewStage): stage is GuidedComparisonStage =>
  COMPARISON_STAGES.has(stage)

const optionMap = (arguments_: string[]): Map<string, string> => {
  const options = new Map<string, string>()
  for (let index = 0; index < arguments_.length; index += 1) {
    const key = arguments_[index]
    if (!key || !ALLOWED_OPTIONS.has(key)) {
      throw new Error(`Unexpected guided review argument: ${key}`)
    }
    if (key === '--no-open') {
      options.set(key, 'true')
      continue
    }
    const value = arguments_[index + 1]
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${key}`)
    options.set(key, value)
    index += 1
  }
  return options
}

export const parseGuidedReviewUiArguments = (arguments_: string[]): GuidedReviewUiArguments => {
  const options = optionMap(arguments_)
  const reviewDirectory = options.get('--review-dir')
  if (!reviewDirectory) throw new Error('Guided human review requires --review-dir')
  const stage = options.get('--stage') ?? 'calibration-blind'
  if (
    stage !== 'calibration-blind' &&
    stage !== 'sample-blind' &&
    stage !== 'calibration-comparison' &&
    stage !== 'sample-comparison'
  ) {
    throw new Error(
      '--stage must be calibration-blind, sample-blind, calibration-comparison, or sample-comparison'
    )
  }
  const workspace = options.get('--workspace')
  if (!workspace) throw new Error('Guided human review requires --workspace')
  const portText = options.get('--port') ?? '0'
  const port = Number(portText)
  if (!Number.isInteger(port) || port < 0 || port > 65_535) {
    throw new Error('--port must be an integer from 0 through 65535')
  }
  return {
    reviewDirectory,
    stage,
    workspace,
    port,
    openBrowser: !options.has('--no-open'),
  }
}

const tokenMatches = (candidate: string | undefined, expected: string): boolean => {
  if (!candidate) return false
  const candidateBytes = Buffer.from(candidate)
  const expectedBytes = Buffer.from(expected)
  return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes)
}

const requestToken = (request: IncomingMessage): string | undefined => {
  const value = request.headers['x-aos4-review-token']
  return Array.isArray(value) ? value[0] : value
}

const securityHeaders = {
  'cache-control': 'no-store',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
} as const

const send = (
  response: ServerResponse,
  status: number,
  contentType: string,
  body: string | Buffer,
  headers: Record<string, string> = {}
): void => {
  response.writeHead(status, { ...securityHeaders, 'content-type': contentType, ...headers })
  response.end(body)
}

const sendJson = (response: ServerResponse, status: number, value: unknown): void =>
  send(response, status, 'application/json; charset=utf-8', JSON.stringify(value))

const readJsonBody = async (request: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = []
  let bytes = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    bytes += buffer.length
    if (bytes > MAX_REQUEST_BYTES) throw new Error('Review submission exceeds the local size limit')
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw new Error('Review submission is not valid JSON')
  }
}

const responsesFrom = (value: unknown): unknown[] => {
  if (!value || typeof value !== 'object' || !('responses' in value) || !Array.isArray(value.responses)) {
    throw new Error('Review submission must contain a responses array')
  }
  return value.responses
}

const openLocalBrowser = (url: string): void => {
  const command =
    process.platform === 'win32'
      ? { program: 'rundll32', arguments_: ['url.dll,FileProtocolHandler', url] }
      : process.platform === 'darwin'
        ? { program: 'open', arguments_: [url] }
        : { program: 'xdg-open', arguments_: [url] }
  const child = spawn(command.program, command.arguments_, {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  })
  child.once('error', error => {
    console.warn(`Could not open the local review link automatically: ${error.message}`)
  })
  child.unref()
}

export const runGuidedReviewUi = async (arguments_: GuidedReviewUiArguments): Promise<void> => {
  const stage = arguments_.stage
  const comparisonStage = isComparisonStage(stage) ? stage : undefined
  const blindStage = comparisonStage ? undefined : (stage as GuidedBlindStage)
  const loaded = comparisonStage
    ? await loadGuidedComparisonReview(arguments_.reviewDirectory, comparisonStage, arguments_.workspace)
    : await loadGuidedBlindReview(arguments_.reviewDirectory, blindStage!, arguments_.workspace)
  const token = randomBytes(24).toString('hex')
  const nonce = randomBytes(18).toString('base64')
  const logo = await readFile(LOGO_PATH)

  await new Promise<void>((resolve, reject) => {
    let savedOutput: string | undefined
    const server = createServer(async (request, response) => {
      const url = new URL(request.url ?? '/', `http://${LOOPBACK_HOST}`)
      try {
        if (request.method === 'GET' && url.pathname === '/') {
          if (!tokenMatches(url.searchParams.get('token') ?? undefined, token)) {
            sendJson(response, 403, { error: 'This review link is not authorized.' })
            return
          }
          const page = comparisonStage
            ? guidedComparisonPage({ nonce, token })
            : guidedReviewPage({ nonce, token })
          send(response, 200, 'text/html; charset=utf-8', page, {
            'content-security-policy':
              `default-src 'none'; img-src 'self'; style-src 'nonce-${nonce}'; ` +
              `script-src 'nonce-${nonce}'; connect-src 'self'; form-action 'none'; base-uri 'none'`,
          })
          return
        }
        if (request.method === 'GET' && url.pathname === '/logo.png') {
          if (!tokenMatches(url.searchParams.get('token') ?? undefined, token)) {
            sendJson(response, 403, { error: 'This image request is not authorized.' })
            return
          }
          send(response, 200, 'image/png', logo)
          return
        }
        if (!tokenMatches(requestToken(request), token)) {
          sendJson(response, 403, { error: 'This review request is not authorized.' })
          return
        }
        if (request.method === 'GET' && url.pathname === '/api/session') {
          sendJson(response, 200, loaded.session)
          return
        }
        if (request.method === 'POST' && url.pathname === '/api/results') {
          const responses = responsesFrom(await readJsonBody(request))
          savedOutput = comparisonStage
            ? await saveGuidedComparisonReview(
                arguments_.reviewDirectory,
                comparisonStage,
                arguments_.workspace,
                responses as GuidedComparisonResponse[]
              )
            : await saveGuidedBlindReview(
                arguments_.reviewDirectory,
                blindStage!,
                arguments_.workspace,
                responses as GuidedBlindResponse[]
              )
          sendJson(response, 201, { output: savedOutput })
          setTimeout(() => server.close(), 750)
          return
        }
        sendJson(response, 404, { error: 'The requested review resource does not exist.' })
      } catch (error) {
        sendJson(response, 400, {
          error: error instanceof Error ? error.message : 'The review request failed.',
        })
      }
    })
    server.once('error', reject)
    server.once('close', () => {
      if (savedOutput) console.log(`Saved sealed blind review results to ${savedOutput}`)
      resolve()
    })
    server.listen(arguments_.port, LOOPBACK_HOST, () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close()
        reject(new Error('Guided review server did not receive a local TCP address'))
        return
      }
      const url = `http://${LOOPBACK_HOST}:${address.port}/?token=${token}`
      console.log(`AoS 4 guided human review is ready at ${url}`)
      console.log('The server is bound to localhost and exits after the result file is sealed.')
      if (arguments_.openBrowser) openLocalBrowser(url)
    })
  })
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : ''
if (fileURLToPath(import.meta.url) === invokedPath) {
  runGuidedReviewUi(parseGuidedReviewUiArguments(process.argv.slice(2))).catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
