'use client'

import Link from 'next/link'
import { getAllRoles } from '@/lib/roles'

export default function NotFound() {
  const roles = getAllRoles()

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center space-y-6 p-8 max-w-2xl">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-black text-white">Rôle Non Trouvé</h1>
        <p className="text-slate-400 text-lg">
          Le rôle demandé n'existe pas dans le système.
        </p>
        
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Rôles Disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={role.path}
                className="p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <p className="text-sm font-bold text-white">{role.label}</p>
                <p className="text-xs text-slate-500 mt-1">{role.id}</p>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all mt-6"
        >
          Retour au Dashboard
        </Link>
      </div>
    </div>
  )
}
