import React from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-slate-200 mb-4">{title}</h2>
      {description ? (
        <p className="text-slate-400 mt-2">{description}</p>
      ) : null}
    </div>
  )
}
