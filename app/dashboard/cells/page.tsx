'use client'

import { useTopCells } from '@/lib/hooks'
import Link from 'next/link'
import { useState } from 'react'
import { DEFAULT_HOUR_ISO } from '@/lib/time'

export default function CellsPage() {
  const [timestamp] = useState(DEFAULT_HOUR_ISO)

  const { data: topCells, isLoading } = useQuery({
    queryKey: ['top-cells', timestamp],
    queryFn: () => api.getTopCells(timestamp, 50)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Cell Analytics</h1>
        <p className="text-slate-400 mt-2">Detailed performance metrics for all network cells</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Cells</h3>
          <p className="text-3xl font-bold text-slate-100">250</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Active Cells</h3>
          <p className="text-3xl font-bold text-green-400">247</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Overloaded</h3>
          <p className="text-3xl font-bold text-orange-400">12</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Offline</h3>
          <p className="text-3xl font-bold text-red-400">3</p>
        </div>
      </div>

      {/* Cells table */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">Top Performing Cells</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Cell ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {topCells?.map((cell, index) => (
                  <tr key={cell.cellId} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-slate-200">
                          {cell.cellId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-400">
                        {cell.totalActivity.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        index < 5 ? 'bg-red-500/20 text-red-400' :
                        index < 15 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {index < 5 ? 'High Load' : index < 15 ? 'Normal' : 'Low Load'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/dashboard/cell/${cell.cellId}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
