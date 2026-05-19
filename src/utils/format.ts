export function formatYear(dateStr: string | undefined | null): string {
  if (!dateStr) return 'N/A'
  return dateStr.slice(0, 4)
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}
