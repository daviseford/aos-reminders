import { readdir, readFile } from 'node:fs/promises'
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

describe('architecture boundaries', () => {
  it('keeps the domain layer free of outward dependencies', async () => {
    const sourceDirectories = new Set(
      (await readdir(sourceRoot, { withFileTypes: true }))
        .filter(entry => entry.isDirectory() && entry.name !== 'aos4')
        .map(entry => entry.name)
    )
    // Read concurrently: this walks every file under src/aos4, and doing it one await at a time
    // left the test slow enough to trip the default timeout when the suite is under load.
    const violations = (
      await Promise.all(
        (await sourceFiles(aos4Root)).map(async file => {
          const source = await readFile(file, 'utf8')
          return importedSpecifiers(source).flatMap(specifier => {
            if (specifier.startsWith('.')) {
              const resolved = path.resolve(path.dirname(file), specifier)
              const outside = resolved !== aos4Root && !resolved.startsWith(`${aos4Root}${path.sep}`)
              return outside ? [`${path.relative(sourceRoot, file)} -> ${specifier}`] : []
            }
            const topLevel = specifier.split('/')[0]
            return sourceDirectories.has(topLevel)
              ? [`${path.relative(sourceRoot, file)} -> ${specifier}`]
              : []
          })
        })
      )
    ).flat()

    expect(violations).toEqual([])
  })

  it('adds no presentation file without an explicit allowlist entry', async () => {
    const allowedPresentationShell = new Set([
      'api/armyApi.ts',
      'api/subscriptionApi.ts',
      'components/helpers/alreadySubscribed.tsx',
      'components/helpers/collapsibleCardHeader.tsx',
      'components/helpers/link.tsx',
      'components/helpers/spinner.tsx',
      'components/helpers/suspenseFallbacks.tsx',
      'components/info/banners/app_banner.tsx',
      'components/info/banners/notification_banner.tsx',
      'components/info/donate.tsx',
      'components/info/offline.tsx',
      'components/info/reminders.tsx',
      'components/info/updateAvailable.tsx',
      'components/input/army_builder.tsx',
      'components/input/generic_button.tsx',
      'components/input/importArmy/failedImportReport.ts',
      'components/input/importArmy/importArmyModal.tsx',
      'components/input/importArmy/importPreview.tsx',
      'components/input/importArmy/subscriberAction.tsx',
      'components/input/armySharing/shareArmyModal.tsx',
      'components/input/armySharing/sharedArmyModal.tsx',
      'components/input/cloudArmies/savedArmiesModal.tsx',
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
      'components/payment/legacyStripeCheckout.ts',
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
  })
})
