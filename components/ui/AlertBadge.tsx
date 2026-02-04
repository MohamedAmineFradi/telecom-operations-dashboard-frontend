interface AlertBadgeProps {
  count: number
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export default function AlertBadge({ count, severity }: AlertBadgeProps) {
  if (count === 0) return null

  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium border rounded ${colors[severity]}`}>
      {count} {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  )
}
