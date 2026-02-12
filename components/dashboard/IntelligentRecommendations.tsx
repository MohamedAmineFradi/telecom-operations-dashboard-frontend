'use client'

import React from 'react'

interface Recommendation {
  id: string
  type: 'critical' | 'warning' | 'optimization' | 'info'
  title: string
  description: string
  impact: string
  action?: string
  priority: number
}

interface IntelligentRecommendationsProps {
  recommendations: Recommendation[]
  className?: string
  onActionClick?: (recommendation: Recommendation) => void
}

/**
 * Intelligent Recommendations - AI-powered suggestions for network optimization
 * Analyzes patterns and suggests actionable improvements
 */
export default function IntelligentRecommendations({
  recommendations,
  className = '',
  onActionClick
}: IntelligentRecommendationsProps) {
  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'critical': return '🚨'
      case 'warning': return '⚠️'
      case 'optimization': return '⚡'
      case 'info': return '💡'
    }
  }

  const getTypeStyle = (type: Recommendation['type']) => {
    switch (type) {
      case 'critical':
        return {
          badge: 'bg-red-500/20 text-red-400 border-red-500/50',
          border: 'border-red-500/30',
          glow: 'shadow-red-500/20'
        }
      case 'warning':
        return {
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
          border: 'border-orange-500/30',
          glow: 'shadow-orange-500/20'
        }
      case 'optimization':
        return {
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
          border: 'border-blue-500/30',
          glow: 'shadow-blue-500/20'
        }
      case 'info':
        return {
          badge: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
          border: 'border-purple-500/30',
          glow: 'shadow-purple-500/20'
        }
    }
  }

  const getTypeLabel = (type: Recommendation['type']) => {
    switch (type) {
      case 'critical': return 'CRITIQUE'
      case 'warning': return 'ATTENTION'
      case 'optimization': return 'OPTIMISATION'
      case 'info': return 'INFORMATION'
    }
  }

  // Sort by priority (highest first)
  const sortedRecommendations = [...recommendations].sort((a, b) => b.priority - a.priority)

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <span className="text-lg">🤖</span> Recommandations Intelligentes
        </h3>
        <div className="text-xs text-slate-400">
          {recommendations.length} suggestion{recommendations.length > 1 ? 's' : ''}
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-slate-400 text-sm">
            Aucune recommandation pour le moment
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Le réseau fonctionne de manière optimale
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {sortedRecommendations.map((rec) => {
            const styles = getTypeStyle(rec.type)
            const icon = getIcon(rec.type)
            const label = getTypeLabel(rec.type)

            return (
              <div
                key={rec.id}
                className={`
                  bg-slate-900/50 border ${styles.border} ${styles.glow}
                  rounded-xl p-4
                  hover:bg-slate-900/70 transition-all duration-200
                  shadow-lg
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          px-2 py-0.5 rounded text-[10px] font-black uppercase
                          border ${styles.badge}
                        `}>
                          {label}
                        </span>
                        <span className="text-xs text-slate-500">
                          Priorité: {rec.priority}/10
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {rec.title}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-3 ml-11">
                  {rec.description}
                </p>

                {/* Impact */}
                <div className="bg-slate-950/50 border border-white/5 rounded-lg p-2 mb-3 ml-11">
                  <p className="text-xs text-slate-500 mb-1">Impact estimé:</p>
                  <p className="text-xs text-white font-medium">{rec.impact}</p>
                </div>

                {/* Action button */}
                {rec.action && (
                  <div className="ml-11">
                    <button
                      onClick={() => onActionClick?.(rec)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                    >
                      {rec.action}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Summary */}
      {recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-red-400">
              {recommendations.filter(r => r.type === 'critical').length}
            </p>
            <p className="text-xs text-slate-500">Critiques</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-orange-400">
              {recommendations.filter(r => r.type === 'warning').length}
            </p>
            <p className="text-xs text-slate-500">Alertes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-400">
              {recommendations.filter(r => r.type === 'optimization').length}
            </p>
            <p className="text-xs text-slate-500">Optimisations</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-purple-400">
              {recommendations.filter(r => r.type === 'info').length}
            </p>
            <p className="text-xs text-slate-500">Infos</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  )
}
