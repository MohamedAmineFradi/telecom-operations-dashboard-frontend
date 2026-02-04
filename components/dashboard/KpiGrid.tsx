import type { NetworkStats, TopCellDto } from '@/lib/types'
import KpiCard from '@/components/ui/KpiCard'

interface KpiGridProps {
  topCells: TopCellDto[]
  stats?: NetworkStats
}

export default function KpiGrid({ topCells, stats }: KpiGridProps) {
  const peakCell = topCells[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        title="Peak Cell Activity"
        value={peakCell?.totalActivity?.toFixed(1) || 'N/A'}
        trend="+12%"
        color="red"
      />
      <KpiCard 
        title="Avg Network Load"
        value={stats?.totalCells ? `${stats.totalCells}` : 'N/A'}
        trend="-2%"
        color="yellow"
      />
      <KpiCard 
        title="Active Alerts"
        value={stats?.totalAlerts?.toString() || 'N/A'}
        trend="+1"
        color="orange"
      />
      <KpiCard 
        title="Total Traffic"
        value={stats?.totalTrafficRecords ? `${stats.totalTrafficRecords}` : 'N/A'}
        trend="+3%"
        color="blue"
      />
    </div>
  )
}
