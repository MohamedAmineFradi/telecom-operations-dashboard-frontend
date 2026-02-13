import React from 'react'
import { Panel } from './Panel'

type EmptyStateVariant = 'panel' | 'ghost'
type EmptyStatePadding = 'none' | 'sm' | 'md' | 'lg'

interface EmptyStateProps {
  message: string
  description?: string
  icon?: React.ReactNode
  className?: string
  messageClassName?: string
  descriptionClassName?: string
  variant?: EmptyStateVariant
  padding?: EmptyStatePadding
}

export function EmptyState({
  message,
  description,
  icon,
  className = '',
  messageClassName = 'text-slate-400',
  descriptionClassName = 'text-slate-500',
  variant = 'panel',
  padding = 'md',
}: EmptyStateProps) {
  const content = (
    <>
      {icon ? <div className="mb-3 flex justify-center">{icon}</div> : null}
      <div>
        <p className={messageClassName}>{message}</p>
        {description ? (
          <p className={descriptionClassName}>{description}</p>
        ) : null}
      </div>
    </>
  )

  if (variant === 'ghost') {
    return (
      <div className={`text-center ${className}`}>
        {content}
      </div>
    )
  }

  return (
    <Panel padding={padding} className={`rounded-lg text-center ${className}`}>
      {content}
    </Panel>
  )
}
