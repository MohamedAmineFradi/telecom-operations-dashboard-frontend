'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Keycloak from 'keycloak-js'

interface KeycloakContextType {
  keycloak: Keycloak | null
  authenticated: boolean
  loading: boolean
}

const KeycloakContext = createContext<KeycloakContextType>({
  keycloak: null,
  authenticated: false,
  loading: true,
})

export function useKeycloak() {
  return useContext(KeycloakContext)
}

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Development mode bypass
  const isDevelopment = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_KEYCLOAK_BYPASS !== 'false'

  useEffect(() => {
    if (isDevelopment && !process.env.NEXT_PUBLIC_KEYCLOAK_URL) {
      // Skip Keycloak in development if not configured
      console.warn('Keycloak not configured - running in development bypass mode')
      setAuthenticated(true)
      setLoading(false)
      return
    }

    const kc = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8081',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'telecom',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'dashboard-client',
    })

    kc.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    })
      .then((auth) => {
        setKeycloak(kc)
        setAuthenticated(auth)
        setLoading(false)

        // Token refresh
        setInterval(() => {
          kc.updateToken(70).catch(() => {
            console.error('Failed to refresh token')
          })
        }, 60000) // every minute
      })
      .catch((error) => {
        console.error('Keycloak init failed', error)
        if (isDevelopment) {
          // Allow development mode without Keycloak
          setAuthenticated(true)
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <p className="text-slate-400">Authentication required</p>
        </div>
      </div>
    )
  }

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, loading }}>
      {children}
    </KeycloakContext.Provider>
  )
}
