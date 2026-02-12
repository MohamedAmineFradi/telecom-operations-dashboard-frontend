import { UserRole } from './types'

/**
 * Valid user roles in the system
 */
export const VALID_ROLES: UserRole[] = [
  'director',
  'network_engineer',
  'sys_admin',
  'network_operator',
  'performance_engineer',
  'operations_manager'
]

/**
 * Role metadata for display and navigation
 */
export const ROLE_CONFIG: Record<UserRole, {
  id: UserRole
  label: string
  icon: string
  description: string
  path: string
  color: string
}> = {
  director: {
    id: 'director',
    label: 'Directeur',
    icon: '💎',
    description: 'Vue Exécutive - Opérations Milan',
    path: '/dashboard/director',
    color: 'purple'
  },
  network_engineer: {
    id: 'network_engineer',
    label: 'Ingénieur Réseau',
    icon: '🔧',
    description: 'Surveillance & Optimisation Technique',
    path: '/dashboard/network_engineer',
    color: 'blue'
  },
  sys_admin: {
    id: 'sys_admin',
    label: 'Administrateur Système',
    icon: '🛡️',
    description: 'Gestion Infrastructure & Incidents',
    path: '/dashboard/sys_admin',
    color: 'red'
  },
  network_operator: {
    id: 'network_operator',
    label: 'Opérateur Réseau',
    icon: '📡',
    description: 'Monitoring & Interventions',
    path: '/dashboard/network_operator',
    color: 'green'
  },
  performance_engineer: {
    id: 'performance_engineer',
    label: 'Ingénieur Performance',
    icon: '📊',
    description: 'Optimisation & Recommandations',
    path: '/dashboard/performance_engineer',
    color: 'yellow'
  },
  operations_manager: {
    id: 'operations_manager',
    label: 'Manager Opérations',
    icon: '📋',
    description: 'Coordination & Supervision',
    path: '/dashboard/operations_manager',
    color: 'indigo'
  }
}

/**
 * Check if a string is a valid role
 */
export function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole)
}

/**
 * Get the dashboard path for a role
 */
export function getRoleDashboardPath(role: UserRole): string {
  return ROLE_CONFIG[role].path
}

/**
 * Get role configuration
 */
export function getRoleConfig(role: UserRole) {
  return ROLE_CONFIG[role]
}

/**
 * Get all roles for display
 */
export function getAllRoles() {
  return VALID_ROLES.map(role => ROLE_CONFIG[role])
}
