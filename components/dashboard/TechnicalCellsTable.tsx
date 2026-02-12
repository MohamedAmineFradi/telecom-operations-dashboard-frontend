'use client'

import React, { useState } from 'react'

interface TechnicalCellData {
  cellId: string
  zone: string
  rsrp: number // Signal strength (dBm)
  sinr: number // Signal quality (dB)
  throughput: number // Mbps
  load: number // %
  users: number
  status: 'good' | 'warning' | 'critical'
}

interface TechnicalCellsTableProps {
  cells: TechnicalCellData[]
  className?: string
  onCellClick?: (cellId: string) => void
}

type SortField = keyof TechnicalCellData
type SortDirection = 'asc' | 'desc'

/**
 * Technical Cells Table - Sortable table with RF metrics
 */
export default function TechnicalCellsTable({
  cells,
  className = '',
  onCellClick
}: TechnicalCellsTableProps) {
  const [sortField, setSortField] = useState<SortField>('load')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredCells = cells.filter(cell => {
    if (filterStatus === 'all') return true
    return cell.status === filterStatus
  })

  const sortedCells = [...filteredCells].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return 0
  })

  const getStatusColor = (status: TechnicalCellData['status']) => {
    switch (status) {
      case 'good': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
    }
  }

  const getStatusIcon = (status: TechnicalCellData['status']) => {
    switch (status) {
      case 'good': return '✓'
      case 'warning': return '⚠'
      case 'critical': return '✕'
    }
  }

  const getRsrpColor = (rsrp: number) => {
    if (rsrp >= -80) return 'text-green-400'
    if (rsrp >= -100) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSinrColor = (sinr: number) => {
    if (sinr >= 20) return 'text-green-400'
    if (sinr >= 10) return 'text-yellow-400'
    return 'text-red-400'
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-slate-600">⇅</span>
    }
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>
  }

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-white uppercase">
          Métriques Techniques RF
        </h3>
        
        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'good', 'warning', 'critical'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold uppercase
                transition-all
                ${filterStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-900/70'
                }
              `}
            >
              {status === 'all' ? 'Tous' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th
                onClick={() => handleSort('cellId')}
                className="text-left p-3 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
              >
                Cell ID <SortIcon field="cellId" />
              </th>
              <th
                onClick={() => handleSort('zone')}
                className="text-left p-3 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
              >
                Zone <SortIcon field="zone" />
              </th>
              <th
                onClick={() => handleSort('rsrp')}
                className="text-right p-3 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
              >
                RSRP (dBm) <SortIcon field="rsrp" />
              </th>
              <th
                onClick={() => handleSort('sinr')}
                className="text-right p-3 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
              >
                SINR (dB) <SortIcon field="sinr" />
              </th>
              <th
                onClick={() => handleSort('throughput')}
                className="text-right p-3 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
              >
                Débit (Mbps) <SortIcon field="throughput" />
              </th>
              <th
                onClick={() => handleSort('load')}
                className="text-right p-3 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
              >
                Charge (%) <SortIcon field="load" />
              </th>
              <th
                onClick={() => handleSort('users')}
                className="text-right p-3 text-xs font-black text-slate-400 uppercase cursor-pointer hover:text-white transition-colors"
              >
                Users <SortIcon field="users" />
              </th>
              <th className="text-center p-3 text-xs font-black text-slate-400 uppercase">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCells.map((cell, idx) => (
              <tr
                key={cell.cellId}
                onClick={() => onCellClick?.(cell.cellId)}
                className={`
                  border-b border-white/5 hover:bg-slate-900/50 cursor-pointer transition-colors
                  ${idx % 2 === 0 ? 'bg-slate-900/20' : ''}
                `}
              >
                <td className="p-3">
                  <span className="font-bold text-white">{cell.cellId}</span>
                </td>
                <td className="p-3">
                  <span className="text-slate-300">{cell.zone}</span>
                </td>
                <td className="p-3 text-right">
                  <span className={`font-bold ${getRsrpColor(cell.rsrp)}`}>
                    {cell.rsrp}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <span className={`font-bold ${getSinrColor(cell.sinr)}`}>
                    {cell.sinr.toFixed(1)}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <span className="text-blue-400 font-bold">
                    {cell.throughput.toFixed(1)}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          cell.load >= 90 ? 'bg-red-500' :
                          cell.load >= 70 ? 'bg-orange-500' :
                          cell.load >= 50 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${cell.load}%` }}
                      />
                    </div>
                    <span className={`font-bold ${
                      cell.load >= 90 ? 'text-red-400' :
                      cell.load >= 70 ? 'text-orange-400' :
                      'text-white'
                    }`}>
                      {cell.load.toFixed(0)}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <span className="text-slate-400">{cell.users}</span>
                </td>
                <td className="p-3 text-center">
                  <span className={`text-lg ${getStatusColor(cell.status)}`}>
                    {getStatusIcon(cell.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedCells.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            Aucune cellule ne correspond aux filtres
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-4 text-xs">
        <div className="text-center">
          <p className="text-slate-500 mb-1">Total</p>
          <p className="text-lg font-bold text-white">{sortedCells.length}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 mb-1">RSRP Moyen</p>
          <p className="text-lg font-bold text-green-400">
            {(sortedCells.reduce((sum, c) => sum + c.rsrp, 0) / sortedCells.length).toFixed(0)} dBm
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 mb-1">SINR Moyen</p>
          <p className="text-lg font-bold text-yellow-400">
            {(sortedCells.reduce((sum, c) => sum + c.sinr, 0) / sortedCells.length).toFixed(1)} dB
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 mb-1">Charge Moyenne</p>
          <p className="text-lg font-bold text-blue-400">
            {(sortedCells.reduce((sum, c) => sum + c.load, 0) / sortedCells.length).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  )
}
