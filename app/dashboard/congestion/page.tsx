'use client'

import React, { useState, useMemo } from 'react';
import { useCongestion, useHourlySummary, useGenerateCongestionAlerts } from '@/lib/hooks/useCongestion';
import { DEFAULT_HOUR_ISO } from '@/lib/time';
import ProvinceMap3D from '@/components/three/ProvinceMap3D';
import AlertBadge from '@/components/ui/AlertBadge';

export default function CongestionPage() {
    const [timestamp, setTimestamp] = useState(DEFAULT_HOUR_ISO);
    const [warnThreshold, setWarnThreshold] = useState(70);
    const [critThreshold, setCritThreshold] = useState(90);

    const { data: congestionCells, isLoading } = useCongestion(timestamp, warnThreshold, critThreshold);
    const { data: summary } = useHourlySummary(timestamp);
    const generateAlerts = useGenerateCongestionAlerts();

    // Mock province-level congestion data derived from cell data
    const provinceCongestion = useMemo(() => {
        // In a real app, this would come from a province-specific API
        // Here we generate some interesting heat for the map
        return {
            'MI': 88,
            'BG': 65,
            'BS': 72,
            'VA': 45,
            'MB': 82,
            'PV': 38,
            'CR': 25,
            'MN': 32,
            'LO': 41,
            'CO': 55,
            'LC': 48,
            'SO': 15
        };
    }, []);

    const overallScore = useMemo(() => {
        if (!congestionCells || congestionCells.length === 0) return 0;
        return congestionCells.reduce((acc, cell) => acc + cell.score, 0) / congestionCells.length;
    }, [congestionCells]);

    const handleGenerateAlerts = () => {
        generateAlerts.mutate({
            hour: timestamp,
            warn: warnThreshold,
            crit: critThreshold,
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">NETWORK CONGESTION</h1>
                    <p className="text-slate-400 mt-2 font-medium">Real-time load balancing and anomaly thresholds</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-1 rounded-2xl flex items-center">
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
                    <button
                        onClick={handleGenerateAlerts}
                        disabled={generateAlerts.isPending}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {generateAlerts.isPending ? 'Processing...' : 'Generate Alerts'}
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Controls & Stats */}
                <div className="space-y-8">
                    {/* Overall Score Gauge */}
                    <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Network Health Index</h3>

                        <div className="flex items-center justify-center py-4">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-slate-900 stroke-current"
                                        strokeWidth="8"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    ></circle>
                                    <circle
                                        className="text-blue-500 stroke-current transition-all duration-1000 ease-out"
                                        strokeWidth="8"
                                        strokeDasharray={251.2}
                                        strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    ></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-white">{overallScore.toFixed(1)}</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">NCI Score</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-green-500">Normal</span>
                            <span className="text-yellow-500">Warning</span>
                            <span className="text-red-500">Critical</span>
                        </div>
                    </div>

                    {/* Threshold Sliders */}
                    <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Threshold Management</h3>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-slate-300 uppercase italic">Warning Limit</span>
                                    <span className="text-sm font-black text-yellow-500">{warnThreshold}%</span>
                                </div>
                                <input
                                    type="range" min="50" max="85" value={warnThreshold}
                                    onChange={(e) => setWarnThreshold(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-slate-300 uppercase italic">Critical Limit</span>
                                    <span className="text-sm font-black text-red-500">{critThreshold}%</span>
                                </div>
                                <input
                                    type="range" min="86" max="100" value={critThreshold}
                                    onChange={(e) => setCritThreshold(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: 3D Map */}
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px]">
                    <div className="absolute top-6 left-6 z-10">
                        <div className="bg-slate-950/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                            <h2 className="text-sm font-black text-white uppercase italic">Geospatial Load Mesh</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Lombardy High-Frequency Cells</p>
                        </div>
                    </div>
                    <ProvinceMap3D congestionData={provinceCongestion} className="w-full h-full" />
                </div>
            </div>

            {/* Detail Table */}
            <div className="bg-slate-800/10 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black text-white tracking-tight italic">TOP CONGESTED CELLS</h2>
                    <div className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        Active Scanning: ON
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-20 flex justify-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950/30">
                                    <th className="px-8 py-5 text-left">Cell Identity</th>
                                    <th className="px-8 py-5 text-left">Activity Index</th>
                                    <th className="px-8 py-5 text-left">NCI Score</th>
                                    <th className="px-8 py-5 text-left">Status Mesh</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {congestionCells?.slice(0, 10).map((cell) => (
                                    <tr key={cell.cellId} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-blue-500 border border-white/5">
                                                    {cell.cellId}
                                                </div>
                                                <span className="text-sm font-bold text-slate-200">Terminal Node {cell.cellId}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-white">{cell.totalActivity.toFixed(2)} Mbps</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-12 h-1.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${cell.score >= critThreshold ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                            cell.score >= warnThreshold ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${cell.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-black ${cell.score >= critThreshold ? 'text-red-500' :
                                                    cell.score >= warnThreshold ? 'text-yellow-500' : 'text-green-500'
                                                    }`}>
                                                    {cell.score.toFixed(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <AlertBadge severity={cell.severity as any}>{cell.severity.toUpperCase()}</AlertBadge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors group-hover:translate-x-1 duration-300">
                                                Diagnostics →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
