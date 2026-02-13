import React from 'react'
import { Panel } from '@/components/ui/Panel'

interface EmptyStateProps {
  message: string
  icon?: React.ReactNode
  className?: string
  messageClassName?: string
}

export function EmptyState({
  message,
  icon,
  className = '',
  messageClassName = 'text-slate-400',
}: EmptyStateProps) {
  return (
    <Panel padding="none" className={`rounded-lg p-8 text-center ${className}`}>
      {icon ? <div className="mb-3 flex justify-center">{icon}</div> : null}
      <p className={messageClassName}>{message}</p>
    </Panel>
  )
}
