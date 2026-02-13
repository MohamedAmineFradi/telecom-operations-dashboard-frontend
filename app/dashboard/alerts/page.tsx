'use client'

import { useQuery } from '@tanstack/react-query'
import { useResolveAlert, useAlerts } from '@/lib/hooks'
import type { Alert } from '@/lib/types'
import { DATA_START_ISO } from '@/lib/time'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

function AlertCard({ alert }: { alert: Alert }) {
  const resolveMutation = useResolveAlert()

  const severityColors = {
    low: 'border-blue-500/30 bg-blue-500/10',
    medium: 'border-yellow-500/30 bg-yellow-500/10',
    high: 'border-orange-500/30 bg-orange-500/10',
    critical: 'border-red-500/30 bg-red-500/10',
  }

  return (
    <div className={`border rounded-lg p-4 ${severityColors[alert.severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {alert.type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              alert.severity === 'critical' ? 'bg-red-500 text-white' :
              alert.severity === 'high' ? 'bg-orange-500 text-white' :
              alert.severity === 'medium' ? 'bg-yellow-500 text-slate-900' :
              'bg-blue-500 text-white'
            }`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-slate-200 mb-2">{alert.message}</p>
          <p className="text-xs text-slate-500">
            Cell {alert.cellId} • Square {alert.squareId} • {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
        
        {!alert.resolved && (
          <button
            onClick={() => resolveMutation.mutate(alert.id)}
            disabled={resolveMutation.isPending}
            className="ml-4 px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
          >
            {resolveMutation.isPending ? 'Resolving...' : 'Resolve'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts(DATA_START_ISO)

  const activeAlerts = (alerts || []).filter((alert) => !alert.resolved)
  const resolvedAlerts = (alerts || []).filter((alert) => alert.resolved)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Network Alerts</h1>
        <p className="text-slate-400 mt-2">Real-time anomaly detection and notifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-xs text-red-400 font-semibold uppercase mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-400">
            {activeAlerts?.filter(a => a.severity === 'critical').length || 0}
          </p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-xs text-orange-400 font-semibold uppercase mb-1">High</p>
          <p className="text-2xl font-bold text-orange-400">
            {activeAlerts?.filter(a => a.severity === 'high').length || 0}
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-xs text-yellow-400 font-semibold uppercase mb-1">Medium</p>
          <p className="text-2xl font-bold text-yellow-400">
            {activeAlerts?.filter(a => a.severity === 'medium').length || 0}
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-xs text-blue-400 font-semibold uppercase mb-1">Low</p>
          <p className="text-2xl font-bold text-blue-400">
            {activeAlerts?.filter(a => a.severity === 'low').length || 0}
          </p>
        </div>
      </div>

      {/* Active alerts */}
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-4">Active Alerts</h2>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="md" variant="primary" />
          </div>
        ) : activeAlerts && activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-slate-400">No active alerts</p>
          </div>
        )}
      </div>

      {/* Resolved alerts */}
      <div>
        <h2 className="text-xl font-bold text-slate-200 mb-4">Recently Resolved</h2>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="md" variant="primary" />
          </div>
        ) : resolvedAlerts && resolvedAlerts.length > 0 ? (
          <div className="space-y-3">
            {resolvedAlerts.slice(0, 5).map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-slate-400">No resolved alerts</p>
          </div>
        )}
      </div>
    </div>
  )
}
