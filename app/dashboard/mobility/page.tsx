'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function MobilityPage() {
  const { data: flows, isLoading } = useQuery({
    queryKey: ['mobility'],
    queryFn: () => api.getMobilityFlows()
  })

  // Calculate statistics
  const totalFlows = flows?.reduce((sum, f) => sum + f.flow, 0) || 0
  const avgFlow = flows?.length ? totalFlows / flows.length : 0
  const topFlows = [...(flows || [])].sort((a, b) => b.flow - a.flow).slice(0, 20)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Mobility Patterns</h1>
        <p className="text-slate-400 mt-2">User movement flows between network cells</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Flows</h3>
          <p className="text-3xl font-bold text-slate-100">{flows?.length || 0}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Movement</h3>
          <p className="text-3xl font-bold text-blue-400">{totalFlows.toFixed(0)}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Avg Flow</h3>
          <p className="text-3xl font-bold text-purple-400">{avgFlow.toFixed(1)}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Peak Flow</h3>
          <p className="text-3xl font-bold text-orange-400">{topFlows[0]?.flow.toFixed(0) || 0}</p>
        </div>
      </div>

      {/* Flow visualization */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Flow Visualization</h2>
        <div className="h-96 bg-slate-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 mb-2">Mobility flow visualization</p>
            <p className="text-xs text-slate-600">Sankey diagram or network graph (D3.js/Recharts)</p>
          </div>
        </div>
      </div>

      {/* Top flows table */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">Top Mobility Flows</h2>
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
                    From Cell
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                    →
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    To Cell
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Flow Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Intensity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {topFlows.map((flow, index) => (
                  <tr key={`${flow.fromCellId}-${flow.toCellId}`} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-200">
                        Cell {flow.fromCellId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-blue-400">→</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-200">
                        Cell {flow.toCellId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-400">
                        {flow.flow.toFixed(0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (flow.flow / topFlows[0].flow) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400">
                          {((flow.flow / topFlows[0].flow) * 100).toFixed(0)}%
                        </span>
                      </div>
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
