'use client'

import React from 'react'
import { GaugeChart } from '@/components/ui'

interface SlaMetric {
  name: string
  current: number
  target: number
  unit: string
  icon: string
}

interface SlaGaugesProps {
  metrics: SlaMetric[]
  className?: string
}

/**
 * SLA Gauges - Multiple gauge displays for Service Level Agreement tracking
 * Shows current performance vs targets with visual indicators
 */
export default function SlaGauges({
  metrics,
  className = ''
}: SlaGaugesProps) {
  const getStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 95) return { color: 'text-green-400', label: 'Excellent', icon: '🟢' }
    if (percentage >= 85) return { color: 'text-yellow-400', label: 'Acceptable', icon: '🟡' }
    return { color: 'text-red-400', label: 'Critique', icon: '🔴' }
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <h3 className="text-sm font-black text-white uppercase mb-6 flex items-center gap-2">
        <span className="text-lg">🎯</span> Objectifs SLA
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const percentage = (metric.current / metric.target) * 100
          const status = getStatus(metric.current, metric.target)

          return (
            <div
              key={index}
              className="bg-slate-900/50 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:shadow-lg transition-all duration-200"
            >
              {/* Icon and status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{metric.icon}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{status.icon}</span>
                  <span className={`text-xs font-bold ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Metric name */}
              <h4 className="text-xs font-bold text-white uppercase mb-4">
                {metric.name}
              </h4>

              {/* Gauge */}
              <div className="flex justify-center mb-4">
                <GaugeChart
                  value={percentage}
                  size={100}
                  strokeWidth={8}
                />
              </div>

              {/* Values */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Actuel:</span>
                  <span className="text-white font-bold">
                    {metric.current.toFixed(1)}{metric.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Objectif:</span>
                  <span className="text-blue-400 font-bold">
                    {metric.target.toFixed(1)}{metric.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-slate-400">Écart:</span>
                  <span className={`font-bold ${
                    metric.current >= metric.target ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.current >= metric.target ? '+' : ''}
                    {(metric.current - metric.target).toFixed(1)}{metric.unit}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
