'use client'

import React from 'react';

interface ProvinceFlowCardProps {
    name: string;
    code: string;
    inflow: number;
    outflow: number;
    score: number;
    onClick?: () => void;
    selected?: boolean;
}

export default function ProvinceFlowCard({
    name,
    code,
    inflow,
    outflow,
    score,
    onClick,
    selected
}: ProvinceFlowCardProps) {
    const maxFlow = Math.max(inflow, outflow, 100);

    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-3xl border transition-all duration-500 cursor-pointer group hover:scale-[1.02] ${selected
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-900/10'
                    : 'bg-slate-800/20 border-white/5 hover:border-white/10 hover:bg-slate-800/30'
                }`}
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter">{name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{code} REGION</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${score > 80 ? 'bg-red-500/20 text-red-400' :
                        score > 50 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                    }`}>
                    {score.toFixed(0)}
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <span>Inflow</span>
                        <span className="text-white">{inflow.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(inflow / maxFlow) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <span>Outflow</span>
                        <span className="text-white">{outflow.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(outflow / maxFlow) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-blue-500 uppercase">View Grid Details</span>
                <span className="text-xs">→</span>
            </div>
        </div>
    );
}
