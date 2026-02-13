'use client'

import React from 'react'
import { SparklineChart } from '@/components/ui'

interface CellData {
  cellId: number
  values: number[]
  label?: string
}

interface SmallMultiplesChartProps {
  data: CellData[]
  maxItems?: number
  className?: string
  onCellClick?: (cellId: number) => void
}

/**
 * Small Multiples Chart - Grid of mini charts for comparing multiple cells
 * Perfect for performance analysis and trends comparison
 */
export default function SmallMultiplesChart({
  data,
  maxItems = 12,
  className = '',
  onCellClick
}: SmallMultiplesChartProps) {
  // Handle undefined or null data
  const safeData = data || []
  const displayData = safeData.slice(0, maxItems)

  // Calculate statistics for each cell
  const getCellStats = (values: number[]) => {
    const max = Math.max(...values)
    const min = Math.min(...values)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const latest = values[values.length - 1]
    const trend = latest - values[0]

    return { max, min, avg, latest, trend }
  }

  const getColorForTrend = (trend: number) => {
    if (trend > 0) return '#ef4444' // Red for increasing load
    if (trend < 0) return '#10b981' // Green for decreasing load
    return '#3b82f6' // Blue for stable
  }

  if (displayData.length === 0) {
    return (
      <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
        <p className="text-center text-slate-400">Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <h3 className="text-sm font-black text-white uppercase mb-4 flex items-center gap-2">
        <span className="text-lg">📊</span> Comparaison Multi-Cellules
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayData.map((cell) => {
          const stats = getCellStats(cell.values)
          const color = getColorForTrend(stats.trend)

          return (
            <div
              key={cell.cellId}
              onClick={() => onCellClick?.(cell.cellId)}
              className="bg-slate-900/50 border border-white/5 rounded-xl p-3 transition-all duration-200 hover:border-blue-500/30 hover:shadow-lg cursor-pointer group"
            >
              {/* Cell ID */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">
                  #{cell.cellId}
                </span>
                <span className={`text-xs font-bold ${stats.trend > 0 ? 'text-red-400' : stats.trend < 0 ? 'text-green-400' : 'text-blue-400'}`}>
                  {stats.trend > 0 ? '↗' : stats.trend < 0 ? '↘' : '→'}
                </span>
              </div>

              {/* Sparkline */}
              <div className="mb-2">
                <SparklineChart
                  data={cell.values}
                  width={120}
                  height={40}
                  color={color}
                  fillColor={`${color}20`}
                  showArea={true}
                />
              </div>

              {/* Stats */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Actuel:</span>
                  <span className="font-bold text-white">
                    {stats.latest.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Moy:</span>
                  <span className="text-slate-400">
                    {stats.avg.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Max:</span>
                  <span className="text-slate-400">
                    {stats.max.toFixed(1)}
                  </span>
                </div>
              </div>

              {cell.label && (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-slate-500 truncate">
                    {cell.label}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {data.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-slate-400">
            +{data.length - maxItems} cellules supplémentaires
          </p>
        </div>
      )}
    </div>
  )
}
