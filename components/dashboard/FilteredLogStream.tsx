'use client'

import React, { useState } from 'react'

interface LogEntry {
  id: string
  timestamp: Date
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'
  message: string
  source?: string
}

interface FilteredLogStreamProps {
  logs: LogEntry[]
  className?: string
  maxItems?: number
}

/**
 * Filtered Log Stream - Real-time system logs with level filtering
 */
export default function FilteredLogStream({
  logs,
  className = '',
  maxItems = 10
}: FilteredLogStreamProps) {
  const [filterLevel, setFilterLevel] = useState<LogEntry['level'] | 'ALL'>('ALL')
  const [autoScroll, setAutoScroll] = useState(true)

  const filteredLogs = logs
    .filter(log => filterLevel === 'ALL' || log.level === filterLevel)
    .slice(-maxItems)
    .reverse()

  const getLevelStyle = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return {
          bg: 'bg-red-900/50',
          text: 'text-red-300',
          border: 'border-red-500/30',
          icon: '🔴'
        }
      case 'WARN':
        return {
          bg: 'bg-orange-900/50',
          text: 'text-orange-300',
          border: 'border-orange-500/30',
          icon: '🟡'
        }
      case 'INFO':
        return {
          bg: 'bg-blue-900/50',
          text: 'text-blue-300',
          border: 'border-blue-500/30',
          icon: '🔵'
        }
      case 'DEBUG':
        return {
          bg: 'bg-slate-900/50',
          text: 'text-slate-300',
          border: 'border-slate-500/30',
          icon: '⚪'
        }
    }
  }

  const levelCounts = {
    ERROR: logs.filter(l => l.level === 'ERROR').length,
    WARN: logs.filter(l => l.level === 'WARN').length,
    INFO: logs.filter(l => l.level === 'INFO').length,
    DEBUG: logs.filter(l => l.level === 'DEBUG').length
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <span className="text-lg">📜</span> Logs Système
        </h3>
        
        {/* Auto-scroll toggle */}
        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="rounded"
          />
          <span className="text-slate-400">Auto-scroll</span>
        </label>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterLevel('ALL')}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-bold
            transition-all
            ${filterLevel === 'ALL'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900/70'
            }
          `}
        >
          TOUS ({logs.length})
        </button>
        {(['ERROR', 'WARN', 'INFO', 'DEBUG'] as const).map(level => {
          const style = getLevelStyle(level)
          return (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold
                transition-all
                ${filterLevel === level
                  ? `${style.bg} ${style.text}`
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900/70'
                }
              `}
            >
              {style.icon} {level} ({levelCounts[level]})
            </button>
          )
        })}
      </div>

      {/* Logs list */}
      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">
            Aucun log pour ce niveau
          </div>
        ) : (
          filteredLogs.map((log) => {
            const style = getLevelStyle(log.level)
            
            return (
              <div
                key={log.id}
                className={`
                  ${style.bg} border ${style.border}
                  rounded-lg p-3
                  hover:border-opacity-50 transition-all
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{style.icon}</span>
                    <span className={`text-xs font-black ${style.text} px-2 py-0.5 rounded ${style.bg}`}>
                      {log.level}
                    </span>
                    {log.source && (
                      <span className="text-xs text-slate-400">
                        [{log.source}]
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString('fr-FR')}
                  </span>
                </div>
                <p className={`text-sm ${style.text} leading-relaxed`}>
                  {log.message}
                </p>
              </div>
            )
          })
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-3 text-xs">
        <div className="text-center">
          <p className="text-red-400 font-bold text-lg">{levelCounts.ERROR}</p>
          <p className="text-slate-500">Errors</p>
        </div>
        <div className="text-center">
          <p className="text-orange-400 font-bold text-lg">{levelCounts.WARN}</p>
          <p className="text-slate-500">Warnings</p>
        </div>
        <div className="text-center">
          <p className="text-blue-400 font-bold text-lg">{levelCounts.INFO}</p>
          <p className="text-slate-500">Info</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 font-bold text-lg">{levelCounts.DEBUG}</p>
          <p className="text-slate-500">Debug</p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  )
}
