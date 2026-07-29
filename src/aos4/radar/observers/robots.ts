export interface RobotsRule {
  directive: 'allow' | 'disallow'
  path: string
}

export interface RobotsGroup {
  userAgents: string[]
  rules: RobotsRule[]
}

export interface RobotsPolicy {
  groups: RobotsGroup[]
}

const withoutComment = (value: string): string => value.split('#', 1)[0].trim()

export const parseRobotsPolicy = (text: string): RobotsPolicy => {
  const groups: RobotsGroup[] = []
  let current: RobotsGroup | undefined
  let hasRule = false

  text.split(/\r?\n/).forEach((rawLine, index) => {
    const line = withoutComment(rawLine)
    if (!line) return
    const separator = line.indexOf(':')
    if (separator < 1) throw new Error(`robots.txt line ${index + 1} is malformed`)
    const field = line.slice(0, separator).trim().toLowerCase()
    const value = line.slice(separator + 1).trim()

    if (field === 'user-agent') {
      if (!value) throw new Error(`robots.txt line ${index + 1} has an empty user-agent`)
      if (!current || hasRule) {
        current = { userAgents: [], rules: [] }
        groups.push(current)
        hasRule = false
      }
      current.userAgents.push(value.toLowerCase())
      return
    }
    if (field !== 'allow' && field !== 'disallow') return
    if (!current) throw new Error(`robots.txt line ${index + 1} defines a rule without a user-agent`)
    hasRule = true
    if (!value && field === 'disallow') return
    if (!value.startsWith('/')) {
      throw new Error(`robots.txt line ${index + 1} has a non-path rule`)
    }
    current.rules.push({ directive: field, path: value })
  })

  if (!groups.length) throw new Error('robots.txt contains no user-agent groups')
  return { groups }
}

const matchingGroups = (policy: RobotsPolicy, userAgent: string): RobotsGroup[] => {
  const normalizedAgent = userAgent.toLowerCase()
  const exact = policy.groups.filter(group =>
    group.userAgents.some(agent => agent !== '*' && normalizedAgent.includes(agent))
  )
  return exact.length ? exact : policy.groups.filter(group => group.userAgents.some(agent => agent === '*'))
}

export const robotsAllows = (policy: RobotsPolicy, userAgent: string, pathWithQuery: string): boolean => {
  const matchesRule = (rule: RobotsRule): boolean => {
    const anchored = rule.path.endsWith('$')
    const body = anchored ? rule.path.slice(0, -1) : rule.path
    const pattern = body
      .split('*')
      .map(part => part.replace(/[\\^$+?.()|[\]{}]/g, '\\$&'))
      .join('.*')
    return new RegExp(`^${pattern}${anchored ? '$' : ''}`).test(pathWithQuery)
  }
  const specificity = (rule: RobotsRule): number => rule.path.replaceAll('*', '').replace(/\$$/, '').length
  const matches = matchingGroups(policy, userAgent)
    .flatMap(group => group.rules)
    .filter(matchesRule)
    .sort(
      (left, right) =>
        specificity(right) - specificity(left) ||
        (left.directive === 'allow' ? -1 : right.directive === 'allow' ? 1 : 0)
    )
  return matches[0]?.directive !== 'disallow'
}
