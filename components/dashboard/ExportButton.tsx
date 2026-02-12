'use client'

import React, { useState } from 'react'

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'png'

interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>
  className?: string
  disabled?: boolean
}

/**
 * Export Button - Multi-format export dropdown
 * Supports PDF, Excel, CSV, and PNG exports
 */
export default function ExportButton({
  onExport,
  className = '',
  disabled = false
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [currentFormat, setCurrentFormat] = useState<ExportFormat | null>(null)

  const formats: { value: ExportFormat; label: string; icon: string; description: string }[] = [
    { 
      value: 'pdf', 
      label: 'Rapport PDF', 
      icon: '📄',
      description: 'Document complet avec graphiques'
    },
    { 
      value: 'excel', 
      label: 'Fichier Excel', 
      icon: '📊',
      description: 'Données tabulaires et graphiques'
    },
    { 
      value: 'csv', 
      label: 'Fichier CSV', 
      icon: '📋',
      description: 'Données brutes pour analyse'
    },
    { 
      value: 'png', 
      label: 'Image PNG', 
      icon: '🖼️',
      description: 'Capture visuelle du dashboard'
    }
  ]

  const handleExport = async (format: ExportFormat) => {
    setIsOpen(false)
    setIsExporting(true)
    setCurrentFormat(format)

    try {
      await onExport(format)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setCurrentFormat(null)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        className={`
          flex items-center gap-2 px-4 py-2.5
          bg-gradient-to-r from-blue-600 to-blue-500
          hover:from-blue-500 hover:to-blue-400
          disabled:from-slate-700 disabled:to-slate-600
          text-white text-sm font-bold
          rounded-lg
          transition-all duration-200
          shadow-lg shadow-blue-500/20
          hover:shadow-blue-500/40
          disabled:shadow-none
          disabled:cursor-not-allowed
          ${isExporting ? 'animate-pulse' : ''}
        `}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Export en cours...</span>
          </>
        ) : (
          <>
            <span className="text-lg">⬇️</span>
            <span>Exporter</span>
            <svg
              className={`w-4 h-4 transition-transform ${
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
          </>
        )}
      </button>

      {isOpen && !isExporting && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 z-50 bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden min-w-[280px]">
            <div className="p-2">
              <div className="text-xs text-slate-400 font-bold uppercase px-3 py-2">
                Choisir le format
              </div>
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => handleExport(format.value)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <span className="text-2xl">{format.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium mb-0.5">
                      {format.label}
                    </div>
                    <div className="text-xs text-slate-400">
                      {format.description}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 p-3 bg-slate-950/50">
              <p className="text-xs text-slate-500 text-center">
                Les exports incluent les données de la période sélectionnée
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
