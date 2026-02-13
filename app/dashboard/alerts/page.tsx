'use client'

import { useResolveAlert, useAlerts } from '@/lib/hooks'
import type { Alert } from '@/lib/types'
import { DATA_START_ISO } from '@/lib/time'
import { EmptyState, LoadingSpinner, PageHeader, SectionHeader, StatCard } from '@/components/ui'

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
  const activeCounts = activeAlerts.reduce(
    (acc, alert) => {
      acc[alert.severity] += 1
      return acc
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Network Alerts"
        description="Real-time anomaly detection and notifications"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Critical"
          value={activeCounts.critical}
          color="red"
          variant="tinted"
        />
        <StatCard
          label="High"
          value={activeCounts.high}
          color="orange"
          variant="tinted"
        />
        <StatCard
          label="Medium"
          value={activeCounts.medium}
          color="yellow"
          variant="tinted"
        />
        <StatCard
          label="Low"
          value={activeCounts.low}
          color="blue"
          variant="tinted"
        />
      </div>

      {/* Active alerts */}
      <div>
        <SectionHeader title="Active Alerts" />
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
          <EmptyState message="No active alerts" />
        )}
      </div>

      {/* Resolved alerts */}
      <div>
        <SectionHeader title="Recently Resolved" />
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
          <EmptyState message="No resolved alerts" />
        )}
      </div>
    </div>
  )
}
