import React from 'react'

type PaddingSize = 'none' | 'sm' | 'md' | 'lg'

const paddingClasses: Record<PaddingSize, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

interface PanelProps {
  children: React.ReactNode
  className?: string
  padding?: PaddingSize
}

export function Panel({ children, className = '', padding = 'md' }: PanelProps) {
  return (
    <div
      className={`bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
