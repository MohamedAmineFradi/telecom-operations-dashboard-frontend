'use client'

import React, { useMemo } from 'react';
import { useCongestion } from '@/lib/hooks/useCongestion';
import { DEFAULT_HOUR_ISO } from '@/lib/time';
import Link from 'next/link';

export default function CongestionPreviewCard() {
    const { data: congestionCells, isLoading } = useCongestion(DEFAULT_HOUR_ISO, 70, 90);

    const stats = useMemo(() => {
        if (!congestionCells || congestionCells.length === 0) {
            return {
                critical: 0,
                warning: 0,
                normal: 0,
                avgScore: 0,
                maxScore: 0,
                topCongested: null as any
            };
        }

        let critical = 0, warning = 0, normal = 0;
        let maxScore = 0;
        let topCongested: any = null;

        congestionCells.forEach(cell => {
            if (cell.score >= 90) {
                critical++;
            } else if (cell.score >= 70) {
                warning++;
            } else {
                normal++;
            }

            if (cell.score > maxScore) {
                maxScore = cell.score;
                topCongested = cell;
            }
        });

        const avgScore = congestionCells.reduce((acc, c) => acc + c.score, 0) / congestionCells.length;

        return {
            critical,
            warning,
            normal,
            avgScore: avgScore.toFixed(1),
            maxScore: maxScore.toFixed(1),
            topCongested,
            total: congestionCells.length
        };
    }, [congestionCells]);

    const healthPercentage = Math.max(0, 100 - parseFloat(stats.avgScore as any));

    return (
        <Link href="/dashboard/congestion">
            <div className="group relative bg-gradient-to-br from-slate-800/40 via-slate-900/30 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 cursor-pointer overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full -mr-48 -mt-48 group-hover:bg-blue-500/10 transition-all duration-500"></div>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Network Congestion</h3>
                            <p className="text-2xl font-black text-white">Load Analysis</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-xl">
                            🔥
                        </div>
                    </div>

                    {/* Main Metrics Row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Critical</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-red-500">{stats.critical}</span>
                                <span className="text-[10px] text-slate-500 mb-1">cells</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Warning</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-yellow-500">{stats.warning}</span>
                                <span className="text-[10px] text-slate-500 mb-1">cells</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Normal</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-green-500">{stats.normal}</span>
                                <span className="text-[10px] text-slate-500 mb-1">cells</span>
                            </div>
                        </div>
                    </div>

                    {/* Average Load Gauge */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase">Average NCI Score</span>
                            <span className={`text-lg font-black ${
                                parseFloat(stats.avgScore as any) >= 90 ? 'text-red-500' :
                                parseFloat(stats.avgScore as any) >= 70 ? 'text-yellow-500' :
                                'text-green-500'
                            }`}>
                                {stats.avgScore}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 border border-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${
                                    parseFloat(stats.avgScore as any) >= 90 ? 'bg-red-500' :
                                    parseFloat(stats.avgScore as any) >= 70 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`}
                                style={{ width: `${parseFloat(stats.avgScore as any)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Peak Load Info */}
                    {stats.topCongested && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Peak Congestion</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm font-black text-white">Terminal Node {stats.topCongested.cellId}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{stats.topCongested.totalActivity.toFixed(2)} Mbps</p>
                                </div>
                                <span className="text-2xl font-black text-red-500">{stats.maxScore}%</span>
                            </div>
                        </div>
                    )}

                    {/* Bottom CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {stats.total} Total Cells Monitored
                        </span>
                        <span className="text-[10px] font-bold text-blue-500 uppercase group-hover:translate-x-1 transition-transform">
                            View Details →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
