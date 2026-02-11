'use client'

import React, { useMemo } from 'react'
import { useTopCells, useAlerts, useNetworkStats } from '@/lib/hooks'
import { DEFAULT_HOUR_ISO } from '@/lib/time'
import KpiCard from '@/components/ui/KpiCard'
import ProvinceMap3D from '@/components/three/ProvinceMap3D'
import AlertBadge from '@/components/ui/AlertBadge'

export default function DashboardPage() {
  const { data: topCells, isLoading: loadingCells } = useTopCells(DEFAULT_HOUR_ISO, 10)
  const { data: alerts, isLoading: loadingAlerts } = useAlerts()
  const { data: stats } = useNetworkStats()

  // Derived KPIs
  const metrics = useMemo(() => {
    if (!topCells || topCells.length === 0) return null
    const peak = topCells[0]
    const avg = topCells.reduce((sum, c) => sum + c.totalActivity, 0) / topCells.length
    const totalData = topCells.reduce((sum, c) => sum + c.totalInternet, 0)

    return {
      peakValue: peak.totalActivity.toFixed(1),
      peakId: peak.cellId,
      avgLoad: avg.toFixed(1),
      dataVolume: (totalData / 1024).toFixed(2), // GB or Mbps unit simplification
      activeNodes: stats?.totalCells || topCells.length * 12 // Estimated
    }
  }, [topCells, stats])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Network Peak Load"
          value={metrics?.peakValue || '0.0'}
          trend={`Node ${metrics?.peakId}`}
          color="red"
        />
        <KpiCard
          title="Avg Spectral Load"
          value={metrics?.avgLoad || '0.0'}
          trend="Erlang/MHz"
          color="blue"
        />
        <KpiCard
          title="Data Throughput"
          value={metrics?.dataVolume || '0.0'}
          trend="Gb/Hour"
          color="green"
        />
        <KpiCard
          title="Active Transmitters"
          value={metrics?.activeNodes.toString() || '0'}
          trend="Global"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main 3D Viewport */}
        <div className="xl:col-span-2 relative bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[550px] group">
          <div className="absolute top-8 left-8 z-20">
            <div className="bg-slate-950/60 backdrop-blur-xl px-5 py-4 rounded-3xl border border-white/10 shadow-2xl">
              <h2 className="text-sm font-black text-white uppercase italic tracking-tighter">Live Mesh Topology</h2>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Lombardy Surveillance Grid</p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Congested</span>
                </div>
              </div>
            </div>
          </div>

          <ProvinceMap3D className="w-full h-full" />

          <div className="absolute bottom-8 right-8 z-20">
            <div className="bg-slate-950/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              NOC Render Engine v2.0 • WebGL 2.0
            </div>
          </div>
        </div>

        {/* Incidents & Activity */}
        <div className="space-y-8">
          <div className="bg-slate-800/10 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-3 py-1 bg-slate-900 rounded-full border border-white/5">
                Live Incident Log
              </h3>
              <span className="text-[10px] font-bold text-red-500 uppercase animate-pulse">Scanning...</span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[450px]">
              {loadingAlerts ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-30">
                  <div className="w-8 h-8 border-2 border-slate-700 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : alerts?.slice(0, 8).map((alert) => (
                <div key={alert.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <AlertBadge severity={alert.severity as any}>
                      {alert.severity}
                    </AlertBadge>
                    <span className="text-[9px] font-bold text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-300 line-clamp-2 leading-relaxed">
                    {alert.message}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-black text-blue-500 uppercase">Sector {alert.cellId}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Acknowledge →</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-auto w-full py-4 bg-slate-900 hover:bg-slate-800 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
              Access Security Matrix
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-4 text-slate-500">
        <div className="flex items-center space-x-4 bg-slate-900/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-widest">Cluster Status</span>
          <div className="flex space-x-1.5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-1.5 h-3 bg-blue-500/30 rounded-full border border-blue-500/20"></div>
            ))}
            <div className="w-1.5 h-3 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] rounded-full border border-red-500/20 animate-pulse"></div>
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="text-[10px] font-bold uppercase tracking-widest italic opacity-50">
          SECURE ACCESS AUTHORIZED • MILAN NOC HUB • 45.46°N 9.19°E
        </div>
      </div>
    </div>
  )
}
