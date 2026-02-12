'use client'

import React, { useMemo } from 'react'

interface TimelineDataPoint {
  timestamp: Date
  count: number
  severity: 'critical' | 'high' | 'medium' | 'low'
}

interface AlertTimelineProps {
  data: TimelineDataPoint[]
  durationMinutes?: number
  className?: string
}

/**
 * Alert Timeline - Visual timeline of alerts over the last N minutes
 * Shows alert frequency and severity distribution
 */
export default function AlertTimeline({
  data,
  durationMinutes = 30,
  className = ''
}: AlertTimelineProps) {
  // Group data into 1-minute buckets
  const buckets = useMemo(() => {
    const now = new Date()
    const bucketArray: { timestamp: Date; critical: number; high: number; medium: number; low: number }[] = []

    for (let i = durationMinutes - 1; i >= 0; i--) {
      const bucketTime = new Date(now.getTime() - i * 60 * 1000)
      bucketArray.push({
        timestamp: bucketTime,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      })
    }

    // Fill buckets with data
    data.forEach(point => {
      const minutesAgo = Math.floor((now.getTime() - point.timestamp.getTime()) / 60000)
      if (minutesAgo >= 0 && minutesAgo < durationMinutes) {
        const bucket = bucketArray[durationMinutes - 1 - minutesAgo]
        if (bucket) {
          bucket[point.severity] += point.count
        }
      }
    })

    return bucketArray
  }, [data, durationMinutes])

  const maxCount = Math.max(...buckets.map(b => b.critical + b.high + b.medium + b.low), 1)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <span className="text-lg">⏱️</span> Timeline {durationMinutes} Dernières Minutes
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span className="text-slate-400">Critique</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <span className="text-slate-400">Haute</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
            <span className="text-slate-400">Moyenne</span>
          </div>
        </div>
      </div>

      <div className="relative h-24 flex items-end gap-px">
        {buckets.map((bucket, index) => {
          const total = bucket.critical + bucket.high + bucket.medium + bucket.low
          const height = (total / maxCount) * 100

          // Calculate proportions for stacked bar
          const criticalHeight = (bucket.critical / total) * height || 0
          const highHeight = (bucket.high / total) * height || 0
          const mediumHeight = (bucket.medium / total) * height || 0

          return (
            <div
              key={index}
              className="flex-1 relative group cursor-pointer"
              style={{ minWidth: '2px' }}
            >
              <div
                className="absolute bottom-0 w-full flex flex-col-reverse rounded-t-sm overflow-hidden transition-all duration-200 hover:opacity-80"
                style={{ height: `${height}%` }}
              >
                {bucket.critical > 0 && (
                  <div
                    className="bg-red-500 shadow-lg shadow-red-500/50"
                    style={{ height: `${criticalHeight}%` }}
                  />
                )}
                {bucket.high > 0 && (
                  <div
                    className="bg-orange-500 shadow-lg shadow-orange-500/30"
                    style={{ height: `${highHeight}%` }}
                  />
                )}
                {bucket.medium > 0 && (
                  <div
                    className="bg-yellow-500 shadow-lg shadow-yellow-500/20"
                    style={{ height: `${mediumHeight}%` }}
                  />
                )}
              </div>

              {/* Tooltip */}
              {total > 0 && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-slate-950 border border-white/20 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                    <p className="text-xs text-white font-bold mb-1">
                      {formatTime(bucket.timestamp)}
                    </p>
                    {bucket.critical > 0 && (
                      <p className="text-xs text-red-400">🔴 {bucket.critical}</p>
                    )}
                    {bucket.high > 0 && (
                      <p className="text-xs text-orange-400">🟠 {bucket.high}</p>
                    )}
                    {bucket.medium > 0 && (
                      <p className="text-xs text-yellow-400">🟡 {bucket.medium}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>-{durationMinutes}m</span>
        <span>-{Math.floor(durationMinutes / 2)}m</span>
        <span>Maintenant</span>
      </div>
    </div>
  )
}
