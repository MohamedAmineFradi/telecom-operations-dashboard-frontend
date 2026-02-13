import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  rightSlot?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, rightSlot, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
        {description ? (
          <p className="text-slate-400 mt-2">{description}</p>
        ) : null}
      </div>
      {rightSlot ? <div className="flex items-center space-x-4">{rightSlot}</div> : null}
    </div>
  )
}
