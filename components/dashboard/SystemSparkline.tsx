'use client'

import React, { useEffect, useRef } from 'react'

interface SystemSparklineProps {
  data: number[]
  label: string
  unit: string
  threshold?: number
  color?: string
  className?: string
}

/**
 * System Sparkline - Mini real-time chart for CPU/Memory metrics
 */
export default function SystemSparkline({
  data,
  label,
  unit,
  threshold = 80,
  color = '#3b82f6',
  className = ''
}: SystemSparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const max = Math.max(...data, threshold)
    const points = data.slice(-50) // Last 50 points

    ctx.clearRect(0, 0, width, height)

    // Draw threshold line
    const thresholdY = height - (threshold / max) * height
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, thresholdY)
    ctx.lineTo(width, thresholdY)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw area under curve
    ctx.fillStyle = `${color}20`
    ctx.beginPath()
    ctx.moveTo(0, height)
    points.forEach((value, i) => {
      const x = (i / (points.length - 1)) * width
      const y = height - (value / max) * height
      ctx.lineTo(x, y)
    })
    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    points.forEach((value, i) => {
      const x = (i / (points.length - 1)) * width
      const y = height - (value / max) * height
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
  }, [data, threshold, color])

  const currentValue = data[data.length - 1] || 0
  const isOverThreshold = currentValue >= threshold

  return (
    <div className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
        <span className={`text-lg font-black ${
          isOverThreshold ? 'text-red-400 animate-pulse' : 'text-blue-400'
        }`}>
          {currentValue.toFixed(1)}{unit}
        </span>
      </div>
      
      <canvas
        ref={canvasRef}
        width={300}
        height={60}
        className="w-full h-15"
      />
      
      <div className="flex items-center justify-between mt-2 text-xs">
        <span className="text-slate-500">
          Seuil: {threshold}{unit}
        </span>
        <span className={`font-bold ${
          isOverThreshold ? 'text-red-400' : 'text-green-400'
        }`}>
          {isOverThreshold ? '⚠ Au-dessus' : '✓ Normal'}
        </span>
      </div>
    </div>
  )
}
