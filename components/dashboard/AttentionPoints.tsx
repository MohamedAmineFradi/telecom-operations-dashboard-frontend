'use client'

import React from 'react'

interface AttentionPoint {
  id: number
  title: string
  severity: 'critical' | 'warning' | 'info'
  description?: string
}

interface AttentionPointsProps {
  points: AttentionPoint[]
  maxItems?: number
  className?: string
}

const severityConfig = {
  critical: {
    icon: '🔴',
    bg: 'bg-red-900/30',
    border: 'border-red-500/40',
    text: 'text-red-300',
    label: 'Critique'
  },
  warning: {
    icon: '⚠️',
    bg: 'bg-yellow-900/30',
    border: 'border-yellow-500/40',
    text: 'text-yellow-300',
    label: 'Attention'
  },
  info: {
    icon: 'ℹ️',
    bg: 'bg-blue-900/30',
    border: 'border-blue-500/40',
    text: 'text-blue-300',
    label: 'Info'
  }
}

/**
 * Attention Points Card - Critical items requiring executive attention
 */
export default function AttentionPoints({
  points,
  maxItems = 3,
  className = ''
}: AttentionPointsProps) {
  const displayPoints = points.slice(0, maxItems)

  if (displayPoints.length === 0) {
    return (
      <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
        <h3 className="text-sm font-black text-white uppercase mb-4 flex items-center gap-2">
          <span className="text-lg">✅</span> Points d'Attention
        </h3>
        <div className="text-center py-8">
          <p className="text-green-400 font-bold text-lg">✓ Aucun point critique</p>
          <p className="text-slate-500 text-xs mt-2">Tous les indicateurs sont au vert</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <h3 className="text-sm font-black text-white uppercase mb-4 flex items-center gap-2">
        <span className="text-lg">⚠️</span> Points d'Attention
      </h3>
      
      <div className="space-y-3">
        {displayPoints.map((point, index) => {
          const config = severityConfig[point.severity]
          
          return (
            <div
              key={point.id}
              className={`
                ${config.bg} border ${config.border}
                rounded-xl p-4
                transition-all duration-200
                hover:scale-102 hover:shadow-lg
                cursor-pointer
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">
                  {config.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase ${config.text}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white leading-tight mb-1">
                    {point.title}
                  </p>
                  {point.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {point.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {points.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <button className="w-full text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors">
            Voir {points.length - maxItems} autres points →
          </button>
        </div>
      )}
    </div>
  )
}
