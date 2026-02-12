'use client'

import React from 'react'

interface ActionItem {
  id: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  assignee?: string
  deadline?: Date
  status: 'pending' | 'in-progress' | 'completed'
  category: string
}

interface ActionItemsProps {
  items: ActionItem[]
  className?: string
  onStatusChange?: (id: string, status: ActionItem['status']) => void
}

/**
 * Action Items - Task list with priorities and status tracking
 * Helps managers track follow-up actions from reports
 */
export default function ActionItems({
  items,
  className = '',
  onStatusChange
}: ActionItemsProps) {
  const getPriorityStyle = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high':
        return {
          badge: 'bg-red-500/20 text-red-400 border-red-500/50',
          icon: '🔴',
          label: 'HAUTE'
        }
      case 'medium':
        return {
          badge: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
          icon: '🟠',
          label: 'MOYENNE'
        }
      case 'low':
        return {
          badge: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
          icon: '🔵',
          label: 'BASSE'
        }
    }
  }

  const getStatusIcon = (status: ActionItem['status']) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'in-progress': return '⚡'
      case 'completed': return '✅'
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const pendingCount = items.filter(i => i.status === 'pending').length
  const inProgressCount = items.filter(i => i.status === 'in-progress').length
  const completedCount = items.filter(i => i.status === 'completed').length

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <span className="text-lg">📋</span> Actions à Suivre
        </h3>
        <div className="flex gap-3 text-xs">
          <span className="text-slate-400">
            <span className="font-bold text-orange-400">{pendingCount}</span> en attente
          </span>
          <span className="text-slate-400">
            <span className="font-bold text-blue-400">{inProgressCount}</span> en cours
          </span>
          <span className="text-slate-400">
            <span className="font-bold text-green-400">{completedCount}</span> terminées
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-slate-400 text-sm">Aucune action en cours</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {sortedItems.map((item) => {
            const priorityStyle = getPriorityStyle(item.priority)
            const statusIcon = getStatusIcon(item.status)
            const isCompleted = item.status === 'completed'

            return (
              <div
                key={item.id}
                className={`
                  bg-slate-900/50 border border-white/10
                  rounded-xl p-4
                  hover:bg-slate-900/70 hover:border-white/20
                  transition-all duration-200
                  ${isCompleted ? 'opacity-60' : ''}
                `}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-xl">{priorityStyle.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`
                        px-2 py-0.5 rounded text-[10px] font-black uppercase
                        border ${priorityStyle.badge}
                      `}>
                        {priorityStyle.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950/50 text-slate-400 border border-white/5">
                        {item.category}
                      </span>
                    </div>
                    
                    <h4 className={`text-sm font-bold ${
                      isCompleted ? 'text-slate-500 line-through' : 'text-white'
                    }`}>
                      {item.title}
                    </h4>
                    
                    <p className="text-xs text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 ml-9">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {item.assignee && (
                      <span>👤 {item.assignee}</span>
                    )}
                    {item.deadline && (
                      <span>
                        📅 {item.deadline.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    )}
                  </div>

                  {/* Status selector */}
                  <select
                    value={item.status}
                    onChange={(e) => onStatusChange?.(item.id, e.target.value as ActionItem['status'])}
                    className="px-2 py-1 rounded text-xs font-medium bg-slate-950/50 border border-white/10 text-white hover:border-white/20 transition-colors cursor-pointer"
                  >
                    <option value="pending">{getStatusIcon('pending')} En attente</option>
                    <option value="in-progress">{getStatusIcon('in-progress')} En cours</option>
                    <option value="completed">{getStatusIcon('completed')} Terminé</option>
                  </select>
                </div>
              </div>
            )
          })}
        </div>
      )}

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
