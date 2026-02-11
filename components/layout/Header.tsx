'use client'

import { useKeycloak } from '@/lib/keycloak'
import { useRole } from '@/lib/role-context'
import { UserRole } from '@/lib/types'

function StatusBadge({ label, color }: { label: string; color: string }) {
  const colorClasses = {
    green: 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.2)]',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]',
    red: 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md transition-all hover:scale-105 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
      {label}
    </span>
  )
}

export default function Header() {
  const { keycloak } = useKeycloak()
  const { role, setRole } = useRole()

  const roles: { id: UserRole; label: string; icon: string }[] = [
    { id: 'director', label: 'Director', icon: '💎' },
    { id: 'network_engineer', label: 'Network Engineer', icon: '🔧' },
    { id: 'sys_admin', label: 'Sys Admin', icon: '🛡️' },
  ]

  return (
    <header className="bg-slate-800/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
              MILAN TELECOM NOC
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge label="Live" color="green" />
              <StatusBadge label="Milan" color="blue" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Role Selector */}
          <div className="flex items-center bg-slate-900/50 rounded-full p-1 border border-white/5 shadow-inner">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                title={r.label}
                className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${role === r.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
              >
                <span className="text-sm">{r.icon}</span>
              </button>
            ))}
            <span className="text-xs px-3 font-bold text-slate-400 uppercase tracking-widest border-l border-white/10 ml-1 hidden sm:block">
              {role.replace('_', ' ')}
            </span>
          </div>

          <div className="h-8 w-px bg-white/10"></div>

          <div className="flex items-center space-x-4">
            <div className="text-xs font-mono text-slate-500 hidden md:block">
              {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={() => keycloak?.logout()}
              className="px-4 py-2 text-xs font-bold bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all border border-white/5 hover:border-white/10 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
