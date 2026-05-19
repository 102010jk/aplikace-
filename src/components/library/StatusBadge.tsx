import type { MediaStatus } from '../../types'

const config: Record<MediaStatus, { label: string; class: string }> = {
  not_watched: { label: 'Nezhlédnuto', class: 'bg-gray-600/60 text-gray-300' },
  in_progress: { label: 'Sleduji', class: 'bg-amber-500/30 text-amber-300' },
  watched: { label: 'Zhlédnuto', class: 'bg-green-500/30 text-green-300' },
}

export function StatusBadge({ status }: { status: MediaStatus }) {
  const { label, class: cls } = config[status]
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  )
}
