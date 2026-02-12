'use client'

import React from 'react'

interface DataPoint {
  x: number // Load (%)
  y: number // Users count
  cellId: string
  label?: string
}

interface CorrelationChartProps {
  data: DataPoint[]
  xLabel?: string
  yLabel?: string
  className?: string
  onPointClick?: (cellId: string) => void
}

/**
 * Correlation Chart - Scatter plot showing correlation between two metrics
 * Shows relationship between cell load and number of users
 */
export default function CorrelationChart({
  data,
  xLabel = 'Charge (%)',
  yLabel = 'Nombre d\'utilisateurs',
  className = '',
  onPointClick
}: CorrelationChartProps) {
  if (data.length === 0) {
    return (
      <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
        <h3 className="text-sm font-black text-white uppercase mb-4">
          Graphe de Corrélation
        </h3>
        <div className="text-center py-8 text-slate-400 text-sm">
          Aucune donnée disponible
        </div>
      </div>
    )
  }

  const padding = { top: 20, right: 20, bottom: 50, left: 60 }
  const width = 600
  const height = 400
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const maxX = Math.max(...data.map(d => d.x), 100)
  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))

  const xScale = (value: number) => (value / maxX) * chartWidth
  const yScale = (value: number) => chartHeight - ((value - minY) / (maxY - minY)) * chartHeight

  // Calculate linear regression
  const n = data.length
  const sumX = data.reduce((sum, d) => sum + d.x, 0)
  const sumY = data.reduce((sum, d) => sum + d.y, 0)
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0)
  const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Correlation coefficient
  const meanX = sumX / n
  const meanY = sumY / n
  const ssX = data.reduce((sum, d) => sum + Math.pow(d.x - meanX, 2), 0)
  const ssY = data.reduce((sum, d) => sum + Math.pow(d.y - meanY, 2), 0)
  const ssXY = data.reduce((sum, d) => sum + (d.x - meanX) * (d.y - meanY), 0)
  const correlation = ssXY / Math.sqrt(ssX * ssY)

  // Trend line points
  const trendY1 = slope * 0 + intercept
  const trendY2 = slope * maxX + intercept

  const getPointColor = (x: number) => {
    if (x >= 90) return '#ef4444' // red
    if (x >= 70) return '#f59e0b' // orange
    if (x >= 50) return '#eab308' // yellow
    return '#10b981' // green
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase">
          Graphe de Corrélation
        </h3>
        <div className="text-xs bg-slate-900/50 border border-white/10 px-3 py-1.5 rounded-lg">
          <span className="text-slate-400">Corrélation: </span>
          <span className={`font-bold ${
            Math.abs(correlation) > 0.7 ? 'text-green-400' :
            Math.abs(correlation) > 0.4 ? 'text-yellow-400' :
            'text-orange-400'
          }`}>
            {correlation.toFixed(3)}
          </span>
        </div>
      </div>

      <div className="relative">
        <svg width={width} height={height} className="w-full">
          {/* Grid lines */}
          <g transform={`translate(${padding.left},${padding.top})`}>
            {/* Horizontal grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = chartHeight * t
              return (
                <line
                  key={`h-grid-${i}`}
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
              )
            })}

            {/* Vertical grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const x = chartWidth * t
              return (
                <line
                  key={`v-grid-${i}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={chartHeight}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
              )
            })}

            {/* Trend line */}
            <line
              x1={xScale(0)}
              y1={yScale(trendY1)}
              x2={xScale(maxX)}
              y2={yScale(trendY2)}
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5,5"
              opacity={0.6}
            />

            {/* Data points */}
            {data.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r={6}
                  fill={getPointColor(point.x)}
                  opacity={0.8}
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                  onClick={() => onPointClick?.(point.cellId)}
                >
                  <title>{`${point.label || point.cellId}\nCharge: ${point.x.toFixed(1)}%\nUtilisateurs: ${point.y}`}</title>
                </circle>
              </g>
            ))}

            {/* Axes */}
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
            />

            {/* X-axis labels */}
            {[0, 25, 50, 75, 100].map((value, i) => (
              <text
                key={`x-label-${i}`}
                x={xScale(value)}
                y={chartHeight + 20}
                fill="rgba(255,255,255,0.6)"
                fontSize={12}
                textAnchor="middle"
              >
                {value}
              </text>
            ))}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const value = Math.round(minY + (maxY - minY) * (1 - t))
              return (
                <text
                  key={`y-label-${i}`}
                  x={-10}
                  y={chartHeight * t + 5}
                  fill="rgba(255,255,255,0.6)"
                  fontSize={12}
                  textAnchor="end"
                >
                  {value}
                </text>
              )
            })}

            {/* Axis titles */}
            <text
              x={chartWidth / 2}
              y={chartHeight + 40}
              fill="rgba(255,255,255,0.8)"
              fontSize={14}
              textAnchor="middle"
              fontWeight="bold"
            >
              {xLabel}
            </text>
            <text
              x={-chartHeight / 2}
              y={-40}
              fill="rgba(255,255,255,0.8)"
              fontSize={14}
              textAnchor="middle"
              fontWeight="bold"
              transform={`rotate(-90, -${chartHeight / 2}, -40)`}
            >
              {yLabel}
            </text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-400">Normal (&lt;50%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-slate-400">Modéré (50-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-slate-400">Élevé (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-slate-400">Critique (&gt;90%)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="text-center">
          <p className="text-xs text-slate-500">Pente</p>
          <p className="text-sm font-bold text-white">{slope.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">R²</p>
          <p className="text-sm font-bold text-white">{(correlation * correlation).toFixed(3)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Points</p>
          <p className="text-sm font-bold text-white">{data.length}</p>
        </div>
      </div>
    </div>
  )
}
