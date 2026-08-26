import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { bashCommand, bashPath } from '../src/tests/support/bashHarness'

const repoRoot = process.cwd()

const shellQuote = (value: string) => `'${value.replaceAll("'", `'"'"'`)}'`
const optionValue = (line: string, option: string) => {
  const match = line.match(new RegExp(`${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} ([^ ]+)`))
  return match?.[1]
}

const lifecyclePreflightQuery =
  '[length(Rules), length(Rules[0]), Rules[0].ID, Rules[0].Status,' +
  ' length(Rules[0].Filter), length(Rules[0].Filter.Tag), Rules[0].Filter.Tag.Key,' +
  ' Rules[0].Filter.Tag.Value, length(Rules[0].Expiration), Rules[0].Expiration.Days]'
const cloudFrontPreflightQuery =
  'DistributionConfig.[DefaultCacheBehavior.MinTTL, DefaultCacheBehavior.DefaultTTL,' +
  ' DefaultCacheBehavior.MaxTTL, DefaultCacheBehavior.CachePolicyId,' +
  ' DefaultCacheBehavior.ResponseHeadersPolicyId, CacheBehaviors.Quantity]'

const directory = mkdtempSync(join(tmpdir(), 'aos-reminders-deployment-measurement-'))

try {
  const buildDirectory = join(directory, 'dist')
  const fakeBin = join(directory, 'bin')
  const logPath = join(directory, 'aws.log')
  const attemptsPath = join(directory, 'lock-attempts')
  const retiredTagsPath = join(directory, 'retired-tags')
  const stateObjectPath = join(directory, 'retirement-state-object')
  mkdirSync(join(buildDirectory, 'assets'), { recursive: true })
  mkdirSync(fakeBin)

  for (const [path, contents] of [
    ['assets/current-123.js', 'current'],
    // Same two-fixture shape as src/tests/deploymentContract.test.ts: production ships both
    // aos4-catalog-data-*.js and aos4-catalog-data-sources-*.js above the pre-gzip threshold.
    ['assets/aos4-catalog-data-abc123.js', `const catalogCorpus = ${'"x"'.repeat(64)}`],
    ['assets/aos4-catalog-data-sources-def456.js', `const catalogSources = ${'"x"'.repeat(64)}`],
    ['index.html', '<!doctype html>'],
    ['site.webmanifest', '{}'],
    ['service-worker.js', 'importScripts("sw-extras-abc123.js")'],
    ['sw-extras-abc123.js', 'const catalog = true'],
    ['workbox-abc123.js', 'const workbox = true'],
    ['favicon.ico', 'icon'],
  ]) {
    writeFileSync(join(buildDirectory, path), contents)
  }

  const alreadyRetiredAssets = Array.from(
    { length: 120 },
    (_, index) => `assets/retired-${String(index + 1).padStart(3, '0')}.js`
  )
  const newlySuperseded = ['assets/newly-superseded.js', 'sw-extras-old.js', 'workbox-old.js']
  const currentImmutable = [
    'assets/current-123.js',
    'assets/aos4-catalog-data-abc123.js',
    'sw-extras-abc123.js',
    'workbox-abc123.js',
    'assets/aos4-catalog-data-sources-def456.js',
  ]
  writeFileSync(retiredTagsPath, `${alreadyRetiredAssets.join('\n')}\n`)

  const fakeAws = join(fakeBin, 'aws')
  writeFileSync(
    fakeAws,
    `#!/usr/bin/env bash
set -euo pipefail
printf '%s\\n' "$*" >> "$AWS_LOG"

option_value() {
  local wanted="$1"
  shift
  while [[ "$#" -gt 0 ]]; do
    if [[ "$1" == "$wanted" ]]; then
      printf '%s' "\${2:-}"
      return 0
    fi
    shift
  done
  return 1
}

require_exact_option() {
  local contract="$1"
  local option="$2"
  local expected="$3"
  shift 3

  local actual=''
  local count=0
  while [[ "$#" -gt 0 ]]; do
    if [[ "$1" == "$option" ]]; then
      count=$((count + 1))
      actual="\${2:-}"
      shift 2
    else
      shift
    fi
  done

  if [[ "$count" -ne 1 || "$actual" != "$expected" ]]; then
    echo "Unexpected $contract $option argument" >&2
    exit 64
  fi
}

s3_key() {
  local location="\${1#s3://}"
  printf '%s' "\${location#*/}"
}

remove_retired_key() {
  local key="$1"
  local next_tags="\${AWS_RETIRED_TAGS}.next"
  grep -Fvx "$key" "$AWS_RETIRED_TAGS" > "$next_tags" || true
  mv "$next_tags" "$AWS_RETIRED_TAGS"
}

append_retired_key() {
  local key="$1"
  grep -Fqx "$key" "$AWS_RETIRED_TAGS" 2>/dev/null || printf '%s\\n' "$key" >> "$AWS_RETIRED_TAGS"
}

if [[ "$1 $2" == "s3api put-object" && "$*" == *"--if-none-match *"* ]]; then
  attempts=0
  [[ -f "$AWS_LOCK_ATTEMPTS" ]] && attempts=$(cat "$AWS_LOCK_ATTEMPTS")
  attempts=$((attempts + 1))
  printf '%s' "$attempts" > "$AWS_LOCK_ATTEMPTS"
  echo '"acquired-etag"'
  exit 0
fi

if [[ "$1 $2" == "s3api get-bucket-lifecycle-configuration" ]]; then
  require_exact_option 'lifecycle preflight' '--query' ${shellQuote(lifecyclePreflightQuery)} "$@"
  require_exact_option 'lifecycle preflight' '--output' 'text' "$@"
  printf '%s\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\t%s\\n' \\
    '1' '4' 'retire-superseded-assets' 'Enabled' '1' '2' 'retire' 'true' '1' '30'
  exit 0
fi

if [[ "$1 $2" == "cloudfront get-distribution-config" ]]; then
  require_exact_option 'CloudFront preflight' '--query' ${shellQuote(cloudFrontPreflightQuery)} "$@"
  require_exact_option 'CloudFront preflight' '--output' 'text' "$@"
  printf '%s\\t%s\\t%s\\t%s\\t%s\\t%s\\n' '0' '86400' '31536000' 'None' 'None' '0'
  exit 0
fi

if [[ "$1 $2" == "s3api list-objects-v2" ]]; then
  if [[ "$*" == *"--prefix assets/"* ]]; then
    printf '%s\\n' "$AWS_REMOTE_ASSET_KEYS"
  elif [[ "$*" == *"--prefix sw-extras-"* ]]; then
    printf '%s\\n' "$AWS_REMOTE_EXTRAS_KEYS"
  elif [[ "$*" == *"--prefix workbox-"* ]]; then
    printf '%s\\n' "$AWS_REMOTE_WORKBOX_KEYS"
  else
    echo 'Unexpected list prefix' >&2
    exit 65
  fi
  exit 0
fi

if [[ "$1 $2" == "s3api get-object-tagging" ]]; then
  key=$(option_value '--key' "$@")
  if grep -Fqx "$key" "$AWS_RETIRED_TAGS"; then
    echo 'true'
  else
    echo 'false'
  fi
  exit 0
fi

if [[ "$1 $2" == "s3api put-object-tagging" ]]; then
  key=$(option_value '--key' "$@")
  if [[ "$*" == *"Value=false"* ]]; then
    remove_retired_key "$key"
    exit 0
  fi
  echo 'Only retire=false object tagging is accepted by this benchmark' >&2
  exit 65
fi

if [[ "$1 $2" == "s3api head-object" && "$*" == *"CacheControl"* ]]; then
  printf '%s\\t%s\\n' 'public, max-age=31536000, immutable' 'text/javascript; charset=utf-8'
  exit 0
fi

if [[ "$1 $2" == "s3api copy-object" ]]; then
  [[ "$*" == *"--metadata-directive REPLACE"* ]] || exit 66
  [[ "$*" == *"--tagging retire=true"* ]] || exit 66
  key=$(option_value '--key' "$@")
  append_retired_key "$key"
  exit 0
fi

if [[ "$1 $2" == "s3 cp" ]]; then
  source_path="$3"
  destination="$4"

  if [[ "$source_path" == s3://* ]]; then
    key=$(s3_key "$source_path")
    if [[ "$key" == "$AWS_STATE_KEY" && -f "$AWS_STATE_OBJECT" ]]; then
      cp "$AWS_STATE_OBJECT" "$destination"
      exit 0
    fi
    echo 'NoSuchKey' >&2
    exit 44
  fi

  [[ -e "$source_path" ]] || {
    echo "The user-provided path $source_path does not exist." >&2
    exit 255
  }

  if [[ "$destination" == s3://* ]]; then
    destination_key=$(s3_key "$destination")
    if [[ "$destination_key" == "$AWS_STATE_KEY" ]]; then
      cp "$source_path" "$AWS_STATE_OBJECT"
      exit 0
    fi

    if [[ "$*" == *"--recursive"* ]]; then
      while IFS= read -r -d '' uploaded_file; do
        relative_file="\${uploaded_file#"\${source_path%/}/"}"
        remove_retired_key "\${destination_key%/}/$relative_file"
      done < <(find "$source_path" -type f -print0)
    else
      remove_retired_key "$destination_key"
    fi
    exit 0
  fi
fi

if [[ "$1 $2" == "s3api delete-object" || "$1 $2" == "cloudfront create-invalidation" ]]; then
  exit 0
fi

echo "Unsupported fake AWS call: $*" >&2
exit 65
`,
    'utf8'
  )
  chmodSync(fakeAws, 0o755)

  const assetKeys = [
    currentImmutable[0],
    currentImmutable[1],
    currentImmutable[4],
    newlySuperseded[0],
    ...alreadyRetiredAssets,
  ]
  const baseEnvironment = {
    AWS_LOCK_ATTEMPTS: bashPath(attemptsPath),
    AWS_LOG: bashPath(logPath),
    AWS_REMOTE_ASSET_KEYS: assetKeys.join('\t'),
    AWS_REMOTE_EXTRAS_KEYS: `${currentImmutable[2]}\t${newlySuperseded[1]}`,
    AWS_REMOTE_WORKBOX_KEYS: `${currentImmutable[3]}\t${newlySuperseded[2]}`,
    AWS_RETIRED_TAGS: bashPath(retiredTagsPath),
    AWS_STATE_KEY: '_deploy/retired-immutable-keys.txt',
    AWS_STATE_OBJECT: bashPath(stateObjectPath),
    CF_DIST_ID: 'distribution-id',
    DEPLOY_OWNER: 'deployment-measurement',
    PRECOMPRESS_THRESHOLD_BYTES: '100',
    SITE_BUILD_DIR: bashPath(buildDirectory),
    SITE_S3: 's3://test-bucket',
  }
  const assignments = Object.entries(baseEnvironment)
    .map(([key, value]) => `${key}=${shellQuote(value)}`)
    .join(' ')
  const fakeBinPath = bashPath(fakeBin)
  const run = () =>
    spawnSync(
      bashCommand(),
      [
        '-c',
        `chmod +x ${shellQuote(`${fakeBinPath}/aws`)}; ` +
          `PATH=${shellQuote(fakeBinPath)}:/usr/local/bin:/usr/bin:/bin ${assignments} ` +
          'bash scripts/deploy-production.sh',
      ],
      { cwd: repoRoot, encoding: 'utf8' }
    )
  const readLog = () =>
    existsSync(logPath) && readFileSync(logPath, 'utf8').trim()
      ? readFileSync(logPath, 'utf8').trim().split('\n')
      : []

  const warmResult = run()
  const warmLog = readLog()
  writeFileSync(logPath, '')
  writeFileSync(attemptsPath, '0')

  const measuredStart = performance.now()
  const measuredResult = run()
  const measuredWallMs = performance.now() - measuredStart
  const measuredLog = readLog()
  const combinedLog = [...warmLog, ...measuredLog]

  const assetUpload = measuredLog.findIndex(line => line.startsWith('s3 cp ') && line.includes('/assets'))
  const extrasUpload = measuredLog.findIndex(
    line => line.startsWith('s3 cp ') && line.includes('sw-extras-abc123.js')
  )
  const indexUpload = measuredLog.findIndex(line => line.startsWith('s3 cp ') && line.includes('/index.html'))
  const workerUpload = measuredLog.findIndex(
    line => line.startsWith('s3 cp ') && line.includes('/service-worker.js')
  )
  const publicWritesAfterWorker = measuredLog
    .slice(workerUpload + 1)
    .filter(
      line =>
        line.startsWith('s3 cp ') && !line.includes('s3://test-bucket/_deploy/retired-immutable-keys.txt')
    )
  const publicationOrderValid =
    assetUpload >= 0 &&
    extrasUpload > assetUpload &&
    indexUpload > extrasUpload &&
    workerUpload > indexUpload &&
    publicWritesAfterWorker.length === 0

  const copiesFor = (key: string) =>
    combinedLog.filter(line => line.startsWith('s3api copy-object ') && optionValue(line, '--key') === key)
  const liveImmutableRetired = currentImmutable.reduce((total, key) => total + copiesFor(key).length, 0)
  const newlyRetiredExactlyOnce = newlySuperseded.every(key => copiesFor(key).length === 1)
  const oldRetirementUntouched = alreadyRetiredAssets.every(key => copiesFor(key).length === 0)
  const retirementCopiesKeepMetadata = combinedLog
    .filter(line => line.startsWith('s3api copy-object '))
    .every(
      line =>
        line.includes('--metadata-directive REPLACE') &&
        line.includes('public, max-age=31536000, immutable') &&
        line.includes('text/javascript; charset=utf-8')
    )
  const retirementContractValid =
    newlyRetiredExactlyOnce && oldRetirementUntouched && retirementCopiesKeepMetadata

  const lockAcquisitions = combinedLog.filter(
    line => line.startsWith('s3api put-object ') && line.includes('--if-none-match *')
  )
  const lockReleases = combinedLog.filter(
    line => line.startsWith('s3api delete-object ') && line.includes('--if-match "acquired-etag"')
  )
  const lockContractValid = lockAcquisitions.length === 2 && lockReleases.length === 2

  const isReadCall = (line: string) =>
    line.startsWith('s3api get-') ||
    line.startsWith('s3api head-') ||
    line.startsWith('s3api list-') ||
    line.startsWith('cloudfront get-') ||
    (line.startsWith('s3 cp s3://') && !line.includes(' s3://', 6))
  const awsReadCalls = measuredLog.filter(isReadCall).length
  const currentTaggingCalls = measuredLog.filter(
    line => line.startsWith('s3api put-object-tagging ') && line.includes('Value=false')
  ).length
  const retirementMetadataReads = measuredLog.filter(
    line => line.startsWith('s3api head-object ') && line.includes('CacheControl')
  ).length
  const immutableUploads = measuredLog.filter(
    line =>
      line.startsWith('s3 cp ') &&
      (line.includes('s3://test-bucket/assets') ||
        line.includes('s3://test-bucket/sw-extras-') ||
        line.includes('s3://test-bucket/workbox-'))
  ).length

  const metrics = {
    aws_cli_calls: measuredLog.length,
    publish_succeeded: warmResult.status === 0 && measuredResult.status === 0 ? 1 : 0,
    publication_order_valid: publicationOrderValid ? 1 : 0,
    live_immutable_retired: liveImmutableRetired,
    retirement_contract_valid: retirementContractValid ? 1 : 0,
    lock_contract_valid: lockContractValid ? 1 : 0,
    aws_read_calls: awsReadCalls,
    aws_write_calls: measuredLog.length - awsReadCalls,
    current_tagging_calls: currentTaggingCalls,
    retirement_metadata_reads: retirementMetadataReads,
    immutable_uploads: immutableUploads,
    measured_wall_ms: Math.round(measuredWallMs * 100) / 100,
  }

  console.log(JSON.stringify(metrics))
} finally {
  rmSync(directory, { recursive: true, force: true })
}
