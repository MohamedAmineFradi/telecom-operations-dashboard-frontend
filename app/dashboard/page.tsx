'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { DEFAULT_HOUR_ISO } from '@/lib/time'
import KpiGrid from '@/components/dashboard/KpiGrid'
import HeatmapPreview from '@/components/dashboard/HeatmapPreview'
import RecentAlerts from '@/components/dashboard/RecentAlerts'
import CellTimeseries from '@/components/dashboard/CellTimeseries'

export default function DashboardHome() {
  // KPIs actuels
  const { data: topCells } = useQuery({
    queryKey: ['top-cells', 'now'],
    queryFn: () => api.getTopCells(DEFAULT_HOUR_ISO)
  })

  // Heatmap preview
  const { data: heatmap } = useQuery({
    queryKey: ['heatmap', 'now'],
    queryFn: () => api.getHeatmap(DEFAULT_HOUR_ISO)
  })

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.getNetworkStats()
  })

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Network Overview</h1>
        <p className="text-slate-400 mt-2">Real-time monitoring of Milan telecom network</p>
      </div>

      {/* KPIs */}
      <KpiGrid topCells={topCells || []} stats={stats} />

      {/* Heatmap preview + Recent alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeatmapPreview data={heatmap || []} />
        </div>
        <div>
          <RecentAlerts />
        </div>
      </div>

      {/* Time series */}
      <div>
        <CellTimeseries cellId={1} />
      </div>
    </div>
  )
}
