'use client'

import React, { useState, useEffect } from 'react'

interface FullScreenToggleProps {
  className?: string
  onToggle?: (isFullScreen: boolean) => void
}

/**
 * Full Screen Toggle Button
 * Enables/disables fullscreen mode for operator console
 */
export default function FullScreenToggle({
  className = '',
  onToggle
}: FullScreenToggleProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullscreen = Boolean(document.fullscreenElement)
      setIsFullScreen(fullscreen)
      onToggle?.(fullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullScreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
    }
  }, [onToggle])

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err)
    }
  }

  return (
    <button
      onClick={toggleFullScreen}
      className={`
        px-4 py-2
        bg-slate-800/50 hover:bg-slate-700/50
        border border-white/10 hover:border-white/20
        rounded-lg
        text-sm font-bold text-white
        transition-all duration-200
        flex items-center gap-2
        ${className}
      `}
      title={isFullScreen ? 'Quitter plein écran' : 'Mode plein écran'}
    >
      <span className="text-lg">
        {isFullScreen ? '⊡' : '⛶'}
      </span>
      <span className="hidden sm:inline">
        {isFullScreen ? 'Quitter' : 'Plein écran'}
      </span>
    </button>
  )
}
