'use client'

import React, { useState } from 'react'

interface DateRange {
  start: Date
  end: Date
  label: string
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

const presets: DateRange[] = [
  {
    label: 'Dernières 24h',
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date()
  },
  {
    label: '7 derniers jours',
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  },
  {
    label: '30 derniers jours',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  },
  {
    label: 'Ce mois',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  },
  {
    label: 'Mois dernier',
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
  }
]

/**
 * Date Range Picker - Flexible date range selector with presets
 * Perfect for analytics and reporting views
 */
export default function DateRangePicker({
  value,
  onChange,
  className = ''
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // Use default value if value is undefined
  const currentValue = value || presets[0]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const handlePresetClick = (preset: DateRange) => {
    onChange(preset)
    setIsOpen(false)
  }

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onChange({
        label: 'Période personnalisée',
        start: new Date(customStart),
        end: new Date(customEnd)
      })
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          px-4 py-2 
          bg-slate-800/50 hover:bg-slate-700/50
          border border-white/10 hover:border-white/20
          rounded-lg
          text-sm font-medium text-white
          transition-all duration-200
          flex items-center gap-2
          min-w-[280px]
        "
      >
        <span className="text-lg">📅</span>
        <div className="flex-1 text-left">
          <div className="text-xs text-slate-400">{currentValue.label}</div>
          <div className="font-bold">
            {formatDate(currentValue.start)} - {formatDate(currentValue.end)}
          </div>
        </div>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 z-50 w-[400px] bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden">
            {/* Presets */}
            <div className="p-3 border-b border-white/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                Périodes rapides
              </h4>
              <div className="space-y-1">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetClick(preset)}
                    className={`
                      w-full px-3 py-2 text-left text-sm
                      rounded-lg transition-all
                      ${currentValue.label === preset.label
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                      }
                    `}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range */}
            <div className="p-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                Période personnalisée
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Date début
                  </label>
                  <input
                    type="date"
                    value={customStart || formatDateInput(currentValue.start)}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="
                      w-full px-3 py-2 
                      bg-slate-800 border border-white/10
                      rounded-lg text-sm text-white
                      focus:outline-none focus:border-blue-500
                    "
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Date fin
                  </label>
                  <input
                    type="date"
                    value={customEnd || formatDateInput(currentValue.end)}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="
                      w-full px-3 py-2 
                      bg-slate-800 border border-white/10
                      rounded-lg text-sm text-white
                      focus:outline-none focus:border-blue-500
                    "
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  className="
                    w-full px-4 py-2 mt-2
                    bg-blue-600 hover:bg-blue-700
                    text-white font-bold text-sm
                    rounded-lg transition-all
                  "
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
