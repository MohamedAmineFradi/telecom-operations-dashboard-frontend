import { Metadata } from 'next'
import { UserRole } from '@/lib/types'
import { ROLE_CONFIG, isValidRole } from '@/lib/roles'

/**
 * Generate dynamic metadata for role-specific dashboard pages
 */
export function generateRoleMetadata(role: string): Metadata {
  if (!isValidRole(role)) {
    return {
      title: 'Dashboard Not Found',
      description: 'The requested dashboard role does not exist.'
    }
  }

  const config = ROLE_CONFIG[role as UserRole]

  return {
    title: `${config.label} - Milan Telecom NOC`,
    description: config.description,
    keywords: ['telecom', 'dashboard', 'milan', config.label.toLowerCase()],
    openGraph: {
      title: `${config.label} Dashboard`,
      description: config.description,
      type: 'website',
    }
  }
}
