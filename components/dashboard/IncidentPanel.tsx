'use client'

import React, { useState } from 'react'
import { AlertDto } from '@/lib/types'

interface IncidentPanelProps {
  alerts: AlertDto[]
  maxItems?: number
  className?: string
  onAssign?: (alertId: number, operator: string) => void
  onResolve?: (alertId: number) => void
}

const severityColors = {
  critical: {
    bg: 'bg-red-900/20',
    border: 'border-red-500',
    text: 'text-red-300',
    icon: '🔴'
  },
  high: {
    bg: 'bg-orange-900/20',
    border: 'border-orange-500',
    text: 'text-orange-300',
    icon: '🟠'
  },
  medium: {
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-500',
    text: 'text-yellow-300',
    icon: '🟡'
  },
  low: {
    bg: 'bg-blue-900/20',
    border: 'border-blue-500',
    text: 'text-blue-300',
    icon: '🔵'
  }
}

/**
 * Incident Panel - Side panel with quick actions for alerts
 * Optimized for 24/7 operator console
 */
export default function IncidentPanel({
  alerts,
  maxItems = 10,
  className = '',
  onAssign,
  onResolve
}: IncidentPanelProps) {
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null)
  const [assigningAlert, setAssigningAlert] = useState<number | null>(null)

  // Sort by severity: critical > high > medium > low
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  const displayAlerts = sortedAlerts.slice(0, maxItems)

  const getSeverityConfig = (severity: string) => {
    return severityColors[severity as keyof typeof severityColors] || severityColors.medium
  }

  const handleAssign = (alertId: number, operator: string) => {
    onAssign?.(alertId, operator)
    setAssigningAlert(null)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  if (displayAlerts.length === 0) {
    return (
      <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
        <h3 className="text-sm font-black text-white uppercase mb-4 flex items-center gap-2">
          <span className="text-lg">✅</span> Incidents Récents
        </h3>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-green-400 font-bold text-lg">Aucun incident actif</p>
          <p className="text-slate-500 text-sm mt-2">Système stable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <span className="text-lg">🚨</span> Incidents Actifs
        </h3>
        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {displayAlerts.map((alert) => {
          const config = getSeverityConfig(alert.severity)
          const isExpanded = expandedAlert === alert.id
          const isAssigning = assigningAlert === alert.id

          return (
            <div
              key={alert.id}
              className={`
                ${config.bg} border-l-4 ${config.border}
                rounded-lg p-3
                transition-all duration-200
                hover:shadow-lg cursor-pointer
              `}
              onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className="text-lg flex-shrink-0">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold uppercase ${config.text}`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-500">
                        #{alert.cellId}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white leading-tight truncate">
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatTimestamp(alert.timestamp)}
                    </p>
                  </div>
                </div>

                <button
                  className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedAlert(isExpanded ? null : alert.id)
                  }}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              </div>

              {/* Expanded Actions */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <div className="flex gap-2">
                    {isAssigning ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAssign(alert.id, 'current-user')
                          }}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-all"
                        >
                          ✓ M'assigner
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setAssigningAlert(null)
                          }}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded transition-all"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setAssigningAlert(alert.id)
                          }}
                          className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-bold rounded transition-all"
                        >
                          👤 Assigner
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onResolve?.(alert.id)
                          }}
                          className="flex-1 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 text-xs font-bold rounded transition-all"
                        >
                          ✓ Résoudre
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Navigate to cell details
                    }}
                    className="w-full px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-white text-xs font-bold rounded transition-all"
                  >
                    📍 Voir cellule #{alert.cellId}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {alerts.length > maxItems && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-xs text-center text-slate-400">
            +{alerts.length - maxItems} autres incidents
          </p>
        </div>
      )}
    </div>
  )
}
