'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/lib/role-context'

function NavLink({
  href,
  icon,
  children
}: {
  href: string
  icon: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
        : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
        }`}
    >
      <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className="font-semibold tracking-wide text-sm">{children}</span>
    </Link>
  )
}

export default function Sidebar() {
  const { permissions } = useRole()

  return (
    <div className="h-full flex flex-col bg-slate-900/40 backdrop-blur-xl">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/20 ring-1 ring-white/10">
            <span className="text-2xl">⚡</span>
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tighter uppercase">NOC Core</h2>
            <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase opacity-70">Station v2.4</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        {permissions.canViewTraffic && (
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
              Surveillance
            </h2>
            <div className="space-y-1">
              <NavLink href="/dashboard" icon="📊">Overview</NavLink>
              <NavLink href="/dashboard/heatmap" icon="🗺️">Heatmap</NavLink>
              {permissions.canViewCongestion && (
                <NavLink href="/dashboard/congestion" icon="🔥">Congestion</NavLink>
              )}
            </div>
          </div>
        )}

        {(permissions.canViewMobility || !!permissions.canViewTraffic) && (
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
              Intelligence
            </h2>
            <div className="space-y-1">
              <NavLink href="/dashboard/cells" icon="📡">Cell Analytics</NavLink>
              {permissions.canViewMobility && (
                <NavLink href="/dashboard/mobility" icon="🔄">Mobility Flow</NavLink>
              )}
              <NavLink href="/dashboard/services" icon="🧪">Services</NavLink>
            </div>
          </div>
        )}

        {permissions.canViewAlerts && (
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
              Incidents
            </h2>
            <div className="space-y-1">
              <NavLink href="/dashboard/alerts" icon="🚨">Live Alerts</NavLink>
            </div>
          </div>
        )}
      </nav>

      <div className="p-6 border-t border-white/5 bg-slate-950/20">
        <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 shadow-inner">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-2">Systems</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter">Operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}
