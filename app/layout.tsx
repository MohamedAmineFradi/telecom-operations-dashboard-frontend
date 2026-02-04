'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { KeycloakProvider } from '@/lib/keycloak'
import { useState } from 'react'
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 min cache
        retry: 2
      }
    }
  }))

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-900 text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <QueryClientProvider client={queryClient}>
            <KeycloakProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                {children}
              </div>
            </KeycloakProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
