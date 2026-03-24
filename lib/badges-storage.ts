import type { BadgeId } from './badges'

const STORAGE_KEY = 'base12_badges'

export function getEarnedBadges(): BadgeId[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as BadgeId[]
  } catch {
    return []
  }
}

export function hasBadge(badgeId: BadgeId): boolean {
  return getEarnedBadges().includes(badgeId)
}

export function awardBadge(badgeId: BadgeId): boolean {
  if (typeof window === 'undefined') return false

  const current = getEarnedBadges()

  if (current.includes(badgeId)) {
    return false
  }

  const updated = [...current, badgeId]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

  return true
}