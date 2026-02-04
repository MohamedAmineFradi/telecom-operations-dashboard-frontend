'use client'

import { useKeycloak } from '@/lib/keycloak'

function StatusBadge({ label, color }: { label: string; color: string }) {
  const colorClasses = {
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
      {label}
    </span>
  )
}

export default function Header() {
  const { keycloak } = useKeycloak()

  return (
    <header className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Milan Telecom NOC
          </h1>
          <div className="flex space-x-2">
            <StatusBadge label="Live" color="green" />
            <StatusBadge label="250 cells" color="blue" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-400">
            {new Date().toLocaleString()}
          </div>
          <button
            onClick={() => keycloak?.logout()}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
