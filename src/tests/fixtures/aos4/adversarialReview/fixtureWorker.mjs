// A plain Node stand-in for the adversarial review worker command, for the runFreshWorkers
// abort/settle test: no TypeScript runtime starts, so the test measures ordering, not startup.
//
// The worker whose shard names `missing-pair` fails, but only once its sibling is live, so the
// failure always lands while the sibling runs. The sibling records its pid beside the staging
// directory and then waits to be terminated.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const argument = name => process.argv[process.argv.indexOf(name) + 1]
const taskPath = argument('--task')
const task = JSON.parse(readFileSync(taskPath, 'utf8'))
const siblingPidPath = path.join(path.dirname(path.dirname(taskPath)), 'sibling.pid')
// Neither role outlives a regression that stops aborting the sibling.
setTimeout(() => process.exit(3), 30_000)

if (task.shards.some(shard => shard.freshPairKeys.includes('missing-pair'))) {
  const failOnceSiblingIsLive = () => {
    if (!existsSync(siblingPidPath)) return void setTimeout(failOnceSiblingIsLive, 10)
    process.stderr.write('Fixture worker shard is missing fresh pairs\n')
    process.exit(1)
  }
  failOnceSiblingIsLive()
} else {
  // POSIX delivers SIGTERM asynchronously, so a slow exit makes an unsettled sibling observable; on
  // Windows the abort is TerminateProcess, which never runs this handler.
  process.on('SIGTERM', () => setTimeout(() => process.exit(143), 200))
  writeFileSync(siblingPidPath, String(process.pid))
}
