'use client'

import React, { useState, useMemo } from 'react';
import { useHourlyTraffic, useHourlySummary } from '@/lib/hooks';
import { DEFAULT_HOUR_ISO } from '@/lib/time';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];

export default function ServicesPage() {
    const [timestamp, setTimestamp] = useState(DEFAULT_HOUR_ISO);
    const { data: cellData, isLoading: loadingCells } = useHourlyTraffic(timestamp);
    const { data: summary, isLoading: loadingSummary } = useHourlySummary(timestamp);

    // Calculate service distribution
    const serviceDistribution = useMemo(() => {
        if (!summary) return [];
        return [
            { name: 'SMS', value: summary.totalSmsin + summary.totalSmsout, color: '#3b82f6' },
            { name: 'Voice', value: summary.totalCallin + summary.totalCallout, color: '#8b5cf6' },
            { name: 'Internet', value: summary.totalInternet, color: '#ec4899' },
        ];
    }, [summary]);

    // Top cells by Internet usage
    const topInternetCells = useMemo(() => {
        if (!cellData) return [];
        return [...cellData]
            .sort((a, b) => b.totalInternet - a.totalInternet)
            .slice(0, 8)
            .map(c => ({
                id: c.cellId.toString(),
                internet: c.totalInternet,
                sms: c.totalSmsin + c.totalSmsout,
                call: c.totalCallin + c.totalCallout
            }));
    }, [cellData]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase whitespace-nowrap">Service Intelligence</h1>
                    <p className="text-slate-400 mt-2 font-medium">Cross-protocol distribution and consumption patterns</p>
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

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Global Distribution Donut */}
                <div className="lg:col-span-1 bg-slate-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8 self-start">Network Flow Composition</h3>
                    <div className="w-full h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {serviceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Volume</span>
                            <span className="text-2xl font-black text-white">{(summary?.totalActivity || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="w-full mt-6 grid grid-cols-3 gap-4">
                        {serviceDistribution.map((s) => (
                            <div key={s.name} className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: s.color }}></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase">{s.name}</span>
                                <span className="text-xs font-bold text-white mt-1">
                                    {summary?.totalActivity ? ((s.value / summary.totalActivity) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Top Cells Stacked Bar */}
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Node Consumption Matrix</h3>
                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topInternetCells} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="id"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                                    label={{ value: 'CELL ID', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 8, fontWeight: 'black' }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                />
                                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                                <Bar dataKey="internet" name="Internet (Mbps)" stackId="a" fill="#ec4899" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="call" name="Voice (Min)" stackId="a" fill="#8b5cf6" />
                                <Bar dataKey="sms" name="SMS (Qty)" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Service Data Table */}
            <div className="bg-slate-800/10 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black text-white tracking-tight italic uppercase">Cross-Protocol Payload Table</h2>
                    <div className="flex space-x-2">
                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black rounded-full uppercase">SYNC: ACTIVE</div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-[9px] font-black rounded-full uppercase">REGION: LOMBARDY</div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-950/30">
                            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">
                                <th className="px-8 py-5">Node Identity</th>
                                <th className="px-8 py-5 text-right">SMS Payload</th>
                                <th className="px-8 py-5 text-right">Voice Payload</th>
                                <th className="px-8 py-5 text-right">Data Payload</th>
                                <th className="px-8 py-5 text-right">Aggregate Index</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {cellData?.slice(0, 15).map((cell) => (
                                <tr key={cell.cellId} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-blue-500 group-hover:scale-110 transition-transform">
                                                {cell.cellId}
                                            </div>
                                            <span className="text-sm font-bold text-slate-200">Sector {cell.cellId}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-sm font-black text-blue-400">{(cell.totalSmsin + cell.totalSmsout).toFixed(1)}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-sm font-black text-purple-400">{(cell.totalCallin + cell.totalCallout).toFixed(1)}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-sm font-black text-pink-400">{cell.totalInternet.toFixed(1)} Mb</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-white">{cell.totalActivity.toFixed(1)}</span>
                                            <div className="w-16 h-1 bg-slate-900 rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-slate-400 opacity-50 transition-all duration-1000"
                                                    style={{ width: `${Math.min(100, (cell.totalActivity / 1000) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
