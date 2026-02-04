'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { DATA_START_ISO } from '@/lib/time'

export default function RecentAlerts() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', DATA_START_ISO],
    queryFn: () => api.getAlerts(DATA_START_ISO)
  })

  const activeAlerts = (alerts || []).filter((alert) => !alert.resolved)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-slate-500'
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-200">Recent Alerts</h2>
        <Link 
          href="/dashboard/alerts"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All →
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : activeAlerts && activeAlerts.length > 0 ? (
        <div className="space-y-3">
          {activeAlerts.slice(0, 5).map((alert) => (
            <div 
              key={alert.id}
              className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${getSeverityColor(alert.severity)}`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-200 mb-1">{alert.message}</p>
                  <p className="text-xs text-slate-500">
                    Cell {alert.cellId} • {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 py-8">
          <p>No active alerts</p>
          <p className="text-xs mt-1">System operating normally</p>
        </div>
      )}
    </div>
  )
}
