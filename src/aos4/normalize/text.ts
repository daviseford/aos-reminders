import { parseFragment } from 'parse5'
import type { DefaultTreeAdapterMap } from 'parse5'
import type { AbilityText } from '../domain'
import type { NormalizationDiagnostic } from './diagnostics'

const BLOCK_ELEMENTS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'dd',
  'div',
  'dl',
  'dt',
  'figcaption',
  'figure',
  'footer',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'li',
  'main',
  'ol',
  'p',
  'section',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'ul',
])

const UNSAFE_ELEMENTS = new Set(['embed', 'iframe', 'noscript', 'object', 'script', 'style', 'template'])
const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href'])

export interface SourceTextNormalizationResult {
  text: string
  diagnostics: NormalizationDiagnostic[]
}

type Node = DefaultTreeAdapterMap['node']
type Element = DefaultTreeAdapterMap['element']

const isElement = (node: Node): node is Element => 'tagName' in node && Array.isArray(node.attrs)

const isUnsafeUrl = (value: string): boolean => {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return false
  if (normalized.startsWith('#') || normalized.startsWith('/')) return false
  return !normalized.startsWith('https://') && !normalized.startsWith('http://')
}

const normalizeWhitespace = (value: string): string =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()

export const normalizeSourceText = (source: string): SourceTextNormalizationResult => {
  const fragment = parseFragment(source)
  const output: string[] = []
  const diagnostics: NormalizationDiagnostic[] = []

  const visit = (node: Node): void => {
    if (node.nodeName === '#text' && 'value' in node) {
      output.push(node.value)
      return
    }
    if (node.nodeName === '#comment' || node.nodeName === '#documentType') return

    if (isElement(node)) {
      const tagName = node.tagName.toLowerCase()
      if (UNSAFE_ELEMENTS.has(tagName)) {
        diagnostics.push({
          code: 'unsafe-html-element',
          severity: 'error',
          message: `Removed unsafe <${tagName}> element from source text`,
        })
        return
      }

      node.attrs.forEach(attribute => {
        const attributeName = attribute.name.toLowerCase()
        if (URL_ATTRIBUTES.has(attributeName) && isUnsafeUrl(attribute.value)) {
          diagnostics.push({
            code: 'unsafe-html-url',
            severity: 'error',
            message: `Removed unsafe ${attributeName} URL from <${tagName}>`,
          })
        }
        if (attributeName.startsWith('on')) {
          diagnostics.push({
            code: 'unsafe-html-attribute',
            severity: 'error',
            message: `Removed unsafe ${attributeName} attribute from <${tagName}>`,
          })
        }
      })

      if (tagName === 'br') {
        output.push('\n')
        return
      }
      if (BLOCK_ELEMENTS.has(tagName)) output.push('\n')
      node.childNodes.forEach(visit)
      if (BLOCK_ELEMENTS.has(tagName)) output.push('\n')
      return
    }

    if ('childNodes' in node) node.childNodes.forEach(visit)
  }

  visit(fragment)

  const text = normalizeWhitespace(output.join(''))
  const withoutEncodedMarkers = text.replace(/<\/?KY>/gi, '')
  if (withoutEncodedMarkers !== text) {
    diagnostics.push({
      code: 'source-marker-removed',
      severity: 'warning',
      message: 'Removed an encoded Wahapedia keyword marker from normalized text',
    })
  }

  return {
    text: withoutEncodedMarkers,
    diagnostics,
  }
}

export interface NormalizeAbilityTextInput {
  descriptionHtml: string
  reactionTriggerHtml?: string
}

export interface AbilityTextNormalizationResult {
  text: AbilityText
  diagnostics: NormalizationDiagnostic[]
}

type AbilitySectionName = 'declare' | 'effect'

const parseAbilitySections = (text: string, diagnostics: NormalizationDiagnostic[]): AbilityText => {
  const sectionPattern = /(^|\n)(Declare|Effect):\s*/gi
  const matches = Array.from(text.matchAll(sectionPattern))
  if (!matches.length) {
    if (!text) {
      diagnostics.push({
        code: 'missing-ability-effect',
        severity: 'error',
        message: 'Ability description did not contain an effect',
      })
    }
    return { effect: text }
  }

  const sections: Partial<Record<AbilitySectionName, string>> = {}
  const preamble = text.slice(0, matches[0].index).trim()
  if (preamble) {
    diagnostics.push({
      code: 'unlabeled-ability-preamble',
      severity: 'warning',
      message: 'Ability text before the first labeled section requires review',
    })
  }

  matches.forEach((match, index) => {
    const sectionName = match[2].toLowerCase() as AbilitySectionName
    const start = (match.index ?? 0) + match[0].length
    const end = matches[index + 1]?.index ?? text.length
    const sectionText = text.slice(start, end).trim()

    if (sections[sectionName] !== undefined) {
      diagnostics.push({
        code: 'duplicate-ability-section',
        severity: 'error',
        message: `Ability description contains more than one ${match[2]} section`,
      })
      sections[sectionName] = [sections[sectionName], sectionText].filter(Boolean).join('\n')
    } else {
      sections[sectionName] = sectionText
    }
  })

  const effect = [preamble, sections.effect].filter(Boolean).join('\n')
  if (!effect) {
    diagnostics.push({
      code: 'missing-ability-effect',
      severity: 'error',
      message: 'Ability description did not contain an Effect section',
    })
  }

  return {
    ...(sections.declare ? { declare: sections.declare } : {}),
    effect,
  }
}

export const normalizeAbilityText = ({
  descriptionHtml,
  reactionTriggerHtml,
}: NormalizeAbilityTextInput): AbilityTextNormalizationResult => {
  const description = normalizeSourceText(descriptionHtml)
  const reactionTrigger = reactionTriggerHtml
    ? normalizeSourceText(reactionTriggerHtml)
    : { text: '', diagnostics: [] }
  const diagnostics = [...description.diagnostics, ...reactionTrigger.diagnostics]
  const text = parseAbilitySections(description.text, diagnostics)

  return {
    text: {
      ...text,
      ...(reactionTrigger.text ? { reactionTrigger: reactionTrigger.text } : {}),
    },
    diagnostics,
  }
}
