'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { DATA_START_ISO, DATA_END_ISO } from '@/lib/time'

interface CellTimeseriesProps {
  cellId: number
}

export default function CellTimeseries({ cellId }: CellTimeseriesProps) {
  const startTime = DATA_START_ISO
  const endTime = DATA_END_ISO

  const { data: timeseries, isLoading } = useQuery({
    queryKey: ['timeseries', cellId, startTime, endTime],
    queryFn: () => api.getCellTimeseries(cellId, startTime, endTime)
  })

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Cell Activity Timeline</h2>
          <p className="text-sm text-slate-400 mt-1">Last 24 hours for Cell {cellId}</p>
        </div>
        <Link 
          href={`/dashboard/cell/${cellId}`}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Details →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-2">Time series chart (Recharts)</p>
            <p className="text-xs text-slate-600">{timeseries?.length || 0} data points</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-slate-400">Total Activity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-slate-400">Internet Traffic</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-slate-400">Calls</span>
        </div>
      </div>
    </div>
  )
}
