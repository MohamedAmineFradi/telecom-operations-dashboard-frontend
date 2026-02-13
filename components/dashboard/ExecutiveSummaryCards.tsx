'use client'

import React from 'react'
import { SparklineChart } from '@/components/ui'

interface KpiData {
  label: string
  value: number
  unit: string
  target?: number
  trend: number[]
  status: 'good' | 'warning' | 'bad'
  change: number
  icon: string
}

interface ExecutiveSummaryCardsProps {
  kpis: KpiData[]
  className?: string
}

/**
 * Executive Summary Cards - Large format KPI cards for operations managers
 * Designed for high-level overview with clear status indicators
 */
export default function ExecutiveSummaryCards({
  kpis,
  className = ''
}: ExecutiveSummaryCardsProps) {
  const getStatusColor = (status: KpiData['status']) => {
    switch (status) {
      case 'good': return {
        bg: 'from-green-600/20 to-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        glow: 'shadow-green-500/20'
      }
      case 'warning': return {
        bg: 'from-orange-600/20 to-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        glow: 'shadow-orange-500/20'
      }
      case 'bad': return {
        bg: 'from-red-600/20 to-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        glow: 'shadow-red-500/20'
      }
    }
  }

  const getStatusIcon = (status: KpiData['status']) => {
    switch (status) {
      case 'good': return '✅'
      case 'warning': return '⚠️'
      case 'bad': return '🚨'
    }
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
      {kpis.map((kpi, index) => {
        const colors = getStatusColor(kpi.status)
        const statusIcon = getStatusIcon(kpi.status)
        const changeDirection = kpi.change >= 0 ? '↗' : '↘'
        const changeColor = kpi.change >= 0 ? 'text-green-400' : 'text-red-400'

        return (
          <div
            key={index}
            className={`
              relative bg-gradient-to-br ${colors.bg}
              border ${colors.border} ${colors.glow}
              rounded-2xl p-6
              hover:scale-[1.02] transition-all duration-300
              shadow-xl
            `}
          >
            {/* Status badge */}
            <div className="absolute top-4 right-4 text-2xl">
              {statusIcon}
            </div>

            {/* Icon */}
            <div className="text-4xl mb-4">{kpi.icon}</div>

            {/* Label */}
            <h3 className="text-sm font-black text-white uppercase mb-2">
              {kpi.label}
            </h3>

            {/* Value */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-4xl font-black ${colors.text}`}>
                {kpi.value}
              </span>
              <span className="text-xl text-slate-400 font-medium">
                {kpi.unit}
              </span>
            </div>

            {/* Target (if exists) */}
            {kpi.target !== undefined && (
              <div className="mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Objectif:</span>
                  <span className="text-white font-bold">{kpi.target}{kpi.unit}</span>
                </div>
                <div className="mt-2 h-2 bg-slate-900/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      kpi.status === 'good' 
                        ? 'from-green-500 to-green-400' 
                        : kpi.status === 'warning'
                        ? 'from-orange-500 to-orange-400'
                        : 'from-red-500 to-red-400'
                    }`}
                    style={{
                      width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Change indicator */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">Évolution 7j:</span>
              <span className={`text-sm font-bold ${changeColor}`}>
                {changeDirection} {Math.abs(kpi.change).toFixed(1)}%
              </span>
            </div>

            {/* Sparkline */}
            <div className="bg-slate-900/50 rounded-lg p-3">
              <SparklineChart
                data={kpi.trend}
                width={200}
                height={40}
                color={colors.text.replace('text-', '')}
                showArea
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
