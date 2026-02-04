'use client'

import type { HeatmapCell } from '@/lib/types'
import Link from 'next/link'

interface HeatmapPreviewProps {
  data: HeatmapCell[]
}

export default function HeatmapPreview({ data }: HeatmapPreviewProps) {
  // Get top 10 cells for preview
  const topCells = [...data]
    .sort((a, b) => b.totalActivity - a.totalActivity)
    .slice(0, 10)

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-200">Network Heatmap</h2>
        <Link 
          href="/dashboard/heatmap"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Full Map →
        </Link>
      </div>

      {/* Heatmap visualization placeholder */}
      <div className="h-64 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
        <div className="text-center">
          <p className="text-slate-500 mb-2">Heatmap Preview</p>
          <p className="text-xs text-slate-600">{data.length} cells loaded</p>
        </div>
      </div>

      {/* Top cells list */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Top Activity Cells</h3>
        <div className="space-y-2">
          {topCells.slice(0, 5).map((cell) => (
            <div 
              key={cell.cellId}
              className="flex items-center justify-between p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">Cell {cell.cellId}</p>
                {typeof cell.squareId === 'number' && (
                  <p className="text-xs text-slate-500">Square {cell.squareId}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-400">{cell.totalActivity.toFixed(1)}</p>
                <p className="text-xs text-slate-500">activity</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
