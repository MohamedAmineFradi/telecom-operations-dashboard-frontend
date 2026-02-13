'use client'

import { useTopCells } from '@/lib/hooks'
import Link from 'next/link'
import { useState } from 'react'
import { DEFAULT_HOUR_ISO } from '@/lib/time'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Panel } from '@/components/ui/Panel'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'

export default function CellsPage() {
  const [timestamp] = useState(DEFAULT_HOUR_ISO)

  const { data: topCells, isLoading } = useTopCells(timestamp, 50)

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Cell Analytics"
        description="Detailed performance metrics for all network cells"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Cells" value={250} color="slate" />
        <StatCard label="Active Cells" value={247} color="green" />
        <StatCard label="Overloaded" value={12} color="orange" />
        <StatCard label="Offline" value={3} color="red" />
      </div>

      {/* Cells table */}
      <Panel padding="none" className="overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">Top Performing Cells</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="md" variant="primary" />
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
      </Panel>
    </div>
  )
}
