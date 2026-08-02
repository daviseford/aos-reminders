import { mkdtemp, mkdir, readFile, readdir, realpath, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { writeListbotCorpus } from '../support/listbotCorpusCommand'

describe('Listbot corpus publication', () => {
  let workspaceRoot: string
  let outputRoot: string
  let output: string

  beforeEach(async () => {
    // Canonicalized so the paths these tests compare match the ones publication reports back.
    // macOS os.tmpdir() sits under /var, a symlink to /private/var; the symlinked-root case is
    // covered deliberately below rather than left to depend on the host's temp layout.
    workspaceRoot = await realpath(await mkdtemp(path.join(tmpdir(), 'aos-listbot-corpus-')))
    outputRoot = path.join(workspaceRoot, 'data', 'aos4', 'import-corpus')
    output = path.join(outputRoot, 'listbot')
  })

  afterEach(async () => {
    await rm(workspaceRoot, { recursive: true, force: true })
  })

  const writeCorpus = (force: boolean, text = 'new roster') =>
    writeListbotCorpus({
      workspaceRoot,
      outputRoot,
      output,
      force,
      files: [{ file: 'armies/alpha.txt', text }],
      manifest: { schemaVersion: 1 },
    })

  it('publishes atomically and requires force before replacing a corpus', async () => {
    await writeCorpus(false)

    await expect(readFile(path.join(output, 'armies', 'alpha.txt'), 'utf8')).resolves.toBe('new roster')
    await expect(writeCorpus(false, 'replacement')).rejects.toThrow('pass --force')

    await writeCorpus(true, 'replacement')
    await expect(readFile(path.join(output, 'armies', 'alpha.txt'), 'utf8')).resolves.toBe('replacement')
    expect((await readdir(outputRoot)).filter(name => name.includes('.backup'))).toEqual([])
  })

  it('publishes into a workspace root reached through a symbolic link', async () => {
    const realWorkspace = path.join(workspaceRoot, 'real')
    const linkedWorkspace = path.join(workspaceRoot, 'linked')
    await mkdir(realWorkspace)
    await symlink(realWorkspace, linkedWorkspace, process.platform === 'win32' ? 'junction' : 'dir')
    const linkedOutputRoot = path.join(linkedWorkspace, 'data', 'aos4', 'import-corpus')

    await writeListbotCorpus({
      workspaceRoot: linkedWorkspace,
      outputRoot: linkedOutputRoot,
      output: path.join(linkedOutputRoot, 'listbot'),
      force: false,
      files: [{ file: 'armies/alpha.txt', text: 'new roster' }],
      manifest: { schemaVersion: 1 },
    })

    const publishedThroughRealPath = path.join(
      realWorkspace,
      'data',
      'aos4',
      'import-corpus',
      'listbot',
      'armies',
      'alpha.txt'
    )
    await expect(readFile(publishedThroughRealPath, 'utf8')).resolves.toBe('new roster')
  })

  it('refuses to traverse a junction outside the configured output root', async () => {
    const outside = path.join(workspaceRoot, 'outside')
    await mkdir(outputRoot, { recursive: true })
    await mkdir(outside)
    await writeFile(path.join(outside, 'sentinel.txt'), 'keep me')
    const junction = path.join(outputRoot, 'escape')
    await symlink(outside, junction, process.platform === 'win32' ? 'junction' : 'dir')

    await expect(
      writeListbotCorpus({
        workspaceRoot,
        outputRoot,
        output: path.join(junction, 'listbot'),
        force: true,
        files: [{ file: 'armies/alpha.txt', text: 'new roster' }],
        manifest: {},
      })
    ).rejects.toThrow('Refusing to traverse symbolic link or junction')
    await expect(readFile(path.join(outside, 'sentinel.txt'), 'utf8')).resolves.toBe('keep me')
  })

  it('restores the previous corpus when publishing the replacement fails', async () => {
    await mkdir(output, { recursive: true })
    await writeFile(path.join(output, 'old.txt'), 'old roster')
    let publicationFailed = false

    await expect(
      writeListbotCorpus({
        workspaceRoot,
        outputRoot,
        output,
        force: true,
        files: [{ file: 'armies/alpha.txt', text: 'new roster' }],
        manifest: {},
        renamePath: async (from, to) => {
          if (
            !publicationFailed &&
            String(from).endsWith('.tmp') &&
            path.resolve(String(to)) === path.resolve(output)
          ) {
            publicationFailed = true
            throw new Error('simulated publication failure')
          }
          await rename(from, to)
        },
      })
    ).rejects.toThrow('simulated publication failure')

    await expect(readFile(path.join(output, 'old.txt'), 'utf8')).resolves.toBe('old roster')
    await expect(readFile(path.join(output, 'armies', 'alpha.txt'), 'utf8')).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })
})
