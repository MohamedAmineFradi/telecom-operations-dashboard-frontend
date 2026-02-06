'use client'

import { useHeatmap, useTopCells, useStreamSlot } from '@/lib/hooks'
import { DEFAULT_HOUR_ISO } from '@/lib/time'
import KpiGrid from '@/components/dashboard/KpiGrid'
import HeatmapPreview from '@/components/dashboard/HeatmapPreview'
import RecentAlerts from '@/components/dashboard/RecentAlerts'
import CellTimeseries from '@/components/dashboard/CellTimeseries'
import { useState } from 'react'

export default function DashboardHome() {
  const [selectedDatetime] = useState(DEFAULT_HOUR_ISO)
  
  // Using new hooks from lib/api.ts
  const { data: topCells, isLoading: loadingTopCells } = useTopCells(selectedDatetime)
  const { data: heatmap, isLoading: loadingHeatmap } = useHeatmap(selectedDatetime)
  const streamMutation = useStreamSlot()

  const handleRefresh = () => {
    streamMutation.mutate(selectedDatetime)
  }

  return (
    <div className="space-y-8">
      {/* Page header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Network Overview</h1>
          <p className="text-slate-400 mt-2">
            Milan Telecom Network • Nov 1-8, 2013 
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={streamMutation.isPending}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span className={streamMutation.isPending ? 'animate-spin' : ''}>🔄</span>
          {streamMutation.isPending ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Success/Error messages */}
      {streamMutation.isSuccess && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-green-300">
          ✅ Data refreshed successfully! Sent {streamMutation.data.sentEvents} events.
        </div>
      )}
      {streamMutation.isError && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
          ❌ Failed to refresh data. Please try again.
        </div>
      )}

      {/* KPIs */}
      {loadingTopCells ? (
        <div className="text-slate-400">Loading KPIs...</div>
      ) : (
        <KpiGrid data={topCells || []} />
      )}

      {/* Heatmap preview + Recent alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loadingHeatmap ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-slate-400">
              Loading heatmap...
            </div>
          ) : (
            <HeatmapPreview data={heatmap || []} />
          )}
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
