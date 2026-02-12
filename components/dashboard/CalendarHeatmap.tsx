'use client'

import React from 'react'

interface CalendarHeatmapData {
  day: number // 0-6 (Lun-Dim)
  hour: number // 0-23
  value: number
}

interface CalendarHeatmapProps {
  data: CalendarHeatmapData[]
  className?: string
  title?: string
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

/**
 * Calendar Heatmap - Temporal heatmap showing patterns by day/hour
 * Perfect for identifying peak hours and weekly patterns
 */
export default function CalendarHeatmap({
  data,
  className = '',
  title = 'Carte Thermique Temporelle'
}: CalendarHeatmapProps) {
  // Create matrix
  const matrix: number[][] = Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => 0)
  )

  // Fill matrix with data
  data.forEach(({ day, hour, value }) => {
    if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
      matrix[day][hour] = value
    }
  })

  // Find min/max for color scaling
  const values = data.map(d => d.value)
  const maxValue = Math.max(...values, 1)

  // Get color for value
  const getColor = (value: number) => {
    if (value === 0) return 'bg-slate-900/50'
    
    const intensity = value / maxValue
    if (intensity > 0.75) return 'bg-red-500'
    if (intensity > 0.5) return 'bg-orange-500'
    if (intensity > 0.25) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getShadow = (value: number) => {
    const intensity = value / maxValue
    if (intensity > 0.75) return 'shadow-red-500/50'
    if (intensity > 0.5) return 'shadow-orange-500/50'
    if (intensity > 0.25) return 'shadow-yellow-500/50'
    return 'shadow-blue-500/50'
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <span className="text-lg">🗓️</span> {title}
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Intensité:</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div className="w-4 h-4 bg-red-500 rounded"></div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-16"></div>
            <div className="flex-1 flex justify-around">
              {[0, 6, 12, 18, 23].map(hour => (
                <div key={hour} className="text-xs text-slate-500 font-medium">
                  {hour}h
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap grid */}
          {DAYS.map((day, dayIndex) => (
            <div key={dayIndex} className="flex items-center mb-1">
              {/* Day label */}
              <div className="w-16 text-xs text-slate-400 font-medium">
                {day}
              </div>

              {/* Hour cells */}
              <div className="flex-1 flex gap-1">
                {HOURS.map(hour => {
                  const value = matrix[dayIndex][hour]
                  const color = getColor(value)
                  const shadow = getShadow(value)

                  return (
                    <div
                      key={hour}
                      className="group relative flex-1"
                      style={{ minWidth: '12px', maxWidth: '40px' }}
                    >
                      <div
                        className={`
                          ${color} ${value > 0 ? shadow : ''}
                          aspect-square rounded-sm
                          transition-all duration-200
                          hover:scale-110 hover:shadow-lg
                          cursor-pointer
                        `}
                      />

                      {/* Tooltip */}
                      {value > 0 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="bg-slate-950 border border-white/20 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                            <p className="text-xs text-white font-bold">
                              {day} {hour}:00
                            </p>
                            <p className="text-xs text-slate-400">
                              Charge: {value.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Période de pointe</p>
          <p className="text-sm font-bold text-white">18h-20h</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Jour le plus chargé</p>
          <p className="text-sm font-bold text-white">Vendredi</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Période creuse</p>
          <p className="text-sm font-bold text-white">3h-5h</p>
        </div>
      </div>
    </div>
  )
}
