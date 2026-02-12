'use client'

import React, { useState } from 'react'

type ComparisonPeriod = 'yesterday' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'custom'

interface PeriodComparatorProps {
  onChange: (current: { start: Date; end: Date }, comparison: { start: Date; end: Date }) => void
  className?: string
}

/**
 * Period Comparator - Allows comparing metrics between two time periods
 * Perfect for before/after analysis and trend comparison
 */
export default function PeriodComparator({
  onChange,
  className = ''
}: PeriodComparatorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ComparisonPeriod>('lastWeek')
  const [isOpen, setIsOpen] = useState(false)

  const periods: { value: ComparisonPeriod; label: string; icon: string }[] = [
    { value: 'yesterday', label: 'vs Hier', icon: '📅' },
    { value: 'lastWeek', label: 'vs Semaine dernière', icon: '📊' },
    { value: 'lastMonth', label: 'vs Mois dernier', icon: '📈' },
    { value: 'lastYear', label: 'vs Année dernière', icon: '📆' },
    { value: 'custom', label: 'Personnalisé', icon: '⚙️' }
  ]

  const handlePeriodSelect = (period: ComparisonPeriod) => {
    setSelectedPeriod(period)
    setIsOpen(false)

    const now = new Date()
    const current = {
      start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: now
    }

    let comparison = { start: new Date(), end: new Date() }

    switch (period) {
      case 'yesterday':
        comparison = {
          start: new Date(current.start.getTime() - 24 * 60 * 60 * 1000),
          end: new Date(current.end.getTime() - 24 * 60 * 60 * 1000)
        }
        break
      case 'lastWeek':
        comparison = {
          start: new Date(current.start.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: new Date(current.end.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
        break
      case 'lastMonth':
        comparison = {
          start: new Date(current.start.getTime() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(current.end.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
        break
      case 'lastYear':
        comparison = {
          start: new Date(current.start.getTime() - 365 * 24 * 60 * 60 * 1000),
          end: new Date(current.end.getTime() - 365 * 24 * 60 * 60 * 1000)
        }
        break
    }

    onChange(current, comparison)
  }

  const selectedPeriodData = periods.find(p => p.value === selectedPeriod)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/50 hover:bg-slate-900/70 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 shadow-lg min-w-[200px]"
      >
        <span className="text-lg">{selectedPeriodData?.icon}</span>
        <span className="text-sm text-white font-medium flex-1 text-left">
          {selectedPeriodData?.label}
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 z-50 bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-[250px]">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodSelect(period.value)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  hover:bg-slate-800
                  transition-colors
                  ${selectedPeriod === period.value ? 'bg-blue-600/20' : ''}
                `}
              >
                <span className="text-lg">{period.icon}</span>
                <span className="text-sm text-white font-medium">
                  {period.label}
                </span>
                {selectedPeriod === period.value && (
                  <span className="ml-auto text-blue-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
