import type { TopCellDto } from '@/lib/types'
import { KpiCard } from '@/components/ui'

interface KpiGridProps {
  data: TopCellDto[]
}

export default function KpiGrid({ data }: KpiGridProps) {
  // Calculate KPIs from top cells data
  const peakCell = data[0]
  const peakActivity = peakCell?.totalActivity || 0
  
  // Average load across top cells
  const avgLoad = data.length > 0
    ? data.reduce((sum, c) => sum + c.totalActivity, 0) / data.length
    : 0
  
  // Number of hot cells (activity > 50% of peak)
  const hotCells = data.filter(c => c.totalActivity > peakActivity * 0.5).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        title="Peak Cell"
        value={peakActivity.toFixed(1)}
        trend={peakCell ? `Cell ${peakCell.cellId}` : undefined}
        color="red"
      />
      <KpiCard 
        title="Avg Load"
        value={avgLoad.toFixed(1)}
        trend="Erlang"
        color="yellow"
      />
      <KpiCard 
        title="Hot Cells"
        value={hotCells.toString()}
        trend={`of ${data.length}`}
        color="orange"
      />
      <KpiCard 
        title="Coverage"
        value="98%"
        trend="+0.5%"
        color="green"
      />
    </div>
  )
}
