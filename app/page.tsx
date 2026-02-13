'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useKeycloak } from '@/lib/keycloak'
import { LoadingState } from '@/components/ui/LoadingState'

export default function Home() {
  const router = useRouter()
  const { authenticated, loading } = useKeycloak()

  useEffect(() => {
    if (!loading && authenticated) {
      router.push('/dashboard')
    }
  }, [authenticated, loading, router])

  if (loading) {
    return (
      <LoadingState
        fullScreen
        message="Loading..."
        spinnerSize="xl"
        spinnerVariant="primary"
        spinnerClassName="mx-auto mb-6"
        messageClassName="text-slate-400 text-lg"
      />
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-2xl px-8">
        <div className="mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📡</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Milan Telecom NOC
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Network Operations Center Dashboard
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-slate-200 mb-4">Welcome</h2>
          <p className="text-slate-400 mb-6">
            Real-time monitoring and analytics for the Milan telecom network.
            Visualize traffic patterns, detect anomalies, and optimize network performance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-slate-900 rounded-lg">
              <div className="text-blue-400 font-semibold mb-1">250+ Cells</div>
              <div className="text-slate-500">Network Coverage</div>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <div className="text-purple-400 font-semibold mb-1">Real-time</div>
              <div className="text-slate-500">Live Monitoring</div>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <div className="text-green-400 font-semibold mb-1">AI-Powered</div>
              <div className="text-slate-500">Anomaly Detection</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-8">
          Authenticating... You will be redirected to the dashboard.
        </p>
      </div>
    </div>
  )
}
