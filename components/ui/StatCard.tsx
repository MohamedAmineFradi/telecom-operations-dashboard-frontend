import React from 'react'
import { Panel } from '@/components/ui/Panel'

type StatColor = 'red' | 'orange' | 'yellow' | 'blue' | 'green' | 'slate'
type StatVariant = 'tinted' | 'panel'

const tintedClasses: Record<StatColor, { container: string; text: string }> = {
  red: {
    container: 'bg-red-500/10 border border-red-500/30',
    text: 'text-red-400',
  },
  orange: {
    container: 'bg-orange-500/10 border border-orange-500/30',
    text: 'text-orange-400',
  },
  yellow: {
    container: 'bg-yellow-500/10 border border-yellow-500/30',
    text: 'text-yellow-400',
  },
  blue: {
    container: 'bg-blue-500/10 border border-blue-500/30',
    text: 'text-blue-400',
  },
  green: {
    container: 'bg-green-500/10 border border-green-500/30',
    text: 'text-green-400',
  },
  slate: {
    container: 'bg-slate-500/10 border border-slate-500/30',
    text: 'text-slate-300',
  },
}

const panelValueClasses: Record<StatColor, string> = {
  red: 'text-red-400',
  orange: 'text-orange-400',
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  slate: 'text-slate-100',
}

interface StatCardProps {
  label: string
  value: React.ReactNode
  color?: StatColor
  variant?: StatVariant
  className?: string
}

export function StatCard({
  label,
  value,
  color = 'slate',
  variant = 'panel',
  className = '',
}: StatCardProps) {
  if (variant === 'tinted') {
    const colorConfig = tintedClasses[color]
    return (
      <div className={`rounded-lg p-4 ${colorConfig.container} ${className}`}>
        <p className={`text-xs font-semibold uppercase mb-1 ${colorConfig.text}`}>
          {label}
        </p>
        <p className={`text-2xl font-bold ${colorConfig.text}`}>{value}</p>
      </div>
    )
  }

  return (
    <Panel className={className}>
      <h3 className="text-sm font-medium text-slate-400 mb-1">{label}</h3>
      <p className={`text-3xl font-bold ${panelValueClasses[color]}`}>{value}</p>
    </Panel>
  )
}
