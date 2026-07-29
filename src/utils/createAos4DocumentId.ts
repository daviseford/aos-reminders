export const createAos4DocumentId = (): string => {
  if (typeof crypto.randomUUID === 'function') return `army:${crypto.randomUUID()}`
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return `army:${Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')}`
}
