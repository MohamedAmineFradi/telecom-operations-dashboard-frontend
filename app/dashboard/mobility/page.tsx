'use client'

import React, { useState, useMemo } from 'react';
import { useProvinceSummaries, useMobilityFlows } from '@/lib/hooks/useMobility';
import { DEFAULT_HOUR_ISO } from '@/lib/time';
import { SURVEILLANCE_PROVINCES } from '@/lib/geo/lombardy-provinces';
import ProvinceFlowCard from '@/components/dashboard/ProvinceFlowCard';

export default function MobilityPage() {
  const [timestamp, setTimestamp] = useState(DEFAULT_HOUR_ISO);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);

  const { data: summaries, isLoading: loadingSummaries } = useProvinceSummaries(timestamp);
  const { data: detailedFlows, isLoading: loadingFlows } = useMobilityFlows(timestamp, undefined, selectedProvincia || undefined);

  // Map backend summaries to UI structure
  const provinceStats = useMemo(() => {
    return SURVEILLANCE_PROVINCES.map(p => {
      const summary = summaries?.find(s => s.provincia === p.name || s.provincia === p.id);
      return {
        ...p,
        inflow: summary?.totalProvinceToCell || 0,
        outflow: summary?.totalCellToProvince || 0,
        total: summary?.totalFlow || 0,
        // Mock congestion score for mobility context
        score: (summary?.totalFlow ? (summary.totalFlow / 5000) * 100 : Math.random() * 60)
      };
    }).sort((a, b) => b.total - a.total);
  }, [summaries]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">MOBILITY MESH</h1>
          <p className="text-slate-400 mt-2 font-medium">Interprovincial flow dynamics and transit vectors</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-1 rounded-2xl">
          <input
            type="datetime-local"
            className="px-4 py-2 bg-transparent text-slate-200 border-none focus:ring-0 text-sm font-bold"
            value={timestamp.substring(0, 16)}
            onChange={(e) => {
              const value = e.target.value;
              setTimestamp(value ? new Date(value).toISOString() : DEFAULT_HOUR_ISO);
            }}
          />
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {provinceStats.slice(0, 4).map((p) => (
          <ProvinceFlowCard
            key={p.id}
            name={p.name}
            code={p.id}
            inflow={p.inflow}
            outflow={p.outflow}
            score={p.score}
            selected={selectedProvincia === p.id}
            onClick={() => setSelectedProvincia(p.id === selectedProvincia ? null : p.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* All Provinces List */}
        <div className="xl:col-span-1 bg-slate-800/10 backdrop-blur-md border border-white/5 rounded-3xl p-8 h-fit">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-4 py-1 border-l-2 border-blue-500">Lombardy Node Indices</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {provinceStats.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProvincia(p.id === selectedProvincia ? null : p.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedProvincia === p.id
                  ? 'bg-blue-600/10 border-blue-500/30 shadow-lg'
                  : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05] hover:border-white/10'
                  }`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className={`w-2 h-2 rounded-full ${p.score > 70 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="text-xs font-black text-white">{p.name}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">{p.id} REGION</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-300">{(p.total / 1000).toFixed(1)}K</p>
                  <p className="text-[8px] font-bold text-slate-600 uppercase">VOL</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Flow Matrix/Grid */}
        <div className="xl:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-950/20">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight italic uppercase">
                {selectedProvincia ? `${selectedProvincia} Flow Diagnostics` : 'Global Flow Vectors'}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Spatial flow-to-province triangulation
              </p>
            </div>
            {selectedProvincia && (
              <button
                onClick={() => setSelectedProvincia(null)}
                className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all border border-blue-500/20"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex-1 p-8 overflow-auto">
            {loadingFlows ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                <div className="w-10 h-10 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Intercepting Data Packets</span>
              </div>
            ) : detailedFlows && detailedFlows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailedFlows.slice(0, 20).map((flow) => (
                  <div key={`${flow.cellId}-${flow.provincia}`} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-all flex justify-between items-center group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center font-black text-xs text-blue-500 border border-white/5 group-hover:scale-110 transition-transform">
                        {flow.cellId}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{flow.provincia}</p>
                        <p className="text-xs font-black text-white">INTER-LINK {flow.cellId}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center space-x-2 text-sm font-black text-white">
                        <span className="text-blue-500">↑</span>
                        <span>{flow.cellToProvince.toFixed(0)}</span>
                        <span className="text-purple-500">↓</span>
                        <span>{flow.provinceToCell.toFixed(0)}</span>
                      </div>
                      <div className="w-24 h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-70"
                          style={{ width: `${Math.min(100, (flow.totalFlow / 1000) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30 text-center">
                <div className="text-6xl text-slate-700">📡</div>
                <div>
                  <p className="text-sm font-black text-white uppercase italic">No active vectors detected</p>
                  <p className="text-xs text-slate-500 font-medium">Try selecting a different temporal slot or coordinate</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-950/40 border-t border-white/5 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">OUT-BOUND MESH</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">IN-BOUND MESH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
