'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Link from 'next/link'
import { DATA_START_ISO } from '@/lib/time'
import { useState } from 'react'

export default function RecentAlerts() {
  const [resolvingId, setResolvingId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts', DATA_START_ISO],
    queryFn: () => api.getAlerts(DATA_START_ISO),
    refetchInterval: 15000, // Auto-refresh every 15 seconds for real-time updates
  })

  const resolveMutation = useMutation({
    mutationFn: (alertId: string) => api.resolveAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      setResolvingId(null)
    },
    onError: () => {
      setResolvingId(null)
    }
  })

  const activeAlerts = (alerts || []).filter((alert) => !alert.resolved)
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length
  const highCount = activeAlerts.filter(a => a.severity === 'high').length

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

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    }
    return colors[severity as keyof typeof colors] || 'bg-slate-500/20 text-slate-400'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return '⚠️'
      case 'overload': return '🔴'
      case 'outage': return '⛔'
      default: return '📢'
    }
  }

  const handleResolve = (alertId: string) => {
    setResolvingId(alertId)
    resolveMutation.mutate(alertId)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Real-time Alerts</h2>
          <p className="text-xs text-slate-500 mt-1">
            Auto-refresh • {activeAlerts.length} active
          </p>
        </div>
        <Link 
          href="/dashboard/alerts"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Alert Summary */}
      {activeAlerts.length > 0 && (
        <div className="flex gap-2 mb-4">
          {criticalCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/50 rounded">
              {criticalCount} Critical
            </span>
          )}
          {highCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded">
              {highCount} High
            </span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : activeAlerts && activeAlerts.length > 0 ? (
        <div className="space-y-3">
          {activeAlerts.slice(0, 5).map((alert) => (
            <div 
              key={alert.id}
              className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 transition-all group"
            >
              <div className="flex items-start gap-3">
                {/* Severity indicator */}
                <div className={`w-2 h-2 rounded-full mt-1.5 ${getSeverityColor(alert.severity)} animate-pulse`}></div>
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{getTypeIcon(alert.type)}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium border rounded ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{formatTimestamp(alert.timestamp)}</span>
                  </div>
                  
                  {/* Message */}
                  <p className="text-sm text-slate-200 mb-2 leading-relaxed">{alert.message}</p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Link
                        href={`/dashboard/cell/${alert.cellId}`}
                        className="hover:text-blue-400 transition-colors"
                      >
                        📍 Cell {alert.cellId}
                      </Link>
                      {alert.squareId && (
                        <span>Square {alert.squareId}</span>
                      )}
                    </div>
                    
                    {/* Resolve button */}
                    <button
                      onClick={() => handleResolve(alert.id)}
                      disabled={resolvingId === alert.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded disabled:opacity-50"
                    >
                      {resolvingId === alert.id ? 'Resolving...' : 'Resolve'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-500 py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-medium">No active alerts</p>
          <p className="text-xs mt-1">System operating normally</p>
        </div>
      )}
    </div>
  )
}
