'use client'

import { UserRole } from '@/lib/types'
import { ReactNode, use } from 'react'

interface DashboardRoleLayoutProps {
  children: ReactNode
  params: Promise<{
    role: string
  }>
}

// Role-specific layout configurations
const layoutConfig: Record<UserRole, {
  title: string
  description: string
  headerClass: string
}> = {
  director: {
    title: 'TABLEAU DE BORD DIRECTEUR',
    description: 'Vue Exécutive - Opérations Milan',
    headerClass: 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30'
  },
  network_engineer: {
    title: 'CONSOLE INGÉNIEUR RÉSEAU',
    description: 'Surveillance & Optimisation Technique',
    headerClass: 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/30'
  },
  sys_admin: {
    title: 'ADMINISTRATION SYSTÈME',
    description: 'Gestion Infrastructure & Incidents',
    headerClass: 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-500/30'
  },
  network_operator: {
    title: 'OPÉRATIONS RÉSEAU',
    description: 'Monitoring & Interventions',
    headerClass: 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30'
  },
  performance_engineer: {
    title: 'PERFORMANCE & ANALYTIQUE',
    description: 'Optimisation & Recommandations',
    headerClass: 'bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-yellow-500/30'
  },
  operations_manager: {
    title: 'GESTION OPÉRATIONS',
    description: 'Coordination & Supervision',
    headerClass: 'bg-gradient-to-r from-indigo-900/20 to-violet-900/20 border-indigo-500/30'
  }
}

export default function DashboardRoleLayout({ children, params }: DashboardRoleLayoutProps) {
  const resolvedParams = use(params)
  const role = resolvedParams.role as UserRole
  const config = layoutConfig[role] || layoutConfig.director

  return (
    <div className="space-y-6">
      {/* Role-specific header */}
      <div className={`${config.headerClass} border rounded-2xl p-6 backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">{config.title}</h1>
            <p className="text-sm text-slate-400 mt-2">{config.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase font-bold">Rôle Actif</div>
            <div className="text-lg font-bold text-white mt-1 capitalize">
              {role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      {children}
    </div>
  )
}
