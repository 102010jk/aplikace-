import { Film } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center">
        <Film size={28} className="text-muted" />
      </div>
      <div>
        <p className="text-white font-medium">{title}</p>
        {description && <p className="text-muted text-sm mt-1">{description}</p>}
      </div>
    </div>
  )
}
