import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { AcquisitionError } from './http'

export type AddressResolver = (hostname: string) => Promise<string[]>

export interface UrlPolicy {
  allowedHosts: string[]
  resolveAddresses: AddressResolver
}

export interface ValidatedUrl {
  url: string
  approvedAddresses: string[]
}

export const resolveDnsAddresses: AddressResolver = async hostname =>
  (await lookup(hostname, { all: true, verbatim: true })).map(result => result.address)

const normalizeHost = (hostname: string): string => hostname.toLowerCase().replace(/\.$/, '')

const isPrivateIpv4 = (address: string): boolean => {
  const octets = address.split('.').map(Number)
  if (octets.length !== 4 || octets.some(value => !Number.isInteger(value) || value < 0 || value > 255)) {
    return true
  }
  const [first, second] = octets
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    first >= 224
  )
}

const isPrivateIpv6 = (address: string): boolean => {
  const normalized = address.toLowerCase().split('%')[0]
  if (normalized === '::' || normalized === '::1') return true
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true
  if (normalized.startsWith('fe') || normalized.startsWith('ff')) return true

  const mappedIpv4 = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1]
  if (mappedIpv4) return isPrivateIpv4(mappedIpv4)

  const mappedHex = normalized.match(/^(?:::ffff:|0:0:0:0:0:ffff:)([0-9a-f]{1,4}):([0-9a-f]{1,4})$/)
  if (mappedHex) {
    const high = Number.parseInt(mappedHex[1], 16)
    const low = Number.parseInt(mappedHex[2], 16)
    return isPrivateIpv4(`${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`)
  }

  return normalized.startsWith('::')
}

export const isPrivateAddress = (address: string): boolean => {
  const version = isIP(address)
  if (version === 4) return isPrivateIpv4(address)
  if (version === 6) return isPrivateIpv6(address)
  return true
}

export const validateAcquisitionUrl = async (value: string, policy: UrlPolicy): Promise<ValidatedUrl> => {
  let url: URL
  try {
    url = new URL(value)
  } catch (error) {
    throw new AcquisitionError('invalid-url', `Invalid acquisition URL: ${value}`, error)
  }

  if (url.protocol !== 'https:') {
    throw new AcquisitionError('insecure-url', `Only HTTPS acquisition URLs are allowed: ${value}`)
  }
  if (url.username || url.password) {
    throw new AcquisitionError('url-credentials', `Acquisition URLs cannot include credentials`)
  }
  if (url.port && url.port !== '443') {
    throw new AcquisitionError('url-port', `Acquisition URLs cannot use port ${url.port}`)
  }

  const hostname = normalizeHost(url.hostname)
  const allowedHosts = new Set(policy.allowedHosts.map(normalizeHost))
  if (!allowedHosts.has(hostname)) {
    throw new AcquisitionError('unconfigured-host', `Host ${hostname} is not configured`)
  }

  let resolvedAddresses: string[]
  try {
    resolvedAddresses = await policy.resolveAddresses(hostname)
  } catch (error) {
    throw new AcquisitionError('unresolved-host', `Host ${hostname} could not be resolved`, error)
  }
  /**
   * IPv4 before IPv6, deterministic within each family. The transport dials the addresses in
   * this order, and hosts without an IPv6 route — every GitHub-hosted runner — cannot reach an
   * AAAA record at all, so a plain lexicographic sort that happens to put one first turned the
   * whole 2026-08-27 Rules Radar run into a dead first dial.
   */
  const addresses = Array.from(new Set(resolvedAddresses)).sort(
    (left, right) => isIP(left) - isIP(right) || (left < right ? -1 : left > right ? 1 : 0)
  )
  if (!addresses.length) {
    throw new AcquisitionError('unresolved-host', `Host ${hostname} did not resolve`)
  }
  const privateAddress = addresses.find(isPrivateAddress)
  if (privateAddress) {
    throw new AcquisitionError(
      'private-address',
      `Host ${hostname} resolved to forbidden address ${privateAddress}`
    )
  }

  url.hash = ''
  return {
    url: url.toString(),
    approvedAddresses: addresses,
  }
}
