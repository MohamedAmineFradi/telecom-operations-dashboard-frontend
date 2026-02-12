'use client'

import React from 'react'

interface SparklineChartProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  fillColor?: string
  className?: string
  showArea?: boolean
}

/**
 * Sparkline Chart - Mini line chart for trends
 * Displays a small inline chart without axes or labels
 */
export default function SparklineChart({
  data,
  width = 80,
  height = 24,
  color = '#3b82f6',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  className = '',
  showArea = true
}: SparklineChartProps) {
  if (!data || data.length === 0) {
    return <div className={`inline-block ${className}`} style={{ width, height }} />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Generate SVG path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return { x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ')

  const areaPath = showArea
    ? `${linePath} L ${width},${height} L 0,${height} Z`
    : ''

  return (
    <svg
      width={width}
      height={height}
      className={`inline-block ${className}`}
      style={{ verticalAlign: 'middle' }}
    >
      {showArea && (
        <path
          d={areaPath}
          fill={fillColor}
          stroke="none"
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
