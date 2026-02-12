'use client'

import { notFound } from 'next/navigation'
import DashboardByRole from '@/components/dashboard/DashboardByRole'
import { UserRole } from '@/lib/types'
import { useEffect, use } from 'react'
import { useRole } from '@/lib/role-context'
import { isValidRole } from '@/lib/roles'

interface DashboardRolePageProps {
  params: Promise<{
    role: string
  }>
}

export default function DashboardRolePage({ params }: DashboardRolePageProps) {
  const { role: contextRole, setRole } = useRole()
  const resolvedParams = use(params)
  const urlRole = resolvedParams.role

  // Validate the role from URL
  if (!isValidRole(urlRole)) {
    notFound()
  }

  // Sync URL role with context role
  useEffect(() => {
    if (contextRole !== urlRole) {
      setRole(urlRole)
    }
  }, [urlRole, contextRole, setRole])

  return <DashboardByRole role={urlRole} />
}
