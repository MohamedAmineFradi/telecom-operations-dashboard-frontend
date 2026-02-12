'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface CriticalAlertBannerProps {
  criticalCount: number
  warningCount: number
  message?: string
  actionLink?: string
  enableSound?: boolean
  className?: string
}

/**
 * Critical Alert Banner - Animated banner with optional sound for critical alerts
 * Designed for 24/7 operator console
 */
export default function CriticalAlertBanner({
  criticalCount,
  warningCount,
  message,
  actionLink = '/dashboard/alerts',
  enableSound = true,
  className = ''
}: CriticalAlertBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const previousCriticalCount = useRef(criticalCount)

  useEffect(() => {
    setIsVisible(criticalCount > 0)

    // Play sound when new critical alert arrives
    if (enableSound && soundEnabled && criticalCount > previousCriticalCount.current) {
      playAlertSound()
    }

    previousCriticalCount.current = criticalCount
  }, [criticalCount, enableSound, soundEnabled])

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn('Could not play alert sound:', err)
      })
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
  }

  if (!isVisible) {
    return null
  }

  return (
    <>
      {/* Hidden audio element */}
      {enableSound && (
        <audio
          ref={audioRef}
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCp+zPDTgjMGHm7A7+OZTRQNUZ"
          preload="auto"
        />
      )}

      <div
        className={`
          w-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500
          border-2 border-red-400/60
          rounded-2xl p-6 shadow-2xl shadow-red-500/50
          animate-pulse
          ${className}
        `}
      >
        <div className="flex items-center gap-4">
          {/* Animated Icon */}
          <div className="text-5xl animate-bounce">
            🚨
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-wide">
              Alerte Critique Système
            </h3>
            <p className="text-sm text-red-100 mt-1 font-medium">
              {message || `${criticalCount} zone${criticalCount > 1 ? 's' : ''} en état critique - Intervention immédiate requise`}
            </p>
            
            {warningCount > 0 && (
              <p className="text-xs text-red-200 mt-2 opacity-90">
                + {warningCount} zone{warningCount > 1 ? 's' : ''} en alerte
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Link href={actionLink}>
                <button className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-lg transition-all text-sm border border-white/20 hover:border-white/40">
                  📍 Localiser zones
                </button>
              </Link>
              
              <Link href="/dashboard/alerts">
                <button className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-lg transition-all text-sm border border-white/20 hover:border-white/40">
                  📋 Détails incidents
                </button>
              </Link>

              {enableSound && (
                <button
                  onClick={toggleSound}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all text-sm border border-white/20"
                  title={soundEnabled ? 'Désactiver son' : 'Activer son'}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
              )}
            </div>
          </div>

          {/* Critical Count Badge */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[120px]">
            <span className="text-xs text-red-100 font-bold uppercase mb-1">
              Critiques
            </span>
            <span className="text-5xl font-black text-white leading-none">
              {criticalCount}
            </span>
            <span className="text-xs text-red-200 mt-1">
              zone{criticalCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
