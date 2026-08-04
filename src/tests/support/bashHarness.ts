import { existsSync } from 'node:fs'
import { join } from 'node:path'

/*
 * The deployment harnesses run the real `scripts/*.sh` against stub binaries. On Windows that means
 * WSL: the scripts are bash, and the harness hands them `/mnt/<drive>/...` paths.
 *
 * `spawnSync('bash', ...)` picks whichever bash the launching shell put first on PATH, which is not
 * the same thing. Started from PowerShell or cmd it finds WSL's launcher in System32 and the suite
 * passes; started from Git Bash it finds Git's own bash, which reads `/mnt/c/...` relative to its
 * installation root and reports `chmod: cannot access '/mnt/c/...': No such file or directory` for
 * every stub. That surfaced as 19 failing deployment tests whose real cause was the terminal the
 * developer happened to be in.
 *
 * So name the interpreter instead of inheriting it. `System32\bash.exe` is the WSL launcher and is
 * present whenever the feature is enabled; if it is missing, fall back to a PATH lookup so the
 * failure is about a missing WSL rather than a missing file.
 */
export const bashCommand = (): string => {
  if (process.platform !== 'win32') return 'bash'

  const wslBash = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'bash.exe')

  return existsSync(wslBash) ? wslBash : 'bash'
}

/*
 * Convert a Windows path to the form the interpreter above understands. A no-op everywhere else.
 */
export const bashPath = (path: string): string => {
  if (process.platform !== 'win32') return path

  const match = path.match(/^([A-Za-z]):\\(.*)$/)
  if (!match) throw new Error(`Cannot convert ${path} to a WSL path`)

  return `/mnt/${match[1].toLowerCase()}/${match[2].replaceAll('\\', '/')}`
}
