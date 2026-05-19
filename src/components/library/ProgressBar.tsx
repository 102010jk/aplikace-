import { motion } from 'framer-motion'

interface Props {
  watched: number
  total: number
}

export function ProgressBar({ watched, total }: Props) {
  if (total === 0) return null
  const pct = Math.round((watched / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted">{watched}/{total} epizod</span>
        <span className="text-xs text-muted">{pct}%</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            pct === 100 ? 'bg-green-500' : pct === 0 ? 'bg-muted' : 'bg-amber-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}
