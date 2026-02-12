'use client'

import React from 'react'

interface LoadDistributionHistogramProps {
  data: number[]
  bucketSize?: number
  className?: string
  title?: string
  unit?: string
}

/**
 * Load Distribution Histogram - Shows distribution of cell loads
 * Perfect for understanding network capacity and congestion patterns
 */
export default function LoadDistributionHistogram({
  data,
  bucketSize = 10,
  className = '',
  title = 'Distribution des Charges',
  unit = '%'
}: LoadDistributionHistogramProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
        <h3 className="text-sm font-black text-white uppercase mb-4">
          {title}
        </h3>
        <p className="text-center text-slate-400 py-8">Aucune donnée disponible</p>
      </div>
    )
  }

  // Create buckets
  const maxValue = Math.max(...data)
  const numBuckets = Math.ceil(maxValue / bucketSize)
  const buckets = Array.from({ length: numBuckets }, () => 0)

  // Fill buckets
  data.forEach(value => {
    const bucketIndex = Math.min(Math.floor(value / bucketSize), numBuckets - 1)
    buckets[bucketIndex]++
  })

  const maxCount = Math.max(...buckets)

  // Determine color based on load level
  const getColorForBucket = (index: number) => {
    const midpoint = index * bucketSize
    if (midpoint >= 90) return { bg: 'bg-red-500', shadow: 'shadow-red-500/50' }
    if (midpoint >= 70) return { bg: 'bg-orange-500', shadow: 'shadow-orange-500/50' }
    if (midpoint >= 50) return { bg: 'bg-yellow-500', shadow: 'shadow-yellow-500/50' }
    return { bg: 'bg-green-500', shadow: 'shadow-green-500/50' }
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <span className="text-lg">📊</span> {title}
        </h3>
        <div className="text-xs text-slate-400">
          Total: {data.length} cellules
        </div>
      </div>

      {/* Histogram */}
      <div className="relative h-64 flex items-end gap-1">
        {buckets.map((count, index) => {
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0
          const rangeStart = index * bucketSize
          const rangeEnd = (index + 1) * bucketSize
          const colors = getColorForBucket(index)

          return (
            <div
              key={index}
              className="flex-1 group relative"
            >
              {/* Bar */}
              <div
                className={`
                  ${colors.bg} ${colors.shadow}
                  rounded-t-lg shadow-lg
                  transition-all duration-300
                  hover:opacity-80
                  cursor-pointer
                `}
                style={{ height: `${height}%` }}
              />

              {/* Tooltip */}
              {count > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-slate-950 border border-white/20 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                    <p className="text-xs text-white font-bold">
                      {rangeStart}-{rangeEnd}{unit}
                    </p>
                    <p className="text-xs text-slate-400">
                      {count} cellule{count > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-slate-500">
                      {((count / data.length) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Label */}
              <div className="text-center mt-2">
                <p className="text-xs text-slate-500 font-medium">
                  {rangeStart}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span className="text-slate-400">Normal (&lt;50%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
          <span className="text-slate-400">Modéré (50-70%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
          <span className="text-slate-400">Élevé (70-90%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span className="text-slate-400">Critique (&gt;90%)</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="text-center">
          <p className="text-xs text-slate-500">Moyenne</p>
          <p className="text-lg font-bold text-white">
            {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)}{unit}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Médiane</p>
          <p className="text-lg font-bold text-white">
            {[...data].sort((a, b) => a - b)[Math.floor(data.length / 2)].toFixed(1)}{unit}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Min</p>
          <p className="text-lg font-bold text-green-400">
            {Math.min(...data).toFixed(1)}{unit}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Max</p>
          <p className="text-lg font-bold text-red-400">
            {Math.max(...data).toFixed(1)}{unit}
          </p>
        </div>
      </div>
    </div>
  )
}
