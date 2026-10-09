const REDEMPTION_KEY = 'redeem'

/** The gift in a `/redeem?redeem=<giftId>&referrer=<userId>` link. A repeated key is rejected. */
export const readRedemptionQuery = (search: string): { giftId: string; userId: string } | null => {
  const params = new URLSearchParams(search)
  const redeem = params.getAll('redeem')
  const referrer = params.getAll('referrer')
  return redeem.length === 1 && referrer.length === 1 ? { giftId: redeem[0], userId: referrer[0] } : null
}

export const RedemptionStorage = {
  clear: () => localStorage.removeItem(REDEMPTION_KEY),
  get: (): { giftId: string; userId: string } | null => {
    const value = localStorage.getItem(REDEMPTION_KEY)
    if (!value) return null

    try {
      const parsed = JSON.parse(value) as { giftId?: unknown; userId?: unknown }
      if (typeof parsed.giftId !== 'string' || typeof parsed.userId !== 'string') return null
      return { giftId: parsed.giftId, userId: parsed.userId }
    } catch {
      return null
    }
  },
  set: (giftId: string, userId: string) =>
    localStorage.setItem(REDEMPTION_KEY, JSON.stringify({ giftId, userId })),
}
