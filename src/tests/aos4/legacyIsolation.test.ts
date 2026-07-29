import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const sourceRoot = path.resolve(process.cwd(), 'src')
const aos4Root = path.join(sourceRoot, 'aos4')
const importPattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g

const sourceFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const children = await Promise.all(
    entries.map(async entry => {
      const child = path.join(directory, entry.name)
      if (entry.isDirectory()) return sourceFiles(child)
      return /\.[cm]?[jt]sx?$/.test(entry.name) ? [child] : []
    })
  )
  return children.flat().sort((left, right) => left.localeCompare(right))
}

const importedSpecifiers = (source: string): string[] =>
  Array.from(source.matchAll(importPattern), match => match[1])

const exists = async (target: string): Promise<boolean> => {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

describe('AoS 4 legacy isolation', () => {
  it('does not import from the AoS 3 application or rules graph', async () => {
    const sourceDirectories = new Set(
      (await readdir(sourceRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name !== 'aos4')
        .map(entry => entry.name)
    )
    const violations: string[] = []

    for (const file of await sourceFiles(aos4Root)) {
      const source = await readFile(file, 'utf8')
      importedSpecifiers(source).forEach(specifier => {
        if (specifier.startsWith('.')) {
          const resolved = path.resolve(path.dirname(file), specifier)
          if (resolved !== aos4Root && !resolved.startsWith(`${aos4Root}${path.sep}`)) {
            violations.push(`${path.relative(sourceRoot, file)} -> ${specifier}`)
          }
          return
        }

        const topLevel = specifier.split('/')[0]
        if (sourceDirectories.has(topLevel)) {
          violations.push(`${path.relative(sourceRoot, file)} -> ${specifier}`)
        }
      })
    }

    expect(violations).toEqual([])
  })

  it('keeps the retired AoS 3 rules and application graph physically absent', async () => {
    const retiredPaths = [
      'ducks',
      'factions',
      'generic_rules',
      'meta',
      'store',
      // `components/print` is deliberately absent from this list. Printing is a live AoS 4 feature
      // rebuilt on `aos4/print`, not retained AoS 3 code. The retired AoS 3 generator was
      // `utils/pdf`, which stays retired below.
      'api/preferenceApi.ts',
      'components/input/ally_armies.tsx',
      'components/input/ally_army_builder.tsx',
      'components/input/importPdf',
      'components/input/savedArmies',
      'components/input/shareArmy',
      'components/input/toolbar/add_ally_btn.tsx',
      'components/input/toolbar/import_army_btn.tsx',
      'utils/azyr',
      'utils/battlescribe',
      'utils/getArmy',
      'utils/import',
      'utils/loadArmy',
      'utils/pdf',
      'utils/warhammer_app',
      'utils/warscroll',
      'types/army.ts',
      'types/data.ts',
      'types/phases.ts',
      'types/savedArmy.ts',
      'types/selections.ts',
      'types/store.ts',
    ]
    const survivors = (
      await Promise.all(
        retiredPaths.map(async retiredPath => ({
          retiredPath,
          exists: await exists(path.join(sourceRoot, retiredPath)),
        }))
      )
    )
      .filter(result => result.exists)
      .map(result => result.retiredPath)

    expect(survivors).toEqual([])

    const allowedPresentationShell = new Set([
      'api/subscriptionApi.ts',
      'components/helpers/alreadySubscribed.tsx',
      'components/helpers/link.tsx',
      'components/helpers/spinner.tsx',
      'components/helpers/suspenseFallbacks.tsx',
      'components/info/donate.tsx',
      'components/info/offline.tsx',
      'components/info/reminders.tsx',
      'components/input/army_builder.tsx',
      'components/input/generic_button.tsx',
      'components/input/importArmy/importArmyModal.tsx',
      'components/input/importArmy/importPreview.tsx',
      'components/input/importArmy/subscriberAction.tsx',
      'components/input/toolbar/toolbar.tsx',
      'components/page/footer.tsx',
      'components/page/homeHeader.tsx',
      'components/page/navbar.tsx',
      'components/page/navbar_wrapper.tsx',
      'components/page/privateRoute.tsx',
      'components/page/contact.tsx',
      'components/page/redemption.tsx',
      'components/modals/generic/generic_destructive_modal.tsx',
      'components/modals/generic/generic_modal.tsx',
      'components/modals/paypal_cancellation_modal.tsx',
      'components/modals/paypal_post_subscribe_modal.tsx',
      'components/modals/stripe_cancellation_modal.tsx',
      'components/payment/giftSubscriptions.tsx',
      'components/payment/paypal/paypalButton.tsx',
      'components/payment/paypal/paypalTypes.ts',
      'components/payment/pricingPlans.tsx',
      'components/print/printModal.tsx',
      'components/routes/Faq.tsx',
      'components/routes/Home.tsx',
      'components/routes/Join.tsx',
      'components/routes/Profile.tsx',
      'components/routes/Redeem.tsx',
      'components/routes/Subscribe.tsx',
    ])
    const presentationRoots = [
      'api',
      'components/helpers',
      'components/info',
      'components/input',
      'components/modals',
      'components/page',
      'components/payment',
      'components/print',
      'components/routes',
    ].map(root => path.join(sourceRoot, root))
    const unexpectedPresentationFiles = (await Promise.all(presentationRoots.map(sourceFiles)))
      .flat()
      .map(file => path.relative(sourceRoot, file).replaceAll(path.sep, '/'))
      .filter(file => !allowedPresentationShell.has(file))

    expect(unexpectedPresentationFiles).toEqual([])

    const fixtureFamilies = (
      await readdir(path.join(sourceRoot, 'tests', 'fixtures'), {
        withFileTypes: true,
      })
    )
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()

    expect(fixtureFamilies).toEqual(['aos4'])
  })
})
