'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
        isActive
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}

export default function Sidebar() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-xl">📡</span>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">NOC Dashboard</h2>
            <p className="text-xs text-slate-500">Milan Network</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">
            Network
          </h2>
          <div className="space-y-1">
            <NavLink href="/dashboard" icon="📊">Overview</NavLink>
            <NavLink href="/dashboard/heatmap" icon="🗺️">Heatmap</NavLink>
            <NavLink href="/dashboard/alerts" icon="🚨">Alerts</NavLink>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">
            Analytics
          </h2>
          <div className="space-y-1">
            <NavLink href="/dashboard/cells" icon="📈">Cells</NavLink>
            <NavLink href="/dashboard/mobility" icon="🔄">Mobility</NavLink>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 text-center">
          <p>System Status</p>
          <p className="text-green-400 font-medium mt-1">● All Systems Operational</p>
        </div>
      </div>
    </div>
  )
}
