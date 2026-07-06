import type { HeroStatSetting, SiteSettings } from '@/types/cms'

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  establishedYear: 2016,
  heroStats: [
    { label: 'PRODUCT LINES', value: '150+', type: 'manual' },
    { label: 'YEARS', value: '', type: 'years_since' },
    { label: 'CLIENTS', value: '2K+', type: 'manual' },
  ],
}

function normalizeHeroStat(
  stat: Partial<HeroStatSetting> | undefined,
  fallback: HeroStatSetting,
): HeroStatSetting {
  return {
    label: stat?.label?.trim() || fallback.label,
    value: stat?.value?.trim() ?? fallback.value,
    type: stat?.type === 'years_since' ? 'years_since' : 'manual',
  }
}

export function normalizeSiteSettings(input?: Partial<SiteSettings> | null): SiteSettings {
  const base = DEFAULT_SITE_SETTINGS
  const currentYear = new Date().getFullYear()
  const year = Number(input?.establishedYear)
  const establishedYear =
    Number.isFinite(year) && year >= 1900 && year <= currentYear
      ? Math.trunc(year)
      : base.establishedYear

  const incoming = input?.heroStats ?? base.heroStats
  const heroStats: SiteSettings['heroStats'] = [
    normalizeHeroStat(incoming[0], base.heroStats[0]),
    normalizeHeroStat(incoming[1], base.heroStats[1]),
    normalizeHeroStat(incoming[2], base.heroStats[2]),
  ]

  return { establishedYear, heroStats }
}

export function resolveHeroStatValue(stat: HeroStatSetting, establishedYear: number): string {
  if (stat.type === 'years_since') {
    const years = Math.max(1, new Date().getFullYear() - establishedYear)
    return `${years}+`
  }
  return stat.value.trim() || '—'
}

export function resolveHeroStats(settings: SiteSettings): { value: string; label: string }[] {
  return settings.heroStats.map((stat) => ({
    label: stat.label,
    value: resolveHeroStatValue(stat, settings.establishedYear),
  }))
}
