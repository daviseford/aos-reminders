const REDEMPTION_KEY = 'redeem'

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
