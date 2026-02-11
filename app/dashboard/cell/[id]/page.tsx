'use client'

import { useCellDetails } from '@/lib/hooks'
import { use } from 'react'

export default function CellDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const cellId = parseInt(resolvedParams.id)

  const { data: cellDetails, isLoading } = useCellDetails(cellId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!cellDetails) {
    return (
      <div className="text-center text-slate-400 mt-8">
        Cell not found
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Cell {cellId} Details</h1>
        <p className="text-slate-400 mt-2">
          {cellDetails.squareId && `Square ${cellDetails.squareId} • `}
          {cellDetails.centroidY && cellDetails.centroidX
            ? `Coordinates: ${cellDetails.centroidY.toFixed(4)}, ${cellDetails.centroidX.toFixed(4)}`
            : 'Location data unavailable'
          }
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Activity</h3>
          <p className="text-3xl font-bold text-slate-100">
            {cellDetails.currentLoad ? cellDetails.currentLoad.toFixed(1) : 'N/A'}%
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Average Load</h3>
          <p className="text-3xl font-bold text-slate-100">
            {cellDetails.averageLoad ? cellDetails.averageLoad.toFixed(1) : 'N/A'}%
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Active Alerts</h3>
          <p className="text-3xl font-bold text-slate-100">
            {cellDetails.alerts?.length || 0}
          </p>
        </div>
      </div>

      {/* Time series */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Activity Timeline</h3>
        <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center">
          <p className="text-slate-500">
            Time series chart (Recharts) - {cellDetails.timeseries?.length || 0} data points
          </p>
        </div>
      </div>

      {/* Alerts */}
      {cellDetails.alerts && cellDetails.alerts.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Alerts</h3>
          <div className="space-y-2">
            {cellDetails.alerts.map((alert) => (
              <div key={alert.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${alert.severity === 'critical' ? 'bg-red-500 text-white' :
                      alert.severity === 'high' ? 'bg-orange-500 text-white' :
                        alert.severity === 'medium' ? 'bg-yellow-500 text-slate-900' :
                          'bg-blue-500 text-white'
                    }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
