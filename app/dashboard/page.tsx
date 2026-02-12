'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/lib/role-context'

export default function DashboardPage() {
  const router = useRouter()
  const { role } = useRole()

  useEffect(() => {
    // Redirect to the role-specific dashboard
    router.replace(`/dashboard/${role}`)
  }, [role, router])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-4 text-slate-400">Chargement du tableau de bord...</p>
      </div>
    </div>
  )
}
