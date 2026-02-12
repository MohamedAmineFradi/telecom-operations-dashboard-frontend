'use client'

import React from 'react'

interface Service {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  uptime: number
  responseTime?: number
  lastCheck: Date
  icon: string
}

interface ServiceHealthIndicatorProps {
  services: Service[]
  className?: string
  onServiceClick?: (service: Service) => void
}

/**
 * Service Health Indicator - Shows status of system services
 * Displays API, Database, Keycloak, etc. health
 */
export default function ServiceHealthIndicator({
  services,
  className = '',
  onServiceClick
}: ServiceHealthIndicatorProps) {
  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'healthy': return {
        bg: 'bg-green-500',
        border: 'border-green-500',
        text: 'text-green-400',
        glow: 'shadow-green-500/50'
      }
      case 'degraded': return {
        bg: 'bg-orange-500',
        border: 'border-orange-500',
        text: 'text-orange-400',
        glow: 'shadow-orange-500/50'
      }
      case 'down': return {
        bg: 'bg-red-500',
        border: 'border-red-500',
        text: 'text-red-400',
        glow: 'shadow-red-500/50'
      }
    }
  }

  const getStatusLabel = (status: Service['status']) => {
    switch (status) {
      case 'healthy': return 'Opérationnel'
      case 'degraded': return 'Dégradé'
      case 'down': return 'Indisponible'
    }
  }

  const healthyCount = services.filter(s => s.status === 'healthy').length
  const degradedCount = services.filter(s => s.status === 'degraded').length
  const downCount = services.filter(s => s.status === 'down').length

  const overallStatus = downCount > 0 ? 'down' : degradedCount > 0 ? 'degraded' : 'healthy'
  const overallColors = getStatusColor(overallStatus)

  return (
    <div className={`bg-slate-800/20 border border-white/5 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black text-white uppercase">
          Santé des Services
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${overallColors.bg} rounded-full animate-pulse ${overallColors.glow} shadow-lg`}></div>
          <span className={`text-sm font-bold ${overallColors.text}`}>
            {getStatusLabel(overallStatus)}
          </span>
        </div>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {services.map((service, idx) => {
          const colors = getStatusColor(service.status)
          
          return (
            <div
              key={idx}
              onClick={() => onServiceClick?.(service)}
              className={`
                relative
                bg-slate-900/50 border-2 ${colors.border}
                rounded-xl p-4
                hover:bg-slate-900/70 hover:scale-105
                transition-all duration-200 cursor-pointer
                ${colors.glow} shadow-lg
              `}
            >
              {/* Status indicator */}
              <div className="absolute top-3 right-3">
                <div className={`w-3 h-3 ${colors.bg} rounded-full ${service.status === 'healthy' ? 'animate-pulse' : ''}`}></div>
              </div>

              {/* Icon */}
              <div className="text-3xl mb-2">{service.icon}</div>

              {/* Name */}
              <h4 className="text-sm font-bold text-white mb-1">
                {service.name}
              </h4>

              {/* Status */}
              <p className={`text-xs font-medium ${colors.text} mb-3`}>
                {getStatusLabel(service.status)}
              </p>

              {/* Metrics */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Uptime:</span>
                  <span className="text-white font-bold">{service.uptime.toFixed(1)}%</span>
                </div>
                {service.responseTime !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latence:</span>
                    <span className={`font-bold ${
                      service.responseTime < 100 ? 'text-green-400' :
                      service.responseTime < 300 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {service.responseTime}ms
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Vérif:</span>
                  <span className="text-slate-500 text-[10px]">
                    {service.lastCheck.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-slate-400 font-bold">Opérationnels</span>
          </div>
          <p className="text-2xl font-black text-green-400">{healthyCount}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-slate-400 font-bold">Dégradés</span>
          </div>
          <p className="text-2xl font-black text-orange-400">{degradedCount}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-slate-400 font-bold">Indisponibles</span>
          </div>
          <p className="text-2xl font-black text-red-400">{downCount}</p>
        </div>
      </div>
    </div>
  )
}
