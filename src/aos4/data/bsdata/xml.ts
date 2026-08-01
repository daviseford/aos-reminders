/**
 * A minimal well-formed-XML reader for BSData `.cat` catalogue files.
 *
 * The repository deliberately has no XML dependency, and the HTML parser it does have (parse5)
 * cannot read XML: it lowercases attribute names and treats self-closing unknown elements as
 * unclosed, which silently reparents every following sibling. BSData catalogues are
 * machine-written, well-formed XML, so a small strict reader is both sufficient and safer than a
 * lenient one — any structural surprise must fail loudly rather than produce a wrong rule.
 */

export interface XmlElement {
  name: string
  attributes: Record<string, string>
  children: XmlElement[]
  text: string
}

export interface XmlParseResult {
  root?: XmlElement
  errors: string[]
}

const NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9._:-]*$/

const decodeEntities = (value: string, errors: string[]): string =>
  value.replace(/&(#x?[0-9A-Fa-f]+|[A-Za-z]+);/g, (raw, body: string) => {
    if (body.startsWith('#x') || body.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(body.slice(2), 16))
    }
    if (body.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(body.slice(1), 10))
    }
    const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
    const decoded = named[body]
    if (decoded === undefined) {
      errors.push(`Unknown XML entity &${body};`)
      return raw
    }
    return decoded
  })

export const parseXmlDocument = (source: string): XmlParseResult => {
  const errors: string[] = []
  let index = 0
  const length = source.length
  const fail = (message: string): undefined => {
    errors.push(`${message} (offset ${index})`)
    return undefined
  }

  const skipMisc = (): void => {
    while (index < length) {
      const rest = source.slice(index, index + 4)
      if (/^\s/.test(source[index])) {
        index += 1
      } else if (rest.startsWith('<?')) {
        const end = source.indexOf('?>', index)
        if (end < 0) {
          fail('Unterminated processing instruction')
          index = length
          return
        }
        index = end + 2
      } else if (rest.startsWith('<!--')) {
        const end = source.indexOf('-->', index)
        if (end < 0) {
          fail('Unterminated comment')
          index = length
          return
        }
        index = end + 3
      } else {
        return
      }
    }
  }

  const parseAttributes = (element: XmlElement): boolean => {
    while (index < length) {
      while (index < length && /\s/.test(source[index])) index += 1
      const character = source[index]
      if (character === '>' || (character === '/' && source[index + 1] === '>')) return true
      const nameEnd = source.indexOf('=', index)
      if (nameEnd < 0) {
        fail('Attribute without a value')
        return false
      }
      const name = source.slice(index, nameEnd).trim()
      if (!NAME_PATTERN.test(name)) {
        fail(`Invalid attribute name ${JSON.stringify(name)}`)
        return false
      }
      index = nameEnd + 1
      const quote = source[index]
      if (quote !== '"' && quote !== "'") {
        fail(`Attribute ${name} is not quoted`)
        return false
      }
      const valueEnd = source.indexOf(quote, index + 1)
      if (valueEnd < 0) {
        fail(`Attribute ${name} is unterminated`)
        return false
      }
      element.attributes[name] = decodeEntities(source.slice(index + 1, valueEnd), errors)
      index = valueEnd + 1
    }
    fail('Unterminated start tag')
    return false
  }

  const parseElement = (): XmlElement | undefined => {
    if (source[index] !== '<') return fail('Expected an element')
    index += 1
    const nameMatch = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9._:-]*/)
    if (!nameMatch) return fail('Invalid element name')
    const element: XmlElement = { name: nameMatch[0], attributes: {}, children: [], text: '' }
    index += nameMatch[0].length
    if (!parseAttributes(element)) return undefined
    if (source[index] === '/' && source[index + 1] === '>') {
      index += 2
      return element
    }
    if (source[index] !== '>') return fail(`Malformed start tag for <${element.name}>`)
    index += 1
    const textParts: string[] = []
    while (index < length) {
      if (source.startsWith('<!--', index)) {
        const end = source.indexOf('-->', index)
        if (end < 0) return fail('Unterminated comment')
        index = end + 3
        continue
      }
      if (source.startsWith('<![CDATA[', index)) {
        const end = source.indexOf(']]>', index)
        if (end < 0) return fail('Unterminated CDATA section')
        textParts.push(source.slice(index + 9, end))
        index = end + 3
        continue
      }
      if (source.startsWith('</', index)) {
        const end = source.indexOf('>', index)
        if (end < 0) return fail(`Unterminated end tag inside <${element.name}>`)
        const closing = source.slice(index + 2, end).trim()
        if (closing !== element.name) {
          return fail(`Mismatched end tag </${closing}> for <${element.name}>`)
        }
        index = end + 1
        element.text = decodeEntities(textParts.join(''), errors)
        return element
      }
      if (source[index] === '<') {
        const child = parseElement()
        if (!child) return undefined
        element.children.push(child)
        continue
      }
      const nextTag = source.indexOf('<', index)
      const end = nextTag < 0 ? length : nextTag
      textParts.push(source.slice(index, end))
      index = end
    }
    return fail(`Unclosed element <${element.name}>`)
  }

  skipMisc()
  const root = index < length ? parseElement() : fail('Empty XML document')
  if (root) {
    skipMisc()
    if (index < length) fail('Trailing content after the document element')
  }
  return { root: errors.length ? undefined : root, errors }
}

export const childElements = (element: XmlElement, name: string): XmlElement[] =>
  element.children.filter(child => child.name === name)

export const descendantElements = (element: XmlElement, name: string): XmlElement[] => [
  ...element.children.filter(child => child.name === name),
  ...element.children.flatMap(child => descendantElements(child, name)),
]
