'use client'

import React from 'react'
import { SparklineChart } from '@/components/ui'

interface ExecutiveKpiCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: number
  trendLabel?: string
  sparklineData?: number[]
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'purple'
  icon?: string
  className?: string
}

const colorConfig = {
  green: {
    gradient: 'from-green-900/20 to-green-900/5',
    border: 'border-green-500/20 hover:border-green-500/40',
    text: 'text-green-500',
    badge: 'bg-green-500/20 text-green-400',
    sparkline: '#10b981'
  },
  blue: {
    gradient: 'from-blue-900/20 to-blue-900/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    text: 'text-blue-500',
    badge: 'bg-blue-500/20 text-blue-400',
    sparkline: '#3b82f6'
  },
  red: {
    gradient: 'from-red-900/20 to-red-900/5',
    border: 'border-red-500/20 hover:border-red-500/40',
    text: 'text-red-500',
    badge: 'bg-red-500/20 text-red-400',
    sparkline: '#ef4444'
  },
  yellow: {
    gradient: 'from-yellow-900/20 to-yellow-900/5',
    border: 'border-yellow-500/20 hover:border-yellow-500/40',
    text: 'text-yellow-500',
    badge: 'bg-yellow-500/20 text-yellow-400',
    sparkline: '#eab308'
  },
  purple: {
    gradient: 'from-purple-900/20 to-purple-900/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    text: 'text-purple-500',
    badge: 'bg-purple-500/20 text-purple-400',
    sparkline: '#a855f7'
  }
}

/**
 * Executive KPI Card with sparkline and trend indicator
 * Optimized for director/executive dashboards
 */
export default function ExecutiveKpiCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  sparklineData,
  color = 'blue',
  icon,
  className = ''
}: ExecutiveKpiCardProps) {
  const config = colorConfig[color]
  const isPositiveTrend = trend !== undefined && trend >= 0

  return (
    <div
      className={`
        bg-gradient-to-br ${config.gradient}
        border ${config.border}
        rounded-2xl p-6
        transition-all duration-300
        hover:scale-105 hover:shadow-lg
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
          {title}
        </p>
        {icon && (
          <span className="text-2xl opacity-50">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className={`text-5xl font-black ${config.text} leading-none`}>
          {value}
        </span>
        {unit && (
          <span className="text-lg text-slate-500 font-medium">
            {unit}
          </span>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mb-3">
          <SparklineChart
            data={sparklineData}
            width={180}
            height={32}
            color={config.sparkline}
            fillColor={`${config.sparkline}20`}
            showArea={true}
          />
        </div>
      )}

      {/* Trend Badge */}
      {trend !== undefined && (
        <div className="flex items-center gap-2">
          <span
            className={`
              px-2 py-1 rounded-full text-xs font-bold
              ${isPositiveTrend ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
            `}
          >
            {isPositiveTrend ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-slate-500">
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
