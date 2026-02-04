'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { DATA_START_ISO, DATA_END_ISO } from '@/lib/time'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

interface CellTimeseriesProps {
  cellId: number
}

export default function CellTimeseries({ cellId }: CellTimeseriesProps) {
  const startTime = DATA_START_ISO
  const endTime = DATA_END_ISO

  const { data: timeseries, isLoading } = useQuery({
    queryKey: ['timeseries', cellId, startTime, endTime],
    queryFn: () => api.getCellTimeseries(cellId, startTime, endTime),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  })

  // Transform data for Recharts
  const chartData = useMemo(() => {
    if (!timeseries || timeseries.length === 0) return []
    
    // Group by timestamp
    const grouped = new Map<string, any>()
    
    timeseries.forEach(point => {
      const time = new Date(point.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      
      if (!grouped.has(time)) {
        grouped.set(time, { time })
      }
      
      const entry = grouped.get(time)!
      entry[point.metric] = point.value
    })
    
    return Array.from(grouped.values())
  }, [timeseries])

  // Calculate stats
  const stats = useMemo(() => {
    if (!timeseries || timeseries.length === 0) {
      return { avg: 0, max: 0, min: 0 }
    }
    
    const values = timeseries.map(t => t.value)
    return {
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
      max: Math.max(...values).toFixed(1),
      min: Math.min(...values).toFixed(1)
    }
  }, [timeseries])

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Cell Activity Timeline</h2>
          <p className="text-sm text-slate-400 mt-1">
          last 24 hours  (  Nov 1-8, 2013 )  • Cell {cellId} • {timeseries?.length || 0} data points
          </p>
        </div>
        <Link 
          href={`/dashboard/cell/${cellId}`}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Details →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-slate-900 rounded-lg p-3">
          <p className="text-xs text-slate-500">Average</p>
          <p className="text-lg font-semibold text-slate-200">{stats.avg}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-3">
          <p className="text-xs text-slate-500">Peak</p>
          <p className="text-lg font-semibold text-green-400">{stats.max}</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-3">
          <p className="text-xs text-slate-500">Min</p>
          <p className="text-lg font-semibold text-blue-400">{stats.min}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : chartData.length > 0 ? (
        <div className="h-64 bg-slate-900 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8" 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="totalActivity" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="Total Activity"
              />
              <Line 
                type="monotone" 
                dataKey="internetTraffic" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={false}
                name="Internet"
              />
              <Line 
                type="monotone" 
                dataKey="calls" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
                name="Calls"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-500">
            <p>No data available</p>
            <p className="text-xs mt-1">Try selecting a different time range</p>
          </div>
        </div>
      )}
    </div>
  )
}
