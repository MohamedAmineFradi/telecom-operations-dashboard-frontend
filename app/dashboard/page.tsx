'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/lib/role-context'
import { LoadingState } from '@/components/ui'

export default function DashboardPage() {
  const router = useRouter()
  const { role } = useRole()

  useEffect(() => {
    // Redirect to the role-specific dashboard
    router.replace(`/dashboard/${role}`)
  }, [role, router])

  return (
    <LoadingState
      containerClassName="h-full"
      message="Chargement du tableau de bord..."
      spinnerVariant="ring"
      spinnerSize="md"
      spinnerClassName="mx-auto"
      messageClassName="mt-4 text-slate-400"
    />
  )
}
