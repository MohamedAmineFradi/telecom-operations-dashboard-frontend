'use client'

import React, { useState } from 'react'

interface Cell {
  id: string
  name: string
  zone?: string
  load?: number
}

interface CellSelectorProps {
  cells: Cell[]
  selectedCells: string[]
  onChange: (selectedIds: string[]) => void
  maxSelection?: number
  className?: string
}

/**
 * Cell Selector - Multi-select with search for comparing cells
 */
export default function CellSelector({
  cells,
  selectedCells,
  onChange,
  maxSelection = 5,
  className = ''
}: CellSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredCells = cells.filter(cell =>
    cell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cell.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cell.zone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleCell = (cellId: string) => {
    if (selectedCells.includes(cellId)) {
      onChange(selectedCells.filter(id => id !== cellId))
    } else if (selectedCells.length < maxSelection) {
      onChange([...selectedCells, cellId])
    }
  }

  const selectedCellsData = cells.filter(c => selectedCells.includes(c.id))

  return (
    <div className={`relative ${className}`}>
      {/* Selected cells display */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Cellules Sélectionnées ({selectedCells.length}/{maxSelection})
          </span>
          {selectedCells.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Effacer tout
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedCellsData.length === 0 ? (
            <span className="text-xs text-slate-500">Aucune cellule sélectionnée</span>
          ) : (
            selectedCellsData.map(cell => (
              <div
                key={cell.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/50 text-xs text-blue-300 font-medium"
              >
                <span>{cell.name}</span>
                <button
                  onClick={() => toggleCell(cell.id)}
                  className="hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Search and dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full flex items-center gap-2 px-4 py-2.5
            bg-slate-900/50 hover:bg-slate-900/70
            border border-white/10 hover:border-white/20
            rounded-lg
            transition-all duration-200
            text-left
          "
        >
          <span className="text-lg">🔍</span>
          <span className="text-sm text-slate-300 flex-1">
            Ajouter des cellules...
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
            <div className="
              absolute top-full left-0 right-0 mt-2 z-50
              bg-slate-900 border border-white/20
              rounded-xl shadow-2xl
              overflow-hidden
              max-h-96
            ">
              {/* Search input */}
              <div className="p-3 border-b border-white/10">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par ID, nom, zone..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950/50 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                  autoFocus
                />
              </div>

              {/* Cell list */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCells.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    Aucune cellule trouvée
                  </div>
                ) : (
                  filteredCells.map(cell => {
                    const isSelected = selectedCells.includes(cell.id)
                    const isDisabled = !isSelected && selectedCells.length >= maxSelection

                    return (
                      <button
                        key={cell.id}
                        onClick={() => !isDisabled && toggleCell(cell.id)}
                        disabled={isDisabled}
                        className={`
                          w-full flex items-center justify-between px-4 py-3
                          hover:bg-slate-800
                          transition-colors
                          ${isSelected ? 'bg-blue-600/20' : ''}
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center
                            ${isSelected 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-slate-600'
                            }
                          `}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="text-sm text-white font-medium">
                              {cell.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {cell.zone && `${cell.zone} • `}
                              {cell.load !== undefined && `Charge: ${cell.load.toFixed(1)}%`}
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
