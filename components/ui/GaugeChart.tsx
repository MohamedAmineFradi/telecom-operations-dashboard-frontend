'use client'

import React from 'react'

interface GaugeChartProps {
  value: number
  max?: number
  min?: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  label?: string
  showValue?: boolean
  className?: string
  thresholds?: {
    value: number
    color: string
  }[]
}

/**
 * Gauge Chart - Circular gauge for percentage values
 * Perfect for satisfaction scores, SLA, health metrics
 */
export default function GaugeChart({
  value,
  max = 100,
  min = 0,
  size = 120,
  strokeWidth: customStrokeWidth,
  color = '#3b82f6',
  backgroundColor = '#1e293b',
  label,
  showValue = true,
  className = '',
  thresholds = []
}: GaugeChartProps) {
  const percentage = ((value - min) / (max - min)) * 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage))
  
  // Determine color based on thresholds
  let gaugeColor = color
  if (thresholds.length > 0) {
    const sortedThresholds = [...thresholds].sort((a, b) => b.value - a.value)
    for (const threshold of sortedThresholds) {
      if (value >= threshold.value) {
        gaugeColor = threshold.color
        break
      }
    }
  }

  const strokeWidth = customStrokeWidth || size / 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clampedPercentage / 100) * circumference

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${gaugeColor}40)`
            }}
          />
        </svg>
        
        {/* Center value */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-black leading-none"
              style={{
                fontSize: size / 3.5,
                color: gaugeColor
              }}
            >
              {Math.round(value)}
            </span>
            {max !== 100 && (
              <span
                className="text-slate-500 font-medium"
                style={{ fontSize: size / 10 }}
              >
                /{max}
              </span>
            )}
          </div>
        )}
      </div>
      
      {label && (
        <span className="text-xs text-slate-400 font-medium mt-2 text-center">
          {label}
        </span>
      )}
    </div>
  )
}
